"""1.5 不定积分（压缩讲义）。"""
from chrome import (
    cover, objectives, bullets, two_col, cards3, definition, prompt, answer,
    lab, culture, summary, homework, table_page, formula_page, skip_note, page, h2, lead, num,
)
from panels import P

FILENAME, TITLE, H1 = "15.html", "1.5 不定积分 · 文科高等数学", "1.5 不定积分"
LABS = ["15-family.js"]


def ex(title, body, notes="", spare=False):
    badge = skip_note() if spare else num("例")
    inner = badge + h2(title) + f'<div class="card">{body}</div>'
    return page(inner, title=title, notes=notes, kind="meta" if spare else "")


def slides():
    return [
        cover("1.5　建议 6 学时", "原函数是一族，<br />差一个常数",
              "原函数不是一条曲线，而是上下平移的一族。本讲看 +C 怎样平移，再练换元与分部。",
              "实验：+C 族　·　换元与分部",
              notes="不要把整堂课上成积分表竞赛。"),
        objectives([
            "能说明不定积分是原函数族，差一个任意常数 C。",
            "能用第一换元处理「复合的里层刚好差一个常数因子」。",
            "能对简单乘积选用分部积分，并指出谁应为 u。",
        ]),
        bullets("本讲怎么压缩", [
            "一张实验：x²+C 上下平移，求导后都回到 2x。",
            "基本公式表静态。",
            "第一换元 4 例，分页静态。",
            "分部 2 例，分页静态。",
            "其余操练标「备用、可跳」。",
            "不要把 1.6 的定积分黎曼和提前到这里。",
        ], kind="meta"),
        definition("原函数与不定积分",
                   r"<p>若 $F'=f$，称 $F$ 是 $f$ 的一个原函数。全体原函数写作</p>"
                   r"<p>$$\int f(x)\,dx=F(x)+C$$</p>"
                   r"<p>$C$ 是任意常数。求导是「验算」：$(F+C)'=f$。</p>",
                   extra="定积分是一个数；不定积分是一族函数。不要把 +C 带到 1.6 的上下限计算里。"),
        lab("平移整族曲线，导数仍是 2x", "family", "family-canvas", P["family"],
            notes="浅色是其他 C。拖滑条只改当前这条。问：切线斜率变了没有？",
            code="实验"),
        table_page("基本公式",
                   ["被积函数", "不定积分", "验算"],
                   [
                       [r"$x^n\ (n\neq-1)$", r"$x^{n+1}/(n+1)+C$", "降次回去"],
                       [r"$1/x$", r"$\ln|x|+C$", "绝对值"],
                       [r"$e^x$，$\sin x$，$\cos x$", r"$e^x$，$-\cos x$，$\sin x$", "常用"],
                       [r"$1/(1+x^2)$", r"$\arctan x+C$", "反三角只留这一个"],
                   ],
                   lead_t="先猜后验：对了再写 +C。"),
        two_col("第一换元：想什么",
                ("看到", ["复合函数 × 里层导数（差个常数也行）。", r"$\sin x\cos x$，$\quad 2x e^{x^2}$。"]),
                ("做法", [r"令 $u$ 为里层。", r"$du=u'\,dx$，凑系数。", "换成 $u$ 的基本积分，再代回。"]),
                notes="口诀：认复合，凑微分。"),
        ex("第一换元 例 1",
           r"<p>$$\int \sin x\cos x\,dx$$</p>"
           r"<p>令 $u=\sin x$，则 $du=\cos x\,dx$。</p>"
           r"<p>$$\int u\,du=u^2/2+C=\sin^2 x/2+C$$</p>"
           r"<p>也可以令 $u=\cos x$，差一个符号，+C 把两族并成同一族。</p>"),
        ex("第一换元 例 2",
           r"<p>$$\int 2x e^{x^2}\,dx$$</p>"
           r"<p>令 $u=x^2$，$du=2x\,dx$。</p>"
           r"<p>$$\int e^u\,du=e^u+C=e^{x^2}+C$$</p>"),
        ex("第一换元 例 3",
           r"<p>$$\int \frac{2x+1}{x^2+x}\,dx$$</p>"
           r"<p>分子刚好是分母的导数。令 $u=x^2+x$。</p>"
           r"<p>$$\int \frac{1}{u}\,du=\ln|u|+C=\ln|x^2+x|+C$$</p>"),
        ex("第一换元 例 4",
           r"<p>$$\int \tan x\,dx=\int\frac{\sin x}{\cos x}\,dx$$</p>"
           r"<p>令 $u=\cos x$，$du=-\sin x\,dx$。</p>"
           r"<p>$$-\int\frac{1}{u}\,du=-\ln|\cos x|+C=\ln|\sec x|+C$$</p>"),
        prompt("课堂练 1",
               r"先猜后验：$\int 2x\,dx$；再做第一换元 $\int \sin x\cos x\,dx$；再指出 $\int x e^x\,dx$ 谁应为 u。",
               "约 4 分钟。第三问指出谁为 $u$ 即可。"),
        answer("课堂练 1", [
            r"$\int 2x\,dx=x^2+C$。验算：导数 2x。",
            r"换元见例 1：$\sin^2 x/2+C$。",
            r"分部：多项式乘指数，令 $u=x$，$dv=e^x dx$（多项式降次）。",
        ], comment="猜—验—换元—分部，这是本讲全部手法。"),
        definition("分部积分",
                   r"<p>$$\int u\,dv=uv-\int v\,du$$</p>"
                   r"<p>口诀：对 u 求导要变简单，对 v 积分要会做。</p>"
                   r"<p>优先让多项式当 u（降次）；对数、反三角更当 u（求导变代数）。</p>"),
        ex("分部 例 1",
           r"<p>$$\int x e^x\,dx$$</p>"
           r"<p>$u=x$，$dv=e^x dx$ ⇒ $du=dx$，$v=e^x$。</p>"
           r"<p>$$x e^x-\int e^x\,dx=x e^x-e^x+C$$</p>"),
        ex("分部 例 2",
           r"<p>$$\int x\ln x\,dx$$</p>"
           r"<p>$u=\ln x$，$dv=x\,dx$ ⇒ $du=dx/x$，$v=x^2/2$。</p>"
           r"<p>$$\frac{x^2}{2}\ln x-\int\frac{x}{2}\,dx=\frac{x^2}{2}\ln x-\frac{x^2}{4}+C$$</p>"),
        ex("例　∫ ln x dx",
           r"<p>令 $u=\ln x$，$dv=dx$。得 $x\ln x-\int x\cdot(1/x)\,dx=x\ln x-x+C$。</p>"
           r"<p>验算：乘积导数回到 $\ln x$。</p>",
           spare=False),
        ex("例　∫ arctan x dx",
           r"<p>分部：$u=\arctan x$，$dv=dx$。后面出现 $\int x/(1+x^2)\,dx$，再用换元。</p>"
           r"<p>结果 $x\arctan x-\frac12\ln(1+x^2)+C$。</p>",
           spare=False),
        cards3("易错三句", [
            ("忘掉 +C", "原函数是族。定积分才是数。"),
            ("换元不换 dx", "必须写出 du。"),
            ("分部选反了 u", "指数当 u 会升次，越积越繁。"),
        ]),
        two_col("换元失败通常因为",
                ("没认出里层", [r"$\int e^{x^2} dx$ 不是 $2x e^{x^2}$ 那种。", "缺了里层导数，第一换元走不通。", "（高斯积分，本课不要求。）"]),
                ("系数没凑", [r"$\int e^{2x}dx$ 应除以 2。", r"$\frac12 e^{2x}+C$。", "验算：导数带回 2 再消掉。"])),
        prompt("课堂练 2",
               r"计算 $\int e^{2x}\,dx$ 与 $\int\dfrac{1}{2x+3}\,dx$。",
               "约 3 分钟。"),
        answer("课堂练 2", [
            r"$\int e^{2x}dx=\frac12 e^{2x}+C$。",
            r"令 u=2x+3，$\int du/(2u)=\frac12\ln|2x+3|+C$。",
            "两题都是「差一个常数因子」。",
        ]),
        bullets("分部口诀「反、对、幂、指、三」仅作参考", [
            "越靠前越适合当 u：反三角、对数、幂、指数、三角。",
            "本讲只要记住：多项式对指数，多项式当 u；对数当 u。",
            "选反了就停，换过来再写一遍，比硬算更省时间。",
        ]),
        prompt("课堂练 3　选 u",
               r"指出谁应为 u（不必算完）：" "\n"
               r"(1) $\int x\sin x\,dx$" "\n"
               r"(2) $\int\ln x\,dx$" "\n"
               r"(3) $\int x^2 e^x\,dx$",
               "约 2 分钟。"),
        answer("课堂练 3", [
            r"(1) u=x（多项式降次），dv=sin x dx。",
            r"(2) u=ln x，dv=dx。",
            r"(3) $u=x^2$，要分部两次。",
        ]),
        cards3("与 1.6 的分界", [
            ("本讲", "找原函数族，结果带 +C。"),
            ("下讲", "黎曼和是一个数。"),
            ("桥梁", "N-L：用原函数之差计算那个数。"),
        ]),
        definition("几何：一族平行切线",
                   r"<p>一个原函数是一条积分曲线。不定积分是上下平移的一整族。</p>"
                   r"<p>被积函数是切线斜率：同一横坐标处，族中每条曲线的切线互相平行。</p>",
                   extra=r"检验永远是求导。答案形式可以不同，两个原函数只差一个常数。例如 $\arcsin x+\arccos x=\pi/2$。"),
        formula_page("线性：常数提出，和拆开",
                     r"\int(3x^2+\frac{2}{x})\,dx=x^3+2\ln|x|+C",
                     extra=r"拆成几个积分时，每个都可以带常数，最后合并成一个 $C$。$\int dx$ 就是 $\int 1\,dx$。"),
        formula_page("凑微分得到的常用公式",
                     r"\int\frac{dx}{a^2+x^2}=\frac1a\arctan\frac{x}{a}+C,\qquad \int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac{x}{a}+C",
                     extra=r"$a>0$。第一式令 $u=x/a$ 回到 $\int du/(1+u^2)$。第二式令 $x=a\sin t$。"),
        definition("选学：第二换元",
                   r"<p>第一换元是把复合看成 $u$。第二换元是主动令 $x=\varphi(t)$，用来去掉根号。</p>"
                   r"<p>$\sqrt{a^2-x^2}$ 令 $x=a\sin t$；$\sqrt{a^2+x^2}$ 令 $x=a\tan t$；$\sqrt{x^2-a^2}$ 令 $x=a\sec t$。</p>",
                   extra="课上认得出该用哪一种即可。算出的 $t$ 要用直角三角形代回 $x$。"),
        culture("积分是求导的逆运算。莱布尼茨的拉长 S，首先仍是「求和」；到了不定积分，它变成「找谁的导数是它」。",
                "不定积分先是「找谁的导数是它」。会换元、会分部，就已经够用；其余放到作业里慢慢练。",
                title="文化卡片 · 逆运算"),
        summary(
            ["不定积分 = 原函数 +C。", "换元：认复合、凑微分。", "分部：让求导变简单的当 u。"],
            ["把 +C 带进定积分的最终数字。", "换元时只换 $u$、忘了换 $dx$。"],
        ),
        homework(
            [r"$\int(3x^2-1)\,dx$，$\int e^{2x}\,dx$（换元），$\int x\cos x\,dx$（分部）。", "每题求导验算。"],
            [r"* $\int\ln x\,dx$ 或 $\int\arctan x\,dx$ 选一，分部后求导验算。"],
            "下一讲 1.6：定积分是加密求和，N-L 是计算装置。",
        ),
    ]
