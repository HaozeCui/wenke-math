"""1.2 极限。对照 PPT 主线：数列、函数极限、性质、连续、两个重要极限、无穷小、应用。不含数学软件语法。"""
from chrome import (
    cover, objectives, bullets, two_col, cards3, definition, prompt, answer,
    lab, culture, summary, homework, formula_page, table_page, page, h2,
)
from panels import P

FILENAME, TITLE, H1 = "12.html", "1.2 极限 · 文科高等数学", "1.2 极限"
LABS = ["12-limit.js", "extra.js"]


def slides():
    return [
        cover("1.2　建议 8 学时", "看趋势，<br />不看某一项等于谁",
              "数列与函数的极限、四则运算、连续性、两个重要极限、无穷小与等价替换。不写 ε 语言。",
              "等比 · 左右极限 · 重要极限 · 等价无穷小",
              notes="开场：无限接近不是某一项等于极限。"),
        objectives([
            "能判断等比数列、等比级数何时收敛，并在 $|q|<1$ 时写出和。",
            "能按 $x\\to a$、$x\\to a^\\pm$、$x\\to\\pm\\infty$ 读函数极限，并判断左右是否一致、一点是否连续。",
            "能用四则、约分、有理化、两个重要极限和等价无穷小计算简单极限。",
        ]),
        bullets("本讲路线", [
            "数列极限：日取其半、等比数列与等比级数",
            "函数极限的六种趋势，以及左右必须一致",
            "极限的性质：代入、约分、$\\infty-\\infty$、有理化",
            "连续：有定义、有极限、二者相等",
            "两个重要极限，以及指数不能先取极限",
            "无穷小、无穷大，与等价替换",
        ]),
        definition("例 1　一尺之捶，日取其半",
                   r"<p>每天截下剩余的一半：第 $n$ 天截下 $1/2^n$。</p>"
                   r"<p>$$\frac12,\ \frac14,\ \frac18,\ \frac1{16},\ \ldots,\ \frac1{2^n},\ \ldots$$</p>"
                   r"<p>通项无限靠近 $0$，但永远不等于 $0$。这就是「万世不竭」。</p>",
                   extra="有限的截取过程，趋势可以是一个确定的数。后面把每天截下的量加起来，总和恰好是 1 尺。"),
        cards3("例 2　割圆", [
            ("刘徽", "圆内接正 $n$ 边形。$n$ 无限增大时，周长无限靠近圆周 $\\pi d$。"),
            ("算出来的数", r"刘徽得到 $\pi=3.1416$。祖冲之用同一方法算到 $3.1415929$。"),
            ("和例 1 是同一件事", "边数永远有限，趋势可以写成圆周。极限是「无限过程的确定趋势」。"),
        ]),
        definition("数列极限（直观）",
                   r"<p>数列是按次序排好的一列数，定义域是全体正整数。</p>"
                   r"<p>若 $n$ 充分大时，$x_n$ 可以任意靠近常数 $A$，就说数列收敛：</p>"
                   r"<p>$$\lim_{n\to\infty}x_n=A$$</p>"
                   r"<p>否则称发散。没有任何一项必须等于 $A$。</p>",
                   extra="本讲不写 ε–N。先看趋势。"),
        lab("项数变多，点贴住 0", "sequence", "seq-canvas", P["sequence"],
            notes="先停在 n=12，问会不会有某项等于 0。再拉大。",
            code="实验 1"),
        formula_page("例 3　振荡着靠近",
                     r"\lim_{n\to\infty}\frac{n+(-1)^n}{n}=1",
                     extra=r"因为 $\dfrac{n+(-1)^n}{n}=1+\dfrac{(-1)^n}{n}$。$(-1)^n/n$ 在正负之间摆，但被 $1/n$ 压向 $0$，所以整体靠近 $1$。"),
        formula_page("例 4　等比数列",
                     r"\lim_{n\to\infty}a_0 q^n=\begin{cases}0,&|q|<1\\ a_0,&q=1\\ \text{不存在},&|q|>1\end{cases}\quad(a_0\neq 0)",
                     extra=r"例 1 是 $a_0=1/2$、$q=1/2$，通项趋向 $0$。$q=1$ 时每项都是 $a_0$。$|q|>1$ 时绝对值越来越大。另外：$q=-1$ 时在 $a_0$ 与 $-a_0$ 之间摆动，极限也不存在。"),
        definition("例 5　等比级数",
                   r"<p>把等比数列逐项加起来。部分和</p>"
                   r"<p>$$s_n=a_0+a_0 q+\cdots+a_0 q^{n-1}=\frac{a_0(1-q^n)}{1-q}\quad(q\neq 1)$$</p>"
                   r"<p>$|q|<1$ 时 $q^n\to 0$，故</p>"
                   r"<p>$$\sum_{n=0}^{\infty}a_0 q^n=\frac{a_0}{1-q}$$</p>"
                   r"<p>$|q|\ge 1$ 时级数发散。例 1：$\sum_{n=1}^{\infty}1/2^n=1$，每天截下的量加起来正好是整根 1 尺。</p>"),
        prompt("课堂练 1",
               r"$(1)$ $q=1/3$、$a_0=1$ 时，通项 $q^n$ 的极限是多少？级数 $\sum_{n=0}^{\infty}(1/3)^n$ 的和是多少？" "\n"
               r"$(2)$ $1,-1,1,-1,\ldots$ 的极限是否存在？",
               "约 3 分钟。"),
        answer("课堂练 1", [
            r"$|q|=1/3<1$，通项趋向 $0$。和为 $1/(1-1/3)=3/2$。",
            r"这是 $q=-1$。在 $1$ 与 $-1$ 之间摆动，极限不存在，级数也发散。",
        ], comment="先看 $|q|$ 与 $1$ 的大小，再决定是趋向 $0$、等于常数，还是发散。"),
        formula_page("黄金分割：斐波那契比的极限",
                     r"\lim_{n\to\infty}\frac{F_{n+1}}{F_n}=\frac{1+\sqrt{5}}{2}\approx 1.618",
                     extra=r"相邻两项之比贴住这个数。它也是 $x^2-x-1=0$ 的正根。国旗的矩形就按这个长宽比来理解：短边是 1 时，长边是这个极限。"),
        lab("项数变多，比贴住黄金分割", "phi", "phi-canvas", P["phi"],
            notes="先停在 n=3，比值还在跳。再拉到 10 以上。",
            code="实验"),
        definition("函数极限（直观）",
                   r"<p>自变量在定义域里按某种趋势 $x\to\square$ 变化时，若 $f(x)$ 无限靠近常数 $A$，就写</p>"
                   r"<p>$$\lim_{x\to\square}f(x)=A$$</p>"
                   r"<p>$x$ 能不能等于那个点，不必计较。这是描述性定义，不是 $\varepsilon$–$\delta$。</p>",
                   extra="求极限不能只看函数式，还要看 $x$ 按哪一种趋势走。"),
        bullets("六种趋势", [
            r"$x\to a$：从左右两侧同时靠近 $a$。例 6 是 $x\to 0$。",
            r"$x\to a^+$：从大于 $a$ 的一侧靠近，称为右极限。",
            r"$x\to a^-$：从小于 $a$ 的一侧靠近，称为左极限。",
            r"$x\to+\infty$：$x$ 无限增大。",
            r"$x\to-\infty$：$x$ 无限减小。例 8 是 $x\to-\infty$。",
            r"$x\to\infty$：$|x|$ 无限增大，左右两侧都要看。",
        ]),
        table_page("例 6–例 9　先看趋势",
                   ["例", "趋势", "结论"],
                   [
                       [r"例 6　$x\sin x$", r"$x\to 0$", r"趋向 $0$"],
                       [r"例 7　$\sin x/x$", r"$x\to+\infty$", r"趋向 $0$（振荡被 $1/x$ 压住）"],
                       [r"例 8　$2^x$", r"$x\to-\infty$", r"趋向 $0$"],
                       [r"例 9　$1/x$", r"$x\to\infty$", r"两侧都趋向 $0$"],
                   ],
                   lead_t=r"同一个 $1/x$：走向无穷时趋向 $0$，走向 $0$ 时却会炸掉。必须连同 $x\to\square$ 一起看。"),
        formula_page("例 10　取整的左右不一样",
                     r"\lim_{x\to 3^+}[x]=3,\qquad \lim_{x\to 3^-}[x]=2",
                     extra=r"所以 $\lim_{x\to 3}[x]$ 不存在。左闭右开的台阶，在整数点左右高度差 $1$。"),
        lab("从左边来，从右边来", "leftright", "lr-canvas", P["leftright"],
            notes="先停在左边，再拖过 0。问：函数值跳了没有？极限存在吗？",
            code="实验 2"),
        prompt("课堂练 2",
               r"设 $f(x)=\begin{cases}x+1,&x<0\\ x-1,&x\ge 0\end{cases}$。求 $x\to 0$ 的左右极限。极限存在吗？$f(0)$ 等于多少？",
               "约 3 分钟。"),
        answer("课堂练 2", [
            r"左极限：$x+1\to 1$。右极限：$x-1\to -1$。",
            "左右不同，极限不存在。",
            r"$f(0)=-1$。有定义改变不了左右打架。",
        ]),
        definition("例 11–例 13　极限不看那一点",
                   r"<p>例 11：$f(x)=2x$，$x\in(0,2)$，则 $\lim_{x\to 1}f(x)=2$。</p>"
                   r"<p>例 12：把 $x=1$ 从定义域挖掉，极限仍是 $2$。</p>"
                   r"<p>例 13：规定 $h(1)=1$，其余仍是 $2x$，极限仍是 $2$。</p>",
                   extra=r"三个函数不一样，极限一样。$x\to a$ 时极限是否存在、等于多少，与 $x=a$ 处有没有定义、函数值是多少无关。"),
        prompt("课堂练 3",
               r"求 $\lim_{x\to 1}(x^2-1)/(x-1)$ 时约去 $(x-1)$。这改变了 $x=1$ 处的定义，为什么仍可求极限？",
               "约 2 分钟。"),
        answer("课堂练 3", [
            r"极限只关心 $x$ 靠近 $1$、但不等于 $1$ 时的趋势。",
            r"约去后得到 $x+1$，在 $x\neq 1$ 处与原式相同，所以极限是 $2$。",
            "恒等变形可以改变定义域，不改变极限。连续才进一步要求这一点有定义，且函数值等于极限。",
        ]),
        definition("夹逼",
                   r"<p>若在 $a$ 附近有 $g(x)\le f(x)\le h(x)$，且 $g$ 与 $h$ 都以 $A$ 为极限，则 $f$ 也以 $A$ 为极限。</p>"
                   r"<p>$|x\sin(1/x)|\le |x|$。两边进 $0$，中间振荡再凶也只能进 $0$。</p>",
                   extra=r"例 7 的 $\sin x/x$（$x\to+\infty$）是同一句话：$\sin x$ 有界，$1/x$ 是无穷小。"),
        lab("缩放窗口，看振荡被夹住", "squeeze", "sq-canvas", P["squeeze"],
            notes="先宽窗口看抖，再拉近。金色是 ±x。",
            code="实验 3"),
        bullets("极限的性质", [
            r"设同一趋势下 $\lim f$、$\lim g$ 都存在，$c$ 为常数。",
            r"性质 1–2：$\lim c=c$，$\lim_{x\to a}x=a$。",
            r"性质 3–5：常数可提出；和差、乘积可拆开。",
            r"性质 6：商可拆开，但分母的极限不得为 $0$。",
            r"性质 7：$\lim_{x\to a}f(x)=A$ 当且仅当左右极限都存在且都等于 $A$。",
        ]),
        bullets("由性质直接得到", [
            r"$\lim_{x\to a}x^n=a^n$，多项式可逐项代入：$\lim_{x\to a}(c_n x^n+\cdots+c_0)=c_n a^n+\cdots+c_0$。",
            r"$\lim_{x\to\infty}1/x^n=0$。",
            r"同次多项式相除，$x\to\infty$ 时极限是最高次系数之比 $a_n/b_n$。次数不同的情形见例 37。",
            r"分母极限不为 $0$ 时，往往直接把 $x=a$ 代进去。分母极限为 $0$ 时，先化成 $0/0$ 再约。",
        ]),
        formula_page("例 14、例 15　直接代入",
                     r"\lim_{x\to 1}(x^2+2x-3)=0,\qquad \lim_{x\to 1}\frac{x+2}{x-3}=-\frac32",
                     extra=r"例 14 拆成 $x^2$、$2x$、$3$ 再代入。例 15 分母极限是 $-2\neq 0$，分子分母分别代入。"),
        formula_page("例 17　0/0，先约公因子",
                     r"\lim_{x\to 1}\frac{x^2+2x-3}{x^2+x-2}=\lim_{x\to 1}\frac{x+3}{x+2}=\frac43",
                     extra=r"分子分母在 $x=1$ 都是 $0$。分解得 $(x-1)(x+3)/((x-1)(x+2))$，约去 $x-1$ 后再代入。"),
        formula_page("例 18　∞−∞，先通分",
                     r"\lim_{x\to 1}\left(\frac{1}{1-x}-\frac{3}{1-x^3}\right)=-1",
                     extra=r"用 $1-x^3=(1-x)(1+x+x^2)$ 通分，约去 $1-x$，剩下 $-(x+2)/(1+x+x^2)$，再代入。"),
        formula_page("例 19　0/0，有理化",
                     r"\lim_{x\to 4}\frac{\sqrt{x}-2}{x^2-5x+4}=\frac{1}{12}",
                     extra=r"分子乘 $\sqrt{x}+2$，出现 $x-4$。分母是 $(x-4)(x-1)$。约去后再代入 $x=4$。"),
        definition("连续",
                   r"<p>在定义域内的点 $a$：</p>"
                   r"<p>$(1)$ $\lim_{x\to a}f(x)=f(a)$：在 $a$ 连续。</p>"
                   r"<p>$(2)$ 右极限等于 $f(a)$：右连续。$(3)$ 左极限等于 $f(a)$：左连续。</p>"
                   r"<p>开区间内每一点都连续，就是该开区间上的连续函数。闭区间还要求左端点右连续、右端点左连续。</p>",
                   extra="三件事：有定义、极限存在、极限等于函数值。缺一件就是间断。"),
        formula_page("例 16　初等函数可直接代入",
                     r"\lim_{x\to 2}\log_{10}\sin\frac{\pi}{x}=\log_{10}\sin\frac{\pi}{2}=\log_{10}1=0",
                     extra=r"初等函数在其定义域内连续。$x=2$ 在定义域内，所以 $\lim f(x)=f(\lim x)=f(2)$。"),
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
        prompt("课堂练 4",
               r"判断 $f(x)=|x|/x$（$x\neq 0$），$f(0)=0$ 在 $0$ 是否连续。",
               "约 2 分钟。"),
        answer("课堂练 4", [
            r"$x>0$ 时 $f=1$，$x<0$ 时 $f=-1$。左右极限分别为 $1$ 与 $-1$。",
            "极限不存在，所以不连续。把 $f(0)$ 规定成 $0$ 也补不上跳跃。",
        ]),
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
        formula_page("例 20",
                     r"\lim_{x\to 0}\frac{\tan x}{x}=\lim_{x\to 0}\frac{\sin x}{x}\cdot\frac{1}{\cos x}=1",
                     extra=r"$\tan x=\sin x/\cos x$，第二项代入 $\cos 0=1$。"),
        prompt("课堂练 5",
               r"求下列极限：" "\n"
               r"$(1)\ \lim_{x\to 0}\sin x/(2x)$" "\n"
               r"$(2)\ \lim_{x\to 0}\sin 2x/x$" "\n"
               r"$(3)\ \lim_{x\to 0}\sin(ax)/\sin(bx)$（$b\neq 0$）",
               "约 4 分钟。把方块凑进分母。"),
        answer("课堂练 5", [
            r"$(1)$ $\dfrac{\sin x}{x}\cdot\dfrac12\to\dfrac12$。",
            r"$(2)$ $\dfrac{\sin 2x}{2x}\cdot 2\to 2$。",
            r"$(3)$ $\dfrac{\sin(ax)}{ax}\cdot\dfrac{bx}{\sin(bx)}\cdot\dfrac{a}{b}\to\dfrac{a}{b}$。",
        ], comment="缺的常数要自己补。方块必须和正弦里面的式子一致。"),
        formula_page("例 21　变量代换",
                     r"\lim_{x\to 0}\frac{\arcsin x}{x}=1,\qquad \lim_{x\to 0}\frac{\arctan x}{x}=1,\qquad \lim_{x\to 0}\frac{1-\cos x}{x^2}=\frac12",
                     extra=r"令 $t=\arcsin x$，则 $x=\sin t$，原式变成 $t/\sin t$。$1-\cos x=2\sin^2(x/2)$，再套重要极限 1。"),
        formula_page("例 23　指数是变量，不能先收进底",
                     r"\lim_{n\to\infty}\left(1-\frac{3}{n}\right)^{n+5}=e^{-3}",
                     extra=r"拆成 $\left(1-\dfrac{3}{n}\right)^n\cdot\left(1-\dfrac{3}{n}\right)^5\to e^{-3}\cdot 1$。错误算法是先把底取成 $1$，再算 $1^{n+5}=1$。指数 $n+5$ 随 $n$ 变，不是常数。"),
        formula_page("例 26",
                     r"\lim_{x\to\infty}\left(\frac{x+2}{x-3}\right)^x=e^5",
                     extra=r"先写成 $\left(1+\dfrac{5}{x-3}\right)^x$。令 $u=(x-3)/5$，指数 $x=5u+3$，得到 $\left(1+\dfrac1u\right)^{5u+3}\to e^5$。"),
        definition("例 22、例 39　人口与连续复利",
                   r"<p>年增长率（或年利率）为 $r$，一年分成 $n$ 期，每期增长率 $r/n$。一年后：</p>"
                   r"<p>$$A_0\left(1+\frac{r}{n}\right)^n\to A_0 e^{r}$$</p>"
                   r"<p>$k$ 年后是 $A_0 e^{kr}$。人口按月计、存款按期计息，加密之后都落到同一个 $e$。</p>",
                   extra=r"令 $x=r/n$，就回到重要极限 2。"),
        definition("贴现：把将来的钱折回现在",
                   r"<p>年利率 $r$，$n$ 年后的金额 $A$，现在只相当于</p>"
                   r"<p>$$A/(1+r)^n$$</p>"
                   r"<p>若按连续复利折现，则是 $A e^{-rn}$。指数上的负号表示「往回算」。</p>",
                   extra="和人口、连续复利是同一个重要极限，只是时间方向相反。"),
        formula_page("例 24、例 25",
                     r"\lim_{x\to 0}\frac{\ln(1+x)}{x}=1,\qquad \lim_{x\to 0}\frac{e^x-1}{x}=1",
                     extra=r"例 24：$\dfrac1x\ln(1+x)=\ln(1+x)^{1/x}\to\ln e=1$。例 25：令 $t=e^x-1$，则 $x=\ln(1+t)$，化成 $t/\ln(1+t)$。"),
        two_col("无穷小与无穷大",
                ("无穷小", [r"某个过程中极限是 $0$。", "两个条件：极限存在，而且是 $0$。", r"$x\to\infty$ 时 $1/x$ 是无穷小，$x$ 是无穷大。"]),
                ("无穷大", [r"非零无穷小的倒数。", r"$a>1$ 时，$a^x$ 在 $x\to+\infty$ 是正无穷大，在 $x\to-\infty$ 是无穷小。", r"$0\lt a\lt 1$ 时正好相反。"])),
        bullets("有界变量", [
            r"若某个时刻之后恒有 $|u|\le M$，称 $u$ 有界。",
            "无穷小与有界量的乘积仍是无穷小。",
            r"因此 $x\to 0$ 时 $x\sin(1/x)\to 0$；$x\to\infty$ 时 $\sin x/x\to 0$。",
            r"$x\to 0$ 时 $\sin x\to 0$，是无穷小；$\cos x$ 有界，极限是 $1$，不是无穷小。",
            "多项式是不是无穷大或无穷小，要看 $x$ 的趋势，不能脱离过程下判断。",
        ]),
        table_page("等价无穷小（x 趋向 0 时可当结论用）",
                   ["替换", "替换"],
                   [
                       [r"$\sin x\sim x$", r"$\tan x\sim x$"],
                       [r"$\arcsin x\sim x$", r"$\arctan x\sim x$"],
                       [r"$\ln(1+x)\sim x$", r"$e^x-1\sim x$"],
                       [r"$1-\cos x\sim x^2/2$", "只用于 $0/0$"],
                   ],
                   lead_t=r"若 $f,g\to 0$ 且 $f/g\to 1$，称 $f\sim g$。$x\to 0$ 时，没有常数项的多项式等价于次数最低的那一项。"),
        formula_page("例 34、例 35　用最低次，或直接替换",
                     r"\lim_{x\to 0}\frac{2x^2+3x^4-5x^7}{2x^2-3x^3+8x^5}=1,\qquad \lim_{x\to 0}\frac{\sin 3x}{\arctan 2x}=\frac32",
                     extra=r"例 34：分子分母都等价于 $2x^2$。例 35：$\sin 3x\sim 3x$，$\arctan 2x\sim 2x$。"),
        formula_page("例 37、例 38　x 趋向无穷时看最高次",
                     r"\lim_{x\to\infty}\frac{3x^3-4x^2+2}{7x^3-5x^2+3x}=\frac37",
                     extra=r"分子次数低于分母，极限为 $0$；高于分母，极限为无穷大；次数相同，等于最高次系数之比。例 38：$\lim_{n\to\infty}(3\sqrt[3]{n}-9n^2)/(3n-\sqrt[4]{81n^8}+1)=(-9n^2)/(-3n^2)=3$。"),
        prompt("课堂练 6",
               r"求 $\lim_{x\to 0}(1+2x)^{1/x}$，并说明为什么不能先把底收成 $1$。",
               "约 3 分钟。"),
        answer("课堂练 6", [
            r"写成 $\left[(1+2x)^{1/(2x)}\right]^2\to e^2$。",
            r"若先让底变成 $1$，会得到 $1^{1/x}=1$，把指数里的变化丢掉了。",
        ]),
        definition("教材里的 ε 定义，课上不默写",
                   r"<p>$\lim_{x\to a}f(x)=L$ 的严格说法是：对任意 $\varepsilon>0$，存在 $\delta>0$，使 $0\lt|x-a|\lt\delta$ 时 $|f(x)-L|\lt\varepsilon$。</p>"
                   r"<p>$\varepsilon$ 是允许的误差，$\delta$ 是自变量必须靠多近。先画水平条带，再找竖直窗口。</p>",
                   extra="本课用图像和计算判断极限。知道这句话在教材里，不必写成证明。"),
        culture("一尺之捶，日取其半，万世不竭。割之弥细，所失弥少。",
                "极限把「取半不竭」和「割圆」写成同一件事：无限过程可以有确定的趋势。本讲不要求写 ε–δ。",
                title="文化卡片 · 庄子与刘徽"),
        summary(
            ["极限看趋势：等比先看 $|q|$，函数极限要连同 $x\\to\\square$ 一起看。", "左右一致才有极限；连续还要函数值等于这个极限。", "斐波那契之比贴住黄金分割；贴现是连续复利的时间反向。"],
            ["把 $q=-1$ 当成收敛。", "指数是变量，却先对底取极限。", "约分改变了定义，就以为不能求极限。", "有定义就说连续。"],
        ),
        homework(
            [r"求 $\sum_{n=0}^{\infty}(1/4)^n$，并说明 $q=-1$ 的级数为什么发散。",
             r"求 $\lim_{x\to 2}(x^2-4)/(x-2)$，以及 $\lim_{x\to 0}\sin 5x/x$。",
             r"求 $\lim_{n\to\infty}(1+1/n)^{2n}$，并写出连续复利一年后的本利和。"],
            [r"* 用等价无穷小求 $\lim_{x\to 0}(\tan x-\sin x)/x^3$。提示：先通分，再用 $1-\cos x\sim x^2/2$。"],
            "下一讲 1.3 导数与微分：割线变成切线；$|x|$ 在 $0$ 不可导。",
        ),
    ]
