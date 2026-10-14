"""1.8 二元函数。不考乘数法，Δ=0 不判定。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, mtex, ntex, x, y


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def q_dom(rng):
    mode = rng.choice(["disk", "out", "quad", "log", "hole"])
    r = rng.choice([1, 2, 3, 4, 5])
    if mode == "disk":
        stem = inline("f(x,y)=\\sqrt{" + str(r**2) + "-x^2-y^2}") + " 的自然定义域是"
        correct = "闭圆盘 " + inline("x^2+y^2\\le " + str(r**2))
        why = "根号内非负，是半径 " + str(r) + " 的圆盘，边界可以取到。"
        wrongs = ["挖去原点的全平面", "第一象限", "圆外 " + inline("x^2+y^2>" + str(r**2)), "开圆盘，不含边界"]
    elif mode == "out":
        stem = inline("f(x,y)=\\sqrt{x^2+y^2-" + str(r**2) + "}") + " 的自然定义域是"
        correct = "圆外及边界 " + inline("x^2+y^2\\ge " + str(r**2))
        why = "根号内 " + inline("x^2+y^2-" + str(r**2) + "\\ge 0") + "，是圆外（含圆周）。"
        wrongs = ["圆内", "全平面", "只有坐标轴", "第一象限"]
    elif mode == "quad":
        stem = inline("f(x,y)=\\sqrt{xy}") + " 的自然定义域是"
        correct = "第一、三象限（含坐标轴）"
        why = inline("xy\\ge 0") + "：同号或有一个为 0，就是第一、三象限连同两轴。"
        wrongs = ["只有第一象限", "全平面", "挖去原点", "第二、四象限"]
    elif mode == "log":
        stem = inline("f(x,y)=\\ln x+\\ln y") + " 的自然定义域是"
        correct = "第一象限内部 x>0 且 y>0"
        why = "两个对数都要求真数大于 0，坐标轴不能取。"
        wrongs = ["全平面", "第一象限含轴", inline("x^2+y^2>0"), "上半平面"]
    else:
        stem = inline("f(x,y)=\\dfrac{x^2-y^2}{x^2+y^2}") + " 的自然定义域是"
        correct = "挖去原点的全平面"
        why = "分母 " + inline("x^2+y^2") + " 只在原点为 0。别处都有定义。"
        wrongs = ["全平面", "单位圆内", "第一象限", "只有坐标轴"]
    return _mcq(rng, stem, correct, wrongs, why, "dom")


def q_path(rng):
    a = rng.choice([1, 2, 3, 4])
    b = rng.choice([1, 2, 3, 5])
    f = (a * x**2 - b * y**2) / (x**2 + y**2)
    along0 = sp.limit(f.subs(y, 0), x, 0)
    alongx = sp.limit(f.subs(x, 0), y, 0)
    if along0 != a or alongx != -b:
        return None
    mode = rng.choice(["y0", "x0", "dne"])
    if mode == "y0":
        stem = "令 " + inline("f=" + ntex(f)) + "。沿 y=0 趋向原点的极限是"
        why = "把 y=0 代入，f(x,0)=" + str(a) + "，极限是 " + str(a) + "。这只是一条路径。"
        return _mcq(rng, stem, a, [-b, 0, a + b, 1], why, "path")
    if mode == "x0":
        stem = "令 " + inline("f=" + ntex(f)) + "。沿 x=0 趋向原点的极限是"
        why = "把 x=0 代入，f(0,y)=-" + str(b) + "，极限是 " + inline(str(-b)) + "。"
        return _mcq(rng, stem, -b, [a, 0, b, a - b], why, "path")
    stem = inline("f=" + ntex(f)) + " 在原点的二重极限"
    why = "沿 y=0 得到 " + str(a) + "，沿 x=0 得到 " + str(-b) + "。两条路径不同，极限不存在。本讲以会判不存在为主。"
    return _mcq(rng, stem, "不存在", ["存在且为 0", "存在且为 " + str(a), "存在且为 " + str(-b)], why, "path")


def q_part(rng):
    a = rng.choice([1, 2, 3, -1, -2])
    b = rng.choice([1, 2, 3, 4])
    n = rng.choice([1, 2])
    f = a * x**2 * y + b * x * y**n
    which = rng.choice(["x", "y"])
    var = x if which == "x" else y
    deriv = sp.simplify(sp.diff(f, var))
    other = sp.simplify(sp.diff(f, y if which == "x" else x))
    if deriv == other:
        return None
    stem = "设 " + inline("f(x,y)=" + ntex(f)) + "。求 " + inline("f_" + which)
    why = "偏导是只把另一个变量当常数。对 " + which + " 求导得到 " + inline(ntex(deriv)) + "。"
    return _mcq(rng, stem, deriv, [other, sp.diff(f, x) + sp.diff(f, y), a * 2 * x * y, deriv * x], why, "part")


def q_double(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2, 3, 4])
    p = rng.choice([1, 2])
    q = rng.choice([1, 2])
    f = p * x + q * y
    val = sp.simplify(sp.integrate(sp.integrate(f, (y, 0, b)), (x, 0, a)))
    if val.has(sp.Integral):
        return None
    stem = "计算 " + inline("\\iint_D(" + ntex(f) + ")\\,dA") + "，D 为 " + inline("0\\le x\\le " + str(a)) + "，" + inline("0\\le y\\le " + str(b))
    why = "矩形上先对 y 再对 x。结果是 " + inline(ntex(val)) + "。先 x 后 y 应当相同。"
    return _mcq(rng, stem, val, [val * 2, val + a, sp.Integer(a * b), 0], why, "dint")


def q_hess(rng):
    m = rng.randint(-2, 3)
    n = rng.randint(-2, 3)
    mode = rng.choice(["min", "max", "saddle"])
    if mode == "min":
        f = (x - m) ** 2 + (y - n) ** 2
        correct = "局部极小"
        why = inline("f_{xx}=2") + "，" + inline("f_{yy}=2") + "，" + inline("f_{xy}=0") + "，" + inline("\\Delta=4>0") + " 且 " + inline("f_{xx}>0") + "，是局部极小。" + inline("\\Delta=0") + " 的情形本讲不判定。"
    elif mode == "max":
        f = -(x - m) ** 2 - (y - n) ** 2
        correct = "局部极大"
        why = "两个平方都带负号。" + inline("\\Delta>0") + " 且 " + inline("f_{xx}<0") + "，是局部极大。"
    else:
        f = (x - m) ** 2 - (y - n) ** 2
        correct = "鞍点"
        why = inline("\\Delta=f_{xx}f_{yy}-(f_{xy})^2<0") + "，是鞍点，不是极值。"
    # 核对临界点
    fx, fy = sp.diff(f, x), sp.diff(f, y)
    if sp.simplify(fx.subs({x: m, y: n})) != 0 or sp.simplify(fy.subs({x: m, y: n})) != 0:
        return None
    stem = inline("f(x,y)=" + ntex(sp.expand(f))) + " 在驻点 (" + str(m) + "," + str(n) + ") 处"
    return _mcq(rng, stem, correct, ["局部极小", "局部极大", "鞍点", "判别式为 0，本讲不判定"], why, "hess")


def hw_dom(rng):
    r = rng.choice([1, 2, 3, 4])
    steps = [
        "根号内 " + inline(str(r**2) + "-x^2-y^2\\ge 0") + "。",
        "这是圆心在原点、半径 " + str(r) + " 的圆盘，边界上根号为 0，可以取。",
        "用一句话：闭圆盘，不是挖去原点，也不是圆外。",
    ]
    stem = "求 " + inline("f(x,y)=\\sqrt{" + str(r**2) + "-x^2-y^2}") + " 的自然定义域，并用一句话描述形状。"
    return HW(stem, steps, "闭圆盘 " + inline("x^2+y^2\\le " + str(r**2)) + "。")


def hw_path(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2, 4])
    steps = [
        "沿 y=0：f(x,0)=" + str(a) + "，极限是 " + str(a) + "。",
        "沿 x=0：f(0,y)=-" + str(b) + "，极限是 " + str(-b) + "。",
        "两条路径结果不同，所以二重极限不存在。再多找一条相同的路径也不能推翻这个结论。",
    ]
    f = (a * x**2 - b * y**2) / (x**2 + y**2)
    stem = "用两条路径说明 " + inline("f(x,y)=" + ntex(f)) + " 在 (0,0) 的二重极限不存在。"
    return HW(stem, steps, "不存在。", "3.2cm")


def hw_part(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2, -1])
    f = a * x**2 * y + b * sp.exp(x * y)
    fx = sp.simplify(sp.diff(f, x))
    fy = sp.simplify(sp.diff(f, y))
    steps = [
        "对 x：把 y 当常数。" + inline("x^2 y") + " 变成 " + inline("2axy") + "，指数 " + inline("e^{xy}") + " 要乘 y。",
        inline("f_x=" + ntex(fx)) + "。",
        "对 y：把 x 当常数。得到 " + inline("f_y=" + ntex(fy)) + "。",
    ]
    stem = "求 " + inline("f(x,y)=" + ntex(f)) + " 的两个偏导，并注明哪个变量被当成常数。"
    return HW(stem, steps, inline("f_x=" + ntex(fx)) + "，" + inline("f_y=" + ntex(fy)), "3.4cm")


def hw_double(rng):
    a = rng.choice([1, 2])
    b = rng.choice([1, 2, 3])
    f = x + y
    val = sp.integrate(sp.integrate(f, (y, 0, b)), (x, 0, a))
    steps = [
        "矩形 " + inline("0\\le x\\le " + str(a)) + "，" + inline("0\\le y\\le " + str(b)) + "。先对 y：把 x 当常数。",
        "内层 " + inline("\\int_0^{" + str(b) + "}(x+y)\\,dy") + " 等于 " + inline(ntex(b * x + sp.Rational(b**2, 2))) + "。",
        "再对 x 从 0 到 " + str(a) + "，得 " + inline(ntex(val)) + "。",
    ]
    stem = "计算 " + inline("\\iint_D(x+y)\\,dA") + "，其中 D：" + inline("0\\le x\\le " + str(a)) + "，" + inline("0\\le y\\le " + str(b)) + "。写出先对谁积分。"
    return HW(stem, steps, inline(ntex(val)), "3.4cm")


def hw_hess(rng):
    m = rng.choice([0, 1, 2])
    n = rng.choice([0, 1, -1])
    f = (x - m) ** 2 - (y - n) ** 2
    steps = [
        inline("f_x=2(x-" + str(m) + ")") + "，" + inline("f_y=-2(y-(" + str(n) + "))") + "。令它们为 0，驻点是 (" + str(m) + "," + str(n) + ")。",
        inline("f_{xx}=2") + "，" + inline("f_{yy}=-2") + "，" + inline("f_{xy}=0") + "。",
        inline("\\Delta=2\\cdot(-2)-0=-4<0") + "，所以是鞍点，不是极值。" + inline("\\Delta=0") + " 时本讲不判定；这里判别式不为 0。",
    ]
    stem = "求 " + inline("f(x,y)=" + ntex(sp.expand(f))) + " 的驻点，并用黑塞判别式说明它是极值还是鞍点。"
    return HW(stem, steps, "驻点 (" + str(m) + "," + str(n) + ")，鞍点。", "3.4cm")


def build():
    bag = Bag(18018)
    bag.fill("定义域", lambda: q_dom(bag.rng), 12)
    bag.fill("路径", lambda: q_path(bag.rng), 28)
    bag.fill("偏导", lambda: q_part(bag.rng), 24)
    bag.fill("二重", lambda: q_double(bag.rng), 20)
    bag.fill("黑塞", lambda: q_hess(bag.rng), 16)
    makers = [hw_dom] * 4 + [hw_path] * 4 + [hw_part] * 4 + [hw_double] * 4 + [hw_hess] * 4
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("18", "1.8 二元函数", "18-二元函数", bag.mcqs, bag.hws, 1)
