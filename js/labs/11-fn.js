/* 1.1 函数：分段、取整、复合 */
(function () {
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
      read.textContent = `x = ${x.toFixed(2)}　时　|x−1| = ${y.toFixed(2)}　·　${x < 1 ? "左支斜率 −1" : x > 1 ? "右支斜率 +1" : "折点"}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -1.5, xMax: 3.5, yMin: -0.4, yMax: 3.2, title: "y = |x−1|" });
      Plot.curve(ctx, xOf, yOf, f, -1.5, 3.5, 200);
      Plot.disc(ctx, xOf(x), yOf(y), 6, Plot.C.gold);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    render();
  });

  Deck.on("floorfn", (slide) => {
    const canvas = slide.querySelector("#floor-canvas");
    const xEl = slide.querySelector("#floor-x");
    const xVal = slide.querySelector("#floor-x-val");
    const read = slide.querySelector("#floor-read");
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = Math.floor(x);
      read.textContent = `[${x.toFixed(2)}] = ${y}　（实心在左端，空心在右端）`;
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
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    render();
  });

  Deck.on("compose", (slide) => {
    const canvas = slide.querySelector("#compose-canvas");
    const xEl = slide.querySelector("#compose-x");
    const xVal = slide.querySelector("#compose-x-val");
    const read = slide.querySelector("#compose-read");
    function g(x) { return 0.5 * x + 1; }
    function f(u) { return u * u; }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(1);
      const u = g(x), y = f(u);
      read.innerHTML = `x=${x.toFixed(1)} → g(x)=${u.toFixed(2)} → f(g(x))=${y.toFixed(2)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      const boxes = [
        [w * 0.08, h * 0.38, "x", x.toFixed(1)],
        [w * 0.38, h * 0.38, "g", u.toFixed(2)],
        [w * 0.68, h * 0.38, "f∘g", y.toFixed(2)],
      ];
      ctx.strokeStyle = Plot.C.gold; ctx.fillStyle = Plot.C.gold; ctx.lineWidth = 2;
      boxes.slice(0, -1).forEach((b, i) => {
        const n = boxes[i + 1];
        ctx.beginPath(); ctx.moveTo(b[0] + 96, h * 0.5); ctx.lineTo(n[0] - 8, h * 0.5); ctx.stroke();
      });
      boxes.forEach(([bx, by, lab, val]) => {
        ctx.fillStyle = Plot.C.burgundy;
        ctx.fillRect(bx, by, 100, 100);
        ctx.fillStyle = Plot.C.paper;
        ctx.font = "24px 'Noto Serif SC', serif";
        ctx.textAlign = "center";
        ctx.fillText(lab, bx + 50, by + 36);
        ctx.font = "28px 'Noto Serif SC', serif";
        ctx.fillText(val, bx + 50, by + 72);
      });
      Plot.label(ctx, "货币 → 黄金 → 货币：先 g 后 f，不能写反。", 24, 28);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    render();
  });
})();
