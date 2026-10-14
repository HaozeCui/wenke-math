"""1.6 定积分。牛顿–莱布尼茨是计算，黎曼和是定义。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, ntex, x


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _ival(f, lo, hi):
    val = sp.simplify(sp.integrate(f, (x, lo, hi)))
    if val.has(sp.Integral) or val.has(sp.oo) or not val.is_real:
        return None
    return val


def q_ftc(rng):
    n = rng.choice([1, 2, 3, 4])
    a = rng.choice([1, 2, 3, 4])
    c = rng.choice([-2, -1, 1, 2, 3])
    kind = rng.choice(["poly", "trig", "exp"])
    if kind == "poly":
        f = c * x**n
        lo, hi = 0, a
        why = "先找原函数，再代入上限减下限。这是牛顿–莱布尼茨，不是定义本身。"
    elif kind == "trig":
        f = sp.sin(x) if rng.random() < 0.5 else sp.cos(x)
        lo, hi = (0, sp.pi) if f == sp.sin(x) else (0, sp.pi / 2)
        why = "在 0 到 " + inline("\\pi") + " 上正弦的积分是 2；余弦到 " + inline("\\pi/2") + " 是 1。先算原函数再相减。"
    else:
        f = sp.exp(x)
        lo, hi = 0, sp.log(2)
        why = inline("e^x") + " 的原函数仍是 " + inline("e^x") + "。上限 " + inline("\\ln 2") + " 代入得 2，下限得 1，差是 1。"
    val = _ival(f, lo, hi)
    if val is None:
        return None
    stem = "计算 " + inline("\\int_{" + ntex(lo) + "}^{" + ntex(hi) + "}" + ntex(f) + r"\,dx")
    return _mcq(rng, stem, val, [val + 1, -val, val * 2, 0, sp.Integer(c)], why, "ftc")


def q_sym(rng):
    a = rng.choice([1, 2, 3, 4])
    odd = rng.random() < 0.55
    n = rng.choice([1, 3, 5]) if odd else rng.choice([2, 4])
    c = rng.choice([1, 2, 3])
    f = c * x**n
    val = _ival(f, -a, a)
    if val is None:
        return None
    stem = "计算 " + inline("\\int_{" + str(-a) + "}^{" + str(a) + "}" + ntex(f) + r"\,dx")
    if odd:
        why = "奇函数在对称区间上的定积分是 0。这是有号面积上下（左右）抵消，不必硬算。"
    else:
        why = "偶函数可以只算 0 到 " + str(a) + " 再乘 2。结果是 " + inline(ntex(val)) + "。"
    return _mcq(rng, stem, val, [val + c, -val if val != 0 else 1, sp.Integer(c * a), 2 * val + 1], why, "sym")


def q_geom(rng):
    r = rng.choice([1, 2, 3, 4, 5, 6])
    mode = rng.choice(["semi", "quarter", "abs", "line"])
    if mode == "semi":
        f = sp.sqrt(r**2 - x**2)
        lo, hi = -r, r
        val = sp.pi * r**2 / 2
        why = "这是半径 " + str(r) + " 的上半圆，面积是圆周率乘半径平方的一半，不必展开根式去找原函数。"
    elif mode == "quarter":
        f = sp.sqrt(r**2 - x**2)
        lo, hi = 0, r
        val = sp.pi * r**2 / 4
        why = "从 0 到半径，是四分之一圆，面积是圆周率乘半径平方的四分之一。"
    elif mode == "abs":
        f = sp.Abs(x)
        lo, hi = -r, r
        val = sp.Integer(r**2)
        why = "绝对值在对称区间上是两个三角形，面积是半径的平方。它不是奇函数积分那种抵消。"
    else:
        f = sp.Integer(r) - x
        lo, hi = 0, r
        val = sp.Rational(r**2, 2)
        why = "这是直线下面的三角形，底和高都是 " + str(r) + "，面积是半径平方的一半。"
    got = _ival(f, lo, hi)
    if got is None or sp.simplify(got - val) != 0:
        return None
    stem = "用几何意义计算 " + inline("\\int_{" + ntex(lo) + "}^{" + ntex(hi) + "}" + ntex(f) + r"\,dx")
    return _mcq(rng, stem, val, [val * 2, val / 2 if val != 0 else 1, sp.pi * r**2, sp.Integer(r)], why, "geom")


def q_prop(rng):
    a = rng.choice([1, 2, 3])
    b = a + rng.choice([1, 2])
    c = b + rng.choice([1, 2])
    f = x
    whole = _ival(f, a, c)
    left = _ival(f, a, b)
    right = _ival(f, b, c)
    rev = _ival(f, c, a)
    if None in (whole, left, right, rev):
        return None
    mode = rng.choice(["add", "swap"])
    if mode == "add":
        stem = inline("\\int_{" + str(a) + "}^{" + str(c) + "}x\\,dx") + " 等于哪一个"
        correct = ntex(left) + "+" + ntex(right)
        why = "区间可以在中间点拆开，两段积分相加。这里中间点是 " + str(b) + "。"
        return _mcq(rng, stem, correct, [ntex(left), ntex(right), ntex(whole + 1), ntex(rev)], why, "prop")
    stem = inline("\\int_{" + str(c) + "}^{" + str(a) + "}x\\,dx") + " 等于"
    why = "上下限对调，定积分变号。原积分是 " + inline(ntex(whole)) + "，对调后是它的相反数。"
    return _mcq(rng, stem, rev, [whole, 0, -whole + 1, left], why, "prop")


def q_signed(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2, 3, 4])
    c = rng.choice([1, 2, 3])
    f = c * x
    signed = _ival(f, -a, b)
    geom = _ival(c * sp.Abs(x), -a, b)
    if signed is None or geom is None or signed == geom:
        return None
    stem = inline("\\int_{" + str(-a) + "}^{" + str(b) + "}" + ntex(c) + "x\\,dx") + " 的值是有号面积，它等于"
    why = "x 轴下方的一块要带负号。几何面积（涂色多少）是 " + inline(ntex(geom)) + "，定积分是 " + inline(ntex(signed)) + "。"
    return _mcq(rng, stem, signed, [geom, -geom, 0, signed + geom], why, "signed")


def hw_ftc(rng):
    n = rng.choice([1, 2, 3])
    a = rng.choice([1, 2, 3])
    c = rng.choice([1, 2, 3, 4])
    f = c * x**n
    F = sp.simplify(sp.integrate(f, x))
    val = _ival(f, 0, a)
    if val is None:
        return None
    steps = [
        "原函数是 " + inline(ntex(F)) + "（定积分不要再写 +C）。",
        "上限 " + str(a) + " 代入得 " + inline(ntex(F.subs(x, a))) + "，下限 0 代入得 0。",
        "相减得 " + inline(ntex(val)) + "。",
    ]
    stem = "用牛顿–莱布尼茨计算 " + inline("\\int_0^{" + str(a) + "}" + ntex(f) + r"\,dx") + "。"
    return HW(stem, steps, inline(ntex(val)))


def hw_geom(rng):
    r = rng.choice([2, 3, 4, 5])
    mode = rng.choice(["semi", "abs"])
    if mode == "semi":
        val = sp.pi * r**2 / 2
        steps = [
            "被积函数是上半圆 " + inline("y=\\sqrt{" + str(r**2) + "-x^2}") + "，半径 " + str(r) + "。",
            "从 -" + str(r) + " 到 " + str(r) + " 正好是整个上半圆。",
            "面积是整圆的一半：" + inline(ntex(val)) + "。",
        ]
        stem = "用几何意义计算 " + inline("\\int_{-" + str(r) + "}^{" + str(r) + "}\\sqrt{" + str(r**2) + "-x^2}\\,dx") + "。不要去找反三角函数。"
        return HW(stem, steps, inline(ntex(val)), "3.2cm")
    val = r**2
    steps = [
        "把区间分成负半轴和正半轴。",
        "负半轴上 |x|=-x，积分是 " + inline(ntex(sp.Rational(r**2, 2))) + "；正半轴同样是这么多。",
        "合计 " + inline(str(val)) + "。这是两个三角形，不是有号抵消。",
    ]
    stem = "计算 " + inline("\\int_{-" + str(r) + "}^{" + str(r) + "}|x|\\,dx") + "，并说明它为什么不是 0。"
    return HW(stem, steps, inline(str(val)))


def hw_odd(rng):
    a = rng.choice([1, 2, 3, 4])
    n = rng.choice([1, 3])
    steps = [
        inline("x^{" + str(n) + "}") + " 是奇函数，区间 " + inline("[-" + str(a) + "," + str(a) + "]") + " 关于 0 对称。",
        "轴上与轴下（或左右）的有号面积抵消。",
        "所以定积分是 0。若问的是路程或涂色面积，才要把绝对值加回去。",
    ]
    stem = "说明 " + inline("\\int_{-" + str(a) + "}^{" + str(a) + "}x^{" + str(n) + "}\\,dx=0") + "，并指出这和「涂色面积」不是同一件事。"
    return HW(stem, steps, inline("0"))


def hw_signed(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2, 3, 4])
    signed = _ival(x, -a, b)
    geom = _ival(sp.Abs(x), -a, b)
    steps = [
        "原函数 " + inline("x^2/2") + "。上限 " + str(b) + " 得 " + inline(ntex(sp.Rational(b**2, 2))) + "，下限 -" + str(a) + " 得 " + inline(ntex(sp.Rational(a**2, 2))) + "。",
        "相减得定积分 " + inline(ntex(signed)) + "。",
        "几何面积要分段取绝对值，是 " + inline(ntex(geom)) + "。两者不同，因为负半轴的积分带了负号。",
    ]
    stem = "计算 " + inline("\\int_{-" + str(a) + "}^{" + str(b) + "}x\\,dx") + "，并与对应的几何面积比较。"
    return HW(stem, steps, "定积分 " + inline(ntex(signed)) + "，几何面积 " + inline(ntex(geom)) + "。", "3.4cm")


def build():
    bag = Bag(16016)
    bag.fill("公式", lambda: q_ftc(bag.rng), 36)
    bag.fill("奇偶", lambda: q_sym(bag.rng), 18)
    bag.fill("几何", lambda: q_geom(bag.rng), 18)
    bag.fill("性质", lambda: q_prop(bag.rng), 14)
    bag.fill("有号", lambda: q_signed(bag.rng), 14)
    makers = [hw_ftc] * 6 + [hw_geom] * 5 + [hw_odd] * 4 + [hw_signed] * 5
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("16", "1.6 定积分", "16-定积分", bag.mcqs, bag.hws, 2)
