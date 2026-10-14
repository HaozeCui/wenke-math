"""1.4 导数的应用。洛必达只考不定式，拐点不考繁算。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, ntex, x


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def q_mono(rng):
    p = rng.randint(-4, 1)
    q = rng.randint(p + 1, 5)
    mode = rng.choice(["inc", "dec", "crit", "left"])
    deriv = "(x-" + str(p) + ")(x-" + str(q) + ")"
    if mode == "crit":
        stem = inline("f'(x)=" + deriv) + "。f 的驻点是"
        correct = str(p) + " 与 " + str(q)
        why = "令 f'=0，得到 x=" + str(p) + " 与 x=" + str(q) + "。驻点还要配合符号才能判断升降。"
        return _mcq(rng, stem, correct, ["只有 0", str(p), str(q), str(p + q)], why, "mono")
    if mode == "inc":
        stem = inline("f'(x)=" + deriv) + "。在 " + inline("(" + str(q) + ",+\\infty)") + " 上，f"
        correct = "单调增加"
        why = "x 大于较大的根 " + str(q) + " 时，两个因式都为正，f'>0。"
    elif mode == "left":
        stem = inline("f'(x)=" + deriv) + "。在 " + inline("(-\\infty," + str(p) + ")") + " 上，f"
        correct = "单调增加"
        why = "x 小于较小的根时，两个因式都为负，乘积为正，f'>0，函数增加。"
    else:
        stem = inline("f'(x)=" + deriv) + "。在 " + inline("(" + str(p) + "," + str(q) + ")") + " 上，f"
        correct = "单调减少"
        why = "两根之间 f' 为负，函数减少。"
    return _mcq(rng, stem, correct, ["单调增加", "单调减少", "先增后减", "是常数"], why, "mono")


def q_second(rng):
    a = rng.choice([1, 2, 3])
    # f = x^3/3 - a^2 x，f''=2x
    # x=a: f''>0 极小；x=-a: f''<0 极大
    point = a if rng.random() < 0.5 else -a
    stem = inline("f(x)=x^3/3-" + str(a**2) + "x") + "，" + inline("f''(x)=2x") + "。驻点 x=" + str(point) + " 是"
    if point > 0:
        correct = "极小值点"
        why = "f''(" + str(point) + ")=" + str(2 * point) + ">0，该驻点是极小。这只是局部，闭区间上还要比端点。"
    else:
        correct = "极大值点"
        why = "f''(" + str(point) + ")=" + str(2 * point) + "<0，该驻点是极大。"
    return _mcq(rng, stem, correct, ["极大值点", "极小值点", "拐点，不能判断极值", "不是驻点"], why, "second")


def q_lhop(rng):
    k = rng.choice([1, 2, 3, 4, -2, -1])
    mode = rng.choice(["sin", "exp", "poly", "not", "inf"])
    if mode == "sin":
        expr = sp.sin(k * x) / x
        expect = k
        form = "0/0"
        x0 = 0
    elif mode == "exp":
        expr = (sp.exp(k * x) - 1) / x
        expect = k
        form = "0/0"
        x0 = 0
    elif mode == "poly":
        a = rng.choice([2, 3, 4])
        expr = (x**2 - a**2) / (x - a)
        expect = 2 * a
        form = "0/0"
        x0 = a
    elif mode == "inf":
        a = rng.choice([2, 3, -2, 4])
        c = rng.choice([1, 2, -1])
        expr = (a * x**2 + 1) / (c * x**2 + 3)
        expect = sp.Rational(a, c)
        form = "∞/∞"
        x0 = None
    else:
        # 不是不定式
        p = rng.choice([1, 2, 3])
        q = rng.choice([2, 3, 4])
        expr = (x + p) / (x + q)
        expect = sp.Rational(p, q)  # x->0
        form = "不是"
        x0 = 0
    if x0 is None:
        got = sp.limit(expr, x, sp.oo)
        stem = "极限 " + inline("\\lim_{x\\to+\\infty}" + ntex(expr))
    else:
        got = sp.limit(expr, x, x0)
        stem = "极限 " + inline("\\lim_{x\\to " + str(x0) + "}" + ntex(expr))
    if sp.simplify(got - expect) != 0:
        return None
    ask = rng.choice(["value", "form"])
    if ask == "form":
        if form == "不是":
            correct = "不是不定式，不能直接用洛必达"
            why = "代入后分母不是 0，分子也不是 0。先看型。这里直接得 " + inline(ntex(expect)) + "。"
        elif form == "∞/∞":
            correct = "是 ∞/∞，可以用洛必达或看最高次"
            why = "分子分母同时趋向无穷，才是不定式。结果是最高次系数之比 " + inline(ntex(expect)) + "。"
        else:
            correct = "是 0/0，可以用洛必达"
            why = "分子分母同时趋向 0，是 0/0。洛必达之后得到 " + inline(ntex(expect)) + "。"
        return _mcq(
            rng,
            stem + " 属于",
            correct,
            [
                "是 0/0，可以用洛必达",
                "是 ∞/∞，可以用洛必达或看最高次",
                "不是不定式，不能直接用洛必达",
                "是 1/0，极限一定无穷",
            ],
            why,
            "lhop",
        )
    why = "先判断是不是不定式。"
    if form == "不是":
        why += "不是不定式，直接代入得 " + inline(ntex(expect)) + "。若误用洛必达，会对分子分母分别求导，得到另一个数。"
    else:
        why += "是" + form + "，结果为 " + inline(ntex(expect)) + "。"
    wrong_diff = sp.simplify(sp.diff(sp.numer(sp.together(expr)), x) / sp.diff(sp.denom(sp.together(expr)), x))
    # 对非不定式，wrong_diff 是误用洛必达的结果；对不定式它可能就是答案
    wrongs = [expect + 1, 0, 1, wrong_diff]
    stem = "求 " + stem
    return _mcq(rng, stem, expect, wrongs, why, "lhop")


def q_quad_max(rng):
    h = rng.randint(-2, 4)
    k = rng.choice([3, 5, 8, -4])
    # f = - (x-h)^2 + k  若想开口向下
    sign = rng.choice([-1, 1])
    expr = sign * (x - h) ** 2 + k
    if sign < 0:
        correct = "在 x=" + str(h) + " 取得最大值 " + str(k)
        why = "二次项系数为负，抛物线开口向下，顶点就是最大值。"
    else:
        correct = "在 x=" + str(h) + " 取得最小值 " + str(k)
        why = "二次项系数为正，开口向上，顶点是最小值。"
    stem = inline("f(x)=" + ntex(sp.expand(expr))) + " 的最值情况是"
    return _mcq(
        rng,
        stem,
        correct,
        [
            "在 x=" + str(h) + " 取得最大值 " + str(k),
            "在 x=" + str(h) + " 取得最小值 " + str(k),
            "在 x=" + str(k) + " 取得最值 " + str(h),
            "没有最值",
        ],
        why,
        "quad",
    )


def hw_sign(rng):
    a = rng.choice([1, 2, 3, 4])
    expr = x**3 / 3 - a**2 * x
    steps = [
        inline("f'=x^2-" + str(a**2) + "=(x-" + str(a) + ")(x+" + str(a) + ")") + "。",
        "驻点 x=-" + str(a) + " 与 x=" + str(a) + "。",
        "在 (-∞,-" + str(a) + ") 上 f'>0，增加；在 (-" + str(a) + "," + str(a) + ") 上 f'<0，减少；在 (" + str(a) + ",+∞) 上又增加。",
        "x=-" + str(a) + " 是极大，x=" + str(a) + " 是极小。f''=2x 可以复核符号。",
    ]
    stem = "对 " + inline("f(x)=" + ntex(expr)) + " 列出升降区间，并指出极大、极小点。"
    return HW(stem, steps, "极大点 x=-" + str(a) + "，极小点 x=" + str(a) + "。", "3.6cm")


def hw_lhop(rng):
    k = rng.choice([2, 3, 4, 5])
    expr = sp.sin(k * x) / x
    if sp.limit(expr, x, 0) != k:
        return None
    steps = [
        "x→0 时分子 sin(" + str(k) + "x)→0，分母→0，是 0/0，可以用洛必达。",
        "分子导数 " + inline(str(k) + "\\cos " + str(k) + "x") + "，分母导数 1。",
        "再代入 x=0，得 " + inline(str(k)) + "。",
    ]
    stem = "先判断类型，再求 " + inline("\\lim_{x\\to 0}" + ntex(expr)) + "。"
    return HW(stem, steps, inline(str(k)))


def hw_not(rng):
    p = rng.choice([1, 2])
    q = p + rng.choice([2, 3])
    expr = (x**2 + p) / (x + q)
    # x->0 不是不定式
    expect = sp.Rational(p, q)
    if sp.limit(expr, x, 0) != expect:
        return None
    steps = [
        "x→0 时分子趋向 " + str(p) + "，分母趋向 " + str(q) + "，都不是 0，不是不定式。",
        "不能对分子分母分别求导。直接得 " + inline(ntex(expect)) + "。",
        "若误用洛必达，会得到另一个数，那是错的。",
    ]
    stem = "判断 " + inline("\\lim_{x\\to 0}" + ntex(expr)) + " 能不能用洛必达，并求值。"
    return HW(stem, steps, "不能用洛必达。极限是 " + inline(ntex(expect)) + "。")


def hw_fence(rng):
    L = rng.choice([12, 16, 20, 24])
    # 靠墙：两宽一长，2x+y=L，面积 A=x(L-2x)
    # A'=L-4x=0, x=L/4, y=L/2, A=L^2/8
    xstar = sp.Rational(L, 4)
    ystar = sp.Rational(L, 2)
    area = sp.Rational(L * L, 8)
    steps = [
        "靠墙的一边不必用篱笆。设垂直于墙的边为 x，则平行于墙的边是 " + str(L) + "-2x。",
        "面积 " + inline("A=x(" + str(L) + "-2x)=" + str(L) + "x-2x^2") + "。",
        "A'=" + str(L) + "-4x=0，得 x=" + inline(ntex(xstar)) + "。此时 y=" + inline(ntex(ystar)) + "。",
        "A''=-4<0，是极大。最大面积是 " + inline(ntex(area)) + "。x 不能取 0 或 " + inline(ntex(sp.Rational(L, 2))) + "，那两端面积为 0。",
    ]
    stem = "用总长 " + str(L) + " 的篱笆靠墙围矩形菜地（墙本身不算篱笆）。求最大面积，并写出面积函数。"
    return HW(stem, steps, "最大面积 " + inline(ntex(area)) + "。", "3.8cm")


def hw_cyl(rng):
    r = rng.choice([1, 2, 3, 4])
    closed = rng.random() < 0.5
    if closed:
        Vcoef = 2 * r**3
        steps = [
            "体积 " + inline("\\pi r^2 h=" + str(Vcoef) + "\\pi") + "，所以 " + inline("h=" + str(Vcoef) + "/r^2") + "。",
            "上下底都要材料：" + inline("S=2\\pi rh+2\\pi r^2") + "。",
            "代入 h 后对 r 求导，得 " + inline("r^3=" + str(r**3)) + "，所以 r=" + str(r) + "。",
            "半径趋于 0 或趋于无穷时表面积都变大，这个临界点是最小值。",
        ]
        stem = "有盖圆柱桶容积为 " + str(Vcoef) + inline("\\pi") + "（上下底与侧面都计料）。求最省料的半径。"
    else:
        # 无盖：S=πr^2+2πrh，V=π r^2 h = Vcoef π，h=Vcoef/r^2
        # S=πr^2+2π Vcoef/r，S'=2πr - 2π Vcoef/r^2=0 => r^3=Vcoef
        Vcoef = r**3
        steps = [
            "无盖，只有一个底。体积 " + inline("\\pi r^2 h=" + str(Vcoef) + "\\pi") + "，" + inline("h=" + str(Vcoef) + "/r^2") + "。",
            inline("S=\\pi r^2+2\\pi rh=\\pi r^2+2\\pi\\cdot " + str(Vcoef) + "/r") + "。",
            "求导得 " + inline("2\\pi r-2\\pi\\cdot " + str(Vcoef) + "/r^2=0") + "，所以 " + inline("r^3=" + str(Vcoef)) + "，r=" + str(r) + "。",
            "这是最小值。半径不能取 0。",
        ]
        stem = "无盖圆柱桶容积为 " + str(Vcoef) + inline("\\pi") + "（只有一个底加侧面）。求最省料的半径。"
    return HW(stem, steps, "r=" + str(r) + "。", "3.8cm")


def build():
    bag = Bag(14014)
    bag.fill("升降", lambda: q_mono(bag.rng), 24)
    bag.fill("二阶", lambda: q_second(bag.rng), 6)
    bag.fill("洛必达", lambda: q_lhop(bag.rng), 40)
    bag.fill("二次最值", lambda: q_quad_max(bag.rng), 30)
    makers = [
        hw_sign, hw_sign, hw_sign, hw_sign,
        hw_lhop, hw_lhop, hw_lhop, hw_lhop,
        hw_not, hw_not, hw_not, hw_not,
        hw_fence, hw_fence, hw_fence,
        hw_cyl, hw_cyl, hw_cyl, hw_cyl, hw_cyl,
    ]
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("14", "1.4 导数的应用", "14-导数的应用", bag.mcqs, bag.hws, 2)
