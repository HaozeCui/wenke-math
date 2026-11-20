/* 1.4 导数应用：单调与圆桶 */
(function () {
  const f = (x) => x * x * x / 3 - x;
  const fp = (x) => x * x - 1;

  Deck.on("mono", (slide) => {
    const canvas = slide.querySelector("#mono-canvas");
    const xEl = slide.querySelector("#mono-x");
    const xVal = slide.querySelector("#mono-x-val");
    const read = slide.querySelector("#mono-read");
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const s = fp(x);
      read.textContent = `f'(x) = ${s.toFixed(2)}　·　${s > 0.05 ? "切线向上，函数在增" : s < -0.05 ? "切线向下，函数在减" : "驻点附近"}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -2.4, xMax: 2.4, yMin: -2.2, yMax: 2.2, title: "f(x)=x³/3 − x" });
      Plot.curve(ctx, xOf, yOf, f, -2.4, 2.4, 120);
      const y = f(x);
      ctx.strokeStyle = Plot.C.gold; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xOf(x - 0.8), yOf(y - 0.8 * s));
      ctx.lineTo(xOf(x + 0.8), yOf(y + 0.8 * s));
      ctx.stroke();
      Plot.disc(ctx, xOf(x), yOf(y), 6, Plot.C.burgundy);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    render();
  });

  Deck.on("barrel", (slide) => {
    const canvas = slide.querySelector("#barrel-canvas");
    const rEl = slide.querySelector("#barrel-r");
    const rVal = slide.querySelector("#barrel-r-val");
    const read = slide.querySelector("#barrel-read");
    const V = 16 * Math.PI;
    function H(r) { return V / (Math.PI * r * r); }
    function S(r) { return 2 * Math.PI * r * H(r) + 2 * Math.PI * r * r; }
    function render() {
      const r = Number(rEl.value);
      rVal.textContent = r.toFixed(2);
      const s = S(r);
      const rStar = Math.cbrt(V / (2 * Math.PI));
      read.textContent = `S(r) = ${s.toFixed(1)}　·　驻点约 r = ${rStar.toFixed(2)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0.6, xMax: 3.2, yMin: 40, yMax: 140, xlabel: "r", ylabel: "S", title: "表面积" });
      Plot.curve(ctx, xOf, yOf, S, 0.7, 3.1, 80);
      Plot.disc(ctx, xOf(r), yOf(s), 6, Plot.C.gold);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = Plot.C.teal;
      ctx.beginPath(); ctx.moveTo(xOf(rStar), yOf(40)); ctx.lineTo(xOf(rStar), yOf(140)); ctx.stroke();
      ctx.setLineDash([]);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    rEl.oninput = render;
    render();
  });

  function tangentLine(ctx, xOf, yOf, x, y, slope, len) {
    ctx.strokeStyle = Plot.C.gold;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(xOf(x - len), yOf(y - len * slope));
    ctx.lineTo(xOf(x + len), yOf(y + len * slope));
    ctx.stroke();
  }

  /* 例 1.4.4：上图 f 与切线（按凹凸分色），下图 f′；f′ 的斜率就是 f″ */
  Deck.on("second14", (slide) => {
    const canvas = slide.querySelector("#sec2-canvas");
    const xEl = slide.querySelector("#sec2-x");
    const xVal = slide.querySelector("#sec2-x-val");
    const read = slide.querySelector("#sec2-read");
    const verdict = slide.querySelector("#sec2-verdict");
    const F = (x) => x * x * x - 9 * x * x + 15 * x + 3;
    const F1 = (x) => 3 * (x - 1) * (x - 5);
    const F2 = (x) => 6 * (x - 3);
    const X0 = -0.6, X1 = 6.6;
    const xt = [[0, "0"], [1, "1"], [3, "3"], [5, "5"]];
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const d1 = F1(x), d2 = F2(x);
      Plot.tex(read, `$f'(x)=${d1.toFixed(2)}$<small>$f''(x)=${d2.toFixed(2)}$</small>`);
      const near = (t) => Math.abs(x - t) < 0.08;
      let msg, good = false;
      if (near(1)) { msg = "x = 1：f′ 由正穿过 0 往下走，f″(1) = −12 < 0。峰顶，极大值 f(1) = 10。"; good = true; }
      else if (near(5)) { msg = "x = 5：f′ 由负穿过 0 往上走，f″(5) = 12 > 0。谷底，极小值 f(5) = −22。"; good = true; }
      else if (near(3)) { msg = "x = 3：f′ 在这里最低，f″ = 0 且两侧变号。(3, −6) 是拐点，不是驻点。"; good = true; }
      else if (x < 3) msg = "f″ < 0：f′ 在减小，切线在曲线上方（凹）。";
      else msg = "f″ > 0：f′ 在增大，切线在曲线下方（凸）。";
      verdict.className = "verdict" + (good ? " good" : "");
      verdict.textContent = msg;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80 || h < 160) return;
      const half = Math.floor(h * 0.55);
      const top = Plot.axes(ctx, w, half, { xMin: X0, xMax: X1, yMin: -27, yMax: 16, grid: true, xticks: xt, title: "f(x) = x³ − 9x² + 15x + 3", xlabel: "", ylabel: "f", b: 40, t: 34 });
      Plot.clip(ctx, top, () => {
        Plot.curve(ctx, top.xOf, top.yOf, F, X0, 3, 160, { color: Plot.C.danger, width: 3 });
        Plot.curve(ctx, top.xOf, top.yOf, F, 3, X1, 160, { color: Plot.C.ok, width: 3 });
        tangentLine(ctx, top.xOf, top.yOf, x, F(x), d1, 0.9);
      });
      Plot.label(ctx, "凹", top.xOf(0.2), top.yOf(-18), Plot.C.danger, 26);
      Plot.label(ctx, "凸", top.xOf(5.9), top.yOf(8), Plot.C.ok, 26);
      Plot.disc(ctx, top.xOf(1), top.yOf(10), 5, Plot.C.gold);
      Plot.disc(ctx, top.xOf(5), top.yOf(-22), 5, Plot.C.gold);
      Plot.disc(ctx, top.xOf(3), top.yOf(-6), 5, Plot.C.teal);
      Plot.disc(ctx, top.xOf(x), top.yOf(F(x)), 6, Plot.C.burgundy);
      ctx.save();
      ctx.translate(0, half);
      const bot = Plot.axes(ctx, w, h - half, { xMin: X0, xMax: X1, yMin: -15, yMax: 30, grid: true, xticks: xt, title: "导函数 f′(x)，它的斜率是 f″", xlabel: "x", ylabel: "f′", t: 34 });
      Plot.clip(ctx, bot, () => {
        Plot.fillBetween(ctx, bot.xOf, bot.yOf, F1, X0, X1, { color: "rgba(44,107,69,0.16)", neg: "rgba(156,47,47,0.16)" });
        Plot.curve(ctx, bot.xOf, bot.yOf, F1, X0, X1, 200, { color: Plot.C.burgundy, width: 2.6 });
        tangentLine(ctx, bot.xOf, bot.yOf, x, d1, d2, 0.7);
      });
      Plot.disc(ctx, bot.xOf(x), bot.yOf(d1), 6, Plot.C.burgundy);
      ctx.restore();
      Plot.dashed(ctx, top.xOf(x), top.yOf(Math.max(-27, Math.min(16, F(x)))), top.xOf(x), half + bot.yOf(d1), "rgba(176,122,40,0.6)", 1.2);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    render();
  });

  if (window.FIGS) Object.assign(window.FIGS, {
    /* 课堂练 3：给的是 f′ 的图 */
    "14-fprime"(ctx, w, h) {
      const fp = (x) => -(x + 2) * (x - 1) * (x - 1) * (x - 3) / 8;
      const A = Plot.axes(ctx, w, h, {
        xMin: -2.8, xMax: 3.8, yMin: -3, yMax: 2.6, grid: true, title: "y = f′(x)（导函数）", ylabel: "f′",
        xticks: [[-2, "−2"], [0, "0"], [1, "1"], [3, "3"]], yticks: [[-2, "−2"], [0, "0"], [2, "2"]],
      });
      Plot.clip(ctx, A, () => {
        Plot.curve(ctx, A.xOf, A.yOf, fp, -2.8, 3.8, 240, { width: 3 });
      });
      [-2, 1, 3].forEach((t) => Plot.disc(ctx, A.xOf(t), A.yOf(0), 6, Plot.C.gold, Plot.C.burgundy));
    },
    /* 课堂练 4：S 形增长（示意） */
    "14-scurve"(ctx, w, h) {
      const L = (t) => 1 / (1 + Math.exp(-(t - 5)));
      const A = Plot.axes(ctx, w, h, {
        xMin: 0, xMax: 10, yMin: 0, yMax: 1.1, grid: true, title: "累计用户比例（示意）", xlabel: "时间 t", ylabel: "比例",
        xticks: [[0, "0"], [2, "2"], [4, "4"], [6, "6"], [8, "8"], [10, "10"]], yticks: [[0, "0"], [0.5, "0.5"], [1, "1"]],
      });
      Plot.dashed(ctx, A.xOf(0), A.yOf(1), A.xOf(10), A.yOf(1), Plot.C.muted, 1.4);
      Plot.curve(ctx, A.xOf, A.yOf, L, 0, 10, 200, { width: 3 });
      Plot.label(ctx, "饱和", A.xOf(8.4), A.yOf(1.03), Plot.C.muted, 22);
    },
    /* 找错 2：端点比峰还高 */
    "14-endpt"(ctx, w, h) {
      const f = (x) => x * x * x - 3 * x;
      const A = Plot.axes(ctx, w, h, {
        xMin: -3.4, xMax: 3.4, yMin: -21, yMax: 21, grid: true, title: "y = x³ − 3x，x ∈ [−3, 3]",
        xticks: [[-3, "−3"], [-1, "−1"], [0, "0"], [1, "1"], [3, "3"]], yticks: [[-18, "−18"], [0, "0"], [2, "2"], [18, "18"]],
      });
      Plot.curve(ctx, A.xOf, A.yOf, f, -3, 3, 200, { width: 3 });
      Plot.dashed(ctx, A.xOf(-3), A.yOf(2), A.xOf(3), A.yOf(2), Plot.C.gold, 1.4);
      [[-3, -18], [-1, 2], [1, -2], [3, 18]].forEach(([a, b]) => Plot.disc(ctx, A.xOf(a), A.yOf(b), 6, Plot.C.gold, Plot.C.burgundy));
      Plot.label(ctx, "极大 2", A.xOf(-2.3), A.yOf(5.5), Plot.C.burgundy, 24);
    },
  });
})();
