/* 2.2 矩阵：行×列；AB≠BA */
(function () {
  Deck.on("matmul", (slide) => {
    const canvas = slide.querySelector("#mm-canvas");
    const iEl = slide.querySelector("#mm-i");
    const jEl = slide.querySelector("#mm-j");
    const read = slide.querySelector("#mm-read");
    const A = [[1, 2], [3, 4]];
    const B = [[0, 1], [1, 0]];
    function render() {
      const i = Number(iEl.value), j = Number(jEl.value);
      slide.querySelector("#mm-i-val").textContent = i + 1;
      slide.querySelector("#mm-j-val").textContent = j + 1;
      const val = A[i][0] * B[0][j] + A[i][1] * B[1][j];
      read.textContent = `（AB）第 ${i + 1} 行第 ${j + 1} 列 = ${A[i][0]}·${B[0][j]} + ${A[i][1]}·${B[1][j]} = ${val}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      function mat(M, x, y, hiRow, hiCol, title) {
        ctx.fillStyle = Plot.C.muted;
        ctx.font = "24px 'Noto Serif SC', serif";
        ctx.textAlign = "left";
        ctx.fillText(title, x, y - 14);
        const s = 72;
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 2; c++) {
            const hit = r === hiRow || c === hiCol;
            ctx.fillStyle = hit ? "rgba(107,20,86,0.18)" : Plot.C.paper;
            ctx.strokeStyle = Plot.C.burgundy;
            ctx.strokeRect(x + c * s, y + r * s, s - 6, s - 6);
            ctx.fillRect(x + c * s, y + r * s, s - 6, s - 6);
            ctx.fillStyle = Plot.C.ink;
            ctx.font = "32px 'Noto Serif SC', serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(String(M[r][c]), x + c * s + (s - 6) / 2, y + r * s + (s - 6) / 2);
          }
        }
      }
      mat(A, 40, 70, i, -1, "A 取第 " + (i + 1) + " 行");
      mat(B, 220, 70, -1, j, "B 取第 " + (j + 1) + " 列");
      ctx.fillStyle = Plot.C.burgundy;
      ctx.font = "32px 'Noto Serif SC', serif";
      ctx.fillText("→  " + val, 500, 145);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    iEl.oninput = render; jEl.oninput = render;
    render();
  });

  Deck.on("abba", (slide) => {
    const canvas = slide.querySelector("#abba-canvas");
    const btns = [...slide.querySelectorAll("[data-prod]")];
    const read = slide.querySelector("#abba-read");
    const AB = [[1, 0], [0, 0]], BA = [[0, 0], [0, 1]];
    function render() {
      const which = slide.dataset.prod || "ab";
      const M = which === "ab" ? AB : BA;
      read.textContent = which === "ab" ? "AB = [[1,0],[0,0]]" : "BA = [[0,0],[0,1]]　·　AB ≠ BA";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      const s = 80, ox = w / 2 - s, oy = h / 2 - s;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          ctx.strokeStyle = Plot.C.burgundy;
          ctx.strokeRect(ox + j * s, oy + i * s, s - 10, s - 10);
          ctx.fillStyle = Plot.C.ink;
          ctx.font = "36px 'Noto Serif SC', serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(String(M[i][j]), ox + j * s + (s - 10) / 2, oy + i * s + (s - 10) / 2);
        }
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    btns.forEach((b) => {
      b.onclick = () => {
        slide.dataset.prod = b.dataset.prod;
        btns.forEach((x) => x.classList.toggle("on", x === b));
        render();
      };
    });
    render();
  });

  Deck.on("linxf", (slide) => {
    const canvas = slide.querySelector("#lin-canvas");
    const els = ["a", "b", "c", "d"].map((k) => slide.querySelector("#lin-" + k));
    const vals = ["a", "b", "c", "d"].map((k) => slide.querySelector("#lin-" + k + "-val"));
    const read = slide.querySelector("#lin-read");
    const verd = slide.querySelector("#lin-verdict");
    function render() {
      const a = Number(els[0].value), b = Number(els[1].value);
      const c = Number(els[2].value), d = Number(els[3].value);
      vals[0].textContent = a.toFixed(1);
      vals[1].textContent = b.toFixed(1);
      vals[2].textContent = c.toFixed(1);
      vals[3].textContent = d.toFixed(1);
      const det = a * d - b * c;
      read.textContent = `A = [[${a.toFixed(1)}, ${b.toFixed(1)}], [${c.toFixed(1)}, ${d.toFixed(1)}]]　·　det = ${det.toFixed(2)}`;
      verd.textContent = Math.abs(det) < 1e-6
        ? "行列式为 0：正方形被压成一条线段，矩阵不可逆。"
        : "有向面积倍数 = det；符号表示定向是否翻转。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      const ox = w / 2, oy = h / 2, s = Math.min(w, h) * 0.28;
      function map(x, y) {
        return [ox + (a * x + b * y) * s, oy - (c * x + d * y) * s];
      }
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 1;
      for (let t = -2; t <= 2; t++) {
        ctx.beginPath(); ctx.moveTo(ox + t * s, oy - 2.2 * s); ctx.lineTo(ox + t * s, oy + 2.2 * s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 2.2 * s, oy - t * s); ctx.lineTo(ox + 2.2 * s, oy - t * s); ctx.stroke();
      }
      const corners = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => map(x, y));
      ctx.beginPath();
      ctx.moveTo(corners[0][0], corners[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(corners[i][0], corners[i][1]);
      ctx.closePath();
      ctx.fillStyle = "rgba(107,20,86,0.18)";
      ctx.fill();
      ctx.strokeStyle = Plot.C.burgundy;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = Plot.C.ink;
      ctx.font = "22px 'Noto Serif SC', serif";
      ctx.textAlign = "left";
      ctx.fillText("单位正方形 → 像", 16, 28);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    els.forEach((el) => { el.oninput = render; });
    render();
  });
})();
