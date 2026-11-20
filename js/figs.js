/* 课堂练配图：静态图，不带控件。页上 <canvas data-fig="名字">，在 FIGS 里登记画法。 */
(function () {
  const PI = Math.PI;
  const C = Plot.C;

  const FIGS = {
    sinsym(ctx, w, h) {
      const { xOf, yOf } = Plot.axes(ctx, w, h, {
        xMin: -0.2, xMax: PI + 0.2, yMin: -0.2, yMax: 1.25, grid: true, title: "y = sin x",
        xticks: [[0, "0"], [PI / 2, "π/2"], [PI, "π"]], yticks: [[0, "0"], [1, "1"]],
      });
      Plot.fillBetween(ctx, xOf, yOf, Math.sin, 0, PI / 2, { color: "rgba(107,20,86,0.24)" });
      Plot.fillBetween(ctx, xOf, yOf, Math.sin, PI / 2, PI, { color: "rgba(27,95,92,0.22)" });
      Plot.curve(ctx, xOf, yOf, Math.sin, -0.2, PI + 0.2, 200);
      Plot.dashed(ctx, xOf(PI / 2), yOf(0), xOf(PI / 2), yOf(1.2));
    },
    lorenz(ctx, w, h) {
      const { xOf, yOf } = Plot.axes(ctx, w, h, {
        xMin: 0, xMax: 1, yMin: 0, yMax: 1, grid: true, xlabel: "人口比例", ylabel: "收入比例",
        xticks: [[0, "0"], [0.5, "0.5"], [1, "1"]], yticks: [[0, "0"], [0.5, "0.5"], [1, "1"]],
      });
      Plot.fillBetween(ctx, xOf, yOf, (x) => x, 0, 1, { g: (x) => x * x, color: "rgba(107,20,86,0.22)" });
      Plot.curve(ctx, xOf, yOf, (x) => x, 0, 1, 2, { color: C.gold, width: 2 });
      Plot.curve(ctx, xOf, yOf, (x) => x * x, 0, 1, 120);
      Plot.label(ctx, "绝对平均 y = x", xOf(0.08), yOf(0.62), C.gold, 24);
      Plot.label(ctx, "L(x) = x²", xOf(0.62), yOf(0.22), C.burgundy, 24);
    },
    inv2(ctx, w, h) {
      const f = (x) => (Math.abs(x) < 0.08 ? NaN : 1 / (x * x));
      const A = Plot.axes(ctx, w, h, {
        xMin: -1.2, xMax: 1.2, yMin: -0.5, yMax: 12, grid: true, title: "y = 1/x²",
        xticks: [[-1, "−1"], [0, "0"], [1, "1"]],
      });
      const { xOf, yOf } = A;
      Plot.clip(ctx, A, () => {
        Plot.fillBetween(ctx, xOf, yOf, f, -1, -0.08, { color: "rgba(107,20,86,0.2)", n: 120 });
        Plot.fillBetween(ctx, xOf, yOf, f, 0.08, 1, { color: "rgba(107,20,86,0.2)", n: 120 });
        Plot.curve(ctx, xOf, yOf, f, -1.2, -0.08, 160);
        Plot.curve(ctx, xOf, yOf, f, 0.08, 1.2, 160);
      });
      Plot.dashed(ctx, xOf(0), yOf(-0.4), xOf(0), yOf(11.8), C.danger);
    },
  };

  Deck.on("figs", (slide) => {
    slide.querySelectorAll("canvas[data-fig]").forEach((cv) => {
      const fn = FIGS[cv.dataset.fig];
      if (!fn) return;
      const { ctx, w, h } = Deck.fitCanvas(cv);
      if (w < 80 || h < 80) return;
      fn(ctx, w, h);
    });
  });

  window.FIGS = FIGS;
})();
