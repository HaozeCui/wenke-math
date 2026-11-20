"""1.5 不定积分。按「逆运算 → 原函数族 → 公式与线性 → 凑微分 → 第二换元 → 分部 → 回顾」七节组织。"""
from chrome import (
    cover, objectives, bullets, two_col, definition, prompt, answer, table_page,
    lab, culture, summary, homework, derive, mistake, section, route, quiz,
)
from panels import P

FILENAME, TITLE, H1 = "15.html", "1.5 不定积分 · 文科高等数学", "1.5 不定积分"
LABS = ["15-family.js", "extra.js"]

DIFFBACK = """
            <div class="ctrl">
              <div class="seg">
                <button type="button" data-prob="0" class="on">sin x cos x</button>
                <button type="button" data-prob="1">x/(1+x²)</button>
                <button type="button" data-prob="2">x cos x²</button>
              </div>
              <div class="seg" id="diffback-cands" style="margin-top:10px"></div>
              <label style="margin-top:10px"><span>位置 x</span><span class="ctrl-val" id="diffback-x-val">0.80</span></label>
              <input id="diffback-x" type="range" min="0" max="100" step="1" value="62" />
            </div>
            <div class="readout" id="diffback-read"></div>
            <div class="verdict" id="diffback-verdict"></div>
"""


def slides():
    return [
        cover("1.5　建议 6 学时", "原函数是一族，<br />差一个常数",
              "知道了变化率，能不能找回原来的函数？答案不止一个，而是上下平移的一整族。本讲先认清这一族，再练凑微分、第二换元与分部积分。",
              "配套《文科数学基础》　·　原函数 · 换元法 · 分部积分",
              notes="不要把整堂课上成积分表竞赛。每算完一题都求导回去。"),
        objectives([
            "能说明原函数与不定积分的含义，会用求导检验积分结果，并解释形式不同的答案为何只差一个常数。",
            "能用基本积分公式与线性运算计算简单积分（含拆项、分出整式、三角变形）。",
            "能用第一换元（凑微分）与第二换元（根式代换、三角代换）求积分，并正确代回原变量。",
            "能对两类函数之积选好 u 与 dv 作分部积分，会处理积分「转回来」的情形。",
        ]),
        route(notes="路线由下面七个分节自动生成。"),

        section("一", "问题：求导倒过来", "已知导数，找原来的函数——一道有无穷多个答案的填空题。"),
        two_col("从求导到它的逆运算",
                ("求导", [r"$\sin x\ \longrightarrow\ (\sin x)'=\cos x$", "已知函数，求变化率。", "答案唯一。"]),
                ("逆运算", [r"$(\quad\ )'=\cos x$", "已知变化率，找原来的函数。", r"$\sin x$、$\sin x+1$、$\sin x-3$ 都对：答案无穷多。"]),
                lead_t="加法之后有减法，乘法之后有除法；学过求导，自然要研究它的逆运算。",
                notes="先让学生填空，收集几个不同答案，再引出「一族」。"),
        definition("原函数与不定积分",
                   r"<p>若在区间上 $F'(x)=f(x)$，称 $F$ 是 $f$ 的一个<b>原函数</b>。$f$ 的全体原函数称为<b>不定积分</b>，记作</p>"
                   r"<p>$$\int f(x)\,dx=F(x)+C$$</p>"
                   r"<p>$\int$ 是积分号，$f(x)$ 是被积函数，$x$ 是积分变量，$C$ 是任意常数（积分常数）。</p>",
                   extra="验算永远是求导：$(F+C)'=f$。定积分是一个数，不定积分是一族函数。",
                   notes="「原函数」就是「原来的那个函数」。三个问题：何时存在（1.6）、有多少个（本讲）、怎样求（本讲）。"),
        derive("例 1.5.1、1.5.2　由导数公式倒推", [
            (r"(\sin x)'=\cos x\ \Longrightarrow\ \int\cos x\,dx=\sin x+C", "例 1.5.1：导数公式倒过来读"),
            (r"(\cos x)'=-\sin x\ \Longleftrightarrow\ (-\cos x)'=\sin x", "例 1.5.2：先把负号挪到左边"),
            (r"\int\sin x\,dx=-\cos x+C", "符号跟着原函数走"),
            (r"\bigl(-\cos x+C\bigr)'=\sin x", "验算：求导回到被积函数"),
        ], extra="教材的注：「$C$ 是任意实常数」这句话常省略，有些数学手册和计算软件干脆不写 $C$；但做题时千万不要漏写。",
           code="例题"),
        bullets("积分与微分：互逆，但差一个 C", [
            r"$\int f(x)\,dx=F(x)+C\iff F'(x)=f(x)$：验算不定积分，只要求导。",
            r"先积分再微分，完全抵消：$\bigl[\int f(x)\,dx\bigr]'=f(x)$，$d\int f(x)\,dx=f(x)\,dx$。",
            r"先微分再积分，抵消后要补 $C$：$\int dF(x)=F(x)+C$。",
            r"所以 $\int dF(x)=F(x)$ 是错的——它只写出了一族里的一条。",
        ], notes="教材思考题 1.5.18 问的就是最后一条。"),
        prompt("课堂练 1",
               r"先猜后验（写出 $+C$，再求导核对）：" "\n"
               r"(1) $\int 3x^2\,dx$　　(2) $\int e^x\,dx$　　(3) $\displaystyle\int\frac{dx}{1+x^2}$",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 1", [
            r"(1) $x^3+C$，因为 $(x^3)'=3x^2$。",
            r"(2) $e^x+C$，因为 $(e^x)'=e^x$。",
            r"(3) $\arctan x+C$，因为 $(\arctan x)'=\dfrac1{1+x^2}$。",
        ], comment="每一条导数公式倒过来，都是一条积分公式。"),

        section("二", "原函数族：差一个常数", "答案形式可以不同；只要求导相同，它们就只差一个常数。"),
        definition("几何：一族平行的积分曲线",
                   r"<p>一个原函数的图像叫一条<b>积分曲线</b>。不定积分是把它上下平移得到的一整族。</p>"
                   r"<p>被积函数是切线斜率：同一横坐标处，族中每条曲线的切线互相平行。</p>",
                   extra=r"例如 $\int 2x\,dx=x^2+C$：每条抛物线在 $x=1$ 处的切线斜率都是 2。"),
        lab("平移整族曲线，导数仍是 2x", "family", "family-canvas", P["family"],
            notes="浅色是其他 C。拖滑条只改当前这条。问：同一个 x 处，切线斜率变了没有？",
            code="实验 1"),
        bullets("为什么只差一个常数", [
            r"若 $F'=f$，$G'=f$，则 $(F-G)'=0$。",
            r"在区间上导数处处为 0 的函数是常数（拉格朗日中值定理），所以 $F-G=C$。",
            r"求出一个原函数 $F$，全部原函数就是 $F+C$。",
            "「有多少个」解决了；「一定存在吗」留给 1.6：连续函数的变上限积分就是它的一个原函数。",
        ], notes="中值定理在 1.4 讲过，这里只引用结论。"),
        derive("例 1.5.3　两个答案，差 π/2", [
            (r"(\arcsin x)'=\frac1{\sqrt{1-x^2}}\ \Longrightarrow\ \int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C", "由导数公式"),
            (r"(-\arccos x)'=\frac1{\sqrt{1-x^2}}\ \Longrightarrow\ \int\frac{dx}{\sqrt{1-x^2}}=-\arccos x+C_1", "另一条导数公式也能倒推"),
            (r"\arcsin x+\arccos x=\frac{\pi}{2}", "两个原函数之差是常数"),
            (r"\arcsin x+C=-\arccos x+C_1,\qquad C_1=C+\frac{\pi}{2}", "同一族，只是常数的记法不同"),
        ], extra="不定积分的答案形式往往不止一个，原因就在常数 $C$。对答案时先求导，不要只比字面。",
           code="例题"),
        lab("两条曲线，上下差 π/2", "twins", "twin-canvas", P["twins"],
            notes="拖 x，看竖线段的长度变不变。",
            code="实验 2"),
        prompt("课堂练 2　谁对",
               r"计算 $\int(x+1)^2\,dx$，两位同学的答案：" "\n"
               r"甲：$\dfrac{(x+1)^3}{3}+C$　　乙：$\dfrac{x^3}{3}+x^2+x+C$" "\n"
               r"谁对？两个答案相差多少？",
               "约 2 分钟。先求导，再相减。",
               level="辨析"),
        answer("课堂练 2", [
            r"两人都对：$\Bigl(\dfrac{(x+1)^3}{3}\Bigr)'=(x+1)^2$，$\bigl(\tfrac{x^3}{3}+x^2+x\bigr)'=x^2+2x+1$。",
            r"相减：$\dfrac{(x+1)^3}{3}-\Bigl(\dfrac{x^3}{3}+x^2+x\Bigr)=\dfrac13$，是常数。",
            r"所以两族完全相同，只是甲的 $C$ 相当于乙的 $C+\tfrac13$。",
        ], comment="甲用的是凑微分（第四节），乙是展开后逐项积分（第三节）。"),

        section("三", "基本公式与线性运算", "把导数表倒过来读；再允许拆项、提出常数。"),
        table_page("基本积分公式（一）",
                   ["积分公式", "由哪条导数而来"],
                   [
                       [r"$\int 0\,dx=C$", "常数的导数是 0"],
                       [r"$\int\frac1x\,dx=\ln|x|+C$", r"$(\ln|x|)'=\frac1x$"],
                       [r"$\int x^m\,dx=\frac{x^{m+1}}{m+1}+C\ (m\ne-1)$", "幂函数：指数加 1，再除以新指数"],
                       [r"$\int a^x\,dx=\frac{a^x}{\ln a}+C\ (a>0,a\ne1)$", r"$(a^x)'=a^x\ln a$"],
                       [r"$\int e^x\,dx=e^x+C$", r"$(e^x)'=e^x$"],
                       [r"$\int\cos x\,dx=\sin x+C$，$\int\sin x\,dx=-\cos x+C$", "例 1.5.1、1.5.2"],
                   ],
                   lead_t="教材公式（1）—（7）。"),
        table_page("基本积分公式（二）",
                   ["积分公式", "由哪条导数而来"],
                   [
                       [r"$\int\sec^2x\,dx=\tan x+C$", r"$(\tan x)'=\sec^2x$"],
                       [r"$\int\csc^2x\,dx=-\cot x+C$", r"$(\cot x)'=-\csc^2x$"],
                       [r"$\int\sec x\tan x\,dx=\sec x+C$", r"$(\sec x)'=\sec x\tan x$"],
                       [r"$\int\csc x\cot x\,dx=-\csc x+C$", r"$(\csc x)'=-\csc x\cot x$"],
                       [r"$\int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C$", "例 1.5.3"],
                       [r"$\int\frac{dx}{1+x^2}=\arctan x+C$", r"$(\arctan x)'=\frac1{1+x^2}$"],
                   ],
                   lead_t="教材公式（8）—（13）。先猜后验：对了再写 $+C$。"),
        bullets("公式表的三条注", [
            r"$\int\frac1x\,dx$ 不是 $\int x^m\,dx$ 在 $m=-1$ 时的特例：那时分母 $m+1=0$。",
            r"$\ln|x|$ 要加绝对值：$x\lt 0$ 时，$(\ln|x|)'=\bigl(\ln(-x)\bigr)'=\frac{1}{-x}\cdot(-1)=\frac1x$。",
            r"分清幂函数与指数函数：$\int x^2\,dx=\frac{x^3}{3}+C$，$\int 2^x\,dx=\frac{2^x}{\ln2}+C$。",
        ]),
        definition("线性运算",
                   r"<p>$$\int\bigl[f(x)\pm g(x)\bigr]\,dx=\int f(x)\,dx\pm\int g(x)\,dx$$</p>"
                   r"<p>$$\int kf(x)\,dx=k\int f(x)\,dx\quad(k\text{ 是非零常数})$$</p>",
                   extra=r"拆成几个积分时，每个都带一个任意常数，最后合并成一个 $C$。$\int dx$ 就是 $\int 1\,dx$。乘积、商<b>不能</b>这样拆。",
                   notes="由微分公式 d(f±g)=df±dg、d(kf)=k df 得到。"),
        derive("例 1.5.4　先展开，再逐项积分", [
            (r"(1+\sqrt x)^3=1+3x^{\frac12}+3x+x^{\frac32}", "二项式展开，根式写成分数指数"),
            (r"\int(1+\sqrt x)^3dx=\int dx+3\int x^{\frac12}dx+3\int x\,dx+\int x^{\frac32}dx", "线性运算：拆开，常数提出"),
            (r"=x+3\cdot\frac23x^{\frac32}+3\cdot\frac12x^2+\frac25x^{\frac52}+C", "幂函数公式逐项用"),
            (r"=x+2x\sqrt x+\frac32x^2+\frac25x^2\sqrt x+C", "四个任意常数合并成一个 $C$"),
        ], code="例题"),
        derive("例 1.5.5　假分式：先分出整式", [
            (r"\frac{x^4}{1+x^2}=\frac{x^4-1}{1+x^2}+\frac{1}{1+x^2}", "分子减 1 再加 1"),
            (r"=x^2-1+\frac1{1+x^2}", r"$x^4-1=(x^2-1)(x^2+1)$"),
            (r"\int\frac{x^4}{1+x^2}dx=\int x^2dx-\int dx+\int\frac{dx}{1+x^2}", "逐项积分"),
            (r"=\frac13x^3-x+\arctan x+C", ""),
        ], extra=r"分子次数不低于分母次数的分式叫有理假分式。先分出整式 $x^2-1$，剩下的 $\frac1{1+x^2}$ 是真分式。",
           code="例题"),
        derive("例 1.5.6　用倍角公式拆开", [
            (r"\frac{\cos2x}{\sin^2x\cos^2x}=\frac{\cos^2x-\sin^2x}{\sin^2x\cos^2x}", r"$\cos2x=\cos^2x-\sin^2x$"),
            (r"=\frac1{\sin^2x}-\frac1{\cos^2x}", "分成两项"),
            (r"\int\frac{\cos2x}{\sin^2x\cos^2x}dx=\int\csc^2x\,dx-\int\sec^2x\,dx", "化成公式表里的样子"),
            (r"=-\cot x-\tan x+C", "公式（8）（9）"),
        ], code="例题"),
        derive("例 1.5.7　用降幂公式", [
            (r"\sin^2\frac x2=\frac{1-\cos x}{2}", "降幂：平方没有公式，一次的有"),
            (r"\int\sin^2\frac x2\,dx=\frac12\int dx-\frac12\int\cos x\,dx", "线性拆开"),
            (r"=\frac x2-\frac12\sin x+C", ""),
        ], extra="例 1.5.4—1.5.7 的共同点：被积函数不在表里，先用代数或三角恒等式把它变成表里几项的和。",
           code="例题"),
        prompt("课堂练 3",
               r"先变形，再逐项积分：" "\n"
               r"(1) $\displaystyle\int\frac{x^3-27}{x-3}\,dx$　　(2) $\int\cot^2x\,dx$　　(3) $\int(1-2x)^2\,dx$",
               "约 4 分钟。",
               level="变式",
               notes="三题都来自习题 1.5.6。"),
        answer("课堂练 3", [
            r"(1) $x^3-27=(x-3)(x^2+3x+9)$，原式 $=\frac{x^3}{3}+\frac32x^2+9x+C$。",
            r"(2) $\cot^2x=\csc^2x-1$，原式 $=-\cot x-x+C$。",
            r"(3) 展开 $1-4x+4x^2$，原式 $=x-2x^2+\frac43x^3+C$。",
        ], comment="分解因式、三角恒等式、展开：三种「变成表里的样子」。"),
        mistake("找错 1　分子分母各积各的",
                r"计算 $\displaystyle\int\frac{(x+1)^2}{x}\,dx$。",
                [r"分子：$\int(x+1)^2\,dx=\dfrac{(x+1)^3}{3}$。",
                 r"分母：$\int x\,dx=\dfrac{x^2}{2}$。",
                 r"原式 $=\dfrac{(x+1)^3}{3}\Big/\dfrac{x^2}{2}+C=\dfrac{2(x+1)^3}{3x^2}+C$。"],
                "错在哪里？正确答案是多少？用求导验算。",
                "约 3 分钟。"),
        answer("找错 1", [
            "线性运算只对加减、常数倍成立；商（和积）不能分开积分。第 1—3 步整个思路就错了。",
            r"正确：先拆项 $\dfrac{(x+1)^2}{x}=x+2+\dfrac1x$，原式 $=\dfrac{x^2}{2}+2x+\ln|x|+C$。",
            r"验算：$\bigl(\tfrac{x^2}{2}+2x+\ln|x|\bigr)'=x+2+\tfrac1x$。错解求导回不到被积函数。",
        ], comment="求导法则里乘积、商都有专门公式；积分里没有「商的积分 = 积分的商」。"),

        section("四", "第一换元：凑微分", "被积式里藏着「里层的导数」，把它凑成 d(里层)。"),
        derive("例 1.5.8　把分子补成里层的导数", [
            (r"\int\frac{x\,dx}{1+x^2}", r"$(1+x^2)'=2x$，与分子只差常数倍 2"),
            (r"=\frac12\int\frac{2x\,dx}{1+x^2}=\frac12\int\frac{d(1+x^2)}{1+x^2}", "凑微分"),
            (r"=\frac12\int\frac{du}{u}=\frac12\ln|u|+C", r"换元 $u=1+x^2$，积分"),
            (r"=\frac12\ln(1+x^2)+C", r"代回 $u=1+x^2$；它恒正，绝对值可去"),
        ], code="例题"),
        definition("第一换元公式（凑微分法）",
                   r"<p>若 $F'(u)=f(u)$，$u=\varphi(x)$ 可导，则</p>"
                   r"<p>$$\int f[\varphi(x)]\varphi'(x)\,dx=\int f[\varphi(x)]\,d\varphi(x)=\int f(u)\,du=F[\varphi(x)]+C$$</p>"
                   r"<p>四步：凑微分 → 换元 $u=\varphi(x)$ → 积分 → 代回原变量。</p>",
                   extra=r"为什么对：右端求导，链式法则给出 $\{F[\varphi(x)]\}'=f[\varphi(x)]\varphi'(x)$。凑微分就是链式法则倒着用。"),
        derive("三个简单例：一眼看出里层", [
            (r"\int 2x\,e^{x^2}dx=\int e^{x^2}d(x^2)=e^{x^2}+C", r"里层 $x^2$，导数 $2x$ 正好在"),
            (r"\int\frac{2x+1}{x^2+x}dx=\int\frac{d(x^2+x)}{x^2+x}=\ln|x^2+x|+C", "分子正好是分母的导数"),
            (r"\int\sin x\cos x\,dx=\int\sin x\,d(\sin x)=\frac12\sin^2x+C", r"里层 $\sin x$，$d(\sin x)=\cos x\,dx$"),
        ], extra=r"第三题若凑成 $-\int\cos x\,d(\cos x)$，得 $-\frac12\cos^2x+C$，与上式差常数 $\frac12$，也对。",
           code="例"),
        derive("例 1.5.9　一次式的幂", [
            (r"\int(ax+b)^m\,dx=\frac1a\int(ax+b)^m\,d(ax+b)", r"凑微分：$d(ax+b)=a\,dx$（$a\ne0$）"),
            (r"=\frac1a\int u^m\,du", r"换元 $u=ax+b$"),
            (r"=\frac1a\cdot\frac1{m+1}u^{m+1}+C", r"积分（$m\ne-1$）"),
            (r"=\frac{(ax+b)^{m+1}}{a(m+1)}+C", r"代回 $u=ax+b$"),
        ], extra=r"课堂练 2 甲的答案就是 $a=b=1$、$m=2$ 的情形。里层是一次式时，结果只是多除以一个 $a$。",
           code="例题"),
        derive("例 1.5.10　缺的常数补上再除掉", [
            (r"\int x^2e^{-x^3}dx=-\frac13\int e^{-x^3}\,d(-x^3)", r"$d(-x^3)=-3x^2dx$，补上 $-3$ 再除掉"),
            (r"=-\frac13\int e^u\,du=-\frac13e^u+C", r"换元 $u=-x^3$"),
            (r"=-\frac13e^{-x^3}+C", "代回"),
            (r"\Bigl(-\frac13e^{-x^3}\Bigr)'=-\frac13e^{-x^3}\cdot(-3x^2)=x^2e^{-x^3}", "求导回去核对"),
        ], extra=r"熟练以后，中间的换元 $u=\varphi(x)$ 可以不写，但要做到心中有数。",
           code="例题"),
        derive("例 1.5.11　正切与余切", [
            (r"\int\tan x\,dx=\int\frac{\sin x}{\cos x}dx=-\int\frac{d(\cos x)}{\cos x}", r"$d(\cos x)=-\sin x\,dx$"),
            (r"=-\ln|\cos x|+C", "对数公式"),
            (r"\int\cot x\,dx=\int\frac{\cos x}{\sin x}dx=\int\frac{d(\sin x)}{\sin x}=\ln|\sin x|+C", "同理"),
        ], extra=r"$-\ln|\cos x|=\ln|\sec x|$，两种写法都对。这两条记作公式（14）（15）。",
           code="例题"),
        derive("例 1.5.12、1.5.13　提出 a，凑成 d(x/a)", [
            (r"\int\frac{dx}{x^2+a^2}=\frac1{a^2}\int\frac{dx}{1+(x/a)^2}", r"例 1.5.12：提出 $a^2$（$a>0$）"),
            (r"=\frac1a\int\frac{d(x/a)}{1+(x/a)^2}=\frac1a\arctan\frac xa+C", r"$dx=a\,d\bigl(\frac xa\bigr)$"),
            (r"\int\frac{dx}{\sqrt{a^2-x^2}}=\frac1a\int\frac{dx}{\sqrt{1-(x/a)^2}}", r"例 1.5.13：根号里提出 $a^2$"),
            (r"=\int\frac{d(x/a)}{\sqrt{1-(x/a)^2}}=\arcsin\frac xa+C", "回到公式（12）"),
        ], extra=r"$a=1$ 时就是公式表里的 $\arctan x$ 与 $\arcsin x$。",
           code="例题"),
        derive("例 1.5.14　拆成两个简单分式", [
            (r"\frac1{x^2-a^2}=\frac1{2a}\Bigl(\frac1{x-a}-\frac1{x+a}\Bigr)", "通分可以验证"),
            (r"\int\frac{dx}{x^2-a^2}=\frac1{2a}\Bigl[\int\frac{d(x-a)}{x-a}-\int\frac{d(x+a)}{x+a}\Bigr]", r"$dx=d(x-a)=d(x+a)$"),
            (r"=\frac1{2a}\bigl(\ln|x-a|-\ln|x+a|\bigr)+C", ""),
            (r"=\frac1{2a}\ln\left|\frac{x-a}{x+a}\right|+C", "对数相减并成一个"),
        ], code="例题"),
        derive("例 1.5.15　正割：上下同乘 cos x", [
            (r"\int\sec x\,dx=\int\frac{\cos x\,dx}{\cos^2x}=\int\frac{d(\sin x)}{1-\sin^2x}", r"凑出 $d(\sin x)$"),
            (r"=\int\frac{du}{1-u^2}=\frac12\int\Bigl(\frac1{1-u}+\frac1{1+u}\Bigr)du", r"$u=\sin x$，拆分式（同例 1.5.14）"),
            (r"=\frac12\ln\left|\frac{1+u}{1-u}\right|+C=\frac12\ln\left|\frac{1+\sin x}{1-\sin x}\right|+C", "积分，代回"),
            (r"=\frac12\ln\frac{(1+\sin x)^2}{\cos^2x}+C=\ln|\sec x+\tan x|+C", r"上下同乘 $1+\sin x$"),
        ], code="例题"),
        derive("例 1.5.16　余割：平移成正割", [
            (r"\csc x=\frac1{\sin x}=\frac1{\cos\bigl(x-\frac{\pi}{2}\bigr)}=\sec\Bigl(x-\frac{\pi}{2}\Bigr)", r"$\sin x=\cos\bigl(x-\frac{\pi}{2}\bigr)$"),
            (r"\int\csc x\,dx=\int\sec\Bigl(x-\frac{\pi}{2}\Bigr)d\Bigl(x-\frac{\pi}{2}\Bigr)", r"$dx=d\bigl(x-\frac{\pi}{2}\bigr)$"),
            (r"=\ln\Bigl|\sec\Bigl(x-\frac{\pi}{2}\Bigr)+\tan\Bigl(x-\frac{\pi}{2}\Bigr)\Bigr|+C", "套用例 1.5.15"),
            (r"=\ln|\csc x-\cot x|+C", r"$\tan\bigl(x-\frac{\pi}{2}\bigr)=-\cot x$"),
        ], extra="例 1.5.11—1.5.16 的结果都收进公式表（14）—（21），见最后一节。",
           code="例题"),
        two_col("换元的思路：关系映射反演",
                ("一般的套路", ["原问题难：直接求不出。", "映射：换一个变量，变成新问题。", "在新问题里求解。", "反演：把解翻译回原来的变量。"]),
                ("在例 1.5.8 里", [r"求 $\int\frac{x\,dx}{1+x^2}$。", r"映射 $u=1+x^2$：变成 $\frac12\int\frac{du}{u}$。", r"求得 $\frac12\ln|u|+C$。", r"反演：代回 $u=1+x^2$。"]),
                lead_t="教材称之为关系映射反演（RMI）方法，本质是化归：化繁为简、化未知为已知。",
                notes="对应教材图 1.49。强调最后一步「反演」：不定积分必须代回原变量；1.6 定积分换了上下限可以不代回。"),
        two_col("换元失败通常因为",
                ("没有里层的导数", [r"$\int e^{x^2}dx$ 不是 $\int 2x\,e^{x^2}dx$ 那种。", "缺了里层导数 $2x$，凑不出 $d(x^2)$。", "它的原函数存在，但写不成初等函数。"]),
                ("系数没凑对", [r"$\int e^{2x}dx$：$d(2x)=2\,dx$。", r"所以 $=\frac12\int e^{2x}d(2x)=\frac12e^{2x}+C$。", r"验算：求导带回 2，再被 $\frac12$ 消掉。"]),
                notes="缺的是常数可以补；缺的是含 x 的因子不能补。"),
        prompt("课堂练 4",
               r"计算 $\int e^{2x}\,dx$ 与 $\displaystyle\int\frac{dx}{2x+3}$。",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 4", [
            r"$\int e^{2x}dx=\frac12\int e^{2x}d(2x)=\frac12e^{2x}+C$。",
            r"$\int\frac{dx}{2x+3}=\frac12\int\frac{d(2x+3)}{2x+3}=\frac12\ln|2x+3|+C$。",
            "两题都是「差一个常数因子」：补上，再除掉。",
        ]),
        prompt("课堂练 5",
               r"凑微分：" "\n"
               r"(1) $\int e^x\sqrt{3+2e^x}\,dx$　　(2) $\displaystyle\int\frac{\ln^3x}{x}\,dx$　　(3) $\displaystyle\int\frac{dx}{4+9x^2}$",
               "约 4 分钟。先说出里层是谁。",
               level="变式",
               notes="三题来自习题 1.5.7。"),
        answer("课堂练 5", [
            r"(1) 里层 $3+2e^x$，$e^xdx=\frac12d(3+2e^x)$，原式 $=\frac13(3+2e^x)^{3/2}+C$。",
            r"(2) 里层 $\ln x$，$\frac{dx}{x}=d(\ln x)$，原式 $=\frac14\ln^4x+C$。",
            r"(3) $=\frac19\int\frac{dx}{(2/3)^2+x^2}$，用例 1.5.12（$a=\frac23$）：$\frac16\arctan\frac{3x}{2}+C$。",
        ], comment=r"第三题也可以凑 $d\bigl(\frac{3x}{2}\bigr)$：$\frac14\cdot\frac23\int\frac{d(3x/2)}{1+(3x/2)^2}$。"),
        mistake("找错 2　换了元，没换 dx",
                r"计算 $\int x\cos(x^2)\,dx$。",
                [r"令 $u=x^2$。",
                 r"原式 $=\int\cos u\,du=\sin u+C$。",
                 r"代回：原式 $=\sin(x^2)+C$。"],
                "求导验算，哪一步出了问题？",
                "约 2 分钟。"),
        answer("找错 2", [
            r"验算：$\bigl(\sin(x^2)\bigr)'=2x\cos(x^2)$，比被积函数多了因子 2。",
            r"第 2 步错：$du=2x\,dx$，所以 $x\,dx=\frac12du$，不能把 $x\,dx$ 直接换成 $du$。",
            r"正确：$\frac12\int\cos u\,du=\frac12\sin(x^2)+C$。",
        ], comment="换元三件事：换被积式、换微分、最后代回。下一页的实验把「求导回去」画出来。"),
        lab("换完元，求导回去核对", "diffback", "diffback-canvas", DIFFBACK,
            notes="先选 x cos x²，点 sin x²（找错 2 的答案），看下图两条曲线不重合；再点 ½ sin x²。然后切到 sin x cos x，三种正确写法都试一遍，读出相差的常数。",
            code="实验 3"),

        section("五", "第二换元：去掉根号", "反过来主动令 x = φ(t)，把根式化成有理式；算完必须代回 x。"),
        definition("第二换元公式",
                   r"<p>令 $x=\varphi(t)$，$\varphi$ 单调可导，则</p>"
                   r"<p>$$\int f(x)\,dx=\int f[\varphi(t)]\varphi'(t)\,dt=G(t)+C=G\bigl(\varphi^{-1}(x)\bigr)+C$$</p>"
                   r"<p>与第一换元是同一个等式，从右往左用。要求单调，是为了能用反函数 $t=\varphi^{-1}(x)$ 代回。</p>",
                   extra="常用于被积函数含根式的情形。1.6 会看到：定积分换元换了上下限就不必代回；不定积分必须代回原变量。",
                   notes="教材思考题 1.5.14 问的就是「为什么要单调」。"),
        derive("例 1.5.17　令 t = √x", [
            (r"\sqrt x=t,\qquad x=t^2,\qquad dx=2t\,dt", "令根式为新变量"),
            (r"\int\frac{dx}{1+\sqrt x}=\int\frac{2t\,dt}{1+t}=2\int\frac{t+1-1}{1+t}dt", r"分子凑出 $1+t$"),
            (r"=2\int\Bigl(1-\frac1{1+t}\Bigr)dt=2t-2\ln|1+t|+C", r"在 $t$ 里积分"),
            (r"=2\sqrt x-2\ln\bigl(1+\sqrt x\bigr)+C", r"代回 $t=\sqrt x$：这一步不能省"),
        ], extra="1.6 的例 1.6.3 是同一个被积函数在 $[1,2]$ 上的定积分：上下限换成 $t$ 的范围，就停在 $t$ 里算完。",
           code="例题"),
        table_page("根式与三角代换",
                   ["被积函数含", "代换", "用到的恒等式", "开出来"],
                   [
                       [r"$\sqrt{a^2-x^2}$", r"$x=a\sin t$", r"$1-\sin^2t=\cos^2t$", r"$a\cos t$"],
                       [r"$\sqrt{x^2+a^2}$", r"$x=a\tan t$", r"$\tan^2t+1=\sec^2t$", r"$a\sec t$"],
                       [r"$\sqrt{x^2-a^2}$", r"$x=a\sec t$", r"$\sec^2t-1=\tan^2t$", r"$a\tan t$"],
                   ],
                   lead_t="目的只有一个：把根号开出来（$a>0$）。算完用直角三角形把 $t$ 代回 $x$。",
                   notes="三角形：由代换式读出两条边，第三条用勾股定理。"),
        derive("例 1.5.18　令 x = a sec t", [
            (r"x=a\sec t,\quad dx=a\sec t\tan t\,dt,\quad\sqrt{x^2-a^2}=a\tan t", r"$\sec^2t-1=\tan^2t$"),
            (r"\int\frac{dx}{\sqrt{x^2-a^2}}=\int\frac{a\sec t\tan t}{a\tan t}dt=\int\sec t\,dt", "根号开出来了"),
            (r"=\ln|\sec t+\tan t|+C_1", "例 1.5.15"),
            (r"=\ln\left|\frac xa+\frac{\sqrt{x^2-a^2}}a\right|+C_1", r"三角形：斜边 $x$，邻边 $a$，对边 $\sqrt{x^2-a^2}$"),
            (r"=\ln\bigl|x+\sqrt{x^2-a^2}\bigr|+C,\qquad C=C_1-\ln a", r"$-\ln a$ 是常数，并进 $C$"),
        ], code="例题",
           notes="用反函数 t=arcsec(x/a) 代回很繁，教材用图 1.50 的直角三角形：sec t = x/a。"),
        derive("例 1.5.19　令 x = a tan t", [
            (r"x=a\tan t,\quad dx=a\sec^2t\,dt,\quad\sqrt{x^2+a^2}=a\sec t", r"$\tan^2t+1=\sec^2t$"),
            (r"\int\frac{dx}{\sqrt{x^2+a^2}}=\int\frac{a\sec^2t}{a\sec t}dt=\int\sec t\,dt", "根号开出来了"),
            (r"=\ln|\sec t+\tan t|+C_1=\ln\left|\frac{\sqrt{x^2+a^2}}a+\frac xa\right|+C_1", r"三角形：邻边 $a$，对边 $x$，斜边 $\sqrt{x^2+a^2}$"),
            (r"=\ln\bigl|x+\sqrt{x^2+a^2}\bigr|+C,\qquad C=C_1-\ln a", "常数合并"),
        ], extra=r"与例 1.5.18 合起来记：$\displaystyle\int\frac{dx}{\sqrt{x^2\pm a^2}}=\ln\bigl|x+\sqrt{x^2\pm a^2}\bigr|+C$。",
           code="例题", notes="对应教材图 1.51。"),
        derive("例 1.5.20　令 x = a sin t", [
            (r"x=a\sin t,\quad dx=a\cos t\,dt,\quad\sqrt{a^2-x^2}=a\cos t", r"取 $|t|\le\frac{\pi}{2}$，$\cos t\ge0$"),
            (r"\int\sqrt{a^2-x^2}\,dx=a^2\int\cos^2t\,dt=a^2\int\frac{1+\cos2t}{2}dt", "降幂"),
            (r"=\frac{a^2}2\Bigl(t+\frac12\sin2t\Bigr)+C=\frac{a^2}2(t+\sin t\cos t)+C", r"$\sin2t=2\sin t\cos t$"),
            (r"=\frac{a^2}2\Bigl(\arcsin\frac xa+\frac xa\cdot\frac{\sqrt{a^2-x^2}}a\Bigr)+C", r"$\sin t=\frac xa$，$\cos t=\frac{\sqrt{a^2-x^2}}a$"),
            (r"=\frac{a^2}2\arcsin\frac xa+\frac x2\sqrt{a^2-x^2}+C", ""),
        ], extra=r"1.6 作业用几何求 $\int_{-2}^{2}\sqrt{4-x^2}\,dx$（半圆面积 $2\pi$）；用本例的原函数（$a=2$）代上下限，也得 $2\pi$。",
           code="例题", notes="对应教材图 1.52。"),
        prompt("课堂练 6　画三角形代回",
               r"计算 $\displaystyle\int\frac{dx}{x^2\sqrt{1+x^2}}$。" "\n"
               r"提示：令 $x=\tan t$；算出 $t$ 的结果后，用右图的三角形把 $t$ 换回 $x$。",
               "约 5 分钟。",
               level="综合", fig="15-tri",
               notes="习题 1.5.7(17)。算到 −1/sin t 后，学生常卡在代回；让他们从图上读 sin t。"),
        answer("课堂练 6", [
            r"$dx=\sec^2t\,dt$，$\sqrt{1+x^2}=\sec t$：原式 $=\displaystyle\int\frac{\sec^2t}{\tan^2t\sec t}dt=\int\frac{\cos t}{\sin^2t}dt$。",
            r"$=\displaystyle\int\frac{d(\sin t)}{\sin^2t}=-\frac1{\sin t}+C$。",
            r"由三角形 $\sin t=\dfrac{x}{\sqrt{1+x^2}}$，原式 $=-\dfrac{\sqrt{1+x^2}}{x}+C$。",
        ], comment="第二换元之后常常还要凑微分；最后一步总是代回 x。"),
        prompt("课堂练 7　选方法",
               r"说出各用什么方法，再算出结果：" "\n"
               r"(1) $\displaystyle\int\frac{x}{\sqrt{1-x^2}}\,dx$　　(2) $\int\sqrt{1-x^2}\,dx$　　(3) $\displaystyle\int\frac{dx}{1+\sqrt[3]{x}}$",
               "约 5 分钟。",
               level="辨析",
               notes="第 (1) 题有根号但不必三角代换：分子正好是里层导数的常数倍。"),
        answer("课堂练 7", [
            r"(1) 凑微分：$x\,dx=-\frac12d(1-x^2)$，原式 $=-\sqrt{1-x^2}+C$。看见根号不一定要三角代换。",
            r"(2) 例 1.5.20 取 $a=1$：$\frac12\arcsin x+\frac x2\sqrt{1-x^2}+C$。",
            r"(3) 令 $t=\sqrt[3]{x}$，$dx=3t^2dt$：$3\int\frac{t^2}{1+t}dt=3\bigl(\frac{t^2}{2}-t+\ln|1+t|\bigr)+C$，代回 $t=\sqrt[3]{x}$。",
        ], comment="先试凑微分；凑不出，再考虑第二换元。"),

        section("六", "分部积分", "乘积的求导法则倒过来：把难求的 ∫u dv 换成好求的 ∫v du。"),
        definition("分部积分公式",
                   r"<p>由 $d(uv)=v\,du+u\,dv$ 两边积分：</p>"
                   r"<p>$$\int u\,dv=uv-\int v\,du\qquad\text{即}\qquad\int uv'\,dx=uv-\int u'v\,dx$$</p>"
                   r"<p>选 $u$、$dv$ 的两条：$v$ 要容易求出；$\int v\,du$ 要比 $\int u\,dv$ 简单。</p>",
                   extra="1.6 的定积分分部用的是同一个公式，只是每一项都带上下限。"),
        derive("两个简单例：多项式降次、对数求导", [
            (r"\int xe^x\,dx=\int x\,d(e^x)=xe^x-\int e^x\,dx=xe^x-e^x+C", r"$u=x$：求导后降成常数"),
            (r"\int x\ln x\,dx=\int\ln x\,d\Bigl(\frac{x^2}2\Bigr)=\frac{x^2}2\ln x-\int\frac{x^2}2\cdot\frac1x\,dx", r"$u=\ln x$：求导后变成 $\frac1x$"),
            (r"=\frac{x^2}2\ln x-\frac{x^2}4+C", ""),
        ], code="例"),
        derive("例 1.5.21　对数当 u", [
            (r"\int x^2\ln x\,dx=\int\ln x\,d\Bigl(\frac13x^3\Bigr)", r"凑微分：把 $x^2dx$ 凑成 $dv$"),
            (r"=\frac13x^3\ln x-\int\frac13x^3\,d(\ln x)", r"公式：$u=\ln x$，$v=\frac13x^3$"),
            (r"=\frac13x^3\ln x-\frac13\int x^3\cdot\frac1x\,dx", r"算出微分 $d(\ln x)=\frac1x\,dx$"),
            (r"=\frac13x^3\ln x-\frac19x^3+C", ""),
        ], code="例题"),
        derive("例 1.5.22　分部两次", [
            (r"\int x^2\sin x\,dx=\int x^2\,d(-\cos x)", r"凑微分：$\sin x\,dx=d(-\cos x)$"),
            (r"=-x^2\cos x+\int 2x\cos x\,dx", r"第一次分部：$u=x^2$"),
            (r"=-x^2\cos x+2\int x\,d(\sin x)", "第二次凑微分，仍让多项式当 $u$"),
            (r"=-x^2\cos x+2\Bigl(x\sin x-\int\sin x\,dx\Bigr)", "第二次分部"),
            (r"=-x^2\cos x+2x\sin x+2\cos x+C", ""),
        ], extra=r"每分部一次，多项式降一次；$x^2$ 要分部两次。",
           code="例题"),
        derive("例 1.5.23　积分转回来了", [
            (r"\int e^x\sin x\,dx=\int\sin x\,d(e^x)=e^x\sin x-\int e^x\cos x\,dx", r"第一次：把 $e^x$ 凑进微分"),
            (r"=e^x\sin x-\int\cos x\,d(e^x)", r"第二次：<b>仍</b>把 $e^x$ 凑进微分"),
            (r"=e^x\sin x-\Bigl(e^x\cos x+\int e^x\sin x\,dx\Bigr)", r"$d(\cos x)=-\sin x\,dx$"),
            (r"2\int e^x\sin x\,dx=e^x(\sin x-\cos x)+C_1", "原积分又出现了：移项"),
            (r"\int e^x\sin x\,dx=\frac{e^x}{2}(\sin x-\cos x)+C", r"两边除以 2，$C=\frac{C_1}2$"),
        ], extra=r"教材的注：式子里还有积分号时可以不写 $C$；积分号一消失，就必须补上 $C$。",
           code="例题"),
        mistake("找错 3　第二次方向反了",
                r"计算 $\int e^x\sin x\,dx$。",
                [r"第一次把 $e^x$ 凑进微分：原式 $=e^x\sin x-\int e^x\cos x\,dx$。",
                 r"第二次改把 $\cos x$ 凑进微分：$\int e^x\cos x\,dx=\int e^x\,d(\sin x)=e^x\sin x-\int e^x\sin x\,dx$。",
                 r"代回：原式 $=e^x\sin x-e^x\sin x+\int e^x\sin x\,dx=\int e^x\sin x\,dx$。"],
                "每一步都没算错，却什么也没算出来。问题在哪？",
                "约 3 分钟。"),
        answer("找错 3", [
            r"第 2 步把凑微分的对象换成了三角函数，等于把第 1 步的分部又撤销了，绕回原题（教材称「恶性循环」）。",
            r"第二次必须与第一次凑同一类：仍把 $e^x$ 凑进微分，才会出现 $-\int e^x\sin x\,dx$，移项求解（例 1.5.23）。",
            r"另一种做法：两次都把三角函数凑进微分，也能得到同样的 $\frac{e^x}{2}(\sin x-\cos x)+C$。",
        ], comment="判断标准：做完两次后，原积分前的系数不能是 +1。"),
        derive("例 1.5.24　只有一个函数：把 dx 当 dv", [
            (r"\int\arctan x\,dx=x\arctan x-\int x\,d(\arctan x)", r"$u=\arctan x$，$dv=dx$，$v=x$"),
            (r"=x\arctan x-\int\frac{x}{1+x^2}dx", "算出微分"),
            (r"=x\arctan x-\frac12\int\frac{d(1+x^2)}{1+x^2}", "凑微分（例 1.5.8）"),
            (r"=x\arctan x-\frac12\ln(1+x^2)+C", ""),
        ], extra=r"同样：$\int\ln x\,dx=x\ln x-\int x\cdot\frac1x\,dx=x\ln x-x+C$。",
           code="例题"),
        table_page("分部积分小结：把谁凑进 dv",
                   ["被积函数", "例", "凑进 dv 的"],
                   [
                       ["幂函数 × 反三角或对数", r"$x^3\arctan x$，$x^3\ln x$", r"幂函数：$\arctan x\,d\bigl(\frac14x^4\bigr)$"],
                       ["幂函数 × 正弦、余弦、指数", r"$x^2\sin x$，$x^2e^x$", r"三角或指数：$x^2\,d(-\cos x)$，$x^2\,d(e^x)$"],
                       ["指数 × 正弦、余弦", r"$e^x\sin x$，$e^x\cos x$", r"哪个都行，两次要一致：$\sin x\,d(e^x)$"],
                   ],
                   lead_t="一般把容易凑的那个凑进 dv；留在 u 里的，求导后要变简单。",
                   notes="口诀「反、对、幂、指、三」：越靠前越适合当 u。仅作参考，选反了就停，换过来再写。"),
        prompt("课堂练 8　选 u",
               r"指出谁当 $u$、谁凑进 $dv$（不必算完）：" "\n"
               r"(1) $\int x\sin x\,dx$　　(2) $\int x^3\ln x\,dx$　　(3) $\int x^2e^x\,dx$",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 8", [
            r"(1) $u=x$，$dv=\sin x\,dx=d(-\cos x)$。结果 $-x\cos x+\sin x+C$。",
            r"(2) $u=\ln x$，$dv=x^3dx=d\bigl(\frac14x^4\bigr)$。结果 $\frac14x^4\ln x-\frac1{16}x^4+C$。",
            r"(3) $u=x^2$，$dv=e^xdx$，要分部两次。结果 $(x^2-2x+2)e^x+C$。",
        ], comment="多项式遇到三角、指数时当 u；遇到对数、反三角时让位。"),
        prompt("课堂练 9",
               r"计算 $\int e^x\cos x\,dx$，并求导验算。",
               "约 4 分钟。照例 1.5.23，两次都把 $e^x$ 凑进微分。",
               level="变式",
               notes="习题 1.5.9(2)。"),
        answer("课堂练 9", [
            r"$\int\cos x\,d(e^x)=e^x\cos x+\int e^x\sin x\,dx=e^x\cos x+\int\sin x\,d(e^x)$。",
            r"$=e^x\cos x+e^x\sin x-\int e^x\cos x\,dx$，移项除以 2。",
            r"$\int e^x\cos x\,dx=\frac{e^x}{2}(\sin x+\cos x)+C$。验算：导数 $\frac{e^x}{2}(\sin x+\cos x+\cos x-\sin x)=e^x\cos x$。",
        ]),

        section("七", "回顾与自测"),
        two_col("比较：不定积分换元 vs 定积分换元",
                ("不定积分（本讲）", ["换元后要代回原变量。", "第二换元：画三角形代回 $x$。", "结果是一族函数，带 $+C$。"]),
                ("定积分（1.6）", ["换元时上下限跟着换。", "在新变量里算完，不必代回。", "结果是一个数，不带 $C$。"]),
                lead_t=r"同一个 $\int\frac{dx}{1+\sqrt x}$：例 1.5.17 代回得 $2\sqrt x-2\ln(1+\sqrt x)+C$；1.6 的例 1.6.3 换限后直接得数。"),
        table_page("公式表（续）：例题得到的八条",
                   ["公式", "出处"],
                   [
                       [r"$\int\tan x\,dx=-\ln|\cos x|+C$，$\int\cot x\,dx=\ln|\sin x|+C$", "例 1.5.11"],
                       [r"$\int\frac{dx}{x^2+a^2}=\frac1a\arctan\frac xa+C$", "例 1.5.12"],
                       [r"$\int\frac{dx}{x^2-a^2}=\frac1{2a}\ln\left|\frac{x-a}{x+a}\right|+C$", "例 1.5.14"],
                       [r"$\int\frac{dx}{\sqrt{x^2\pm a^2}}=\ln\bigl|x+\sqrt{x^2\pm a^2}\bigr|+C$", "例 1.5.18、1.5.19"],
                       [r"$\int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac xa+C$", "例 1.5.13"],
                       [r"$\int\sec x\,dx=\ln|\sec x+\tan x|+C$，$\int\csc x\,dx=\ln|\csc x-\cot x|+C$", "例 1.5.15、1.5.16"],
                   ],
                   lead_t="教材公式（14）—（21），$a>0$。连同前面的（1）—（13），是本讲全部基本公式。"),
        culture("「求导是一门手艺，积分是一门艺术。」——数学界流传的说法",
                r"初等函数求导，按法则总能算出初等函数；积分却不然。$e^{-x^2}$、$\frac{\sin x}{x}$ 的原函数存在（1.6 的变上限积分就是），却写不成有限个初等函数的组合——19 世纪法国数学家刘维尔给出了判断这类问题的方法。统计学里的正态分布要查表，正是因为 $\int e^{-x^2/2}dx$ 没有初等公式。",
                title="文化卡片 · 积不出来的积分"),
        summary(
            ["不定积分 = 一个原函数 + C；验算永远是求导。",
             "形式不同的答案，只要求导相同，就只差一个常数。",
             "凑微分：认出里层，补齐常数；第二换元：去根号，画三角形代回。",
             "分部：留在 u 里的求导变简单；积分转回来就移项。"],
            ["漏写 +C，或把 +C 带进定积分的数值。",
             "换元只换被积式，忘了换 dx。",
             "乘积、商拆开分别积分。",
             "第二次分部换了方向，绕回原题。"],
        ),
        quiz("15", notes="题目来自本讲题库，每轮随机抽 6 题。课后让学生用手机打开本页自测。"),
        homework(
            [r"$\int(3x^2-1)\,dx$，$\int\frac{x^2}{1+x^2}dx$（分出整式），每题求导验算。",
             r"凑微分：$\int x\sqrt{1+x^2}\,dx$，$\int\frac{\sin\ln x}{x}dx$。",
             r"第二换元：$\int\frac{dx}{1+\sqrt{2x}}$。",
             r"分部：$\int x\cos x\,dx$，$\int x^2e^{-x}dx$。"],
            [r"* $\int\sqrt{x^2+1}\,dx$ 或 $\int\ln(1+x^2)\,dx$ 选一，做完求导验算。",
             r"* 说明为何 $\int\frac{dx}{x}=\ln|x|+C$ 要加绝对值，而 $\int\frac{x\,dx}{1+x^2}=\frac12\ln(1+x^2)+C$ 不必。"],
            "下一讲 1.6：定积分是加密求和；牛顿–莱布尼茨公式用本讲的原函数算出那个数。",
        ),
    ]
