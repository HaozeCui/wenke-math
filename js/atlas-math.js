/* 概念图鉴的可核验计算。不碰页面。教材例子的数值以这里为准。 */
(function (root) {
  const PI = Math.PI;
  const E = Math.E;

  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
  function sub(a, b) { return a.map((v, i) => v - b[i]); }
  function add(a, b) { return a.map((v, i) => v + b[i]); }
  function mul(a, s) { return a.map((v) => v * s); }
  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }
  function hypot(a) { return Math.hypot.apply(null, a); }

  function fee(x) {
    const p = 0.8, q = 2;
    if (x <= 0) return 0;
    if (x < q) return p * q;
    return p * x;
  }

  function barrelH(r) { return 16 / (r * r); }
  function barrelS(r) { return 2 * PI * r * barrelH(r) + 2 * PI * r * r; }
  const barrelR = 2;

  function poly(x) { return x * x * x - 9 * x * x + 15 * x + 3; }
  function poly1(x) { return 3 * (x - 1) * (x - 5); }
  function poly2(x) { return 6 * (x - 3); }

  function sqrtLin(dx) { return 2 + 0.25 * dx; }

  function chainSlope(x) { return Math.cos(x * x) * 2 * x; }

  function lhopRatio(x) { return x === 0 ? 1 : Math.sin(x) / x; }

  function substExact(b) { return Math.sin(b * b); }

  function partsExact(b) { return b * Math.log(b) - b + 1; }
  function partsRect(b) { return b * Math.log(b); }
  function partsInverse(b) { return b - 1; }

  function riemann(n, method) {
    const dx = PI / n;
    if (method === "simpson") {
      const m = n % 2 === 0 ? n : n + 1;
      const h = PI / m;
      let s = Math.sin(0) + Math.sin(PI);
      for (let i = 1; i < m; i++) s += (i % 2 ? 4 : 2) * Math.sin(i * h);
      return (h / 3) * s;
    }
    if (method === "trap") {
      let s = 0.5 * (Math.sin(0) + Math.sin(PI));
      for (let i = 1; i < n; i++) s += Math.sin(i * dx);
      return s * dx;
    }
    let s = 0;
    for (let i = 0; i < n; i++) {
      const x = method === "left" ? i * dx : method === "right" ? (i + 1) * dx : (i + 0.5) * dx;
      s += Math.sin(x) * dx;
    }
    return s;
  }

  function ftc(x) { return 1 - Math.cos(x); }

  function signed(T) {
    const k = Math.floor(T / PI + 1e-12);
    const r = T - k * PI;
    return { net: 1 - Math.cos(T), gross: 2 * k + (1 - Math.cos(r)) };
  }

  function improper(B) { return 1 - 1 / B; }

  const regionArea = 4.5;

  function popLogistic(t) {
    const y0 = 29.8, r0 = 0.029, ym = 82.3;
    const c = ym / y0 - 1;
    return ym / (1 + c * Math.exp(-r0 * t));
  }
  function popExpo(t) { return 29.8 * Math.exp(0.0185 * t); }

  function logistic(t, r) {
    const K = 1, y0 = 0.05;
    const n = 160, dt = 12 / n;
    let y = y0;
    const steps = Math.max(0, Math.min(n, Math.round(t / dt)));
    for (let i = 0; i < steps; i++) y += r * y * (1 - y / K) * dt;
    return y;
  }

  function carbon(t) { return Math.pow(2, -t / 5730); }

  function pathRay(th) { return Math.cos(2 * th); }
  function pathLine(m, x) { return (m * x) / (x * x + m * m); }
  function pathPara() { return 0.5; }

  function profit(x, y) { return 50 * x + 30 * y - x * x - y * y - x * y; }
  function profitX(x, y) { return 50 - 2 * x - y; }
  function profitY(x, y) { return 30 - x - 2 * y; }

  function triSum(n) {
    const h = 1 / n;
    let s = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = (i + 0.5) * h, y = (j + 0.5) * h;
        if (x + y <= 1) s += (x + y) * h * h;
      }
    }
    return s;
  }

  function det2(u, v) { return u[0] * v[1] - u[1] * v[0]; }

  const SARRUS = [
    { sign: 1, cells: [[0, 0], [1, 1], [2, 2]], prod: 1 },
    { sign: 1, cells: [[0, 1], [1, 2], [2, 3]], prod: 40 },
    { sign: 1, cells: [[0, 2], [1, 3], [2, 4]], prod: 0 },
    { sign: -1, cells: [[0, 2], [1, 1], [2, 0]], prod: 15 },
    { sign: -1, cells: [[0, 3], [1, 2], [2, 1]], prod: 0 },
    { sign: -1, cells: [[0, 4], [1, 3], [2, 2]], prod: 0 },
  ];
  function sarrusSum(step) {
    let s = 0;
    for (let i = 0; i < step && i < SARRUS.length; i++) s += SARRUS[i].sign * SARRUS[i].prod;
    return s;
  }

  function cramer(a, b, c, d, e, f) {
    const D = a * d - b * c;
    if (Math.abs(D) < 1e-12) return { D, x: null, y: null };
    return { D, x: (e * d - b * f) / D, y: (a * f - e * c) / D };
  }

  function matMul(A, B) {
    return [
      [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
      [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
    ];
  }
  function matVec(A, v) { return [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]; }
  function matDet(A) { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
  function matInv(A) {
    const D = matDet(A);
    if (Math.abs(D) < 1e-12) return null;
    return [[A[1][1] / D, -A[0][1] / D], [-A[1][0] / D, A[0][0] / D]];
  }
  function matRank(A) {
    if (Math.abs(matDet(A)) > 1e-8) return 2;
    const z = A[0][0] === 0 && A[0][1] === 0 && A[1][0] === 0 && A[1][1] === 0;
    return z ? 0 : 1;
  }

  const MAT_A = [[0, 1], [0, 0]];
  const MAT_B = [[0, 0], [1, 0]];

  function eigen2(A) {
    const a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];
    const tr = a + d, det = a * d - b * c;
    const disc = tr * tr - 4 * det;
    if (disc < -1e-8) return [];
    const s = Math.sqrt(Math.max(0, disc));
    const ls = Math.abs(s) < 1e-8 ? [tr / 2] : [(tr + s) / 2, (tr - s) / 2];
    return ls.map((l) => {
      let v;
      if (Math.abs(b) > 1e-8) v = [b, l - a];
      else if (Math.abs(c) > 1e-8) v = [l - d, c];
      else v = Math.abs(a - l) <= Math.abs(d - l) ? [1, 0] : [0, 1];
      const L = Math.hypot(v[0], v[1]) || 1;
      return { l, v: [v[0] / L, v[1] / L] };
    });
  }

  function solve3(planes) {
    const M = planes.map((p) => [p.n[0], p.n[1], p.n[2], p.d]);
    const eps = 1e-9;
    const where = [-1, -1, -1];
    let row = 0;
    for (let col = 0; col < 3 && row < 3; col++) {
      let sel = row;
      for (let i = row + 1; i < 3; i++) if (Math.abs(M[i][col]) > Math.abs(M[sel][col])) sel = i;
      if (Math.abs(M[sel][col]) < eps) continue;
      const tmp = M[sel]; M[sel] = M[row]; M[row] = tmp;
      const div = M[row][col];
      for (let j = col; j < 4; j++) M[row][j] /= div;
      for (let i = 0; i < 3; i++) if (i !== row) {
        const f = M[i][col];
        for (let j = col; j < 4; j++) M[i][j] -= f * M[row][j];
      }
      where[col] = row;
      row++;
    }
    for (let i = 0; i < 3; i++) {
      if (Math.abs(M[i][0]) < eps && Math.abs(M[i][1]) < eps && Math.abs(M[i][2]) < eps && Math.abs(M[i][3]) > 1e-7) {
        return { kind: "none" };
      }
    }
    const sol = [0, 0, 0];
    let free = 0;
    for (let j = 0; j < 3; j++) {
      if (where[j] === -1) free++;
      else sol[j] = M[where[j]][3];
    }
    if (free === 0) return { kind: "point", sol };
    if (free === 1) return { kind: "line", sol };
    if (free === 2) return { kind: "plane", sol };
    return { kind: "space", sol };
  }

  function lineOf(p, q) {
    const dir = cross(p.n, q.n);
    const d2 = dot(dir, dir);
    if (d2 < 1e-12) return null;
    const point = mul(add(mul(cross(q.n, dir), p.d), mul(cross(dir, p.n), q.d)), 1 / d2);
    return { point, dir };
  }

  function clipSegment(point, dir, lo, hi) {
    let t0 = -1e9, t1 = 1e9;
    for (let i = 0; i < 3; i++) {
      const p = point[i], d = dir[i];
      if (Math.abs(d) < 1e-12) {
        if (p < lo - 1e-8 || p > hi + 1e-8) return null;
      } else {
        let a = (lo - p) / d, b = (hi - p) / d;
        if (a > b) { const t = a; a = b; b = t; }
        if (a > t0) t0 = a;
        if (b < t1) t1 = b;
      }
    }
    if (t0 > t1) return null;
    return [add(point, mul(dir, t0)), add(point, mul(dir, t1))];
  }

  function planePolygon(plane, lo, hi) {
    const n = plane.n, d = plane.d;
    const cs = [];
    for (const x of [lo, hi]) for (const y of [lo, hi]) for (const z of [lo, hi]) cs.push([x, y, z]);
    const pts = [];
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
      let diff = 0;
      for (let k = 0; k < 3; k++) if (cs[i][k] !== cs[j][k]) diff++;
      if (diff !== 1) continue;
      const p = cs[i], q = cs[j];
      const ap = dot(n, p), aq = dot(n, q), den = aq - ap;
      if (Math.abs(den) < 1e-12) continue;
      const t = (d - ap) / den;
      if (t >= -1e-7 && t <= 1 + 1e-7) {
        const tt = Math.max(0, Math.min(1, t));
        pts.push(add(p, mul(sub(q, p), tt)));
      }
    }
    const uniq = [];
    pts.forEach((p) => {
      if (!uniq.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 1e-5)) uniq.push(p);
    });
    if (uniq.length < 3) return uniq;
    const nn = mul(n, 1 / (hypot(n) || 1));
    const tmp = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    let u = cross(nn, tmp);
    u = mul(u, 1 / (hypot(u) || 1));
    const v = cross(nn, u);
    const c = [0, 0, 0];
    uniq.forEach((p) => { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; });
    c[0] /= uniq.length; c[1] /= uniq.length; c[2] /= uniq.length;
    uniq.sort((p, q) => Math.atan2(dot(sub(p, c), v), dot(sub(p, c), u)) - Math.atan2(dot(sub(q, c), v), dot(sub(q, c), u)));
    return uniq;
  }

  const PLANES = {
    point: [
      { n: [1, 1, -1], d: 1, name: "x + y − z = 1" },
      { n: [-1, 1, 1], d: 1, name: "−x + y + z = 1" },
      { n: [1, -1, 1], d: 1, name: "x − y + z = 1" },
    ],
    line: [
      { n: [2, 1, -3], d: 1, name: "2x + y − 3z = 1" },
      { n: [1, 1, -2], d: 0, name: "x + y − 2z = 0" },
      { n: [1, 0, -1], d: 1, name: "x − z = 1" },
    ],
    same: [
      { n: [1, 1, 1], d: 1, name: "x + y + z = 1" },
      { n: [2, 2, 2], d: 2, name: "2x + 2y + 2z = 2" },
      { n: [3, 3, 3], d: 3, name: "3x + 3y + 3z = 3" },
    ],
    none: [
      { n: [1, 1, 1], d: 1, name: "x + y + z = 1" },
      { n: [1, 1, 1], d: 2, name: "x + y + z = 2" },
      { n: [1, 1, 1], d: 3, name: "x + y + z = 3" },
    ],
  };

  function classify2(a1, b1, c1, a2, b2, c2) {
    const D = a1 * b2 - a2 * b1;
    if (Math.abs(D) > 1e-9) return { kind: "one", x: (c1 * b2 - c2 * b1) / D, y: (a1 * c2 - a2 * c1) / D };
    const scale = Math.abs(a1) >= Math.abs(b1) ? a1 : b1;
    if (Math.abs(scale) < 1e-12) return { kind: "none" };
    const lam = (Math.abs(a1) >= Math.abs(b1) ? a2 : b2) / scale;
    const ok = Math.abs(a2 - lam * a1) < 1e-7 && Math.abs(b2 - lam * b1) < 1e-7 && Math.abs(c2 - lam * c1) < 1e-7;
    return { kind: ok ? "inf" : "none" };
  }

  function generalAt(t) { return [-2 * t, 2 + t]; }

  function leontief(d1, d2) {
    const det = 0.6;
    return [(0.9 * d1 + 0.4 * d2) / det, (0.3 * d1 + 0.8 * d2) / det];
  }

  const VOCAB = ["知", "之", "为", "不", "温", "故", "而", "新", "学", "时", "习"];
  const DOCS = [
    { name: "知之为知之", v: [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "不知为不知", v: [2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
    { name: "温故而知新", v: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0] },
    { name: "学而时习之", v: [0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1] },
  ];
  function mag(u) { return Math.hypot.apply(null, u); }
  function cosine(u, v) { return dot(u, v) / (mag(u) * mag(v)); }

  const PR_M = [
    [0, 0, 0.5, 0.25],
    [1, 0, 0, 0.25],
    [0, 1, 0, 0.25],
    [0, 0, 0.5, 0.25],
  ];
  function prMul(x, d) {
    const s = x.reduce((a, b) => a + b, 0);
    return PR_M.map((row) => d * row.reduce((acc, a, j) => acc + a * x[j], 0) + ((1 - d) / 4) * s);
  }
  function prFixed(d) {
    let x = [0.25, 0.25, 0.25, 0.25];
    for (let k = 0; k < 400; k++) x = prMul(x, d);
    return x;
  }

  function fibRatio(n) {
    let a = 1, b = 1;
    for (let i = 1; i < n; i++) { const t = a + b; a = b; b = t; }
    return b / a;
  }
  function seqTerm(kind, n) {
    if (kind === "inv") return 1 / n;
    if (kind === "e") return Math.pow(1 + 1 / n, n);
    if (kind === "phi") return fibRatio(n);
    if (kind === "alt") return ((n % 2 === 0) ? 1 : -1) / n;
    return (n % 2 === 0) ? 1 : -1;
  }
  function seqLimit(kind) {
    if (kind === "inv" || kind === "alt") return 0;
    if (kind === "e") return E;
    if (kind === "phi") return (1 + Math.sqrt(5)) / 2;
    return null;
  }

  function audit() {
    const err = [];
    const near = (a, b, eps, msg) => { if (!(Math.abs(a - b) <= eps)) err.push(msg + " got " + a + " want " + b); };
    near(barrelS(barrelR), 24 * PI, 1e-9, "barrel");
    near(barrelH(2), 4, 1e-9, "barrel H");
    let best = 1, bs = barrelS(1);
    for (let r = 0.8; r <= 3.2; r += 0.05) if (barrelS(r) < bs) { bs = barrelS(r); best = r; }
    near(best, 2, 0.051, "barrel min");
    near(fee(0), 0, 0, "fee0");
    near(fee(1), 1.6, 1e-9, "fee mid");
    near(fee(2), 1.6, 1e-9, "fee q");
    near(fee(5), 4, 1e-9, "fee ray");
    near(Math.floor(-0.2), -1, 0, "floor");
    near(poly1(1), 0, 1e-9, "crit1");
    near(poly1(5), 0, 1e-9, "crit5");
    near(poly(1), 10, 1e-9, "f(1)");
    near(poly(5), -22, 1e-9, "f(5)");
    near(poly2(3), 0, 1e-9, "inflect");
    near(lhopRatio(0.0001), 1, 1e-4, "sinc");
    near(substExact(1), Math.sin(1), 1e-12, "subst");
    near(partsExact(E), 1, 1e-9, "parts");
    near(partsRect(E) - partsInverse(E), 1, 1e-9, "parts split");
    near(riemann(40, "mid"), 2, 1e-3, "riemann mid");
    near(riemann(4, "simpson"), 2, 0.01, "simpson");
    near(ftc(PI), 2, 1e-12, "ftc");
    near(signed(PI).net, 2, 1e-12, "signed net");
    near(signed(2 * PI).net, 0, 1e-12, "signed cancel");
    near(signed(2 * PI).gross, 4, 1e-12, "signed gross");
    near(improper(20), 0.95, 1e-12, "improper");
    near(regionArea, 4.5, 0, "region");
    near(carbon(5730), 0.5, 1e-12, "carbon");
    near(carbon(11460), 0.25, 1e-12, "carbon2");
    near(pathRay(0), 1, 1e-12, "ray0");
    near(pathRay(PI / 2), -1, 1e-12, "ray90");
    near(pathRay(PI / 4), 0, 1e-12, "ray45");
    near(pathLine(2, 0.01), 2 * 0.01 / (0.0001 + 4), 1e-12, "path line");
    near(pathPara(), 0.5, 0, "parabola");
    near(profitX(70 / 3, 10 / 3), 0, 1e-9, "Px");
    near(profitY(70 / 3, 10 / 3), 0, 1e-9, "Py");
    near(profit(70 / 3, 10 / 3), 1900 / 3, 1e-6, "Pmax");
    if (!(Math.abs(triSum(48) - 1 / 3) < Math.abs(triSum(4) - 1 / 3))) err.push("tri sum should improve");
    near(triSum(80), 1 / 3, 0.01, "tri");
    near(det2([2, 0], [0.8, 1]), 2, 1e-12, "shear det");
    near(det2([1, 0], [0, -1]), -1, 1e-12, "orient");
    near(sarrusSum(6), 26, 0, "sarrus");
    const cr = cramer(2, 1, 1, -1, 4, 1);
    near(cr.x, 5 / 3, 1e-12, "cramer x");
    near(cr.y, 2 / 3, 1e-12, "cramer y");
    const AB = matMul(MAT_A, MAT_B), BA = matMul(MAT_B, MAT_A);
    near(AB[0][0], 1, 0, "AB00"); near(AB[1][1], 0, 0, "AB11");
    near(BA[1][1], 1, 0, "BA11"); near(BA[0][0], 0, 0, "BA00");
    const Inv = matInv([[1, 2], [3, 4]]);
    near(Inv[0][0], -2, 1e-12, "inv");
    near(matRank([[1, 2], [2, 4]]), 1, 0, "rank1");
    near(matRank([[1, 2], [3, 4]]), 2, 0, "rank2");
    const eg = eigen2([[2, 0], [0, 0.5]]);
    if (eg.length !== 2) err.push("eigen count");
    else near(eg[0].l * eg[1].l, 1, 1e-9, "eigen prod");
    if (eigen2([[0, -1], [1, 0]]).length !== 0) err.push("rotation eigen");
    const sp = solve3(PLANES.point);
    if (!sp || sp.kind !== "point") err.push("plane point kind " + (sp && sp.kind));
    else { near(sp.sol[0], 1, 1e-8, "px"); near(sp.sol[1], 1, 1e-8, "py"); near(sp.sol[2], 1, 1e-8, "pz"); }
    const sl = solve3(PLANES.line);
    if (!sl || sl.kind !== "line") err.push("plane line kind");
    const ln = lineOf(PLANES.line[0], PLANES.line[1]);
    if (!ln) err.push("no line");
    else {
      const dir = ln.dir;
      near(dir[1] / dir[0], 1, 1e-8, "line dir");
      const p0 = add(ln.point, mul(dir, (0 - ln.point[2]) / dir[2]));
      PLANES.line.forEach((pl, i) => near(dot(pl.n, p0), pl.d, 1e-6, "line eq " + i));
      if (!clipSegment(ln.point, ln.dir, -1.6, 2.4)) err.push("line misses box");
    }
    if (!solve3(PLANES.none) || solve3(PLANES.none).kind !== "none") err.push("parallel");
    if (!solve3(PLANES.same) || solve3(PLANES.same).kind !== "plane") err.push("same plane");
    PLANES.none.forEach((pl, i) => { if (planePolygon(pl, -1.6, 2.4).length < 3) err.push("poly " + i); });
    const one = classify2(1, 1, 2, 1, -1, 0);
    near(one.x, 1, 1e-9, "lines x"); near(one.y, 1, 1e-9, "lines y");
    if (classify2(1, 1, 1, 1, 1, 3).kind !== "none") err.push("parallel lines");
    if (classify2(1, 1, 2, 2, 2, 4).kind !== "inf") err.push("same line");
    const g = generalAt(1);
    near(g[0] + 2 * g[1], 4, 1e-12, "general");
    const lx = leontief(1, 1);
    near(0.2 * lx[0] + 0.4 * lx[1] + 1, lx[0], 1e-9, "leon1");
    near(0.3 * lx[0] + 0.1 * lx[1] + 1, lx[1], 1e-9, "leon2");
    near(cosine(DOCS[0].v, DOCS[1].v), 5 / 9, 1e-12, "cosine");
    const pr = prFixed(1);
    near(pr[0], 4 / 19, 1e-4, "prA");
    near(pr[1], 5 / 19, 1e-4, "prB");
    near(pr[2], 6 / 19, 1e-4, "prC");
    near(pr[3], 4 / 19, 1e-4, "prD");
    near(seqTerm("phi", 12), (1 + Math.sqrt(5)) / 2, 1e-3, "phi");
    near(seqLimit("e"), E, 0, "e lim");
    if (!(seqTerm("e", 40) < E && seqTerm("e", 40) > 2.6)) err.push("e sequence");
    return err;
  }

  const api = {
    PI, E, dot, sub, add, mul, cross, hypot,
    fee, barrelH, barrelS, barrelR,
    poly, poly1, poly2, sqrtLin, chainSlope, lhopRatio,
    substExact, partsExact, partsRect, partsInverse,
    riemann, ftc, signed, improper, regionArea,
    popLogistic, popExpo, logistic, carbon,
    pathRay, pathLine, pathPara,
    profit, profitX, profitY, triSum,
    det2, SARRUS, sarrusSum, cramer,
    matMul, matVec, matDet, matInv, matRank, MAT_A, MAT_B, eigen2,
    solve3, lineOf, clipSegment, planePolygon, PLANES,
    classify2, generalAt, leontief,
    VOCAB, DOCS, mag, cosine, PR_M, prMul, prFixed,
    seqTerm, seqLimit, fibRatio, audit,
  };
  root.AtlasMath = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

if (typeof window === "undefined") {
  const errs = globalThis.AtlasMath.audit();
  if (errs.length) {
    console.error(errs.join("\n"));
    process.exit(1);
  }
  console.log("audit ok");
}
