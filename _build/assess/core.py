"""题库数据结构、区间运算、矩阵消元与验算。"""
from __future__ import annotations

import math
import random
import re
from dataclasses import dataclass, field
from fractions import Fraction

import sympy as sp

x = sp.symbols("x")
y = sp.symbols("y")
t = sp.symbols("t")
n = sp.symbols("n", integer=True, positive=True)


def inline(s: str) -> str:
    return r"\(" + s + r"\)"


def _tex_cleanup(s: str) -> str:
    s = s.replace(r"\left", "").replace(r"\right", "")
    s = s.replace(r"\log", r"\ln")
    s = s.replace(r"\operatorname{atan}", r"\arctan")
    return s


def ntex(e) -> str:
    e = sp.simplify(sp.sympify(e))
    if e == sp.oo:
        return r"+\infty"
    if e == -sp.oo:
        return r"-\infty"
    return _tex_cleanup(sp.latex(e))


def stex(e) -> str:
    """按构造顺序排版，不把和式并成一个大分式。"""
    e = sp.sympify(e)
    if e == sp.oo:
        return r"+\infty"
    if e == -sp.oo:
        return r"-\infty"
    return _tex_cleanup(sp.latex(e))


def ftex(fr: Fraction, dfrac: bool = False) -> str:
    fr = Fraction(fr.numerator, fr.denominator)
    if fr.denominator == 1:
        return str(fr.numerator)
    cmd = "dfrac" if dfrac else "frac"
    num, den = fr.numerator, fr.denominator
    if num < 0:
        return rf"-\{cmd}{{{abs(num)}}}{{{den}}}"
    return rf"\{cmd}{{{num}}}{{{den}}}"


def pct_tex(fr: Fraction) -> str:
    fr = Fraction(fr)
    p = fr * 100
    if p.denominator == 1:
        return rf"{p.numerator}\%"
    if p.denominator <= 2:
        return rf"{ftex(p)}\%"
    return ftex(fr)


def norm(s: str) -> str:
    return re.sub(r"\s+", "", s)


def key_of(v) -> str:
    if isinstance(v, str):
        return norm(v)
    return norm(ntex(v))


def show_of(v) -> str:
    if isinstance(v, str):
        return v
    return ntex(v)


@dataclass
class MCQ:
    stem: str
    choices: list[str]
    answer: int
    explain: str
    topic: str


@dataclass
class HW:
    stem: str
    steps: list[str]
    answer: str
    space: str = "2.8cm"


@dataclass
class Paper:
    code: str
    title: str
    filename: str
    mcqs: list[MCQ]
    hws: list[HW]
    quiz_columns: int = 2


class Bag:
    def __init__(self, seed: int):
        self.rng = random.Random(seed)
        self.mcqs: list[MCQ] = []
        self.hws: list[HW] = []
        self._stems: set[str] = set()
        self._hw: set[str] = set()

    def make_mcq(self, stem: str, correct, distractors, explain: str, topic: str) -> MCQ | None:
        pool = []
        seen = set()
        for v in [correct, *distractors]:
            k = key_of(v)
            if not k or k in seen:
                continue
            seen.add(k)
            pool.append(v)
        if len(pool) < 4:
            return None
        pool = pool[:4]
        order = [0, 1, 2, 3]
        self.rng.shuffle(order)
        choices = [show_of(pool[i]) for i in order]
        if len({norm(c) for c in choices}) < 4:
            return None
        if not stem.strip() or not explain.strip():
            return None
        return MCQ(stem, choices, order.index(0), explain, topic)

    def add_mcq(self, q: MCQ | None) -> bool:
        if q is None:
            return False
        k = norm(q.stem)
        if k in self._stems:
            return False
        if not (0 <= q.answer < 4) or len(q.choices) != 4:
            return False
        if len({norm(c) for c in q.choices}) < 4:
            return False
        self._stems.add(k)
        self.mcqs.append(q)
        return True

    def fill(self, name: str, producer, n: int, tries_factor: int = 60) -> None:
        got = 0
        tries = 0
        limit = max(n * tries_factor, 200)
        while got < n and tries < limit:
            tries += 1
            q = producer()
            if self.add_mcq(q):
                got += 1
        if got < n:
            raise RuntimeError(f"{name} 只生成了 {got}/{n}（尝试 {tries} 次）")

    def add_hw(self, hw: HW | None) -> bool:
        if hw is None or not hw.steps or not hw.stem.strip() or not hw.answer.strip():
            return False
        k = norm(hw.stem)
        if k in self._hw:
            return False
        self._hw.add(k)
        self.hws.append(hw)
        return True

    def fill_hw(self, name: str, producer, tries: int = 30) -> None:
        for _ in range(tries):
            if self.add_hw(producer()):
                return
        raise RuntimeError(f"作业题失败：{name}")


class Iv:
    def __init__(self, lo, loc: bool, hi, hic: bool):
        self.lo = sp.sympify(lo)
        self.hi = sp.sympify(hi)
        self.loc = bool(loc) and self.lo != -sp.oo
        self.hic = bool(hic) and self.hi != sp.oo
        self.empty = self.lo > self.hi or (self.lo == self.hi and not (self.loc and self.hic))

    def contains(self, t) -> bool:
        if self.empty:
            return False
        t = sp.sympify(t)
        if t < self.lo or t > self.hi:
            return False
        if t == self.lo:
            return self.loc
        if t == self.hi:
            return self.hic
        return True

    def intersection(self, other: "Iv") -> "Iv | None":
        if self.lo != other.lo:
            lo, loc = (self.lo, self.loc) if self.lo > other.lo else (other.lo, other.loc)
        else:
            lo, loc = self.lo, self.loc and other.loc
        if self.hi != other.hi:
            hi, hic = (self.hi, self.hic) if self.hi < other.hi else (other.hi, other.hic)
        else:
            hi, hic = self.hi, self.hic and other.hic
        iv = Iv(lo, loc, hi, hic)
        return None if iv.empty else iv

    def key(self):
        return (str(self.lo), self.loc, str(self.hi), self.hic)


def merge(ivs: list[Iv]) -> list[Iv]:
    ivs = sorted((i for i in ivs if not i.empty), key=lambda z: (z.lo, not z.loc))
    if not ivs:
        return []
    cur = ivs[0]
    out = []
    for nxt in ivs[1:]:
        touch = nxt.lo < cur.hi or (nxt.lo == cur.hi and (nxt.loc or cur.hic))
        if touch:
            if nxt.hi > cur.hi:
                cur = Iv(cur.lo, cur.loc, nxt.hi, nxt.hic)
            elif nxt.hi == cur.hi:
                cur = Iv(cur.lo, cur.loc, cur.hi, cur.hic or nxt.hic)
        else:
            out.append(cur)
            cur = nxt
    out.append(cur)
    return out


def inter_sets(a: list[Iv], b: list[Iv]) -> list[Iv]:
    out = []
    for i in a:
        for j in b:
            c = i.intersection(j)
            if c is not None:
                out.append(c)
    return merge(out)


def set_tex(ivs: list[Iv]) -> str:
    ivs = merge(ivs)
    if not ivs:
        return r"\emptyset"
    parts = []
    for iv in ivs:
        left = "[" if iv.loc else "("
        right = "]" if iv.hic else ")"
        parts.append(f"{left}{ntex(iv.lo)},{ntex(iv.hi)}{right}")
    return r" \cup ".join(parts)


def subtract_point(ivs: list[Iv], p) -> list[Iv]:
    p = sp.sympify(p)
    out = []
    for iv in ivs:
        if iv.empty or p < iv.lo or p > iv.hi or (p == iv.lo and not iv.loc) or (p == iv.hi and not iv.hic):
            if not iv.empty:
                out.append(iv)
            continue
        if p == iv.lo:
            out.append(Iv(iv.lo, False, iv.hi, iv.hic))
        elif p == iv.hi:
            out.append(Iv(iv.lo, iv.loc, iv.hi, False))
        else:
            out.append(Iv(iv.lo, iv.loc, p, False))
            out.append(Iv(p, False, iv.hi, iv.hic))
    return merge(out)


def real_ok(e) -> bool:
    if e is None:
        return False
    e = sp.simplify(e)
    if e.has(sp.zoo, sp.nan, sp.oo, -sp.oo):
        return False
    if e == sp.oo or e == -sp.oo:
        return False
    return bool(e.is_real and e.is_finite)


def assert_domain(expr, ivs: list[Iv]) -> None:
    for k in range(-8, 9):
        for pt in (sp.Integer(k), sp.Rational(k, 1) + sp.Rational(1, 2)):
            inside = any(iv.contains(pt) for iv in ivs)
            try:
                ok = real_ok(expr.subs(x, pt))
            except Exception:
                ok = False
            if inside != ok:
                raise AssertionError(f"定义域不符：{expr} 在 {pt} inside={inside} ok={ok} 集合={set_tex(ivs)}")


def domain_sqrt_linear(a, b) -> list[Iv]:
    if a == 0:
        return [] if b < 0 else [Iv(-sp.oo, False, sp.oo, False)]
    root = sp.simplify(sp.Rational(int(-b), int(a)) if False else -sp.sympify(b) / sp.sympify(a))
    root = sp.together(root)
    if a > 0:
        return [Iv(root, True, sp.oo, False)]
    return [Iv(-sp.oo, False, root, True)]


def domain_ln_linear(a, b) -> list[Iv]:
    root = sp.together(-sp.sympify(b) / sp.sympify(a))
    if a > 0:
        return [Iv(root, False, sp.oo, False)]
    return [Iv(-sp.oo, False, root, False)]


def domain_recip_linear(a, b) -> list[Iv]:
    pole = sp.together(-sp.sympify(b) / sp.sympify(a))
    return subtract_point([Iv(-sp.oo, False, sp.oo, False)], pole)


def sqrt_ratio_domain(p, q) -> list[Iv]:
    """sqrt( (x-p)/(x-q) ) 的定义域。"""
    p, q = sp.Integer(int(p)), sp.Integer(int(q))
    if p == q:
        return subtract_point([Iv(-sp.oo, False, sp.oo, False)], p)
    a, b = (p, q) if p < q else (q, p)
    samples = [a - 1, (a + b) / 2, b + 1]
    regions = [
        Iv(-sp.oo, False, a, False),
        Iv(a, False, b, False),
        Iv(b, False, sp.oo, False),
    ]
    expr = (x - p) / (x - q)
    kept = []
    for iv, s in zip(regions, samples):
        val = sp.simplify(expr.subs(x, s))
        if val.is_real and val.is_finite and val >= 0:
            kept.append(iv)
    # 分子为零且分母非零时可取等号
    if p != q:
        val_den = p - q
        if val_den != 0:
            kept.append(Iv(p, True, p, True))
    return merge(kept)


def mtex(M) -> str:
    M = sp.Matrix(M)
    rows = []
    for i in range(M.rows):
        rows.append(" & ".join(ntex(M[i, j]) for j in range(M.cols)))
    return r"\begin{pmatrix}" + r" \\ ".join(rows) + r"\end{pmatrix}"


def rref_steps(aug) -> tuple[sp.Matrix, list[str]]:
    A = sp.Matrix(aug).applyfunc(lambda v: sp.simplify(sp.together(sp.sympify(v))))
    m, n = A.shape
    steps: list[str] = []
    prow = 0
    for col in range(n - 1):
        piv = None
        for i in range(prow, m):
            if A[i, col] != 0:
                piv = i
                break
        if piv is None:
            continue
        if piv != prow:
            A.row_swap(piv, prow)
            steps.append(f"交换第 {piv + 1} 行与第 {prow + 1} 行，得到 {inline(mtex(A))}。")
        pv = A[prow, col]
        if sp.simplify(pv - 1) != 0:
            A.row_op(prow, lambda val, j, pv=pv: sp.simplify(sp.together(val / pv)))
            steps.append(f"第 {prow + 1} 行除以 {inline(ntex(pv))}，得到 {inline(mtex(A))}。")
        for i in range(m):
            if i == prow:
                continue
            factor = A[i, col]
            if factor == 0:
                continue
            src = [A[prow, j] for j in range(n)]
            for j in range(n):
                A[i, j] = sp.simplify(sp.together(A[i, j] - factor * src[j]))
            steps.append(
                f"第 {i + 1} 行减去第 {prow + 1} 行的 {inline(ntex(factor))} 倍，得到 {inline(mtex(A))}。"
            )
        prow += 1
        if prow == m:
            break
    return A, steps


def poly_parity(expr) -> str:
    e_even = sp.simplify(sp.expand(expr.subs(x, -x) - expr))
    e_odd = sp.simplify(sp.expand(expr.subs(x, -x) + expr))
    is_even = e_even == 0
    is_odd = e_odd == 0
    if is_even and is_odd:
        return "both"
    if is_even:
        return "even"
    if is_odd:
        return "odd"
    return "neither"


PARITY_TEXT = {
    "even": "偶函数",
    "odd": "奇函数",
    "neither": "既不是奇函数也不是偶函数",
    "both": "既是奇函数又是偶函数",
}


def bare_math_token(s: str) -> str | None:
    """找出没有放进 \\( \\) 的 ^ 或 _。"""
    plain = re.sub(r"\\\(.*?\\\)", "", s, flags=re.S)
    if "^" in plain or "_" in plain:
        return plain.strip()[:80]
    return None


def validate(paper: Paper) -> None:
    if len(paper.mcqs) != 100:
        raise RuntimeError(f"{paper.code} 选择题 {len(paper.mcqs)} 道，不是 100")
    if len(paper.hws) != 20:
        raise RuntimeError(f"{paper.code} 作业 {len(paper.hws)} 道，不是 20")
    stems = [norm(q.stem) for q in paper.mcqs]
    if len(set(stems)) != 100:
        raise RuntimeError(f"{paper.code} 选择题题干有重复")
    for i, q in enumerate(paper.mcqs, 1):
        if len(q.choices) != 4 or len({norm(c) for c in q.choices}) != 4:
            raise RuntimeError(f"{paper.code} 第 {i} 题选项不唯一")
        if not (0 <= q.answer < 4):
            raise RuntimeError(f"{paper.code} 第 {i} 题答案下标非法")
        if not q.explain.strip():
            raise RuntimeError(f"{paper.code} 第 {i} 题没有解析")
        for label, text in (("题干", q.stem), ("解析", q.explain)):
            bad = bare_math_token(text)
            if bad:
                raise RuntimeError(f"{paper.code} 选择 {i} {label}含未进数学模式的符号：{bad}")
        for c in q.choices:
            if any("\u4e00" <= ch <= "\u9fff" for ch in c):
                bad = bare_math_token(c)
                if bad:
                    raise RuntimeError(f"{paper.code} 选择 {i} 选项含未进数学模式的符号：{bad}")
    hw = [norm(h.stem) for h in paper.hws]
    if len(set(hw)) != 20:
        raise RuntimeError(f"{paper.code} 作业题干有重复")
    for i, h in enumerate(paper.hws, 1):
        if len(h.steps) < 2:
            raise RuntimeError(f"{paper.code} 作业 {i} 过程少于两步")
        for label, text in [("题干", h.stem), ("答案", h.answer), *[(f"步骤{k}", s) for k, s in enumerate(h.steps, 1)]]:
            bad = bare_math_token(text)
            if bad:
                raise RuntimeError(f"{paper.code} 作业 {i} {label}含未进数学模式的符号：{bad}")


def self_test() -> None:
    ivs = sqrt_ratio_domain(1, 3)
    assert set_tex(ivs) == r"(-\infty,1] \cup (3,+\infty)", set_tex(ivs)
    assert_domain(sp.sqrt((x - 1) / (x - 3)), ivs)
    ivs2 = sqrt_ratio_domain(3, 1)
    assert set_tex(ivs2) == r"(-\infty,1) \cup [3,+\infty)", set_tex(ivs2)
    assert_domain(sp.sqrt((x - 3) / (x - 1)), ivs2)
    d = inter_sets(domain_sqrt_linear(2, 4), domain_ln_linear(1, -1))
    assert set_tex(d) == r"(1,+\infty)", set_tex(d)
    assert_domain(sp.sqrt(2 * x + 4) + sp.log(x - 1), d)
    assert poly_parity(x**3 + x) == "odd"
    assert poly_parity(x**2 + 1) == "even"
    assert poly_parity(x**2 + x) == "neither"
    assert poly_parity(0 * x) == "both"
    A, steps = rref_steps(sp.Matrix([[1, 1, 3], [1, -1, 1]]))
    assert A == sp.Matrix([[1, 0, 2], [0, 1, 1]]), A
    assert steps
    assert math.floor(Fraction(-16, 5)) == -4
    M = sp.Matrix([[1, 2], [0, -1]])
    assert "pmatrix" in mtex(M)


if __name__ == "__main__":
    self_test()
    print("core ok")
