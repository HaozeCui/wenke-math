"""1.3 导数与微分。按「平均→定义→公式→法则→微分→分段→回顾」七节组织。"""
from chrome import (
    cover, objectives, bullets, two_col, cards3, definition, prompt, answer,
    lab, culture, summary, homework, derive, mistake, section, route, quiz,
    table_page, formula_page, page, h2,
)
from panels import P

FILENAME, TITLE, H1 = "13.html", "1.3 导数与微分 · 文科高等数学", "1.3 导数与微分"
LABS = ["13-deriv.js", "extra.js"]


def slides():
    return [
        cover("1.3　建议 6 学时", "割线躺平，<br />就是切线",
              "导数是差商的极限：瞬时变化率。本讲看 h 变小，割线贴住抛物线；再看尖点与分段点——连续也可以没有切线。",
              "配套《文科数学基础》　·　割线 · 基本公式 · 链式 · 微分 · 分段点",
              notes="先几何，再公式；分段点用定义，不要套公式硬推。"),
        objectives([
            "能用差商解释导数，认出切线斜率，并说明平均变化率与瞬时变化率的差别。",
            "能使用基本求导公式与一次链式法则做课堂级计算，会把导数写成微分。",
            "能说明连续不必可导：尖点与分段点要查左右导数是否相等。",
            "能求简单的高阶导数，并认出加速度是位移的二阶导数。",
        ]),
        route(notes="路线由下面七个分节自动生成。"),

        # ─── 一 ───────────────────────────────────────────────
        section("一", "问题：从平均到瞬时", "一段时间里的平均速度，怎样变成某一瞬间的速度？"),
        two_col("为什么需要差商的极限",
                ("平均变化率", [
                    r"从 $x_0$ 到 $x_0+\Delta x$，函数改变了 $\Delta y$。",
                    r"比值 $\dfrac{\Delta y}{\Delta x}$ 是这段上的平均变化率。",
                    "图像上：割线的斜率。",
                ]),
                ("瞬时变化率", [
                    r"让 $\Delta x\to 0$，割线躺平到切线。",
                    "极限若存在，就叫该点的导数。",
                    "运动：瞬时速度；经济：边际。",
                ]),
                lead_t="同样的问题：人口增长率、词频的瞬时变化、边际成本——都是「加密后的差商」。"),
        cards3("导数的三张面孔", [
            ("几何", "切线斜率。割线加密后的极限位置。"),
            ("运动", r"位移 $s(t)$ 的导数是瞬时速度；速度再导是加速度。"),
            ("变化率", "边际成本、边际产量；密度沿公路的瞬时变化。"),
        ]),
        prompt("课堂练 1",
               r"已知 $s(t)=t^2$（米，秒）。" "\n"
               r"(1) 求 $t=3$ 时的瞬时速度；" "\n"
               r"(2) 求 $2$ 到 $3$ 秒的平均速度；" "\n"
               r"(3) 二者差在哪里？",
               "约 3 分钟。",
               level="基础"),
        answer("课堂练 1", [
            r"$s'=2t$，$t=3$ 时瞬时速度 $6$ 米/秒。",
            r"平均速度 $(9-4)/1=5$ 米/秒。",
            r"平均是割线（$\Delta t=1$），瞬时是切线（$\Delta t\to 0$）。对照下一节实验。",
        ], comment="先用运动说清「平均 ≠ 瞬时」，再进定义。"),

        # ─── 二 ───────────────────────────────────────────────
        section("二", "定义：差商的极限", "四步：算新值 → 算增量 → 写差商 → 取极限。"),
        definition("导数",
                   r"<p>函数 $y=f(x)$ 在 $x_0$ 的导数是</p>"
                   r"<p>$$f'(x_0)=\lim_{\Delta x\to 0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}$$</p>"
                   r"<p>几何：切线斜率。极限存在才说该点可导。</p>",
                   extra=r"也常写成 $f'(x_0)=\lim_{h\to 0}\dfrac{f(x_0+h)-f(x_0)}{h}$。$h=0$ 使分母为 0，所以永远是极限，不是代入。",
                   notes="投影读定义，下一页用实验看 h 变小。"),
        lab("把 h 拉小，割线贴住切线", "secant", "secant-canvas", P["secant"],
            notes="x=1，f=x²，真导数 2。先大 h 问斜率几，再拉小。",
            code="实验 1"),
        bullets("读完实验要留下的句子", [
            r"差商是割线；极限存在才有切线。",
            r"$h$ 可正可负：左右逼近必须给出同一个数。",
            "可导 ⇒ 连续（有切线就不能断开）；反过来不成立。",
        ]),
        derive("例 1.3.1　常数的导数", [
            (r"y=c\quad\text{（常数函数）}", r"任意 $\Delta x$，$f(x+\Delta x)=c$"),
            (r"\Delta y=c-c=0", "增量恒为 0"),
            (r"\frac{\Delta y}{\Delta x}=0\to 0", r"差商恒 0，极限是 0"),
            (r"(c)'=0", "常数的变化率为 0"),
        ], code="例题"),
        derive("例 1.3.2　幂函数 $x^n$（正整数）", [
            (r"y=x^n", r"二项式展开 $(x+\Delta x)^n$"),
            (r"(x+\Delta x)^n=x^n+nx^{n-1}\Delta x+\cdots+(\Delta x)^n", r"含 $(\Delta x)^2$ 及以上的项"),
            (r"\frac{\Delta y}{\Delta x}=nx^{n-1}+\text{含 }\Delta x\text{ 的项}", r"除以 $\Delta x$"),
            (r"(x^n)'=nx^{n-1}", r"$\Delta x\to 0$ 后只剩首项；特别地 $(x)'=1$"),
        ], code="例题"),
        derive("例 1.3.3　$y=x^3$ 在 $(2,8)$ 的切线", [
            (r"y'=3x^2,\qquad y'(2)=12", r"用例 1.3.2，$n=3$"),
            (r"y-8=12(x-2)", "点斜式"),
            (r"12x-y-16=0", "整理"),
            (r"\text{切线还与曲线交于 }(-4,-64)", r"「只交一次」只适合圆；一般曲线切线可再交"),
        ], extra=r"解 $x^3-(12x-16)=0$ 得 $x=2$（二重）与 $x=-4$。",
           code="例题"),
        prompt("课堂练 2",
               r"用定义求 $f(x)=x^2$ 在 $x=1$ 的导数。" "\n"
               r"写出差商并取极限。",
               "约 3 分钟。",
               level="基础"),
        answer("课堂练 2", [
            r"差商 $\dfrac{(1+h)^2-1}{h}=\dfrac{2h+h^2}{h}=2+h$。",
            r"$h\to 0$ 得 $f'(1)=2$。与实验 1 的切线斜率一致。",
        ], comment="定义会算一个多项式就够；后面大量靠公式。"),
        two_col("可导与连续",
                ("可导 ⇒ 连续", ["有切线的点，图像不能断开。", "这是单向箭头。"]),
                ("连续 ⇏ 可导", [r"$|x|$ 在 $0$：连着，但尖。", "分段的折点都要单独用左右导数检查。"])),

        # ─── 三 ───────────────────────────────────────────────
        section("三", "基本求导公式", "先背表，再会推几条；课堂计算主要靠表。"),
        table_page("基本公式（一）",
                   ["函数", "导数", "提醒"],
                   [
                       [r"$c$，$x^n$", r"$0$，$n x^{n-1}$", r"$n$ 可以是实数（见例 1.3.13）"],
                       [r"$\sin x$，$\cos x$", r"$\cos x$，$-\sin x$", "自变量用弧度"],
                       [r"$e^x$，$\ln x$", r"$e^x$，$1/x$", r"对数真数 $\gt 0$"],
                       [r"$a^x$，$\log_a x$", r"$a^x\ln a$，$\dfrac{1}{x\ln a}$", r"不要把 $a^x$ 写成 $x a^{x-1}$"],
                   ],
                   notes="投影读表；推导选做。"),
        derive("例 1.3.4　正弦与余弦", [
            (r"(\sin x)'=\cos x", r"用定义 + 三角极限 $\dfrac{\sin h}{h}\to 1$"),
            (r"(\cos x)'=-\sin x", "同理；或由 $(\sin(x+\pi/2))'=\cos(x+\pi/2)$"),
        ], code="例题"),
        derive("例 1.3.5–1.3.6　对数与指数", [
            (r"(\log_a x)'=\frac{1}{x\ln a}", r"换底公式 $\log_a x=\dfrac{\ln x}{\ln a}$"),
            (r"(\ln x)'=\frac{1}{x}", r"$a=e$ 的特例"),
            (r"(a^x)'=a^x\ln a", r"写成 $e^{x\ln a}$ 再链式"),
            (r"(e^x)'=e^x", r"$\ln e=1$"),
        ], code="例题"),
        table_page("基本公式（二）· 三角与反三角",
                   ["导数", "微分"],
                   [
                       [r"$(\tan x)'=\sec^2 x$", r"$d\tan x=\sec^2 x\,dx$"],
                       [r"$(\cot x)'=-\csc^2 x$", r"$d\cot x=-\csc^2 x\,dx$"],
                       [r"$(\sec x)'=\sec x\tan x$", r"$d\sec x=\sec x\tan x\,dx$"],
                       [r"$(\csc x)'=-\csc x\cot x$", r"$d\csc x=-\csc x\cot x\,dx$"],
                       [r"$(\arcsin x)'=\dfrac{1}{\sqrt{1-x^2}}$", r"$d\arcsin x=\dfrac{dx}{\sqrt{1-x^2}}$"],
                       [r"$(\arctan x)'=\dfrac{1}{1+x^2}$", r"$d\arctan x=\dfrac{dx}{1+x^2}$"],
                   ],
                   lead_t=r"另有 $(\arccos x)'=-\dfrac{1}{\sqrt{1-x^2}}$，$(\mathrm{arccot}\,x)'=-\dfrac{1}{1+x^2}$。"),
        derive(r"例 1.3.7　$(\tan x)'$（商法则预告）", [
            (r"\tan x=\frac{\sin x}{\cos x}", "写成商"),
            (r"(\tan x)'=\frac{\cos x\cdot\cos x-\sin x(-\sin x)}{\cos^2 x}", "商法则：分子交叉减"),
            (r"=\frac{\cos^2 x+\sin^2 x}{\cos^2 x}=\sec^2 x", r"同理 $(\cot x)'=-\csc^2 x$"),
        ], code="例题"),
        derive("例 1.3.8　$(\sec x)'$", [
            (r"\sec x=\frac{1}{\cos x}", "写成商"),
            (r"(\sec x)'=\frac{0\cdot\cos x-1\cdot(-\sin x)}{\cos^2 x}", "商法则"),
            (r"=\frac{\sin x}{\cos^2 x}=\sec x\tan x", r"同理 $(\csc x)'=-\csc x\cot x$"),
        ], code="例题"),
        prompt("课堂练 3",
               r"不查表，写出下列导数：" "\n"
               r"(1) $(x^5)'$　(2) $(\cos x)'$　(3) $(e^x)'$　(4) $(\ln x)'$",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 3", [
            r"(1) $5x^4$；(2) $-\sin x$；(3) $e^x$；(4) $1/x$。",
            r"易错：把 $(e^x)'$ 写成 $x e^{x-1}$——那是幂函数的规则。",
        ]),

        # ─── 四 ───────────────────────────────────────────────
        section("四", "四则运算与链式法则", "和差积商 + 外层乘里层。复合几层就乘几次。"),
        cards3("运算法则", [
            ("四则", r"$(uv)'=u'v+uv'$。商：$\bigl(\frac{u}{v}\bigr)'=\frac{u'v-uv'}{v^2}$。"),
            ("链式", r"$\dfrac{dz}{dx}=\dfrac{dz}{dy}\cdot\dfrac{dy}{dx}$：外层导数 × 里层导数。"),
            ("心中有数", "熟练后中间变量不必写出，但层次不能乱。"),
        ]),
        derive("例 1.3.9　乘积法则", [
            (r"y=(1+4x)(2x^2-3x^3)", "两项相乘"),
            (r"y'=4(2x^2-3x^3)+(1+4x)(4x-9x^2)", r"$(uv)'=u'v+uv'$"),
            (r"=4x+15x^2-48x^3", "展开合并；也可先展开再逐项导，结果相同"),
        ], code="例题"),
        derive("例 1.3.10　积的另一例", [
            (r"y=(x+\sin x)\ln x", r"$u=x+\sin x$，$v=\ln x$"),
            (r"y'=(1+\cos x)\ln x+(x+\sin x)\cdot\frac{1}{x}", "乘积法则"),
            (r"=\ln x+\cos x\ln x+1+\frac{\sin x}{x}", "整理"),
        ], code="例题"),
        derive("例 1.3.11　$y=\sin 5x$", [
            (r"u=5x,\quad y=\sin u", "一层复合"),
            (r"y'=\cos u\cdot 5=5\cos 5x", r"$\dfrac{dy}{du}\cdot\dfrac{du}{dx}$"),
        ], code="例题"),
        derive("例 1.3.12　$y=\ln\cos x$", [
            (r"u=\cos x,\quad y=\ln u", "外层 ln，里层 cos"),
            (r"y'=\frac{1}{u}\cdot(-\sin x)=-\tan x", r"$\dfrac{1}{\cos x}\cdot(-\sin x)$"),
        ], code="例题"),
        derive("例 1.3.13　任意实数幂 $x^m$", [
            (r"y=x^m=e^{m\ln x}", r"$x\gt 0$；写成指数"),
            (r"y'=e^{m\ln x}\cdot\frac{m}{x}=\frac{m}{x}x^m=mx^{m-1}", "链式；与正整数时一致"),
        ], code="例题"),
        derive("例 1.3.14　$y=\ln(x+\sqrt{x^2+1})$", [
            (r"y'=\frac{1}{x+\sqrt{x^2+1}}\cdot\bigl(1+(\sqrt{x^2+1})'\bigr)", "外层 ln"),
            (r"(\sqrt{x^2+1})'=\frac{x}{\sqrt{x^2+1}}", r"再套一次链式"),
            (r"y'=\frac{1}{x+\sqrt{x^2+1}}\Bigl(1+\frac{x}{\sqrt{x^2+1}}\Bigr)=\frac{1}{\sqrt{x^2+1}}", "通分化简"),
        ], code="例题"),
        derive("例 1.3.15　$y=e^{\sin^2 x}$", [
            (r"y'=e^{\sin^2 x}\cdot(\sin^2 x)'", "外层指数"),
            (r"(\sin^2 x)'=2\sin x\cos x=\sin 2x", "里层再链式"),
            (r"y'=e^{\sin^2 x}\sin 2x", "乘在一起"),
        ], code="例题"),
        prompt("课堂练 4",
               r"求导数（只要链式一次）：" "\n"
               r"(1) $y=(3x^2+1)^5$" "\n"
               r"(2) $y=e^{\sin x}$" "\n"
               r"(3) $y=\ln(3x+1)$（$x\gt -1/3$）",
               "约 4 分钟。",
               level="变式"),
        answer("课堂练 4", [
            r"(1) $5(3x^2+1)^4\cdot 6x=30x(3x^2+1)^4$。",
            r"(2) $e^{\sin x}\cdot\cos x$。",
            r"(3) $\dfrac{3}{3x+1}$。先认外层，再乘里层；不要先展开括号。",
        ]),
        mistake("找错 1　把指数当幂函数",
                r"求 $y=e^{2x}$ 的导数。",
                [r"外面是「某种幂」，套 $(x^n)'=nx^{n-1}$。",
                 r"于是 $y'=2x\cdot e^{2x-1}$。"],
                "哪一步错了？正确答案是多少？",
                "约 2 分钟。"),
        answer("找错 1", [
            r"第 1 步错。$e^{2x}$ 是指数函数的复合，不是幂函数 $x^n$。",
            r"正确：外层 $(e^u)'=e^u$，里层 $u=2x$，故 $y'=e^{2x}\cdot 2=2e^{2x}$。",
            r"验算：也可写成 $y=(e^2)^x$，得 $y'=(e^2)^x\ln(e^2)=e^{2x}\cdot 2$。",
        ], comment="底为 e、指数里有 x：永远先想链式，不要降次。"),
        derive(r"例 1.3.17　综合：$y=3/x^4+\arctan e^x$", [
            (r"y=3x^{-4}+\arctan e^x", "改写幂"),
            (r"y'=3(-4)x^{-5}+\frac{1}{1+(e^x)^2}\cdot e^x", "逐项 + 链式"),
            (r"=-\frac{12}{x^5}+\frac{e^x}{1+e^{2x}}", "整理"),
        ], code="例题"),
        page(
            h2("商与链式再看三题")
            + """
<div class="grid-3" style="flex:1;min-height:0">
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>$(\\tan x)'=\\sec^2 x$</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="qc-tan"></canvas></div>
    <p>斜率恒为正，靠近渐近线更陡。</p>
  </div>
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>$(\\ln\\cos x)'=-\\tan x$</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="qc-ln"></canvas></div>
    <p>外层 ln，里层 cos，右侧斜率为负。</p>
  </div>
  <div class="card" style="display:flex;flex-direction:column;min-height:0">
    <h3>$(\\sin 5x)'=5\\cos 5x$</h3>
    <div class="plot-wrap" style="min-height:0;flex:1"><canvas id="qc-sin"></canvas></div>
    <p>虚线斜率 1，金色切线斜率 5。</p>
  </div>
</div>""",
            title="商与链式再看三题",
            hook="quotchain",
            notes="对照例 1.3.7、1.3.12、1.3.11。",
        ),

        # ─── 五 ───────────────────────────────────────────────
        section("五", "微分：增量的线性近似", "会求导就会写微分，只是多乘一个 dx。"),
        definition("微分",
                   r"<p>增量 $\Delta y=f(x_0+\Delta x)-f(x_0)$。微分是它的线性主部：</p>"
                   r"<p>$$dy=f'(x_0)\,dx$$</p>"
                   r"<p>$\Delta x$ 很小时 $\Delta y\approx dy$。</p>",
                   extra=r"四则：$d(u\pm v)=du\pm dv$，$d(uv)=v\,du+u\,dv$，$d(u/v)=(v\,du-u\,dv)/v^2$。",
                   notes="强调：微分不是新运算，是导数的另一种写法加近似。"),
        formula_page("用微分做一次近似",
                     r"\sqrt{4.01}\approx 2+\frac{1}{4}\times 0.01=2.0025",
                     extra=r"取 $f(x)=\sqrt{x}$，$f'(x)=1/(2\sqrt{x})$。在 $x=4$ 处 $dy=f'(4)\,dx$。$dx=0.01$ 很小时，增量用线性主部代替。真值 $\sqrt{4.01}\approx 2.002498$。"),
        lab("dx 越小，切线越贴住曲线", "approx", "ap-canvas", P["approx"],
            notes="先停在 dx=1，问误差大不大。再拉小。",
            code="实验 2"),
        derive(r"例 1.3.16　求 $y=\arcsin\sqrt{1-x^2}$ 的微分", [
            (r"dy=\frac{1}{\sqrt{1-(1-x^2)}}\,d\sqrt{1-x^2}", r"外层 $\arcsin$"),
            (r"=\frac{1}{|x|}\cdot\frac{1}{2\sqrt{1-x^2}}\cdot(-2x)\,dx", r"$\sqrt{x^2}=|x|$"),
            (r"dy=-\frac{\mathrm{sgn}\,x}{\sqrt{1-x^2}}\,dx", r"$\mathrm{sgn}\,x$ 为符号函数"),
        ], extra=r"$\mathrm{sgn}\,x=1$（$x\gt 0$），$0$（$x=0$），$-1$（$x\lt 0$）。",
           code="例题"),
        prompt("课堂练 5",
               r"用微分近似 $\sqrt{9.02}$。" "\n"
               r"取 $f(x)=\sqrt{x}$，在 $x=9$ 处展开。",
               "约 3 分钟。",
               level="应用"),
        answer("课堂练 5", [
            r"$f'(x)=1/(2\sqrt{x})$，$f'(9)=1/6$。",
            r"$dx=0.02$，故 $\sqrt{9.02}\approx 3+\dfrac{1}{6}\times 0.02=3.003\overline{3}$。",
        ], comment="选靠近、好算的点当展开中心。"),
        prompt("课堂练 6　边际成本",
               r"成本 $C(x)=100+2x+\dfrac{1}{100}x^2$（件）。" "\n"
               r"(1) 求边际成本 $C'(x)$；" "\n"
               r"(2) 用 $C'(100)$ 估计第 101 件的成本增量；" "\n"
               r"(3) 与真增量 $C(101)-C(100)$ 比较。",
               "约 4 分钟。",
               level="应用"),
        answer("课堂练 6", [
            r"$C'(x)=2+\dfrac{x}{50}$，$C'(100)=4$。",
            r"估计增量约 $4$。",
            r"真增量 $C(101)-C(100)=4.01$。微分近似只差 $0.01$。",
        ], comment="边际 ≈ 再多一件的成本；微分就是这件事。"),

        # ─── 六 ───────────────────────────────────────────────
        section("六", "高阶导数与分段点", "再导一次是二阶；分段点必须回到左右差商。"),
        definition("高阶导数",
                   r"<p>二阶导数 $y''=(y')'$，也记 $\dfrac{d^2y}{dx^2}$。</p>"
                   r"<p>$n$ 阶：$y^{(n)}=(y^{(n-1)})'$。</p>"
                   r"<p>若 $s=s(t)$ 是路程，则 $s'=v$ 是速度，$s''=a$ 是加速度。</p>",
                   notes="记号即可；繁琐高阶计算不做要求。"),
        derive("例 1.3.18　$(\sin x)$ 的 $n$ 阶导数", [
            (r"(\sin x)'=\cos x=\sin\bigl(x+\tfrac{\pi}{2}\bigr)", "导一次，相位加 π/2"),
            (r"(\sin x)''=\cos\bigl(x+\tfrac{\pi}{2}\bigr)=\sin(x+\pi)", "再导一次"),
            (r"(\sin x)^{(n)}=\sin\bigl(x+n\tfrac{\pi}{2}\bigr)", "归纳"),
        ], code="例题"),
        derive(r"例 1.3.20　$y=\arctan x$ 的二阶导数", [
            (r"y'=\frac{1}{1+x^2}=(1+x^2)^{-1}", "一阶"),
            (r"y''=-(1+x^2)^{-2}\cdot 2x=-\frac{2x}{(1+x^2)^2}", "链式"),
        ], code="例题"),
        bullets("例 1.3.19　运动学接口", [
            r"路程 $s(t)$ → 速度 $v=s'$ → 加速度 $a=v'=s''$。",
            "后面极值判别会用二阶：$f''\gt 0$ 谷，$f''\lt 0$ 峰。",
            "本讲只要求会求到二阶、认出记号。",
        ]),
        lab("尖点：左右差商不是同一个数", "corner", "corner-canvas", P["corner"],
            notes="从左侧拖到 0 再拖到右侧。强调连续与可导不是一回事。",
            code="实验 3"),
        definition("左右导数",
                   r"<p>左导数 $f'_-(x_0)=\lim_{h\to 0^-}\dfrac{f(x_0+h)-f(x_0)}{h}$，右导数把 $h\to 0^+$。</p>"
                   r"<p>$f'(x_0)$ 存在 ⟺ 左右导数都存在并且相等。</p>",
                   extra="连续只说明函数值接上了；可导还要求左右切线斜率一致。",
                   notes="分段点判定的唯一可靠办法。"),
        derive("例 1.3.21　连续但不可导", [
            (r"f(x)=\begin{cases}e^{x},& x\le 0\\ x^{2}+1,& x\gt 0\end{cases}", r"先查 $x=0$ 连续"),
            (r"\lim_{x\to 0^-}f=\lim_{x\to 0^+}f=f(0)=1", "左右极限与函数值相同 → 连续"),
            (r"f'_-(0)=\lim_{h\to 0^-}\frac{e^h-1}{h}=1", "左差商"),
            (r"f'_+(0)=\lim_{h\to 0^+}\frac{h^2}{h}=0", "右差商"),
            (r"1\neq 0\ \Rightarrow\ f'(0)\text{ 不存在}", "连续⇏可导"),
        ], code="例题"),
        derive("例 1.3.22　分段也可以可导", [
            (r"f(x)=\begin{cases}-x,& x\le 0\\ \ln(x+1)-2\sin x,& x\gt 0\end{cases}", r"在 $x=0$ 查左右导数"),
            (r"f'_-(0)=\lim_{h\to 0^-}\frac{-h-0}{h}=-1", "左：差商恒为 −1"),
            (r"f'_+(0)=\lim_{h\to 0^+}\Bigl(\frac{\ln(1+h)}{h}-2\frac{\sin h}{h}\Bigr)=1-2=-1", "右：用两个标准极限"),
            (r"f'_-(0)=f'_+(0)=-1\ \Rightarrow\ f'(0)=-1", "公式换了，仍可能可导"),
        ], code="例题"),
        prompt("课堂练 7",
               r"判断 $g(x)=|x|$ 在 $x=0$ 是否可导。" "\n"
               r"写出左右差商。",
               "约 2 分钟。",
               level="基础"),
        answer("课堂练 7", [
            r"右差商：$\dfrac{|h|}{h}=1$（$h\gt 0$）；左差商：$\dfrac{|h|}{h}=-1$（$h\lt 0$）。",
            "左右极限不同 → 不可导。连续（折线连着）但尖。",
        ], comment="与实验 3、例 1.3.21 同一逻辑。"),
        mistake("找错 2　分段点只看公式、不看差商",
                r"设 $f(x)=x$（$x\lt 0$），$f(x)=x^2$（$x\ge 0$）。有人说：",
                [r"左边公式导数是 $1$，右边公式导数是 $2x$，在 $0$ 处是 $0$。",
                 r"$1\neq 0$，所以不可导。",
                 r"结论碰巧对了，但理由不完整。"],
                "正确的判定步骤应写成什么？左右导数各是多少？",
                "约 3 分钟。"),
        answer("找错 2", [
            r"分段点不能直接「代入两侧公式」了事，应写左右差商的极限。",
            r"左：$f'_-(0)=\lim_{h\to 0^-}h/h=1$；右：$f'_+(0)=\lim_{h\to 0^+}h^2/h=0$。",
            r"确实 $1\neq 0$，不可导。例 1.3.22 说明：两侧公式不同，仍可能左右导数相等。",
        ], comment="例 1.3.21 / 1.3.22 的对比是本讲核心。"),
        prompt("课堂练 8",
               r"讨论 $f(x)=\begin{cases}x+1,& x\lt 0\\ 1,& x\ge 0\end{cases}$" "\n"
               r"在 $x=0$ 的连续性与可导性。",
               "约 3 分钟。",
               level="综合"),
        answer("课堂练 8", [
            r"$f(0)=1$，左右极限都是 1 → 连续。",
            r"左导数 $1$，右导数 $0$ → 不可导。点 $(0,1)$ 有两条半切线。",
        ]),
        prompt("课堂练 9　辨析",
               r"判断正误：" "\n"
               r"(1) 函数在一点连续，则在该点可导。" "\n"
               r"(2) 导数就是「把 n 降一次」。" "\n"
               r"(3) 分段点两侧解析式不同，则该点一定不可导。",
               "约 2 分钟。",
               level="辨析"),
        answer("课堂练 9", [
            r"(1) 错。反例 $|x|$ 或例 1.3.21。",
            r"(2) 错。那只是幂函数；指数、正弦都不降次。",
            r"(3) 错。例 1.3.22 两侧不同，但 $f'(0)=-1$ 存在。",
        ]),

        # ─── 七 ───────────────────────────────────────────────
        section("七", "回顾与自测"),
        two_col("比较：导数 vs 微分",
                ("导数", [r"$f'(x_0)$ 是一个数（该点斜率）。", "定义是差商的极限。"]),
                ("微分", [r"$dy=f'(x_0)\,dx$ 是线性主部。", r"用于近似：$\Delta y\approx dy$。"]),
                lead_t="会求导就会写微分；近似好坏取决于 dx 是否够小。"),
        culture("无穷小既不是 0 又可以丢掉——贝克莱的质问逼出了严谨的极限语言。",
                "牛顿用「流数」算 $x^3$ 的导数时，先假定增量非零以便除法，再令增量为零丢掉高阶项。贝克莱讥为「消失量的鬼魂」。马克思从辩证角度分析「既是又不是」，柯西用极限定义收束危机。本讲用极限定义导数，正是对那次危机的回答。",
                title="文化卡片 · 第二次数学危机"),
        summary(
            ["导数是差商的极限：切线斜率、瞬时变化率。",
             "基本公式 + 四则 + 链式，覆盖课堂计算。",
             "微分 = 导数 × dx，用于线性近似。",
             "连续不必可导：分段点查左右导数。"],
            ["把不可导说成不连续。",
             "把 $e^{u(x)}$ 当成幂函数降次。",
             "分段点只套两侧公式，不写差商。",
             "h=0 直接代入差商。"],
        ),
        quiz("13", notes="题目来自本讲题库，每轮随机抽 6 题。课后让学生用手机打开本页自测。"),
        homework(
            [r"用定义求 $f(x)=3x+1$ 在任意点的导数（应得常数 3）。",
             r"求 $y=\sin(2x)$、$y=\ln(x^2+1)$ 的导数。",
             r"用微分近似 $\sqrt{4.01}$，并与真值比较。",
             r"讨论例 1.3.21 型分段函数在分界点的连续性与可导性（可自拟左右两段）。"],
            [r"* 求 $y=\arcsin\sqrt{1-x^2}$ 的微分（对照例 1.3.16）。",
             r"* 说明为何差分软件里「很小的 h」不能真的取 0。"],
            "下一讲 1.4：升降、极值、圆桶最省料、洛必达先看型。",
        ),
    ]
