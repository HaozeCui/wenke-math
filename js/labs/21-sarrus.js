/* 2.1 行列式：沙流法则 */
(function () {
  const A = [[1, 2, 3], [0, 4, 5], [0, 0, 6]];
  const terms = [
    { name: "主对角 1·4·6", sign: 1, cells: [[0, 0], [1, 1], [2, 2]], val: 24 },
    { name: "右绕 2·5·0", sign: 1, cells: [[0, 1], [1, 2], [2, 0]], val: 0 },
    { name: "再绕 3·0·0", sign: 1, cells: [[0, 2], [1, 0], [2, 1]], val: 0 },
    { name: "反对角 3·4·0", sign: -1, cells: [[0, 2], [1, 1], [2, 0]], val: 0 },
    { name: "左绕 1·5·0", sign: -1, cells: [[0, 0], [1, 2], [2, 1]], val: 0 },
    { name: "再绕 2·0·6", sign: -1, cells: [[0, 1], [1, 0], [2, 2]], val: 0 },
  ];

  Deck.on("sarrus", (slide) => {
    const canvas = slide.querySelector("#sarrus-canvas");
    const kEl = slide.querySelector("#sarrus-k");
    const kVal = slide.querySelector("#sarrus-k-val");
    const read = slide.querySelector("#sarrus-read");
    function render() {
      const k = Number(kEl.value);
      const t = terms[k];
      kVal.textContent = `${k + 1} / 6`;
      read.textContent = `${t.sign > 0 ? "+" : "−"} ${t.name} = ${t.sign * t.val}　·　上三角立刻看出 det=24`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      const s = Math.min(w, h) * 0.22, ox = w * 0.28, oy = h * 0.22;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const hit = t.cells.some(([a, b]) => a === i && b === j);
          ctx.fillStyle = hit ? "rgba(107,20,86,0.2)" : Plot.C.paper;
          ctx.strokeStyle = hit ? Plot.C.burgundy : Plot.C.rule;
          ctx.lineWidth = hit ? 2.4 : 1;
          ctx.beginPath();
          ctx.rect(ox + j * s, oy + i * s, s - 8, s - 8);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = Plot.C.ink;
          ctx.font = "32px 'Noto Serif SC', serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(String(A[i][j]), ox + j * s + (s - 8) / 2, oy + i * s + (s - 8) / 2);
        }
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    kEl.oninput = render;
    render();
  });
})();
