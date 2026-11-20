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


def _pt(a, b) -> str:
    return "(" + ntex(a) + "," + ntex(b) + ")"


def q_stat(rng):
    """利润型 f = ax + by − x² − y² − xy：驻点与极大值（例 1.8.11 的同类题）。"""
    a = rng.randrange(12, 61, 2)
    b = rng.randrange(10, 51, 2)
    f = a * x + b * y - x**2 - y**2 - x * y
    sol = sp.solve([sp.diff(f, x), sp.diff(f, y)], [x, y], dict=True)
    if len(sol) != 1:
        return None
    x0, y0 = sol[0][x], sol[0][y]
    if x0 <= 0 or y0 <= 0 or x0 == y0:
        return None
    val = sp.simplify(f.subs({x: x0, y: y0}))
    ftex = inline("f(x,y)=" + str(a) + "x+" + str(b) + "y-x^2-y^2-xy")
    if rng.random() < 0.6:
        stem = ftex + " 的驻点是"
        why = ("解 " + inline(str(a) + "-2x-y=0") + "，" + inline(str(b) + "-x-2y=0") + "，得 "
               + inline(_pt(x0, y0)) + "。注意 " + inline("-xy") + " 求偏导后在两个方程里各留下一项。")
        wrongs = [_pt(y0, x0), _pt(sp.Rational(a, 2), sp.Rational(b, 2)), _pt(sp.Rational(a, 3), sp.Rational(b, 3)), _pt(x0, -y0)]
        return _mcq(rng, stem, _pt(x0, y0), wrongs, why, "stat")
    stem = ftex + " 的极大值是"
    why = ("驻点 " + inline(_pt(x0, y0)) + "；" + inline("a=-2,\\ b=-1,\\ d=-2") + "，" + inline("ad-b^2=3>0") + " 且 "
           + inline("a<0") + "，是极大。代入得 " + inline(ntex(val)) + "。")
    half = sp.simplify(f.subs({x: sp.Rational(a, 2), y: sp.Rational(b, 2)}))
    return _mcq(rng, stem, val, [half, val / 2, sp.Integer(a * b) / 4, val + a], why, "stat")


def q_region(rng):
    """先画区域再定上下限：三角形、抛物线与直线之间。"""
    mode = rng.choice(["tri", "tri", "bounds", "lens"])
    if mode == "tri":
        p, q, c = rng.choice([1, 2, 3]), rng.choice([1, 2, 3]), rng.choice([1, 2, 3])
        f = p * x + q * y
        val = sp.integrate(sp.integrate(f, (y, 0, c - x)), (x, 0, c))
        wrong = sp.integrate(sp.integrate(f, (y, 0, x)), (x, 0, c))
        if val == wrong:
            return None
        stem = ("计算 " + inline("\\iint_D(" + ntex(f) + ")\\,dx\\,dy") + "，D 由 " + inline("x=0") + "、"
                + inline("y=0") + "、" + inline("x+y=" + str(c)) + " 围成")
        why = ("X 型：" + inline("0\\le x\\le " + str(c)) + "，" + inline("0\\le y\\le " + str(c) + "-x") + "。"
               + "上限是斜边 " + inline("y=" + str(c) + "-x") + "，不是 " + inline("y=x") + "。结果 " + inline(ntex(val)) + "。")
        return _mcq(rng, stem, val, [wrong, val * 2, sp.Integer((p + q) * c**2) / 2, val + 1], why, "region")
    n = rng.choice([2, 3, 4])
    if mode == "bounds":
        stem = ("D 由 " + inline("y=x^{" + str(n) + "}") + " 与 " + inline("y=x") + " 围成。化成先对 y 积分的累次积分，内层 y 的范围是")
        lo, hi = "x^{" + str(n) + "}", "x"
        why = ("交点 (0,0)、(1,1)。在 0 与 1 之间 " + inline("x^{" + str(n) + "}\\lt x") + "，竖条从下边 "
               + inline("y=x^{" + str(n) + "}") + " 到上边 " + inline("y=x") + "。")
        mk = lambda a, b: "从 " + inline(a) + " 到 " + inline(b)
        return _mcq(rng, stem, mk(lo, hi), [mk(hi, lo), mk("0", "1"), mk("0", "x")], why, "region")
    k = rng.choice([1, 2, 3, 4, 6, 12])
    f = k * x * y
    val = sp.integrate(sp.integrate(f, (y, x**n, x)), (x, 0, 1))
    first = sp.integrate(sp.Rational(k, 2) * x**3, (x, 0, 1))
    stem = ("计算 " + inline("\\iint_D " + ntex(f) + "\\,dx\\,dy") + "，D 由 " + inline("y=x^{" + str(n) + "}") + " 与 " + inline("y=x") + " 围成")
    why = ("X 型：" + inline("0\\le x\\le 1") + "，" + inline("x^{" + str(n) + "}\\le y\\le x") + "。内层得 "
           + inline(ntex(sp.integrate(f, (y, x**n, x)))) + "，再积分得 " + inline(ntex(val)) + "。")
    return _mcq(rng, stem, val, [-val, first, val * 2, first - val], why, "region")


REL = [
    (inline("f(x,y)=|x|+|y|") + " 在原点", "连续，但偏导不存在",
     ["偏导存在，但不连续", "可微", "不连续，偏导也不存在"],
     "两个连续函数之和处处连续；" + inline("\\frac{|h|}{h}") + " 在 " + inline("h\\to0") + " 时左右极限是 1 与 -1，偏导不存在。（例 1.8.9）"),
    (inline("f(x,y)=\\frac{xy}{x^2+y^2}") + "，" + inline("f(0,0)=0") + "，在原点", "偏导存在，但不连续",
     ["连续，但偏导不存在", "可微", "连续且可微"],
     "沿两条坐标轴函数恒为 0，两个偏导都是 0；沿 " + inline("y=kx") + " 得 " + inline("\\frac{k}{1+k^2}") + "，极限不存在。（例 1.8.8）"),
    (inline("f(x,y)=x^2+y^2") + " 在原点", "可微，因而连续，偏导也存在",
     ["连续，但偏导不存在", "偏导存在，但不可微", "不连续"],
     "偏导 " + inline("2x") + "、" + inline("2y") + " 处处连续，偏导连续可推出可微，可微又推出连续。"),
    ("若二元函数在一点的两个偏导都存在，则在该点", "既不能保证连续，也不能保证可微",
     ["一定连续", "一定可微", "一定取极值"],
     "例 1.8.8 的函数两个偏导都存在，却既不连续也不可微。偏导只看两条坐标轴上的情况。"),
    ("若二元函数在一点可微，则在该点", "连续，且两个偏导都存在",
     ["连续，但偏导未必存在", "偏导存在，但未必连续", "一定取极值"],
     "可微时 " + inline("\\Delta z=A\\Delta x+B\\Delta y+o(\\rho)") + "，令增量趋于 0 得连续；取 " + inline("\\Delta y=0") + " 得 " + inline("A=f_x") + "。"),
    ("下列条件中，能推出二元函数在一点可微的是", "两个偏导在该点附近存在且连续",
     ["两个偏导在该点存在", "函数在该点连续", "沿每条过该点的直线极限都存在"],
     "偏导存在、连续都推不出可微；偏导连续才能推出可微。"),
    (inline("\\lim_{(x,y)\\to(0,0)}\\frac{x^2y}{x^4+y^2}"), "不存在",
     ["存在且为 0", "存在且为 " + inline("\\frac12"), "存在且为 1"],
     "沿每条直线 " + inline("y=kx") + " 都得 0，但沿 " + inline("y=x^2") + " 得 " + inline("\\frac12") + "：两条路不同，极限不存在。"),
]


def q_rel(rng):
    stem, correct, wrongs, why = rng.choice(REL)
    return _mcq(rng, stem, correct, wrongs, why, "rel")


def hw_stat(rng):
    x0, y0 = rng.choice([(10, 5), (12, 4), (8, 6), (15, 5), (20, 10), (14, 2)])
    a, b = 2 * x0 + y0, x0 + 2 * y0
    f = a * x + b * y - x**2 - y**2 - x * y
    val = f.subs({x: x0, y: y0})
    steps = [
        inline("f_x=" + str(a) + "-2x-y=0") + "，" + inline("f_y=" + str(b) + "-x-2y=0") + "。联立得驻点 (" + str(x0) + "," + str(y0) + ")。",
        inline("a=f_{xx}=-2") + "，" + inline("b=f_{xy}=-1") + "，" + inline("d=f_{yy}=-2") + "；" + inline("ad-b^2=3>0") + " 且 " + inline("a<0") + "，极大。",
        "代入原函数，极大值 " + inline(str(val)) + "。",
    ]
    stem = "利润 " + inline("P(x,y)=" + str(a) + "x+" + str(b) + "y-x^2-y^2-xy") + "（万元）。求驻点，用黑塞矩阵判断类型，并求极大利润。"
    return HW(stem, steps, "驻点 (" + str(x0) + "," + str(y0) + ")，极大值 " + inline(str(val)) + "。", "3.6cm")


def hw_region(rng):
    c = rng.choice([1, 2, 3])
    p, q = rng.choice([(1, 1), (1, 2), (2, 1), (1, 3)])
    f = p * x + q * y
    inner = sp.expand(sp.integrate(f, (y, 0, c - x)))
    val = sp.integrate(inner, (x, 0, c))
    steps = [
        "画图：顶点 (0,0)、(" + str(c) + ",0)、(0," + str(c) + ")。看成 X 型：" + inline("0\\le x\\le " + str(c)) + "，" + inline("0\\le y\\le " + str(c) + "-x") + "。",
        "内层对 y（x 当常数）：得 " + inline(ntex(inner)) + "。",
        "外层对 x 从 0 到 " + str(c) + "：得 " + inline(ntex(val)) + "。",
    ]
    stem = ("计算 " + inline("\\iint_D(" + ntex(f) + ")\\,dx\\,dy") + "，D 由 " + inline("x=0") + "、" + inline("y=0") + "、"
            + inline("x+y=" + str(c)) + " 围成。先画图，写出上下限。")
    return HW(stem, steps, inline(ntex(val)), "3.6cm")


def build():
    bag = Bag(18018)
    bag.fill("定义域", lambda: q_dom(bag.rng), 10)
    bag.fill("路径", lambda: q_path(bag.rng), 22)
    bag.fill("偏导", lambda: q_part(bag.rng), 20)
    bag.fill("二重", lambda: q_double(bag.rng), 14)
    bag.fill("黑塞", lambda: q_hess(bag.rng), 12)
    bag.fill("驻点", lambda: q_stat(bag.rng), 10)
    bag.fill("区域", lambda: q_region(bag.rng), 6)
    bag.fill("辨析", lambda: q_rel(bag.rng), 6)
    makers = [hw_dom] * 3 + [hw_path] * 3 + [hw_part] * 4 + [hw_double] * 3 + [hw_hess] * 3 + [hw_stat] * 2 + [hw_region] * 2
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("18", "1.8 二元函数", "18-二元函数", bag.mcqs, bag.hws, 1)
