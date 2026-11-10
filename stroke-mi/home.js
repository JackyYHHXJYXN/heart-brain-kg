/* 心梗·脑梗 专属首页（时间线、今天能做的5件事）。接口见 docs/ARCHITECTURE.md */
(window.KG.plugins = window.KG.plugins || {}).home = function (ctx) {
"use strict";
const {$, esc, cc, ICON, catIcon, store, toast, NODES, CATS, byId, catById, REVIEWED, META} = ctx;
/* ---------- HOME ---------- */
function renderHome(){
  const counts = {}; NODES.forEach(n => counts[n.c]=(counts[n.c]||0)+1);
  $("#v-home").innerHTML = `
  <a class="sos-banner" href="#/sos">
    <div><div class="big">胸痛不缓解？口角歪斜、手臂无力？</div><div class="sub">立即拨打当地急救电话 · 打开一键急救指引</div></div><span class="go" aria-hidden="true">›</span>
  </a>
  <div class="hero">
    <p class="eyebrow">时间就是心肌 · 时间就是大脑</p>
    <p class="title">心梗·脑梗<br>知识图谱</p>
    <p>${NODES.length} 个知识点，按照 2023–2026 年美国、欧洲与中国最新指南整理。每一条都附有权威文献和视频讲解。</p>
  </div>
  <div class="stats">
    <div class="stat"><b>190万</b><span>大血管闭塞时，每分钟死亡的神经元</span></div>

    <div class="stat"><b>4.5 小时</b><span>脑梗：静脉溶栓的标准时间窗</span></div>
    <div class="stat"><b>24 小时</b><span>脑梗：影像筛选后取栓的时间窗</span></div>
  </div>

  <h2>抢救的时间线</h2>
  <div class="card">
    <div class="tabs" role="tablist" id="tlTabs">
      <button role="tab" aria-selected="true" data-tl="mi">心梗</button>
      <button role="tab" aria-selected="false" data-tl="st">脑梗</button>
    </div>
    <div id="tlBody" style="margin-top:14px"></div>
  </div>

  <h2>八大知识模块</h2>
  <div class="cat-grid">
    ${CATS.map(c => `<a class="cat-tile" href="#/learn/${c.id}" ${cc(c.id)}><span class="ic" aria-hidden="true">${catIcon(c)}</span><b>${c.t}</b><span>${counts[c.id]||0} 个知识点 · ${c.e}</span></a>`).join("")}
  </div>

  <h2>今天就能做的 5 件事</h2>
  <div class="card"><ol class="steps">
    <li>教会家人 <a href="#/k/befast">BE FAST</a> 或 <a href="#/k/s120">中风120</a> 口诀，并记住急救电话。</li>
    <li>测一次血压，查一次血脂。成年后至少查一次 <a href="#/k/lpa">脂蛋白(a)</a>。</li>
    <li>如果吸烟，今天就开始 <a href="#/k/smoke">戒烟</a>。</li>
    <li>每周累计 150 分钟快走，饮食少盐。参考 <a href="#/k/le8">生命八要素</a>。</li>
    <li>学习 <a href="#/k/cpr">心肺复苏和 AED</a>，记住你常去地方的 AED 位置。</li>
  </ol></div>

  <div class="foot note">
    <p><b>免责声明：</b>本站仅用于健康科普，不能替代医生的诊断和治疗。出现症状请立即呼叫急救。用药请遵医嘱。</p>
    <p>内容核对：${REVIEWED}。主要依据：2026 AHA/ASA 急性缺血性卒中指南、2025 ACC/AHA 急性冠脉综合征指南、2025 AHA/ACC 高血压指南、2023 ESC 急性冠脉综合征指南、2024 ESC 房颤/慢性冠脉综合征/高血压指南、2025 ESC/EAS 血脂更新、《中国急性缺血性卒中诊治指南2023》。</p>
  </div>`;
  const TL = {
    mi: [["0 分钟","出现胸痛或胸闷，持续超过5分钟","--c-sign"],["立即","拨打当地急救电话，停止活动；在指导下嚼服阿司匹林","--c-aid"],["出院前","双抗、强化降脂、心脏康复转诊","--c-prev"]],
    st: [["0 分钟","突发面瘫、肢体无力、言语不清；记下最后正常时间","--c-sign"],["立即","拨打当地急救电话，不要喂水喂药","--c-aid"],["≤24 小时","大血管闭塞：影像筛选后取栓","--c-st"],["住院期间","病因评估、二级预防、早期康复","--c-prev"]]
  };
  const tl = k => { $("#tlBody").innerHTML = `<ul class="timeline">${TL[k].map(([t,d,c])=>`<li style="--dot:var(${c})"><b>${t}</b><br><span class="muted small">${d}</span></li>`).join("")}</ul>
    <p style="margin:12px 0 0"><a href="#/k/${k==="mi"?"pci":"ivt"}">了解${k==="mi"?"直接PCI":"静脉溶栓"} →</a></p>`; };
  $("#tlTabs").onclick = e => { const b=e.target.closest("button"); if(!b) return; $("#tlTabs").querySelectorAll("button").forEach(x=>x.setAttribute("aria-selected", x===b)); tl(b.dataset.tl); };
  tl("mi");
}
return renderHome;
};
