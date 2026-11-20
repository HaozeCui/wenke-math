"""2.2 矩阵及其运算。按「概念 → 加减数乘 → 乘法 → 秩 → 逆与方程 → 回顾」组织，收齐教材例 2.2.1–2.2.16。"""
from chrome import (
    cover, objectives, bullets, two_col, cards3, definition, prompt, answer,
    lab, culture, summary, homework, derive, mistake, section, route, quiz,
)
from panels import P

FILENAME, TITLE, H1 = "22.html", "2.2 矩阵及其运算 · 文科高等数学", "2.2 矩阵及其运算"
LABS = ["22-matmul.js"]

LINXF = """
            <div class="ctrl">
              <label><span>a</span><span class="ctrl-val" id="lin-a-val">1</span></label>
              <input id="lin-a" type="range" min="-2" max="2" step="0.1" value="1" />
              <label style="margin-top:8px"><span>b</span><span class="ctrl-val" id="lin-b-val">0</span></label>
              <input id="lin-b" type="range" min="-2" max="2" step="0.1" value="0" />
              <label style="margin-top:8px"><span>c</span><span class="ctrl-val" id="lin-c-val">0</span></label>
              <input id="lin-c" type="range" min="-2" max="2" step="0.1" value="0" />
              <label style="margin-top:8px"><span>d</span><span class="ctrl-val" id="lin-d-val">1</span></label>
              <input id="lin-d" type="range" min="-2" max="2" step="0.1" value="1" />
            </div>
            <div class="readout" id="lin-read"></div>
            <div class="verdict" id="lin-verdict">单位正方形被矩阵变成平行四边形；det=0 时扁成一条线。</div>
    """


def slides():
    return [
        cover("2.2　建议 7 学时", "一行对一列，<br />得到一个数",
              "矩阵是数表，也是线性变换。乘法规定为行×列的点乘。一般 AB≠BA。",
              "配套《文科数学基础》　·　对位高亮 · 不可交换 · 求逆",
              notes="先概念与加减，再乘法几何，最后秩与逆。"),
        objectives([
            "能按「行×列」计算矩阵乘法，并先检查尺寸是否匹配。",
            "能举 AB≠BA 与零因子的例子，说明乘法不可随便换序、也不能随意约去。",
            "能用初等行变换把矩阵化成阶梯形并读出秩；会用伴随公式或行变换求 2×2、3×3 的逆，并解 AX=B。",
        ]),
        route(notes="路线由下面六个分节自动生成。"),

        # —— 一、概念 ——
        section("一", "概念：去掉标签的数表", "成绩表、方程组系数，剥掉表头就是矩阵。"),
        definition("矩阵",
                   r"<p>$m\times n$ 矩阵：m 行 n 列的数表，记 $\mathbf A=(a_{ij})_{m\times n}$。</p>"
                   r"<p>$m=n$ 叫方阵；$m=1$ 是行向量，$n=1$ 是列向量。</p>",
                   extra="本课元素取实数。两个矩阵相等：同型且对应位置元素全相等。"),
        two_col("例 2.2.1　成绩表",
                ("期中 A", [
                    r"$$\begin{pmatrix}81&75&90&73\\ 78&84&88&69\\ 91&82&85&78\end{pmatrix}$$",
                    "行：数、外、计；列：甲乙丙丁。",
                ]),
                ("期末 B", [
                    r"$$\begin{pmatrix}84&80&93&74\\ 81&77&85&70\\ 65&91&82&73\end{pmatrix}$$",
                    "去掉姓名科目，剩下两张同型数表。",
                ]),
                code="例题",
                lead_t="矩阵不记得「这是谁的分」，只记得位置上的数。"),
        derive("例 2.2.2　方程组写成矩阵", [
            (r"\begin{cases}a_{11}x_1+\cdots+a_{1n}x_n=b_1\\ \vdots\\ a_{m1}x_1+\cdots+a_{mn}x_n=b_m\end{cases}", "m 个方程，n 个未知数"),
            (r"A=(a_{ij})_{m\times n}", "系数矩阵：未知数前面的数"),
            (r"\bar A=[A|b]", "增广矩阵：再并上一列常数"),
        ], code="例题"),
        derive("例 2.2.3　相等与零矩阵", [
            (r"\begin{pmatrix}1&0\\0&1\end{pmatrix}\neq\begin{pmatrix}1&0\\1&1\end{pmatrix}", "同型但有一个位置不同"),
            (r"O_{3\times 2}\neq O_{2\times 2}", "全是 0 也要同型才谈得上相等"),
            (r"O_{m\times n}", "零矩阵：每个元素都是 0"),
        ], extra=r"转置 $A^{\mathrm T}$：行列互换；$(A^{\mathrm T})^{\mathrm T}=A$。",
           code="例题"),

        # —— 二、加减与数乘 ——
        section("二", "加减与数乘：同型才能对位", "对应位置相加；每个元素乘同一个数。"),
        definition("加法与数乘",
                   r"<p>同型矩阵 $A,B$：$(A+B)_{ij}=a_{ij}+b_{ij}$，$(kA)_{ij}=ka_{ij}$。</p>"
                   r"<p>性质：$A+B=B+A$，$(A+B)+C=A+(B+C)$，$A+O=A$，$(A+B)^{\mathrm T}=A^{\mathrm T}+B^{\mathrm T}$。</p>",
                   extra=r"$-A=(-1)A$，于是 $A-B=A+(-B)$。"),
        derive("成绩相加（接例 2.2.1）", [
            (r"A+B=\begin{pmatrix}165&155&183&147\\ 159&161&173&139\\ 156&173&167&151\end{pmatrix}", "对应位置相加：甲的数学 81+84=165"),
        ], code="例题",
           extra="两场考试分数「叠」在一张表上，就是矩阵加法。"),
        derive("例 2.2.4　解 A+3X=B", [
            (r"A=\begin{pmatrix}3&-2&2&0\\1&3&0&8\\2&4&6&9\end{pmatrix},\ B=\begin{pmatrix}7&4&-3&3\\3&1&0&7\\5&2&3&9\end{pmatrix}", "同型 3×4"),
            (r"X=\tfrac13(B-A)", "移项再数乘"),
            (r"X=\begin{pmatrix}\tfrac43&2&-\tfrac53&1\\ \tfrac23&-\tfrac23&0&-\tfrac13\\ 1&-\tfrac23&-1&0\end{pmatrix}", "每个位置各自算"),
        ], code="例题"),
        prompt("课堂练 1",
               r"$A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$，$B=\begin{pmatrix}0&1\\1&0\end{pmatrix}$。" "\n"
               r"计算 $2A-B$ 与 $A+B$。两者同型吗？",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 1", [
            r"$2A=\begin{pmatrix}2&4\\0&2\end{pmatrix}$，$2A-B=\begin{pmatrix}2&3\\-1&2\end{pmatrix}$。",
            r"$A+B=\begin{pmatrix}1&3\\1&1\end{pmatrix}$。",
            "都是 2×2，同型。",
        ]),

        # —— 三、乘法 ——
        section("三", "乘法：左行对右列", "先看尺寸，再点乘；一般不能换序。"),
        derive("例 2.2.5　买文具", [
            (r"(0.3,\ 0.2,\ 0.8)\begin{pmatrix}12\\15\\1\end{pmatrix}", "单价行 × 数量列"),
            (r"0.3\cdot12+0.2\cdot15+0.8\cdot1=7.4", "一次点乘得到总价"),
        ], code="例题",
           extra="左的列数 = 右的行数，才能乘。"),
        definition("矩阵乘法",
                   r"<p>$A$ 为 $m\times n$，$B$ 为 $n\times p$，则 $C=AB$ 为 $m\times p$，</p>"
                   r"<p>$$c_{ik}=\sum_{j=1}^{n}a_{ij}b_{jk}$$</p>"
                   r"<p>（$A$ 的第 $i$ 行点乘 $B$ 的第 $k$ 列。）</p>",
                   extra=r"定理 2.2.1：方阵有 $|AB|=|A||B|$。方程组可写成 $AX=B$。"),
        lab("一行对一列，点乘得到一个数", "matmul", "mm-canvas", P["matmul"],
            notes="拖行、列。读出 (AB)_ij 的两项。",
            code="实验 1"),
        derive("例 2.2.6　行×列 vs 列×行", [
            (r"A=(a_1,\ldots,a_n),\ B=\begin{pmatrix}b_1\\ \vdots\\ b_n\end{pmatrix}", "一行与一列"),
            (r"AB=a_1b_1+\cdots+a_nb_n", "结果是 1×1（一个数）"),
            (r"BA=(b_ia_j)_{n\times n}", "结果是 n 阶方阵"),
        ], code="例题",
           extra="连尺寸都不同，更谈不上 AB=BA。"),
        derive("例 2.2.7　2×3 乘 3×4", [
            (r"A=\begin{pmatrix}1&3&-2\\4&-1&5\end{pmatrix},\ B=\begin{pmatrix}2&-3&4&1\\-1&2&2&0\\4&5&1&1\end{pmatrix}", "左列=右行=3"),
            (r"AB=\begin{pmatrix}-9&-7&8&-1\\29&11&19&9\end{pmatrix}", "结果 2×4"),
            (r"BA\text{ 无定义}", "4≠2，右列≠左行"),
        ], code="例题"),
        derive("例 2.2.8　非零矩阵，乘积可以是 O", [
            (r"A=\begin{pmatrix}-2&4\\1&-2\end{pmatrix},\ B=\begin{pmatrix}-16&-32\\8&16\end{pmatrix}", "两个都不是零矩阵"),
            (r"AB=\begin{pmatrix}64&128\\-32&-64\end{pmatrix}", "AB 也不是 O"),
            (r"BA=O", "零因子：不能从 AB=O 推出 A=O 或 B=O"),
        ], code="例题"),
        lab("交换次序，结果可以完全不同", "abba", "abba-canvas", P["abba"],
            notes="A=[[0,1],[0,0]]，B=[[0,0],[1,0]]。先看 AB 再看 BA。",
            code="实验 2"),
        prompt("课堂练 2",
               r"$A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$，$B=\begin{pmatrix}0&0\\1&0\end{pmatrix}$。" "\n"
               r"计算 AB 与 BA。说明什么？",
               "约 3 分钟。",
               level="辨析"),
        answer("课堂练 2", [
            r"$AB=\begin{pmatrix}1&0\\0&0\end{pmatrix}$，$BA=\begin{pmatrix}0&0\\0&1\end{pmatrix}$。",
            r"$AB\neq BA$。",
            "矩阵乘法不可交换——与数的乘法最大的差别。",
        ], comment="两个都不是零矩阵，乘积却可以「很多零」。"),
        mistake("找错 1　当成逐项相乘",
                r"$A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$，$B=\begin{pmatrix}0&1\\1&0\end{pmatrix}$。有人算 $AB=\begin{pmatrix}0&2\\3&0\end{pmatrix}$。",
                [r"把对应位置直接相乘。", r"得到 $\begin{pmatrix}0&2\\3&0\end{pmatrix}$。"],
                "错在哪里？正确的 AB 是什么？",
                "约 2 分钟。"),
        answer("找错 1", [
            "矩阵乘法不是逐项相乘。",
            r"第一行×第一列：$1\cdot0+2\cdot1=2$；第一行×第二列：$1\cdot1+2\cdot0=1$。",
            r"$AB=\begin{pmatrix}2&1\\4&3\end{pmatrix}$。",
        ]),
        cards3("乘法性质（不能换序）", [
            ("结合", r"$(AB)C=A(BC)$。"),
            ("分配", r"$(A+B)C=AC+BC$，左乘同理。"),
            ("转置", r"$(AB)^{\mathrm T}=B^{\mathrm T}A^{\mathrm T}$（次序反过来）。"),
        ]),
        definition("单位矩阵",
                   r"<p>$I_n$：主对角全 1，其余 0。对 $m\times n$ 的 $A$，有 $I_mA=AI_n=A$。</p>"
                   r"<p>左乘、右乘都要说清楚：乘在哪一侧。</p>"),
        lab("2×2 怎样扭动单位正方形", "linxf", "lin-canvas", LINXF,
            notes="先 a=d=1、b=c=0 看单位方；再拖 b 做切变；再让 det=0 看压扁。",
            code="实验 3"),

        # —— 四、初等变换与秩 ——
        section("四", "阶梯形与秩", "三种行变换化阶梯；非零行数就是秩。"),
        definition("初等行变换",
                   r"<p>(1) 换行 $R_i\leftrightarrow R_j$；(2) 倍乘 $R_i\cdot c$（$c\neq0$）；(3) 倍加 $R_i+R_j\cdot c$。</p>"
                   r"<p>对列做同样三件事叫初等列变换。解方程组时通常只做行变换。</p>"),
        definition("阶梯形与秩",
                   r"<p>每行第一个非零元（首元）必须在上一行首元的右下方。</p>"
                   r"<p>定理 2.2.2：任一矩阵经有限次行变换可化成阶梯形。非零行数记作 $r(A)$，与化法无关。</p>"),
        derive("例 2.2.9　哪一个是阶梯形？", [
            (r"(1)(2)(4)\text{ 是阶梯形}", "首元逐步右移"),
            (r"(3)\text{ 不是}", "第 5 行首元落在第 4 行首元正下方，没有更右"),
        ], code="例题",
           notes="四个矩阵按教材图口述即可，不必抄满屏。"),
        derive("例 2.2.10　化阶梯求秩（摘要）", [
            (r"A=\begin{pmatrix}0&3&2&-1&5\\1&-1&0&0&3\\2&7&3&0&6\\0&-2&5&1&0\end{pmatrix}", "先换行让首元到左上"),
            (r"R_1\leftrightarrow R_2,\ \text{再倍加消去}", "逐步消成阶梯"),
            (r"r(A)=4", "阶梯形有 4 个非零行"),
        ], code="例题"),
        derive("例 2.2.11　秩可以小于行数", [
            (r"A=\begin{pmatrix}1&2&3&4\\1&-2&4&5\\1&10&1&2\end{pmatrix}", "3×4"),
            (r"\xrightarrow{R_2-R_1,\ R_3-R_1}\begin{pmatrix}1&2&3&4\\0&-4&1&1\\0&8&-2&-2\end{pmatrix}", "前两列已有阶梯雏形"),
            (r"R_3+2R_2\Rightarrow\begin{pmatrix}1&2&3&4\\0&-4&1&1\\0&0&0&0\end{pmatrix}", "第三行消成 0"),
            (r"r(A)=2", "两个非零行"),
        ], code="例题"),
        prompt("课堂练 3",
               r"矩阵 $\begin{pmatrix}1&2&3\\2&4&6\\1&1&1\end{pmatrix}$ 的秩是多少？可逆吗？",
               "约 2 分钟。",
               level="变式"),
        answer("课堂练 3", [
            "第二行是第一行的 2 倍，消掉后变 0。",
            "第三行减第一行得 $(0,-1,-2)$，再消，非零行剩 2 行，秩是 2。",
            "3 阶方阵秩小于 3，不可逆。",
        ]),

        # —— 五、逆与方程 ——
        section("五", "逆矩阵与可逆方程", "存在 B 使 AB=BA=I；用行变换把 [A|I] 化成 [I|A⁻¹]。"),
        definition("逆矩阵",
                   r"<p>方阵 $A$ 可逆：存在 $B$ 使 $AB=BA=I$，记 $B=A^{-1}$。</p>"
                   r"<p>定理 2.2.3：$A$ 可逆 $\Leftrightarrow$ $|A|\neq0$ $\Leftrightarrow$ $r(A)=n$（满秩）。</p>",
                   extra=r"$2\times2$：$D=ad-bc\neq0$ 时 $A^{-1}=\dfrac1D\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$。"),
        derive("例 2.2.12　验证逆", [
            (r"A=\begin{pmatrix}2&-1\\-5&3\end{pmatrix},\ B_1=\begin{pmatrix}3&1\\5&2\end{pmatrix}", "猜一个候选"),
            (r"AB_1=B_1A=I", "两边都乘成单位阵"),
            (r"A^{-1}=B_1", "逆唯一"),
        ], code="例题"),
        derive("例 2.2.13　先看法是否可逆", [
            (r"A=\begin{pmatrix}0&1&2\\1&1&4\\2&-1&0\end{pmatrix}", "三阶"),
            (r"|A|=2\neq0", "可逆（满秩）"),
        ], code="例题"),
        derive("例 2.2.14　行变换求逆（摘要）", [
            (r"(A|I_3)\xrightarrow{\text{行变换}}(I_3|A^{-1})", "左边变 I，右边就是逆"),
            (r"A^{-1}=\begin{pmatrix}2&-1&1\\4&-2&1\\-\tfrac32&1&-\tfrac12\end{pmatrix}", "与例 2.2.13 的 A 配套"),
        ], code="例题",
           extra=r"性质：$(A^{-1})^{-1}=A$，$(AB)^{-1}=B^{-1}A^{-1}$，$(A^{\mathrm T})^{-1}=(A^{-1})^{\mathrm T}$，$(kA)^{-1}=\frac1k A^{-1}$（$k\neq0$）。"),
        prompt("课堂练 4",
               r"$A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$。求 $A^{-1}$，并验证 $AA^{-1}=I$。",
               "约 3 分钟。",
               level="基础"),
        answer("课堂练 4", [
            r"$D=1$。对调主对角仍是 1,1；副对角 2 变号为 −2。",
            r"$A^{-1}=\begin{pmatrix}1&-2\\0&1\end{pmatrix}$。",
            r"相乘得 $I$。",
        ]),
        derive("例 2.2.15　解 AX=B", [
            (r"A=\begin{pmatrix}1&0&1\\3&1&0\\1&0&0\end{pmatrix},\ B=\begin{pmatrix}-1&4&2\\0&3&1\\2&-5&1\end{pmatrix}", "构造 (A|B)"),
            (r"(A|B)\xrightarrow{\text{行变换}}(I|X)", "左边变 I"),
            (r"X=A^{-1}B=\begin{pmatrix}2&-5&1\\-6&18&-2\\-3&9&1\end{pmatrix}", "右块就是解"),
        ], code="例题"),
        derive("例 2.2.16　解 XA=B", [
            (r"X\begin{pmatrix}1&1&-1\\-2&1&1\\1&1&1\end{pmatrix}=\begin{pmatrix}1&-1&1\\0&3&1\end{pmatrix}", "未知在左边：用列变换，或先转置"),
            (r"X=BA^{-1}=\begin{pmatrix}-1&-\tfrac23&\tfrac23\\1&1&1\end{pmatrix}", "sympy 验算"),
        ], code="例题",
           extra=r"也可对 $A^{\mathrm T}X^{\mathrm T}=B^{\mathrm T}$ 做行变换，再转置回来。"),
        prompt("课堂练 5",
               r"若 A 可逆且 AX=B，X 写成什么？若 XA=B 呢？",
               "约 2 分钟。",
               level="应用"),
        answer("课堂练 5", [
            r"$AX=B$ ⇒ 左乘 $A^{-1}$，得 $X=A^{-1}B$。",
            r"$XA=B$ ⇒ 右乘 $A^{-1}$，得 $X=BA^{-1}$。",
            "乘在哪一侧必须看未知矩阵在哪一侧。",
        ]),
        mistake("找错 2　方程两侧乱乘",
                r"已知 AX=B，A 可逆。有人写成 $X=BA^{-1}$。",
                [r"模仿数的除法「搬到另一边」。", r"得到 $X=BA^{-1}$。"],
                "错在哪里？",
                "约 2 分钟。"),
        answer("找错 2", [
            r"$AX=B$ 只能两边左乘 $A^{-1}$，得 $X=A^{-1}B$。",
            r"$BA^{-1}$ 是 XA=B 的解，不是本题。",
            "矩阵乘法有次序，不能当成分数随便挪。",
        ]),

        # —— 六、回顾 ——
        section("六", "回顾与自测"),
        cards3("尺寸口诀", [
            ("加法", "必须同型。"),
            ("乘法", "左列 = 右行。结果取「左行、右列」。"),
            ("逆", "必须方阵且 det≠0（满秩）。"),
        ]),
        culture("矩阵把「一张表」变成可以复合的操作。十九世纪它为解方程组服务，二十世纪它为数据、图像与网络服务。",
                "最硬的一句话仍是：乘法有次序。下一讲方程组、再下一讲 PageRank，都在用这张表去「作用」到向量上。",
                title="文化卡片 · 表与变换"),
        summary(
            ["乘法：行×列；先看尺寸。", "AB 一般不等于 BA；可能有零因子。", "秩 = 阶梯形非零行数；可逆 ⇔ |A|≠0 ⇔ 满秩。"],
            ["把矩阵当表格逐项相乘。", "解 AX=B 却写成 BA⁻¹。", "忘记先看尺寸再相乘。"],
        ),
        quiz("22", notes="题目来自本讲题库，每轮随机抽 6 题。课后让学生用手机打开本页自测。"),
        homework(
            [r"计算教材习题 2.2.1 的 AB 与 BA。",
             r"用公式求 $\begin{pmatrix}1&2\\3&4\end{pmatrix}^{-1}$ 并验证。",
             r"把例 2.2.11 的矩阵化成阶梯形，核对秩为 2。",
             r"默写：$(AB)^{-1}=B^{-1}A^{-1}$。"],
            [r"* 说明为何 AB=O 推不出 A=O 或 B=O（用例 2.2.8）。",
             r"* 用行变换求例 2.2.14 的逆，并与公式结果对照。"],
            "下一讲 2.3：三平面位置、通解含参、投入产出。",
        ),
    ]
