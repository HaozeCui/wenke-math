"""1.3 导数与微分。链式以一次为主。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, ntex, x

H = sp.symbols("h")


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _diff_ok(expr, deriv, x0=1):
    got = sp.simplify(sp.diff(expr, x) - deriv)
    if got != 0:
        return False
    try:
        h = sp.Rational(1, 200)
        q = (expr.subs(x, x0 + h) - expr.subs(x, x0 - h)) / (2 * h)
        return abs(float(q - deriv.subs(x, x0))) < 5e-2
    except Exception:
        return True


def q_basic(rng):
    kind = rng.choice(["pow", "sin", "cos", "exp", "ln", "ax"])
    if kind == "pow":
        n = rng.choice([2, 3, 4, 5, sp.Rational(1, 2), sp.Rational(3, 2)])
        a = rng.choice([-3, -2, -1, 2, 3, 4])
        expr = a * x**n
        deriv = sp.diff(expr, x)
        wrong = a * n * x**n  # 忘了降次
        wrong2 = a * x ** (n - 1)
        wrong3 = n * x ** (n - 1)  # 漏系数
        why = "幂函数先把指数乘下来，再把指数减 1。系数要保留。"
    elif kind == "sin":
        a = rng.choice([1, 2, 3])
        b = rng.randint(-2, 3)
        expr = sp.sin(a * x + b)
        deriv = a * sp.cos(a * x + b)
        wrong = sp.cos(a * x + b)  # 漏内层
        wrong2 = -a * sp.cos(a * x + b)
        wrong3 = a * sp.sin(a * x + b)
        why = "正弦的导数是余弦，里面的系数还要乘出来。这是一次链式。"
    elif kind == "cos":
        a = rng.choice([1, 2, 3, -2])
        expr = sp.cos(a * x)
        deriv = -a * sp.sin(a * x)
        wrong = a * sp.sin(a * x)
        wrong2 = -sp.sin(a * x)
        wrong3 = sp.cos(a * x)
        why = "余弦的导数是负的正弦，系数一并乘上。"
    elif kind == "exp":
        a = rng.choice([-2, -1, 2, 3])
        expr = sp.exp(a * x)
        deriv = a * sp.exp(a * x)
        wrong = sp.exp(a * x)
        wrong2 = a * x * sp.exp(a * x - 1)
        wrong3 = sp.exp(a * x) / a
        why = "e 的指数函数求导后还是自己，再乘里层导数。"
    elif kind == "ln":
        a = rng.choice([2, 3, 4, 5])
        b = rng.randint(0, 3)
        expr = sp.log(a * x + b)
        deriv = a / (a * x + b)
        wrong = 1 / (a * x + b)
        wrong2 = a * sp.log(a * x + b)
        wrong3 = 1 / x
        why = "对数的导数是 1 除以真数，再乘里层导数。真数要大于 0。"
    else:
        base = rng.choice([2, 3, 4, 5])
        expr = base**x
        deriv = base**x * sp.log(base)
        wrong = x * base ** (x - 1)
        wrong2 = base**x
        wrong3 = base ** (x - 1)
        why = inline("a^x") + " 的导数是 " + inline("a^x\\ln a") + "，不能套幂函数的降次公式。"
    if not _diff_ok(expr, sp.simplify(deriv), 2):
        return None
    stem = "求 " + inline("y=" + ntex(expr)) + " 的导数"
    return _mcq(rng, stem, sp.simplify(deriv), [wrong, wrong2, wrong3, deriv + 1], why, "basic")


def q_arith(rng):
    a = rng.choice([1, 2, 3, -1])
    b = rng.choice([-2, 1, 2])
    c = rng.choice([1, 2, -2])
    mode = rng.choice(["prod", "quot"])
    if mode == "prod":
        u = a * x + b
        v = sp.exp(c * x)
        expr = u * v
        deriv = sp.diff(expr, x)
        forget = sp.diff(u, x) * sp.diff(v, x)
        only_u = sp.diff(u, x) * v
        only_v = u * sp.diff(v, x)
        why = "乘积法则是 (uv)'=u'v+uv'，不是 u' 乘 v'。"
    else:
        u = a * x + b
        v = c * x + 1
        if sp.simplify(v.subs(x, 1)) == 0:
            return None
        expr = u / v
        deriv = sp.diff(expr, x)
        forget = (sp.diff(v, x) * u - sp.diff(u, x) * v) / v**2  # 分子次序反了
        only_u = sp.diff(u, x) / v
        only_v = u / v**2
        why = "商的导数：分子是 u'v-uv'，分母是 v 的平方。减的次序不能反。"
    if not _diff_ok(expr, sp.simplify(deriv), 1):
        return None
    stem = "求 " + inline("y=" + ntex(expr)) + " 的导数"
    return _mcq(rng, stem, sp.simplify(deriv), [sp.simplify(forget), sp.simplify(only_u), sp.simplify(only_v)], why, "arith")


def q_chain(rng):
    a = rng.choice([1, 2, 3, -1])
    b = rng.choice([-2, -1, 1, 2, 3])
    n = rng.choice([2, 3, 4, 5])
    mode = rng.choice(["pow", "sin", "exp", "ln"])
    if mode == "pow":
        inner = a * x**2 + b
        expr = inner**n
        deriv = n * inner ** (n - 1) * sp.diff(inner, x)
        miss = n * inner ** (n - 1)
        why = "外层是 n 次方，里层导数还要乘上。不要先把括号展开。"
    elif mode == "sin":
        inner = a * x**2 + b
        expr = sp.sin(inner)
        deriv = sp.cos(inner) * sp.diff(inner, x)
        miss = sp.cos(inner)
        why = "外层余弦，再乘里层导数。这是一次复合。"
    elif mode == "exp":
        inner = a * x + b
        expr = sp.exp(inner)
        deriv = sp.exp(inner) * a
        miss = sp.exp(inner)
        why = "指数函数求导后仍是自己，再乘里层的系数。"
    else:
        inner = a * x + b
        if a == 0:
            return None
        expr = sp.log(inner)
        deriv = a / inner
        miss = 1 / inner
        why = "外层是 1 除以真数，再乘里层导数。"
    deriv = sp.simplify(deriv)
    if not _diff_ok(expr, deriv, 1):
        return None
    stem = "求 " + inline("y=" + ntex(expr)) + " 的导数（只复合一次）"
    return _mcq(rng, stem, deriv, [sp.simplify(miss), sp.simplify(deriv * x), sp.simplify(sp.diff(inner, x))], why, "chain")


def q_def(rng):
    a = rng.choice([1, 2, 3, -2])
    b = rng.choice([-2, -1, 1, 2])
    x0 = rng.randint(-2, 3)
    expr = a * x**2 + b * x
    quot = sp.simplify((expr.subs(x, x0 + H) - expr.subs(x, x0)) / H)
    deriv = sp.diff(expr, x).subs(x, x0)
    if sp.simplify(sp.limit(quot, H, 0) - deriv) != 0:
        return None
    mode = rng.choice(["value", "quot"])
    if mode == "value":
        stem = "用定义求 " + inline("f(x)=" + ntex(expr)) + " 在 " + inline("x=" + str(x0)) + " 处的导数"
        why = "差商化简后还含 h，再让 h 趋向 0，得到 " + inline(ntex(deriv)) + "。不能把 h=0 直接代进未化简的差商。"
        return _mcq(rng, stem, deriv, [quot, deriv + a, expr.subs(x, x0), 0], why, "def")
    stem = inline("f(x)=" + ntex(expr)) + " 在 " + inline("x=" + str(x0)) + " 的差商化简后是"
    why = "先展开 (x0+h) 的函数值，减去 f(x0)，再除以 h。结果仍含 h，那还不是导数。"
    return _mcq(rng, stem, quot, [deriv, quot + H, expr.subs(x, x0), a * H], why, "def")


def q_corner(rng):
    c = rng.randint(-3, 4)
    mode = rng.choice(["abs", "jump", "smooth", "cusp"])
    if mode == "abs":
        stem = inline("f(x)=|x-" + str(c) + "|") + " 在 " + inline("x=" + str(c)) + " 处"
        correct = "连续但不可导"
        why = "图像连着，但左右差商分别是 -1 和 1，没有共同极限，所以是尖点，不可导。"
    elif mode == "jump":
        stem = "设 x<" + str(c) + " 时 f(x)=0，x 大于等于 " + str(c) + " 时 f(x)=1。在 x=" + str(c) + " 处"
        correct = "不连续，因而不可导"
        why = "左右极限不同，先已经不连续。不连续一定不可导。"
    elif mode == "smooth":
        stem = inline("f(x)=(x-" + str(c) + ")^2") + " 在 x=" + str(c) + " 处"
        correct = "可导，导数为 0"
        why = "这是抛物线的顶点，左右斜率都是 0，可导。"
    else:
        stem = inline("f(x)=(x-" + str(c) + ")^{1/3}") + " 在 x=" + str(c) + " 处"
        correct = "连续但不可导（切线竖直）"
        why = "函数连续，但差商趋向无穷，切线竖直，按本课的说法不可导。"
    choices = [
        "连续但不可导",
        "不连续，因而不可导",
        "可导，导数为 0",
        "连续但不可导（切线竖直）",
    ]
    return _mcq(rng, stem, correct, [z for z in choices if z != correct], why, "corner")


def hw_def_linear(rng):
    a = rng.choice([2, 3, 4, -3, 5])
    b = rng.randint(-2, 4)
    steps = [
        "差商是 " + inline("\\dfrac{(" + str(a) + "(x+h)+" + str(b) + ")-(" + str(a) + "x+" + str(b) + ")}{h}") + "。",
        "分子化简为 " + inline(str(a) + "h") + "，约去 h（h 不等于 0）得到 " + inline(str(a)) + "。",
        "再让 h 趋向 0，导数仍是常数 " + inline(str(a)) + "。直线的斜率不随点改变。",
    ]
    stem = "用定义求 " + inline("f(x)=" + ntex(a * x + b)) + " 在任意点的导数。"
    return HW(stem, steps, inline(str(a)))


def hw_def_quad(rng):
    x0 = rng.choice([1, 2, 3, -1])
    expr = x**2
    steps = [
        "差商 " + inline("\\dfrac{(x_0+h)^2-x_0^2}{h}=2x_0+h") + "。",
        "这里取 x0=" + str(x0) + "，差商是 " + inline(str(2 * x0) + "+h") + "。",
        "h 趋向 0，导数是 " + inline(str(2 * x0)) + "。h=1 时的差商是平均变化率，比瞬时斜率大 1 或小 1。",
    ]
    stem = "用定义求 " + inline("f(x)=x^2") + " 在 x=" + str(x0) + " 的导数，并写出差商化简后的式子。"
    return HW(stem, steps, inline("f'(" + str(x0) + ")=" + str(2 * x0)))


def hw_corner(rng):
    c = rng.choice([0, 1, 2, -1])
    steps = [
        "先看连续：左右都能走到同一个函数值 " + inline("0" if c == 0 else "|0|=0") + "，图像是连着的。",
        "右差商：h>0 时 " + inline("|(c+h)-c|/h=1") + "。",
        "左差商：h<0 时绝对值是 -h，再除以 h 得到 -1。",
        "左右差商极限不同，所以在 x=" + str(c) + " 不可导。连续不能推出可导。",
    ]
    # 把 c 写进步骤，避免 c=0 的特殊句子出错
    steps[0] = "函数值 f(" + str(c) + ")=0，左右极限都是 0，所以连续。"
    steps[1] = "h>0 时，差商是 " + inline("h/h=1") + "。"
    steps[2] = "h<0 时，|h|=-h，差商是 " + inline("(-h)/h=-1") + "。"
    stem = "说明 " + inline("f(x)=|x-" + str(c) + "|") + " 在 x=" + str(c) + " 连续但不可导。请分别计算左右差商。"
    return HW(stem, steps, "连续，但左右导数分别是 -1 和 1，不可导。", "3.4cm")


def hw_chain(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2, -1])
    n = rng.choice([3, 4, 5])
    inner = a * x**2 + b
    expr = inner**n
    deriv = sp.simplify(sp.diff(expr, x))
    steps = [
        "外层是 " + str(n) + " 次方，对内层的导数是 " + inline(str(n) + "u^{" + str(n - 1) + "}") + "。",
        "内层 " + inline(ntex(inner)) + " 的导数是 " + inline(ntex(sp.diff(inner, x))) + "。",
        "两部分相乘，得 " + inline(ntex(deriv)) + "。不要先展开括号。",
    ]
    stem = "求 " + inline("y=" + ntex(expr)) + " 的导数，并标明外层与内层。"
    return HW(stem, steps, inline(ntex(deriv)), "3.2cm")


def hw_ax(rng):
    base = rng.choice([2, 3, 5])
    expr = base**x
    deriv = sp.diff(expr, x)
    steps = [
        inline(str(base) + "^x") + " 的指数是变量，底是常数，要用指数函数的公式，不是幂函数的降次。",
        "导数是 " + inline(ntex(deriv)) + "，也就是原函数乘以 " + inline("\\ln " + str(base)) + "。",
        "若写成 " + inline("x\\cdot " + str(base) + "^{x-1}") + "，那是把指数和底弄反了。",
    ]
    stem = "求 " + inline("y=" + str(base) + "^x") + " 的导数，并说明为什么不能写成 x 乘 " + str(base) + " 的 x-1 次。"
    return HW(stem, steps, inline(ntex(sp.simplify(deriv))))


def hw_prod(rng):
    a = rng.choice([2, 3, -1])
    expr = (a * x + 1) * sp.sin(x)
    deriv = sp.simplify(sp.diff(expr, x))
    steps = [
        "设 u=" + inline(ntex(a * x + 1)) + "，v=sin x。",
        "u'=" + inline(str(a)) + "，v'=cos x。",
        "(uv)'=u'v+uv'=" + inline(ntex(deriv)) + "。",
        "不是 u' 乘 v'。",
    ]
    stem = "用乘积法则求 " + inline("y=" + ntex(expr)) + " 的导数。"
    return HW(stem, steps, inline(ntex(deriv)))


def hw_vel(rng):
    x0 = rng.choice([2, 3, 4])
    expr = x**2
    inst = 2 * x0
    avg = ((x0) ** 2 - (x0 - 1) ** 2) / 1
    steps = [
        "瞬时速度是导数。s'=2t，在 t=" + str(x0) + " 时为 " + inline(str(inst)) + "。",
        "从 " + str(x0 - 1) + " 到 " + str(x0) + " 的平均速度是差商 h=1，等于 " + inline(str(avg)) + "。",
        "平均速度是割线斜率，瞬时速度是切线斜率，h 还没有趋向 0，所以两者差 1。",
    ]
    stem = "设位移 " + inline("s(t)=t^2") + "。求 t=" + str(x0) + " 的瞬时速度，并与前 1 秒的平均速度比较。"
    return HW(stem, steps, "瞬时速度 " + inline(str(inst)) + "，平均速度 " + inline(str(avg)) + "。")


def build():
    bag = Bag(13013)
    bag.fill("基本", lambda: q_basic(bag.rng), 24)
    bag.fill("四则", lambda: q_arith(bag.rng), 16)
    bag.fill("链式", lambda: q_chain(bag.rng), 22)
    bag.fill("定义", lambda: q_def(bag.rng), 16)
    bag.fill("尖点", lambda: q_corner(bag.rng), 22)
    makers = [
        hw_def_linear, hw_def_linear, hw_def_quad, hw_def_quad,
        hw_corner, hw_corner, hw_corner,
        hw_chain, hw_chain, hw_chain, hw_chain, hw_chain,
        hw_ax, hw_ax,
        hw_prod, hw_prod, hw_prod,
        hw_vel, hw_vel, hw_vel,
    ]
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("13", "1.3 导数与微分", "13-导数与微分", bag.mcqs, bag.hws, 2)
