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

  function bind(slide, render, wire) {
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    wire();
    render();
  }

  /* 变上限积分：上图是 f 与 0 到 x 的有号面积，下图是积累量 F(x)；F 在 x 处的斜率等于 f(x) */
  Deck.on("accum", (slide) => {
    const canvas = slide.querySelector("#accum-canvas");
    const xEl = slide.querySelector("#accum-x");
    const xVal = slide.querySelector("#accum-x-val");
    const read = slide.querySelector("#accum-read");
    const verdict = slide.querySelector("#accum-verdict");
    const F = (x) => 1 - Math.cos(x);
    const xt = [[0, "0"], [PI / 2, "π/2"], [PI, "π"], [3 * PI / 2, "3π/2"], [2 * PI, "2π"]];
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      Plot.tex(read, `$f(x)=\\sin x=${Math.sin(x).toFixed(2)}$<small>$F(x)=\\int_0^x\\sin t\\,dt=${F(x).toFixed(2)}$</small>`);
      const nearPi = Math.abs(x - PI) < 0.08, near2 = x > 2 * PI - 0.08;
      verdict.className = "verdict" + (nearPi || near2 ? " good" : "");
      verdict.textContent = nearPi
        ? "x = π：f 由正变负，积累量 F 在这里最大，等于 2。"
        : near2
          ? "x = 2π：轴下的负面积把前面的 2 全部抵消，F 回到 0。"
          : Math.sin(x) > 0
            ? "f > 0：每往右一步都在加正面积，F 上升。下图切线的斜率就是上图曲线的高度。"
            : "f < 0：新加进来的是负面积，F 下降。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80 || h < 160) return;
      const half = Math.floor(h / 2);
      ctx.save();
      const top = Plot.axes(ctx, w, half, { xMin: 0, xMax: 2 * PI, yMin: -1.25, yMax: 1.25, grid: true, xticks: xt, yticks: [[-1, "−1"], [0, "0"], [1, "1"]], title: "被积函数 f(t) = sin t", xlabel: "", ylabel: "f", b: 40, t: 34 });
      Plot.fillBetween(ctx, top.xOf, top.yOf, Math.sin, 0, x, { color: "rgba(107,20,86,0.28)", neg: "rgba(156,47,47,0.28)" });
      Plot.curve(ctx, top.xOf, top.yOf, Math.sin, 0, 2 * PI, 240);
      Plot.disc(ctx, top.xOf(x), top.yOf(Math.sin(x)), 6, Plot.C.gold);
      ctx.restore();
      ctx.save();
      ctx.translate(0, half);
      const bot = Plot.axes(ctx, w, h - half, { xMin: 0, xMax: 2 * PI, yMin: -0.2, yMax: 2.3, grid: true, xticks: xt, yticks: [[0, "0"], [1, "1"], [2, "2"]], title: "积累量 F(x)", ylabel: "F", t: 34 });
      Plot.curve(ctx, bot.xOf, bot.yOf, F, 0, 2 * PI, 240, { color: "rgba(107,20,86,0.18)", width: 2 });
      Plot.curve(ctx, bot.xOf, bot.yOf, F, 0, x, 240, { color: Plot.C.burgundy, width: 3 });
      const s = Math.sin(x), d = 0.6;
      ctx.strokeStyle = Plot.C.gold;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(bot.xOf(x - d), bot.yOf(F(x) - d * s));
      ctx.lineTo(bot.xOf(x + d), bot.yOf(F(x) + d * s));
      ctx.stroke();
      Plot.disc(ctx, bot.xOf(x), bot.yOf(F(x)), 6, Plot.C.burgundy);
      ctx.restore();
      Plot.dashed(ctx, top.xOf(x), top.yOf(Math.sin(x)), top.xOf(x), half + bot.yOf(F(x)), "rgba(176,122,40,0.6)", 1.2);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  /* 反常积分：1/x² 的面积有上限，1/x 的面积越积越大 */
  Deck.on("improper", (slide) => {
    const canvas = slide.querySelector("#improper-canvas");
    const sEl = slide.querySelector("#improper-b");
    const bVal = slide.querySelector("#improper-b-val");
    const read = slide.querySelector("#improper-read");
    const verdict = slide.querySelector("#improper-verdict");
    const B = (s) => Math.pow(10, (Number(s) / 100) * 3);
    function render() {
      const b = B(sEl.value);
      bVal.textContent = b < 10 ? b.toFixed(2) : b < 100 ? b.toFixed(1) : Math.round(b).toString();
      const a2 = 1 - 1 / b, a1 = Math.log(b);
      Plot.tex(read, `$\\int_1^{b}\\frac{dx}{x^2}=${a2.toFixed(3)}$<small>$\\int_1^{b}\\frac{dx}{x}=\\ln b=${a1.toFixed(3)}$</small>`);
      verdict.className = "verdict" + (b > 200 ? " good" : "");
      verdict.textContent = b > 200
        ? "b 已经很大：1/x² 的面积停在 1 附近不动，1/x 的面积还在慢慢涨，涨到多大都可以。"
        : "把 b 往右拉。两条曲线看起来都贴向 x 轴，面积的命运却不一样。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80 || h < 160) return;
      const half = Math.floor(h * 0.52);
      const view = Math.min(b, 12);
      const top = Plot.axes(ctx, w, half, { xMin: 0.6, xMax: 12, yMin: 0, yMax: 1.25, grid: true, title: "曲线下 1 到 b 的面积", xlabel: "", ylabel: "", b: 40, t: 34 });
      Plot.clip(ctx, top, () => {
        Plot.fillBetween(ctx, top.xOf, top.yOf, (x) => 1 / x, 1, view, { color: "rgba(176,122,40,0.30)" });
        Plot.fillBetween(ctx, top.xOf, top.yOf, (x) => 1 / (x * x), 1, view, { color: "rgba(107,20,86,0.35)" });
        Plot.curve(ctx, top.xOf, top.yOf, (x) => 1 / x, 0.7, 12, 200, { color: Plot.C.gold, width: 2.4 });
        Plot.curve(ctx, top.xOf, top.yOf, (x) => 1 / (x * x), 0.7, 12, 200, { color: Plot.C.burgundy, width: 2.4 });
      });
      Plot.label(ctx, "1/x", top.xOf(7.6), top.yOf(0.3), Plot.C.gold, 24);
      Plot.label(ctx, "1/x²", top.xOf(2.2), top.yOf(0.12), Plot.C.burgundy, 24);
      if (b > 12) Plot.label(ctx, "b 在图外 →", top.xOf(9.2), top.yOf(1.05), Plot.C.muted, 22);
      ctx.save();
      ctx.translate(0, half);
      const lg = (v) => Math.log10(v);
      const bot = Plot.axes(ctx, w, h - half, {
        xMin: 0, xMax: 3, yMin: 0, yMax: 7.4, grid: true, xlabel: "b", ylabel: "面积", t: 34,
        xticks: [[0, "1"], [1, "10"], [2, "100"], [3, "1000"]], title: "面积随 b 的变化（b 按对数刻度）",
      });
      Plot.dashed(ctx, bot.xOf(0), bot.yOf(1), bot.xOf(3), bot.yOf(1), Plot.C.burgundy, 1.4);
      Plot.curve(ctx, bot.xOf, bot.yOf, (u) => 1 - Math.pow(10, -u), 0, 3, 200, { color: "rgba(107,20,86,0.25)", width: 2 });
      Plot.curve(ctx, bot.xOf, bot.yOf, (u) => u * Math.LN10, 0, 3, 200, { color: "rgba(176,122,40,0.3)", width: 2 });
      Plot.curve(ctx, bot.xOf, bot.yOf, (u) => 1 - Math.pow(10, -u), 0, lg(b), 200, { color: Plot.C.burgundy, width: 3 });
      Plot.curve(ctx, bot.xOf, bot.yOf, (u) => u * Math.LN10, 0, lg(b), 200, { color: Plot.C.gold, width: 3 });
      Plot.disc(ctx, bot.xOf(lg(b)), bot.yOf(a2), 6, Plot.C.burgundy);
      Plot.disc(ctx, bot.xOf(lg(b)), bot.yOf(a1), 6, Plot.C.gold);
      ctx.restore();
    }
    bind(slide, render, () => { sEl.oninput = render; });
  });

  /* 消费者剩余：需求曲线 p = 10 − q/2 与市场价之间的面积 */
  Deck.on("surplus", (slide) => {
    const canvas = slide.querySelector("#surplus-canvas");
    const pEl = slide.querySelector("#surplus-p");
    const pVal = slide.querySelector("#surplus-p-val");
    const read = slide.querySelector("#surplus-read");
    const D = (q) => 10 - q / 2;
    function render() {
      const p0 = Number(pEl.value);
      pVal.textContent = p0.toFixed(1);
      const q0 = 2 * (10 - p0);
      const cs = (10 - p0) * (10 - p0);
      Plot.tex(read, `$q_0=${q0.toFixed(0)}$　消费者剩余 $=${cs.toFixed(2)}$<small>$\\int_0^{${q0.toFixed(0)}}\\left(10-\\tfrac q2-${p0.toFixed(1)}\\right)dq$；花费 $p_0q_0=${(p0 * q0).toFixed(1)}$</small>`);
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80 || h < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0, xMax: 21, yMin: 0, yMax: 11, grid: true, xlabel: "数量 q", ylabel: "价格 p", title: "需求曲线 p = 10 − q/2" });
      ctx.fillStyle = "rgba(176,122,40,0.22)";
      ctx.fillRect(xOf(0), yOf(p0), xOf(q0) - xOf(0), yOf(0) - yOf(p0));
      Plot.fillBetween(ctx, xOf, yOf, D, 0, q0, { g: () => p0, color: "rgba(107,20,86,0.32)" });
      Plot.curve(ctx, xOf, yOf, D, 0, 20, 2, { width: 3 });
      Plot.dashed(ctx, xOf(0), yOf(p0), xOf(21), yOf(p0), Plot.C.ink, 1.4);
      Plot.dashed(ctx, xOf(q0), yOf(0), xOf(q0), yOf(p0), Plot.C.ink, 1.4);
      Plot.disc(ctx, xOf(q0), yOf(p0), 7, Plot.C.gold, Plot.C.burgundy);
      Plot.label(ctx, "消费者剩余", xOf(q0 * 0.12), yOf(p0 + (10 - p0) * 0.28), Plot.C.burgundy, 24);
      if (p0 > 1.6) Plot.label(ctx, "实际花费 p₀q₀", xOf(q0 * 0.12), yOf(p0 * 0.5), Plot.C.gold, 22);
    }
    bind(slide, render, () => { pEl.oninput = render; });
  });
})();
