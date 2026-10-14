/* 1.3 导数：割线 → 切线；|x| 尖点 */
(function () {
  const f = (x) => x * x;
  const fp = (x) => 2 * x;

  Deck.on("secant", (slide) => {
    const canvas = slide.querySelector("#secant-canvas");
    const hEl = slide.querySelector("#secant-h");
    const hVal = slide.querySelector("#secant-h-val");
    const read = slide.querySelector("#secant-read");
    function render() {
      const h = Number(hEl.value);
      hVal.textContent = h.toFixed(2);
      const x0 = 1;
      const slope = (f(x0 + h) - f(x0)) / h;
      read.textContent = `差商 = ${slope.toFixed(3)}　·　真导数 f'(1)=2`;
      const { ctx, w, h: boxH } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, boxH, { xMin: -0.2, xMax: 2.4, yMin: -0.3, yMax: 5.2, title: "y = x² 在 x=1" });
      Plot.curve(ctx, xOf, yOf, f, -0.2, 2.4, 80);
      const y0 = f(x0), y1 = f(x0 + h);
      ctx.strokeStyle = Plot.C.gold; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xOf(x0 - 0.8), yOf(y0 - 0.8 * slope));
      ctx.lineTo(xOf(x0 + 1.2), yOf(y0 + 1.2 * slope));
      ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = Plot.C.teal;
      ctx.beginPath();
      ctx.moveTo(xOf(x0 - 0.8), yOf(y0 - 0.8 * fp(x0)));
      ctx.lineTo(xOf(x0 + 1.2), yOf(y0 + 1.2 * fp(x0)));
      ctx.stroke(); ctx.setLineDash([]);
      Plot.disc(ctx, xOf(x0), yOf(y0), 5, Plot.C.burgundy);
      Plot.disc(ctx, xOf(x0 + h), yOf(y1), 5, Plot.C.gold);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    hEl.oninput = render;
    render();
  });

  Deck.on("corner", (slide) => {
    const canvas = slide.querySelector("#corner-canvas");
    const xEl = slide.querySelector("#corner-x");
    const xVal = slide.querySelector("#corner-x-val");
    const verdict = slide.querySelector("#corner-verdict");
    function f(x) { return Math.abs(x); }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const left = x < 0 || Math.abs(x) < 1e-6;
      verdict.className = "verdict " + (Math.abs(x) < 0.08 ? "bad" : "");
      verdict.textContent = Math.abs(x) < 0.08
        ? "左右差商分别趋向 −1 与 +1。尖点连续，但没有唯一切线。"
        : x < 0 ? "左侧局部是直线 y=−x，斜率 −1。" : "右侧局部是 y=x，斜率 +1。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -2, xMax: 2, yMin: -0.3, yMax: 2.2, title: "y = |x|" });
      Plot.curve(ctx, xOf, yOf, f, -2, 2, 80);
      Plot.disc(ctx, xOf(x), yOf(f(x)), 6, Plot.C.gold);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    render();
  });

  function tangent(ctx, xOf, yOf, x0, y0, slope, half) {
    ctx.strokeStyle = Plot.C.gold;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(xOf(x0 - half), yOf(y0 - half * slope));
    ctx.lineTo(xOf(x0 + half), yOf(y0 + half * slope));
    ctx.stroke();
  }

  function frame(canvas, opt) {
    const { ctx, w, h } = Deck.fitCanvas(canvas);
    if (w < 40 || h < 40) return null;
    const axes = Plot.axes(ctx, w, h, Object.assign({
      xlabel: "", ylabel: "", title: "", ticks: false,
      l: 14, r: 8, t: 10, b: 12,
    }, opt));
    return { ctx, xOf: axes.xOf, yOf: axes.yOf };
  }

  Deck.on("quotchain", (slide) => {
    function render() {
      const tan = frame(slide.querySelector("#qc-tan"), { xMin: -1.35, xMax: 1.35, yMin: -3.2, yMax: 3.2 });
      if (tan) {
        Plot.curve(tan.ctx, tan.xOf, tan.yOf, Math.tan, -1.2, 1.2, 90);
        const x0 = 0.7, y0 = Math.tan(x0), slope = 1 / (Math.cos(x0) ** 2);
        tangent(tan.ctx, tan.xOf, tan.yOf, x0, y0, slope, 0.38);
        Plot.disc(tan.ctx, tan.xOf(x0), tan.yOf(y0), 5, Plot.C.gold);
      }
      const ln = frame(slide.querySelector("#qc-ln"), { xMin: -1.35, xMax: 1.35, yMin: -1.5, yMax: 0.55 });
      if (ln) {
        Plot.curve(ln.ctx, ln.xOf, ln.yOf, (x) => Math.log(Math.cos(x)), -1.2, 1.2, 90);
        const x0 = 0.7, y0 = Math.log(Math.cos(x0)), slope = -Math.tan(x0);
        tangent(ln.ctx, ln.xOf, ln.yOf, x0, y0, slope, 0.4);
        Plot.disc(ln.ctx, ln.xOf(x0), ln.yOf(y0), 5, Plot.C.gold);
      }
      const sine = frame(slide.querySelector("#qc-sin"), { xMin: -0.7, xMax: 0.7, yMin: -2.3, yMax: 2.3 });
      if (sine) {
        sine.ctx.setLineDash([5, 4]);
        sine.ctx.strokeStyle = Plot.C.teal;
        sine.ctx.lineWidth = 2;
        sine.ctx.beginPath();
        sine.ctx.moveTo(sine.xOf(-0.65), sine.yOf(-0.65));
        sine.ctx.lineTo(sine.xOf(0.65), sine.yOf(0.65));
        sine.ctx.stroke();
        sine.ctx.setLineDash([]);
        Plot.curve(sine.ctx, sine.xOf, sine.yOf, (x) => Math.sin(5 * x), -0.65, 0.65, 120);
        tangent(sine.ctx, sine.xOf, sine.yOf, 0, 0, 5, 0.36);
        Plot.disc(sine.ctx, sine.xOf(0), sine.yOf(0), 5, Plot.C.gold);
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    render();
  });
})();
