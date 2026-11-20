/* 1.1 函数：分段、交易费、取整、复合、反函数镜像、初等函数、奇函数 */
(function () {
  const PI = Math.PI;
  const fmt = (v, d) => v.toFixed(d).replace(/^-(0\.0*)$/, "$1");

  function bind(slide, render, wire) {
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    wire();
    render();
  }

  Deck.on("piecewise", (slide) => {
    const canvas = slide.querySelector("#pw-canvas");
    const xEl = slide.querySelector("#pw-x");
    const xVal = slide.querySelector("#pw-x-val");
    const read = slide.querySelector("#pw-read");
    function f(x) { return Math.abs(x - 1); }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = f(x);
      const side = x < 1 ? "左支 $y=1-x$，斜率 $-1$" : x > 1 ? "右支 $y=x-1$，斜率 $+1$" : "折点 $x=1$";
      Plot.tex(read, `$x=${fmt(x, 2)}$ 时 $|x-1|=${fmt(y, 2)}$<small>${side}</small>`);
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -1.5, xMax: 3.5, yMin: -0.4, yMax: 3.2, title: "y = |x−1|" });
      Plot.curve(ctx, xOf, yOf, f, -1.5, 3.5, 200);
      Plot.disc(ctx, xOf(x), yOf(y), 6, Plot.C.gold);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  /* 例 1.1.2 交易费：0（x=0），pq（0<x<q），px（x≥q）；示意 p=0.8，q=2 */
  Deck.on("fee", (slide) => {
    const canvas = slide.querySelector("#fee-canvas");
    const xEl = slide.querySelector("#fee-x");
    const xVal = slide.querySelector("#fee-x-val");
    const read = slide.querySelector("#fee-read");
    const verdict = slide.querySelector("#fee-verdict");
    const p = 0.8, q = 2;
    function fee(x) {
      if (x <= 0) return 0;
      if (x < q) return p * q;
      return p * x;
    }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = fee(x);
      const seg = x === 0 ? "第一段 $x=0$" : x < q ? "第二段 $0\\lt x\\lt q$，$y=pq$" : "第三段 $x\\ge q$，$y=px$";
      Plot.tex(read, `$y(${fmt(x, 2)})=${fmt(y, 2)}$<small>${seg}</small>`);
      verdict.className = "verdict" + (x === 0 || Math.abs(x - q) < 0.03 ? " good" : "");
      Plot.tex(verdict, x === 0
        ? "$x=0$：不交易不收费，函数值是 $0$。往右挪一点点，费用立刻跳到 $pq=1.6$。"
        : Math.abs(x - q) < 0.03
          ? "$x=q$：两段在这里都给出 $pq$，线段与射线接上了。"
          : x < q
            ? "交易额不到 $q$，一律收 $pq$：这是一段不含端点的水平线段。"
            : "超过 $q$ 之后按费率 $p$ 收费：一条射线。");
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -0.4, xMax: 6.2, yMin: -0.3, yMax: 5.2, xlabel: "交易额 x", ylabel: "费用 y", title: "交易费（示意 p = 0.8，q = 2）" });
      ctx.strokeStyle = Plot.C.burgundy;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(xOf(0.02), yOf(p * q));
      ctx.lineTo(xOf(q), yOf(p * q));
      ctx.stroke();
      Plot.curve(ctx, xOf, yOf, (t) => p * t, q, 6.1, 40);
      Plot.disc(ctx, xOf(0), yOf(0), 6, Plot.C.burgundy);
      Plot.disc(ctx, xOf(0), yOf(p * q), 6, Plot.C.card, Plot.C.burgundy);
      Plot.dashed(ctx, xOf(q), yOf(0), xOf(q), yOf(p * q), Plot.C.muted, 1.2);
      Plot.label(ctx, "q", xOf(q) - 8, yOf(0) + 30, Plot.C.muted, 24);
      Plot.disc(ctx, xOf(x), yOf(y), 7, Plot.C.gold);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("floorfn", (slide) => {
    const canvas = slide.querySelector("#floor-canvas");
    const xEl = slide.querySelector("#floor-x");
    const xVal = slide.querySelector("#floor-x-val");
    const read = slide.querySelector("#floor-read");
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = Math.floor(x + 1e-9);
      const isInt = Math.abs(x - Math.round(x)) < 1e-9;
      const tail = isInt
        ? `整数点：取左端的实心点，值为 $${y}$`
        : `$${y}\\le ${fmt(x, 2)}\\lt ${y + 1}$，取左边的整数 $${y}$`;
      Plot.tex(read, `$[${fmt(x, 2)}]=${y}$<small>${tail}</small>`);
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -2.2, xMax: 2.8, yMin: -2.4, yMax: 2.6, title: "y = [x]" });
      for (let k = -2; k <= 2; k++) {
        ctx.strokeStyle = Plot.C.burgundy;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(xOf(k), yOf(k));
        ctx.lineTo(xOf(k + 1 - 0.0001), yOf(k));
        ctx.stroke();
        Plot.disc(ctx, xOf(k), yOf(k), 5, Plot.C.burgundy);
        Plot.disc(ctx, xOf(k + 1), yOf(k), 5, Plot.C.card, Plot.C.burgundy);
      }
      Plot.disc(ctx, xOf(x), yOf(y), 6, Plot.C.gold);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  /* 复合：里层 u = x/2 + 1，外层 y = u²；同时给出换序后的结果 */
  Deck.on("compose", (slide) => {
    const canvas = slide.querySelector("#compose-canvas");
    const xEl = slide.querySelector("#compose-x");
    const xVal = slide.querySelector("#compose-x-val");
    const read = slide.querySelector("#compose-read");
    const verdict = slide.querySelector("#compose-verdict");
    function g(x) { return 0.5 * x + 1; }
    function f(u) { return u * u; }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(1);
      const u = g(x), y = f(u);
      const swap = g(f(x));
      Plot.tex(read, `$x=${fmt(x, 1)}\\ \\to\\ u=${fmt(u, 2)}\\ \\to\\ y=${fmt(y, 2)}$<small>换序：先平方再「减半加一」得 $${fmt(swap, 2)}$</small>`);
      const same = Math.abs(swap - y) < 1e-9;
      verdict.className = "verdict" + (same ? " good" : "");
      Plot.tex(verdict, same
        ? "这一点上两种次序碰巧相等。换一个 $x$ 再看。"
        : "两种次序结果不同：复合的次序是规则的一部分。");
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      const bw = Math.min(150, w * 0.2), bh = bw;
      const by = h * 0.5 - bh / 2;
      const xs = [w * 0.06, w * 0.5 - bw / 2, w * 0.94 - bw];
      const boxes = [["输入 x", fmt(x, 1)], ["里层 u", fmt(u, 2)], ["外层 y", fmt(y, 2)]];
      ctx.strokeStyle = Plot.C.gold; ctx.fillStyle = Plot.C.gold; ctx.lineWidth = 3;
      for (let i = 0; i < 2; i++) {
        const x0 = xs[i] + bw + 8, x1 = xs[i + 1] - 10, ym = h * 0.5;
        ctx.beginPath(); ctx.moveTo(x0, ym); ctx.lineTo(x1, ym); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x1 + 6, ym); ctx.lineTo(x1 - 10, ym - 8); ctx.lineTo(x1 - 10, ym + 8); ctx.closePath(); ctx.fill();
      }
      ctx.textAlign = "center";
      ctx.fillStyle = Plot.C.muted;
      ctx.font = "24px 'Noto Serif SC', serif";
      ctx.fillText("u = x/2 + 1", (xs[0] + bw + xs[1]) / 2, h * 0.5 - 18);
      ctx.fillText("y = u²", (xs[1] + bw + xs[2]) / 2, h * 0.5 - 18);
      boxes.forEach(([lab, val], i) => {
        ctx.fillStyle = Plot.C.burgundy;
        ctx.fillRect(xs[i], by, bw, bh);
        ctx.fillStyle = Plot.C.paper;
        ctx.textAlign = "center";
        ctx.font = "24px 'Noto Serif SC', serif";
        ctx.fillText(lab, xs[i] + bw / 2, by + bh * 0.38);
        ctx.font = "30px 'Noto Serif SC', serif";
        ctx.fillText(val, xs[i] + bw / 2, by + bh * 0.72);
      });
      Plot.label(ctx, "先里层，后外层：管道只能从左往右走。", 24, 40, Plot.C.ink, 26);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  /* 反函数：点 P(x, f(x)) 关于 y = x 翻到 Q(f(x), x)；x² 在全体实数上翻过去不是函数 */
  Deck.on("inverse11", (slide) => {
    const canvas = slide.querySelector("#inv-canvas");
    const tEl = slide.querySelector("#inv-t");
    const xVal = slide.querySelector("#inv-x-val");
    const read = slide.querySelector("#inv-read");
    const verdict = slide.querySelector("#inv-verdict");
    const btns = [...slide.querySelectorAll("[data-inv]")];
    const kinds = {
      exp: { f: (x) => Math.pow(2, x), lo: -3, hi: 1.65, title: "y = 2ˣ 与 y = log₂x" },
      cube: { f: (x) => x * x * x, lo: -1.45, hi: 1.45, title: "y = x³ 与 y = ∛x" },
      sin: { f: Math.sin, lo: -PI / 2, hi: PI / 2, title: "y = sin x（限制在 [−π/2, π/2]）与 y = arcsin x" },
      sq: { f: (x) => x * x, lo: -1.75, hi: 1.75, title: "y = x²（全体实数）翻折之后" },
    };
    let mode = slide.dataset.inv || "exp";
    function render() {
      const k = kinds[mode];
      const t = Number(tEl.value) / 1000;
      const x0 = k.lo + t * (k.hi - k.lo);
      const y0 = k.f(x0);
      xVal.textContent = x0.toFixed(2);
      const a = fmt(x0, 2), b = fmt(y0, 2);
      let rel;
      if (mode === "exp") rel = `$2^{${a}}=${b}\\iff\\log_2 ${b}=${a}$`;
      else if (mode === "cube") rel = `$(${a})^3=${b}\\iff\\sqrt[3]{${b}}=${a}$`;
      else if (mode === "sin") rel = `$\\sin(${a})=${b}\\iff\\arcsin(${b})=${a}$`;
      else rel = `$(${a})^2=(${fmt(-x0, 2)})^2=${b}$：同一个 $y$ 来自两个 $x$`;
      Plot.tex(read, `$P=(${a},\\,${b})$　$Q=(${b},\\,${a})$<small>${rel}</small>`);
      const bad = mode === "sq" && Math.abs(x0) > 0.05;
      verdict.className = "verdict" + (bad ? "" : " good");
      Plot.tex(verdict, mode === "sq"
        ? "翻折后，一条竖线碰到两个点：这不是函数。先把定义域限制到 $[0,+\\infty)$，才有反函数 $y=\\sqrt x$。"
        : mode === "sin"
          ? "整条正弦曲线翻过去不是函数；只取 $[-\\frac{\\pi}{2},\\frac{\\pi}{2}]$ 这一段，翻过去正是 $y=\\arcsin x$。"
          : "一一对应：每条水平线只碰原曲线一次，翻折后每条竖线也只碰一次。");
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80 || h < 80) return;
      const R = 3.2;
      const pw = w - 90, ph = h - 88;
      const xr = R * pw / ph;
      const A = Plot.axes(ctx, w, h, { xMin: -xr, xMax: xr, yMin: -R, yMax: R, title: k.title, ticks: false });
      const { xOf, yOf } = A;
      Plot.clip(ctx, A, () => {
        Plot.dashed(ctx, xOf(-R * 2), yOf(-R * 2), xOf(R * 2), yOf(R * 2), Plot.C.gold, 1.8);
        if (mode === "sin") {
          Plot.curve(ctx, xOf, yOf, Math.sin, -xr, xr, 300, { color: "rgba(107,20,86,0.22)", width: 2 });
        }
        Plot.curve(ctx, xOf, yOf, k.f, k.lo, k.hi, 240, { color: Plot.C.burgundy, width: 3 });
        const pts = [];
        for (let i = 0; i <= 240; i++) {
          const s = k.lo + (i / 240) * (k.hi - k.lo);
          pts.push([xOf(k.f(s)), yOf(s)]);
        }
        Plot.polyline(ctx, pts, { color: Plot.C.teal, width: 3 });
        if (mode === "sq") {
          Plot.dashed(ctx, xOf(-xr), yOf(y0), xOf(xr), yOf(y0), "rgba(107,20,86,0.55)", 1.4);
          Plot.dashed(ctx, xOf(y0), yOf(-R), xOf(y0), yOf(R), "rgba(27,95,92,0.55)", 1.4);
          Plot.disc(ctx, xOf(-x0), yOf(y0), 6, Plot.C.card, Plot.C.burgundy);
          Plot.disc(ctx, xOf(y0), yOf(-x0), 6, Plot.C.card, Plot.C.teal);
        }
        Plot.dashed(ctx, xOf(x0), yOf(y0), xOf(y0), yOf(x0), Plot.C.muted, 1.4);
        Plot.disc(ctx, xOf(x0), yOf(y0), 7, Plot.C.burgundy);
        Plot.disc(ctx, xOf(y0), yOf(x0), 7, Plot.C.teal);
      });
      Plot.label(ctx, "P", xOf(x0) - 30, yOf(y0) - 10, Plot.C.burgundy, 26);
      Plot.label(ctx, "Q", xOf(y0) + 12, yOf(x0) + 28, Plot.C.teal, 26);
      Plot.label(ctx, "y = x", xOf(R * 0.72), yOf(R * 0.86), Plot.C.gold, 24);
      Plot.label(ctx, "原函数", A.m.l + 10, A.m.t + A.ph - 44, Plot.C.burgundy, 24);
      Plot.label(ctx, "翻折后", A.m.l + 10, A.m.t + A.ph - 14, Plot.C.teal, 24);
    }
    bind(slide, render, () => {
      tEl.oninput = render;
      btns.forEach((btn) => {
        btn.onclick = () => {
          mode = btn.dataset.inv;
          slide.dataset.inv = mode;
          btns.forEach((x) => x.classList.toggle("on", x === btn));
          render();
        };
      });
    });
  });

  Deck.on("elem", (slide) => {
    const canvas = slide.querySelector("#elem-canvas");
    const btns = [...slide.querySelectorAll("[data-elem]")];
    const verdict = slide.querySelector("#elem-verdict");
    const kinds = [
      { name: "y = x²", f: (x) => x * x, a: -2, b: 2, y0: -0.4, y1: 4.2, note: "幂函数 $y=x^2$：全体实数都有定义，开口向上。" },
      { name: "y = 2ˣ", f: (x) => Math.pow(2, x), a: -2.5, b: 2.2, y0: -0.3, y1: 4.6, note: "指数函数 $y=2^x$：全体实数都有定义，函数值恒正。" },
      { name: "y = ln x", f: (x) => (x > 0 ? Math.log(x) : NaN), a: -0.5, b: 4, y0: -2.6, y1: 1.8, note: "对数函数 $y=\\ln x$：只在 $x>0$ 有定义，左半边没有图像。" },
      { name: "y = sin x", f: Math.sin, a: -6.6, b: 6.6, y0: -1.6, y1: 1.6, note: "正弦 $y=\\sin x$：全体实数，以 $2\\pi$ 为周期，夹在 $\\pm1$ 之间。" },
      {
        name: "y = tan x",
        f: (x) => { const c = Math.cos(x); return Math.abs(c) < 0.06 ? NaN : Math.sin(x) / c; },
        a: -4.2, b: 4.2, y0: -4, y1: 4,
        note: "正切 $y=\\tan x$：去掉 $x=\\frac{\\pi}{2}+k\\pi$，以 $\\pi$ 为周期。",
      },
      { name: "y = arcsin x", f: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : NaN), a: -1.6, b: 1.6, y0: -1.8, y1: 1.8, note: "反正弦 $y=\\arcsin x$：只吃 $[-1,1]$，值在 $[-\\frac{\\pi}{2},\\frac{\\pi}{2}]$。" },
    ];
    let mode = Number(slide.dataset.elem || 0);
    function render() {
      const k = kinds[mode];
      Plot.tex(verdict, k.note);
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: k.a, xMax: k.b, yMin: k.y0, yMax: k.y1, title: k.name });
      Plot.curve(ctx, xOf, yOf, k.f, k.a, k.b, 600);
    }
    bind(slide, render, () => {
      btns.forEach((b) => {
        b.onclick = () => {
          mode = Number(b.dataset.elem);
          slide.dataset.elem = String(mode);
          btns.forEach((x) => x.classList.toggle("on", x === b));
          render();
        };
      });
    });
  });

  /* 例 1.1.13：y = ln(x + √(x²+1))（取 a = e） */
  Deck.on("oddpt", (slide) => {
    const canvas = slide.querySelector("#odd-canvas");
    const xEl = slide.querySelector("#odd-x");
    const xVal = slide.querySelector("#odd-x-val");
    const read = slide.querySelector("#odd-read");
    function f(x) { return Math.log(x + Math.sqrt(x * x + 1)); }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = f(x);
      Plot.tex(read, `$y(${fmt(x, 2)})=${fmt(y, 3)}$<small>$y(${fmt(-x, 2)})=${fmt(f(-x), 3)}$，两者互为相反数</small>`);
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -3.2, xMax: 3.2, yMin: -2.4, yMax: 2.4, title: "y = ln(x + √(x²+1))" });
      Plot.curve(ctx, xOf, yOf, f, -3.1, 3.1, 200);
      Plot.dashed(ctx, xOf(x), yOf(y), xOf(-x), yOf(-y), "rgba(176,122,40,0.8)", 1.6);
      Plot.disc(ctx, xOf(0), yOf(0), 4, Plot.C.ink);
      Plot.disc(ctx, xOf(x), yOf(y), 7, Plot.C.burgundy);
      Plot.disc(ctx, xOf(-x), yOf(-y), 7, Plot.C.gold);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  /* 课堂练配图：教材图 1.1，父母集合到儿子集合 */
  function arrow(ctx, x0, y0, x1, y1, color) {
    const ang = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 14 * Math.cos(ang - 0.35), y1 - 14 * Math.sin(ang - 0.35));
    ctx.lineTo(x1 - 14 * Math.cos(ang + 0.35), y1 - 14 * Math.sin(ang + 0.35));
    ctx.closePath(); ctx.fill();
  }

  if (window.FIGS) Object.assign(window.FIGS, {
    "11-map"(ctx, w, h) {
      const C = Plot.C;
      ctx.fillStyle = C.card; ctx.fillRect(0, 0, w, h);
      const L = { x: w * 0.26, y: h * 0.47, rx: w * 0.12, ry: h * 0.34 };
      const Rt = { x: w * 0.66, y: h * 0.47, rx: w * 0.12, ry: h * 0.38 };
      [L, Rt].forEach((e) => {
        ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(e.x, e.y, e.rx, e.ry, 0, 0, 2 * PI); ctx.stroke();
      });
      const par = [["父", h * 0.33], ["母", h * 0.61]];
      const son = [["大儿子", h * 0.25], ["二儿子", h * 0.47], ["三儿子", h * 0.69]];
      par.forEach(([, py]) => son.forEach(([, sy]) => arrow(ctx, L.x + 8, py, Rt.x - 10, sy, "rgba(107,20,86,0.75)")));
      ctx.font = "26px 'Noto Serif SC', serif";
      ctx.textBaseline = "middle";
      par.forEach(([s, py]) => {
        Plot.disc(ctx, L.x, py, 6, C.teal);
        ctx.fillStyle = C.ink; ctx.textAlign = "right";
        ctx.fillText(s, L.x - L.rx - 10, py);
      });
      son.forEach(([s, sy]) => {
        Plot.disc(ctx, Rt.x, sy, 6, C.teal);
        ctx.fillStyle = C.ink; ctx.textAlign = "left";
        ctx.fillText(s, Rt.x + Rt.rx + 10, sy);
      });
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = C.muted;
      ctx.fillText("父母集合 X", L.x, h - 18);
      ctx.fillText("儿子集合 Y", Rt.x, h - 18);
    },
  });
})();
