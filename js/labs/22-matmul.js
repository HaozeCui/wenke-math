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
})();
