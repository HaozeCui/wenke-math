"""HTML 页框与幻灯积木。"""
from __future__ import annotations

import re
import time
from html import escape
from pathlib import Path

BUILD = time.strftime("%Y%m%d%H%M%S")

ROOT = Path(__file__).resolve().parents[1]
LEC = ROOT / "lectures"


def e(s: str) -> str:
    return escape(s, quote=True)


def page(inner: str, title: str = "", notes: str = "", hook: str = "", kind: str = "", cls: str = "") -> str:
    bits = [f'data-title="{e(title)}"']
    if notes:
        bits.append(f'data-notes="{e(notes)}"')
    if hook:
        bits.append(f'data-hook="{hook}"')
    if kind:
        bits.append(f'data-kind="{kind}"')
    extra = f" {cls}" if cls else ""
    return f'<section class="slide{extra}" {" ".join(bits)}>\n{inner}\n</section>'


def num(s: str) -> str:
    return f'<div class="num">{s}</div>'


def h2(s: str) -> str:
    return f'<h2 class="slide-title">{s}</h2>'


def lead(s: str) -> str:
    return f'<p class="lead">{s}</p>'


def cover(kicker: str, title_html: str, p: str, meta: str, notes: str = "") -> str:
    inner = f"""<div class="kicker">{kicker}</div>
        <h2>{title_html}</h2>
        <p>{p}</p>
        <div class="meta">{meta}</div>"""
    return page(inner, title="封面", notes=notes, cls="cover")


def objectives(items: list[str], notes: str = "开场读目标，下课回扣。") -> str:
    cards = "".join(
        f'<div class="card"><span class="idx">{i:02d}</span><p>{t}</p></div>'
        for i, t in enumerate(items, 1)
    )
    inner = num("目标") + h2("学完本讲，应能做到") + f'<div class="obj">{cards}</div>'
    return page(inner, title="目标", notes=notes)


def bullets(title: str, items: list[str], lead_t: str = "", notes: str = "", code: str = "", kind: str = "") -> str:
    lis = "".join(f"<li>{x}</li>" for x in items)
    inner = (num(code) if code else "") + h2(title)
    if lead_t:
        inner += lead(lead_t)
    inner += f'<div class="card"><ul>{lis}</ul></div>'
    return page(inner, title=title, notes=notes, kind=kind)


def two_col(title: str, a: tuple[str, list[str]], b: tuple[str, list[str]], notes: str = "", lead_t: str = "", kind: str = "", code: str = "") -> str:
    def col(h, items):
        lis = "".join(f"<li>{x}</li>" for x in items)
        return f'<div class="card"><h3>{h}</h3><div class="gold-rule"></div><ul>{lis}</ul></div>'

    inner = (num(code) if code else "") + h2(title) + (lead(lead_t) if lead_t else "") + f'<div class="grid-2 fit">{col(*a)}{col(*b)}</div>'
    return page(inner, title=title, notes=notes, kind=kind)


def cards3(title: str, triples: list[tuple[str, str]], notes: str = "", lead_t: str = "", kind: str = "") -> str:
    cs = "".join(
        f'<div class="card"><h3>{h}</h3><div class="gold-rule"></div><p>{p}</p></div>' for h, p in triples
    )
    inner = h2(title) + (lead(lead_t) if lead_t else "") + f'<div class="grid-3 fit">{cs}</div>'
    return page(inner, title=title, notes=notes, kind=kind)


def definition(title: str, body: str, extra: str = "", notes: str = "") -> str:
    extra_h = f'<p class="lead" style="margin-top:12px">{extra}</p>' if extra else ""
    inner = num("定义") + h2(title) + f'<div class="card">{body}</div>{extra_h}'
    return page(inner, title=title, notes=notes)


LEVELS = {"基础": "lv-base", "变式": "lv-vary", "应用": "lv-apply", "综合": "lv-mix", "辨析": "lv-judge"}


def timer_btn(wait: str) -> str:
    m = re.search(r"约\s*(\d+)\s*分钟", wait)
    if not m:
        return ""
    mins = int(m.group(1))
    return f'<button type="button" class="btn ghost timer" data-sec="{mins * 60}">计时 {mins}:00</button>'


def prompt(title: str, problem: str, wait: str, notes: str = "", level: str = "", fig: str = "") -> str:
    tag = f'<span class="badge {LEVELS.get(level, "")}">{level}</span>' if level else '<span class="badge">先做</span>'
    wait_h = f'<p class="wait">{wait}{timer_btn(wait)}<span class="teacher-hint">　·　按 A 揭晓解答</span></p>'
    if fig:
        body = (
            f'<div class="grid-2 prompt-grid"><div class="prompt-box">{problem}</div>'
            f'<div class="plot-wrap"><canvas data-fig="{fig}"></canvas></div></div>'
        )
        return page(f"{num('课堂练')}{tag}{h2(title)}{body}{wait_h}", title=title, notes=notes, hook="figs")
    inner = f'{num("课堂练")}{tag}{h2(title)}<div class="prompt-box">{problem}</div>{wait_h}'
    return page(inner, title=title, notes=notes)


def mistake(title: str, given: str, wrong: list[str], ask: str, wait: str, notes: str = "", fig: str = "") -> str:
    """错解诊断：先给一份看似合理的错误解答，让学生找错。"""
    lis = "".join(f"<li>{x}</li>" for x in wrong)
    card = (
        f'<div class="card mistake"><p class="given">{given}</p>'
        f'<h3>某同学这样写</h3><ol>{lis}</ol></div>'
    )
    body = (
        f'<div class="grid-2 prompt-grid">{card}<div class="plot-wrap"><canvas data-fig="{fig}"></canvas></div></div>'
        if fig else card
    )
    wait_h = f'<p class="wait">{ask}　{wait}{timer_btn(wait)}<span class="teacher-hint">　·　按 A 揭晓解答</span></p>'
    inner = f'{num("课堂练")}<span class="badge lv-judge">找错</span>{h2(title)}{body}{wait_h}'
    return page(inner, title=title, notes=notes, hook="figs" if fig else "")


def derive(title: str, rows: list[tuple[str, str]], lead_t: str = "", extra: str = "", notes: str = "", code: str = "推导") -> str:
    """分步推导：左边一行等式，右边一句理由。第一行直接出现，其余逐步揭示。"""
    def cell(cls, k, body):
        st = f' step" data-g="d{k}' if k else ""
        return f'<div class="{cls}{st}">{body}</div>'

    rs = "".join(
        cell("dm", k, f"$${tex}$$") + cell("dw", k, f"<span>{why}</span>")
        for k, (tex, why) in enumerate(rows)
    )
    inner = (
        num(code) + h2(title) + (lead(lead_t) if lead_t else "")
        + f'<div class="derive">{rs}</div>'
        + (f'<p class="lead step">{extra}</p>' if extra else "")
    )
    return page(inner, title=title, notes=notes)


def section(no: str, title: str, sub: str = "", notes: str = "") -> str:
    """分节过渡页。其后各页带上 data-sec，提纲与进度条按节分组。"""
    inner = (
        f'<div class="sec-no">{no}</div><h2>{title}</h2>'
        + (f"<p>{sub}</p>" if sub else "")
    )
    return page(inner, title=title, notes=notes, cls="divider").replace(
        'class="slide divider"', f'class="slide divider" data-sec-start="{e(title)}"', 1
    )


ROUTE = "__ROUTE__"


def route(title: str = "本讲路线", notes: str = "") -> str:
    """本讲路线：由 write_lec 按分节页自动填写。"""
    inner = h2(title) + f'<div class="card"><ol class="route">{ROUTE}</ol></div>'
    return page(inner, title=title, notes=notes)


def quiz(code: str, title: str = "课后自测", n: int = 6, notes: str = "课后让学生用手机打开本页自测。") -> str:
    inner = (
        f'{num("自测")}{h2(title)}'
        f'<div class="quiz" data-quiz="{code}" data-n="{n}"></div>'
    )
    return page(inner, title=title, notes=notes, hook="quiz")


def answer(title: str, steps: list[str], comment: str = "", notes: str = "") -> str:
    lis = "".join(f"<li>{x}</li>" for x in steps)
    c = f'<div class="comment">{comment}</div>' if comment else ""
    inner = f'{num("解答")}<span class="badge">解答</span>{h2(title)}<ol class="answer-list">{lis}</ol>{c}'
    return page(inner, title=title, notes=notes, kind="answer")


def lab(title: str, hook: str, canvas_id: str, panel: str, notes: str = "", code: str = "实验") -> str:
    inner = f'''{num(code)}{h2(title)}
        <div class="grid-2" style="flex:1">
          <div class="plot-wrap"><canvas id="{canvas_id}"></canvas></div>
          <aside class="panel">{panel}</aside>
        </div>'''
    return page(inner, title=title, notes=notes, hook=hook)


def culture(quote: str, body: str, title: str = "文化卡片", notes: str = "控制在两三分钟。") -> str:
    inner = (
        f'{num("文化")}<div class="culture"><span class="badge">{title}</span>'
        f"<blockquote>{quote}</blockquote><p>{body}</p></div>"
    )
    return page(inner, title=title, notes=notes)


def summary(items: list[str], pitfalls: list[str], notes: str = "下课回扣目标。") -> str:
    a = "".join(f"<li>{x}</li>" for x in items)
    b = "".join(f"<li>{x}</li>" for x in pitfalls)
    inner = (
        h2("带走与易错")
        + f'<div class="grid-2 fit"><div class="card"><h3>带走</h3><div class="gold-rule"></div><ul>{a}</ul></div>'
        f'<div class="card"><h3>易错</h3><div class="gold-rule"></div><ul>{b}</ul></div></div>'
    )
    return page(inner, title="小结", notes=notes)


def formula_page(title: str, tex: str, extra: str = "", notes: str = "", code: str = "公式") -> str:
    extra_h = f'<p class="lead">{extra}</p>' if extra else ""
    inner = num(code) + h2(title) + f'<div class="card">$${tex}$$</div>{extra_h}'
    return page(inner, title=title, notes=notes)


def table_page(title: str, headers: list[str], rows: list[list[str]], notes: str = "", lead_t: str = "", kind: str = "") -> str:
    th = "".join(f"<th>{h}</th>" for h in headers)
    trs = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    inner = h2(title) + (lead(lead_t) if lead_t else "") + f'<table class="sheet"><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>'
    return page(inner, title=title, notes=notes, kind=kind)


def skip_note(text: str = "备用 · 可跳") -> str:
    return f'<p class="skip">{text}</p>'


def rng(iid: str, label: str, minv, maxv, val, step=None) -> str:
    st = f' step="{step}"' if step is not None else ""
    return (
        f'<label><span>{label}</span><span class="ctrl-val" id="{iid}-val">{val}</span></label>'
        f'<input id="{iid}" type="range" min="{minv}" max="{maxv}" value="{val}"{st} />'
    )


def homework(basics: list[str], stars: list[str], preview: str, notes: str = "当堂布置。") -> str:
    a = "".join(f"<li>{x}</li>" for x in basics)
    b = "".join(f"<li>{x}</li>" for x in stars)
    inner = (
        h2("作业")
        + f'<div class="grid-3 fit"><div class="card"><h3>必做</h3><div class="gold-rule"></div><ul>{a}</ul></div>'
        f'<div class="card"><h3>选做</h3><div class="gold-rule"></div><ul>{b}</ul></div>'
        f'<div class="card"><h3>下一讲</h3><div class="gold-rule"></div><p>{preview}</p></div></div>'
    )
    return page(inner, title="作业", notes=notes)


CHROME = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>__TITLE__</title>
  <link rel="stylesheet" href="../vendor/katex/katex.min.css" />
  <link rel="stylesheet" href="../css/deck.css?v=__V__" />
</head>
<body class="play">
  <div class="app cover-mode">
    <div class="spine" aria-hidden="true"></div>
    <header class="topbar">
      <a class="home" href="../index.html">目录</a>
      <span class="mark">NKU</span>
      <h1>文科高等数学　·　__H1__</h1>
      <span class="sec" id="sec-label"></span>
    </header>
    <div class="progress" id="progress" aria-hidden="true"><i></i></div>
    <main class="stage">
__SLIDES__
    </main>
    <canvas class="ink" id="ink"></canvas>
    <button type="button" class="clock" id="clock" title="点一下停止计时"></button>
    <div class="notes" id="notes"></div>
    <div class="outline" id="outline"><h3>本讲提纲 I</h3><div id="outline-list"></div></div>
    <div class="help" id="help">
      <h3>翻页</h3>
      <p>手机：左右滑动，或点底部「上一页」「下一页」。「解答」揭晓答案，「提纲」跳到某一页。</p>
      <p>键盘：→ / 空格 下一步或下一页　　← 上一步　　Home / End 首尾</p>
      <p>F 全屏　　A 揭晓解答　　I 提纲　　? 本面板</p>
      <p>T 课堂练计时　　P 画笔（C 清除本页笔迹）　　B 黑屏</p>
      <p class="teacher-only">N 备注（仅教师版 ?teacher=1）</p>
      <p>推导页逐行出现，按 → 一步一步走。解答页默认跳过；点「解答」或按 A 后进入线性顺序。滑条用手指拖；用键盘时先点空白再按方向键。</p>
    </div>
    <div class="blackout" id="blackout"></div>
    <footer class="botbar">
      <span>南开大学数学科学学院</span>
      <span id="page">1 / 1</span>
      <span class="keys">
        <button type="button" class="btn ghost" id="btn-prev">上一页</button>
        <button type="button" class="btn ghost" id="btn-next">下一页</button>
        <button type="button" class="btn ghost" id="btn-ans">解答 A</button>
        <button type="button" class="btn ghost" id="btn-toc">提纲 I</button>
        <button type="button" class="btn ghost" id="btn-notes">备注 N</button>
        <button type="button" class="btn ghost" id="btn-pen">画笔 P</button>
        <button type="button" class="btn ghost" id="btn-full">全屏 F</button>
        <button type="button" class="btn ghost" id="btn-help">?</button>
      </span>
    </footer>
  </div>
  <script src="../vendor/katex/katex.min.js"></script>
  <script src="../vendor/katex/contrib/auto-render.min.js"></script>
  <script src="../js/deck.js?v=__V__"></script>
  <script src="../js/plot.js?v=__V__"></script>
__SCRIPTS__
</body>
</html>
"""


SEC_START = re.compile(r'data-sec-start="([^"]*)"')


def tag_sections(slides: list[str]) -> list[str]:
    """分节页之后的每一页带上 data-sec；本讲路线按节名填写。"""
    out, cur, names = [], "", []
    for s in slides:
        m = SEC_START.search(s)
        if m:
            cur = m.group(1)
            names.append(cur)
        if cur:
            s = s.replace('<section class="slide', f'<section data-sec="{cur}" class="slide', 1)
        out.append(s)
    lis = "".join(f"<li>{n}</li>" for n in names)
    return [s.replace(ROUTE, lis) for s in out]


def write_lec(filename: str, title: str, h1: str, slides: list[str], labs: list[str]) -> None:
    slides = tag_sections(slides)
    body = "\n".join(slides)
    extra = []
    if 'data-fig="' in body:
        extra.append("figs.js")
    if 'data-quiz="' in body:
        extra.append("quiz.js")
    scripts = "\n".join(f'  <script src="../js/{x}?v=__V__"></script>' for x in extra)
    for code in re.findall(r'data-quiz="([^"]+)"', body):
        scripts += f'\n  <script src="../js/quiz/{code}.js?v=__V__"></script>'
    scripts += "\n" + "\n".join(f'  <script src="../js/labs/{x}?v=__V__"></script>' for x in labs)
    html = (
        CHROME.replace("__TITLE__", title)
        .replace("__H1__", h1)
        .replace("__SLIDES__", body)
        .replace("__SCRIPTS__", scripts)
        .replace("__V__", BUILD)
    )
    LEC.mkdir(parents=True, exist_ok=True)
    (LEC / filename).write_text(html, encoding="utf-8")
    print(filename, len(slides), "slides")
