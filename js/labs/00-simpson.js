/* 开篇：辛普森悖论 */
(function () {
  Deck.on("simpson", (slide) => {
    const canvas = slide.querySelector("#simpson-canvas");
    const ids = ["aw", "am", "bw", "bm"];
    const els = Object.fromEntries(ids.map((id) => [id, slide.querySelector("#" + id)]));
    const vals = Object.fromEntries(ids.map((id) => [id, slide.querySelector("#" + id + "-val")]));
    const verdict = slide.querySelector("#simpson-verdict");
    const read = slide.querySelector("#simpson-read");
    function n(id) { return Number(els[id].value); }
    function render() {
      ids.forEach((id) => { vals[id].textContent = n(id); });
      const aw = n("aw") / 150, am = n("am") / 380;
      const bw = n("bw") / 250, bm = n("bm") / 40;
      const tw = (n("aw") + n("bw")) / 400, tm = (n("am") + n("bm")) / 420;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      const labels = ["学院甲", "学院乙", "汇总"];
      const women = [aw, bw, tw].map((x) => x * 100);
      const men = [am, bm, tm].map((x) => x * 100);
      const l = 56, t = 40, bw0 = w - 80, bh = h - 96;
      const groupW = bw0 / 3;
      women.forEach((v, i) => {
        const x = l + i * groupW + 18;
        const h1 = (v / 100) * bh, h2 = (men[i] / 100) * bh;
        ctx.fillStyle = Plot.C.burgundy;
        ctx.fillRect(x, t + bh - h1, 28, h1);
        ctx.fillStyle = Plot.C.gold;
        ctx.fillRect(x + 34, t + bh - h2, 28, h2);
        ctx.fillStyle = Plot.C.muted;
        ctx.font = "24px 'Noto Serif SC', serif";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], x + 30, t + bh + 28);
        ctx.fillText(v.toFixed(1), x + 14, t + bh - h1 - 6);
        ctx.fillText(men[i].toFixed(1), x + 48, t + bh - h2 - 6);
      });
      Plot.label(ctx, "录取率 %", 12, 18, Plot.C.muted);
      const gW = aw > am, gB = bw > bm, gT = tw > tm;
      read.innerHTML = `甲 女 ${ (aw*100).toFixed(1)}% / 男 ${(am*100).toFixed(1)}%　乙 女 ${(bw*100).toFixed(1)}% / 男 ${(bm*100).toFixed(1)}%　汇总 女 ${(tw*100).toFixed(1)}% / 男 ${(tm*100).toFixed(1)}%`;
      verdict.className = "verdict " + (gW === gB && gT !== gW ? "bad" : "");
      verdict.textContent = (gW === gB && gT !== gW)
        ? "分组里都是男生更高，汇总却翻转。隐变量是学院：人数结构改了故事。"
        : "现在分组与汇总同向。把甲女生录取人数拉低（或乙女生拉高），翻转会回来。";
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    ids.forEach((id) => { els[id].oninput = render; });
    render();
  });
})();
