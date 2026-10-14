/* 1.5 不定积分：原函数族 +C */
(function () {
  Deck.on("family", (slide) => {
    const canvas = slide.querySelector("#family-canvas");
    const cEl = slide.querySelector("#family-c");
    const cVal = slide.querySelector("#family-c-val");
    const read = slide.querySelector("#family-read");
    function render() {
      const C = Number(cEl.value);
      cVal.textContent = C.toFixed(1);
      read.textContent = `x² + C，当前 C = ${C.toFixed(1)}。求导后 C 消失，都回到 2x。`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -2.2, xMax: 2.2, yMin: -2, yMax: 6, title: "∫ 2x dx = x² + C" });
      for (const k of [-2, -1, 0, 1, 2, 3]) {
        Plot.curve(ctx, xOf, yOf, (x) => x * x + k, -2.2, 2.2, 60, { color: "rgba(107,20,86,0.18)", width: 1.2 });
      }
      Plot.curve(ctx, xOf, yOf, (x) => x * x + C, -2.2, 2.2, 80);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    cEl.oninput = render;
    render();
  });
})();
