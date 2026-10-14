"""开篇：分组与汇总、加权平均、计票规则。"""
from __future__ import annotations

import random
from fractions import Fraction

from core import Bag, HW, Paper, ftex, inline, pct_tex


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _box(rng):
    den = rng.choice([10, 20, 25, 40, 50, 80])
    num = rng.randint(1, den - 1)
    return num, den


def _table(rng, reversal: bool):
    for _ in range(400):
        f1, n1 = _box(rng)
        m1, p1 = _box(rng)
        f2, n2 = _box(rng)
        m2, p2 = _box(rng)
        r1f, r1m = Fraction(f1, n1), Fraction(m1, p1)
        r2f, r2m = Fraction(f2, n2), Fraction(m2, p2)
        if not (r1m > r1f and r2m > r2f):
            continue
        af = Fraction(f1 + f2, n1 + n2)
        am = Fraction(m1 + m2, p1 + p2)
        flipped = af > am
        if flipped == reversal:
            return (f1, n1, m1, p1, f2, n2, m2, p2, r1f, r1m, r2f, r2m, af, am)
    return None


def _fmt_table(t):
    f1, n1, m1, p1, f2, n2, m2, p2 = t[:8]
    return (
        "甲院女 "
        + str(f1)
        + "/"
        + str(n1)
        + "、男 "
        + str(m1)
        + "/"
        + str(p1)
        + "；乙院女 "
        + str(f2)
        + "/"
        + str(n2)
        + "、男 "
        + str(m2)
        + "/"
        + str(p2)
    )


def q_rate(rng):
    rev = rng.random() < 0.7
    t = _table(rng, rev)
    if t is None:
        return None
    which = rng.choice(["甲女", "甲男", "乙女", "乙男", "总女", "总男"])
    vals = {
        "甲女": t[8],
        "甲男": t[9],
        "乙女": t[10],
        "乙男": t[11],
        "总女": t[12],
        "总男": t[13],
    }
    correct = vals[which]
    stem = _fmt_table(t) + "。" + which + "的录取率是"
    why = "用录取人数除以报考人数，能约分就约分。汇总要把两组的分子、分母分别相加，不能把两个百分数直接平均。"
    wrongs = [v for v in vals.values() if v != correct]
    wrongs += [correct + Fraction(1, 10), Fraction(1, 2)]
    return _mcq(rng, stem, ftex(correct), [ftex(w) if isinstance(w, Fraction) else w for w in wrongs], why, "rate")


def q_flip(rng):
    rev = rng.choice([True, False])
    t = _table(rng, rev)
    if t is None:
        return None
    if rev:
        correct = "两组内部都是男生录取率更高，汇总后却是女生更高"
    else:
        correct = "两组内部都是男生更高，汇总后仍然是男生更高"
    stem = _fmt_table(t) + "。下列哪句符合这张表"
    why = "要分别算两组，再算汇总。分组与汇总可以相反，这就是开篇的辛普森现象；也可以不相反，取决于人数结构。"
    return _mcq(
        rng,
        stem,
        correct,
        [
            "两组内部都是男生录取率更高，汇总后却是女生更高",
            "两组内部都是男生更高，汇总后仍然是男生更高",
            "两组内部都是女生更高",
            "汇总与分组一定相同，不必分组",
        ],
        why,
        "flip",
    )


def q_weight(rng):
    n1 = rng.choice([10, 20, 30, 40])
    n2 = rng.choice([10, 20, 40, 50])
    x1 = rng.choice([60, 70, 75, 80])
    x2 = rng.choice([80, 85, 90, 95])
    if x1 == x2:
        return None
    total = Fraction(n1 * x1 + n2 * x2, n1 + n2)
    simple = Fraction(x1 + x2, 2)
    stem = "甲组 " + str(n1) + " 人平均 " + str(x1) + " 分，乙组 " + str(n2) + " 人平均 " + str(x2) + " 分。全体平均分是"
    why = "全体平均要用人数作权：" + inline(ftex(total)) + "。两组人数不同时，它一般不等于两个平均分的简单平均。"
    return _mcq(rng, stem, ftex(total), [ftex(simple), str(x1), str(x2), ftex(total + 1)], why, "weight")


def _vote(scale, names):
    # 角色 A,B,C 的标准剖面，再映射到 names
    # blocs: 35 A>B>C, 33 B>C>A, 32 C>B>A
    order = {"A": names[0], "B": names[1], "C": names[2]}
    blocs = [
        (35 * scale, [order["A"], order["B"], order["C"]]),
        (33 * scale, [order["B"], order["C"], order["A"]]),
        (32 * scale, [order["C"], order["B"], order["A"]]),
    ]
    return blocs


def _plurality(blocs, names):
    score = {nm: 0 for nm in names}
    for sz, ranking in blocs:
        score[ranking[0]] += sz
    winner = max(names, key=lambda nm: score[nm])
    return winner, score


def _beats(blocs, a, b):
    fav_a = 0
    total = 0
    for sz, ranking in blocs:
        total += sz
        if ranking.index(a) < ranking.index(b):
            fav_a += sz
    return fav_a > total - fav_a


def _condorcet(blocs, names):
    winners = []
    for nm in names:
        if all(_beats(blocs, nm, other) for other in names if other != nm):
            winners.append(nm)
    return winners[0] if len(winners) == 1 else None


def q_vote(rng):
    scale = rng.choice([1, 2, 3])
    names = ["甲", "乙", "丙"]
    perm = names[:]
    rng.shuffle(perm)
    blocs = _vote(scale, perm)
    plur, score = _plurality(blocs, names)
    cond = _condorcet(blocs, names)
    if cond is None:
        return None
    desc = "；".join(str(sz) + " 人的排序是 " + ">".join(ranking) for sz, ranking in blocs)
    mode = rng.choice(["plur", "pair", "change"])
    if mode == "plur":
        stem = desc + "。按第一名得票最多，谁获胜"
        why = "只数排在第一的票。得票是 " + "，".join(nm + " " + str(score[nm]) for nm in names) + "。胜者是" + plur + "。"
        return _mcq(rng, stem, plur, [nm for nm in names if nm != plur] + ["没有胜者"], why, "vote")
    if mode == "pair":
        stem = desc + "。若要求在两两比较里都获胜，谁获胜"
        why = "两两比较看的是谁在更多人的排序里更靠前。这里" + cond + "能赢过另外两人，和只看第一名不一定是同一个人。"
        return _mcq(rng, stem, cond, [nm for nm in names if nm != cond] + ["没有这样的人"], why, "vote")
    changed = plur != cond
    stem = desc + "。只看第一名的胜者，和两两都获胜的人"
    correct = "不是同一个人" if changed else "是同一个人"
    why = "第一名胜者是" + plur + "，两两胜者是" + cond + "。" + ("规则一换，胜者就换了。" if changed else "这一组数字里两个规则碰巧选出同一人。")
    return _mcq(rng, stem, correct, ["不是同一个人", "是同一个人", "无法比较", "两种规则永远选出同一人"], why, "vote")


def hw_table(rng):
    t = _table(rng, True)
    if t is None:
        t = _table(rng, False)
    if t is None:
        return None
    labels = ["甲女", "甲男", "乙女", "乙男", "汇总女", "汇总男"]
    rates = t[8:]
    steps = ["先把每个分数约分，再比较大小。"]
    for lab, rate in zip(labels, rates):
        steps.append(lab + "：" + inline(ftex(rate)) + "。")
    flipped = rates[4] > rates[5] and rates[1] > rates[0] and rates[3] > rates[2]
    if flipped:
        steps.append("两组里都是男生录取率更高，但汇总后女生更高。女生更多集中在录取率本来就高的那一组。")
        ans = "分组与汇总相反。"
    else:
        steps.append("分组与汇总的方向一致，没有出现翻转。人数结构不够极端时，汇总不会反转。")
        ans = "分组与汇总一致。"
    stem = "根据 " + _fmt_table(t) + "，把六个录取率都化成最简分数，并说明分组结论与汇总结论是否相反。"
    return HW(stem, steps, ans, "4.0cm")


def hw_weight(rng):
    n1 = rng.choice([20, 30, 40])
    n2 = rng.choice([10, 50, 60])
    x1 = rng.choice([70, 76, 80])
    x2 = rng.choice([88, 90, 92])
    total = Fraction(n1 * x1 + n2 * x2, n1 + n2)
    simple = Fraction(x1 + x2, 2)
    steps = [
        "加权平均是 " + inline("(" + str(n1) + "\\times " + str(x1) + "+" + str(n2) + "\\times " + str(x2) + ")/(" + str(n1 + n2) + ")") + "。",
        "分子是 " + str(n1 * x1 + n2 * x2) + "，所以全体平均是 " + inline(ftex(total)) + "。",
        "两个平均分直接相加除以 2 得到 " + inline(ftex(simple)) + "。人数不等时，这不是全体平均。",
    ]
    stem = "甲组 " + str(n1) + " 人平均 " + str(x1) + " 分，乙组 " + str(n2) + " 人平均 " + str(x2) + " 分。求全体平均分，并与两个平均分的简单平均比较。"
    return HW(stem, steps, "全体平均 " + inline(ftex(total)) + "，简单平均 " + inline(ftex(simple)) + "。", "3.2cm")


def hw_vote(rng):
    scale = rng.choice([1, 2])
    names = ["甲", "乙", "丙"]
    perm = names[:]
    rng.shuffle(perm)
    blocs = _vote(scale, perm)
    plur, score = _plurality(blocs, names)
    cond = _condorcet(blocs, names)
    desc = "；".join(str(sz) + " 人排序 " + ">".join(ranking) for sz, ranking in blocs)
    steps = ["第一名票数：" + "，".join(nm + " " + str(score[nm]) + " 票" for nm in names) + "。第一名胜者是" + plur + "。"]
    for a in names:
        for b in names:
            if a >= b:
                continue
            steps.append(a + " 对 " + b + "：" + ("前者更多人把它排在前面。" if _beats(blocs, a, b) else "后者更多人把它排在前面。"))
    steps.append("两两都获胜的是" + str(cond) + "。两种规则" + ("选出了不同的人。" if plur != cond else "这次选出了同一人。"))
    stem = "计票：" + desc + "。分别用「第一名最多」和「两两都获胜」决定胜者，写出票数。"
    ans = "第一名最多：" + plur + "；两两都获胜：" + str(cond) + "。"
    return HW(stem, steps, ans, "4.0cm")


def build():
    bag = Bag(5)
    bag.fill("录取率", lambda: q_rate(bag.rng), 36)
    bag.fill("是否翻转", lambda: q_flip(bag.rng), 20)
    bag.fill("加权", lambda: q_weight(bag.rng), 20)
    bag.fill("计票", lambda: q_vote(bag.rng), 24)
    makers = [hw_table] * 8 + [hw_weight] * 6 + [hw_vote] * 6
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("00", "0 数学与人文", "00-数学与人文", bag.mcqs, bag.hws, 2)
