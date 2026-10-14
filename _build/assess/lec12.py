"""1.2 极限。不写 ε 语言。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, ntex, x

N = sp.symbols("n", positive=True)


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _lim(expr, x0, direction=None):
    if direction is None:
        return sp.limit(expr, x, x0)
    return sp.limit(expr, x, x0, dir=direction)


def _finite(v) -> bool:
    try:
        return bool(v.is_finite and v.is_real)
    except Exception:
        return False


def q_cancel(rng):
    a = rng.choice([i for i in range(-6, 7) if i != 0])
    b = rng.choice([i for i in range(-5, 6) if i != a])
    k = rng.choice([-3, -2, -1, 1, 2, 3])
    kind = rng.choice(["diff", "sum", "sqrt", "cubic", "linear"])
    if kind == "sqrt":
        a = abs(a) + 1
        expr = (sp.sqrt(x) - sp.sqrt(a)) / (x - a)
        expect = sp.simplify(1 / (2 * sp.sqrt(a)))
        x0 = a
    elif kind == "sum":
        expr = (x**2 - a**2) / (x + a)
        expect = sp.Integer(-2 * a)
        x0 = -a
    elif kind == "cubic":
        expr = (x**3 - a**3) / (x - a)
        expect = sp.Integer(3 * a * a)
        x0 = a
    elif kind == "linear":
        expr = (k * (x - a) * (x - b)) / (x - a)
        expect = sp.Integer(k * (a - b))
        x0 = a
    else:
        expr = (x**2 - a**2) / (x - a)
        expect = sp.Integer(2 * a)
        x0 = a
    got = sp.simplify(_lim(expr, x0))
    if not _finite(got) or sp.simplify(got - expect) != 0:
        return None
    wrongs = [expect + 1, expect - 1, a, 0, sp.Integer(a * a), expect * 2, b]
    stem = "求 " + inline("\\lim_{x\\to " + ntex(x0) + "}" + ntex(expr))
    why = "该点分母为 0，不能直接代入。先约去公因子（极限不看这一点是否有定义），再代入，得 " + inline(ntex(expect)) + "。"
    return _mcq(rng, stem, expect, wrongs, why, "cancel")


def q_poly(rng):
    # 连续函数直接代入
    coef = [rng.choice([-3, -2, -1, 1, 2, 3]) for _ in range(3)]
    expr = coef[0] * x**2 + coef[1] * x + coef[2]
    x0 = rng.randint(-3, 4)
    expect = sp.simplify(expr.subs(x, x0))
    if _lim(expr, x0) != expect:
        return None
    stem = "求 " + inline("\\lim_{x\\to " + str(x0) + "}" + ntex(expr))
    why = "多项式在每一点都连续，极限就是函数值 " + inline(ntex(expect)) + "。"
    return _mcq(rng, stem, expect, [expect + 1, expect - coef[0], expr.subs(x, x0 + 1), 0], why, "poly")


def q_side(rng):
    k = rng.randint(-2, 3)
    a = rng.choice([-3, -2, -1, 1, 2, 3])
    b = rng.randint(-3, 4)
    c = rng.choice([-2, -1, 1, 2, 4])
    d = rng.randint(-3, 4)
    if a * k + b == c * k + d:
        d += 3
    left = a * k + b
    right = c * k + d
    mode = rng.choice(["left", "right", "both"])
    if mode == "left":
        stem = "设 " + inline("x<" + str(k)) + " 时 " + inline("f(x)=" + ntex(a * x + b)) + "，" + inline("x\\ge " + str(k)) + " 时 " + inline("f(x)=" + ntex(c * x + d)) + "。则 " + inline("x\\to " + str(k) + "^-") + " 时 f(x) 的极限是"
        correct = left
        why = "左极限只看分界点左边的那段，代入得 " + inline(str(left)) + "。右边的式子不用。"
        wrongs = [right, left + right, "不存在"]
    elif mode == "right":
        stem = "设 " + inline("x<" + str(k)) + " 时 " + inline("f(x)=" + ntex(a * x + b)) + "，" + inline("x\\ge " + str(k)) + " 时 " + inline("f(x)=" + ntex(c * x + d)) + "。则 " + inline("x\\to " + str(k) + "^+") + " 时 f(x) 的极限是"
        correct = right
        why = "右极限看分界点右边（含分界点那一段的表达式），得 " + inline(str(right)) + "。"
        wrongs = [left, right - left, "不存在"]
    else:
        stem = "设 " + inline("x<" + str(k)) + " 时 " + inline("f(x)=" + ntex(a * x + b)) + "，" + inline("x\\ge " + str(k)) + " 时 " + inline("f(x)=" + ntex(c * x + d)) + "。" + inline("\\lim_{x\\to " + str(k) + "}f(x)")
        correct = "不存在"
        why = "左极限是 " + inline(str(left)) + "，右极限是 " + inline(str(right)) + "，左右不同，所以极限不存在。"
        wrongs = [left, right, (left + right) / 2]
    return _mcq(rng, stem, correct, wrongs, why, "side")


def q_seq(rng):
    a = rng.choice([1, 2, 3, 4, 5])
    c = rng.choice([1, 2, 3, 4])
    b = rng.randint(-5, 6)
    d = rng.choice([i for i in range(-4, 5) if i != 0])
    expr = (a * N + b) / (c * N + d)
    expect = sp.Rational(a, c)
    got = sp.simplify(sp.limit(expr, N, sp.oo))
    if got != expect:
        return None
    stem = "数列 " + inline("a_n=" + ntex(expr)) + " 当 n 趋向正无穷时的极限是"
    why = "分子分母都是一次，极限是最高次系数之比 " + inline(ntex(expect)) + "，不是常数项之比。"
    wrongs = [sp.Rational(b, d) if d else 0, sp.Rational(a, d) if d else 1, expect + 1, sp.Integer(a), 0]
    return _mcq(rng, stem, expect, wrongs, why, "seq")


def q_inf(rng):
    a = rng.choice([-3, -2, -1, 1, 2, 3])
    c = rng.choice([-2, -1, 1, 2, 4])
    b = rng.randint(-4, 4)
    d = rng.randint(-4, 4)
    mode = rng.choice(["same", "bot", "top"])
    if mode == "same":
        expr = (a * x**2 + b * x + 1) / (c * x**2 + d)
        expect = sp.Rational(a, c)
        label = expect
        why = "分子分母同为二次，无穷远处的极限是最高次系数之比 " + inline(ntex(expect)) + "。"
        wrongs = [0, sp.Rational(b, c) if c else 1, expect + 1, sp.Integer(a)]
    elif mode == "bot":
        expr = (a * x + b) / (c * x**2 + d * x + 1)
        expect = 0
        label = 0
        why = "分母次数更高，x 趋向无穷时分式趋向 0。"
        wrongs = [sp.Rational(a, c), 1, "趋向正无穷", "趋向负无穷"]
    else:
        expr = (a * x**2 + b) / (c * x + 1)
        # 趋向无穷，符号看 a/c
        sign = 1 if a * c > 0 else -1
        label = "趋向正无穷" if sign > 0 else "趋向负无穷"
        why = "分子次数更高，极限是无穷。符号由最高次系数 " + inline(ntex(a)) + " 与 " + inline(ntex(c)) + " 决定。"
        wrongs = [0, sp.Rational(a, c), "趋向正无穷" if sign < 0 else "趋向负无穷", "不存在（左右无穷符号不同）"]
        # x->+oo only
        got = sp.limit(expr, x, sp.oo)
        if sign > 0 and got != sp.oo:
            return None
        if sign < 0 and got != -sp.oo:
            return None
        stem = "求 " + inline("\\lim_{x\\to +\\infty}" + ntex(expr))
        return _mcq(rng, stem, label, wrongs, why, "inf")
    got = sp.simplify(sp.limit(expr, x, sp.oo))
    if got != expect:
        return None
    stem = "求 " + inline("\\lim_{x\\to +\\infty}" + ntex(expr))
    return _mcq(rng, stem, label, wrongs, why, "inf")


def q_squeeze(rng):
    p = rng.choice([1, 2, 3])
    a = rng.randint(-2, 2)
    trig = sp.sin if rng.random() < 0.5 else sp.cos
    expr = (x - a) ** p * trig(1 / (x - a))
    got = sp.limit(expr, x, a)
    if got != 0:
        return None
    stem = "求 " + inline("\\lim_{x\\to " + str(a) + "}" + ntex(expr))
    why = "三角函数被夹在 -1 与 1 之间，再乘上趋向 0 的幂，夹逼后极限是 0。振荡不等于没有极限。"
    return _mcq(rng, stem, 0, ["不存在", 1, -1, sp.oo], why, "squeeze")


def q_osc(rng):
    a = rng.randint(-3, 3)
    stem = "求 " + inline("\\lim_{x\\to " + str(a) + "}\\sin\\frac{1}{x-" + str(a) + "}")
    why = "分母趋向 0 时，正弦的自变量趋向无穷，函数在 -1 与 1 之间来回振荡，没有唯一趋势，极限不存在。"
    return _mcq(rng, stem, "不存在", [0, 1, -1], why, "squeeze")


def q_kind(rng):
    a = rng.choice([i for i in range(-3, 4)])
    mode = rng.choice(["removable", "jump", "inf", "cont"])
    if mode == "removable":
        expr_desc = inline("f(x)=\\dfrac{x^2-" + str(a**2) + "}{x-" + str(a) + "}") + "（" + inline("x\\neq " + str(a)) + "）"
        stem = expr_desc + " 在 " + inline("x=" + str(a)) + " 处是"
        correct = "可去间断"
        why = "约分后极限存在，等于 " + inline(str(2 * a)) + "，但该点没有定义（或没有定义成这个极限）。补上这一点就连续。"
    elif mode == "jump":
        stem = (
            "设 "
            + inline("x<" + str(a))
            + " 时 f(x)="
            + inline(ntex(x + 1))
            + "，"
            + inline("x\\ge " + str(a))
            + " 时 f(x)="
            + inline(ntex(x + 4))
            + "。在 "
            + inline("x=" + str(a))
            + " 处"
        )
        correct = "跳跃间断"
        why = "左右极限都存在但不相等，是跳跃间断，不是可去间断。"
    elif mode == "inf":
        stem = inline("f(x)=1/(x-" + str(a) + ")") + " 在 " + inline("x=" + str(a)) + " 处是"
        correct = "无穷间断"
        why = "分母趋向 0 且分子不为 0，函数值趋向无穷，是无穷间断。"
    else:
        stem = inline("f(x)=" + ntex((x - a) ** 2 + 2)) + " 在 " + inline("x=" + str(a)) + " 处是"
        correct = "连续"
        why = "多项式处处连续，极限等于函数值。"
    choices = ["连续", "可去间断", "跳跃间断", "无穷间断"]
    return _mcq(rng, stem, correct, [c for c in choices if c != correct], why, "kind")


def q_standard(rng):
    k = rng.choice([-3, -2, -1, 1, 2, 3, 4])
    expr = sp.sin(k * x) / x
    got = sp.simplify(sp.limit(expr, x, 0))
    if got != k:
        return None
    stem = "求 " + inline(r"\lim_{x\to 0}" + ntex(expr))
    why = "这是 0/0。它等于 sin(kx) 与 x 的系数，结果是 " + inline(str(k)) + "，不是 1，也不是 0。"
    return _mcq(rng, stem, k, [1, 0, sp.Rational(1, k), k + 1], why, "standard")


def hw_cancel(rng):
    a = rng.choice([2, 3, 4, 5])
    expr = (x**2 - a**2) / (x - a)
    steps = [
        "当 x=" + str(a) + " 时分母为 0，不能把 " + str(a) + " 代进原式。",
        "在 x 不等于 " + str(a) + " 时，分子因式分解为 " + inline("(x-" + str(a) + ")(x+" + str(a) + ")") + "，约去公因子后得到 " + inline("x+" + str(a)) + "。",
        "约分是合法的，因为极限只看趋势，不要求函数在该点有定义。",
        "再让 x 趋向 " + str(a) + "，得 " + inline(str(2 * a)) + "。",
    ]
    stem = "求 " + inline("\\lim_{x\\to " + str(a) + "}" + ntex(expr)) + "，并说明为什么可以约分。"
    return HW(stem, steps, inline(str(2 * a)))


def hw_sqrt(rng):
    a = rng.choice([1, 4, 9])
    expr = (sp.sqrt(x) - sp.sqrt(a)) / (x - a)
    expect = sp.simplify(1 / (2 * sp.sqrt(a)))
    if sp.simplify(sp.limit(expr, x, a) - expect) != 0:
        return None
    steps = [
        "x=" + str(a) + " 时是 0/0，不能直接代入。",
        "分子有理化：乘上 " + inline("\\sqrt{x}+\\sqrt{" + str(a) + "}") + "，分子变成 x-" + str(a) + "。",
        "约去 x-" + str(a) + " 后得到 " + inline("1/(\\sqrt{x}+\\sqrt{" + str(a) + "})") + "。",
        "再代入 x=" + str(a) + "，得 " + inline(ntex(expect)) + "。",
    ]
    stem = "求 " + inline("\\lim_{x\\to " + str(a) + "}" + ntex(expr)) + "，写出有理化过程。"
    return HW(stem, steps, inline(ntex(expect)), "3.4cm")


def hw_side(rng):
    k = rng.choice([-1, 0, 1, 2])
    left = rng.choice([-2, 1, 3])
    right = left + rng.choice([2, 3, 4])
    steps = [
        "左极限：x 从小于 " + str(k) + " 的一侧靠近，用左段，得 " + inline(str(left * k + 1)) + "。",
        "右极限：用右段，得 " + inline(str(right * k - 1)) + "。",
        "左右不相等，所以 " + inline("x\\to " + str(k)) + " 时极限不存在。",
    ]
    # 用具体一次函数，避免步骤和式子脱节
    a, b = left, 1
    c, d = right, -1
    # 重新计算与步骤一致
    lv = a * k + b
    rv = c * k + d
    if lv == rv:
        d += 2
        rv = c * k + d
    steps = [
        "左极限只看 " + inline("x<" + str(k)) + " 的式子 " + inline(ntex(a * x + b)) + "，代入得 " + inline(str(lv)) + "。",
        "右极限看另一段 " + inline(ntex(c * x + d)) + "，得 " + inline(str(rv)) + "。",
        "左右极限" + ("相同，极限存在。" if lv == rv else "不同，极限不存在。"),
    ]
    stem = (
        "设 "
        + inline("x<" + str(k))
        + " 时 "
        + inline("f(x)=" + ntex(a * x + b))
        + "，"
        + inline("x\\ge " + str(k))
        + " 时 "
        + inline("f(x)=" + ntex(c * x + d))
        + "。求左右极限，并判断 "
        + inline("\\lim_{x\\to " + str(k) + "}f(x)")
        + " 是否存在。"
    )
    ans = "左极限 " + inline(str(lv)) + "，右极限 " + inline(str(rv)) + "，" + ("存在。" if lv == rv else "不存在。")
    return HW(stem, steps, ans, "3.4cm")


def hw_seq(rng):
    a = rng.choice([2, 3, 5])
    c = rng.choice([2, 4, 7])
    b = rng.choice([-3, 1, 4])
    d = rng.choice([-2, 3, 5])
    expr = (a * N + b) / (c * N + d)
    expect = sp.Rational(a, c)
    if sp.simplify(sp.limit(expr, N, sp.oo)) != expect:
        return None
    steps = [
        "分子、分母同时除以 n。",
        "得到 " + inline(ntex((a + b / N) / (c + d / N))) + "。",
        "当 n 趋向无穷，含 1/n 的项趋向 0，极限是 " + inline(ntex(expect)) + "。",
        "这不是常数项之比，也不是某一项的值。",
    ]
    stem = "求数列 " + inline("a_n=" + ntex(expr)) + " 的极限，并写出除以 n 的过程。"
    return HW(stem, steps, inline(ntex(expect)))


def hw_squeeze(rng):
    p = rng.choice([1, 2])
    steps = [
        "对一切 x 不等于 0，都有 " + inline("-1\\le \\sin(1/x)\\le 1") + "。",
        "乘上 " + inline("x^{" + str(p) + "}") + " 的绝对值，得到 " + inline("\\left|x^{" + str(p) + "}\\sin(1/x)\\right|\\le |x|^{" + str(p) + "}") + "。",
        "不等式两边在 x 趋向 0 时都趋向 0，由夹逼，原极限是 0。",
        "振荡本身不妨碍极限，只要振荡被越来越窄的带子夹住。",
    ]
    stem = "用夹逼说明 " + inline("\\lim_{x\\to 0}x^{" + str(p) + "}\\sin(1/x)=0") + "。不要用极限的严格定义语言。"
    return HW(stem, steps, inline("0"), "3.4cm")


def hw_repair(rng):
    a = rng.choice([1, 2, 3])
    steps = [
        "原式在 x=" + str(a) + " 没有定义，因为分母为 0。",
        "约分后 " + inline("x+" + str(a)) + "，极限是 " + inline(str(2 * a)) + "。",
        "若补充定义 f(" + str(a) + ")=" + str(2 * a) + "，则极限等于函数值，间断被去掉，函数在该点连续。",
        "若补成别的数，极限仍是 " + str(2 * a) + "，但和函数值不同，仍然间断。",
    ]
    stem = "说明 " + inline("f(x)=(x^2-" + str(a**2) + ")/(x-" + str(a) + ")") + " 在 x=" + str(a) + " 是哪一种间断，并写出怎样补充定义才能连续。"
    return HW(stem, steps, "可去间断。令 f(" + str(a) + ")=" + str(2 * a) + " 后连续。", "3.4cm")


def hw_inf(rng):
    a = rng.choice([2, 3, -2])
    c = rng.choice([1, 4, -1])
    expr = (a * x**2 + 1) / (c * x**2 - 3)
    expect = sp.Rational(a, c)
    if sp.simplify(sp.limit(expr, x, sp.oo) - expect) != 0:
        return None
    steps = [
        "x 趋向正无穷时，分子分母都趋向无穷，是无穷比无穷。",
        "同除以 x 的平方，低次项趋向 0。",
        "极限等于最高次系数之比 " + inline(ntex(expect)) + "。",
    ]
    stem = "求 " + inline("\\lim_{x\\to +\\infty}" + ntex(expr)) + "，说明为什么看最高次。"
    return HW(stem, steps, inline(ntex(expect)))


def build():
    bag = Bag(12012)
    bag.fill("约分", lambda: q_cancel(bag.rng), 20)
    bag.fill("代入", lambda: q_poly(bag.rng), 12)
    bag.fill("左右", lambda: q_side(bag.rng), 18)
    bag.fill("数列", lambda: q_seq(bag.rng), 14)
    bag.fill("无穷", lambda: q_inf(bag.rng), 12)
    bag.fill("夹逼", lambda: q_squeeze(bag.rng), 8)
    bag.fill("振荡", lambda: q_osc(bag.rng), 4)
    bag.fill("间断", lambda: q_kind(bag.rng), 8)
    bag.fill("正弦比", lambda: q_standard(bag.rng), 4)
    makers = [
        hw_cancel, hw_cancel, hw_cancel, hw_cancel,
        hw_sqrt, hw_sqrt,
        hw_side, hw_side, hw_side, hw_side,
        hw_seq, hw_seq, hw_seq,
        hw_squeeze, hw_squeeze,
        hw_repair, hw_repair, hw_repair,
        hw_inf, hw_inf,
    ]
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("hw" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("12", "1.2 极限", "12-极限", bag.mcqs, bag.hws, quiz_columns=2)
