window.QUIZ = window.QUIZ || {};
window.QUIZ["24"] = [
{
"stem": "计算 \\(\\begin{pmatrix}-2 \\\\ -1\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}2 \\\\ 2\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"0",
"-6",
"1",
"- \\frac{3 \\sqrt{10}}{10}"
],
"answer": 3,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(- \\frac{3 \\sqrt{10}}{10}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「绿南风又春风」的词袋向量是",
"choices": [
"\\begin{pmatrix}2 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 2 \\\\ 1\\end{pmatrix}"
],
"answer": 1,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}1 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & 0 & 1 \\\\ \\frac{1}{2} & \\frac{1}{2} & 0 \\\\ 0 & \\frac{1}{2} & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 1 页的权重是",
"choices": [
"1",
"\\frac{1}{3}",
"\\frac{1}{2}",
"0"
],
"answer": 2,
"explain": "走一步就是用 P 左乘权重。第 1 个分量是 \\(\\frac{1}{2}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}0 \\\\ -1\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}1 \\\\ -2\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"\\frac{2 \\sqrt{5}}{5}",
"1",
"0",
"2"
],
"answer": 0,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{2 \\sqrt{5}}{5}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「绿风又南风」的词袋向量是",
"choices": [
"\\begin{pmatrix}1 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 2 \\\\ 0\\end{pmatrix}",
"\\begin{pmatrix}0 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}"
],
"answer": 2,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}0 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}0 & 0 & \\frac{1}{2} \\\\ \\frac{1}{2} & 1 & \\frac{1}{2} \\\\ \\frac{1}{2} & 0 & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 3 页的权重是",
"choices": [
"0",
"\\frac{1}{3}",
"1",
"\\frac{1}{6}"
],
"answer": 3,
"explain": "走一步就是用 P 左乘权重。第 3 个分量是 \\(\\frac{1}{6}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}1 \\\\ 0\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}2 \\\\ 0\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"2",
"0",
"1",
"-1"
],
"answer": 2,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(1\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表春、风、又、绿、江、南。句子「南风江绿江又春」里，「春」这一维的计数是",
"choices": [
"0",
"2",
"7",
"1"
],
"answer": 3,
"explain": "只数这个字出现几次，不看它旁边是谁。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}0 & \\frac{1}{2} & 0 \\\\ 0 & \\frac{1}{2} & 0 \\\\ 1 & 0 & 1\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 2 页的权重是",
"choices": [
"\\frac{1}{6}",
"1",
"\\frac{1}{3}",
"\\frac{2}{3}"
],
"answer": 0,
"explain": "走一步就是用 P 左乘权重。第 2 个分量是 \\(\\frac{1}{6}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}1 \\\\ 2\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}2 \\\\ 0\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"1",
"\\frac{\\sqrt{5}}{5}",
"2",
"0"
],
"answer": 1,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{\\sqrt{5}}{5}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「南风风又绿春南」的词袋向量是",
"choices": [
"\\begin{pmatrix}2 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 2 \\\\ 1\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}2 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 2\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 2\\end{pmatrix}"
],
"answer": 3,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}1 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 2\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & \\frac{1}{2} & \\frac{1}{2} \\\\ \\frac{1}{2} & 0 & \\frac{1}{2} \\\\ 0 & \\frac{1}{2} & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 1 页的权重是",
"choices": [
"\\frac{1}{2}",
"0",
"\\frac{1}{3}",
"1"
],
"answer": 0,
"explain": "走一步就是用 P 左乘权重。第 1 个分量是 \\(\\frac{1}{2}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}1 \\\\ 1 \\\\ 1\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}1 \\\\ 0 \\\\ 0\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"0",
"\\frac{\\sqrt{3}}{3} + 1",
"\\frac{\\sqrt{3}}{3}",
"1"
],
"answer": 2,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{\\sqrt{3}}{3}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「风春江春风南绿」的词袋向量是",
"choices": [
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 2 \\\\ 2\\end{pmatrix}",
"\\begin{pmatrix}2 \\\\ 2 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 1\\end{pmatrix}",
"\\begin{pmatrix}3 \\\\ 2 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 1\\end{pmatrix}"
],
"answer": 2,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}2 \\\\ 2 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 1\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & 0 & 1 \\\\ \\frac{1}{2} & 1 & 0 \\\\ 0 & 0 & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 1 页的权重是",
"choices": [
"1",
"\\frac{1}{2}",
"0",
"\\frac{1}{3}"
],
"answer": 1,
"explain": "走一步就是用 P 左乘权重。第 1 个分量是 \\(\\frac{1}{2}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}2 \\\\ 2\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}2 \\\\ 0\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"\\frac{\\sqrt{2}}{2}",
"4",
"1",
"0"
],
"answer": 0,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{\\sqrt{2}}{2}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表春、风、又、绿、江、南。句子「春南绿风又风」里，「又」这一维的计数是",
"choices": [
"1",
"6",
"2",
"0"
],
"answer": 0,
"explain": "只数这个字出现几次，不看它旁边是谁。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}0 & \\frac{1}{2} & 1 \\\\ 1 & \\frac{1}{2} & 0 \\\\ 0 & 0 & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 2 页的权重是",
"choices": [
"1",
"\\frac{1}{2}",
"0",
"\\frac{1}{3}"
],
"answer": 1,
"explain": "走一步就是用 P 左乘权重。第 2 个分量是 \\(\\frac{1}{2}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}2 \\\\ 1\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}0 \\\\ 2\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"\\frac{\\sqrt{5}}{5}",
"2",
"0",
"1"
],
"answer": 0,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{\\sqrt{5}}{5}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「又春春又」的词袋向量是",
"choices": [
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}0 \\\\ 0 \\\\ 0 \\\\ 2 \\\\ 0 \\\\ 2\\end{pmatrix}",
"\\begin{pmatrix}2 \\\\ 0 \\\\ 2 \\\\ 0 \\\\ 0 \\\\ 0\\end{pmatrix}",
"\\begin{pmatrix}3 \\\\ 0 \\\\ 2 \\\\ 0 \\\\ 0 \\\\ 0\\end{pmatrix}"
],
"answer": 2,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}2 \\\\ 0 \\\\ 2 \\\\ 0 \\\\ 0 \\\\ 0\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}0 & \\frac{1}{2} & 0 \\\\ 0 & 0 & 1 \\\\ 1 & \\frac{1}{2} & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 2 页的权重是",
"choices": [
"0",
"\\frac{1}{2}",
"1",
"\\frac{1}{3}"
],
"answer": 3,
"explain": "走一步就是用 P 左乘权重。第 2 个分量是 \\(\\frac{1}{3}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}-2 \\\\ 2\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}-1 \\\\ 1\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"0",
"1",
"4",
"2"
],
"answer": 1,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(1\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表春、风、又、绿、江、南。句子「南南又春」里，「春」这一维的计数是",
"choices": [
"0",
"2",
"1",
"4"
],
"answer": 2,
"explain": "只数这个字出现几次，不看它旁边是谁。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & 0 & \\frac{1}{2} \\\\ \\frac{1}{2} & \\frac{1}{2} & \\frac{1}{2} \\\\ 0 & \\frac{1}{2} & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 1 页的权重是",
"choices": [
"\\frac{1}{2}",
"0",
"\\frac{1}{3}",
"1"
],
"answer": 2,
"explain": "走一步就是用 P 左乘权重。第 1 个分量是 \\(\\frac{1}{3}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}6 \\\\ 8\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}8 \\\\ 6\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"\\frac{24}{25}",
"1",
"96",
"0"
],
"answer": 0,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{24}{25}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「风又又南」的词袋向量是",
"choices": [
"\\begin{pmatrix}0 \\\\ 1 \\\\ 2 \\\\ 0 \\\\ 0 \\\\ 1\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 0 \\\\ 0 \\\\ 2 \\\\ 1 \\\\ 0\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 1 \\\\ 2 \\\\ 0 \\\\ 0 \\\\ 1\\end{pmatrix}"
],
"answer": 0,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}0 \\\\ 1 \\\\ 2 \\\\ 0 \\\\ 0 \\\\ 1\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & 0 & 0 \\\\ 0 & \\frac{1}{2} & 1 \\\\ \\frac{1}{2} & \\frac{1}{2} & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 2 页的权重是",
"choices": [
"\\frac{1}{2}",
"\\frac{1}{3}",
"1",
"0"
],
"answer": 0,
"explain": "走一步就是用 P 左乘权重。第 2 个分量是 \\(\\frac{1}{2}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}1 \\\\ 0 \\\\ 0\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}1 \\\\ 1 \\\\ 0\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"1",
"\\frac{\\sqrt{2}}{2}",
"\\frac{\\sqrt{2}}{2} + 1",
"0"
],
"answer": 1,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{\\sqrt{2}}{2}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「绿江又风风又」的词袋向量是",
"choices": [
"\\begin{pmatrix}0 \\\\ 1 \\\\ 1 \\\\ 2 \\\\ 2 \\\\ 0\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 2 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0\\end{pmatrix}",
"\\begin{pmatrix}0 \\\\ 2 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0\\end{pmatrix}"
],
"answer": 3,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}0 \\\\ 2 \\\\ 2 \\\\ 1 \\\\ 1 \\\\ 0\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 1 & 0 & 1\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 3 页的权重是",
"choices": [
"\\frac{1}{3}",
"1",
"\\frac{2}{3}",
"0"
],
"answer": 2,
"explain": "走一步就是用 P 左乘权重。第 3 个分量是 \\(\\frac{2}{3}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}1 \\\\ -1\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}0 \\\\ 2\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"-2",
"1",
"- \\frac{\\sqrt{2}}{2}",
"0"
],
"answer": 2,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(- \\frac{\\sqrt{2}}{2}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表春、风、又、绿、江、南。句子「风南南南春」里，「春」这一维的计数是",
"choices": [
"2",
"0",
"1",
"5"
],
"answer": 2,
"explain": "只数这个字出现几次，不看它旁边是谁。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & 0 & \\frac{1}{2} \\\\ \\frac{1}{2} & \\frac{1}{2} & \\frac{1}{2} \\\\ 0 & \\frac{1}{2} & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 2 页的权重是",
"choices": [
"1",
"\\frac{1}{6}",
"\\frac{1}{2}",
"\\frac{1}{3}"
],
"answer": 2,
"explain": "走一步就是用 P 左乘权重。第 2 个分量是 \\(\\frac{1}{2}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}3 \\\\ 4\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}8 \\\\ 6\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"0",
"48",
"1",
"\\frac{24}{25}"
],
"answer": 3,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{24}{25}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表按顺序为春、风、又、绿、江、南。句子「绿南南又春南」的词袋向量是",
"choices": [
"\\begin{pmatrix}2 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 3\\end{pmatrix}",
"\\begin{pmatrix}1 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 3\\end{pmatrix}",
"\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}",
"\\begin{pmatrix}3 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1\\end{pmatrix}"
],
"answer": 1,
"explain": "词袋只计次数，不计顺序。这一句的计数是 \\(\\begin{pmatrix}1 \\\\ 0 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 3\\end{pmatrix}\\)。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & 0 & 1 \\\\ 0 & \\frac{1}{2} & 0 \\\\ \\frac{1}{2} & \\frac{1}{2} & 0\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 1 页的权重是",
"choices": [
"\\frac{1}{2}",
"\\frac{1}{3}",
"1",
"\\frac{1}{6}"
],
"answer": 0,
"explain": "走一步就是用 P 左乘权重。第 1 个分量是 \\(\\frac{1}{2}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}-2 \\\\ 2\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}0 \\\\ 4\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"0",
"1",
"\\frac{\\sqrt{2}}{2}",
"8"
],
"answer": 2,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{\\sqrt{2}}{2}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
},
{
"stem": "词表春、风、又、绿、江、南。句子「春绿又春风南风」里，「南」这一维的计数是",
"choices": [
"0",
"2",
"7",
"1"
],
"answer": 3,
"explain": "只数这个字出现几次，不看它旁边是谁。",
"topic": "bow"
},
{
"stem": "转移矩阵（列是出发页）\\(P=\\begin{pmatrix}\\frac{1}{2} & \\frac{1}{2} & \\frac{1}{2} \\\\ \\frac{1}{2} & \\frac{1}{2} & 0 \\\\ 0 & 0 & \\frac{1}{2}\\end{pmatrix}\\)，当前权重 \\(\\begin{pmatrix}\\frac{1}{3} \\\\ \\frac{1}{3} \\\\ \\frac{1}{3}\\end{pmatrix}\\)。走一步后，第 2 页的权重是",
"choices": [
"0",
"1",
"\\frac{1}{3}",
"\\frac{1}{6}"
],
"answer": 2,
"explain": "走一步就是用 P 左乘权重。第 2 个分量是 \\(\\frac{1}{3}\\)。这里不解特征多项式。",
"topic": "pr"
},
{
"stem": "计算 \\(\\begin{pmatrix}1 \\\\ 2 \\\\ 2\\end{pmatrix}\\) 与 \\(\\begin{pmatrix}2 \\\\ 1 \\\\ 2\\end{pmatrix}\\) 的余弦相似度",
"choices": [
"1",
"8",
"0",
"\\frac{8}{9}"
],
"answer": 3,
"explain": "余弦是点积除以两个长度，不只看点积。这里是 \\(\\frac{8}{9}\\)。同方向时为 1，垂直时为 0。",
"topic": "cos"
}
];
