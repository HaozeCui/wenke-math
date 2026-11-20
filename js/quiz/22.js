window.QUIZ = window.QUIZ || {};
window.QUIZ["22"] = [
{
"stem": "计算 \\(\\begin{pmatrix}- \\frac{1}{2} & 0 & - \\frac{1}{2} \\\\ 2 & -4 & \\frac{1}{2}\\end{pmatrix}+\\begin{pmatrix}2 & 2 & 4 \\\\ - \\frac{3}{2} & - \\frac{3}{2} & -3\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}\\frac{3}{2} & 2 & \\frac{7}{2} \\\\ \\frac{1}{2} & - \\frac{11}{2} & - \\frac{5}{2}\\end{pmatrix}",
"\\begin{pmatrix}- \\frac{3}{2} & 2 & \\frac{7}{2} \\\\ \\frac{1}{2} & - \\frac{11}{2} & - \\frac{5}{2}\\end{pmatrix}",
"\\begin{pmatrix}- \\frac{5}{2} & -2 & - \\frac{9}{2} \\\\ \\frac{7}{2} & - \\frac{5}{2} & \\frac{7}{2}\\end{pmatrix}",
"\\begin{pmatrix}\\frac{5}{2} & 2 & \\frac{7}{2} \\\\ \\frac{1}{2} & - \\frac{11}{2} & - \\frac{5}{2}\\end{pmatrix}"
],
"answer": 0,
"explain": "同型矩阵相加是对应位置相加。不能把加号当成乘法。",
"topic": "add"
},
{
"stem": "计算 \\(2\\cdot \\begin{pmatrix}-3 & -2 \\\\ 2 & -4\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}-6 & -4 \\\\ 4 & -8\\end{pmatrix}",
"\\begin{pmatrix}6 & 4 \\\\ -4 & 8\\end{pmatrix}",
"\\begin{pmatrix}-1 & 0 \\\\ 4 & -2\\end{pmatrix}",
"\\begin{pmatrix}-6 & -4 \\\\ 2 & -4\\end{pmatrix}"
],
"answer": 0,
"explain": "数乘是每个元素都乘同一个数，不是只乘第一行，也不是把数加到每个元素上。",
"topic": "scalar"
},
{
"stem": "计算 \\(\\begin{pmatrix}-3 & -5 \\\\ 0 & -3\\end{pmatrix}\\begin{pmatrix}0 & -5 \\\\ 0 & -3\\end{pmatrix}\\)。乘法是行乘列，不是对应位置相乘。",
"choices": [
"\\begin{pmatrix}0 & 15 \\\\ 0 & 9\\end{pmatrix}",
"\\begin{pmatrix}0 & 30 \\\\ 0 & 9\\end{pmatrix}",
"\\begin{pmatrix}0 & 25 \\\\ 0 & 9\\end{pmatrix}",
"\\begin{pmatrix}1 & 30 \\\\ 0 & 9\\end{pmatrix}"
],
"answer": 1,
"explain": "结果的第 i 行第 j 列，是左边第 i 行与右边第 j 列的对应乘积之和。",
"topic": "mul"
},
{
"stem": "设 \\(A=\\begin{pmatrix}-1 & 3 \\\\ -4 & -4\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}-5 & -1 \\\\ 0 & 4\\end{pmatrix}\\)。则 AB 等于",
"choices": [
"\\begin{pmatrix}5 & 13 \\\\ 20 & -12\\end{pmatrix}",
"\\begin{pmatrix}9 & -11 \\\\ -16 & -16\\end{pmatrix}",
"\\begin{pmatrix}-6 & 2 \\\\ -4 & 0\\end{pmatrix}",
"\\begin{pmatrix}5 & -3 \\\\ 0 & -16\\end{pmatrix}"
],
"answer": 0,
"explain": "先算行乘列。AB 与 BA 一般不相等，也不能改成对应位置相乘。",
"topic": "order"
},
{
"stem": "A 是 2 行 1 列，B 是 3 行 3 列。乘积 AB",
"choices": [
"有意义，结果是 1 行 3 列",
"无意义：左边列数是 1，右边行数是 3",
"有意义，结果是 2 行 3 列",
"有意义，结果是 3 行 2 列"
],
"answer": 1,
"explain": "先看左边的列数是否等于右边的行数。相等才可乘，结果取左边的行数和右边的列数。",
"topic": "size"
},
{
"stem": "求 \\(\\begin{pmatrix}-3 & 0 \\\\ 5 & - \\frac{1}{2}\\end{pmatrix}\\) 的逆矩阵。",
"choices": [
"\\begin{pmatrix}- \\frac{1}{3} & 0 \\\\ \\frac{10}{3} & -2\\end{pmatrix}",
"不可逆",
"\\begin{pmatrix}- \\frac{1}{3} & 0 \\\\ - \\frac{10}{3} & -2\\end{pmatrix}",
"\\begin{pmatrix}- \\frac{1}{2} & 0 \\\\ -5 & -3\\end{pmatrix}"
],
"answer": 2,
"explain": "先算 D=ad-bc。D 不为 0 时，主对角对调、副对角变号，再除以 D。结果应当左乘、右乘都得到单位阵。 这里 D=\\(\\frac{3}{2}\\)。",
"topic": "inv"
},
{
"stem": "设 \\(A=\\begin{pmatrix}-1 & 1 \\\\ 1 & -1\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}-1 & -2 \\\\ -1 & -2\\end{pmatrix}\\)。则 AB",
"choices": [
"没有意义",
"是零矩阵，但 A 和 B 都不是零矩阵",
"是零矩阵，所以 A 或 B 至少有一个是零矩阵",
"不是零矩阵"
],
"answer": 1,
"explain": "AB 是零矩阵，但 A、B 都不是零矩阵。矩阵里不能由乘积为零推出其中一个因子为零，也不能随便约去。",
"topic": "zero"
},
{
"stem": "\\(A=\\begin{pmatrix}4 & -3 & 1 \\\\ 4 & 3 & -2 \\\\ 1 & -4 & 3\\end{pmatrix}\\) 的转置是",
"choices": [
"\\begin{pmatrix}-4 & 3 & -1 \\\\ -4 & -3 & 2 \\\\ -1 & 4 & -3\\end{pmatrix}",
"\\begin{pmatrix}4 & 4 & 1 \\\\ -3 & 3 & -4 \\\\ 1 & -2 & 3\\end{pmatrix}",
"\\begin{pmatrix}-4 & 4 & 1 \\\\ -3 & 3 & -4 \\\\ 1 & -2 & 3\\end{pmatrix}",
"\\begin{pmatrix}5 & 4 & 1 \\\\ -3 & 3 & -4 \\\\ 1 & -2 & 3\\end{pmatrix}"
],
"answer": 1,
"explain": "转置是行列互换，不是把每个元素变号。",
"topic": "transpose"
},
{
"stem": "计算 \\(\\begin{pmatrix}-1 & 0 \\\\ -1 & 1\\end{pmatrix}^2\\)",
"choices": [
"\\begin{pmatrix}2 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 1 & 1\\end{pmatrix}",
"\\begin{pmatrix}-2 & 0 \\\\ -2 & 2\\end{pmatrix}"
],
"answer": 1,
"explain": "方阵的平方是自己乘自己，用行乘列，不是每个元素平方。",
"topic": "power"
},
{
"stem": "计算 \\(\\begin{pmatrix}3 & \\frac{3}{2} \\\\ -1 & 0\\end{pmatrix}+\\begin{pmatrix}0 & 4 \\\\ 0 & -5\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}3 & - \\frac{5}{2} \\\\ -1 & 5\\end{pmatrix}",
"\\begin{pmatrix}-3 & \\frac{11}{2} \\\\ -1 & -5\\end{pmatrix}",
"\\begin{pmatrix}4 & \\frac{11}{2} \\\\ -1 & -5\\end{pmatrix}",
"\\begin{pmatrix}3 & \\frac{11}{2} \\\\ -1 & -5\\end{pmatrix}"
],
"answer": 3,
"explain": "同型矩阵相加是对应位置相加。不能把加号当成乘法。",
"topic": "add"
},
{
"stem": "计算 \\(-3\\cdot \\begin{pmatrix}3 & -4 & 1 \\\\ -5 & - \\frac{3}{2} & -4\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}-9 & 12 & -3 \\\\ -5 & - \\frac{3}{2} & -4\\end{pmatrix}",
"\\begin{pmatrix}-9 & 12 & -3 \\\\ 15 & \\frac{9}{2} & 12\\end{pmatrix}",
"\\begin{pmatrix}9 & -12 & 3 \\\\ -15 & - \\frac{9}{2} & -12\\end{pmatrix}",
"\\begin{pmatrix}0 & -7 & -2 \\\\ -8 & - \\frac{9}{2} & -7\\end{pmatrix}"
],
"answer": 1,
"explain": "数乘是每个元素都乘同一个数，不是只乘第一行，也不是把数加到每个元素上。",
"topic": "scalar"
},
{
"stem": "计算 \\(\\begin{pmatrix}-4 & -4 \\\\ 3 & 2\\end{pmatrix}\\begin{pmatrix}3 & 1 \\\\ -2 & 1\\end{pmatrix}\\)。乘法是行乘列，不是对应位置相乘。",
"choices": [
"\\begin{pmatrix}4 & -8 \\\\ 5 & 5\\end{pmatrix}",
"\\begin{pmatrix}-3 & -8 \\\\ 5 & 5\\end{pmatrix}",
"\\begin{pmatrix}-4 & -8 \\\\ 5 & 5\\end{pmatrix}",
"\\begin{pmatrix}-9 & -10 \\\\ 11 & 10\\end{pmatrix}"
],
"answer": 2,
"explain": "结果的第 i 行第 j 列，是左边第 i 行与右边第 j 列的对应乘积之和。",
"topic": "mul"
},
{
"stem": "设 \\(A=\\begin{pmatrix}2 & 2 \\\\ 3 & -2\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}-2 & 2 \\\\ 0 & -5\\end{pmatrix}\\)。则 AB 等于",
"choices": [
"\\begin{pmatrix}-4 & 4 \\\\ 0 & 10\\end{pmatrix}",
"\\begin{pmatrix}0 & 4 \\\\ 3 & -7\\end{pmatrix}",
"\\begin{pmatrix}2 & -8 \\\\ -15 & 10\\end{pmatrix}",
"\\begin{pmatrix}-4 & -6 \\\\ -6 & 16\\end{pmatrix}"
],
"answer": 3,
"explain": "先算行乘列。AB 与 BA 一般不相等，也不能改成对应位置相乘。",
"topic": "order"
},
{
"stem": "A 是 3 行 3 列，B 是 3 行 1 列。乘积 AB",
"choices": [
"无意义：左边列数是 3，右边行数是 3",
"有意义，结果是 1 行 3 列",
"有意义，结果是 3 行 1 列",
"有意义，结果是 3 行 3 列"
],
"answer": 2,
"explain": "先看左边的列数是否等于右边的行数。相等才可乘，结果取左边的行数和右边的列数。",
"topic": "size"
},
{
"stem": "求 \\(\\begin{pmatrix}2 & -3 \\\\ 4 & -5\\end{pmatrix}\\) 的逆矩阵。",
"choices": [
"\\begin{pmatrix}- \\frac{5}{2} & - \\frac{3}{2} \\\\ 2 & 1\\end{pmatrix}",
"\\begin{pmatrix}- \\frac{5}{2} & \\frac{3}{2} \\\\ -2 & 1\\end{pmatrix}",
"\\begin{pmatrix}-5 & 3 \\\\ -4 & 2\\end{pmatrix}",
"不可逆"
],
"answer": 1,
"explain": "先算 D=ad-bc。D 不为 0 时，主对角对调、副对角变号，再除以 D。结果应当左乘、右乘都得到单位阵。 这里 D=\\(2\\)。",
"topic": "inv"
},
{
"stem": "设 \\(A=\\begin{pmatrix}1 & -1 \\\\ 3 & -3\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}1 & 3 \\\\ 1 & 3\\end{pmatrix}\\)。则 AB",
"choices": [
"是零矩阵，但 A 和 B 都不是零矩阵",
"是零矩阵，所以 A 或 B 至少有一个是零矩阵",
"没有意义",
"不是零矩阵"
],
"answer": 0,
"explain": "AB 是零矩阵，但 A、B 都不是零矩阵。矩阵里不能由乘积为零推出其中一个因子为零，也不能随便约去。",
"topic": "zero"
},
{
"stem": "设 \\(A=\\begin{pmatrix}3 & 2 \\\\ 1 & 2\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}5 & -2 \\\\ -2 & -4\\end{pmatrix}\\)。则 (AB) 的转置等于",
"choices": [
"\\begin{pmatrix}8 & -1 \\\\ 0 & -2\\end{pmatrix}",
"\\begin{pmatrix}13 & -10 \\\\ 6 & -12\\end{pmatrix}",
"\\begin{pmatrix}11 & 1 \\\\ -14 & -10\\end{pmatrix}",
"\\begin{pmatrix}11 & -14 \\\\ 1 & -10\\end{pmatrix}"
],
"answer": 2,
"explain": "乘积的转置要把次序倒过来：(AB) 的转置等于 B 的转置乘 A 的转置，不是 A 的转置乘 B 的转置。",
"topic": "transpose"
},
{
"stem": "计算 \\(\\begin{pmatrix}3 & -1 \\\\ 3 & -4\\end{pmatrix}^2\\)",
"choices": [
"\\begin{pmatrix}6 & -2 \\\\ 6 & -8\\end{pmatrix}",
"\\begin{pmatrix}9 & 1 \\\\ 9 & 16\\end{pmatrix}",
"\\begin{pmatrix}7 & 1 \\\\ -3 & 13\\end{pmatrix}",
"\\begin{pmatrix}6 & 1 \\\\ -3 & 13\\end{pmatrix}"
],
"answer": 3,
"explain": "方阵的平方是自己乘自己，用行乘列，不是每个元素平方。",
"topic": "power"
},
{
"stem": "计算 \\(\\begin{pmatrix}- \\frac{1}{2} & \\frac{1}{2} & -5 \\\\ 2 & 5 & 5\\end{pmatrix}+\\begin{pmatrix}-5 & 0 & 1 \\\\ 2 & -2 & - \\frac{1}{2}\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}- \\frac{9}{2} & \\frac{1}{2} & -4 \\\\ 4 & 3 & \\frac{9}{2}\\end{pmatrix}",
"\\begin{pmatrix}\\frac{11}{2} & \\frac{1}{2} & -4 \\\\ 4 & 3 & \\frac{9}{2}\\end{pmatrix}",
"\\begin{pmatrix}\\frac{9}{2} & \\frac{1}{2} & -6 \\\\ 0 & 7 & \\frac{11}{2}\\end{pmatrix}",
"\\begin{pmatrix}- \\frac{11}{2} & \\frac{1}{2} & -4 \\\\ 4 & 3 & \\frac{9}{2}\\end{pmatrix}"
],
"answer": 3,
"explain": "同型矩阵相加是对应位置相加。不能把加号当成乘法。",
"topic": "add"
},
{
"stem": "计算 \\(\\frac{3}{2}\\cdot \\begin{pmatrix}-5 & -4 \\\\ 5 & - \\frac{3}{2}\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}- \\frac{15}{2} & -6 \\\\ 5 & - \\frac{3}{2}\\end{pmatrix}",
"\\begin{pmatrix}\\frac{15}{2} & 6 \\\\ - \\frac{15}{2} & \\frac{9}{4}\\end{pmatrix}",
"\\begin{pmatrix}- \\frac{15}{2} & -6 \\\\ \\frac{15}{2} & - \\frac{9}{4}\\end{pmatrix}",
"\\begin{pmatrix}- \\frac{7}{2} & - \\frac{5}{2} \\\\ \\frac{13}{2} & 0\\end{pmatrix}"
],
"answer": 2,
"explain": "数乘是每个元素都乘同一个数，不是只乘第一行，也不是把数加到每个元素上。",
"topic": "scalar"
},
{
"stem": "计算 \\(\\begin{pmatrix}1 & -2 \\\\ -5 & -5\\end{pmatrix}\\begin{pmatrix}2 & 5 \\\\ 0 & -3\\end{pmatrix}\\)。乘法是行乘列，不是对应位置相乘。",
"choices": [
"\\begin{pmatrix}-2 & 11 \\\\ -10 & -10\\end{pmatrix}",
"\\begin{pmatrix}3 & 11 \\\\ -10 & -10\\end{pmatrix}",
"\\begin{pmatrix}2 & 11 \\\\ -10 & -10\\end{pmatrix}",
"\\begin{pmatrix}-23 & -29 \\\\ 15 & 15\\end{pmatrix}"
],
"answer": 2,
"explain": "结果的第 i 行第 j 列，是左边第 i 行与右边第 j 列的对应乘积之和。",
"topic": "mul"
},
{
"stem": "设 \\(A=\\begin{pmatrix}-2 & 2 \\\\ 1 & -3\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}1 & -4 \\\\ 2 & -1\\end{pmatrix}\\)。则 AB 等于",
"choices": [
"\\begin{pmatrix}-6 & 14 \\\\ -5 & 7\\end{pmatrix}",
"\\begin{pmatrix}-1 & -2 \\\\ 3 & -4\\end{pmatrix}",
"\\begin{pmatrix}2 & 6 \\\\ -5 & -1\\end{pmatrix}",
"\\begin{pmatrix}-2 & -8 \\\\ 2 & 3\\end{pmatrix}"
],
"answer": 2,
"explain": "先算行乘列。AB 与 BA 一般不相等，也不能改成对应位置相乘。",
"topic": "order"
},
{
"stem": "A 是 2 行 3 列，B 是 2 行 1 列。乘积 AB",
"choices": [
"有意义，结果是 2 行 1 列",
"有意义，结果是 3 行 2 列",
"有意义，结果是 1 行 2 列",
"无意义：左边列数是 3，右边行数是 2"
],
"answer": 3,
"explain": "先看左边的列数是否等于右边的行数。相等才可乘，结果取左边的行数和右边的列数。",
"topic": "size"
},
{
"stem": "求 \\(\\begin{pmatrix}2 & -2 \\\\ -5 & 0\\end{pmatrix}\\) 的逆矩阵。",
"choices": [
"\\begin{pmatrix}0 & \\frac{1}{5} \\\\ \\frac{1}{2} & - \\frac{1}{5}\\end{pmatrix}",
"不可逆",
"\\begin{pmatrix}0 & - \\frac{1}{5} \\\\ - \\frac{1}{2} & - \\frac{1}{5}\\end{pmatrix}",
"\\begin{pmatrix}0 & 2 \\\\ 5 & 2\\end{pmatrix}"
],
"answer": 2,
"explain": "先算 D=ad-bc。D 不为 0 时，主对角对调、副对角变号，再除以 D。结果应当左乘、右乘都得到单位阵。 这里 D=\\(-10\\)。",
"topic": "inv"
},
{
"stem": "设 \\(A=\\begin{pmatrix}-1 & 1 \\\\ -1 & 1\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}-1 & 1 \\\\ -1 & 1\\end{pmatrix}\\)。则 AB",
"choices": [
"是零矩阵，所以 A 或 B 至少有一个是零矩阵",
"是零矩阵，但 A 和 B 都不是零矩阵",
"不是零矩阵",
"没有意义"
],
"answer": 1,
"explain": "AB 是零矩阵，但 A、B 都不是零矩阵。矩阵里不能由乘积为零推出其中一个因子为零，也不能随便约去。",
"topic": "zero"
},
{
"stem": "设 \\(A=\\begin{pmatrix}-5 & -4 \\\\ 3 & 1\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}3 & -2 \\\\ 2 & 4\\end{pmatrix}\\)。则 (AB) 的转置等于",
"choices": [
"\\begin{pmatrix}-23 & 11 \\\\ -6 & -2\\end{pmatrix}",
"\\begin{pmatrix}-2 & 5 \\\\ -6 & 5\\end{pmatrix}",
"\\begin{pmatrix}-21 & 2 \\\\ -14 & -4\\end{pmatrix}",
"\\begin{pmatrix}-23 & -6 \\\\ 11 & -2\\end{pmatrix}"
],
"answer": 0,
"explain": "乘积的转置要把次序倒过来：(AB) 的转置等于 B 的转置乘 A 的转置，不是 A 的转置乘 B 的转置。",
"topic": "transpose"
},
{
"stem": "计算 \\(\\begin{pmatrix}-3 & -1 \\\\ 5 & 5\\end{pmatrix}^2\\)",
"choices": [
"\\begin{pmatrix}5 & -2 \\\\ 10 & 20\\end{pmatrix}",
"\\begin{pmatrix}4 & -2 \\\\ 10 & 20\\end{pmatrix}",
"\\begin{pmatrix}-6 & -2 \\\\ 10 & 10\\end{pmatrix}",
"\\begin{pmatrix}9 & 1 \\\\ 25 & 25\\end{pmatrix}"
],
"answer": 1,
"explain": "方阵的平方是自己乘自己，用行乘列，不是每个元素平方。",
"topic": "power"
},
{
"stem": "计算 \\(\\begin{pmatrix}-4 & 2 & -5 \\\\ -1 & - \\frac{1}{2} & -2 \\\\ 3 & 1 & - \\frac{3}{2}\\end{pmatrix}-\\begin{pmatrix}0 & -4 & -4 \\\\ 4 & 3 & -2 \\\\ - \\frac{1}{2} & -2 & 1\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}4 & -6 & 1 \\\\ 5 & \\frac{7}{2} & 0 \\\\ - \\frac{7}{2} & -3 & \\frac{5}{2}\\end{pmatrix}",
"\\begin{pmatrix}-4 & -2 & -9 \\\\ 3 & \\frac{5}{2} & -4 \\\\ \\frac{5}{2} & -1 & - \\frac{1}{2}\\end{pmatrix}",
"\\begin{pmatrix}-3 & 6 & -1 \\\\ -5 & - \\frac{7}{2} & 0 \\\\ \\frac{7}{2} & 3 & - \\frac{5}{2}\\end{pmatrix}",
"\\begin{pmatrix}-4 & 6 & -1 \\\\ -5 & - \\frac{7}{2} & 0 \\\\ \\frac{7}{2} & 3 & - \\frac{5}{2}\\end{pmatrix}"
],
"answer": 3,
"explain": "同型矩阵才能相减，对应位置相减。减号不能换成加号，也不能交换被减数。",
"topic": "add"
},
{
"stem": "计算 \\(\\frac{1}{2}\\cdot \\begin{pmatrix}3 & 3 & -2 \\\\ \\frac{3}{2} & 5 & - \\frac{1}{2}\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}- \\frac{3}{2} & - \\frac{3}{2} & 1 \\\\ - \\frac{3}{4} & - \\frac{5}{2} & \\frac{1}{4}\\end{pmatrix}",
"\\begin{pmatrix}\\frac{7}{2} & \\frac{7}{2} & - \\frac{3}{2} \\\\ 2 & \\frac{11}{2} & 0\\end{pmatrix}",
"\\begin{pmatrix}\\frac{3}{2} & \\frac{3}{2} & -1 \\\\ \\frac{3}{2} & 5 & - \\frac{1}{2}\\end{pmatrix}",
"\\begin{pmatrix}\\frac{3}{2} & \\frac{3}{2} & -1 \\\\ \\frac{3}{4} & \\frac{5}{2} & - \\frac{1}{4}\\end{pmatrix}"
],
"answer": 3,
"explain": "数乘是每个元素都乘同一个数，不是只乘第一行，也不是把数加到每个元素上。",
"topic": "scalar"
},
{
"stem": "计算 \\(\\begin{pmatrix}-3 & 3 & 4 \\\\ -2 & -3 & 1\\end{pmatrix}\\begin{pmatrix}0 & 1 \\\\ 5 & 5 \\\\ -2 & -3\\end{pmatrix}\\)。乘法是行乘列，不是对应位置相乘。",
"choices": [
"\\begin{pmatrix}8 & 0 \\\\ -17 & -20\\end{pmatrix}",
"\\begin{pmatrix}-7 & 0 \\\\ -17 & -20\\end{pmatrix}",
"\\begin{pmatrix}7 & -17 \\\\ 0 & -20\\end{pmatrix}",
"\\begin{pmatrix}7 & 0 \\\\ -17 & -20\\end{pmatrix}"
],
"answer": 3,
"explain": "结果的第 i 行第 j 列，是左边第 i 行与右边第 j 列的对应乘积之和。",
"topic": "mul"
},
{
"stem": "设 \\(A=\\begin{pmatrix}2 & 4 \\\\ 4 & -2\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}3 & 2 \\\\ 0 & 0\\end{pmatrix}\\)。则 AB 等于",
"choices": [
"\\begin{pmatrix}6 & 8 \\\\ 0 & 0\\end{pmatrix}",
"\\begin{pmatrix}5 & 6 \\\\ 4 & -2\\end{pmatrix}",
"\\begin{pmatrix}14 & 8 \\\\ 0 & 0\\end{pmatrix}",
"\\begin{pmatrix}6 & 4 \\\\ 12 & 8\\end{pmatrix}"
],
"answer": 3,
"explain": "先算行乘列。AB 与 BA 一般不相等，也不能改成对应位置相乘。",
"topic": "order"
},
{
"stem": "A 是 3 行 3 列，B 是 3 行 3 列。乘积 AB",
"choices": [
"无意义：左边列数是 3，右边行数是 3",
"有意义，结果是 3 行 3 列",
"无意义，因为矩阵里出现了 0",
"有意义，因为两个都是数表，结果行数等于列数"
],
"answer": 1,
"explain": "先看左边的列数是否等于右边的行数。相等才可乘，结果取左边的行数和右边的列数。",
"topic": "size"
},
{
"stem": "矩阵 \\(A=\\begin{pmatrix}-5 & -4 \\\\ 10 & 8\\end{pmatrix}\\) 的逆",
"choices": [
"不可逆",
"可逆，逆等于单位阵 \\(\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}\\)",
"可逆，逆等于 \\(\\begin{pmatrix}8 & 4 \\\\ -10 & -5\\end{pmatrix}\\)",
"可逆，而且逆是单位阵"
],
"answer": 0,
"explain": "行列式 \\(D=0\\) 等于 0，所以不可逆。不能硬套对调、变号再除以 D。",
"topic": "inv"
},
{
"stem": "设 \\(A=\\begin{pmatrix}-1 & 1 \\\\ -1 & 1\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}2 & -2 \\\\ 2 & -2\\end{pmatrix}\\)。则 AB",
"choices": [
"是零矩阵，但 A 和 B 都不是零矩阵",
"没有意义",
"不是零矩阵",
"是零矩阵，所以 A 或 B 至少有一个是零矩阵"
],
"answer": 0,
"explain": "AB 是零矩阵，但 A、B 都不是零矩阵。矩阵里不能由乘积为零推出其中一个因子为零，也不能随便约去。",
"topic": "zero"
},
{
"stem": "\\(A=\\begin{pmatrix}-4 & -1 & -2 \\\\ 0 & 0 & 0\\end{pmatrix}\\) 的转置是",
"choices": [
"\\begin{pmatrix}-3 & 0 \\\\ -1 & 0 \\\\ -2 & 0\\end{pmatrix}",
"\\begin{pmatrix}4 & 1 & 2 \\\\ 0 & 0 & 0\\end{pmatrix}",
"\\begin{pmatrix}4 & 0 \\\\ -1 & 0 \\\\ -2 & 0\\end{pmatrix}",
"\\begin{pmatrix}-4 & 0 \\\\ -1 & 0 \\\\ -2 & 0\\end{pmatrix}"
],
"answer": 3,
"explain": "转置是行列互换，不是把每个元素变号。",
"topic": "transpose"
},
{
"stem": "计算 \\(\\begin{pmatrix}3 & -2 \\\\ -3 & 5\\end{pmatrix}^2\\)",
"choices": [
"\\begin{pmatrix}9 & 4 \\\\ 9 & 25\\end{pmatrix}",
"\\begin{pmatrix}16 & -16 \\\\ -24 & 31\\end{pmatrix}",
"\\begin{pmatrix}6 & -4 \\\\ -6 & 10\\end{pmatrix}",
"\\begin{pmatrix}15 & -16 \\\\ -24 & 31\\end{pmatrix}"
],
"answer": 3,
"explain": "方阵的平方是自己乘自己，用行乘列，不是每个元素平方。",
"topic": "power"
},
{
"stem": "计算 \\(\\begin{pmatrix}3 & 0 & \\frac{1}{2} \\\\ - \\frac{1}{2} & 5 & 0 \\\\ - \\frac{1}{2} & 0 & -5\\end{pmatrix}+\\begin{pmatrix}-1 & -2 & 3 \\\\ -1 & 2 & - \\frac{3}{2} \\\\ 2 & -3 & \\frac{3}{2}\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}3 & -2 & \\frac{7}{2} \\\\ - \\frac{3}{2} & 7 & - \\frac{3}{2} \\\\ \\frac{3}{2} & -3 & - \\frac{7}{2}\\end{pmatrix}",
"\\begin{pmatrix}2 & -2 & \\frac{7}{2} \\\\ - \\frac{3}{2} & 7 & - \\frac{3}{2} \\\\ \\frac{3}{2} & -3 & - \\frac{7}{2}\\end{pmatrix}",
"\\begin{pmatrix}-2 & -2 & \\frac{7}{2} \\\\ - \\frac{3}{2} & 7 & - \\frac{3}{2} \\\\ \\frac{3}{2} & -3 & - \\frac{7}{2}\\end{pmatrix}",
"\\begin{pmatrix}4 & 2 & - \\frac{5}{2} \\\\ \\frac{1}{2} & 3 & \\frac{3}{2} \\\\ - \\frac{5}{2} & 3 & - \\frac{13}{2}\\end{pmatrix}"
],
"answer": 1,
"explain": "同型矩阵相加是对应位置相加。不能把加号当成乘法。",
"topic": "add"
},
{
"stem": "计算 \\(\\frac{3}{2}\\cdot \\begin{pmatrix}0 & - \\frac{1}{2} \\\\ - \\frac{3}{2} & 0 \\\\ -5 & 1\\end{pmatrix}\\)",
"choices": [
"\\begin{pmatrix}0 & - \\frac{3}{4} \\\\ - \\frac{3}{2} & 0 \\\\ -5 & 1\\end{pmatrix}",
"\\begin{pmatrix}\\frac{3}{2} & 1 \\\\ 0 & \\frac{3}{2} \\\\ - \\frac{7}{2} & \\frac{5}{2}\\end{pmatrix}",
"\\begin{pmatrix}0 & - \\frac{3}{4} \\\\ - \\frac{9}{4} & 0 \\\\ - \\frac{15}{2} & \\frac{3}{2}\\end{pmatrix}",
"\\begin{pmatrix}0 & \\frac{3}{4} \\\\ \\frac{9}{4} & 0 \\\\ \\frac{15}{2} & - \\frac{3}{2}\\end{pmatrix}"
],
"answer": 2,
"explain": "数乘是每个元素都乘同一个数，不是只乘第一行，也不是把数加到每个元素上。",
"topic": "scalar"
},
{
"stem": "计算 \\(\\begin{pmatrix}-4 & 5 \\\\ 0 & 4\\end{pmatrix}\\begin{pmatrix}4 & 4 \\\\ 0 & 0\\end{pmatrix}\\)。乘法是行乘列，不是对应位置相乘。",
"choices": [
"\\begin{pmatrix}16 & -16 \\\\ 0 & 0\\end{pmatrix}",
"\\begin{pmatrix}-15 & -16 \\\\ 0 & 0\\end{pmatrix}",
"\\begin{pmatrix}-16 & -16 \\\\ 0 & 0\\end{pmatrix}",
"\\begin{pmatrix}-16 & 36 \\\\ 0 & 0\\end{pmatrix}"
],
"answer": 2,
"explain": "结果的第 i 行第 j 列，是左边第 i 行与右边第 j 列的对应乘积之和。",
"topic": "mul"
},
{
"stem": "设 \\(A=\\begin{pmatrix}-5 & 2 \\\\ 1 & -4\\end{pmatrix}\\)，\\(B=\\begin{pmatrix}-5 & 3 \\\\ -3 & 4\\end{pmatrix}\\)。则 AB 等于",
"choices": [
"\\begin{pmatrix}25 & 6 \\\\ -3 & -16\\end{pmatrix}",
"\\begin{pmatrix}28 & -22 \\\\ 19 & -22\\end{pmatrix}",
"\\begin{pmatrix}-10 & 5 \\\\ -2 & 0\\end{pmatrix}",
"\\begin{pmatrix}19 & -7 \\\\ 7 & -13\\end{pmatrix}"
],
"answer": 3,
"explain": "先算行乘列。AB 与 BA 一般不相等，也不能改成对应位置相乘。",
"topic": "order"
}
];
