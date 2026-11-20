/* 概念图鉴 · 目录与交互 */
(function () {
  const M = window.AtlasMath;
  const scenes = window.ATLAS_SCENES || [];
  const CHAPTERS = [
    ["fn", "1.1", "函数"],
    ["lim", "1.2", "极限"],
    ["der", "1.3", "导数"],
    ["app", "1.4", "导数的应用"],
    ["ind", "1.5", "不定积分"],
    ["def", "1.6", "定积分"],
    ["iap", "1.7", "积分应用"],
    ["two", "1.8", "二元函数"],
    ["det", "2.1", "行列式"],
    ["mat", "2.2", "矩阵"],
    ["sys", "2.3", "方程组"],
    ["data", "2.4", "数据科学"],
  ];
  const state = {};
  scenes.forEach((sc) => { state[sc.id] = Object.assign({}, sc.init); });
  let currentId = scenes[0] ? scenes[0].id : "";
  let playTimer = 0;
  let drag = false;

  const nav = document.getElementById("nav");
  const canvas = document.getElementById("view");
  const qEl = document.getElementById("q");

  function chapter(id) { return CHAPTERS.find((c) => c[0] === id) || ["", "", ""]; }
  function current() { return scenes.find((s) => s.id === currentId); }
  function textVal(c, v) {
    if (c.type === "choice") {
      const hit = c.options.find((o) => o[0] === v);
      return hit ? hit[1] : v;
    }
    const digits = c.digits == null ? 2 : c.digits;
    return window.A.num(Number(v), digits);
  }
  function query() { return qEl.value.trim().toLowerCase(); }
  function visible() {
    const q = query();
    return scenes.filter((sc) => {
      if (!q) return true;
      const ch = chapter(sc.ch);
      return (sc.title + " " + sc.keys + " " + ch[1] + " " + ch[2]).toLowerCase().indexOf(q) !== -1;
    });
  }

  function buildNav() {
    const list = visible();
    nav.innerHTML = "";
    if (!list.length) {
      nav.innerHTML = "<p class='empty'>没有这一条。试试：黎曼、圆桶、阻尼。</p>";
      return;
    }
    let last = "";
    list.forEach((sc) => {
      if (sc.ch !== last) {
        last = sc.ch;
        const ch = chapter(sc.ch);
        const h = document.createElement("div");
        h.className = "ch";
        h.textContent = ch[1] + "　" + ch[2];
        nav.appendChild(h);
      }
      const b = document.createElement("button");
      b.type = "button";
      b.className = "scene" + (sc.id === currentId ? " on" : "");
      b.dataset.id = sc.id;
      b.textContent = sc.title;
      b.onclick = () => show(sc.id);
      nav.appendChild(b);
    });
  }

  function markNav() {
    nav.querySelectorAll("button.scene").forEach((b) => b.classList.toggle("on", b.dataset.id === currentId));
  }

  function mount(sc) {
    const st = state[sc.id];
    const controls = document.getElementById("controls");
    const presets = document.getElementById("presets");
    controls.innerHTML = "";
    presets.innerHTML = "";
    (sc.controls || []).forEach((c) => {
      const wrap = document.createElement("div");
      wrap.className = "ctrl";
      wrap.dataset.k = c.key;
      if (c.type !== "action") {
        const row = document.createElement("div");
        row.className = "row";
        const span = document.createElement("span");
        span.textContent = c.label;
        const b = document.createElement("b");
        b.dataset.v = c.key;
        b.textContent = textVal(c, st[c.key]);
        row.append(span, b);
        wrap.appendChild(row);
      }
      if (c.type === "range") {
        const el = document.createElement("input");
        el.type = "range";
        el.id = "c-" + c.key;
        el.min = c.min;
        el.max = c.max;
        el.step = c.step;
        el.value = st[c.key];
        el.oninput = () => {
          st[c.key] = c.digits === 0 ? Math.round(Number(el.value)) : Number(el.value);
          if (sc.oninput) sc.oninput.call(sc, c.key, st);
          render();
        };
        wrap.appendChild(el);
      } else if (c.type === "choice") {
        const seg = document.createElement("div");
        seg.className = "seg";
        c.options.forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.dataset.v = opt[0];
          btn.textContent = opt[1];
          btn.onclick = () => {
            st[c.key] = opt[0];
            if (sc.oninput) sc.oninput.call(sc, c.key, st);
            render();
          };
          seg.appendChild(btn);
        });
        wrap.appendChild(seg);
      } else {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "navbtn";
        btn.id = "act-" + c.key;
        btn.textContent = c.label;
        btn.onclick = () => {
          if (sc.action) sc.action.call(sc, c.key, st);
          pushInputs(sc);
          render();
        };
        wrap.appendChild(btn);
      }
      controls.appendChild(wrap);
    });
    (sc.presets || []).forEach((preset) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = preset.name;
      btn.onclick = () => {
        Object.assign(st, preset.set);
        if (sc.onpreset) sc.onpreset.call(sc, st);
        pushInputs(sc);
        render();
      };
      presets.appendChild(btn);
    });
  }

  function pushInputs(sc) {
    const st = state[sc.id];
    (sc.controls || []).forEach((c) => {
      if (c.type !== "range") return;
      const el = document.getElementById("c-" + c.key);
      if (el) el.value = st[c.key];
    });
  }

  function sync(sc) {
    const st = state[sc.id];
    (sc.controls || []).forEach((c) => {
      const wrap = document.querySelector('#controls [data-k="' + c.key + '"]');
      if (!wrap) return;
      wrap.hidden = !!(c.when && !c.when(st));
      const b = wrap.querySelector("[data-v]");
      if (b && c.type !== "action") b.textContent = textVal(c, st[c.key]);
      if (c.type === "choice") {
        wrap.querySelectorAll("button").forEach((btn) => btn.classList.toggle("on", btn.dataset.v === String(st[c.key])));
      }
    });
    const play = document.getElementById("act-play");
    if (play && sc.mem) play.textContent = sc.mem.playing ? "暂停" : "连续播放";
  }

  function stopPlay() {
    if (playTimer) clearTimeout(playTimer);
    playTimer = 0;
  }

  function tickPlay() {
    playTimer = 0;
    const cur = current();
    if (!cur || cur.id !== "pagerank" || !cur.mem || !cur.mem.playing) return;
    const st = state[cur.id];
    cur.mem.x = M.prMul(cur.mem.x, st.d);
    cur.mem.k += 1;
    const nxt = M.prMul(cur.mem.x, st.d);
    const dd = Math.max.apply(null, cur.mem.x.map((v, i) => Math.abs(v - nxt[i])));
    if (dd < 0.001 || cur.mem.k > 90) cur.mem.playing = false;
    render();
  }

  function syncPlay(sc) {
    if (!sc || sc.id !== "pagerank" || !sc.mem || !sc.mem.playing) {
      stopPlay();
      return;
    }
    if (playTimer) return;
    playTimer = setTimeout(tickPlay, 380);
  }

  function fit() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(2, r.width);
    const h = Math.max(2, r.height);
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    return { ctx, w, h };
  }

  function render() {
    const sc = current();
    if (!sc) return;
    const st = state[sc.id];
    const ch = chapter(sc.ch);
    const idx = scenes.findIndex((s) => s.id === sc.id);
    document.getElementById("kicker").textContent = ch[1] + "　" + ch[2];
    document.getElementById("title").textContent = sc.title;
    document.getElementById("lead").textContent = sc.lead;
    document.getElementById("pos").textContent = (idx + 1) + " / " + scenes.length;
    sync(sc);
    let info = { formula: "", text: "", tone: "" };
    try { info = sc.read(st) || info; }
    catch (err) { info = { formula: "这一页的说明没有写成", text: err.message, tone: "bad" }; }
    document.getElementById("formula").textContent = info.formula || "";
    const explain = document.getElementById("explain");
    explain.className = "explain " + (info.tone || "");
    explain.textContent = info.text || "";
    const { ctx, w, h } = fit();
    ctx.clearRect(0, 0, w, h);
    try { sc.draw(ctx, w, h, st); }
    catch (err) {
      explain.className = "explain bad";
      explain.textContent = "图没有画出来：" + err.message;
      console.error(err);
    }
    markNav();
    syncPlay(sc);
  }

  function show(id) {
    const sc = scenes.find((s) => s.id === id) || scenes[0];
    if (!sc) return;
    if (currentId !== sc.id) {
      const prev = current();
      if (prev && prev.mem) prev.mem.playing = false;
      stopPlay();
    }
    currentId = sc.id;
    if (history.replaceState) history.replaceState(null, "", "#" + sc.id);
    mount(sc);
    render();
    const btn = nav.querySelector('[data-id="' + sc.id + '"]');
    if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: "nearest" });
  }

  function step(dir) {
    const list = visible();
    const pool = list.length ? list : scenes;
    let i = pool.findIndex((s) => s.id === currentId);
    if (i < 0) i = 0;
    else i = (i + dir + pool.length) % pool.length;
    show(pool[i].id);
  }

  function local(e) {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  canvas.addEventListener("pointerdown", (e) => {
    const sc = current();
    if (!sc || !sc.hit) return;
    drag = !!sc.hit("down", local(e), state[sc.id]);
    if (!drag) return;
    canvas.setPointerCapture(e.pointerId);
    pushInputs(sc);
    render();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const sc = current();
    if (!sc || !sc.hit) return;
    sc.hit("move", local(e), state[sc.id]);
    pushInputs(sc);
    render();
  });
  function endDrag() {
    drag = false;
    const sc = current();
    if (sc) sc._which = null;
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  document.getElementById("prev").onclick = () => step(-1);
  document.getElementById("next").onclick = () => step(1);
  qEl.addEventListener("input", buildNav);
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (e.key === "/" && tag !== "INPUT") { e.preventDefault(); qEl.focus(); }
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && e.altKey) {
      e.preventDefault();
      step(e.key === "ArrowDown" ? 1 : -1);
    }
  });
  if (window.ResizeObserver) new ResizeObserver(() => render()).observe(canvas);
  else window.addEventListener("resize", render);

  document.getElementById("count").textContent = scenes.length + " 个概念";
  const hash = decodeURIComponent((location.hash || "").replace(/^#/, ""));
  if (scenes.some((s) => s.id === hash)) currentId = hash;
  buildNav();
  const errs = M.audit();
  if (errs.length) {
    document.getElementById("pos").textContent = "计算核对失败";
    console.error(errs);
  }
  show(currentId);
})();
