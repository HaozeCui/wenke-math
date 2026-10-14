"""2.1 行列式。不练四阶展开。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, mtex, ntex


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _e(rng, zero=True, frac=False):
    if frac and rng.random() < 0.2:
        return sp.Rational(rng.choice([-3, -1, 1, 3]), 2)
    pool = [-4, -3, -2, -1, 1, 2, 3, 4, 5]
    if zero and rng.random() < 0.25:
        pool.append(0)
    return rng.choice(pool)


def _M2(rng, frac=False):
    return sp.Matrix(2, 2, lambda i, j: _e(rng, True, frac))


def _M3(rng, kind="sparse"):
    if kind == "tri":
        d = [_e(rng, False, False) for _ in range(3)]
        return sp.Matrix([[d[0], _e(rng), _e(rng)], [0, d[1], _e(rng)], [0, 0, d[2]]])
    if kind == "copy":
        row = [_e(rng, False, False), _e(rng, False, False), _e(rng, True, False)]
        k = rng.choice([1, -1, 2])
        return sp.Matrix([row, [k * v for v in row], [_e(rng), _e(rng), _e(rng, False)]])
    # 稀疏：第二行或一列多放 0
    M = sp.zeros(3)
    for i in range(3):
        for j in range(3):
            if i == 2 and j == 0:
                M[i, j] = 0
            else:
                M[i, j] = _e(rng, True, False)
    return M


def q_d2(rng):
    A = _M2(rng, rng.random() < 0.3)
    if A == sp.zeros(2):
        return None
    det = sp.simplify(A.det())
    stem = "计算行列式 " + inline(mtex(A))
    why = "二阶是 ad-bc，不是对角线相加，也不是把四项都乘起来。"
    a, b, c, d = A[0, 0], A[0, 1], A[1, 0], A[1, 1]
    return _mcq(rng, stem, det, [a * d + b * c, a * b - c * d, a + d, det + 1, a * d], why, "d2")


def q_d3(rng):
    kind = rng.choice(["tri", "tri", "sparse", "copy"])
    A = _M3(rng, kind if kind != "copy" else "sparse")
    if kind == "copy":
        A = _M3(rng, "copy")
        if A.det() != 0:
            return None
        stem = "行列式 " + inline(mtex(A))
        why = "前两行成比例（或相同），行列式为 0。不必把六项都算完。"
        return _mcq(rng, stem, 0, [1, -1, A[0, 0] * A[1, 1] * A[2, 2], 2], why, "d3")
    det = sp.simplify(A.det())
    diag = sp.simplify(A[0, 0] * A[1, 1] * A[2, 2])
    stem = "计算三阶行列式 " + inline(mtex(A))
    if kind == "tri":
        why = "上三角的行列式等于主对角相乘，其余项都含 0。这里是 " + inline(ntex(det)) + "。"
    else:
        why = "按沙流：三条主向相加，三条反向相减。结果 " + inline(ntex(det)) + "。不要只乘主对角。"
    return _mcq(rng, stem, det, [diag, -det if det != 0 else 1, det + A[0, 0], A[0, 0] + A[1, 1] + A[2, 2]], why, "d3")


def q_prop(rng):
    A = _M2(rng, False)
    det = sp.simplify(A.det())
    if det == 0:
        return None
    mode = rng.choice(["swap", "scale", "same"])
    if mode == "swap":
        B = sp.Matrix([A.row(1), A.row(0)])
        stem = "若 " + inline("\\det A=" + ntex(det)) + "，交换两行后的行列式是"
        why = "交换两行，行列式变号。这和有向面积一致。"
        return _mcq(rng, stem, -det, [det, 0, det * 2], why, "prop")
    if mode == "scale":
        k = rng.choice([2, 3, -2, 4])
        stem = "把行列式为 " + inline(ntex(det)) + " 的方阵某一行乘 " + str(k) + "，新行列式是"
        why = "一行乘 k，行列式乘 k，不是乘 k 的平方（那是两行都乘）。"
        return _mcq(rng, stem, det * k, [det, det * k * k, det + k], why, "prop")
    stem = "两行完全相同的行列式等于"
    why = "两行相同，交换它们行列式不变，又必须变号，所以只能是 0。"
    return _mcq(rng, stem, 0, [1, -1, det], why, "prop")


def q_cramer(rng):
    A = _M2(rng, False)
    det = sp.simplify(A.det())
    if det == 0 or abs(det) > 12:
        return None
    sol = sp.Matrix([rng.choice([-2, -1, 1, 2, 3]), rng.choice([-2, -1, 1, 2])])
    b = sp.simplify(A * sol)
    # 用克拉默复核
    A1 = A.copy()
    A1[:, 0] = b
    A2 = A.copy()
    A2[:, 1] = b
    x = sp.simplify(A1.det() / det)
    y = sp.simplify(A2.det() / det)
    if x != sol[0] or y != sol[1]:
        return None
    which = rng.choice(["x", "y"])
    val = x if which == "x" else y
    stem = "用克拉默法则解 " + inline(mtex(A) + mtex(sp.Matrix([sp.symbols("x"), sp.symbols("y")])) + "=" + mtex(b)) + " 中的 " + which
    # 上面的写法会变成 A*(x,y)=b 可能难读。改成方程组文字。
    stem = (
        "方程组 "
        + inline(ntex(A[0, 0]) + "x+" + ntex(A[0, 1]) + "y=" + ntex(b[0]))
        + "，"
        + inline(ntex(A[1, 0]) + "x+" + ntex(A[1, 1]) + "y=" + ntex(b[1]))
        + "。用克拉默法则，"
        + which
        + " 等于"
    )
    why = "x 是用常数列替换第一列后的行列式除以 D；y 替换第二列。这里 D=" + inline(ntex(det)) + "。"
    return _mcq(rng, stem, val, [val + 1, -val, det, y if which == "x" else x], why, "cramer")


def _sarrus_steps(A):
    a, b, c = A[0, 0], A[0, 1], A[0, 2]
    d, e, f = A[1, 0], A[1, 1], A[1, 2]
    g, h, i = A[2, 0], A[2, 1], A[2, 2]
    pos = [a * e * i, b * f * g, c * d * h]
    neg = [c * e * g, a * f * h, b * d * i]
    steps = ["三条正向：" + "，".join(inline(ntex(t)) for t in pos) + "。"]
    steps.append("三条反向，要减：" + "，".join(inline(ntex(t)) for t in neg) + "。")
    total = sp.simplify(sum(pos) - sum(neg))
    steps.append("相减得 " + inline(ntex(total)) + "。与对角公式核对一致。")
    if total != sp.simplify(A.det()):
        raise AssertionError("沙流与 det 不一致")
    return steps, total


def hw_sarrus(rng):
    A = sp.Matrix(3, 3, lambda i, j: rng.choice([-2, -1, 0, 1, 2, 3]))
    if A.row(0) == A.row(1):
        return None
    steps, total = _sarrus_steps(A)
    stem = "用沙流法计算 " + inline(mtex(A)) + "，六项都写出来。"
    return HW(stem, steps, inline(ntex(total)), "3.8cm")


def hw_tri(rng):
    d = [rng.choice([-3, -2, 2, 3, 4]) for _ in range(3)]
    A = sp.Matrix([[d[0], rng.choice([1, -2, 4]), rng.choice([-1, 2])], [0, d[1], rng.choice([3, -1])], [0, 0, d[2]]])
    det = sp.simplify(A.det())
    steps = [
        "这是上三角，主对角以下都是 0。",
        "六项里只有主对角那一项可能不是 0。",
        "行列式等于 " + inline(ntex(d[0]) + "\\cdot " + ntex(d[1]) + "\\cdot " + ntex(d[2]) + "=" + ntex(det)) + "。",
    ]
    stem = "计算上三角行列式 " + inline(mtex(A)) + "，并说明为什么不必把六项都乘。"
    return HW(stem, steps, inline(ntex(det)))


def hw_swap(rng):
    A = _M2(rng, False)
    det = A.det()
    if det == 0:
        return None
    B = sp.Matrix([A.row(1), A.row(0)])
    steps = [
        "原行列式 ad-bc=" + inline(ntex(det)) + "。",
        "交换两行得到 " + inline(mtex(B)) + "。",
        "换行变号，新行列式是 " + inline(ntex(-det)) + "。也可以直接再算一遍核对。",
    ]
    stem = "已知 " + inline(mtex(A)) + "。交换两行后行列式是多少？说明符号为什么要变。"
    return HW(stem, steps, inline(ntex(-det)))


def hw_cramer(rng):
    A = _M2(rng, False)
    det = sp.simplify(A.det())
    if det == 0 or abs(det) > 10:
        return None
    sol = sp.Matrix([rng.choice([-1, 1, 2, 3]), rng.choice([-2, 1, 2])])
    b = A * sol
    steps = [
        "D=ad-bc=" + inline(ntex(det)) + "。",
        "替换第一列，行列式是 " + inline(ntex(sp.Matrix([[b[0], A[0, 1]], [b[1], A[1, 1]]]).det())) + "，所以 x=" + inline(ntex(sol[0])) + "。",
        "替换第二列，得到 y=" + inline(ntex(sol[1])) + "。",
        "代回原方程可以复核。不要在 D=0 时还用克拉默。",
    ]
    stem = "用克拉默法则解 " + inline(ntex(A[0, 0]) + "x+" + ntex(A[0, 1]) + "y=" + ntex(b[0])) + "，" + inline(ntex(A[1, 0]) + "x+" + ntex(A[1, 1]) + "y=" + ntex(b[1])) + "。"
    return HW(stem, steps, inline("x=" + ntex(sol[0]) + ",\\ y=" + ntex(sol[1])), "3.6cm")


def build():
    bag = Bag(21021)
    bag.fill("二阶", lambda: q_d2(bag.rng), 28)
    bag.fill("三阶", lambda: q_d3(bag.rng), 28)
    bag.fill("性质", lambda: q_prop(bag.rng), 22)
    bag.fill("克拉默", lambda: q_cramer(bag.rng), 22)
    makers = [hw_sarrus] * 6 + [hw_tri] * 4 + [hw_swap] * 4 + [hw_cramer] * 6
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("21", "2.1 行列式", "21-行列式", bag.mcqs, bag.hws, 1)
