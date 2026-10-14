"""1.5 不定积分。答案用求导验算。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, ntex, x


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _family(F, f) -> bool:
    return sp.simplify(sp.diff(F - f * 0, x) - f) == 0 and sp.simplify(sp.diff(F, x) - f) == 0


def _with_c(expr) -> str:
    return ntex(sp.simplify(expr)) + "+C"


def q_basic(rng):
    n = rng.choice([2, 3, 4, 5, -2, -3])
    a = rng.choice([2, 3, 4, 5, -2])
    f = a * x**n
    F = sp.simplify(sp.integrate(f, x))
    if not _family(F, f):
        return None
    miss_coef = sp.simplify(x ** (n + 1))
    no_div = sp.simplify(a * x ** (n + 1))
    wrong_pow = sp.simplify(a * x ** (n - 1) / n) if n != 0 else x
    stem = "不定积分 " + inline(r"\int " + ntex(f) + r"\,dx") + " 等于"
    why = "幂函数积分指数加 1 再除以新指数，系数保留。结果要加 C。求导可回到被积函数。"
    return _mcq(rng, stem, _with_c(F), [_with_c(miss_coef), _with_c(no_div), _with_c(wrong_pow), ntex(F)], why, "power")


def q_exp(rng):
    a = rng.choice([-3, -2, 2, 3, 4])
    b = rng.randint(-2, 2)
    kind = rng.choice(["exp", "sin", "cos", "ln"])
    if kind == "exp":
        f = sp.exp(a * x + b)
        F = sp.exp(a * x + b) / a
        wrongs = [sp.exp(a * x + b), sp.exp(a * x + b) * a, -sp.exp(a * x + b) / a]
        why = "e 的一次线性指数，积分要除以里层系数 " + str(a) + "，不是乘。别忘了 +C。"
    elif kind == "sin":
        f = sp.sin(a * x + b)
        F = -sp.cos(a * x + b) / a
        wrongs = [sp.cos(a * x + b) / a, -sp.cos(a * x + b), sp.sin(a * x + b) / a]
        why = "正弦的积分是负的余弦，再除以里层系数。"
    elif kind == "cos":
        f = sp.cos(a * x + b)
        F = sp.sin(a * x + b) / a
        wrongs = [-sp.sin(a * x + b) / a, sp.sin(a * x + b), sp.cos(a * x + b) / a]
        why = "余弦的积分是正弦，再除以里层系数。"
    else:
        bb = b if a + b != 0 else b + 2
        f = 1 / (a * x + bb)
        F = sp.log(a * x + bb) / a
        wrongs = [sp.log(a * x + bb), a * sp.log(a * x + bb), 1 / (a * x + bb) ** 2]
        why = "1 除以一次式，积分是对数除以里层系数。书写时真数加绝对值，再加 C。"
    if sp.simplify(sp.diff(F, x) - f) != 0:
        return None
    stem = "不定积分 " + inline(r"\int " + ntex(f) + r"\,dx") + " 等于"
    return _mcq(rng, stem, _with_c(F), [_with_c(w) for w in wrongs], why, "sub")


def q_parts(rng):
    a = rng.choice([1, 2, 3])
    p = rng.choice([1, 2, 3])
    q0 = rng.choice([-2, -1, 0, 1, 2])
    kind = rng.choice(["exp", "sin", "cos"])
    poly = p * x + q0
    if kind == "exp":
        f = poly * sp.exp(a * x)
    elif kind == "sin":
        f = poly * sp.sin(a * x)
    else:
        f = poly * sp.cos(a * x)
    F = sp.simplify(sp.integrate(f, x))
    if F.has(sp.Integral) or sp.simplify(sp.diff(F, x) - f) != 0:
        return None
    # 常见错误：只积分指数、漏掉分部的第二项
    if kind == "exp":
        wrongs = [x * sp.exp(a * x) / a, sp.exp(a * x) / a**2, x * sp.exp(a * x)]
    elif kind == "sin":
        wrongs = [-x * sp.cos(a * x) / a, x * sp.cos(a * x) / a, sp.sin(a * x) / a]
    else:
        wrongs = [x * sp.sin(a * x) / a, -x * sp.sin(a * x) / a, sp.cos(a * x)]
    good = []
    for w in wrongs:
        if sp.simplify(sp.diff(w, x) - f) != 0 and sp.simplify(sp.diff(F - w, x)) != 0:
            good.append(w)
    if len(good) < 3:
        good.append(F * x)
    stem = "分部积分 " + inline(r"\int " + ntex(f) + r"\,dx") + " 等于"
    why = "多项式当 u，指数或三角当 dv。分部之后还有一项积分，不能停在第一步。结果加 C。求导应回到被积函数。"
    return _mcq(rng, stem, _with_c(F), [_with_c(w) for w in good], why, "parts")


def q_c(rng):
    a = rng.choice([2, 3, 4, 5, -2, -3])
    n = rng.choice([1, 2, 3, 4])
    b = rng.choice([0, 1, -1, 2])
    f = a * x**n + b
    F = sp.simplify(sp.integrate(f, x))
    if sp.simplify(sp.diff(F, x) - f) != 0:
        return None
    wrong = sp.simplify(a * x ** (n + 1))
    stem = inline(r"\int\left(" + ntex(f) + r"\right)\,dx") + " 作为不定积分，应写成"
    why = "不定积分表示全部原函数，必须加 C。漏掉 C 只是其中一条曲线。"
    return _mcq(
        rng,
        stem,
        ntex(F) + "+C",
        [ntex(F), ntex(F) + "+1", ntex(wrong) + "+C"],
        why,
        "plusc",
    )


def hw_one(rng, kind):
    a = rng.choice([2, 3, 4, 5, -2, -3])
    b = rng.choice([0, 1, -1, 2, -2, 3])
    n = rng.choice([2, 3, 4, 5])
    if kind == "power":
        f = (a * x + b) ** n
        F = sp.integrate(f, x)
        note = "令 u=" + ntex(a * x + b) + "，du=" + str(a) + " dx，所以 dx=du/" + str(a) + "。"
    elif kind == "exp":
        f = sp.exp(a * x + b)
        F = sp.exp(a * x + b) / a
        note = "里层导数是 " + str(a) + "，积分时要除以 " + str(a) + "。"
    elif kind == "sin":
        f = sp.sin(a * x + b)
        F = -sp.cos(a * x + b) / a
        note = "正弦积分成负余弦，再除以里层系数 " + str(a) + "。"
    elif kind == "ln":
        bb = b if a + b != 0 else b + 2
        f = 1 / (a * x + bb)
        F = sp.log(a * x + bb) / a
        note = "这是对数型。系数 " + str(a) + " 要除回去。写成答案时真数加绝对值。"
    else:
        p = rng.choice([1, 2, 3])
        q0 = rng.choice([-1, 0, 1, 2])
        f = (p * x + q0) * sp.exp(a * x)
        F = sp.simplify(sp.integrate(f, x))
        note = "令 " + inline("u=" + ntex(p * x + q0)) + "，" + inline("dv=e^{" + str(a) + "x}\\,dx") + "。分部一次后，剩下的仍是指数积分。"
    F = sp.simplify(F)
    if F.has(sp.Integral) or sp.simplify(sp.diff(F, x) - f) != 0:
        return None
    back = sp.simplify(sp.diff(F, x))
    steps = [
        note,
        "原函数可以写成 " + inline(ntex(F) + "+C") + "。",
        "求导验算：" + inline(ntex(back)) + "，与被积函数一致（C 的导数是 0）。",
    ]
    stem = "计算 " + inline(r"\int " + ntex(f) + r"\,dx") + "，再求导验算。"
    return HW(stem, steps, inline(ntex(F) + "+C"), "3.4cm")


def build():
    bag = Bag(15015)
    bag.fill("幂", lambda: q_basic(bag.rng), 22)
    bag.fill("换元", lambda: q_exp(bag.rng), 36)
    bag.fill("分部", lambda: q_parts(bag.rng), 24)
    bag.fill("常数", lambda: q_c(bag.rng), 18)
    kinds = (
        ["power"] * 4
        + ["exp"] * 4
        + ["sin"] * 3
        + ["ln"] * 3
        + ["parts"] * 6
    )
    assert len(kinds) == 20
    for i, kind in enumerate(kinds):
        bag.fill_hw(kind + str(i), lambda kind=kind: hw_one(bag.rng, kind))
    return Paper("15", "1.5 不定积分", "15-不定积分", bag.mcqs, bag.hws, 2)
