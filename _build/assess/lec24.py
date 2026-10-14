"""2.4 数据科学。不解特征多项式。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, mtex, ntex


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _vec(*xs):
    return sp.Matrix(list(xs))


def _cos(u, v):
    u, v = sp.Matrix(u), sp.Matrix(v)
    return sp.simplify(u.dot(v) / (sp.sqrt(u.dot(u)) * sp.sqrt(v.dot(v))))


PAIRS = [
    ((3, 4), (6, 8)),
    ((3, 4), (4, -3)),
    ((3, 4), (8, 6)),
    ((1, 0), (2, 0)),
    ((1, 0), (0, 1)),
    ((1, 0), (1, 1)),
    ((2, 1), (1, 0)),
    ((2, 1), (0, 2)),
    ((5, 0), (0, 5)),
    ((6, 8), (8, 6)),
    ((2, 2), (2, 0)),
    ((1, 2, 2), (2, 1, 2)),
    ((1, 0, 0), (1, 1, 0)),
    ((3, 0, 4), (0, 5, 0)),
    ((1, 1, 1), (1, 0, 0)),
    ((2, 3, 6), (3, 6, 2)),
]


def _rand_pair(rng):
    def one():
        while True:
            v = tuple(rng.choice([-2, -1, 0, 1, 2, 3, 4]) for _ in range(2))
            if v != (0, 0):
                return v
    return one(), one()


def q_cos(rng):
    u, v = _rand_pair(rng) if rng.random() < 0.7 else rng.choice(PAIRS)
    val = _cos(u, v)
    if val.has(sp.nan) or not (val.is_real):
        return None
    ut, vt = mtex(sp.Matrix(u)), mtex(sp.Matrix(v))
    stem = "计算 " + inline(ut) + " 与 " + inline(vt) + " 的余弦相似度"
    why = "余弦是点积除以两个长度，不只看点积。这里是 " + inline(ntex(val)) + "。同方向时为 1，垂直时为 0。"
    wrongs = [sp.simplify(sp.Matrix(u).dot(sp.Matrix(v))), 0, 1, val + 1, -val if val != 0 else sp.Rational(1, 2)]
    return _mcq(rng, stem, val, wrongs, why, "cos")


def q_which(rng):
    u = _rand_pair(rng)[0]
    cands = [(1, 0), (0, 1), (u[0] * 2, u[1] * 2), (-u[1], u[0])]
    # 与 u 余弦最大
    scores = []
    for v in cands:
        if v == (0, 0):
            continue
        scores.append((_cos(u, v), v))
    scores.sort(key=lambda t: sp.N(t[0]), reverse=True)
    best = scores[0][1]
    if scores[0][0] == scores[1][0]:
        return None
    stem = "固定 " + inline(mtex(sp.Matrix(u))) + "。下列哪个向量与它的余弦最大"
    why = "余弦看方向。把向量拉长不改变余弦；垂直的余弦是 0，比同方向小。"
    labels = [mtex(sp.Matrix(v)) for v in cands]
    return _mcq(rng, stem, mtex(sp.Matrix(best)), labels, why, "cos")


WORDS = ["春", "风", "又", "绿", "江", "南"]


def _count(text):
    return [text.count(w) for w in WORDS]


def q_bow(rng):
    # 用词表里的字拼一句，允许重复
    length = rng.randint(4, 7)
    chars = [rng.choice(WORDS) for _ in range(length)]
    text = "".join(chars)
    vec = _count(text)
    if sum(vec) != length:
        return None
    mode = rng.choice(["vec", "dim"])
    if mode == "vec":
        stem = "词表按顺序为春、风、又、绿、江、南。句子「" + text + "」的词袋向量是"
        why = "词袋只计次数，不计顺序。这一句的计数是 " + inline(mtex(sp.Matrix(vec))) + "。"
        wrong = vec[:]
        wrong[0] = wrong[0] + 1
        return _mcq(rng, stem, mtex(sp.Matrix(vec)), [mtex(sp.Matrix(wrong)), mtex(sp.Matrix(vec[::-1])), mtex(sp.eye(2)), "全是 0"], why, "bow")
    idx = rng.randrange(6)
    stem = "词表春、风、又、绿、江、南。句子「" + text + "」里，「" + WORDS[idx] + "」这一维的计数是"
    why = "只数这个字出现几次，不看它旁边是谁。"
    return _mcq(rng, stem, vec[idx], [vec[idx] + 1, max(vec[idx] - 1, 0), length, 0 if vec[idx] else 1], why, "bow")


def _chain(rng):
    # 三页 A,B,C。每列是出发页的跳转，列和为 1。
    # 随机每页 1 或 2 个出链
    P = sp.zeros(3)
    for col in range(3):
        outs = rng.sample([0, 1, 2], rng.choice([1, 2]))
        for r in outs:
            P[r, col] = sp.Rational(1, len(outs))
    return P


def q_pr(rng):
    P = _chain(rng)
    if any(sp.simplify(sum(P[:, j]) - 1) != 0 for j in range(3)):
        return None
    x0 = sp.Matrix([1, 0, 0]) if rng.random() < 0.5 else sp.Matrix([sp.Rational(1, 3)] * 3)
    x1 = sp.simplify(P * x0)
    k = rng.randrange(3)
    stem = "转移矩阵（列是出发页）" + inline("P=" + mtex(P)) + "，当前权重 " + inline(mtex(x0)) + "。走一步后，第 " + str(k + 1) + " 页的权重是"
    why = "走一步就是用 P 左乘权重。第 " + str(k + 1) + " 个分量是 " + inline(ntex(x1[k])) + "。这里不解特征多项式。"
    return _mcq(rng, stem, x1[k], [x0[k], x1[(k + 1) % 3], sp.Integer(1), 0], why, "pr")


def hw_cos(rng):
    u, v = rng.choice([p for p in PAIRS if len(p[0]) == 2])
    val = _cos(u, v)
    nu = sp.sqrt(sp.Matrix(u).dot(u))
    nv = sp.sqrt(sp.Matrix(v).dot(v))
    dot = sp.Matrix(u).dot(v)
    steps = [
        "点积是 " + inline(ntex(dot)) + "。",
        "两个长度分别是 " + inline(ntex(nu)) + " 与 " + inline(ntex(nv)) + "。",
        "余弦等于点积除以长度之积：" + inline(ntex(val)) + "。",
        "长度不同也可以方向很近。只比点积会被长向量带偏。",
    ]
    stem = "计算 " + inline(mtex(sp.Matrix(u))) + " 与 " + inline(mtex(sp.Matrix(v))) + " 的余弦，写出点积和长度。"
    return HW(stem, steps, inline(ntex(val)), "3.4cm")


def hw_bow(rng):
    text = "".join(rng.choice(WORDS) for _ in range(6))
    vec = _count(text)
    steps = ["词表顺序：春、风、又、绿、江、南。"]
    steps.append("逐字计数，得到 " + inline(mtex(sp.Matrix(vec))) + "。")
    steps.append("词袋不管词序。把字换位置，向量不变；多写一个字，对应那一维加 1。")
    stem = "把「" + text + "」写成词袋向量（词表：春风又绿江南）。"
    return HW(stem, steps, inline(mtex(sp.Matrix(vec))))


def hw_pr(rng):
    P = _chain(rng)
    x0 = sp.Matrix([1, 0, 0])
    x1 = sp.simplify(P * x0)
    steps = [
        "每一列是从该页出发的跳转概率，列和为 1。",
        "当前权重在第一页，向量是 " + inline(mtex(x0)) + "。",
        "走一步：用第一列作为新的权重，得到 " + inline(mtex(x1)) + "。",
        "反复做会靠近 Px=x 的方向。本讲不计算特征多项式。",
    ]
    stem = "转移矩阵 " + inline("P=" + mtex(P)) + "。从权重 (1,0,0) 出发走一步，写出新的权重向量。"
    return HW(stem, steps, inline(mtex(x1)), "3.6cm")


def hw_compare(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([k for k in [2, 3, 4, 5] if k != a])
    c = rng.choice([1, 2, 3])
    dist_v = abs(b - a)
    dist_w = sp.sqrt(a**2 + c**2)
    steps = [
        "u=(" + str(a) + ",0)，v=(" + str(b) + ",0) 同方向，余弦是 1。",
        "w=(0," + str(c) + ") 与 u 垂直，余弦是 0。",
        "欧氏距离 |u-v|=" + str(dist_v) + "，|u-w|=" + inline(ntex(dist_w)) + "。",
        "余弦只看方向，所以 v 与 u 最像。欧氏距离 |u-w| 与 |u-v| 比较后，更远的是 "
        + ("w。" if dist_w > dist_v else "v。" if dist_w < dist_v else "二者一样远。")
        + "文本比较更常看余弦，避免只被文章长短带走。",
    ]
    stem = "u=(" + str(a) + ",0)，v=(" + str(b) + ",0)，w=(0," + str(c) + ")。谁与 u 的余弦最大？谁的欧氏距离更大？写出计算。"
    if dist_w > dist_v:
        far = "w"
    elif dist_w < dist_v:
        far = "v"
    else:
        far = "v 与 w 相同"
    return HW(stem, steps, "余弦最大的是 v；欧氏距离更大的是 " + far + "。", "3.4cm")


def build():
    bag = Bag(24024)
    bag.fill("余弦", lambda: q_cos(bag.rng), 28)
    bag.fill("谁更近", lambda: q_which(bag.rng), 16)
    bag.fill("词袋", lambda: q_bow(bag.rng), 28)
    bag.fill("网页", lambda: q_pr(bag.rng), 28)
    makers = [hw_cos] * 6 + [hw_bow] * 5 + [hw_pr] * 5 + [hw_compare] * 4
    assert len(makers) == 20
    for i, fn in enumerate(makers):
        bag.fill_hw("h" + str(i), lambda fn=fn: fn(bag.rng))
    return Paper("24", "2.4 数据科学", "24-数据科学", bag.mcqs, bag.hws, 1)
