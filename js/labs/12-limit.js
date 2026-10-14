/* 1.2 极限：数列、左右、夹逼 */
(function () {
  Deck.on("sequence", (slide) => {
    const canvas = slide.querySelector("#seq-canvas");
    const nEl = slide.querySelector("#seq-n");
    const nVal = slide.querySelector("#seq-n-val");
    const read = slide.querySelector("#seq-read");
    function render() {
      const N = Number(nEl.value);
      nVal.textContent = N;
      const last = 1 / N;
      read.textContent = `aₙ = 1/n　·　第 ${N} 项 = ${last.toFixed(4)}　→　0`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0, xMax: Math.max(20, N + 2), yMin: -0.1, yMax: 1.15, xlabel: "n", ylabel: "a_n", title: "a_n = 1/n" });
      ctx.strokeStyle = Plot.C.gold; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(xOf(0), yOf(0)); ctx.lineTo(xOf(Math.max(20, N + 2)), yOf(0)); ctx.stroke();
      ctx.setLineDash([]);
      for (let n = 1; n <= N; n++) {
        Plot.disc(ctx, xOf(n), yOf(1 / n), n === N ? 6 : 3.5, n === N ? Plot.C.gold : Plot.C.burgundy);
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    nEl.oninput = render;
    render();
  });

  Deck.on("leftright", (slide) => {
    const canvas = slide.querySelector("#lr-canvas");
    const xEl = slide.querySelector("#lr-x");
    const xVal = slide.querySelector("#lr-x-val");
    const verdict = slide.querySelector("#lr-verdict");
    function f(x) { return x < 0 ? -1 : 1; }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = f(x);
      verdict.className = "verdict " + (Math.abs(x) < 0.08 ? "bad" : "");
      verdict.textContent = x < 0
        ? "从左边靠近 0，函数值钉在 −1。"
        : x > 0
          ? "从右边靠近 0，函数值钉在 +1。左右不同，极限不存在。"
          : "恰好在 0：可以规定 f(0)，但这改变不了左右极限打架。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -2, xMax: 2, yMin: -1.6, yMax: 1.6, title: "符号函数" });
      ctx.strokeStyle = Plot.C.burgundy; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(xOf(-2), yOf(-1)); ctx.lineTo(xOf(0), yOf(-1)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xOf(0), yOf(1)); ctx.lineTo(xOf(2), yOf(1)); ctx.stroke();
      Plot.disc(ctx, xOf(0), yOf(-1), 5, Plot.C.card, Plot.C.burgundy);
      Plot.disc(ctx, xOf(0), yOf(1), 5, Plot.C.burgundy);
      Plot.disc(ctx, xOf(x === 0 ? 0.001 : x), yOf(y), 6, Plot.C.gold);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    render();
  });

  Deck.on("squeeze", (slide) => {
    const canvas = slide.querySelector("#sq-canvas");
    const zEl = slide.querySelector("#sq-z");
    const zVal = slide.querySelector("#sq-z-val");
    const verdict = slide.querySelector("#sq-verdict");
    function render() {
      const z = Number(zEl.value);
      zVal.textContent = z.toFixed(2);
      verdict.textContent = "振荡很凶，但仍被 ±x 夹住。夹逼：两边都进 0，中间也只能进 0。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -z, xMax: z, yMin: -z, yMax: z, title: "x sin(1/x)" });
      Plot.curve(ctx, xOf, yOf, (x) => x, -z, z, 40, { color: Plot.C.gold, width: 1.4 });
      Plot.curve(ctx, xOf, yOf, (x) => -x, -z, z, 40, { color: Plot.C.gold, width: 1.4 });
      Plot.curve(ctx, xOf, yOf, (x) => x === 0 ? 0 : x * Math.sin(1 / x), -z, z, 800);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    zEl.oninput = render;
    render();
  });

  function frame(canvas, opt) {
    const { ctx, w, h } = Deck.fitCanvas(canvas);
    if (w < 40 || h < 40) return null;
    const axes = Plot.axes(ctx, w, h, Object.assign({
      xlabel: "", ylabel: "", title: "", ticks: false,
      l: 14, r: 8, t: 10, b: 12,
    }, opt));
    return { ctx, xOf: axes.xOf, yOf: axes.yOf };
  }

  function segment(ctx, xOf, yOf, x0, y0, x1, y1) {
    ctx.strokeStyle = Plot.C.burgundy;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(xOf(x0), yOf(y0));
    ctx.lineTo(xOf(x1), yOf(y1));
    ctx.stroke();
  }

  Deck.on("gaps", (slide) => {
    function render() {
      const rem = frame(slide.querySelector("#gap-rem"), { xMin: -0.4, xMax: 2.8, yMin: -0.4, yMax: 4 });
      if (rem) {
        Plot.curve(rem.ctx, rem.xOf, rem.yOf, (x) => x + 1, -0.2, 2.6, 2);
        Plot.disc(rem.ctx, rem.xOf(1), rem.yOf(2), 6, Plot.C.card, Plot.C.burgundy);
        Plot.disc(rem.ctx, rem.xOf(1), rem.yOf(0.6), 6, Plot.C.burgundy);
      }
      const jump = frame(slide.querySelector("#gap-jump"), { xMin: -2.2, xMax: 2.2, yMin: -1.8, yMax: 1.8 });
      if (jump) {
        segment(jump.ctx, jump.xOf, jump.yOf, -2, -1, 0, -1);
        segment(jump.ctx, jump.xOf, jump.yOf, 0, 1, 2, 1);
        Plot.disc(jump.ctx, jump.xOf(0), jump.yOf(-1), 6, Plot.C.card, Plot.C.burgundy);
        Plot.disc(jump.ctx, jump.xOf(0), jump.yOf(1), 6, Plot.C.burgundy);
      }
      const inf = frame(slide.querySelector("#gap-inf"), { xMin: -2.4, xMax: 2.4, yMin: -4.2, yMax: 4.2 });
      if (inf) {
        inf.ctx.setLineDash([5, 4]);
        inf.ctx.strokeStyle = Plot.C.gold;
        inf.ctx.lineWidth = 2;
        inf.ctx.beginPath();
        inf.ctx.moveTo(inf.xOf(0), inf.yOf(-4));
        inf.ctx.lineTo(inf.xOf(0), inf.yOf(4));
        inf.ctx.stroke();
        inf.ctx.setLineDash([]);
        Plot.curve(inf.ctx, inf.xOf, inf.yOf, (x) => 1 / x, -2.2, -0.28, 40);
        Plot.curve(inf.ctx, inf.xOf, inf.yOf, (x) => 1 / x, 0.28, 2.2, 40);
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    render();
  });

  Deck.on("limits2", (slide) => {
    function render() {
      const sinc = frame(slide.querySelector("#lim-sinc"), { xMin: -10, xMax: 10, yMin: -0.35, yMax: 1.35 });
      if (sinc) {
        sinc.ctx.setLineDash([5, 4]);
        sinc.ctx.strokeStyle = Plot.C.gold;
        sinc.ctx.lineWidth = 2;
        sinc.ctx.beginPath();
        sinc.ctx.moveTo(sinc.xOf(-10), sinc.yOf(1));
        sinc.ctx.lineTo(sinc.xOf(10), sinc.yOf(1));
        sinc.ctx.stroke();
        sinc.ctx.setLineDash([]);
        Plot.curve(sinc.ctx, sinc.xOf, sinc.yOf, (x) => Math.sin(x) / x, -9.5, -0.35, 80);
        Plot.curve(sinc.ctx, sinc.xOf, sinc.yOf, (x) => Math.sin(x) / x, 0.35, 9.5, 80);
        Plot.disc(sinc.ctx, sinc.xOf(0), sinc.yOf(1), 6, Plot.C.card, Plot.C.burgundy);
      }
      const exp = frame(slide.querySelector("#lim-exp"), { xMin: 0, xMax: 40, yMin: 1.5, yMax: 3.15 });
      if (exp) {
        const e = Math.E;
        exp.ctx.setLineDash([5, 4]);
        exp.ctx.strokeStyle = Plot.C.gold;
        exp.ctx.lineWidth = 2;
        exp.ctx.beginPath();
        exp.ctx.moveTo(exp.xOf(0), exp.yOf(e));
        exp.ctx.lineTo(exp.xOf(40), exp.yOf(e));
        exp.ctx.stroke();
        exp.ctx.setLineDash([]);
        Plot.curve(exp.ctx, exp.xOf, exp.yOf, (t) => Math.pow(1 + 1 / t, t), 1, 40, 80);
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    render();
  });
})();
