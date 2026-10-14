"""2.2 矩阵：选择题与作业。"""
from __future__ import annotations

import sympy as sp

from core import Bag, HW, Paper, inline, mtex, ntex

EYE2 = sp.eye(2)


def _factor(v) -> str:
    v = sp.sympify(v)
    s = ntex(v)
    if v.is_number and v < 0:
        return "(" + s + ")"
    return s


def _entries(rng, n, allow_zero=True, frac=False):
    vals = []
    for _ in range(n):
        if frac and rng.random() < 0.25:
            vals.append(sp.Rational(rng.choice([-3, -1, 1, 3]), 2))
            continue
        pool = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]
        if allow_zero:
            pool.append(0)
        vals.append(rng.choice(pool))
    return vals


def _mat(rng, rows, cols, allow_zero=True, frac=False):
    data = _entries(rng, rows * cols, allow_zero, frac)
    M = sp.Matrix(rows, cols, data)
    if M == sp.zeros(rows, cols):
        return None
    return M


def _mcq(rng, stem, correct, wrongs, why, topic):
    return Bag(rng.randrange(1, 10**6)).make_mcq(stem, correct, wrongs, why, topic)


def _vary(M):
    bad = sp.Matrix(M)
    bad[0, 0] = sp.simplify(bad[0, 0] + 1)
    flip = sp.Matrix(M)
    flip[0, 0] = sp.simplify(-flip[0, 0])
    return bad, flip


def q_add(rng):
    rows = rng.choice([2, 2, 3])
    cols = rng.choice([2, 3]) if rows == 2 else rng.choice([2, 3])
    A = _mat(rng, rows, cols, True, True)
    B = _mat(rng, rows, cols, True, True)
    if A is None or B is None or A == B:
        return None
    mode = rng.choice(["add", "sub", "scalar"])
    if mode == "scalar":
        k = rng.choice([-3, -2, 2, 3, sp.Rational(1, 2), sp.Rational(3, 2)])
        correct = k * A
        add_k = A.applyfunc(lambda v: v + k)
        only_row = sp.Matrix(A)
        for j in range(cols):
            only_row[0, j] = k * only_row[0, j]
        wrongs = [add_k, only_row, A + k * sp.ones(rows, cols), -k * A]
        stem = "计算 " + inline(ntex(k) + r"\cdot " + mtex(A))
        why = "数乘是每个元素都乘同一个数，不是只乘第一行，也不是把数加到每个元素上。"
        topic = "scalar"
    elif mode == "sub":
        correct = sp.simplify(A - B)
        wrongs = [A + B, B - A, A.multiply_elementwise(B) if False else A + B]
        bad, flip = _vary(correct)
        wrongs = [A + B, B - A, bad, flip]
        stem = "计算 " + inline(mtex(A) + "-" + mtex(B))
        why = "同型矩阵才能相减，对应位置相减。减号不能换成加号，也不能交换被减数。"
        topic = "add"
    else:
        correct = A + B
        bad, flip = _vary(correct)
        wrongs = [A - B, bad, flip, B - A]
        stem = "计算 " + inline(mtex(A) + "+" + mtex(B))
        why = "同型矩阵相加是对应位置相加。不能把加号当成乘法。"
        topic = "add"
    if correct.shape != wrongs[0].shape:
        return None
    return _mcq(rng, stem, mtex(correct), [mtex(w) for w in wrongs], why, topic)


def q_mul(rng):
    kind = rng.choice(["square", "square", "rect", "tri"])
    if kind == "rect":
        if rng.random() < 0.5:
            A = _mat(rng, 2, 3, True, False)
            B = _mat(rng, 3, 2, True, False)
        else:
            A = _mat(rng, 3, 2, True, False)
            B = _mat(rng, 2, 3, True, False)
    elif kind == "tri":
        a, b, c = _entries(rng, 3, allow_zero=False, frac=False)
        d, e, f = _entries(rng, 3, allow_zero=True, frac=False)
        A = sp.Matrix([[a, b], [0, c]])
        B = sp.Matrix([[d, e], [0, f]])
    else:
        A = _mat(rng, 2, 2, True, rng.random() < 0.3)
        B = _mat(rng, 2, 2, True, False)
    if A is None or B is None:
        return None
    if A.cols != B.rows:
        return None
    C = sp.simplify(A * B)
    bad, flip = _vary(C)
    wrongs = [bad, flip]
    if A.shape == B.shape:
        wrongs.append(sp.simplify(B * A))
        wrongs.append(A.multiply_elementwise(B))
    else:
        wrongs.append(sp.simplify(C.T) if C.rows == C.cols else bad + flip)
        extra = sp.Matrix(C)
        extra[-1, -1] = sp.simplify(extra[-1, -1] - 2)
        wrongs.append(extra)
    stem = "计算 " + inline(mtex(A) + mtex(B)) + "。乘法是行乘列，不是对应位置相乘。"
    why = "结果的第 i 行第 j 列，是左边第 i 行与右边第 j 列的对应乘积之和。"
    return _mcq(rng, stem, mtex(C), [mtex(w) for w in wrongs if w.shape == C.shape], why, "mul")


def q_order(rng):
    A = _mat(rng, 2, 2, True, False)
    B = _mat(rng, 2, 2, True, False)
    if A is None or B is None or A == B:
        return None
    AB = sp.simplify(A * B)
    BA = sp.simplify(B * A)
    stem = "设 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "。则 AB 等于"
    why = "先算行乘列。AB 与 BA 一般不相等，也不能改成对应位置相乘。"
    wrongs = [BA, A + B, A.multiply_elementwise(B), sp.simplify(AB.T)]
    if AB == BA:
        stem = "设 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "。AB 与 BA"
        return _mcq(
            rng,
            stem,
            "相等",
            ["不相等", "都没有意义", "互为转置但一定不相等"],
            "这两支恰好可以交换，但乘法一般仍不能随便换序。",
            "order",
        )
    return _mcq(rng, stem, mtex(AB), [mtex(w) for w in wrongs], why, "order")


def q_size(rng):
    shapes = [(2, 2), (2, 3), (3, 2), (3, 3), (3, 1), (1, 3), (2, 1)]
    ra, ca = rng.choice(shapes)
    rb, cb = rng.choice(shapes)
    correct_ok = ca == rb
    true = ("有意义，结果是 " + str(ra) + " 行 " + str(cb) + " 列") if correct_ok else (
        "无意义：左边列数是 " + str(ca) + "，右边行数是 " + str(rb)
    )
    cands = [
        true,
        "无意义：左边列数是 " + str(ca) + "，右边行数是 " + str(rb),
        "有意义，结果是 " + str(ra) + " 行 " + str(cb) + " 列",
        "有意义，结果是 " + str(ca) + " 行 " + str(rb) + " 列",
        "有意义，结果是 " + str(cb) + " 行 " + str(ra) + " 列",
        "无意义，因为矩阵里出现了 0",
        "有意义，因为两个都是数表，结果行数等于列数",
    ]
    stem = (
        "A 是 "
        + str(ra)
        + " 行 "
        + str(ca)
        + " 列，B 是 "
        + str(rb)
        + " 行 "
        + str(cb)
        + " 列。乘积 AB"
    )
    why = "先看左边的列数是否等于右边的行数。相等才可乘，结果取左边的行数和右边的列数。"
    return _mcq(rng, stem, true, cands, why, "size")


def _inv_parts(A):
    a, b = A[0, 0], A[0, 1]
    c, d = A[1, 0], A[1, 1]
    det = sp.simplify(a * d - b * c)
    adj = sp.Matrix([[d, -b], [-c, a]])
    return det, adj


def q_inv(rng):
    singular = rng.random() < 0.28
    if singular:
        r1 = _entries(rng, 2, allow_zero=False, frac=False)
        k = rng.choice([-2, -1, 2, 3])
        A = sp.Matrix([r1, [k * r1[0], k * r1[1]]])
        if A.det() != 0:
            return None
        det, adj = _inv_parts(A)
        fake = adj  # 行列式为 0 时公式不能用
        stem = "矩阵 " + inline("A=" + mtex(A)) + " 的逆"
        why = "行列式 " + inline("D=" + ntex(det)) + " 等于 0，所以不可逆。不能硬套对调、变号再除以 D。"
        return _mcq(
            rng,
            stem,
            "不可逆",
            [
                "可逆，而且逆是单位阵",
                "可逆，逆等于 " + inline(mtex(fake)),
                "可逆，逆等于单位阵 " + inline(mtex(sp.eye(2))),
                "可逆，把每个元素取倒数即可",
            ],
            why,
            "inv",
        )
    A = _mat(rng, 2, 2, True, rng.random() < 0.35)
    if A is None:
        return None
    det, adj = _inv_parts(A)
    if det == 0 or sp.fraction(sp.together(det))[1] > 4 or abs(det) > 12:
        return None
    inv = sp.simplify(A.inv())
    if sp.simplify(A * inv - EYE2) != sp.zeros(2):
        return None
    sign_wrong = sp.Matrix([[adj[0, 0], -adj[0, 1]], [-adj[1, 0], adj[1, 1]]]) / det
    no_div = adj
    swapped = sp.Matrix([[a, b], [c, d]]) if False else sp.Matrix([[A[1, 1], A[0, 1]], [A[1, 0], A[0, 0]]]) / det
    stem = "求 " + inline(mtex(A)) + " 的逆矩阵。"
    why = "先算 D=ad-bc。D 不为 0 时，主对角对调、副对角变号，再除以 D。结果应当左乘、右乘都得到单位阵。"
    return _mcq(
        rng,
        stem,
        mtex(inv),
        [mtex(sp.simplify(sign_wrong)), mtex(no_div), "不可逆", mtex(sp.simplify(swapped))],
        why + " 这里 D=" + inline(ntex(det)) + "。",
        "inv",
    )


def q_transpose(rng):
    mode = rng.choice(["T", "ABT", "power", "zero"])
    if mode == "T":
        A = _mat(rng, rng.choice([2, 3]), rng.choice([2, 3]), True, False)
        if A is None:
            return None
        stem = inline("A=" + mtex(A)) + " 的转置是"
        bad, flip = _vary(A.T)
        why = "转置是行列互换，不是把每个元素变号。"
        return _mcq(rng, stem, mtex(A.T), [mtex(bad), mtex(-A), mtex(flip), mtex(A)], why, "transpose")
    if mode == "power":
        A = _mat(rng, 2, 2, True, False)
        if A is None:
            return None
        C = sp.simplify(A * A)
        bad, flip = _vary(C)
        stem = "计算 " + inline(mtex(A) + "^2")
        why = "方阵的平方是自己乘自己，用行乘列，不是每个元素平方。"
        elem = A.applyfunc(lambda v: v**2)
        return _mcq(rng, stem, mtex(C), [mtex(elem), mtex(bad), mtex(2 * A), mtex(flip)], why, "power")
    if mode == "zero":
        a = rng.choice([1, 2, 3, -1, -2])
        b = rng.choice([1, 2, -1, 3])
        A = sp.Matrix([[a, -a], [b, -b]])
        c = rng.choice([1, 2, -1])
        d = rng.choice([1, -2, 3])
        B = sp.Matrix([[c, d], [c, d]])
        AB = sp.simplify(A * B)
        if AB != sp.zeros(2) or A == sp.zeros(2) or B == sp.zeros(2):
            return None
        stem = "设 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "。则 AB"
        why = "AB 是零矩阵，但 A、B 都不是零矩阵。矩阵里不能由乘积为零推出其中一个因子为零，也不能随便约去。"
        return _mcq(
            rng,
            stem,
            "是零矩阵，但 A 和 B 都不是零矩阵",
            [
                "是零矩阵，所以 A 或 B 至少有一个是零矩阵",
                "不是零矩阵",
                "没有意义",
            ],
            why,
            "zero",
        )
    A = _mat(rng, 2, 2, True, False)
    B = _mat(rng, 2, 2, True, False)
    if A is None or B is None:
        return None
    left = sp.simplify((A * B).T)
    right = sp.simplify(B.T * A.T)
    wrong = sp.simplify(A.T * B.T)
    if left != right:
        return None
    stem = "设 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "。则 (AB) 的转置等于"
    why = "乘积的转置要把次序倒过来：(AB) 的转置等于 B 的转置乘 A 的转置，不是 A 的转置乘 B 的转置。"
    return _mcq(rng, stem, mtex(left), [mtex(wrong), mtex(A * B), mtex(A.T + B.T), mtex(sp.simplify((B * A).T))], why, "transpose")


def _prod_steps(A, B, name="AB"):
    C = sp.simplify(A * B)
    steps = ["先核对尺寸：左边是 " + str(A.rows) + " 行 " + str(A.cols) + " 列，右边是 " + str(B.rows) + " 行 " + str(B.cols) + " 列，可以相乘，结果是 " + str(C.rows) + " 行 " + str(C.cols) + " 列。"]
    for i in range(C.rows):
        for j in range(C.cols):
            bits = []
            acc = 0
            for k in range(A.cols):
                bits.append(_factor(A[i, k]) + r"\cdot " + _factor(B[k, j]))
                acc += A[i, k] * B[k, j]
            if sp.simplify(acc - C[i, j]) != 0:
                raise AssertionError("点乘与矩阵乘法不一致")
            body = "(" + name + ")_{" + str(i + 1) + str(j + 1) + "}=" + " + ".join(bits) + "=" + ntex(sp.simplify(acc))
            steps.append(inline(body) + "。")
    steps.append("所以结果是 " + inline(mtex(C)) + "。")
    return steps, C


def hw_mul(rng, kind):
    if kind == "rect23":
        A, B = _mat(rng, 2, 3, True, False), _mat(rng, 3, 2, True, False)
    elif kind == "rect32":
        A, B = _mat(rng, 3, 2, True, False), _mat(rng, 2, 3, True, False)
    elif kind == "tri":
        A = sp.Matrix([[rng.choice([1, 2, 3, -1]), rng.choice([-2, 1, 4]), 0], [0, rng.choice([2, -1, 3]), rng.choice([1, -2])]])
        # 2x3? wait I wanted triangular 2x2
        A = sp.Matrix([[rng.choice([2, 3, -1, 4]), rng.choice([-3, 2, 5])], [0, rng.choice([-2, 3, 4])]])
        B = sp.Matrix([[rng.choice([1, -2, 3]), rng.choice([0, 2, -1])], [0, rng.choice([2, -3, 1])]])
    else:
        A, B = _mat(rng, 2, 2, True, kind == "frac"), _mat(rng, 2, 2, True, False)
    if A is None or B is None:
        return None
    steps, C = _prod_steps(A, B)
    stem = "计算 " + inline(mtex(A) + mtex(B)) + "，写出每个位置的行乘列。"
    return HW(stem, steps, inline(mtex(C)), "3.6cm")


def hw_order(rng):
    A = _mat(rng, 2, 2, True, False)
    B = _mat(rng, 2, 2, True, False)
    if A is None or B is None or A == B:
        return None
    steps1, AB = _prod_steps(A, B, "AB")
    steps2, BA = _prod_steps(B, A, "BA")
    same = AB == BA
    steps = steps1 + steps2
    steps.append("两者" + ("恰好相等。" if same else "不相等。乘法一般不能换序，这一对就是例子。"))
    stem = "分别计算 AB 与 BA，其中 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "。说明能否交换。"
    ans = "AB=" + inline(mtex(AB)) + "，BA=" + inline(mtex(BA)) + "，" + ("相等。" if same else "不相等。")
    return HW(stem, steps, ans, "4.2cm")


def hw_size(rng):
    Ashape = rng.choice([(2, 3), (3, 2), (2, 2), (3, 3)])
    Bshape = rng.choice([(2, 3), (3, 2), (2, 2), (3, 1)])
    ra, ca = Ashape
    rb, cb = Bshape
    steps = []
    for name, left, right in (("AB", (ra, ca), (rb, cb)), ("BA", (rb, cb), (ra, ca))):
        if left[1] != right[0]:
            steps.append(name + "：左边列数是 " + str(left[1]) + "，右边行数是 " + str(right[0]) + "，不相等，没有意义。")
        else:
            steps.append(name + "：列数与行数同为 " + str(left[1]) + "，有意义，结果是 " + str(left[0]) + " 行 " + str(right[1]) + " 列。")
    steps.append("先看尺寸，再谈数值。尺寸不同的两个乘积不能比较是否相等。")
    stem = (
        "A 是 "
        + str(ra)
        + " 行 "
        + str(ca)
        + " 列，B 是 "
        + str(rb)
        + " 行 "
        + str(cb)
        + " 列。哪些乘积有意义？结果各是几行几列？请写出尺寸检查。"
    )
    return HW(stem, steps, "见过程中的尺寸结论。", "3.2cm")


def hw_inv(rng, singular=False):
    if singular:
        row = _entries(rng, 2, allow_zero=False, frac=False)
        k = rng.choice([2, -1, 3])
        A = sp.Matrix([row, [k * row[0], k * row[1]]])
        if A.det() != 0:
            return None
        det, _adj = _inv_parts(A)
        steps = [
            "先算行列式 D=ad-bc。",
            inline("D=" + ntex(det)) + "。",
            "D=0，所以不可逆。此时不要写逆矩阵，也不要做除法。",
        ]
        stem = "判断 " + inline(mtex(A)) + " 是否可逆。若不可逆，说明理由。"
        return HW(stem, steps, "不可逆，因为行列式为 0。")
    A = _mat(rng, 2, 2, True, False)
    if A is None:
        return None
    det, adj = _inv_parts(A)
    if det == 0 or abs(det) > 10:
        return None
    inv = sp.simplify(adj / det)
    prod = sp.simplify(A * inv)
    if prod != EYE2:
        return None
    steps = [
        "D=ad-bc=" + inline(ntex(det)) + "，不为 0，可逆。",
        "主对角对调、副对角变号，得到 " + inline(mtex(adj)) + "，再除以 D。",
        "所以逆矩阵是 " + inline(mtex(inv)) + "。",
        "验证：" + inline(mtex(A) + mtex(inv) + "=" + mtex(prod)) + "，等于单位阵。",
    ]
    stem = "求 " + inline(mtex(A)) + " 的逆，并计算它与原矩阵的乘积以验证。"
    return HW(stem, steps, inline(mtex(inv)), "3.8cm")


def hw_zero(rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2, 4])
    A = sp.Matrix([[a, -a], [b, -b]])
    c = rng.choice([1, 2])
    d = rng.choice([-1, 3])
    B = sp.Matrix([[c, d], [c, d]])
    steps, C = _prod_steps(A, B)
    if C != sp.zeros(2):
        return None
    steps.append("A 不是零矩阵，B 也不是，但乘积是零矩阵。因此不能从 AB=0 推出 A=0 或 B=0，也不能在矩阵方程里随便约去公因子。")
    stem = "计算 " + inline(mtex(A) + mtex(B)) + "，并说明它为什么说明「乘积为零则因子为零」对矩阵不成立。"
    return HW(stem, steps, "AB 是零矩阵，但 A、B 都不是。", "3.8cm")


def hw_solve(rng):
    A = _mat(rng, 2, 2, allow_zero=True, frac=False)
    if A is None or A.det() == 0 or abs(A.det()) > 8:
        return None
    B = sp.Matrix(2, 1, _entries(rng, 2, allow_zero=True, frac=False))
    inv = sp.simplify(A.inv())
    X = sp.simplify(inv * B)
    if sp.simplify(A * X - B) != sp.zeros(2, 1):
        return None
    steps = [
        "方程 AX=B 的两边要左乘 A 的逆，得到 X=A 的逆乘 B。不能写成 B 乘 A 的逆。",
        "A 的行列式是 " + inline(ntex(A.det())) + "，逆矩阵是 " + inline(mtex(inv)) + "。",
        "再与 B 相乘：" + inline("X=" + mtex(X)) + "。",
        "代回：" + inline(mtex(A) + mtex(X) + "=" + mtex(sp.simplify(A * X))) + "，等于 B。",
    ]
    stem = "已知 AX=B，其中 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "。用逆矩阵求出 X，并说明乘在哪一侧。"
    return HW(stem, steps, inline("X=" + mtex(X)), "3.8cm")


def hw_cancel(rng):
    C = sp.Matrix([[1, 1], [2, 2]])
    W = sp.Matrix([[1, -sp.Rational(1, 2)], [2, -1]])
    # W 应当满足 W*C=0
    if sp.simplify(W * C) != sp.zeros(2):
        W = sp.Matrix([[2, -1], [2, -1]])
    if sp.simplify(W * C) != sp.zeros(2):
        return None
    A = sp.Matrix([[1, 0], [0, 3]])
    B = sp.simplify(A + W)
    if A == B or sp.simplify(A * C - B * C) != sp.zeros(2):
        return None
    steps = [
        "C 的两行成比例，行列式为 0，它是奇异的，但不是零矩阵。",
        "计算 AC=" + inline(mtex(sp.simplify(A * C))) + "。",
        "计算 BC=" + inline(mtex(sp.simplify(B * C))) + "。",
        "AC=BC，但是 A 不等于 B。所以不能从 AC=BC 约去 C。",
    ]
    stem = "设 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "，" + inline("C=" + mtex(C)) + "。验证 AC=BC 但 A 不等于 B，并说明为什么不能约去 C。"
    return HW(stem, steps, "AC=BC，但 A 不等于 B，C 不可约去。", "3.6cm")


def hw_transpose_prod(rng):
    A = _mat(rng, 2, 2, True, False)
    B = _mat(rng, 2, 2, True, False)
    if A is None or B is None:
        return None
    AB = sp.simplify(A * B)
    left = sp.simplify(AB.T)
    right = sp.simplify(B.T * A.T)
    wrong = sp.simplify(A.T * B.T)
    if left != right:
        return None
    steps = [
        "先算 AB=" + inline(mtex(AB)) + "，再转置得 " + inline(mtex(left)) + "。",
        "另一条路：先转置再倒序相乘，B 的转置乘 A 的转置是 " + inline(mtex(right)) + "。",
        "两条路相同。若误做成 A 的转置乘 B 的转置，会得到 " + inline(mtex(wrong)) + "，一般并不一样。",
    ]
    stem = "对 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "，验证 (AB) 的转置等于 B 的转置乘 A 的转置。"
    return HW(stem, steps, inline(mtex(left)))


def hw_vec(rng):
    A = _mat(rng, 3, 3, True, False)
    v = sp.Matrix(3, 1, [rng.choice([-2, -1, 1, 2, 3]) for _ in range(3)])
    if A is None:
        return None
    # 让矩阵稍疏一点，避免作业过重：把左下角压成 0
    A = sp.Matrix([[A[0, 0], A[0, 1], A[0, 2]], [A[1, 0], A[1, 1], 0], [0, A[2, 1], A[2, 2]]])
    steps, C = _prod_steps(A, v, "Av")
    stem = "计算矩阵乘向量 " + inline(mtex(A) + mtex(v)) + "。把它看成三次行乘列。"
    return HW(stem, steps, inline(mtex(C)), "3.6cm")


def hw_add(rng):
    A = _mat(rng, 2, 3, True, True)
    B = _mat(rng, 2, 3, True, False)
    k = rng.choice([2, -2, 3])
    if A is None or B is None:
        return None
    S = sp.simplify(A + B)
    P = sp.simplify(k * A)
    steps = [
        "A 与 B 都是 2 行 3 列，同型，可以相加。对应位置相加得 " + inline(mtex(S)) + "。",
        "数乘 " + inline(ntex(k) + r"A") + " 是每个元素乘 " + inline(ntex(k)) + "，得 " + inline(mtex(P)) + "。",
        "加法可以交换，乘法不行。这一题只检查加法与数乘。",
    ]
    stem = "设 " + inline("A=" + mtex(A)) + "，" + inline("B=" + mtex(B)) + "。计算 A+B，以及 " + inline(ntex(k) + "A") + "。"
    return HW(stem, steps, "A+B=" + inline(mtex(S)) + "，" + inline(ntex(k) + "A=" + mtex(P)))


def build():
    bag = Bag(22022)
    bag.fill("加减数乘", lambda: q_add(bag.rng), 16)
    bag.fill("乘法", lambda: q_mul(bag.rng), 22)
    bag.fill("次序", lambda: q_order(bag.rng), 14)
    bag.fill("尺寸", lambda: q_size(bag.rng), 14)
    bag.fill("逆", lambda: q_inv(bag.rng), 18)
    bag.fill("转置幂零因子", lambda: q_transpose(bag.rng), 16)
    makers = [
        ("乘法1", lambda rng: hw_mul(rng, "gen")),
        ("乘法2", lambda rng: hw_mul(rng, "gen")),
        ("三角乘法", lambda rng: hw_mul(rng, "tri")),
        ("含分数乘法", lambda rng: hw_mul(rng, "frac")),
        ("2乘3", lambda rng: hw_mul(rng, "rect23")),
        ("3乘2", lambda rng: hw_mul(rng, "rect32")),
        ("换序", hw_order),
        ("换序2", hw_order),
        ("尺寸", hw_size),
        ("尺寸2", hw_size),
        ("求逆", lambda rng: hw_inv(rng, False)),
        ("求逆2", lambda rng: hw_inv(rng, False)),
        ("不可逆", lambda rng: hw_inv(rng, True)),
        ("加法数乘", hw_add),
        ("转置乘积", hw_transpose_prod),
        ("零因子", hw_zero),
        ("平方", lambda rng: hw_mul(rng, "gen")),  # replaced below if we want A^2 specifically
        ("解方程", hw_solve),
        ("不能约去", hw_cancel),
        ("矩阵乘向量", hw_vec),
    ]
    # 第 17 槽改成方阵平方，避免和普通乘法完全同型
    makers[16] = ("平方", _hw_square)
    assert len(makers) == 20
    for name, fn in makers:
        bag.fill_hw(name, lambda fn=fn: fn(bag.rng))
    return Paper("22", "2.2 矩阵及其运算", "22-矩阵", bag.mcqs, bag.hws, quiz_columns=1)


def _hw_square(rng):
    A = _mat(rng, 2, 2, True, False)
    if A is None:
        return None
    steps, C = _prod_steps(A, A, "A^2")
    elem = A.applyfunc(lambda v: sp.simplify(v**2))
    steps.append("若误把每个元素各自平方，会得到 " + inline(mtex(elem)) + "，那不是矩阵乘法。")
    stem = "计算 " + inline(mtex(A) + "^2") + "，并与「每个元素各自平方」的结果对照。"
    return HW(stem, steps, inline(mtex(C)), "3.6cm")
