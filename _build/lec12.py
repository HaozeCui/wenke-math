"""1.2 极限。按「数列 → 函数趋势 → 性质计算 → 连续 → 重要极限 → 无穷小应用 → 回顾」七节组织。"""
from chrome import (
    cover, objectives, bullets, two_col, cards3, definition, prompt, answer,
    lab, culture, summary, homework, derive, mistake, section, route, quiz,
    formula_page, table_page, page, h2,
)
from panels import P

FILENAME, TITLE, H1 = "12.html", "1.2 极限 · 文科高等数学", "1.2 极限"
LABS = ["12-limit.js", "extra.js"]


def slides():
    return [
        cover("1.2　建议 8 学时", "看趋势，<br />不看某一项等于谁",
              "数列与函数的极限、四则运算、连续性、两个重要极限、无穷小与等价替换。不写 ε 语言。",
              "配套《文科数学基础》　·　等比 · 左右极限 · 重要极限 · 等价无穷小",
              notes="开场：无限接近不是某一项等于极限。"),
        objectives([
            "能判断等比数列、等比级数何时收敛，并在 $|q|\\lt 1$ 时写出和。",
            "能按 $x\\to a$、$x\\to a^\\pm$、$x\\to\\pm\\infty$ 读函数极限，并判断左右是否一致、一点是否连续。",
            "能用四则、约分、有理化、两个重要极限和等价无穷小计算简单极限。",
            "能识别指数型极限中「先收底」的错误，并用连续复利、贴现读出同一个 $e$。",
        ]),
        route(notes="路线由下面七个分节自动生成。"),

        # ─── 一 ───
        section("一", "数列极限", "日取其半、等比数列与等比级数：无限过程可以有确定趋势。"),
        definition("例 1.2.1　一尺之捶，日取其半",
                   r"<p>每天截下剩余的一半：第 $n$ 天截下 $1/2^n$。</p>"
                   r"<p>$$\frac12,\ \frac14,\ \frac18,\ \frac1{16},\ \ldots,\ \frac1{2^n},\ \ldots$$</p>"
                   r"<p>通项无限靠近 $0$，但永远不等于 $0$。这就是「万世不竭」。</p>",
                   extra="有限的截取过程，趋势可以是一个确定的数。后面把每天截下的量加起来，总和恰好是 1 尺。",
                   notes="教材例 1.2.1。"),
        cards3("例 1.2.2　割圆", [
            ("刘徽", r"圆内接正 $n$ 边形。$n$ 无限增大时，周长无限靠近圆周 $\pi d$。"),
            ("算出来的数", r"刘徽得到 $\pi=3.1416$。祖冲之用同一方法算到 $3.1415929$。"),
            ("同一件事", "边数永远有限，趋势可以写成圆周。极限是「无限过程的确定趋势」。"),
        ], notes="教材例 1.2.2。"),
        definition("数列极限（直观）",
                   r"<p>数列是按次序排好的一列数。若 $n$ 充分大时，$x_n$ 可以任意靠近常数 $A$，就说数列收敛：</p>"
                   r"<p>$$\lim_{n\to\infty}x_n=A$$</p>"
                   r"<p>否则称发散。没有任何一项必须等于 $A$。本讲不写 $\varepsilon$–$N$。</p>"),
        lab("项数变多，点贴住 0", "sequence", "seq-canvas", P["sequence"],
            notes="先停在 n=12，问会不会有某项等于 0。再拉大。",
            code="实验 1"),
        derive("例 1.2.3　振荡着靠近", [
            (r"\lim_{n\to\infty}\frac{n+(-1)^n}{n}=1+\lim_{n\to\infty}\frac{(-1)^n}{n}", r"拆成 $1+(-1)^n/n$"),
            (r"=1+0=1", r"$(-1)^n/n$ 被 $1/n$ 压向 0"),
        ], extra="振荡再凶，只要振幅被压没，整体仍收敛。",
           code="例题", notes="教材例 1.2.3。"),
        derive("例 1.2.4　等比数列", [
            (r"\lim_{n\to\infty}a_0 q^n=\begin{cases}0,&|q|\lt 1\\ a_0,&q=1\\ \text{不存在},&|q|\gt 1\text{ 或 }q=-1\end{cases}", r"$a_0\neq 0$"),
        ], extra=r"例 1.2.1 是 $a_0=1/2$、$q=1/2$。$q=-1$ 在 $\pm a_0$ 之间摆。",
           code="例题", notes="教材例 1.2.4。"),
        derive("例 1.2.5　等比级数", [
            (r"s_n=\frac{a_0(1-q^n)}{1-q}\quad(q\neq 1)", "部分和"),
            (r"|q|\lt 1\ \Longrightarrow\ \sum_{n=0}^{\infty}a_0 q^n=\frac{a_0}{1-q}", r"$q^n\to 0$"),
            (r"\sum_{n=1}^{\infty}\frac1{2^n}=1", "每天截下的量加起来正好是整根 1 尺"),
        ], extra=r"$|q|\ge 1$ 时级数发散。",
           code="例题", notes="教材例 1.2.5。"),
        prompt("课堂练 1",
               r"$(1)$ $q=1/3$、$a_0=1$：通项 $q^n$ 的极限？级数 $\sum_{n=0}^{\infty}(1/3)^n$ 的和？" "\n"
               r"$(2)$ $1,-1,1,-1,\ldots$ 的极限是否存在？",
               "约 3 分钟。",
               level="基础"),
        answer("课堂练 1", [
            r"$|q|=1/3\lt 1$，通项趋向 $0$。和为 $1/(1-1/3)=3/2$。",
            r"这是 $q=-1$。在 $1$ 与 $-1$ 之间摆动，极限不存在，级数也发散。",
        ], comment="先看 $|q|$ 与 $1$ 的大小。"),

        # ─── 二 ───
        section("二", "函数极限", "六种趋势，以及左右必须一致。"),
        definition("函数极限（直观）",
                   r"<p>自变量按趋势 $x\to\square$ 变化时，若 $f(x)$ 无限靠近常数 $A$，就写 $\lim_{x\to\square}f(x)=A$。</p>"
                   r"<p>$x$ 能不能等于那个点，不必计较。求极限要连同 $x\to\square$ 一起看。</p>",
                   extra=r"六种趋势：$x\to a$；$x\to a^\pm$；$x\to\pm\infty$；$x\to\infty$。"),
        table_page("例 1.2.6–例 1.2.9　先看趋势",
                   ["例", "趋势", "结论"],
                   [
                       [r"例 1.2.6　$x\sin x$", r"$x\to 0$", r"趋向 $0$"],
                       [r"例 1.2.7　$\sin x/x$", r"$x\to+\infty$", r"趋向 $0$（振荡被压住）"],
                       [r"例 1.2.8　$2^x$", r"$x\to-\infty$", r"趋向 $0$"],
                       [r"例 1.2.9　$1/x$", r"$x\to\infty$", r"两侧都趋向 $0$"],
                   ],
                   lead_t=r"同一个 $1/x$：走向无穷时趋向 $0$，走向 $0$ 时却会炸掉。",
                   notes="教材例 1.2.6–1.2.9。"),
        derive("例 1.2.10　取整的左右不一样", [
            (r"\lim_{x\to 3^+}[x]=3,\qquad \lim_{x\to 3^-}[x]=2", "左右高度差 1"),
            (r"\lim_{x\to 3}[x]\ \text{不存在}", "左右不同"),
        ], code="例题", notes="教材例 1.2.10。"),
        lab("从左边来，从右边来", "leftright", "lr-canvas", P["leftright"],
            notes="先停在左边，再拖过 0。",
            code="实验 2"),
        prompt("课堂练 2",
               r"设 $f(x)=\begin{cases}x+1,&x\lt 0\\ x-1,&x\ge 0\end{cases}$。求 $x\to 0$ 的左右极限。极限存在吗？$f(0)$？",
               "约 3 分钟。",
               level="基础"),
        answer("课堂练 2", [
            r"左极限 $1$，右极限 $-1$。左右不同，极限不存在。",
            r"$f(0)=-1$。有定义改变不了左右打架。",
        ]),
        cards3("例 1.2.11–例 1.2.13　极限不看那一点", [
            (r"例 1.2.11", r"$f(x)=2x$，$x\in(0,2)$，$\lim_{x\to 1}f(x)=2$。"),
            (r"例 1.2.12", r"挖掉 $x=1$，极限仍是 $2$。"),
            (r"例 1.2.13", r"规定 $h(1)=1$，极限仍是 $2$。"),
        ], lead_t="三个函数不一样，极限一样。极限与该点有没有定义、函数值是多少无关。",
           notes="教材例 1.2.11–1.2.13。"),
        prompt("课堂练 3",
               r"求 $\lim_{x\to 1}(x^2-1)/(x-1)$ 时约去 $(x-1)$。这改变了 $x=1$ 处的定义，为什么仍可求极限？",
               "约 2 分钟。",
               level="辨析"),
        answer("课堂练 3", [
            r"极限只关心 $x$ 靠近 $1$、但不等于 $1$ 时的趋势。",
            r"约去后得 $x+1$，极限是 $2$。连续才要求函数值等于极限。",
        ]),
        definition("夹逼",
                   r"<p>若 $g(x)\le f(x)\le h(x)$，且 $g$、$h$ 都以 $A$ 为极限，则 $f$ 也以 $A$ 为极限。</p>"
                   r"<p>$|x\sin(1/x)|\le |x|$。两边进 $0$，中间振荡再凶也只能进 $0$。</p>"),
        lab("缩放窗口，看振荡被夹住", "squeeze", "sq-canvas", P["squeeze"],
            notes="先宽窗口看抖，再拉近。金色是 ±x。",
            code="实验 3"),

        # ─── 三 ───
        section("三", "性质与计算", "代入、约分、通分、有理化：先认出不定式类型。"),
        bullets("极限的性质（摘要）", [
            r"同一趋势下极限存在时可：常数提出；和差积拆开；商拆开（分母极限 $\neq 0$）。",
            r"$\lim_{x\to a}f(x)=A$ 当且仅当左右极限都等于 $A$。",
            r"多项式、分母极限不为 $0$ 的有理式：往往直接代入。出现 $0/0$ 先约。",
            r"$\lim_{x\to\infty}1/x^n=0$；同次多项式相除看最高次系数之比。",
        ]),
        derive("例 1.2.14、例 1.2.15　直接代入", [
            (r"\lim_{x\to 1}(x^2+2x-3)=1+2-3=0", "例 1.2.14"),
            (r"\lim_{x\to 1}(x^2+x-2)=1+1-2=0", "例 1.2.15"),
            (r"\lim_{x\to 1}\frac{x+2}{x-3}=-\frac32", r"分母极限 $-2\neq 0$，也可代入"),
        ], code="例题", notes="教材例 1.2.14、1.2.15。第三式为课堂补充。"),
        derive("例 1.2.17　0/0，先约公因子", [
            (r"\lim_{x\to 1}\frac{x^2+2x-3}{x^2+x-2}", r"代入得 $0/0$"),
            (r"=\lim_{x\to 1}\frac{(x-1)(x+3)}{(x-1)(x+2)}=\lim_{x\to 1}\frac{x+3}{x+2}=\frac43", r"约去 $x-1$"),
        ], code="例题", notes="教材例 1.2.17。"),
        derive("例 1.2.18　∞−∞，先通分", [
            (r"\lim_{x\to 1}\Bigl(\frac{1}{1-x}-\frac{3}{1-x^3}\Bigr)", r"$1-x^3=(1-x)(1+x+x^2)$"),
            (r"=\lim_{x\to 1}\frac{-(x+2)}{1+x+x^2}=-1", r"约去 $1-x$ 后代入"),
        ], code="例题", notes="教材例 1.2.18。"),
        derive("例 1.2.19　0/0，有理化", [
            (r"\lim_{x\to 4}\frac{\sqrt{x}-2}{x^2-5x+4}", r"分母 $(x-4)(x-1)$"),
            (r"=\lim_{x\to 4}\frac{x-4}{(x-4)(x-1)(\sqrt{x}+2)}=\frac{1}{12}", r"分子乘 $\sqrt{x}+2$ 后约去"),
        ], code="例题", notes="教材例 1.2.19。"),
        prompt("课堂练 4",
               r"求 $(1)\ \lim_{x\to 2}\dfrac{x^2-4}{x-2}$；$(2)\ \lim_{x\to 0}\dfrac{\sqrt{x+4}-2}{x}$。",
               "约 4 分钟。",
               level="变式"),
        answer("课堂练 4", [
            r"$(1)$ 约去得 $x+2$，极限 $4$。",
            r"$(2)$ 有理化得 $1/(\sqrt{x+4}+2)\to 1/4$。",
        ]),
        mistake("找错 1　约分却改了极限趋势",
                r"求 $\displaystyle\lim_{x\to 1}\frac{x^2-1}{x-1}$。",
                [r"约去 $x-1$ 得 $x+1$。",
                 r"约分改变了定义域，所以原极限不存在。"],
                "哪一步错了？正确答案是多少？",
                "约 2 分钟。"),
        answer("找错 1", [
            r"第 2 步错。约分改变的是 $x=1$ 处有没有定义，极限本来就不看那一点。",
            r"正确：$\lim_{x\to 1}(x+1)=2$。",
        ]),

        # ─── 四 ───
        section("四", "连续与间断", "有定义、有极限、二者相等——缺一件就是间断。"),
        definition("连续",
                   r"<p>$(1)$ $\lim_{x\to a}f(x)=f(a)$：在 $a$ 连续。</p>"
                   r"<p>$(2)$ 右极限等于 $f(a)$：右连续。$(3)$ 左极限等于 $f(a)$：左连续。</p>"
                   r"<p>开区间内每一点都连续，就是该开区间上的连续函数。闭区间还要求端点单侧连续。</p>",
                   extra="三件事：有定义、极限存在、极限等于函数值。"),
        derive("例 1.2.16　初等函数可直接代入", [
            (r"\lim_{x\to 2}\log_{10}\sin\frac{\pi}{x}=\log_{10}\sin\frac{\pi}{2}=\log_{10}1=0", r"$x=2$ 在定义域内"),
        ], extra="初等函数在其定义域内连续。",
           code="例题", notes="教材例 1.2.16。"),
        page(
            h2("三种间断")
            + """
<div class="grid-3" style="flex:1;min-height:0">
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>可去</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="gap-rem"></canvas></div>
    <p>左右极限相同。空心是极限，实心是函数值。</p>
  </div>
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>跳跃</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="gap-jump"></canvas></div>
    <p>左极限 −1，右极限 1。补一点也接不上。</p>
  </div>
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>无穷</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="gap-inf"></canvas></div>
    <p>靠近 0 时，1/x 无限变大。</p>
  </div>
</div>""",
            title="三种间断",
            hook="gaps",
        ),
        prompt("课堂练 5",
               r"判断 $f(x)=|x|/x$（$x\neq 0$），$f(0)=0$ 在 $0$ 是否连续。" "\n"
               r"再设 $g(x)=\begin{cases}(x^2-1)/(x-1),&x\neq 1\\ 3,&x=1\end{cases}$：极限？连续？如何改 $g(1)$？",
               "约 3 分钟。",
               level="变式"),
        answer("课堂练 5", [
            r"$|x|/x$：左右极限 $1$ 与 $-1$，不连续（跳跃）。",
            r"$g$：极限 $2$，$g(1)=3\neq 2$，可去间断；改成 $g(1)=2$ 即连续。",
        ]),

        # ─── 五 ───
        section("五", "两个重要极限", r"$\sin x/x$ 贴住 1；$(1+1/t)^t$ 贴住 e。指数不能先收进底。"),
        page(
            h2("两个重要极限")
            + r"""
<div class="grid-2" style="flex:1;min-height:0">
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>$\lim_{x\to 0}\dfrac{\sin x}{x}=1$</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="lim-sinc"></canvas></div>
    <p>在 0 没有定义，曲线仍贴住 1。用弧度。</p>
  </div>
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>$\lim_{t\to\infty}\left(1+\dfrac{1}{t}\right)^t=e$</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="lim-exp"></canvas></div>
    <p>底靠近 1、指数走向无穷，贴住的是 e，不是 1。</p>
  </div>
</div>""",
            title="两个重要极限",
            hook="limits2",
        ),
        derive("例 1.2.20、例 1.2.21　正弦型", [
            (r"\lim_{x\to 0}\frac{\tan x}{x}=\lim_{x\to 0}\frac{\sin x}{x}\cdot\frac{1}{\cos x}=1", "例 1.2.20"),
            (r"\lim_{x\to 0}\frac{\arcsin x}{x}=1,\quad \lim_{x\to 0}\frac{\arctan x}{x}=1", r"例 1.2.21：令 $t=\arcsin x$"),
            (r"\lim_{x\to 0}\frac{1-\cos x}{x^2}=\frac12", r"$1-\cos x=2\sin^2(x/2)$"),
        ], code="例题", notes="教材例 1.2.20、1.2.21。"),
        prompt("课堂练 6",
               r"求 $(1)\ \lim_{x\to 0}\sin x/(2x)$；$(2)\ \lim_{x\to 0}\sin 2x/x$；$(3)\ \lim_{x\to 0}\sin(ax)/\sin(bx)$（$b\neq 0$）。",
               "约 4 分钟。把方块凑进分母。",
               level="变式"),
        answer("课堂练 6", [
            r"$(1)$ $\frac12$。$(2)$ $2$。$(3)$ $a/b$。",
            r"写法：$\dfrac{\sin(ax)}{ax}\cdot\dfrac{bx}{\sin(bx)}\cdot\dfrac{a}{b}$。",
        ]),
        definition("人口与连续复利（通向 e）",
                   r"<p>年增长率 $r$，一年分成 $n$ 期：$A_0(1+r/n)^n$。令 $x=r/n$，回到重要极限 2，一年后贴住 $A_0 e^{r}$，$k$ 年后 $A_0 e^{kr}$。</p>"),
        derive("例 1.2.22、例 1.2.23　连续复利与指数型", [
            (r"\lim_{n\to\infty}A_0\Bigl(1+\frac{r}{n}\Bigr)^n=A_0 e^r", r"例 1.2.22：令 $x=r/n$"),
            (r"\lim_{n\to\infty}\Bigl(1-\frac{3}{n}\Bigr)^{n+5}=\lim\Bigl(1-\frac{3}{n}\Bigr)^n\cdot\Bigl(1-\frac{3}{n}\Bigr)^5=e^{-3}", r"例 1.2.23：$1^\infty$，不能先收底"),
        ], code="例题", notes="教材例 1.2.22、1.2.23。"),
        mistake("找错 2　指数型极限先收底",
                r"计算 $\displaystyle\lim_{n\to\infty}\Bigl(1-\frac{3}{n}\Bigr)^{n+5}$。",
                [r"底 $1-3/n\to 1$，所以原式 $=1^{n+5}=1$。"],
                "哪一步错了？正确答案是多少？",
                "约 2 分钟。"),
        answer("找错 2", [
            r"不能先收底：$1^\infty$ 型。正确见例 1.2.23，答案 $e^{-3}$。",
        ], comment="教材例 1.2.23 的注正是这一错法。"),
        derive("例 1.2.24、例 1.2.25　对数与指数", [
            (r"\lim_{x\to 0}\frac{\ln(1+x)}{x}=\lim_{x\to 0}\ln(1+x)^{1/x}=\ln e=1", "例 1.2.24"),
            (r"\lim_{x\to 0}\frac{e^x-1}{x}=1", r"例 1.2.25：令 $t=e^x-1$"),
        ], code="例题", notes="教材例 1.2.24、1.2.25。"),
        prompt("课堂练 7",
               r"求 $\lim_{x\to 0}(1+2x)^{1/x}$，并说明为什么不能先把底收成 $1$。",
               "约 3 分钟。",
               level="应用"),
        answer("课堂练 7", [
            r"写成 $\bigl[(1+2x)^{1/(2x)}\bigr]^2\to e^2$。",
            r"先收底会得到 $1$，把指数里的变化丢掉了。",
        ]),
        # ─── 六 ───
        section("六", "无穷小、等价与应用", "等价替换只用于乘除；减法里替换会丢主项。"),
        two_col("无穷小与无穷大",
                ("无穷小", [r"某个过程中极限是 $0$。", r"$x\to\infty$ 时 $1/x$ 是无穷小。", "无穷小 × 有界 = 无穷小。"]),
                ("无穷大", [r"非零无穷小的倒数。", r"$a\gt 1$：$a^x$ 在 $+\infty$ 是正无穷大，在 $-\infty$ 是无穷小。", r"$0\lt a\lt 1$ 时相反。"])),
        derive("例 1.2.26–例 1.2.29　类型判断", [
            (r"\lim_{x\to+\infty}a^x=\begin{cases}0,&0\lt a\lt 1\\ +\infty,&a\gt 1\end{cases}", "例 1.2.26"),
            (r"x\to 0\text{ 时 }3^{-x}-1\to 0\text{（无穷小）}", "例 1.2.27"),
            (r"\lim_{x\to 0^+}\log_a x=\begin{cases}+\infty,&0\lt a\lt 1\\ -\infty,&a\gt 1\end{cases}", "例 1.2.28"),
            (r"\lim_{x\to 0}x\sin\frac1x=0", r"例 1.2.29：有界 × 无穷小"),
        ], code="例题", notes="教材例 1.2.26–1.2.29。"),
        table_page("等价无穷小（$x\to 0$）",
                   ["替换", "替换"],
                   [
                       [r"$\sin x\sim x$", r"$\tan x\sim x$"],
                       [r"$\arcsin x\sim x$", r"$\arctan x\sim x$"],
                       [r"$\ln(1+x)\sim x$", r"$e^x-1\sim x$"],
                       [r"$1-\cos x\sim x^2/2$", "只用于乘除型 $0/0$"],
                   ],
                   lead_t=r"若 $f/g\to 1$，称 $f\sim g$。替换定理：乘除里可用等价量替换。"),
        derive("例 1.2.30　等价替换（乘除）", [
            (r"\lim_{x\to 0}\frac{\sin 3x}{\arctan 2x}=\lim_{x\to 0}\frac{3x}{2x}=\frac32", r"$\sin 3x\sim 3x$，$\arctan 2x\sim 2x$"),
        ], code="例题", notes="教材例 1.2.30。"),
        derive("例 1.2.31　减法里不能直接替换", [
            (r"\lim_{x\to 0}\frac{\tan x-\sin x}{x^3}", "分子是差"),
            (r"=\lim_{x\to 0}\frac{\sin x(1/\cos x-1)}{x^3}=\lim_{x\to 0}\frac{1-\cos x}{x^2\cos x}", r"$\sin x\sim x$"),
            (r"=\lim_{x\to 0}\frac{2\sin^2(x/2)}{x^2}=\frac12", r"$1-\cos x=2\sin^2(x/2)$"),
        ], extra=r"若错用 $\tan x\sim x$、$\sin x\sim x$ 直接代入分子，得 $0$——主项被减没了。",
           code="例题", notes="教材例 1.2.31。"),
        mistake("找错 3　等价替换用在减法",
                r"求 $\displaystyle\lim_{x\to 0}\frac{\tan x-\sin x}{x^3}$。",
                [r"$\tan x\sim x$，$\sin x\sim x$，原式 $=(x-x)/x^3=0$。"],
                "哪一步错了？正确答案是多少？",
                "约 3 分钟。"),
        answer("找错 3", [
            r"等价替换只能用于乘除。正确见例 1.2.31，答案 $1/2$。",
        ]),
        derive("例 1.2.32、例 1.2.33　$x\to\infty$ 看最高次", [
            (r"\lim_{x\to\infty}\frac{3x^3-4x^2+2}{7x^3-5x^2+3x}=\frac37", "例 1.2.32：同次系数比"),
            (r"\lim_{x\to+\infty}\frac{\sqrt[3]{x}-9x^2}{3x-\sqrt[4]{81x^8+1}}=3", r"例 1.2.33：主项 $-9x^2/(-3x^2)$"),
        ], extra=r"$x\to 0$ 时多项式看最低次：$\lim_{x\to 0}(2x^2+3x^4)/(2x^2-3x^3)=1$。",
           code="例题",
           notes="教材例 1.2.32、1.2.33。分子为 $\sqrt[3]{x}-9x^2$（差，不是整式立方根）；sympy 验算得 3。"),
        derive("例 1.2.34　黄金分割", [
            (r"u_n=\frac1{\sqrt5}\Bigl[\phi^n-\hat\phi^n\Bigr],\quad\phi=\frac{1+\sqrt5}{2}", "斐波那契通项"),
            (r"\lim_{n\to\infty}\frac{u_n}{u_{n+1}}=\frac{2}{1+\sqrt5}\approx 0.618", r"$|\hat\phi/\phi|\lt 1$，对应项消失"),
        ], extra=r"另一写法 $\lim F_{n+1}/F_n=\phi\approx 1.618$。",
           code="例题", notes="教材例 1.2.34。"),
        lab("项数变多，比贴住黄金分割", "phi", "phi-canvas", P["phi"],
            notes="先停在 n=3，再拉到 10 以上。",
            code="实验 4"),
        definition("贴现与分期付款",
                   r"<p>年利率 $r$，$n$ 年后金额 $A$ 的现值 $A/(1+r)^n$；连续折现 $A e^{-rn}$。</p>"
                   r"<p>每年付 $20000$、共 $10$ 年：第 $k$ 笔现值 $20000/(1+r)^{k-1}$，总和是等比级数。</p>"
                   r"<p>永久债券每年付息 $100$：价格 $P^B=100/r$。</p>",
                   extra="和人口、连续复利是同一个重要极限，时间方向相反。"),
        prompt("课堂练 8",
               r"$(1)$ 求 $\lim_{x\to\infty}\dfrac{2x^2+1}{5x^2-3x}$ 与 $\lim_{x\to 0}\dfrac{\sin 5x}{x}$。" "\n"
               r"$(2)$ 年利率 $r=5\%$，永久债券每年付息 $100$ 元，理论价格？一年后 $100$ 元的连续折现现值？",
               "约 4 分钟。",
               level="应用"),
        answer("课堂练 8", [
            r"$(1)$ 同次系数比 $2/5$；$\dfrac{\sin 5x}{5x}\cdot 5\to 5$。",
            r"$(2)$ $P^B=100/0.05=2000$ 元；连续折现 $100\,e^{-0.05}$。",
        ]),
        # ─── 七 ───
        section("七", "回顾与自测"),
        culture("一尺之捶，日取其半，万世不竭。割之弥细，所失弥少。",
                r"极限把「取半不竭」和「割圆」写成同一件事。教材另有 $\varepsilon$–$\delta$ 定义（对任意 $\varepsilon\gt 0$ 存在 $\delta\gt 0$，使 $0\lt|x-a|\lt\delta$ 时 $|f(x)-L|\lt\varepsilon$），本课不要求默写。",
                title="文化卡片 · 庄子与刘徽"),
        summary(
            ["极限看趋势：等比先看 $|q|$，函数极限要连同 $x\\to\\square$ 一起看。",
             "左右一致才有极限；连续还要函数值等于这个极限。",
             "两个重要极限：方块要凑齐；指数型不能先收底。",
             "等价无穷小只用于乘除；斐波那契之比贴住黄金分割。"],
            ["把 $q=-1$ 当成收敛。",
             "指数是变量，却先对底取极限。",
             "约分改变了定义，就以为不能求极限。",
             "在减法里直接做等价替换。",
             "有定义就说连续。"],
        ),
        quiz("12", notes="题目来自本讲题库，每轮随机抽 6 题。课后让学生用手机打开本页自测。"),
        homework(
            [r"求 $\sum_{n=0}^{\infty}(1/4)^n$，并说明 $q=-1$ 的级数为什么发散。",
             r"求 $\lim_{x\to 2}(x^2-4)/(x-2)$，以及 $\lim_{x\to 0}\sin 5x/x$。",
             r"求 $\lim_{n\to\infty}(1+1/n)^{2n}$，并写出连续复利一年后的本利和 $A_0 e^{r}$。",
             r"用等价无穷小求 $\lim_{x\to 0}(\tan x-\sin x)/x^3$。"],
            [r"* 分期付款：每年付 $20000$，共 $10$ 年，利率 $r$，写出现值求和公式。",
             r"* 说明为何 $\lim_{x\to 0}(\sin x-x)/x^3$ 不能用 $\sin x\sim x$ 直接得到 $0$。"],
            "下一讲 1.3 导数与微分：割线变成切线；$|x|$ 在 $0$ 不可导。",
        ),
    ]
