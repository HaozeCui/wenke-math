"""2.3 线性方程组。det=0 不等于无解。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, mtex, ntex, rref_steps


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _square(rng, n):
    for _ in range(40):
        A = sp.Matrix(n, n, lambda i, j: rng.choice([-2, -1, 0, 1, 2, 3]))
        if A.det() == 0 or abs(A.det()) > 12:
            continue
        sol = sp.Matrix(n, 1, lambda i, j: rng.choice([-2, -1, 1, 2, 3]))
        b = sp.simplify(A * sol)
        if sp.simplify(A.solve(b) - sol) != sp.zeros(n, 1):
            continue
        return A, b, sol
    return None


def q_unique(rng):
    n = 2 if rng.random() < 0.6 else 3
    got = _square(rng, n)
    if got is None:
        return None
    A, b, sol = got
    k = rng.randrange(n)
    stem = "方程组 " + inline(mtex(A) + r"\mathbf{x}=" + mtex(b)) + " 的第 " + str(k + 1) + " 个未知数是"
    why = "系数行列式不为 0，解唯一。第 " + str(k + 1) + " 个未知数是 " + inline(ntex(sol[k])) + "。不要看到有 0 就说无解。"
    wrongs = [sol[(k + 1) % n], -sol[k], sol[k] + 1, 0]
    return _mcq(rng, stem, sol[k], wrongs, why, "unique")


def q_none(rng):
    a = rng.randint(-3, 4)
    c = rng.choice([2, -2, 3])
    b = rng.randint(-2, 3)
    # x+y=a, c x + c y = b，当 b!=c*a 时无解
    right = c * a + rng.choice([1, 2, -1, 3])
    stem = "方程组 " + inline("x+y=" + str(a)) + "，" + inline(str(c) + "x+" + str(c) + "y=" + str(right)) + " 的解是"
    why = "第二行是第一行的 " + str(c) + " 倍时左边成比例，但右边不是，出现 0=非 0。无解。det=0 本身不能单独推出无解。"
    if right == c * a:
        return None
    return _mcq(rng, stem, "无解", ["唯一解", "无穷多解", "只有零解"], why, "none")


def q_inf(rng):
    p = rng.randint(-2, 4)
    q = rng.randint(-2, 3)
    # x+y+z=p, y-z=q, z=t
    # y=q+t, x=p-y-z=p-q-2t
    stem = "已知 x+y+z=" + str(p) + "，y-z=" + str(q) + "，z 自由。解的情况是"
    why = "没有 0=1，未知数比有效方程多，z 是一个参数。通解必须把参数写出来，不能只给一个特解。"
    return _mcq(
        rng,
        stem,
        "无穷多解，需要 1 个参数",
        ["唯一解", "无解", "无穷多解，需要 2 个参数", "只有零解"],
        why,
        "inf",
    )


def q_param(rng):
    p = rng.randint(0, 5)
    q = rng.randint(-2, 3)
    # x = p-q-2t
    stem = "x+y+z=" + str(p) + "，y-z=" + str(q) + "，令 z=t。则 x 等于"
    correct = inline(str(p - q) + "-2t")
    why = "由 y-z=" + str(q) + " 得 y=" + str(q) + "+t。代入第一个方程，x=" + str(p) + "-(y+z)=" + str(p - q) + "-2t。"
    return _mcq(
        rng,
        stem,
        correct,
        [inline(str(p - q) + "+t"), inline(str(q) + "+t"), inline(str(p) + "-t"), "0"],
        why,
        "param",
    )


def q_io(rng):
    a = sp.Rational(rng.choice([1, 2]), 5)
    b = sp.Rational(rng.choice([1, 2, 3]), 10)
    c = sp.Rational(rng.choice([1, 2]), 5)
    d = sp.Rational(rng.choice([1, 3]), 10)
    A = sp.Matrix([[a, b], [c, d]])
    M = sp.eye(2) - A
    stem = "消耗矩阵 " + inline("A=" + mtex(A)) + "。投入产出 (I-A)x=d 的系数矩阵 I-A 是"
    why = "总产出 x 满足 x=Ax+d，移项得 (I-A)x=d。I-A 就是单位阵减去消耗矩阵，不是 A 本身。"
    return _mcq(rng, stem, mtex(M), [mtex(A), mtex(sp.eye(2) + A), mtex(-A), "不必写矩阵"], why, "io")


def hw_unique(rng):
    got = _square(rng, 3)
    if got is None:
        return None
    A, b, sol = got
    aug = A.row_join(b)
    reduced, steps = rref_steps(aug)
    if reduced[:, :3] != sp.eye(3):
        return None
    if sp.simplify(reduced[:, 3] - sol) != sp.zeros(3, 1):
        return None
    # 步骤可能很长，只保留前若干并补结论
    use = steps[:8] if len(steps) > 8 else steps
    use = use + ["阶梯形左边成为单位阵，右边就是解 " + inline(mtex(sol)) + "。代回原方程可以复核。"]
    stem = "用消元法解 " + inline(mtex(A) + r"\mathbf{x}=" + mtex(b)) + "，写出主要的行变换。"
    return HW(stem, use, inline(mtex(sol)), "4.2cm")


def hw_param(rng):
    p = rng.randint(1, 6)
    q = rng.randint(-2, 4)
    steps = [
        "没有出现 0=1，z 没有被定死，令 z=t。",
        "由 y-z=" + str(q) + " 得 y=" + str(q) + "+t。",
        "代入 x+y+z=" + str(p) + "，得 x=" + str(p - q) + "-2t。",
        "向量形式是特解加 t 乘方向。t=0 和 t=1 都应代回原方程。",
    ]
    ans = inline("x=" + str(p - q) + "-2t,\\ y=" + str(q) + "+t,\\ z=t")
    stem = "解 x+y+z=" + str(p) + "，y-z=" + str(q) + "。把自由未知数写成参数，三个未知数都要用参数表示。"
    return HW(stem, steps, ans, "3.4cm")


def hw_none(rng):
    a = rng.randint(-2, 4)
    gap = rng.choice([1, 2, 3])
    steps = [
        "第二式左边是第一式的 2 倍。",
        "若有解，右边也应是第一式右边的 2 倍，即 " + str(2 * a) + "。",
        "现在右边是 " + str(2 * a + gap) + "，消元后得到 0=" + str(gap) + "。",
        "这是无解。不要继续硬解，也不要因为系数成比例就说成无穷多解。",
    ]
    stem = "判断方程组 x+y=" + str(a) + "，2x+2y=" + str(2 * a + gap) + " 是否有解，并指出矛盾出现在哪一行。"
    return HW(stem, steps, "无解，因为出现 0=" + str(gap) + "。")


def hw_io(rng):
    A = sp.Matrix([
        [sp.Rational(rng.choice([1, 2]), 5), sp.Rational(rng.choice([1, 2, 3]), 5)],
        [sp.Rational(rng.choice([1, 2, 3]), 10), sp.Rational(rng.choice([1, 3]), 10)],
    ])
    M = sp.eye(2) - A
    steps = [
        "x 是各部门总产出，d 是最终需求，Ax 是中间消耗。",
        "平衡式是 x=Ax+d。",
        "移项得 (I-A)x=d。系数矩阵是 " + inline(mtex(M)) + "。",
        "这仍是普通线性方程组。I-A 不可逆时，某些需求可能无解或解不唯一，不是「det=0 就一定无解」那一句能说完的。",
    ]
    stem = "设直接消耗矩阵 " + inline("A=" + mtex(A)) + "。写出 (I-A)x=d 的系数矩阵，并说明 x 与 d 各是什么。"
    return HW(stem, steps, inline("I-A=" + mtex(M)) + "。x 是总产出，d 是最终需求。", "3.6cm")


def build():
    bag = Bag(23023)
    bag.fill("唯一", lambda: q_unique(bag.rng), 30)
    bag.fill("无解", lambda: q_none(bag.rng), 18)
    bag.fill("无穷", lambda: q_inf(bag.rng), 16)
    bag.fill("参数", lambda: q_param(bag.rng), 18)
    bag.fill("投入产出", lambda: q_io(bag.rng), 18)
    makers = [hw_unique] * 6 + [hw_param] * 5 + [hw_none] * 4 + [hw_io] * 5
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("23", "2.3 一般线性方程组", "23-方程组", bag.mcqs, bag.hws, 1)
