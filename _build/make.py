"""生成十三讲 HTML 与课程目录。"""
from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from chrome import write_lec
import lec00
import lec11
import lec12
import lec13
import lec14
import lec15
import lec16
import lec17
import lec18
import lec21
import lec22
import lec23
import lec24

MODULES = [
    lec00, lec11, lec12, lec13, lec14, lec15, lec16,
    lec17, lec18, lec21, lec22, lec23, lec24,
]

HUB = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>文科高等数学 · 课程目录</title>
  <link rel="stylesheet" href="css/deck.css" />
</head>
<body class="hub">
  <div class="app hub">
    <div class="spine" aria-hidden="true"></div>
    <header class="topbar">
      <span class="mark">NKU</span>
      <h1>文科高等数学</h1>
      <span class="sec">课程目录</span>
    </header>
    <main class="stage">
      <div class="hub-hero">
        <div class="kicker">南开大学数学科学学院　·　网页讲义</div>
        <h2>先看见过程，再写下符号</h2>
        <p>建议学时：微积分 38（1.1 含序言）、线性代数 12。1.8、2.4 为新教材新增，不计入上表。方向键翻页；只有过程随参数变化的页才带滑条。公式由本地绘制，教室电脑可双击打开，无需联网。</p>
      </div>
      <p class="hub-kicker">检索</p>
      <input class="hub-search" id="hub-q" type="search" placeholder="搜讲名或关键词，例如：黎曼、辛普森、PageRank、换元" autocomplete="off" />
      <p class="hub-kicker">十三讲</p>
      <div class="hub-grid" id="hub-grid">
        <a href="lectures/00.html" data-q="0 开篇 数学与人文 辛普森 录取 悖论 阿达马 投票 地图">
          <div class="code">0　计入 1.1</div>
          <h3>数学与人文</h3>
          <p>四项目标与学期地图。改录取人数，看分组与汇总是否翻转。</p>
        </a>
        <a href="lectures/11.html" data-q="1.1 函数 分段 取整 复合 电价 区间 定义域">
          <div class="code">1.1　4 学时（含序言）</div>
          <h3>函数</h3>
          <p>分段与取整；一次复合的管道。区间记法。</p>
        </a>
        <a href="lectures/12.html" data-q="1.2 极限 数列 左右 夹逼 连续 振荡">
          <div class="code">1.2　8 学时</div>
          <h3>极限</h3>
          <p>等比数列与级数；左右极限；两个重要极限；等价无穷小。不写 ε 语言。</p>
        </a>
        <a href="lectures/13.html" data-q="1.3 导数 割线 切线 尖点 链式 差商">
          <div class="code">1.3　6 学时</div>
          <h3>导数与微分</h3>
          <p>割线随 h 变成切线；|x| 尖点左右差商。</p>
        </a>
        <a href="lectures/14.html" data-q="1.4 导数应用 单调 极值 圆桶 洛必达 最值">
          <div class="code">1.4　6 学时</div>
          <h3>导数的应用</h3>
          <p>f′ 正负与升降；圆桶表面积最低点。洛必达先判型。</p>
        </a>
        <a href="lectures/15.html" data-q="1.5 不定积分 原函数 换元 分部 加C 压缩">
          <div class="code">1.5　6 学时</div>
          <h3>不定积分</h3>
          <p>+C 族实验；第一换元与分部积分。</p>
        </a>
        <a href="lectures/16.html" data-q="1.6 定积分 黎曼 面积 牛顿 莱布尼茨 有号">
          <div class="code">1.6　6 学时</div>
          <h3>定积分</h3>
          <p>黎曼和加密；轴上轴下有号面积。N-L 是计算装置。</p>
        </a>
        <a href="lectures/17.html" data-q="1.7 积分应用 面积 切条 阻滞 碳14 微分方程">
          <div class="code">1.7　2 学时</div>
          <h3>积分应用</h3>
          <p>同一区域选 x / y 切条；阻滞 S 形。碳-14 只算一题。</p>
        </a>
        <a href="lectures/18.html" data-q="1.8 二元 路径 偏导 二重积分 舒芙蕾 黑塞">
          <div class="code">1.8　新教材新增</div>
          <h3>二元函数</h3>
          <p>路径极限；偏导截线；D/X 切条。黑塞只口算驻点。</p>
        </a>
        <a href="lectures/21.html" data-q="2.1 行列式 沙流 萨吕斯 克拉默 上三角">
          <div class="code">2.1　3 学时</div>
          <h3>行列式</h3>
          <p>三阶沙流着色；高阶按行展开。</p>
        </a>
        <a href="lectures/22.html" data-q="2.2 矩阵 乘法 不可交换 逆 行乘列">
          <div class="code">2.2　7 学时</div>
          <h3>矩阵及其运算</h3>
          <p>行×列对位高亮；AB≠BA；2×2 求逆。</p>
        </a>
        <a href="lectures/23.html" data-q="2.3 方程组 三平面 通解 投入产出 列昂惕夫">
          <div class="code">2.3　2 学时</div>
          <h3>一般线性方程组</h3>
          <p>三平面位置；通解含参；投入产出。</p>
        </a>
        <a href="lectures/24.html" data-q="2.4 数据科学 词袋 余弦 PageRank 向量 相似度">
          <div class="code">2.4　新教材新增</div>
          <h3>数据科学</h3>
          <p>词袋热图点选；二维余弦；PageRank 迭代。不解特征多项式。</p>
        </a>
      </div>
      <p class="hub-kicker">本学期另外安排</p>
      <div class="hub-grid">
        <a class="dim" data-q="概率统计">
          <div class="code">预告</div>
          <h3>概率统计</h3>
          <p>抽样、估计、检验。开篇地图里的第三种语言，另案。</p>
        </a>
        <a class="dim" data-q="逻辑">
          <div class="code">预告</div>
          <h3>逻辑</h3>
          <p>不单开命题演算。理性思维渗透在每讲的定义与反例里。</p>
        </a>
        <a class="dim" data-q="数学软件 GeoGebra Mathematica">
          <div class="code">预告</div>
          <h3>数学软件</h3>
          <p>不设专讲、不嵌外网。教室打开本目录即可。</p>
        </a>
      </div>
      <p class="hub-kicker">上课快捷键</p>
      <div class="grid-3" style="flex:none;margin-bottom:24px">
        <div class="card">
          <h3>翻页</h3>
          <div class="gold-rule"></div>
          <p>→ / 空格 下一页<br />← 上一页<br />Home / End 首尾　F 全屏</p>
        </div>
        <div class="card">
          <h3>课堂</h3>
          <div class="gold-rule"></div>
          <p>A 揭晓解答（默认跳过解答页）<br />I 本讲提纲　? 快捷键</p>
        </div>
        <div class="card">
          <h3>实验</h3>
          <div class="gold-rule"></div>
          <p>滑条改参数，图立刻变。不拉时图仍可读。</p>
        </div>
      </div>
    </main>
    <footer class="botbar">
      <span>南开大学数学科学学院　·　配套《文科数学基础》（高等教育出版社，2025）</span>
      <span>上课请直接打开各讲。教师备注版在地址后加 ?teacher=1</span>
    </footer>
  </div>
  <script>
    (function () {
      const q = document.getElementById("hub-q");
      const cards = [...document.querySelectorAll("#hub-grid a")];
      q.addEventListener("input", () => {
        const s = q.value.trim().toLowerCase();
        cards.forEach((a) => {
          const hay = ((a.dataset.q || "") + " " + a.textContent).toLowerCase();
          a.style.display = !s || hay.indexOf(s) !== -1 ? "" : "none";
        });
      });
    })();
  </script>
</body>
</html>
"""


def main() -> None:
    for m in MODULES:
        write_lec(m.FILENAME, m.TITLE, m.H1, m.slides(), m.LABS)
    hub_path = HERE.parent / "index.html"
    hub_path.write_text(HUB, encoding="utf-8")
    print("index.html hub")


if __name__ == "__main__":
    main()
