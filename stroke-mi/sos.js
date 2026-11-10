/* 心梗·脑梗 专属急救页（发病计时、分情况指引、CPR节拍器）。接口见 docs/ARCHITECTURE.md */
(window.KG.plugins = window.KG.plugins || {}).sos = function (ctx) {
"use strict";
const {$, esc, cc, ICON, store, toast, NODES, CATS, byId, catById, REVIEWED, META} = ctx;
/* ---------- SOS ---------- */
let sosTab = "mi", tick = null;
function renderSOS(){
  $("#v-sos").innerHTML = `
  <h2 style="margin-top:12px" class="sr">急救</h2>
  <h2 class="sr">拨打当地急救电话</h2>
  <a class="call" href="tel:120">${ICON.phone}中国大陆 120</a>
  <div class="other-nums"><a href="tel:999">香港 999</a><a href="tel:119">台湾 119</a><a href="tel:911">美加 911</a><a href="tel:112">欧盟 112</a><a href="tel:999">英国 999</a><a href="tel:000">澳洲 000</a></div>
  <p class="small muted" style="margin:10px 0 0;text-align:center">拨打当地急救电话。出处：<a href="https://www.gov.cn/zhengce/2013-11/29/content_5713800.htm" target="_blank" rel="noopener">中国大陆 120（《院前医疗急救管理办法》第十三条，中国政府网）</a> · <a href="https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/" target="_blank" rel="noopener">英国 999（NHS）</a> · <a href="https://www.hkfsd.gov.hk/chi/source/safety/Ambulance_Services_in_HK_chi.pdf" target="_blank" rel="noopener">香港 999（香港消防处）</a> · <a href="https://www.nfa.gov.tw/cht/index.php?code=list&ids=66" target="_blank" rel="noopener">台湾 119（内政部消防署）</a> · <a href="https://www.911.gov/calling-911" target="_blank" rel="noopener">美国 911（美国国家 911 项目）</a> · <a href="https://crtc.gc.ca/eng/phone/911/can.htm" target="_blank" rel="noopener">加拿大 911（CRTC；北部个别地区如努纳武特尚未开通 9-1-1，请拨当地紧急号码）</a> · <a href="https://www.salute.gov.it/new/en/tema/112-118-e-pronto-soccorso/single-european-emergency-number-call-112" target="_blank" rel="noopener">欧盟 112（意大利卫生部）</a> · <a href="https://digital-strategy.ec.europa.eu/en/policies/112" target="_blank" rel="noopener">欧盟委员会</a> · <a href="https://www.infrastructure.gov.au/media-communications/phone/triple-zero/how-call-triple-zero-000" target="_blank" rel="noopener">澳洲 000（澳洲基础设施部）</a>。中国大陆以外请拨当地急救电话。</p>

  <h2>⏱ 记录发病时间</h2>
  <div class="card timer" id="timer"></div>

  <h2>现在是什么情况？</h2>
  <div class="tabs" role="tablist" id="sosTabs">
    <button role="tab" data-s="mi">疑似心梗</button>
    <button role="tab" data-s="st">疑似卒中</button>
    <button role="tab" data-s="ca">倒地无反应</button>
  </div>
  <div id="sosBody" style="margin-top:12px"></div>
  <p class="note foot">本页面不能代替急救调度员的指导，请按急救调度员的指示操作。</p>`;
  $("#sosTabs").onclick = e => { const b=e.target.closest("button"); if(!b) return; sosTab=b.dataset.s; drawSOS(); };
  drawTimer(); drawSOS();
}
function fmt(ms){ const s=Math.max(0,Math.floor(ms/1000)), h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}`; }
function drawTimer(){
  const t0 = +store.get("onset") || 0, box = $("#timer");
  clearInterval(tick);
  if (!t0) {
    box.innerHTML = `<p style="margin:0">医生最需要知道的是<b>症状开始的时间</b>（卒中时是<b>最后看起来正常的时间</b>）。点下方按钮开始计时；时间保存在本机。</p>
      <div class="row"><button class="btn sos" id="tNow">症状刚刚开始</button><button class="btn ghost" id="tPick">选择更早的时间</button></div>
      <input type="datetime-local" id="tInput" class="sr" aria-label="选择发病时间">`;
    $("#tNow").onclick = () => { store.set("onset", String(Date.now())); drawTimer(); };
    const inp = $("#tInput");
    $("#tPick").onclick = () => { inp.classList.remove("sr"); inp.style.cssText="margin-top:10px;width:100%;min-height:46px;font:inherit;padding:8px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--ink)"; const d=new Date(Date.now()-30*60000); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); inp.value=d.toISOString().slice(0,16); inp.max=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16); inp.focus(); try{inp.showPicker&&inp.showPicker();}catch(e){} };
    inp.onchange = () => { const v=new Date(inp.value).getTime(); if (v && v<=Date.now()) { store.set("onset", String(v)); drawTimer(); } };
    return;
  }
  const at = new Date(t0);
  box.innerHTML = `<p class="muted small" style="margin:0">发病/最后正常时间：${at.toLocaleString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}</p>
    <span class="clock" id="tEl" aria-live="off">00:00:00</span>
    <div class="win" id="tWin"></div>
    <div class="row"><button class="btn ghost" id="tCopy">复制时间给医生</button><button class="btn ghost" id="tReset">清除</button></div>`;
  const W = [[4.5,"静脉溶栓标准窗 4.5h"],[12,"STEMI 再灌注 12h"],[24,"取栓影像筛选窗 24h"]];
  const up = () => { const el=Date.now()-t0; $("#tEl").textContent=fmt(el); const h=el/3600000; $("#tWin").innerHTML = W.map(([x,l])=>`<span class="${h>x?"pass":""}">${l}</span>`).join("") + `<div class="note" style="margin-top:6px">时间窗仅作参考，超过时间窗仍可能有治疗机会，请务必就医。</div>`; };
  up(); tick = setInterval(up, 1000);
  $("#tReset").onclick = () => { if (confirm("清除已记录的发病时间？")) { store.set("onset", null); drawTimer(); } };
  $("#tCopy").onclick = async () => { const s = `发病/最后正常时间：${at.toLocaleString("zh-CN")}（已过 ${fmt(Date.now()-t0)}）`; try { await navigator.clipboard.writeText(s); toast("已复制"); } catch(e){ prompt("复制：", s); } };
}
let metro = null, actx = null;
function drawSOS(){
  $("#sosTabs").querySelectorAll("button").forEach(x=>x.setAttribute("aria-selected", x.dataset.s===sosTab));
  stopMetro();
  const B = $("#sosBody");
  if (sosTab==="mi") B.innerHTML = `
    <div class="card"><h3>心梗的信号</h3><ul class="keys">
      <li>胸口压榨、憋闷、紧缩或烧灼感，<b>超过5分钟</b>不缓解</li>
      <li>疼痛放射到左臂、双肩、下巴、后背、上腹</li>
      <li>伴冷汗、气短、恶心、头晕、濒死感</li>
      <li>女性、老人、糖尿病患者可能只有气短、乏力、恶心</li></ul></div>
    <div class="card" style="margin-top:12px"><h3>立即这样做</h3><ol class="steps red">
      <li><b>拨打当地急救电话</b>。不要自己开车，也不要打车。</li>
      <li>停止一切活动，<b>坐下或半卧</b>，松开衣领。</li>

      <li>准备好药盒和病历，打开门，把电梯和通道留出来。</li>
      <li>如果患者<b>倒地无反应</b> → 切换到“倒地无反应”，开始心肺复苏。</li></ol>
      <p style="margin:10px 0 0"><a href="#/k/mi-sx">心梗症状详解 →</a>　<a href="#/k/aspirin">阿司匹林怎么用 →</a></p></div>`;
  else if (sosTab==="st") B.innerHTML = `
    <div class="card"><h3>BE FAST：任何一项突然出现</h3>
      <div class="fast">
        <div><b>B</b><span>平衡：突然走不稳、眩晕</span></div><div><b>E</b><span>眼睛：突然看不清、视野缺损</span></div><div><b>F</b><span>面部：口角歪斜</span></div>
        <div><b>A</b><span>手臂：一侧无力，平举后下垂</span></div><div><b>S</b><span>言语：说话含糊、听不懂</span></div><div><b>T</b><span>时间：马上拨打当地急救电话</span></div>
      </div>
      <p class="small muted" style="margin:10px 0 0">中风120：<b>1</b> 看 1 张脸 · <b>2</b> 查 2 只胳膊 · <b>0</b> 聆（零）听语言。中国大陆以外请拨当地急救电话。</p></div>
    <div class="card" style="margin-top:12px"><h3>立即这样做</h3><ol class="steps red">
      <li><b>拨打当地急救电话</b>，说明“疑似卒中”。</li>
      <li>在上方<b>记录最后正常的时间</b>。如果是醒来后发现的，就记入睡时间。</li>
      <li>让患者平卧或侧卧（呕吐时一定要侧卧），头稍抬高。</li>
      <li>找出正在吃的药，<b>尤其是抗凝药</b>，以及最后一次服药的时间。</li></ol></div>
    <div class="card" style="margin-top:12px"><h3>千万不要</h3><ul class="dont">
      <li>喂水、喂药、喂饭，包括阿司匹林、降压药和中成药</li>
      <li>扎手指放血、掐人中、用力摇晃</li>
      <li>“先观察一下”，或者等症状自己好</li>
      <li>自行开车去小诊所</li></ul>
      <p style="margin:10px 0 0"><a href="#/k/befast">BE FAST 详解 →</a>　<a href="#/k/aid-dont">急救误区 →</a></p></div>`;
  else {
    B.innerHTML = `
    <div class="card"><h3>心肺复苏（成人）</h3><ol class="steps red">
      <li>确认环境安全，拍打双肩并大声呼喊。</li>
      <li>没有反应，也没有正常呼吸（或只有叹气样喘息）→ <b>拨打当地急救电话并开免提</b>，让旁人去取 <b>AED</b>。</li>
      <li>双手掌根叠放在<b>胸部正中</b>，双臂伸直，垂直向下按压。</li>
      <li>按压深度 <b>5–6 cm</b>，频率 <b>100–120 次/分</b>。每次按压后让胸廓完全回弹，尽量不要中断。</li>
      <li>AED 一到立即打开，按语音提示贴电极片、电击，然后马上继续按压。</li></ol></div>
    <div class="card" style="margin-top:12px"><h3>按压节拍器 · 110 次/分</h3>
      <div class="metro"><div class="beat" id="beat" aria-hidden="true"></div>
      <div style="flex:1"><p class="small muted" style="margin:0 0 10px">跟着闪烁和提示音按压。可以把手机放在旁边。</p>
      <button class="btn sos" id="mBtn" style="width:100%">开始节拍</button></div></div></div>
    <p style="margin:12px 2px 0"><a href="#/k/cpr">CPR 与 AED 详解、视频 →</a></p>`;
    $("#mBtn").onclick = () => metro ? stopMetro() : startMetro();
  }
}
function startMetro(){
  try { actx = actx || new (window.AudioContext||window.webkitAudioContext)(); actx.resume && actx.resume(); } catch(e){ actx = null; }
  const beat = $("#beat"), btn = $("#mBtn"); btn.textContent = "停止节拍";
  const one = () => {
    beat.classList.add("on"); setTimeout(()=>beat.classList.remove("on"), 120);
    if (actx) { const o=actx.createOscillator(), g=actx.createGain(); o.frequency.value=880; g.gain.setValueAtTime(.25,actx.currentTime); g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+.08); o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime+.09); }
    if (navigator.vibrate) navigator.vibrate(30);
  };
  one(); metro = setInterval(one, 60000/110);
}
function stopMetro(){ clearInterval(metro); metro = null; const b=$("#mBtn"); if (b) b.textContent="开始节拍"; }
return { render: renderSOS, leave(){ stopMetro(); clearInterval(tick); } };
};
