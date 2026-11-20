"""2.1 行列式。按「定义 → 计算 → 性质 → 克拉默 → 回顾」组织，收齐教材例 2.1.1–2.1.5。"""
from chrome import (
    cover, objectives, bullets, two_col, cards3, definition, prompt, answer,
    lab, culture, summary, homework, derive, mistake, section, route, quiz,
)
from panels import P

FILENAME, TITLE, H1 = "21.html", "2.1 行列式 · 文科高等数学", "2.1 行列式"
LABS = ["21-sarrus.js"]

DET_AREA = """
            <div class="ctrl">
              <button type="button" class="btn ghost" data-area="std">单位方</button>
              <button type="button" class="btn ghost" data-area="swap">交换 u、v</button>
              <button type="button" class="btn ghost" data-area="shear">切变</button>
              <button type="button" class="btn ghost" data-area="line">共线</button>
            </div>
            <div class="readout" id="det-area-read"></div>
            <div class="verdict" id="det-area-verdict"></div>
    """

SARRUS = """
            <div class="ctrl">
              <button type="button" class="btn ghost on" data-sar="ex">例 2.1.1 的 D</button>
              <button type="button" class="btn ghost" data-sar="tri">上三角</button>
              <label style="margin-top:10px"><span>沙流项</span><span class="ctrl-val" id="sarrus-k-val">1 / 6</span></label>
              <input id="sarrus-k" type="range" min="0" max="5" step="1" value="0" />
            </div>
            <div class="readout" id="sarrus-read"></div>
            <div class="verdict" id="sarrus-verdict">实线三条取正号，虚线三条取负号。</div>
    """


def slides():
    return [
        cover("2.1　建议 3 学时", "数表折叠成<br />一个数",
              "行列式把方阵变成一个数：有向面积或体积，也是「有没有唯一解」的开关。",
              "配套《文科数学基础》　·　二阶面积 · 沙流 · 克拉默",
              notes="先 2 阶几何，再 3 阶沙流，最后克拉默。"),
        objectives([
            "能计算二阶、三阶行列式，并认出上三角「对角线连乘」。",
            "能用性质（换行变号、倍加不变、成比例则 0）化简计算，会对四阶按行/列展开。",
            "能用克拉默法则解二元、三元方程组（作为行列式的应用，不是唯一算法）。",
        ]),
        route(notes="路线由下面六个分节自动生成。"),

        section("一", "问题：把方程组的解写成数表", "消元之后，分子分母都长得像「交叉相乘」。"),
        two_col("从消元到记号",
                ("二元方程组", [
                    r"$a_{11}x_1+a_{12}x_2=b_1$",
                    r"$a_{21}x_1+a_{22}x_2=b_2$",
                    r"消元后分母都是 $a_{11}a_{22}-a_{12}a_{21}$。",
                ]),
                ("二阶行列式", [
                    r"$$\begin{vmatrix}a_{11}&a_{12}\\ a_{21}&a_{22}\end{vmatrix}=a_{11}a_{22}-a_{12}a_{21}$$",
                    "把这个公共的分母单独记下来。",
                    "分子是用常数列替换对应列。",
                ]),
                lead_t="行列式先是解方程组时反复出现的那一串数，后来才被看成面积。"),

        section("二", "二阶：有向面积", "ad−bc 是两列向量张成的平行四边形的有向面积。"),
        definition("二阶行列式",
                   r"<p>$$\begin{vmatrix}a&b\\ c&d\end{vmatrix}=ad-bc$$</p>"
                   r"<p>几何：以 $u=(a,c)$、$v=(b,d)$ 为邻边的平行四边形有向面积。为 0 表示两向量共线。</p>",
                   extra="后面线性方程组：$D=0$ 往往意味着没有唯一解。"),
        lab("拖动两个向量，看面积怎样变", "det-area", "det-area-canvas", DET_AREA,
            notes="先拖成单位方（D=1），再交换看符号翻转，再点「共线」看 D=0。",
            code="实验 1"),
        prompt("课堂练 1",
               r"计算 $\begin{vmatrix}1&2\\3&4\end{vmatrix}$。" "\n"
               r"若第二列改成第一列的 2 倍，结果是什么？说明几何意义。",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 1", [
            r"$1\cdot 4-2\cdot 3=-2$。",
            r"第二列若为 $(2,6)^{\mathrm T}$，则 $1\cdot 6-2\cdot 3=0$。",
            "两列成比例，平行四边形扁成一条线，面积为 0。",
        ]),
        prompt("课堂练 2　地块面积",
               r"地图上三点 $A(0,0)$、$B(4,1)$、$C(1,3)$（单位：百米）。" "\n"
               r"(1) 用二阶行列式求 $\triangle ABC$ 的面积。" "\n"
               r"(2) 若把 $C$ 挪到 $C'(8,2)$，面积变成多少？",
               "约 3 分钟。",
               level="应用", fig="21-tri"),
        answer("课堂练 2", [
            r"$\overrightarrow{AB}=(4,1)$，$\overrightarrow{AC}=(1,3)$。"
            r"$\begin{vmatrix}4&1\\1&3\end{vmatrix}=12-1=11$，三角形是平行四边形的一半，面积 $\dfrac{11}{2}$。",
            r"(2) $\overrightarrow{AC'}=(8,2)=2\cdot(4,1)$，与 $AB$ 共线，行列式为 0，面积为 0：三点共线。",
        ], comment="面积取绝对值；符号只表示定向。"),

        section("三", "三阶沙流与高阶展开", "三阶用六项；四阶先找零，再按行或列展开。"),
        definition("三阶沙流（萨吕斯）",
                   r"<p>把前两列抄到右边。主对角及两条「右下」斜线取正；反对角及两条「左下」斜线取负。三正三负共六项。</p>"
                   r"<p>只对三阶合法。四阶禁止沙流。</p>",
                   extra="也可以按第一行展开成三个二阶行列式，结果相同。"),
        lab("六项逐个着色", "sarrus", "sarrus-canvas", SARRUS,
            notes="先用「例 2.1.1 的 D」拖到第 6 项得 11；再切到上三角，只剩 24。",
            code="实验 2"),
        derive("例 2.1.1　三元克拉默（上）", [
            (r"\begin{cases}x_1+2x_2+x_3=2\\ -2x_1+x_2-x_3=1\\ x_1-4x_2+2x_3=3\end{cases}", "教材方程组"),
            (r"D=\begin{vmatrix}1&2&1\\ -2&1&-1\\ 1&-4&2\end{vmatrix}=11\neq 0", "系数行列式：沙流或展开"),
            (r"D_1=\begin{vmatrix}2&2&1\\ 1&1&-1\\ 3&-4&2\end{vmatrix}=-21", "用常数列替换第 1 列"),
            (r"D_2=\begin{vmatrix}1&2&1\\ -2&1&-1\\ 1&3&2\end{vmatrix}=4", "替换第 2 列"),
        ], extra=r"$D_3=\begin{vmatrix}1&2&2\\ -2&1&1\\ 1&-4&3\end{vmatrix}=35$。下一页写出解。",
           code="例题",
           notes="教材把 x₁ 印成 21/11，漏了负号；按 D₁/D 应为 −21/11。"),
        derive("例 2.1.1　三元克拉默（下）", [
            (r"x_1=\frac{D_1}{D}=-\frac{21}{11},\quad x_2=\frac{4}{11},\quad x_3=\frac{35}{11}", "克拉默法则"),
            (r"\text{代回第一式：}-\frac{21}{11}+2\cdot\frac{4}{11}+\frac{35}{11}=\frac{22}{11}=2", "验算"),
        ], extra="教材正文把 $x_1$ 写成了 $21/11$，漏掉负号。以 $D_1/D$ 为准。",
           code="例题"),
        definition("代数余子式与按行展开",
                   r"<p>划去 $a_{ij}$ 所在的行和列，剩下的行列式是余子式 $M_{ij}$。"
                   r"代数余子式 $A_{ij}=(-1)^{i+j}M_{ij}$。</p>"
                   r"<p>按第 $i$ 行：$\det A=\sum_j a_{ij}A_{ij}$。按列同理。</p>",
                   extra="零多的那一行（列）最适合展开。符号由位置决定，与元素本身是多少无关。"),
        derive("例 2.1.2　四阶：沿零多的列展开", [
            (r"D=\begin{vmatrix}0&-1&-1&2\\ 1&-1&0&2\\ -1&2&-1&0\\ 2&1&1&0\end{vmatrix}", "第 4 列有两个 0"),
            (r"=2A_{14}+2A_{24}", r"$A_{14}=(-1)^{1+4}M_{14}$，$A_{24}=(-1)^{2+4}M_{24}$"),
            (r"=2(-1)\cdot 4+2\cdot 6=4", "两个三阶分别算得 4 与 6"),
        ], extra="选零多的行或列，是高阶计算的第一原则。",
           code="例题"),
        derive("例 2.1.3　四阶：先消元再展开", [
            (r"\begin{vmatrix}-2&2&-4&0\\ 4&-1&3&5\\ 3&1&-2&-3\\ 2&0&5&1\end{vmatrix}", "第 2 列已有一个 0"),
            (r"\xrightarrow{\text{倍加}}\begin{vmatrix}-8&0&0&6\\ 7&0&1&2\\ 3&1&-2&-3\\ 2&0&5&1\end{vmatrix}", "把第 2 列再消成只剩一个非零"),
            (r"=(-1)^{3+2}\begin{vmatrix}-8&0&6\\ 7&1&2\\ 2&5&1\end{vmatrix}", "按第 2 列展开"),
            (r"=-270", "继续消元、展开；课堂认路，不必重算每一步"),
        ], extra="沙流只到三阶。四阶靠性质和展开。",
           code="例题"),
        derive("例 2.1.4　上三角：只看对角线", [
            (r"\begin{vmatrix}a_{11}&a_{12}&a_{13}&a_{14}\\ 0&a_{22}&a_{23}&a_{24}\\ 0&0&a_{33}&a_{34}\\ 0&0&0&a_{44}\end{vmatrix}", "上三角"),
            (r"=a_{11}a_{22}a_{33}a_{44}", "反复按第一列展开，每步只剩对角元"),
        ], extra="下三角同样。行与列互换行列式不变，所以上三角换成下三角，值仍是对角连乘。",
           code="例题"),
        prompt("课堂练 3",
               r"计算 $\begin{vmatrix}1&2&3\\ 0&4&5\\ 0&0&6\end{vmatrix}$，并说明为什么可以「看一眼」。",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 3", [
            "上三角：行列式等于主对角连乘 $1\cdot 4\cdot 6=24$。",
            "沙流里其余五项都含 0。",
            "化成上三角是高阶计算的常规目标。",
        ], comment="会看三角阵，比会背六项更要紧。"),

        section("四", "性质：化简的许可证", "换行变号，倍加不变，成比例则 0。"),
        cards3("性质（口算级）", [
            ("换两行", "行列式变号。换两列同样。两行相同或成比例 ⇒ det = 0。"),
            ("倍加", "一行加上另一行的倍数，行列式不变。这是消元的许可证。"),
            ("提公因子", "某行乘 $k$，行列式乘 $k$。整行全 0 ⇒ det = 0。"),
        ]),
        two_col("行列式为 0 在说什么",
                ("几何", ["面积或体积扁掉。", "列向量线性相关。"]),
                ("方程组", ["系数矩阵不可逆。", "可能无解或无穷解，下一讲再说。"])),
        derive("例 2.1.5　含参数：先消元再因式分解", [
            (r"\begin{vmatrix}a+1&2&2\\ -2&a+4&-5\\ 2&-2&a+1\end{vmatrix}=0", "求 $a$"),
            (r"\xrightarrow{r_1+r_2}\begin{vmatrix}a+3&0&a+3\\ -2&a+4&-5\\ 2&-2&a+1\end{vmatrix}", "第 1 行加第 2 行"),
            (r"\xrightarrow{c_3-c_1}\begin{vmatrix}a+3&0&0\\ -2&a+4&-3\\ 2&-2&a-1\end{vmatrix}", "第 3 列减第 1 列"),
            (r"=(a+3)\bigl[(a+4)(a-1)-6\bigr]=(a+3)(a+5)(a-2)", "按第 1 行展开"),
            (r"a=-3,\ -5,\ 2", "令乘积为 0"),
        ], extra="含参数时不要直接展开成三次式硬算；先用倍加制造零。",
           code="例题"),
        prompt("课堂练 4　性质",
               r"不计算具体数字：说明为何 $\begin{vmatrix}1&2&3\\1&2&3\\4&5&6\end{vmatrix}=0$，"
               r"以及把第一、二行互换后行列式与原来差一个符号。",
               "约 2 分钟。",
               level="辨析"),
        answer("课堂练 4", [
            "前两行相同（成比例系数为 1），行列式为 0。",
            "换两行变号：0 的相反数仍是 0。",
            "成比例比「算六项」更快。",
        ]),
        prompt("课堂练 5",
               r"已知 $\begin{vmatrix}a&b\\c&d\end{vmatrix}=5$。求 $\begin{vmatrix}a&b\\2c&2d\end{vmatrix}$ 与 $\begin{vmatrix}c&d\\a&b\end{vmatrix}$。",
               "约 2 分钟。",
               level="变式"),
        answer("课堂练 5", [
            "第二行 ×2，结果 10。",
            "换两行，结果 −5。",
            "不必知道 a,b,c,d 是什么。",
        ]),
        mistake("找错 1　四阶还在用沙流",
                r"计算 $\begin{vmatrix}1&0&0&1\\ 0&1&0&0\\ 0&0&1&0\\ 1&0&0&1\end{vmatrix}$。",
                [r"把前两列抄到右边，按三阶沙流的办法画斜线。",
                 r"得到一长串乘积，合计为 2。"],
                "哪一步的想法错了？正确结果是多少？",
                "约 2 分钟。"),
        answer("找错 1", [
            "第 1 步错。沙流只对三阶合法，四阶没有「抄两列再画六条斜线」这一套。",
            r"正确：第 2 列只有一个 1，按第 2 列展开得 "
            r"$(-1)^{2+2}\begin{vmatrix}1&0&1\\ 0&1&0\\ 1&0&1\end{vmatrix}$。",
            r"里面这个三阶两行成比例（第 1、3 行相同），为 0。所以原式 $=0$。",
        ], comment="四阶：找零、倍加、展开。"),

        section("五", "克拉默法则", "D≠0 时，解是「替换列」的行列式之比。"),
        definition("克拉默法则（二元）",
                   r"<p>$a_{11}x_1+a_{12}x_2=b_1$，$a_{21}x_1+a_{22}x_2=b_2$。"
                   r"令 $D=\begin{vmatrix}a_{11}&a_{12}\\ a_{21}&a_{22}\end{vmatrix}$，"
                   r"$D_1$、$D_2$ 分别用常数列替换第 1、2 列。</p>"
                   r"<p>若 $D\neq 0$，则 $x_1=D_1/D$，$x_2=D_2/D$。</p>",
                   extra="三元同理。这是行列式的应用展示，不是解方程组的首选算法。"),
        prompt("课堂练 6",
               r"用克拉默法则解 $x+y=3$，$x-y=1$。写出 $D$、$D_1$、$D_2$。",
               "约 3 分钟。",
               level="基础"),
        answer("课堂练 6", [
            r"$D=\begin{vmatrix}1&1\\1&-1\end{vmatrix}=-2$。",
            r"$D_1=\begin{vmatrix}3&1\\1&-1\end{vmatrix}=-4$，$D_2=\begin{vmatrix}1&3\\1&1\end{vmatrix}=-2$。",
            r"$x=(-4)/(-2)=2$，$y=(-2)/(-2)=1$。代回：2+1=3，2−1=1。",
        ]),
        cards3("和 2.2、2.3 的接头", [
            ("可逆", r"方阵可逆 $\Leftrightarrow$ det≠0。下一讲公式会用到 $D$。"),
            ("方程组", r"$D\neq 0$ 则克拉默给出唯一解。$D=0$ 交给下一讲的平面位置。"),
            ("不要", "把所有问题都用克拉默硬算三阶。"),
        ]),

        section("六", "回顾与自测"),
        culture("行列式最初出现在解线性方程组的消元里，后来才被看成体积缩放。",
                "莱布尼茨就写过用行列式判别方程组。对文科学生：记住它是「方阵→一个数」的折叠，0 与非 0 往往比具体数值更要紧。",
                title="文化卡片 · 折叠成一个数"),
        summary(
            ["二阶 ad−bc 是有向面积；三阶沙流；三角阵看对角。",
             "换行变号，倍加不变，成比例则 0；四阶靠展开。",
             "克拉默：$D\neq 0$ 时解是替换列的行列式之比。"],
            ["四阶仍用沙流。",
             "把 det=0 说成「方程组无解」（也可能无穷解）。",
             "克拉默算完不代回验算。"],
        ),
        quiz("21", notes="课后让学生用手机打开本页自测。"),
        homework(
            [r"计算 $\begin{vmatrix}1&0&1\\ 2&1&0\\ -3&2&-5\end{vmatrix}$ 与一个上三角三阶。",
             r"用性质说明两行相同则行列式为 0。",
             r"说明四阶为什么先找零，再展开，而不是用沙流。",
             r"用克拉默解 $2x+y=5$，$x-y=1$。"],
            [r"* 解释为何换行变号与「有向面积」一致。",
             r"* 求 $a$ 使 $\begin{vmatrix}a&1\\ 2&a\end{vmatrix}=0$。"],
            "下一讲 2.2：矩阵运算，行×列，AB≠BA。",
        ),
    ]
