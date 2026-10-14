"""各讲实验侧栏。控件标签不用 $...$，以免 KaTeX 吃掉读数。"""

P = {
    "simpson": """
            <div class="ctrl">
              <label><span>甲院女生录取人数 / 150</span><span class="ctrl-val" id="aw-val">50</span></label>
              <input id="aw" type="range" min="0" max="150" value="50" />
              <label style="margin-top:8px"><span>甲院男生录取人数 / 380</span><span class="ctrl-val" id="am-val">190</span></label>
              <input id="am" type="range" min="0" max="380" value="190" />
              <label style="margin-top:8px"><span>乙院女生录取人数 / 250</span><span class="ctrl-val" id="bw-val">200</span></label>
              <input id="bw" type="range" min="0" max="250" value="200" />
              <label style="margin-top:8px"><span>乙院男生录取人数 / 40</span><span class="ctrl-val" id="bm-val">36</span></label>
              <input id="bm" type="range" min="0" max="40" value="36" />
            </div>
            <div class="readout" id="simpson-read"></div>
            <div class="verdict" id="simpson-verdict"></div>
    """,
    "piecewise": """
            <div class="ctrl">
              <label><span>自变量 $x$</span><span class="ctrl-val" id="pw-x-val">0.40</span></label>
              <input id="pw-x" type="range" min="-1" max="3" step="0.02" value="0.4" />
            </div>
            <div class="readout" id="pw-read"></div>
            <div class="verdict">折点在 $x=1$。左右斜率不同，但图像连着。</div>
    """,
    "floorfn": """
            <div class="ctrl">
              <label><span>自变量 $x$</span><span class="ctrl-val" id="floor-x-val">1.40</span></label>
              <input id="floor-x" type="range" min="-2" max="2.6" step="0.02" value="1.4" />
            </div>
            <div class="readout" id="floor-read"></div>
            <div class="verdict">实心在左端，空心在右端：左闭右开。</div>
    """,
    "compose": """
            <div class="ctrl">
              <label><span>输入 $x$</span><span class="ctrl-val" id="compose-x-val">2.0</span></label>
              <input id="compose-x" type="range" min="-2" max="4" step="0.1" value="2" />
            </div>
            <div class="readout" id="compose-read"></div>
            <div class="verdict">先 $g$ 后 $f$。管道不能从右往左读。</div>
    """,
    "sequence": """
            <div class="ctrl">
              <label><span>项数 n</span><span class="ctrl-val" id="seq-n-val">12</span></label>
              <input id="seq-n" type="range" min="2" max="40" value="12" />
            </div>
            <div class="readout" id="seq-read"></div>
            <div class="verdict">点贴近水平线，但没有任何一项必须等于 0。</div>
    """,
    "leftright": """
            <div class="ctrl">
              <label><span>靠近 0 的 x</span><span class="ctrl-val" id="lr-x-val">-0.80</span></label>
              <input id="lr-x" type="range" min="-1.8" max="1.8" step="0.02" value="-0.8" />
            </div>
            <div class="verdict" id="lr-verdict"></div>
    """,
    "squeeze": """
            <div class="ctrl">
              <label><span>窗口半宽</span><span class="ctrl-val" id="sq-z-val">1.00</span></label>
              <input id="sq-z" type="range" min="0.12" max="1.6" step="0.02" value="1" />
            </div>
            <div class="verdict" id="sq-verdict"></div>
    """,
    "secant": """
            <div class="ctrl">
              <label><span>步长 h</span><span class="ctrl-val" id="secant-h-val">0.80</span></label>
              <input id="secant-h" type="range" min="0.05" max="1.2" step="0.01" value="0.8" />
            </div>
            <div class="readout" id="secant-read"></div>
            <div class="verdict">金色是割线，虚线是切线。h 变小，两条线贴在一起。</div>
    """,
    "corner": """
            <div class="ctrl">
              <label><span>位置 x</span><span class="ctrl-val" id="corner-x-val">-0.80</span></label>
              <input id="corner-x" type="range" min="-1.8" max="1.8" step="0.02" value="-0.8" />
            </div>
            <div class="verdict" id="corner-verdict"></div>
    """,
    "mono": """
            <div class="ctrl">
              <label><span>位置 x</span><span class="ctrl-val" id="mono-x-val">-1.40</span></label>
              <input id="mono-x" type="range" min="-2" max="2" step="0.02" value="-1.4" />
            </div>
            <div class="readout" id="mono-read"></div>
            <div class="verdict">切线向上则升，切线向下则降。驻点在 ±1。</div>
    """,
    "barrel": """
            <div class="ctrl">
              <label><span>半径 r</span><span class="ctrl-val" id="barrel-r-val">1.20</span></label>
              <input id="barrel-r" type="range" min="0.8" max="3" step="0.02" value="1.2" />
            </div>
            <div class="readout" id="barrel-read"></div>
            <div class="verdict">虚线是驻点。太瘦或太扁，表面积都变大。</div>
    """,
    "family": """
            <div class="ctrl">
              <label><span>常数 C</span><span class="ctrl-val" id="family-c-val">1.0</span></label>
              <input id="family-c" type="range" min="-2" max="3" step="0.1" value="1" />
            </div>
            <div class="readout" id="family-read"></div>
            <div class="verdict">整族曲线上下平移。求导后 C 消失。</div>
    """,
    "riemann": """
            <div class="ctrl">
              <label><span>分割份数 n</span><span class="ctrl-val" id="riemann-n-val">8</span></label>
              <input id="riemann-n" type="range" min="2" max="60" value="8" />
              <div class="seg" style="margin-top:10px">
                <button type="button" data-method="left">左矩形</button>
                <button type="button" data-method="mid" class="on">中点</button>
                <button type="button" data-method="right">右矩形</button>
              </div>
              <div class="seg" style="margin-top:10px">
                <button type="button" class="btn primary" id="riemann-play">播放</button>
              </div>
            </div>
            <div class="readout" id="riemann-sum">矩形和</div>
            <small id="riemann-err" style="color:var(--muted)"></small>
            <div class="verdict" id="riemann-verdict"></div>
    """,
    "signed": """
            <div class="ctrl">
              <div class="seg">
                <button type="button" data-signed="all" class="on">全部</button>
                <button type="button" data-signed="pos">只看轴上</button>
                <button type="button" data-signed="neg">只看轴下</button>
              </div>
            </div>
            <div class="verdict" id="signed-verdict"></div>
    """,
    "region": """
            <div class="ctrl">
              <div class="seg">
                <button type="button" data-cut="y" class="on">对 y 切</button>
                <button type="button" data-cut="x">对 x 切</button>
              </div>
            </div>
            <div class="verdict" id="region-verdict"></div>
    """,
    "logistic": """
            <div class="ctrl">
              <label><span>增长率 r</span><span class="ctrl-val" id="log-r-val">0.60</span></label>
              <input id="log-r" type="range" min="0.2" max="1.4" step="0.02" value="0.6" />
            </div>
            <div class="readout" id="log-read"></div>
            <div class="verdict">天花板是环境容量。r 只改陡度，不改上限。</div>
    """,
    "paths": """
            <div class="ctrl">
              <label><span>路径甲的方向 θ₁</span><span class="ctrl-val" id="th1-val">0°</span></label>
              <input id="th1" type="range" min="0" max="180" value="0" />
              <label style="margin-top:10px"><span>路径乙的方向 θ₂</span><span class="ctrl-val" id="th2-val">45°</span></label>
              <input id="th2" type="range" min="0" max="180" value="45" />
              <label style="margin-top:10px"><span>离原点的距离 r</span><span class="ctrl-val" id="rad-val">0.80</span></label>
              <input id="rad" type="range" min="0.08" max="1.2" step="0.02" value="0.8" />
            </div>
            <div class="readout">甲　f = <span id="f1">1.000</span><small>乙　f = <span id="f2">0.000</span>　·　f = cos 2θ</small></div>
            <div class="verdict bad" id="paths-verdict"></div>
    """,
    "slice": """
            <div class="ctrl">
              <label><span>固定的 y</span><span class="ctrl-val" id="slice-y-val">0.80</span></label>
              <input id="slice-y" type="range" min="-2" max="2" step="0.02" value="0.8" />
            </div>
            <div class="readout" id="slice-read"></div>
            <div class="verdict">偏导就是这条截线在 x 方向的斜率。</div>
    """,
    "strips": """
            <div class="ctrl">
              <div class="seg">
                <button type="button" data-strip="d" class="on">D 型竖条</button>
                <button type="button" data-strip="x">X 型横条</button>
              </div>
            </div>
            <div class="verdict" id="strips-verdict"></div>
    """,
    "sarrus": """
            <div class="ctrl">
              <label><span>沙流项</span><span class="ctrl-val" id="sarrus-k-val">1 / 6</span></label>
              <input id="sarrus-k" type="range" min="0" max="5" step="1" value="0" />
            </div>
            <div class="readout" id="sarrus-read"></div>
            <div class="verdict">上三角一眼看出只有主对角活着。</div>
    """,
    "matmul": """
            <div class="ctrl">
              <label><span>A 的行</span><span class="ctrl-val" id="mm-i-val">1</span></label>
              <input id="mm-i" type="range" min="0" max="1" step="1" value="0" />
              <label style="margin-top:10px"><span>B 的列</span><span class="ctrl-val" id="mm-j-val">1</span></label>
              <input id="mm-j" type="range" min="0" max="1" step="1" value="0" />
            </div>
            <div class="readout" id="mm-read"></div>
            <div class="verdict">一行对一列，点乘得到一个数。</div>
    """,
    "abba": """
            <div class="ctrl">
              <div class="seg">
                <button type="button" data-prod="ab" class="on">看 AB</button>
                <button type="button" data-prod="ba">看 BA</button>
              </div>
            </div>
            <div class="readout" id="abba-read"></div>
            <div class="verdict">交换次序，结果可以完全不同。</div>
    """,
    "planes": """
            <div class="ctrl">
              <div class="seg">
                <button type="button" data-plane="one" class="on">唯一解</button>
                <button type="button" data-plane="none">无解</button>
                <button type="button" data-plane="inf">无穷解</button>
              </div>
            </div>
            <div class="verdict" id="planes-verdict"></div>
    """,
    "io": """
            <div class="verdict">箭 = 消耗。写成 (I−A)x = d 之后，才能问「最终需求对应多少总产出」。</div>
    """,
    "bow": """
            <div class="readout" id="bow-read"></div>
            <div class="verdict">点选一行，看这一句变成的向量。多数格子是 0。</div>
    """,
    "cosine": """
            <div class="ctrl">
              <label><span>向量 v 的方向</span><span class="ctrl-val" id="cos-a-val">20°</span></label>
              <input id="cos-a" type="range" min="0" max="90" value="20" />
            </div>
            <div class="readout" id="cos-read"></div>
            <div class="verdict" id="cos-verdict"></div>
    """,
    "pagerank": """
            <div class="ctrl">
              <label><span>已迭代步数</span><span class="ctrl-val" id="pr-iter">0</span></label>
              <div class="seg">
                <button type="button" class="btn primary" id="pr-step">迭代一次</button>
                <button type="button" class="btn" id="pr-play">连续播放</button>
                <button type="button" class="btn ghost" id="pr-reset">重置</button>
              </div>
            </div>
            <div id="pr-bars"></div>
            <div class="verdict" id="pr-verdict"></div>
    """,
}
