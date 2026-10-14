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
})();
