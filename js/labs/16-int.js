/* 1.6 定积分：黎曼和 + 有号面积 */
(function () {
  const PI = Math.PI;
  const f = (x) => Math.sin(x);
  const TRUE = 2;

  function sum(n, method) {
    const dx = PI / n;
    let s = 0;
    for (let i = 0; i < n; i++) {
      let x;
      if (method === "left") x = i * dx;
      else if (method === "right") x = (i + 1) * dx;
      else x = (i + 0.5) * dx;
      s += f(x) * dx;
    }
    return s;
  }

  function drawRiemann(canvas, n, method) {
    const { ctx, w, h } = Deck.fitCanvas(canvas);
    if (w < 80 || h < 80) return;
    const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0, xMax: PI, yMin: -0.15, yMax: 1.25, xlabel: "x", ylabel: "y", title: "y = sin x", ticks: false });
    const dx = PI / n;
    for (let i = 0; i < n; i++) {
      let x;
      if (method === "left") x = i * dx;
      else if (method === "right") x = (i + 1) * dx;
      else x = (i + 0.5) * dx;
      const y = f(x);
      const x0 = xOf(i * dx), x1 = xOf((i + 1) * dx);
      const yb = yOf(0), yt = yOf(y);
      ctx.fillStyle = "rgba(107, 20, 86, 0.22)";
      ctx.strokeStyle = "rgba(107, 20, 86, 0.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(x0, Math.min(yt, yb), Math.max(1, x1 - x0), Math.abs(yb - yt));
      ctx.fill(); ctx.stroke();
    }
    Plot.curve(ctx, xOf, yOf, f, 0, PI, 240);
    ctx.fillStyle = Plot.C.muted;
    ctx.font = "26px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText("0", xOf(0), h - 16);
    ctx.fillText("π", xOf(PI), h - 16);
  }

  Deck.on("riemann", (slide) => {
    const canvas = slide.querySelector("#riemann-canvas");
    const nEl = slide.querySelector("#riemann-n");
    const nVal = slide.querySelector("#riemann-n-val");
    const sumEl = slide.querySelector("#riemann-sum");
    const errEl = slide.querySelector("#riemann-err");
    const verdict = slide.querySelector("#riemann-verdict");
    const methods = [...slide.querySelectorAll("[data-method]")];
    if (slide.dataset.bound) {
      drawRiemann(canvas, Number(nEl.value), slide.dataset.method || "mid");
      return;
    }
    slide.dataset.bound = "1";
    let method = "mid";
    slide.dataset.method = method;
    let playing = false;
    function render() {
      const n = Number(nEl.value);
      nVal.textContent = n;
      const s = sum(n, method);
      sumEl.innerHTML = `矩形和　${s.toFixed(4)}`;
      errEl.textContent = `与真值 2 的差　${(s - TRUE).toFixed(4)}`;
      const close = Math.abs(s - TRUE) < 0.008 && n >= 20;
      verdict.className = "verdict " + (close ? "good" : "");
      verdict.textContent = close
        ? "加密之后，矩形堆起来的数已经贴着面积 2。这就是定积分。"
        : "矩形只是近似。把 n 拉大，看误差怎样被逼没。";
      drawRiemann(canvas, n, method);
    }
    methods.forEach((btn) => {
      btn.onclick = () => {
        method = btn.dataset.method;
        slide.dataset.method = method;
        methods.forEach((b) => b.classList.toggle("on", b === btn));
        render();
      };
    });
    nEl.oninput = render;
    const playBtn = slide.querySelector("#riemann-play");
    playBtn.onclick = () => {
      if (playing) { playing = false; playBtn.textContent = "播放"; return; }
      playing = true;
      playBtn.textContent = "暂停";
      let n = Number(nEl.value);
      const tick = () => {
        if (!playing) { playBtn.textContent = "播放"; return; }
        render();
        if (n >= 48) { playing = false; playBtn.textContent = "播放"; return; }
        n += n < 16 ? 1 : 2;
        nEl.value = n;
        requestAnimationFrame(() => setTimeout(tick, 70));
      };
      tick();
    };
    render();
  });

  function g(x) { return Math.sin(x); }
  function drawSigned(canvas, show) {
    const { ctx, w, h } = Deck.fitCanvas(canvas);
    if (w < 80 || h < 80) return;
    const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -PI, xMax: PI, yMin: -1.3, yMax: 1.3, xlabel: "x", title: "y = sin x", ticks: false });
    const n = 200;
    for (let i = 0; i < n; i++) {
      const x0 = -PI + (i / n) * 2 * PI;
      const x1 = -PI + ((i + 1) / n) * 2 * PI;
      const y = g((x0 + x1) / 2);
      if (show === "pos" && y < 0) continue;
      if (show === "neg" && y > 0) continue;
      ctx.fillStyle = y >= 0 ? "rgba(107,20,86,0.28)" : "rgba(156,47,47,0.28)";
      const yb = yOf(0), yt = yOf(y);
      ctx.fillRect(xOf(x0), Math.min(yb, yt), Math.max(1, xOf(x1) - xOf(x0)), Math.abs(yt - yb));
    }
    Plot.curve(ctx, xOf, yOf, g, -PI, PI, 240);
  }

  Deck.on("signed", (slide) => {
    const canvas = slide.querySelector("#signed-canvas");
    const btns = [...slide.querySelectorAll("[data-signed]")];
    const verdict = slide.querySelector("#signed-verdict");
    if (slide.dataset.bound) {
      drawSigned(canvas, slide.dataset.signed || "all");
      return;
    }
    slide.dataset.bound = "1";
    let mode = "all";
    function render() {
      drawSigned(canvas, mode);
      verdict.textContent = mode === "all"
        ? "轴上为正、轴下为负。从 −π 到 π，正负抵消，代数和是 0。"
        : mode === "pos"
          ? "只看轴上方：两块正面积，几何面积是 4。"
          : "只看轴下方：两块负面积。定积分问的是代数和，不是「涂色多少」。";
    }
    btns.forEach((b) => {
      b.onclick = () => {
        mode = b.dataset.signed;
        slide.dataset.signed = mode;
        btns.forEach((x) => x.classList.toggle("on", x === b));
        render();
      };
    });
    render();
  });
})();
