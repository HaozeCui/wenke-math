"""1.1 函数：选择题与作业。"""
from __future__ import annotations

import math
from fractions import Fraction

import sympy as sp

from core import (
    PARITY_TEXT,
    Bag,
    HW,
    Iv,
    Paper,
    assert_domain,
    domain_ln_linear,
    domain_recip_linear,
    domain_sqrt_linear,
    ftex,
    inline,
    inter_sets,
    merge,
    ntex,
    stex,
    poly_parity,
    set_tex,
    sqrt_ratio_domain,
    x,
)

SLOPES = [-3, -2, -1, 1, 2, 3, 4]


def _iv_key(ivs):
    return tuple(i.key() for i in merge(ivs))


def _distract_domain(ivs, rng):
    base = merge(ivs)
    cands = []
    toggled = []
    for iv in base:
        loc = (not iv.loc) if iv.lo != -sp.oo else False
        hic = (not iv.hic) if iv.hi != sp.oo else False
        toggled.append(Iv(iv.lo, loc, iv.hi, hic))
    cands.append(merge(toggled))
    if len(base) >= 2:
        cands.append(merge(base[:1]))
        cands.append(merge(base[1:]))
        cands.append([Iv(base[0].lo, base[0].loc, base[-1].hi, base[-1].hic)])
    for iv in base:
        if iv.hi == sp.oo and iv.lo.is_finite:
            cands.append([Iv(-sp.oo, False, iv.lo, not iv.loc)])
        if iv.lo == -sp.oo and iv.hi.is_finite:
            cands.append([Iv(iv.hi, not iv.hic, sp.oo, False)])
    shifted = []
    for iv in base:
        lo = iv.lo + 1 if iv.lo.is_finite else iv.lo
        hi = iv.hi + 1 if iv.hi.is_finite else iv.hi
        if lo < hi or (lo == hi and iv.loc and iv.hic):
            shifted.append(Iv(lo, iv.loc, hi, iv.hic))
    if shifted:
        cands.append(merge(shifted))
    cands.append([Iv(-sp.oo, False, sp.oo, False)])
    correct = _iv_key(base)
    uniq, seen = [], {correct}
    for c in cands:
        c = merge(c)
        if not c:
            continue
        k = _iv_key(c)
        if k in seen:
            continue
        seen.add(k)
        uniq.append(set_tex(c))
    rng.shuffle(uniq)
    return uniq


def _lin(rng, root):
    a = rng.choice(SLOPES)
    b = -a * root
    return a, b


def q_domain(rng):
    mode = rng.choice(["sqrt", "ln", "recip", "sqrt_ln", "sqrt_recip", "ln_recip", "ratio", "disk", "rsqrt"])
    root = rng.randint(-4, 5)
    a, b = _lin(rng, root)
    expr = None
    ivs = None
    why = ""
    if mode == "sqrt":
        expr = sp.sqrt(a * x + b)
        ivs = domain_sqrt_linear(a, b)
        why = f"根号内 {inline(ntex(a*x+b))} 非负，定义域为 {inline(set_tex(ivs))}。"
    elif mode == "ln":
        expr = sp.log(a * x + b)
        ivs = domain_ln_linear(a, b)
        why = f"对数真数须大于 0，定义域为 {inline(set_tex(ivs))}。"
    elif mode == "recip":
        expr = 1 / (a * x + b)
        ivs = domain_recip_linear(a, b)
        why = f"分母不能为 0，定义域为 {inline(set_tex(ivs))}。"
    elif mode == "sqrt_ln":
        root2 = rng.choice([z for z in range(-4, 6) if z != root])
        c, d = _lin(rng, root2)
        expr = sp.sqrt(a * x + b) + sp.log(c * x + d)
        ivs = inter_sets(domain_sqrt_linear(a, b), domain_ln_linear(c, d))
        why = "根号要求内部非负，对数要求真数大于 0，再取交集。"
    elif mode == "sqrt_recip":
        root2 = rng.choice([z for z in range(-4, 6) if z != root])
        c, d = _lin(rng, root2)
        expr = sp.sqrt(a * x + b) / (c * x + d)
        ivs = inter_sets(domain_sqrt_linear(a, b), domain_recip_linear(c, d))
        why = "先写根号的限制，再去掉使分母为 0 的点。"
    elif mode == "ln_recip":
        root2 = rng.choice([z for z in range(-4, 6) if z != root])
        c, d = _lin(rng, root2)
        expr = sp.log(a * x + b) + 1 / (c * x + d)
        ivs = inter_sets(domain_ln_linear(a, b), domain_recip_linear(c, d))
        why = "真数大于 0，并且分母不为 0。"
    elif mode == "ratio":
        p = rng.randint(-3, 4)
        q = rng.choice([z for z in range(-3, 5) if z != p])
        expr = sp.sqrt((x - p) / (x - q))
        ivs = sqrt_ratio_domain(p, q)
        why = "根号内的分式非负，且分母不能为 0。临界点要单独检查等号。"
    elif mode == "disk":
        r = rng.choice([2, 3, 4, 5])
        expr = sp.sqrt(r**2 - x**2)
        ivs = [Iv(-r, True, r, True)]
        inside = inline(str(r**2) + "-x^2")
        bound = inline("|x|\\le " + str(r))
        why = f"根号内 {inside} 非负，即 {bound}。"
    else:
        expr = 1 / sp.sqrt(a * x + b)
        ivs = domain_ln_linear(a, b)
        why = "根号内必须大于 0（等于 0 时分母为 0），端点不能取到。"
    if not ivs:
        return None
    assert_domain(expr, ivs)
    wrong = _distract_domain(ivs, rng)
    if len(wrong) < 3:
        return None
    stem = "函数 " + inline("f(x)=" + stex(expr)) + " 的定义域是"
    return rng and _mcq_domain(rng, stem, set_tex(ivs), wrong, why)


def _mcq_domain(rng, stem, correct, wrong, why):
    from core import Bag as _B

    # 借用一次洗牌，不写入总题袋
    tmp = _B(rng.randrange(1, 10**6))
    return tmp.make_mcq(stem, correct, wrong, why, "domain")


def q_piecewise(rng):
    k = rng.randint(-2, 4)
    a = rng.choice(SLOPES)
    b = rng.randint(-4, 5)
    c = rng.choice(SLOPES)
    d = rng.randint(-4, 5)
    if a * k + b == c * k + d:
        d += 2 if d < 6 else -2
    right_closed = rng.choice([True, False])
    t = k if rng.random() < 0.6 else rng.choice([k - 2, k - 1, k + 1, k + 2])
    left_val = a * t + b
    right_val = c * t + d
    on_left = t < k or (t == k and not right_closed)
    val = left_val if on_left else right_val
    other = right_val if on_left else left_val
    alts = []
    for z in (other, val + 1, val - 1, val + a, a * k + b, c * k + d, left_val + right_val):
        if z != val and z not in alts:
            alts.append(z)
    if len(alts) < 3:
        return None
    f_left = inline("f(x)=" + ntex(a * x + b))
    f_right = inline("f(x)=" + ntex(c * x + d))
    x_lt = inline("x<" + str(k))
    x_gt = inline("x>" + str(k))
    x_ge = inline("x\\ge " + str(k))
    x_le = inline("x\\le " + str(k))
    if right_closed:
        cond = f"当 {x_lt} 时 {f_left}，当 {x_ge} 时 {f_right}"
        side = "右段（含分界点）" if not on_left else "左段"
    else:
        cond = f"当 {x_le} 时 {f_left}，当 {x_gt} 时 {f_right}"
        side = "左段（含分界点）" if on_left else "右段"
    stem = f"设 {cond}。则 {inline(f'f({t})')} 等于"
    why = f"先比较 {inline(str(t))} 与分界点 {inline(str(k))}，该点落在{side}，再代入该段，得 {inline(ntex(val))}。"
    tmp = Bag(rng.randrange(1, 10**6))
    return tmp.make_mcq(stem, val, alts, why, "piecewise")


def q_floor(rng):
    num = rng.randint(-65, 65)
    den = rng.choice([1, 2, 4, 5, 10])
    xv = Fraction(num, den)
    if xv.denominator == 1:
        return None
    correct = math.floor(xv)
    alts = []
    for z in (math.trunc(xv), math.ceil(xv), correct + 1, correct - 1, correct + 2, -correct if correct else 1):
        if z != correct and z not in alts:
            alts.append(int(z))
    if len(alts) < 3:
        return None
    shown = ftex(xv)
    stem = f"取整 {inline('[' + shown + ']')} 等于"
    if xv < 0 and xv.denominator != 1:
        why = f"不超过 {inline(shown)} 的最大整数是 {inline(str(correct))}。负数不能把小数直接丢掉（丢掉小数会得到 {inline(str(math.trunc(xv)))}）。"
    elif xv.denominator == 1:
        why = f"整数的取整就是它自己，{inline('[' + shown + ']=' + str(correct))}。"
    else:
        why = f"不超过 {inline(shown)} 的最大整数是 {inline(str(correct))}，不向更大的整数进一。"
    tmp = Bag(rng.randrange(1, 10**6))
    return tmp.make_mcq(stem, correct, alts, why, "floor")


def q_comp(rng):
    p = rng.choice([-2, -1, 1, 2, 3])
    q = rng.choice([-2, -1, 0, 1, 2])
    r = rng.choice([-3, -1, 0, 1, 2])
    s = rng.choice([-2, -1, 1, 2, 3])
    tt = rng.randint(-3, 3)
    x0 = rng.randint(-3, 3)
    u0 = s * x0 + tt
    fg = p * u0**2 + q * u0 + r
    f_at = p * x0**2 + q * x0 + r
    gf = s * f_at + tt
    f_tex = ntex(p * x**2 + q * x + r).replace("x", "u")
    g_tex = ntex(s * x + tt)
    mode = rng.choice(["fg", "gf", "expr"])
    tmp = Bag(rng.randrange(1, 10**6))
    if mode == "expr":
        fg_e = sp.expand(p * (s * x + tt) ** 2 + q * (s * x + tt) + r)
        gf_e = sp.expand(s * (p * x**2 + q * x + r) + tt)
        drop = sp.expand(p * (s * x + tt) ** 2 + r)
        prod = sp.expand((p * x**2 + q * x + r) * (s * x + tt))
        stem = f"设 {inline('f(u)=' + f_tex)}，{inline('g(x)=' + g_tex)}。则 {inline('f(g(x))')} 展开后是"
        why = "先把内层整段代入外层，再展开。复合不能换成先外后内。"
        return tmp.make_mcq(stem, fg_e, [gf_e, drop, prod, fg_e + x, gf_e + 1], why, "comp")
    if mode == "fg":
        alts = [gf, fg + 1, fg - 1, f_at, u0, p * u0 + r, fg + q]
        stem = f"设 {inline('f(u)=' + f_tex)}，{inline('g(x)=' + g_tex)}。则 {inline(f'f(g({x0}))')} 等于"
        why = f"先算内层 {inline(f'g({x0})={u0}')}，再代入外层，得 {inline(str(fg))}。它一般不等于 {inline(f'g(f({x0}))={gf}')}。"
        return tmp.make_mcq(stem, fg, alts, why, "comp")
    alts = [fg, gf + 1, gf - s, f_at, s * x0 + tt]
    stem = f"设 {inline('f(u)=' + f_tex)}，{inline('g(x)=' + g_tex)}。则 {inline(f'g(f({x0}))')} 等于"
    why = f"先算 {inline(f'f({x0})={f_at}')}，再代入 {inline('g')}，得 {inline(str(gf))}。"
    return tmp.make_mcq(stem, gf, alts, why, "comp")


def q_parity(rng):
    branch = rng.choice(["poly", "poly", "poly", "trig", "abs", "domain", "zero"])
    tmp = Bag(rng.randrange(1, 10**6))
    texts = list(PARITY_TEXT.values())
    if branch == "zero":
        expr = x - x
        shown = "x-x"
        kind = "both"
        why = "化简后是零函数。只有零函数既是奇函数又是偶函数。"
    elif branch == "domain":
        a = rng.choice([0, 1, 2, 3])
        expr = sp.sqrt(x - a) if rng.random() < 0.5 else sp.log(x + a + 1)
        shown = ntex(expr)
        kind = "neither"
        why = "定义域不关于 0 对称，所以既不是奇函数也不是偶函数。先看定义域，再代负号。"
    elif branch == "trig":
        b = rng.choice([1, 2, 3])
        if rng.random() < 0.5:
            expr = sp.sin(b * x)
            shown = ntex(expr)
            kind = "odd"
        else:
            expr = sp.cos(b * x) + x**2
            shown = ntex(expr)
            kind = "even"
        got = poly_parity(expr)
        if got != kind:
            return None
        why = f"计算 {inline('f(-x)')}，与 {inline('f(x)')}、{inline('-f(x)')} 比较。"
    elif branch == "abs":
        coef = rng.choice([1, 2, 3])
        expr = coef * sp.Abs(x) + rng.choice([0, 1, 2])
        shown = ntex(expr)
        kind = poly_parity(expr)
        why = f"{inline('|{-x}|' )} 与 {inline('|x|')} 相同，常数项也不改变奇偶性。结果是{PARITY_TEXT[kind]}。"
        why = f"绝对值满足 {inline('|-x|=|x|')}，因此这个函数是{PARITY_TEXT[kind]}。"
    else:
        expr = 0
        parts = []
        for d in range(0, 5):
            if rng.random() < 0.6:
                coef = rng.choice([-3, -2, -1, 1, 2, 3])
                expr += coef * x**d
                parts.append(coef)
        if expr == 0:
            expr = x**3 - 2 * x
        kind = poly_parity(expr)
        shown = ntex(expr)
        why = f"先确认定义域为全体实数，再比较 {inline('f(-x)')} 与 {inline('f(x)')}。这是{PARITY_TEXT[kind]}。"
    correct = PARITY_TEXT[kind]
    stem = f"函数 {inline('f(x)=' + shown)} "
    return tmp.make_mcq(stem, correct, [z for z in texts if z != correct], why, "parity")


def q_period(rng):
    b = rng.choice([1, 2, 3, 4])
    kind = rng.choice(["sin", "cos"])
    expr = sp.sin(b * x) if kind == "sin" else sp.cos(b * x)
    T = sp.simplify(2 * sp.pi / b)
    if sp.simplify(expr.subs(x, x + T) - expr) != 0:
        return None
    if sp.simplify(expr.subs(x, x + T / 2) - expr) == 0:
        return None
    cands = [sp.pi, 2 * sp.pi, sp.pi / 2, 4 * sp.pi, sp.pi / b, 2 * sp.pi / b, sp.pi / (2 * b)]
    tmp = Bag(rng.randrange(1, 10**6))
    stem = f"{inline(ntex(expr))} 的最小正周期是"
    period_eq = inline(str(b) + "T=2\\pi")
    period_val = inline(ntex(T))
    if kind == "sin":
        why = f"令 {period_eq}，得到最小正周期 {period_val}。"
    else:
        why = f"余弦与正弦的最小正周期相同。令 {period_eq}，得到 {period_val}。"
    return tmp.make_mcq(stem, T, cands, why, "period")


def q_interval(rng):
    a = rng.randint(-4, 2)
    b = a + rng.randint(2, 6)
    mode = rng.choice(["half", "open", "ray", "hole"])
    if mode == "half":
        left_c = rng.choice([True, False])
        right_c = not left_c
        ivs = [Iv(a, left_c, b, right_c)]
        cond = _ineq(a, left_c, b, right_c)
    elif mode == "open":
        ivs = [Iv(a, False, b, False)]
        cond = f"{a}<x<{b}"
    elif mode == "ray":
        if rng.random() < 0.5:
            closed = rng.choice([True, False])
            ivs = [Iv(a, closed, sp.oo, False)]
            cond = ("x>" + str(a)) if not closed else ("x\\ge " + str(a))
        else:
            closed = rng.choice([True, False])
            ivs = [Iv(-sp.oo, False, b, closed)]
            cond = ("x<" + str(b)) if not closed else ("x\\le " + str(b))
    else:
        c = rng.randint(a + 1, b - 1)
        ivs = merge([Iv(a, True, c, False), Iv(c, False, b, True)])
        cond = str(a) + "\\le x\\le " + str(b) + ",\\ x\\neq " + str(c)
    correct = set_tex(ivs)
    wrong = _distract_domain(ivs, rng)
    if len(wrong) < 3:
        return None
    set_body = inline(r"\{x\mid " + cond + r"\}")
    stem = f"集合 {set_body} 写成区间是"
    why = f"端点是否包含、要不要挖去一点，都要写进区间。结果是 {inline(correct)}。"
    tmp = Bag(rng.randrange(1, 10**6))
    return tmp.make_mcq(stem, correct, wrong, why, "interval")


def _ineq(a, left_c, b, right_c):
    if left_c and not right_c:
        return str(a) + "\\le x<" + str(b)
    if not left_c and right_c:
        return str(a) + "<x\\le " + str(b)
    if left_c and right_c:
        return str(a) + "\\le x\\le " + str(b)
    return str(a) + "<x<" + str(b)


def q_relation(rng):
    k = rng.randint(1, 6)
    kind = rng.choice(["cube", "square", "two_roots", "exp", "floor_ok", "pair"])
    tmp = Bag(rng.randrange(1, 10**6))
    if kind == "cube":
        stem = f"在全体实数上，对应 {inline(f'y=x^3-{k}')} "
        correct = "是函数，并且有反函数"
        why = "每个实数对应唯一的值，而且一一对应，所以有反函数。"
    elif kind == "square":
        stem = f"在全体实数上，对应 {inline(f'y=x^2+{k}')} "
        correct = "是函数，但在全体实数上没有反函数"
        why = "每个 x 只有一个平方，所以是函数；但同一个 y 可以来自两个 x，要限制到半轴才有反函数。"
    elif kind == "two_roots":
        stem = f"每个正数对应它的两个平方根（例如 {k} 的两个根）。这个对应"
        correct = "不是函数，因为出现了一对多"
        why = "一个正数对应两个值，不符合单值对应。只取算术平方根才是函数。"
    elif kind == "exp":
        stem = f"在全体实数上，对应 {inline(f'y={k}^x')}（{k} 为正整数）"
        correct = "是函数，并且有反函数"
        why = "指数函数单值，而且一一对应，反函数是对数。"
    elif kind == "floor_ok":
        stem = f"每个实数 x 对应取整 {inline('[x+' + str(k) + ']')}。这个对应"
        correct = "是函数，但没有反函数"
        why = "每个 x 只有一个取整值，所以是函数；但一段区间上的 x 对应同一个整数，不是一一对应。"
    else:
        stem = f"每位导师对应自己指导的全部学生（导师编号从 1 到 {k}）。这个对应"
        correct = "不是函数，因为出现了一对多"
        why = "一位导师可以对应多名学生，不是单值对应。反过来，学生对应导师通常才是函数。"
    choices = [
        "是函数，并且有反函数",
        "是函数，但在全体实数上没有反函数",
        "是函数，但没有反函数",
        "不是函数，因为出现了一对多",
    ]
    # 平方那一题的正确措辞与「是函数，但没有反函数」都部分成立。
    # 用更窄的正确项，并保证其余三项确实不对。
    if kind == "square":
        choices = [
            "是函数，并且在全体实数上有反函数",
            "是函数，但要先限制定义域才有反函数",
            "不是函数，因为一个 y 来自两个 x",
            "不是函数，因为没有写出反函数公式",
        ]
        correct = "是函数，但要先限制定义域才有反函数"
    elif kind == "floor_ok":
        choices = [
            "是函数，并且有反函数",
            "是函数，但没有反函数",
            "不是函数，因为图像有跳跃",
            "不是函数，因为取整不是公式",
        ]
        correct = "是函数，但没有反函数"
    return tmp.make_mcq(stem, correct, [c for c in choices if c != correct], why, "relation")


def _tmp_mcq(rng, stem, correct, distractors, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, distractors, why, topic)


def hw_domain_mix(rng):
    root = rng.randint(-3, 3)
    a, b = _lin(rng, root)
    root2 = rng.choice([z for z in range(-3, 5) if z != root])
    c, d = _lin(rng, root2)
    kind = rng.choice(["sl", "lr", "ratio"])
    if kind == "sl":
        expr = sp.sqrt(a * x + b) + sp.log(c * x + d)
        ivs = inter_sets(domain_sqrt_linear(a, b), domain_ln_linear(c, d))
        sqrt_need = inline(ntex(a * x + b) + r"\ge 0")
        sqrt_set = inline(set_tex(domain_sqrt_linear(a, b)))
        ln_need = inline(ntex(c * x + d) + ">0")
        ln_set = inline(set_tex(domain_ln_linear(c, d)))
        steps = [
            f"根号：{sqrt_need}，即 {sqrt_set}。",
            f"对数：{ln_need}，即 {ln_set}。",
            "两个条件同时成立，取交集。",
        ]
    elif kind == "lr":
        expr = sp.log(a * x + b) / (c * x + d)
        ivs = inter_sets(domain_ln_linear(a, b), domain_recip_linear(c, d))
        steps = [
            f"真数大于 0：{inline(set_tex(domain_ln_linear(a, b)))}。",
            f"分母不为 0：去掉 {inline('x=' + ntex(-sp.Integer(d)/c))}。",
            "取交集，分母零点若落在真数条件内就必须挖去。",
        ]
    else:
        p = rng.randint(-2, 3)
        q = rng.choice([z for z in range(-2, 4) if z != p])
        expr = sp.sqrt((x - p) / (x - q))
        ivs = sqrt_ratio_domain(p, q)
        den = inline("x-" + str(q))
        ratio = inline(ntex((x - p) / (x - q)))
        zero = inline("x=" + str(p))
        steps = [
            f"分母 {den} 不能为 0。",
            f"在分母两侧各取一个试探点，看 {ratio} 是否非负。",
            f"分子为零的点 {zero} 若分母不为 0，可以取等号。",
        ]
    if not ivs:
        return None
    assert_domain(expr, ivs)
    ans = set_tex(ivs)
    steps.append(f"因此定义域是 {inline(ans)}。")
    stem = f"求 {inline('f(x)=' + ntex(expr))} 的定义域，写成区间，并说明每条限制从何而来。"
    return HW(stem, steps, inline(ans), "3.2cm")


def hw_piece_word(rng):
    cap = rng.choice([80, 100, 120, 150])
    p = Fraction(rng.choice([1, 3, 5]), 10)  # 0.1 0.3 0.5 元，太小？用整数角
    p = Fraction(rng.choice([2, 3, 4, 5]), 5)  # 0.4 到 1
    q = p + Fraction(rng.choice([1, 2, 3]), 5)
    x1 = cap - rng.choice([10, 20, 30])
    x2 = cap + rng.choice([20, 40, 50])
    y1 = p * x1
    y2 = p * cap + q * (x2 - cap)
    stem = (
        f"某市电价：月用电量不超过 {cap} 度时，每度 {inline(ftex(p, True))} 元；"
        f"超出部分每度 {inline(ftex(q, True))} 元。"
        f"写出费用函数，并计算 {x1} 度与 {x2} 度的费用。"
    )
    seg1 = inline("y=" + ftex(p, True) + r"\,x")
    dom1 = inline("0\\le x\\le " + str(cap))
    full = inline(ftex(p * cap, True))
    seg2 = inline("y=" + ftex(p * cap, True) + "+" + ftex(q, True) + "(x-" + str(cap) + ")")
    bill1 = inline(ftex(p, True) + r"\times " + str(x1) + "=" + ftex(y1, True))
    bill2 = inline(ftex(p * cap, True) + "+" + ftex(q, True) + r"\times " + str(x2 - cap) + "=" + ftex(y2, True))
    steps = [
        f"先定位：{x1} 度不超过 {cap}，走第一段；{x2} 度超过 {cap}，走第二段。",
        f"第一段 {seg1}（{dom1}）。",
        f"第二段要先付满档 {full} 元，再加超出部分，即 {seg2}。",
        f"{x1} 度：{bill1} 元。",
        f"{x2} 度：{bill2} 元。",
    ]
    ans = f"{x1} 度为 {inline(ftex(y1, True))} 元，{x2} 度为 {inline(ftex(y2, True))} 元。"
    return HW(stem, steps, ans, "3.6cm")


def hw_piece_point(rng):
    k = rng.randint(-1, 3)
    a, b = rng.choice(SLOPES), rng.randint(-2, 4)
    c, d = rng.choice(SLOPES), rng.randint(-2, 4)
    if a * k + b == c * k + d:
        d += 3
    pts = [k - 1, k, k + 1]
    vals = []
    for t in pts:
        vals.append(a * t + b if t < k else c * t + d)
    left_cond = inline("x<" + str(k))
    right_cond = inline("x\\ge " + str(k))
    left_f = inline("f(x)=" + ntex(a * x + b))
    right_f = inline("f(x)=" + ntex(c * x + d))
    stem = (
        f"设 {left_cond} 时 {left_f}，"
        f"{right_cond} 时 {right_f}。"
        f"分别求 {inline('f')} 在 {pts[0]}、{pts[1]}、{pts[2]} 的值，并说明分界点归哪一段。"
    )
    wrong_left = inline(str(a * k + b))
    steps = [
        f"{pts[0]} 小于分界点，用左段：{inline(str(vals[0]))}。",
        f"分界点 {k} 写在右段（{right_cond}），用右段：{inline(str(vals[1]))}。若误用左段会得到 {wrong_left}。",
        f"{pts[2]} 用右段：{inline(str(vals[2]))}。",
    ]
    ans = "、".join(inline("f(" + str(t) + ")=" + str(v)) for t, v in zip(pts, vals))
    return HW(stem, steps, ans)


def hw_abs_piece(rng):
    h = rng.randint(-3, 3)
    if h == 0:
        h = 2
    # |x-h|
    fx = inline("f(x)=|x-(" + str(h) + ")|")
    left_pt, right_pt = h - 2, h + 2
    ask_l = inline("f(" + str(left_pt) + ")")
    ask_r = inline("f(" + str(right_pt) + ")")
    stem = f"把 {fx} 写成分段函数，并求 {ask_l} 与 {ask_r}。"
    ge = inline("x\\ge " + str(h))
    lt = inline("x<" + str(h))
    right_rule = inline("f(x)=x-(" + str(h) + ")")
    left_rule = inline("f(x)=(" + str(h) + ")-x")
    got_l = inline("f(" + str(left_pt) + ")=" + str(abs(left_pt - h)))
    got_r = inline("f(" + str(right_pt) + ")=" + str(abs(right_pt - h)))
    steps = [
        f"绝对值按内部是否非负分段：{ge} 时 {right_rule}，{lt} 时 {left_rule}。",
        f"{left_pt} 在左段，{got_l}。",
        f"{right_pt} 在右段，{got_r}。",
    ]
    ans = inline("f(" + str(left_pt) + ")=" + str(abs(left_pt - h)) + ",\\ f(" + str(right_pt) + ")=" + str(abs(right_pt - h)))
    return HW(stem, steps, ans)


def hw_floor_three(rng):
    vals = [Fraction(rng.choice([7, 11, 23]), 10), Fraction(rng.choice([-1, -2, -5]), 1), Fraction(rng.choice([-3, -7, -11]), 5)]
    # ensure one negative non-integer
    if vals[2].denominator == 1:
        vals[2] = Fraction(-11, 5)
    shown = [ftex(v) for v in vals]
    got = [math.floor(v) for v in vals]
    stem = "求 " + "、".join(inline("[" + s + "]") for s in shown) + "。对其中的负数说明为什么不能丢掉小数。"
    steps = []
    for v, s, g in zip(vals, shown, got):
        if v < 0 and v.denominator != 1:
            steps.append(f"{inline(s)} 不是整数。不超过它的最大整数是 {inline(str(g))}，而丢掉小数只会得到 {inline(str(math.trunc(v)))}。")
        elif v.denominator == 1:
            steps.append(f"{inline(s)} 本身是整数，取整仍是 {inline(str(g))}。")
        else:
            steps.append(f"不超过 {inline(s)} 的最大整数是 {inline(str(g))}。")
    ans = "，".join(inline(f"[{s}]={g}") for s, g in zip(shown, got))
    return HW(stem, steps, ans)


def hw_comp(rng, which="fg"):
    p = rng.choice([1, 2, -1])
    q = rng.choice([-1, 0, 1, 2])
    r = rng.choice([0, 1, -2])
    s = rng.choice([2, -2, 3, -1])
    tt = rng.choice([-1, 1, 2, 0])
    x0 = rng.choice([-2, -1, 1, 2])
    f_tex = ntex(p * x**2 + q * x + r).replace("x", "u")
    g_tex = ntex(s * x + tt)
    u0 = s * x0 + tt
    fg = p * u0**2 + q * u0 + r
    f_at = p * x0**2 + q * x0 + r
    gf = s * f_at + tt
    fg_e = sp.expand(p * (s * x + tt) ** 2 + q * (s * x + tt) + r)
    gf_e = sp.expand(s * (p * x**2 + q * x + r) + tt)
    if which == "fg":
        stem = f"设 {inline('f(u)=' + f_tex)}，{inline('g(x)=' + g_tex)}。展开 {inline('f(g(x))')}，并计算 {inline(f'f(g({x0}))')}。"
        steps = [
            f"内层是 {inline(g_tex)}，整段代入外层，不要先把外层的平方拆开再套。",
            f"展开得 {inline(ntex(fg_e))}。",
            f"代入 {inline(f'x={x0}')}：先得内层 {inline(str(u0))}，再算外层，结果 {inline(str(fg))}。",
        ]
        ans = f"展开式 {inline(ntex(fg_e))}，{inline(f'f(g({x0}))={fg}')}。"
    else:
        stem = f"设 {inline('f(u)=' + f_tex)}，{inline('g(x)=' + g_tex)}。展开 {inline('g(f(x))')}，计算 {inline(f'g(f({x0}))')}，并与 {inline(f'f(g({x0}))={fg}')} 比较。"
        steps = [
            f"{inline('g(f(x))')} 是先平方再做一次线性：{inline(ntex(gf_e))}。",
            f"{inline(f'f({x0})={f_at}')}，再代入 g，得 {inline(str(gf))}。",
            f"已经知道 {inline(f'f(g({x0}))={fg}')}。二者{'相同' if fg==gf else '不同'}，所以复合一般不能换序。",
        ]
        ans = f"{inline(ntex(gf_e))}，{inline(f'g(f({x0}))={gf}')}，与 {inline(str(fg))} {'相等' if fg==gf else '不相等'}。"
    return HW(stem, steps, ans, "3.4cm")


def hw_parity(rng):
    expr = rng.choice([x**3 - 2 * x, x**4 + 3 * x**2, x**3 + x**2, 2 * x**5 + x])
    kind = poly_parity(expr)
    stem = f"判断 {inline('f(x)=' + ntex(expr))} 的奇偶性，写出 {inline('f(-x)')} 的化简过程。定义域是全体实数。"
    fx = sp.expand(expr.subs(x, -x))
    steps = [
        "定义域关于 0 对称，可以讨论奇偶。",
        f"{inline('f(-x)=' + ntex(fx))}。",
        f"它{'等于' if kind in ('even','both') else '不等于'} {inline('f(x)')}，{'等于' if kind in ('odd','both') else '不等于'} {inline('-f(x)')}。",
        f"所以是{PARITY_TEXT[kind]}。",
    ]
    return HW(stem, steps, PARITY_TEXT[kind])


def hw_domain_parity(rng):
    a = rng.choice([1, 2, 3])
    expr = sp.sqrt(x + a)
    stem = f"说明 {inline('f(x)=' + ntex(expr))} 为什么既不是奇函数也不是偶函数。不要只代一个点。"
    ivs = domain_sqrt_linear(1, a)
    assert_domain(expr, ivs)
    need = inline("x+" + str(a) + r"\ge 0")
    dom = inline(set_tex(ivs))
    out_pt = inline("x=-" + str(a + 1))
    in_pt = inline("x=" + str(a + 1))
    steps = [
        f"根号要求 {need}，定义域是 {dom}。",
        f"这个定义域不关于 0 对称：{out_pt} 不在定义域里，而 {in_pt} 在。",
        "奇偶性的前提是定义域关于 0 对称。前提不成立，就既非奇也非偶。",
    ]
    return HW(stem, steps, "既不是奇函数也不是偶函数。")


def hw_inverse(rng):
    ray = inline(r"[0,+\infty)")
    stem = f"说明 {inline('y=x^2')} 在全体实数上为什么没有反函数。若限制到 {ray}，求出反函数，并计算它在 9 与 4 处的值。"
    inv_x = inline(r"x=\sqrt{y}")
    inv_y = inline(r"y=\sqrt{x}")
    v9 = inline(r"\sqrt{9}=3")
    v4 = inline(r"\sqrt{4}=2")
    steps = [
        "在全体实数上，4 既来自 2 也来自负 2，不是一一对应，因此没有反函数。",
        f"限制到 {ray} 后，每个非负 y 只来自一个非负 x，反函数是算术平方根 {inv_x}。",
        f"习惯写成 {inv_y}。于是 {v9}，{v4}。",
    ]
    return HW(stem, steps, inline(r"y=\sqrt{x}") + "（定义域为非负数），9 与 4 的对应值是 3 与 2。", "3.2cm")


def hw_interval(rng):
    a = rng.choice([-2, -1, 0, 1])
    c = a + rng.choice([2, 3])
    b = c + rng.choice([2, 3, 4])
    ivs = merge([Iv(a, True, c, False), Iv(c, False, b, False)])
    # a <= x < b, x != c, and if we want right open: a<=x<b except c
    ans = set_tex(ivs)
    desc = inline(str(a) + r"\le x<" + str(b) + r",\ x\neq " + str(c))
    stem = f"用区间表示 {desc}，并说明 {c} 为什么不能留在区间里。"
    steps = [
        f"不含右端点 {b}，所以右边是开的。",
        f"{c} 被排除，要在这里断开，左边一段含 {a}、不含 {c}。",
        f"写成 {inline(ans)}。",
    ]
    return HW(stem, steps, inline(ans))


def hw_is_fn(rng):
    stem = "判断下列对应是不是函数，并各用一句话说明理由：（1）学号对应学生；（2）学生对应本学期选修的全部课程；（3）每个正数对应它的两个平方根；（4）每个实数 x 对应它的立方。"
    steps = [
        "（1）是函数：每个学号只有一名学生，单值对应。",
        "（2）不是函数：一名学生可以对应多门课，一对多。",
        "（3）不是函数：一个正数有两个平方根。若改成只取非负根，才是函数。",
        "（4）是函数：每个实数只有一个立方，而且这个对应还是一一的。",
    ]
    return HW(stem, steps, "（1）（4）是函数；（2）（3）不是。", "3.4cm")


def hw_comp_domain(rng):
    a = rng.choice([1, 2, 3])
    g_show = inline("g(x)=x-" + str(a))
    f_show = inline(r"f(u)=\sqrt{u}")
    comp = inline("f(g(x))")
    stem = f"设 {g_show}，{f_show}。求 {comp} 的定义域，并说明要先看内层的值落在哪里。"
    ivs = [Iv(a, True, sp.oo, False)]
    expr = sp.sqrt(x - a)
    assert_domain(expr, ivs)
    u_ge = inline(r"u\ge 0")
    inner = inline("u=x-" + str(a))
    ineq = inline("x-" + str(a) + r"\ge 0")
    ray = inline("x\\ge " + str(a))
    steps = [
        f"外层平方根要求内层 {u_ge}。",
        f"内层 {inner}，所以 {ineq}，即 {ray}。",
        "复合的定义域不是外层定义域照抄，而是让内层的输出落进外层定义域。",
    ]
    return HW(stem, steps, inline(set_tex(ivs)))


def hw_period(rng):
    b = rng.choice([2, 3, 4])
    T = sp.Rational(2, b)
    fx = inline("f(x)=\\sin " + str(b) + "x")
    shift = inline("f(x+" + ntex(2 * sp.pi / b) + ")=f(x)")
    stem = f"求 {fx} 的最小正周期，并用代入说明 {shift}，而一半的长度不行。"
    full = inline(r"2\pi")
    eq = inline(str(b) + "T=2\\pi")
    ansT = inline("T=" + ntex(2 * sp.pi / b))
    half = inline(ntex(sp.pi / b))
    half_id = inline("\\sin(" + str(b) + r"x+\pi)=-\sin " + str(b) + "x")
    steps = [
        f"正弦的一个完整来回是 {full}。这里角的速度是 {b}，所以周期要除掉这个系数。",
        f"令 {eq}，得 {ansT}。",
        f"若取一半 {half}，则 {half_id}，一般不等于原函数。",
    ]
    return HW(stem, steps, inline(ntex(2 * sp.pi / b)))


def hw_range_floor(rng):
    # 再一道取整：[-2.5], [-2], [2.5] 已有 hw_floor_three
    # 分段三点另一组由 rng 保证不同题干
    return hw_floor_three(rng)


def build():
    bag = Bag(11011)
    bag.fill("定义域", lambda: q_domain(bag.rng), 28)
    bag.fill("分段", lambda: q_piecewise(bag.rng), 16)
    bag.fill("取整", lambda: q_floor(bag.rng), 14)
    bag.fill("复合", lambda: q_comp(bag.rng), 16)
    bag.fill("奇偶", lambda: q_parity(bag.rng), 10)
    bag.fill("周期", lambda: q_period(bag.rng), 4)
    bag.fill("区间", lambda: q_interval(bag.rng), 6)
    bag.fill("对应", lambda: q_relation(bag.rng), 6)
    makers = [
        ("定义域作业", hw_domain_mix),
        ("定义域作业2", hw_domain_mix),
        ("定义域作业3", hw_domain_mix),
        ("定义域作业4", hw_domain_mix),
        ("电价", hw_piece_word),
        ("电价2", hw_piece_word),
        ("分界点", hw_piece_point),
        ("分界点2", hw_piece_point),
        ("绝对值分段", hw_abs_piece),
        ("取整三个", hw_floor_three),
        ("取整三个2", hw_floor_three),
        ("复合展开", lambda rng: hw_comp(rng, "fg")),
        ("复合换序", lambda rng: hw_comp(rng, "gf")),
        ("复合定义域", hw_comp_domain),
        ("奇偶", hw_parity),
        ("定义域与奇偶", hw_domain_parity),
        ("反函数", hw_inverse),
        ("区间并", hw_interval),
        ("是不是函数", hw_is_fn),
        ("周期", hw_period),
    ]
    assert len(makers) == 20
    for name, fn in makers:
        bag.fill_hw(name, lambda fn=fn: fn(bag.rng))
    paper = Paper("11", "1.1 函数", "11-函数", bag.mcqs, bag.hws, quiz_columns=2)
    return paper
