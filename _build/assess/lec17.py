"""1.7 积分应用：面积、指数增长、半衰期、阻滞增长。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, ntex, x


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def q_area(rng):
    m = rng.choice([1, 2, 3, 4, 5, 6, 8])
    # y=mx 与 y=x^2，交于 0 与 m，上减下 mx-x^2，面积 m^3/6
    area = sp.Rational(m**3, 6)
    got = sp.simplify(sp.integrate(m * x - x**2, (x, 0, m)))
    if got != area:
        return None
    mode = rng.choice(["value", "upper", "bound"])
    if mode == "value":
        stem = "曲线 " + inline("y=x^2") + " 与直线 " + inline("y=" + str(m) + "x") + " 所围面积是"
        why = "交点是 0 与 " + str(m) + "。在中间直线在上，积分 " + inline(str(m) + "x-x^2") + " 得 " + inline(ntex(area)) + "。"
        return _mcq(rng, stem, area, [area * 2, sp.Rational(m**2, 2), sp.Rational(m**3, 3), sp.Integer(m)], why, "area")
    if mode == "upper":
        stem = "在 0 与 " + str(m) + " 之间，" + inline("y=" + str(m) + "x") + " 与 " + inline("y=x^2") + " 谁在上面"
        correct = "直线在上"
        why = "在 " + inline("(0," + str(m) + ")") + " 内 " + inline(str(m) + "x>x^2") + "。面积必须上减下，减反会得到负号。"
        return _mcq(rng, stem, correct, ["抛物线在上", "一样高", "要看从哪边看"], why, "area")
    stem = inline("y=x^2") + " 与 " + inline("y=" + str(m) + "x") + " 的交点横坐标是"
    return _mcq(rng, stem, "0 与 " + str(m), ["只有 0", "只有 " + str(m), str(-m) + " 与 " + str(m), "1 与 " + str(m)], "令 " + inline("x^2=" + str(m) + "x") + "，得 x=0 或 x=" + str(m) + "。积分限由交点决定。", "area")


def q_half(rng):
    k = rng.choice([1, 2, 3, 4, 5, 6])
    n0 = rng.choice([8, 16, 24, 40, 80])
    mode = rng.choice(["after", "count", "amount"])
    if mode == "after":
        # 经过 k 个半衰期，剩余 1/2^k
        stem = "经过 " + str(k) + " 个半衰期，放射性物质剩余原来的"
        correct = sp.Rational(1, 2**k)
        why = "每个半衰期剩一半，" + str(k) + " 个就是 1/2 的 " + str(k) + " 次方。"
        return _mcq(rng, stem, correct, [sp.Rational(k, 2), sp.Rational(1, k), sp.Rational(1, 2 * k), sp.Integer(k)], why, "half")
    # 剩余 1/2^k 是几个半衰期
    stem = "若剩余量是原来的 " + inline(ntex(sp.Rational(1, 2**k))) + "，经过了几个半衰期"
    why = "1/2 的 " + str(k) + " 次方等于这个分数，所以是 " + str(k) + " 个半衰期。本讲不讨论测量误差。"
    if mode == "count":
        return _mcq(rng, stem, k, [k + 1, k - 1 if k > 1 else 2, 2**k, 1], why, "half")
    left = n0 * sp.Rational(1, 2**k)
    stem = "初始 " + str(n0) + " 个单位，经过 " + str(k) + " 个半衰期后剩余"
    why = "每个半衰期乘 1/2，所以剩余 " + inline(ntex(left)) + "。"
    return _mcq(rng, stem, left, [n0 - k, sp.Rational(n0, k), n0 * k, left * 2], why, "half")


def q_de(rng):
    k = rng.choice([-3, -2, -1, 1, 2, 3, 4])
    y0 = rng.choice([1, 2, 3, 4, 5])
    expr = y0 * sp.exp(k * x)
    # 验证 y'=k y
    if sp.simplify(sp.diff(expr, x) - k * expr) != 0:
        return None
    stem = "解 " + inline("y'=" + str(k) + "y") + "，" + inline("y(0)=" + str(y0))
    why = "y'=ky 的解是指数。初值放在系数上：" + inline("y=" + ntex(expr)) + "。增长和衰减只差 k 的符号。"
    wrongs = [
        y0 * sp.exp(x / k) if k != 0 else y0,
        k * sp.exp(y0 * x),
        y0 + sp.exp(k * x),
        sp.exp(k * x),
    ]
    return _mcq(rng, stem, expr, wrongs, why, "de")


def q_logi(rng):
    r = rng.choice([sp.Rational(1, 2), 1, 2, 3])
    K = rng.choice([20, 50, 80, 100, 200])
    mode = rng.choice(["small", "cap", "name"])
    if mode == "small":
        stem = "阻滞增长里 r=" + inline(ntex(r)) + "，K=" + str(K) + "。当 y 远小于 K 时，增长大约是"
        correct = inline("y'=" + ntex(r) + "y")
        why = "离天花板很远时，(1-y/K) 接近 1，所以大约是指数增长 y'=ry。r 是着急程度，不是天花板。"
        return _mcq(rng, stem, correct, [inline("y'=" + str(K) + "y"), inline("y'=0"), inline("y'=" + ntex(r) + "(y-" + str(K) + ")")], why, "logi")
    if mode == "cap":
        stem = "阻滞增长 K=" + str(K) + "。当 y 接近 K 时，增长速度"
        correct = "接近 0"
        why = "K 是天花板。y 靠近 K 时括号里的因子接近 0，增长停下来，不会因为 r 大就继续冲过天花板。"
        return _mcq(rng, stem, correct, ["变得很大", "变成负的而且绝对值很大", "等于 r"], why, "logi")
    stem = "在 y'=" + inline(ntex(r) + "y\\left(1-\\dfrac{y}{" + str(K) + "}\\right)") + " 里，K 表示"
    correct = "环境能容纳的上限"
    why = "r 是增长速度的系数，K 是天花板。两者不要对调。"
    return _mcq(rng, stem, correct, ["增长速度", "初始数量", "半衰期"], why, "logi")


def hw_area(rng):
    m = rng.choice([1, 2, 3, 4, 5, 6, 8])
    area = sp.Rational(m**3, 6)
    steps = [
        "交点：" + inline("x^2=" + str(m) + "x") + "，所以 x=0 或 x=" + str(m) + "。",
        "在 0 与 " + str(m) + " 之间，直线 " + str(m) + "x 在抛物线上方。被积函数是上减下：" + inline(str(m) + "x-x^2") + "。",
        "原函数 " + inline(ntex(m * x**2 / 2 - x**3 / 3)) + "。上限代入得 " + inline(ntex(area)) + "，下限是 0。",
    ]
    stem = "求 " + inline("y=x^2") + " 与 " + inline("y=" + str(m) + "x") + " 所围图形的面积，写清交点和谁减谁。"
    return HW(stem, steps, inline(ntex(area)), "3.6cm")


def hw_half(rng):
    k = rng.choice([2, 3, 4, 5, 6])
    steps = [
        "每过一个半衰期，剩下原来的 1/2。",
        str(k) + " 个半衰期后剩下 " + inline("1/2^{" + str(k) + "}") + "=" + inline(ntex(sp.Rational(1, 2**k))) + "。",
        "反过来，若测得只剩这个分数，就说明经过了 " + str(k) + " 个半衰期。本讲只练这个换算。",
    ]
    stem = "某种放射性物质的半衰期记为 T。剩余原来的 " + inline(ntex(sp.Rational(1, 2**k))) + " 时，经过了几个半衰期？先写出剩余比例与个数的关系。"
    return HW(stem, steps, str(k) + " 个半衰期。")


def hw_de(rng):
    k = rng.choice([2, 3, -2, 4])
    y0 = rng.choice([2, 3, 5])
    expr = y0 * sp.exp(k * x)
    steps = [
        "方程 y'=" + str(k) + "y 表示变化率与现有量成正比。",
        "通解是 " + inline("y=Ce^{" + str(k) + "x}") + "。",
        "y(0)=" + str(y0) + " 给出 C=" + str(y0) + "，所以 " + inline("y=" + ntex(expr)) + "。",
        "求导验算：导数是 " + inline(ntex(sp.diff(expr, x))) + "，等于 " + str(k) + " 乘 y。",
    ]
    stem = "求解 " + inline("y'=" + str(k) + "y") + "，" + inline("y(0)=" + str(y0)) + "，并求导验算。"
    return HW(stem, steps, inline("y=" + ntex(expr)), "3.4cm")


def hw_logi(rng):
    r = rng.choice([1, 2, 3])
    K = rng.choice([50, 100, 200])
    steps = [
        "公式是 y'=ry(1-y/K)。r=" + str(r) + " 管「有多着急」，K=" + str(K) + " 管「天花板在哪」。",
        "当 y 远小于 " + str(K) + " 时，" + inline("1-y/K") + " 接近 1，增长近似 " + inline("y'=" + str(r) + "y") + "，像指数增长。",
        "当 y 接近 " + str(K) + " 时，括号里接近 0，增长速度接近 0，曲线变平。",
        "不能把 r 和 K 对调：把天花板放进指数的系数，形状就错了。",
    ]
    stem = "用自己的话说明阻滞增长 y'=r y (1-y/K) 里 r=" + str(r) + "、K=" + str(K) + " 各管什么。分别写出 y 很小和 y 接近 K 时的近似。"
    return HW(stem, steps, "r 管快慢，K 管上限。很小的时候大约是指数增长，靠近 K 时增长趋于 0。", "3.4cm")


def build():
    bag = Bag(17017)
    bag.fill("面积", lambda: q_area(bag.rng), 19)
    bag.fill("半衰期", lambda: q_half(bag.rng), 30)
    bag.fill("指数", lambda: q_de(bag.rng), 28)
    bag.fill("阻滞", lambda: q_logi(bag.rng), 23)
    makers = [hw_area] * 6 + [hw_half] * 5 + [hw_de] * 5 + [hw_logi] * 4
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("17", "1.7 积分应用", "17-积分应用", bag.mcqs, bag.hws, 2)
