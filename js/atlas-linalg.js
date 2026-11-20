/* 概念图鉴 · 线性代数 */
(function () {
  const A = window.A;
  const M = window.AtlasMath;
  const C = A.C;
  const scenes = [];
  const rng = A.rng, cho = A.cho, act = A.act, say = A.say, num = A.num;

  function polar(deg, len) {
    const r = deg * Math.PI / 180;
    return [len * Math.cos(r), len * Math.sin(r)];
  }

  scenes.push({
    id: "area", ch: "det", title: "有向面积", keys: "行列式 平行四边形 剪切 线性相关 向量",
    lead: "两列是两条边。行列式是平行四边形的有向面积：交换变号，剪切不变，共线则为 0。对角线是 u + v。",
    init: { ua: 8, ul: 1.8, va: 74, vl: 1.5 },
    controls: [
      rng("ua", "u 的方向", -180, 180, 1, 0),
      rng("ul", "u 的长度", 0.4, 2.6, 0.02, 2),
      rng("va", "v 的方向", -180, 180, 1, 0),
      rng("vl", "v 的长度", 0.4, 2.6, 0.02, 2),
      act("swap", "交换 u 和 v"),
    ],
    presets: [
      { name: "正方形", set: { ua: 0, ul: 1.6, va: 90, vl: 1.6 } },
      { name: "剪切，面积仍是 2", set: { ua: 0, ul: 2, va: 45, vl: Math.SQRT2 } },
      { name: "反向", set: { ua: 0, ul: 1.6, va: -90, vl: 1.6 } },
      { name: "共线", set: { ua: 20, ul: 1.8, va: 20, vl: 1.1 } },
    ],
    action(key, st) {
      if (key !== "swap") return;
      const a = st.ua, l = st.ul;
      st.ua = st.va; st.ul = st.vl; st.va = a; st.vl = l;
    },
    hit(type, p, st) {
      const box = this._box;
      if (!box || p[0] < box.l || p[0] > box.l + box.pw || p[1] < box.t || p[1] > box.t + box.ph) {
        if (type === "down") return false;
      }
      const x = box.xMin + ((p[0] - box.l) / box.pw) * (box.xMax - box.xMin);
      const y = box.yMin + (1 - (p[1] - box.t) / box.ph) * (box.yMax - box.yMin);
      if (type === "down") {
        const u = polar(st.ua, st.ul), v = polar(st.va, st.vl);
        const du = Math.hypot(box.xOf(u[0]) - p[0], box.yOf(u[1]) - p[1]);
        const dv = Math.hypot(box.xOf(v[0]) - p[0], box.yOf(v[1]) - p[1]);
        if (du > 28 && dv > 28) return false;
        this._which = du <= dv ? "u" : "v";
      }
      if (!this._which) return false;
      const len = Math.max(0.4, Math.min(2.6, Math.hypot(x, y)));
      const ang = Math.atan2(y, x) * 180 / Math.PI;
      if (this._which === "u") { st.ua = ang; st.ul = len; }
      else { st.va = ang; st.vl = len; }
      return true;
    },
    read(st) {
      const u = polar(st.ua, st.ul), v = polar(st.va, st.vl);
      const d = M.det2(u, v);
      let text = "拖向量的端点。正面积是 u 到 v 的逆时针，负面积是顺时针。";
      if (Math.abs(d) < 0.08) text = "面积接近 0：两列共线，线性相关，张不成一块平面。";
      else if (Math.abs(d - 2) < 0.08) text = "把 v 的水平分量拉开，高度没变，面积仍是 2。这就是剪切不变。";
      return say("det = " + num(d, 2), text, Math.abs(d) < 0.08 ? "bad" : "good");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -3, xMax: 3, yMin: -3, yMax: 3, equal: true, title: "列向量张成的平行四边形", xlabel: "", ylabel: "" });
      this._box = box;
      const u = polar(st.ua, st.ul), v = polar(st.va, st.vl);
      const s = [u[0] + v[0], u[1] + v[1]];
      const d = M.det2(u, v);
      A.strokePoly(ctx, box, [[0, 0], u, s, v], d >= 0 ? C.burgundy : C.danger, 2, d >= 0 ? "rgba(107,20,86,0.18)" : "rgba(156,47,47,0.18)");
      A.arrow(ctx, box.xOf(0), box.yOf(0), box.xOf(u[0]), box.yOf(u[1]), C.burgundy, 2.4);
      A.arrow(ctx, box.xOf(0), box.yOf(0), box.xOf(v[0]), box.yOf(v[1]), C.gold, 2.4);
      A.arrow(ctx, box.xOf(0), box.yOf(0), box.xOf(s[0]), box.yOf(s[1]), C.teal, 1.6);
      A.label(ctx, "u", box.xOf(u[0]) + 6, box.yOf(u[1]) - 6, C.burgundy, 16);
      A.label(ctx, "v", box.xOf(v[0]) + 6, box.yOf(v[1]) - 6, C.gold, 16);
      A.label(ctx, "u+v", box.xOf(s[0]) + 6, box.yOf(s[1]) - 6, C.teal, 14);
    },
  });

  const AUG = [[1, 2, 3, 1, 2], [0, 1, 4, 0, 1], [5, 0, 1, 5, 0]];

  scenes.push({
    id: "sarrus", ch: "det", title: "萨吕斯", keys: "三阶 对角线 抄列",
    lead: "三阶可以把前两列抄到右边。三条顺对角线相加，三条逆对角线相减。",
    init: { step: 3 },
    controls: [rng("step", "已算到第几条", 0, 6, 1, 0)],
    presets: [{ name: "从头", set: { step: 0 } }, { name: "三条正的", set: { step: 3 } }, { name: "算完", set: { step: 6 } }],
    read(st) {
      const step = Math.round(st.step);
      const sum = M.sarrusSum(step);
      const cur = step === 0 ? "还没开始。" : (M.SARRUS[step - 1].sign > 0 ? "这一条取正，" : "这一条取负，") + "乘积 " + M.SARRUS[step - 1].prod + "。";
      return say("当前和 = " + sum + (step === 6 ? "　这就是行列式" : ""), cur + (step === 6 ? " 六条都算完，det = 26。" : ""), step === 6 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const step = Math.round(st.step);
      const cell = Math.min(72, (w - 48) / 5, (h - 80) / 3);
      const ox = (w - cell * 5) / 2, oy = 56;
      A.label(ctx, "抄前两列", ox + cell * 3, oy - 12, C.muted, 14);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          ctx.fillStyle = c >= 3 ? "rgba(176,122,40,0.12)" : C.paper;
          ctx.fillRect(ox + c * cell, oy + r * cell, cell - 8, cell - 8);
          ctx.strokeStyle = c >= 3 ? C.gold : C.burgundy;
          ctx.strokeRect(ox + c * cell, oy + r * cell, cell - 8, cell - 8);
          ctx.fillStyle = C.ink;
          ctx.font = "22px " + A.SERIF;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(AUG[r][c]), ox + c * cell + (cell - 8) / 2, oy + r * cell + (cell - 8) / 2);
        }
      }
      if (step > 0) {
        const path = M.SARRUS[step - 1];
        ctx.strokeStyle = path.sign > 0 ? C.teal : C.danger;
        ctx.lineWidth = 3;
        ctx.beginPath();
        path.cells.forEach((rc, i) => {
          const X = ox + rc[1] * cell + (cell - 8) / 2;
          const Y = oy + rc[0] * cell + (cell - 8) / 2;
          if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        });
        ctx.stroke();
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    },
  });

  const CRAMER = {
    one: { a: 2, b: 1, c: 1, d: -1, e: 4, f: 1, name: "唯一解" },
    none: { a: 2, b: 1, c: 2, d: 1, e: 4, f: 1, name: "平行" },
    inf: { a: 2, b: 1, c: 4, d: 2, e: 4, f: 8, name: "重合" },
  };

  function drawEqLine(ctx, box, a, b, c, color) {
    A.clip(ctx, box, () => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      if (Math.abs(b) < 1e-8) {
        const x = c / a;
        ctx.moveTo(box.xOf(x), box.yOf(box.yMin));
        ctx.lineTo(box.xOf(x), box.yOf(box.yMax));
      } else {
        ctx.moveTo(box.xOf(box.xMin), box.yOf((c - a * box.xMin) / b));
        ctx.lineTo(box.xOf(box.xMax), box.yOf((c - a * box.xMax) / b));
      }
      ctx.stroke();
    });
  }

  scenes.push({
    id: "cramer", ch: "det", title: "克拉默", keys: "二元 行列式之比 无解 无穷",
    lead: "系数行列式不是 0 时，解是两个行列式之比。它是 0 时克拉默停下：可能无解，也可能无穷多解。",
    init: { mode: "one" },
    controls: [cho("mode", "方程组", [["one", "唯一"], ["none", "无解"], ["inf", "无穷"]])],
    presets: [{ name: "2x+y=4, x−y=1", set: { mode: "one" } }, { name: "平行", set: { mode: "none" } }, { name: "重合", set: { mode: "inf" } }],
    read(st) {
      const s = CRAMER[st.mode];
      const r = M.cramer(s.a, s.b, s.c, s.d, s.e, s.f);
      if (st.mode === "one") return say("x = " + num(r.x, 3) + "　y = " + num(r.y, 3), "D = " + num(r.D, 0) + "。x = Dx/D，y = Dy/D。交点就是这个解。", "good");
      if (st.mode === "none") return say("D = 0", "两条平行，不相交。这里是无解。行列式为 0 不能一律说成无解。", "bad");
      return say("D = 0，方程重复", "两条是同一条直线。无穷多解，克拉默同样不能用。", "");
    },
    draw(ctx, w, h, st) {
      const s = CRAMER[st.mode];
      const box = A.axes(ctx, w, h, { xMin: -1, xMax: 5, yMin: -1, yMax: 5, equal: true, title: s.name });
      drawEqLine(ctx, box, s.a, s.b, s.e, C.burgundy);
      if (st.mode !== "inf") drawEqLine(ctx, box, s.c, s.d, s.f, C.gold);
      if (st.mode === "one") {
        const r = M.cramer(s.a, s.b, s.c, s.d, s.e, s.f);
        A.disc(ctx, box.xOf(r.x), box.yOf(r.y), 7, C.ink);
        A.label(ctx, "(" + num(r.x, 2) + ", " + num(r.y, 2) + ")", box.xOf(r.x) + 8, box.yOf(r.y) - 8, C.ink, 14);
      }
    },
  });

  function drawMap(ctx, box, mat, color, fill) {
    A.clip(ctx, box, () => {
      ctx.strokeStyle = "rgba(36,22,22,0.18)";
      ctx.lineWidth = 1;
      for (let k = -2; k <= 2; k++) {
        const a = A.mapPts([[k, -2.2], [k, 2.2]], mat);
        const b = A.mapPts([[-2.2, k], [2.2, k]], mat);
        ctx.beginPath();
        ctx.moveTo(box.xOf(a[0][0]), box.yOf(a[0][1]));
        ctx.lineTo(box.xOf(a[1][0]), box.yOf(a[1][1]));
        ctx.moveTo(box.xOf(b[0][0]), box.yOf(b[0][1]));
        ctx.lineTo(box.xOf(b[1][0]), box.yOf(b[1][1]));
        ctx.stroke();
      }
      const sq = A.mapPts([[0, 0], [1, 0], [1, 1], [0, 1]], mat);
      A.strokePoly(ctx, box, sq, C.gold, 1.5, "rgba(176,122,40,0.2)");
      const F = A.mapPts(A.glyphF(), mat);
      A.strokePoly(ctx, box, F, color, 2.4, fill);
    });
  }

  scenes.push({
    id: "transform", ch: "mat", title: "线性变换", keys: "矩阵 旋转 剪切 投影 特征向量 特征值",
    lead: "矩阵把平面上的格子拉开。两列是基向量的像，它们张成的面积倍率就是行列式。",
    init: { a: 1, b: 0.7, c: 0, d: 1 },
    controls: [
      rng("a", "a", -2, 2, 0.05, 2),
      rng("b", "b", -2, 2, 0.05, 2),
      rng("c", "c", -2, 2, 0.05, 2),
      rng("d", "d", -2, 2, 0.05, 2),
    ],
    presets: [
      { name: "单位", set: { a: 1, b: 0, c: 0, d: 1 } },
      { name: "旋转 90°", set: { a: 0, b: -1, c: 1, d: 0 } },
      { name: "拉伸", set: { a: 2, b: 0, c: 0, d: 0.5 } },
      { name: "剪切", set: { a: 1, b: 0.8, c: 0, d: 1 } },
      { name: "投影", set: { a: 1, b: 0, c: 0, d: 0 } },
      { name: "反射", set: { a: 0, b: 1, c: 1, d: 0 } },
    ],
    read(st) {
      const mat = [[st.a, st.b], [st.c, st.d]];
      const det = M.matDet(mat), rank = M.matRank(mat);
      const eg = M.eigen2(mat);
      let eigen = "没有实特征向量：没有哪条过原点的直线还留在自己身上。旋转就是这样。";
      if (eg.length) eigen = "实特征值 " + eg.map((e) => num(e.l, 2)).join("，") + "。这些方向只被拉长，不换到别的直线上。";
      return say("det = " + num(det, 2) + "　秩 " + rank, eigen + (rank < 2 ? " 行列式为 0，平面被压扁，面积倍率是 0。" : ""), rank < 2 ? "bad" : "");
    },
    draw(ctx, w, h, st) {
      const mat = [[st.a, st.b], [st.c, st.d]];
      const box = A.axes(ctx, w, h, { xMin: -3.2, xMax: 3.2, yMin: -3.2, yMax: 3.2, equal: true, title: "格子、单位正方形和字母 F" });
      drawMap(ctx, box, mat, C.burgundy, "rgba(107,20,86,0.16)");
      const eg = M.eigen2(mat);
      eg.forEach((e, i) => {
        A.clip(ctx, box, () => {
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = i ? C.teal : C.gold;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(box.xOf(-e.v[0] * 3), box.yOf(-e.v[1] * 3));
          ctx.lineTo(box.xOf(e.v[0] * 3), box.yOf(e.v[1] * 3));
          ctx.stroke();
          ctx.setLineDash([]);
        });
        A.label(ctx, "λ=" + num(e.l, 2), box.xOf(e.v[0] * 2.1), box.yOf(e.v[1] * 2.1), i ? C.teal : C.gold, 13);
      });
    },
  });

  scenes.push({
    id: "product", ch: "mat", title: "乘法不可交换", keys: "行乘列 AB BA 投影",
    lead: "乘法是先做右边的变换，再做左边的。次序换了，平面可以倒向完全不同的地方。",
    init: { mode: "geom", i: "0", j: "0" },
    controls: [
      cho("mode", "看什么", [["geom", "AB 与 BA"], ["entry", "行 × 列"]]),
      cho("i", "A 的行", [["0", "第 1 行"], ["1", "第 2 行"]], (s) => s.mode === "entry"),
      cho("j", "B 的列", [["0", "第 1 列"], ["1", "第 2 列"]], (s) => s.mode === "entry"),
    ],
    presets: [{ name: "几何", set: { mode: "geom" } }, { name: "算一个元素", set: { mode: "entry", i: "0", j: "1" } }],
    read(st) {
      if (st.mode === "geom") return say("AB 把平面压到 x 轴，BA 压到 y 轴", "A = [[0,1],[0,0]]，B = [[0,0],[1,0]]。AB = [[1,0],[0,0]]，BA = [[0,0],[0,1]]。都不是零矩阵，乘积却可以差很远。", "good");
      const A0 = [[1, 2], [3, 4]], B0 = [[0, 1], [1, 0]];
      const i = Number(st.i), j = Number(st.j);
      const val = A0[i][0] * B0[0][j] + A0[i][1] * B0[1][j];
      return say("(AB) 第 " + (i + 1) + " 行第 " + (j + 1) + " 列 = " + val, A0[i][0] + "·" + B0[0][j] + " + " + A0[i][1] + "·" + B0[1][j] + " = " + val + "。左取一行，右取一列，对位相乘再相加。");
    },
    draw(ctx, w, h, st) {
      if (st.mode === "geom") {
        const mid = Math.floor(w / 2);
        const AB = M.matMul(M.MAT_A, M.MAT_B), BA = M.matMul(M.MAT_B, M.MAT_A);
        [[0, AB, "先 B 再 A"], [mid, BA, "先 A 再 B"]].forEach(([x, mat, title]) => {
          A.pane(ctx, x, 0, mid, h, (pw, ph) => {
            const box = A.axes(ctx, pw, ph, { xMin: -2.4, xMax: 2.4, yMin: -2.4, yMax: 2.4, equal: true, title });
            A.clip(ctx, box, () => A.strokePoly(ctx, box, A.glyphF(), "rgba(106,88,88,0.35)", 1.2, "rgba(106,88,88,0.05)"));
            drawMap(ctx, box, mat, C.burgundy, "rgba(107,20,86,0.2)");
          });
        });
        return;
      }
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const A0 = [[1, 2], [3, 4]], B0 = [[0, 1], [1, 0]];
      const i = Number(st.i), j = Number(st.j);
      const cell = Math.min(78, w / 8);
      const y = h * 0.38;
      function grid(M0, x, row, col, title) {
        A.label(ctx, title, x, y - 16, C.muted, 16);
        for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
          const hit = r === row || c === col;
          ctx.fillStyle = hit ? "rgba(107,20,86,0.16)" : C.paper;
          ctx.strokeStyle = C.burgundy;
          ctx.fillRect(x + c * cell, y + r * cell, cell - 8, cell - 8);
          ctx.strokeRect(x + c * cell, y + r * cell, cell - 8, cell - 8);
          ctx.fillStyle = C.ink;
          ctx.font = "28px " + A.SERIF;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(M0[r][c]), x + c * cell + (cell - 8) / 2, y + r * cell + (cell - 8) / 2);
        }
      }
      grid(A0, 36, i, -1, "A 的一行");
      grid(B0, 36 + cell * 2 + 36, -1, j, "B 的一列");
      const val = A0[i][0] * B0[0][j] + A0[i][1] * B0[1][j];
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      A.label(ctx, "→  " + val, 36 + cell * 4 + 80, y + cell, C.burgundy, 32);
    },
  });

  scenes.push({
    id: "invmat", ch: "mat", title: "逆与秩", keys: "可逆 奇异 压扁 行列式",
    lead: "逆把变换拉回去。行列式走向 0 时，平面被压成直线，没有哪一家变换能把它还原。",
    init: { t: 0 },
    controls: [rng("t", "走向奇异", 0, 1, 0.01, 2)],
    presets: [{ name: "例题，可逆", set: { t: 0 } }, { name: "快压扁了", set: { t: 0.85 } }, { name: "没有逆", set: { t: 1 } }],
    read(st) {
      const mat = [[1, 2], [3 - st.t, 4]];
      const det = M.matDet(mat);
      if (Math.abs(det) < 0.02) return say("det = 0　秩降为 1", "两列变成倍数。字母 F 被压成一条线段，没有逆矩阵把它拉回来。", "bad");
      const inv = M.matInv(mat);
      return say("det = " + num(det, 2), "先乘 A，再乘 A⁻¹，形状回到原处。逆的第一行是 (" + num(inv[0][0], 2) + ", " + num(inv[0][1], 2) + ")。t = 0 时就是 [[1,2],[3,4]] 的逆。", "good");
    },
    draw(ctx, w, h, st) {
      const mat = [[1, 2], [3 - st.t, 4]];
      const det = M.matDet(mat);
      const mid = Math.floor(w / 2);
      A.pane(ctx, 0, 0, mid, h, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: -5, xMax: 5, yMin: -5, yMax: 5, equal: true, title: "A 作用之后" });
        A.clip(ctx, box, () => A.strokePoly(ctx, box, A.glyphF(), "rgba(27,95,92,0.45)", 1.4));
        drawMap(ctx, box, mat, C.burgundy, "rgba(107,20,86,0.15)");
      });
      A.pane(ctx, mid, 0, w - mid, h, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: -3, xMax: 3, yMin: -3, yMax: 3, equal: true, title: Math.abs(det) < 0.02 ? "拉不回来" : "再乘逆" });
        A.clip(ctx, box, () => A.strokePoly(ctx, box, A.glyphF(), "rgba(27,95,92,0.35)", 1.3));
        if (Math.abs(det) >= 0.02) {
          const back = M.matMul(M.matInv(mat), mat);
          drawMap(ctx, box, back, C.gold, "rgba(176,122,40,0.12)");
        } else {
          A.label(ctx, "秩 1", box.l + 10, box.t + 24, C.danger, 16);
        }
      });
    },
  });

  const LINES = {
    one: [[1, 1, 2], [1, -1, 0]],
    none: [[1, 1, 1], [1, 1, 3]],
    inf: [[1, 1, 2], [2, 2, 4]],
  };

  scenes.push({
    id: "lines", ch: "sys", title: "直线的三种命运", keys: "唯一 无解 无穷 平行 重合",
    lead: "两个二元一次方程是两条直线。相交、平行、重合，对应唯一解、无解、无穷解。",
    init: { mode: "one" },
    controls: [cho("mode", "情形", [["one", "相交"], ["none", "平行"], ["inf", "重合"]])],
    presets: [{ name: "唯一", set: { mode: "one" } }, { name: "无解", set: { mode: "none" } }, { name: "无穷", set: { mode: "inf" } }],
    read(st) {
      const L = LINES[st.mode];
      const g = M.classify2(L[0][0], L[0][1], L[0][2], L[1][0], L[1][1], L[1][2]);
      if (g.kind === "one") return say("交于 (" + num(g.x, 2) + ", " + num(g.y, 2) + ")", "唯一解。三元的时候，这对应三张平面交于一点。", "good");
      if (g.kind === "none") return say("没有交点", "平行且不重合，增广之后会出现 0 = 1。无解。", "bad");
      return say("两条是同一条", "0 = 0，未知数比有效方程多。直线上每一个点都是解。", "");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -1, xMax: 4, yMin: -1, yMax: 4, equal: true, title: "平面里的预演" });
      const L = LINES[st.mode];
      drawEqLine(ctx, box, L[0][0], L[0][1], L[0][2], C.burgundy);
      if (st.mode !== "inf") drawEqLine(ctx, box, L[1][0], L[1][1], L[1][2], C.gold);
      const g = M.classify2(L[0][0], L[0][1], L[0][2], L[1][0], L[1][1], L[1][2]);
      if (g.kind === "one") A.disc(ctx, box.xOf(g.x), box.yOf(g.y), 7, C.ink);
    },
  });

  function project(p, w, h) {
    const lo = -1.6, hi = 2.4, mid = (lo + hi) / 2;
    const x = p[0] - mid, y = p[1] - mid, z = p[2] - mid;
    const s = Math.min(w, h) * 0.36 / ((hi - lo) / 2);
    return [w * 0.58 + (x - y) * 0.86 * s, h * 0.58 + ((x + y) * 0.46 - z) * s];
  }

  scenes.push({
    id: "planes", ch: "sys", title: "三平面", keys: "例2.3.6 例2.3.7 例2.3.8 例2.3.9 交于一点 直线 重合 平行",
    lead: "每个三元一次方程是一张平面。四种位置，解释唯一、无解、无穷。",
    init: { mode: "point" },
    controls: [cho("mode", "教材例子", [["point", "交于一点"], ["line", "交于直线"], ["same", "三张重合"], ["none", "三张平行"]])],
    presets: [{ name: "例 2.3.8", set: { mode: "point" } }, { name: "例 2.3.7", set: { mode: "line" } }, { name: "例 2.3.6", set: { mode: "same" } }, { name: "例 2.3.9", set: { mode: "none" } }],
    read(st) {
      if (st.mode === "point") return say("(x, y, z) = (1, 1, 1)", "三张平面交于一点。系数矩阵满秩，唯一解。", "good");
      if (st.mode === "line") return say("一条公共直线", "秩是 2，比未知数少 1。无穷解，一个自由参数。", "");
      if (st.mode === "same") return say("三张其实是一张", "三个方程成比例。秩是 1，两个自由参数，整张平面都是解。", "");
      return say("没有公共点", "三张平行。增广矩阵出现 0 = 1，无解。", "bad");
    },
    draw(ctx, w, h, st) {
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const lo = -1.6, hi = 2.4;
      const corners = [];
      for (const x of [lo, hi]) for (const y of [lo, hi]) for (const z of [lo, hi]) corners.push([x, y, z]);
      ctx.strokeStyle = "rgba(36,22,22,0.28)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
        let diff = 0;
        for (let k = 0; k < 3; k++) if (corners[i][k] !== corners[j][k]) diff++;
        if (diff !== 1) continue;
        const a = project(corners[i], w, h), b = project(corners[j], w, h);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      const planes = M.PLANES[st.mode];
      const cols = ["#6b1456", "#b07a28", "#1b5f5c"];
      const polys = planes.map((pl, i) => ({ pts: M.planePolygon(pl, lo, hi), color: cols[i], name: pl.name }));
      polys.sort((a, b) => {
        const da = a.pts.reduce((s, p) => s + p[0] + p[1] + p[2], 0);
        const db = b.pts.reduce((s, p) => s + p[0] + p[1] + p[2], 0);
        return da - db;
      });
      polys.forEach((pl) => {
        if (pl.pts.length < 3) return;
        ctx.beginPath();
        pl.pts.forEach((p, i) => {
          const q = project(p, w, h);
          if (i === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]);
        });
        ctx.closePath();
        ctx.globalAlpha = 0.38;
        ctx.fillStyle = pl.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = pl.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      if (st.mode === "point") {
        const q = project([1, 1, 1], w, h);
        A.disc(ctx, q[0], q[1], 7, C.ink, C.card);
      }
      if (st.mode === "line") {
        const ln = M.lineOf(planes[0], planes[1]);
        const seg = M.clipSegment(ln.point, ln.dir, lo, hi);
        if (seg) {
          const a = project(seg[0], w, h), b = project(seg[1], w, h);
          ctx.strokeStyle = C.ink;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }
      }
      planes.forEach((pl, i) => A.label(ctx, pl.name, 16, 28 + i * 22, cols[i], 15));
      const o = project([lo, lo, lo], w, h);
      A.label(ctx, "x", project([hi, lo, lo], w, h)[0], project([hi, lo, lo], w, h)[1], C.muted, 13);
      A.label(ctx, "y", project([lo, hi, lo], w, h)[0], project([lo, hi, lo], w, h)[1], C.muted, 13);
      A.label(ctx, "z", project([lo, lo, hi], w, h)[0], project([lo, lo, hi], w, h)[1], C.muted, 13);
      void o;
    },
  });

  scenes.push({
    id: "gensol", ch: "sys", title: "通解", keys: "特解 齐次 参数 零空间",
    lead: "通解 = 一个特解 + 参数 × 齐次方程的方向。齐次直线过原点，平移之后才落到真正的解上。",
    init: { t: 0.8 },
    controls: [rng("t", "参数 t", -1.4, 2.2, 0.02, 2)],
    presets: [{ name: "特解", set: { t: 0 } }, { name: "另一点", set: { t: 1.5 } }],
    read(st) {
      const g = M.generalAt(st.t);
      return say("(" + num(g[0], 2) + ", " + num(g[1], 2) + ") = (0, 2) + t(−2, 1)", "代入 x + 2y 得 " + num(g[0] + 2 * g[1], 2) + "。t 随便变，都在解集上。方向 (−2, 1) 自己满足齐次方程 x + 2y = 0。", "good");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -5, xMax: 5, yMin: -1, yMax: 5, title: "x + 2y = 4" });
      A.curve(ctx, box, (x) => (4 - x) / 2, -5, 5, 2);
      A.curve(ctx, box, (x) => -x / 2, -5, 5, 2, { color: C.teal, dash: [5, 4], width: 1.5 });
      const p = [0, 2];
      const g = M.generalAt(st.t);
      A.arrow(ctx, box.xOf(0), box.yOf(0), box.xOf(p[0]), box.yOf(p[1]), C.gold, 2.2);
      A.arrow(ctx, box.xOf(p[0]), box.yOf(p[1]), box.xOf(g[0]), box.yOf(g[1]), C.teal, 2.2);
      A.disc(ctx, box.xOf(p[0]), box.yOf(p[1]), 5, C.gold);
      A.disc(ctx, box.xOf(g[0]), box.yOf(g[1]), 6, C.burgundy);
      A.label(ctx, "特解", box.xOf(0.15), box.yOf(2.25), C.gold, 14);
      A.label(ctx, "齐次方向", box.xOf(-3.2), box.yOf(1.9), C.teal, 14);
    },
  });

  scenes.push({
    id: "leon", ch: "sys", title: "投入产出", keys: "列昂惕夫 I-A 最终需求 总产出",
    lead: "课堂练的两个部门：生产 1 单位乙要消耗 0.4 单位甲。总产出要先养活往来，剩下的才是最终需求。",
    init: { d1: 1, d2: 1 },
    controls: [rng("d1", "甲的最终需求", 0, 4, 0.05, 2), rng("d2", "乙的最终需求", 0, 4, 0.05, 2)],
    presets: [{ name: "d = (1, 1)", set: { d1: 1, d2: 1 } }, { name: "多要甲", set: { d1: 3, d2: 1 } }],
    read(st) {
      const x = M.leontief(st.d1, st.d2);
      return say("x = (" + num(x[0], 2) + ", " + num(x[1], 2) + ")", "(I − A)x = d，A = [[0.2, 0.4], [0.3, 0.1]]。总产出比最终需求高，中间那一截是部门互相买走的。", "good");
    },
    draw(ctx, w, h, st) {
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const x = M.leontief(st.d1, st.d2);
      const names = ["甲", "乙"];
      const pos = [[w * 0.28, h * 0.42], [w * 0.62, h * 0.42]];
      const flows = [
        [0, 1, 0.4 * x[1], "乙消耗甲 " + num(0.4 * x[1], 2)],
        [1, 0, 0.3 * x[0], "甲消耗乙 " + num(0.3 * x[0], 2)],
      ];
      flows.forEach((f, k) => {
        const a = pos[f[0]], b = pos[f[1]];
        const lift = k === 0 ? -36 : 36;
        A.arrow(ctx, a[0], a[1] + lift * 0.15, b[0], b[1] + lift * 0.15, k ? C.teal : C.gold, 1.5 + f[2]);
        A.label(ctx, f[3], (a[0] + b[0]) / 2 - 70, (a[1] + b[1]) / 2 + lift, C.ink, 14);
      });
      names.forEach((name, i) => {
        A.disc(ctx, pos[i][0], pos[i][1], 28, C.burgundy);
        ctx.fillStyle = C.paper;
        ctx.font = "20px " + A.SERIF;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, pos[i][0], pos[i][1]);
      });
      const base = h * 0.78, maxv = Math.max(x[0], x[1], st.d1, st.d2, 0.1);
      const bw = Math.min(36, w / 16);
      [["甲需求", st.d1], ["甲总产", x[0]], ["乙需求", st.d2], ["乙总产", x[1]]].forEach((item, i) => {
        const bh = (item[1] / maxv) * (h * 0.22);
        const px = w * 0.18 + i * (bw + 28);
        ctx.fillStyle = i % 2 ? C.burgundy : C.gold;
        ctx.fillRect(px, base - bh, bw, bh);
        ctx.fillStyle = C.ink;
        ctx.textAlign = "center";
        ctx.font = "13px " + A.SERIF;
        ctx.fillText(item[0], px + bw / 2, base + 18);
        ctx.fillText(num(item[1], 2), px + bw / 2, base - bh - 6);
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    },
  });

  function l1(u) { return u.reduce((s, a) => s + Math.abs(a), 0); }

  scenes.push({
    id: "bow", ch: "data", title: "词袋与余弦", keys: "文档 相似度 点积 长度 找错",
    lead: "句子放进同一组词坐标里。余弦只看夹角，不看句子长短。长度是平方和再开方，不是分量相加。",
    init: { i: "0", j: "1", wrong: "no" },
    controls: [
      cho("i", "文档甲", [["0", "知之为知之"], ["1", "不知为不知"], ["2", "温故而知新"], ["3", "学而时习之"]]),
      cho("j", "文档乙", [["0", "知之为知之"], ["1", "不知为不知"], ["2", "温故而知新"], ["3", "学而时习之"]]),
      cho("wrong", "长度", [["no", "开方"], ["yes", "误把分量相加"]]),
    ],
    presets: [{ name: "1 与 2", set: { i: "0", j: "1", wrong: "no" } }, { name: "看那个错", set: { i: "0", j: "1", wrong: "yes" } }, { name: "3 与 4", set: { i: "2", j: "3", wrong: "no" } }],
    read(st) {
      const u = M.DOCS[Number(st.i)].v, v = M.DOCS[Number(st.j)].v;
      const c = M.cosine(u, v);
      const bad = M.dot(u, v) / (l1(u) * l1(v));
      if (st.i === "0" && st.j === "1" && st.wrong === "no") return say("cos = 5/9 ≈ " + num(c, 3), "点积 5，长度都是 3，不是 5。夹角看方向，两句都短，也可以很像。", "good");
      if (st.wrong === "yes") return say("误算 " + num(bad, 3) + "　真值 " + num(c, 3), "虚线是误算对应的夹角。长度用分量相加，余弦会被算小，两句话看起来更不像。", "bad");
      return say("cos = " + num(c, 3), "点积 " + M.dot(u, v) + "，长度 " + num(M.mag(u), 2) + " 与 " + num(M.mag(v), 2) + "。");
    },
    draw(ctx, w, h, st) {
      const left = Math.floor(w * 0.58);
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const vocab = M.VOCAB, docs = M.DOCS;
      const L = 16, T = 36;
      const cellW = (left - L - 8) / vocab.length, cellH = (h - T - 16) / docs.length;
      ctx.textAlign = "center";
      vocab.forEach((ch, j) => {
        ctx.fillStyle = C.ink;
        ctx.font = "14px " + A.SERIF;
        ctx.fillText(ch, L + (j + 0.5) * cellW, 22);
      });
      const i0 = Number(st.i), j0 = Number(st.j);
      docs.forEach((doc, i) => {
        doc.v.forEach((val, j) => {
          const a = val === 0 ? 0.05 : 0.22 + 0.22 * val;
          const hot = i === i0 || i === j0;
          ctx.fillStyle = hot ? "rgba(107,20,86," + a + ")" : "rgba(106,88,88," + (a * 0.55) + ")";
          ctx.fillRect(L + j * cellW, T + i * cellH, cellW - 2, cellH - 4);
          ctx.fillStyle = val ? C.paper : C.muted;
          ctx.font = "13px " + A.SERIF;
          ctx.fillText(String(val), L + (j + 0.5) * cellW, T + (i + 0.62) * cellH);
        });
      });
      const u = docs[i0].v, v = docs[j0].v;
      const ang = Math.acos(Math.max(-1, Math.min(1, M.cosine(u, v))));
      A.pane(ctx, left, 0, w - left, h, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: -0.3, xMax: 2.4, yMin: -0.3, yMax: 2.2, title: "它们张成的平面", xlabel: "", ylabel: "" });
        const U = [1.7, 0], V = [1.7 * Math.cos(ang), 1.7 * Math.sin(ang)];
        A.arrow(ctx, box.xOf(0), box.yOf(0), box.xOf(U[0]), box.yOf(U[1]), C.burgundy, 2.4);
        A.arrow(ctx, box.xOf(0), box.yOf(0), box.xOf(V[0]), box.yOf(V[1]), C.gold, 2.4);
        if (st.wrong === "yes") {
          const wrong = Math.acos(Math.max(-1, Math.min(1, M.dot(u, v) / (l1(u) * l1(v)))));
          const G = [1.7 * Math.cos(wrong), 1.7 * Math.sin(wrong)];
          A.dash(ctx, box.xOf(0), box.yOf(0), box.xOf(G[0]), box.yOf(G[1]), C.danger);
        }
        A.label(ctx, "甲", box.xOf(U[0]) - 8, box.yOf(U[1]) + 18, C.burgundy, 14);
        A.label(ctx, "乙", box.xOf(V[0]) + 4, box.yOf(V[1]) - 6, C.gold, 14);
      });
      ctx.textAlign = "left";
    },
  });

  scenes.push({
    id: "pagerank", ch: "data", title: "PageRank", keys: "阻尼 稳定权重 特征向量 迭代 链接",
    lead: "A→B→C→A，C 也指向 D。D 没有出链，就把权重分给每一页。走到不再变的时候，那个向量就是特征值 1 的方向。",
    init: { d: 1 },
    mem: { x: [0.25, 0.25, 0.25, 0.25], k: 0, playing: false },
    controls: [
      rng("d", "阻尼 d", 0.5, 1, 0.01, 2),
      act("step", "迭代一次"),
      act("play", "连续播放"),
      act("reset", "复位"),
      act("rand", "随机初值"),
    ],
    presets: [{ name: "教材 d = 1", set: { d: 1 } }, { name: "阻尼 0.85", set: { d: 0.85 } }],
    oninput(key) {
      if (key === "d") { this.mem.x = [0.25, 0.25, 0.25, 0.25]; this.mem.k = 0; this.mem.playing = false; }
    },
    onpreset() {
      this.mem.x = [0.25, 0.25, 0.25, 0.25]; this.mem.k = 0; this.mem.playing = false;
    },
    action(key, st) {
      if (key === "step") { this.mem.x = M.prMul(this.mem.x, st.d); this.mem.k += 1; this.mem.playing = false; }
      if (key === "reset") { this.mem.x = [0.25, 0.25, 0.25, 0.25]; this.mem.k = 0; this.mem.playing = false; }
      if (key === "rand") {
        const r = [0, 1, 2, 3].map(() => 0.05 + Math.random());
        const s = r.reduce((a, b) => a + b, 0);
        this.mem.x = r.map((a) => a / s);
        this.mem.k = 0;
        this.mem.playing = false;
      }
      if (key === "play") this.mem.playing = !this.mem.playing;
    },
    read(st) {
      const x = this.mem.x;
      const fixed = M.prFixed(st.d);
      const nxt = M.prMul(x, st.d);
      const dd = Math.max(...x.map((v, i) => Math.abs(v - nxt[i])));
      const done = dd < 0.001 && this.mem.k > 0;
      return say("第 " + this.mem.k + " 步　(" + x.map((v) => num(v, 3)).join(", ") + ")",
        done ? "再迭代几乎不变。稳定值约 (" + fixed.map((v) => num(v, 3)).join(", ") + ")。d = 1 时精确值是 (4, 5, 6, 4)/19，C 最大。" : "被指得多的页会渐渐变大。阻尼越小，四页越被拉向平均。",
        done ? "good" : "");
    },
    draw(ctx, w, h, st) {
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const x = this.mem.x;
      const pos = [[w * 0.3, h * 0.28], [w * 0.72, h * 0.28], [w * 0.3, h * 0.7], [w * 0.72, h * 0.7]];
      const rad = (i) => 22 + 40 * x[i];
      const edges = [[0, 1], [1, 2], [2, 0], [2, 3]];
      ctx.strokeStyle = C.gold;
      ctx.fillStyle = C.gold;
      ctx.lineWidth = 2;
      edges.forEach(([i, j]) => {
        const a = pos[i], b = pos[j];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const shrink = Math.max(rad(i), rad(j)) + 8;
        const x1 = a[0] + ux * (rad(i) + 6), y1 = a[1] + uy * (rad(i) + 6);
        const x2 = b[0] - ux * shrink, y2 = b[1] - uy * shrink;
        A.arrow(ctx, x1, y1, x2, y2, C.gold, 2);
      });
      ["A", "B", "C", "D"].forEach((name, i) => {
        A.disc(ctx, pos[i][0], pos[i][1], rad(i), C.burgundy);
        ctx.fillStyle = C.paper;
        ctx.font = "700 18px " + A.SERIF;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, pos[i][0], pos[i][1]);
        ctx.fillStyle = C.muted;
        ctx.font = "13px " + A.SERIF;
        ctx.fillText(num(x[i], 3), pos[i][0], pos[i][1] + rad(i) + 16);
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      A.label(ctx, "D 没有出链", pos[3][0] - 36, pos[3][1] + rad(3) + 36, C.muted, 13);
    },
  });

  window.ATLAS_SCENES = (window.ATLAS_SCENES || []).concat(scenes);
})();
