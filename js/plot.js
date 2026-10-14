/* 共享作图。不使用 ES module。热图经离屏 canvas，避免 putImageData 与 DPR 错位。 */
(function () {
  const C = {
    burgundy: "#6b1456",
    gold: "#b07a28",
    teal: "#1b5f5c",
    ink: "#241616",
    muted: "#6a5858",
    paper: "#f3eadc",
    card: "#fffaf2",
    rule: "#e9dfcf",
    danger: "#9c2f2f",
    ok: "#2c6b45",
  };

  const TYPE = 32; /* 24pt @ 96dpi，投影坐标字 */
  const TICK = 26;

  function axes(ctx, w, h, opt) {
    const o = Object.assign({
      l: 68, r: 22, t: 36, b: 52,
      xMin: -1, xMax: 1, yMin: -1, yMax: 1,
      xlabel: "x", ylabel: "y", title: "",
      ticks: true,
    }, opt || {});
    ctx.fillStyle = C.card;
    ctx.fillRect(0, 0, w, h);
    const pw = w - o.l - o.r, ph = h - o.t - o.b;
    const xOf = (x) => o.l + ((x - o.xMin) / (o.xMax - o.xMin)) * pw;
    const yOf = (y) => o.t + (1 - (y - o.yMin) / (o.yMax - o.yMin)) * ph;

    ctx.strokeStyle = C.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(o.l + 0.5, o.t + 0.5, pw - 1, ph - 1);
    ctx.stroke();

    ctx.strokeStyle = "rgba(36,22,22,0.28)";
    ctx.beginPath();
    if (o.xMin < 0 && o.xMax > 0) {
      ctx.moveTo(xOf(0), o.t); ctx.lineTo(xOf(0), o.t + ph);
    }
    if (o.yMin < 0 && o.yMax > 0) {
      ctx.moveTo(o.l, yOf(0)); ctx.lineTo(o.l + pw, yOf(0));
    }
    ctx.stroke();

    ctx.fillStyle = C.muted;
    ctx.font = TYPE + "px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(o.xlabel, o.l + pw / 2, h - 10);
    ctx.save();
    ctx.translate(22, o.t + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(o.ylabel, 0, 0);
    ctx.restore();
    if (o.title) {
      ctx.fillStyle = C.ink;
      ctx.textAlign = "left";
      ctx.fillText(o.title, o.l + 6, o.t - 8);
    }
    if (o.ticks) {
      ctx.fillStyle = C.muted;
      ctx.font = TICK + "px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.fillText(String(o.xMin), xOf(o.xMin), o.t + ph + 28);
      ctx.fillText(String(o.xMax), xOf(o.xMax), o.t + ph + 28);
    }
    return { xOf, yOf, pw, ph, m: o };
  }

  function curve(ctx, xOf, yOf, f, a, b, n, style) {
    const s = Object.assign({ color: C.burgundy, width: 2.2 }, style || {});
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= n; i++) {
      const x = a + (i / n) * (b - a);
      const y = f(x);
      if (!Number.isFinite(y)) { started = false; continue; }
      const X = xOf(x), Y = yOf(y);
      if (!started) { ctx.moveTo(X, Y); started = true; }
      else ctx.lineTo(X, Y);
    }
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.stroke();
  }

  function polyline(ctx, pts, style) {
    const s = Object.assign({ color: C.burgundy, width: 2, fill: null }, style || {});
    if (!pts.length) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (s.fill) { ctx.fillStyle = s.fill; ctx.fill(); }
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.stroke();
  }

  function disc(ctx, x, y, r, fill, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function heatmap(ctx, ox, oy, side, fxy, R) {
    const sw = 280;
    const img = ctx.createImageData(sw, sw);
    const lerp = (a, b, t) => a + (b - a) * t;
    for (let j = 0; j < sw; j++) {
      for (let i = 0; i < sw; i++) {
        const x = -R + (i / (sw - 1)) * 2 * R;
        const y = R - (j / (sw - 1)) * 2 * R;
        const v = fxy(x, y);
        const t = Number.isNaN(v) ? 0.5 : Math.max(0, Math.min(1, (v + 1) / 2));
        const r0 = t < 0.5 ? lerp(27, 243, t * 2) : lerp(243, 107, (t - 0.5) * 2);
        const g0 = t < 0.5 ? lerp(95, 234, t * 2) : lerp(234, 20, (t - 0.5) * 2);
        const b0 = t < 0.5 ? lerp(92, 220, t * 2) : lerp(220, 86, (t - 0.5) * 2);
        const p = (j * sw + i) * 4;
        img.data[p] = r0; img.data[p + 1] = g0; img.data[p + 2] = b0; img.data[p + 3] = 255;
      }
    }
    const off = document.createElement("canvas");
    off.width = sw; off.height = sw;
    off.getContext("2d").putImageData(img, 0, 0);
    ctx.drawImage(off, ox, oy, side, side);
  }

  function label(ctx, text, x, y, color) {
    ctx.fillStyle = color || C.ink;
    ctx.font = TYPE + "px 'Noto Serif SC', serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, y);
  }

  window.Plot = { C, axes, curve, polyline, disc, heatmap, label };
})();
