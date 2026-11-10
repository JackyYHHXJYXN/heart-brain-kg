/* 共用引擎：路由、知识库、详情、图谱、偏好、分享。图谱专属内容见各图谱目录（data.js / home.js / sos.js）。 */
(function(){
"use strict";
const {CATS, NODES, REVIEWED, META} = window.KG;
const PLUG = window.KG.plugins || {};
const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cc = c => `style="--cc:var(${catById[c].color})"`;
const store = {
  get(k){ try { return localStorage.getItem("kg:"+k); } catch(e){ return null; } },
  set(k,v){ try { v==null ? localStorage.removeItem("kg:"+k) : localStorage.setItem("kg:"+k, v); } catch(e){} }
};
const ICON = {
  chev:'<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  ext:'<svg class="ext" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>',
  phone:'<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z"/></svg>'
};

/* incoming links: build bidirectional neighbour sets */
const nbr = {};
NODES.forEach(n => nbr[n.id] = new Set());
NODES.forEach(n => (n.r||[]).forEach(r => { if (byId[r]) { nbr[n.id].add(r); nbr[r].add(n.id); } }));

/* ---------- plugins: graph-specific home / sos pages (see docs/ARCHITECTURE.md) ---------- */
/* ---------- 审核状态与反馈（shared/site-meta.js 由 node tools/validate.mjs 根据 tools/*.json 生成，不要手改） ---------- */
const SITE = window.SITE_META || {}, RV = (SITE.review || {})[META.id] || {A: [], signed: {}};
const isA = id => (RV.A || []).includes(id);
function reviewFlag(id){
  if (!isA(id)) return "";
  const s = (RV.signed || {})[id];
  return s ? `<div class="rv ok" role="note">✓ 本条已由执业医师审核：${esc(s.by)}（${esc(s.on)}）</div>`
           : `<div class="rv pend" role="note"><b>本条依据所列指南整理，每条附出处；由 AI 辅助整理，尚未经医生署名审核。</b>请以医生意见为准；出现症状请立即呼叫急救。</div>`;
}
function siteFoot(){
  return `<div class="foot note site-foot">
    <p>本站内容依据所列指南整理，每条附出处；由 AI 辅助整理${(RV.A||[]).length ? "。急救、用药等重点条目尚未经医生署名审核，请以医生意见为准" : ""}。</p>
    ${SITE.feedbackUrl ? `<p><a href="${esc(SITE.feedbackUrl)}" target="_blank" rel="noopener">发现错误或看不懂？点这里反馈 →</a></p>` : ""}
  </div>`;
}

const ctx = {$, esc, cc, ICON, store, toast: m => toast(m), NODES, CATS, byId, catById, REVIEWED, META};
const home = PLUG.home ? PLUG.home(ctx) : null;
const sos = PLUG.sos ? PLUG.sos(ctx) : null;
function defaultHome(){
  const counts = {}; NODES.forEach(n => counts[n.c]=(counts[n.c]||0)+1);
  $("#v-home").innerHTML = `
  <div class="hero">
    <p class="eyebrow">${esc(META.eyebrow||"")}</p>
    <p class="title">${esc(META.title)}</p>
    <p>${NODES.length} 个知识点，每一条都附有权威文献和视频讲解。</p>
  </div>
  <h2>${CATS.length} 大知识模块</h2>
  <div class="cat-grid">
    ${CATS.map(c => `<a class="cat-tile" href="#/learn/${c.id}" ${cc(c.id)}><span class="ic" aria-hidden="true">${c.icon}</span><b>${c.t}</b><span>${counts[c.id]||0} 个知识点 · ${c.e}</span></a>`).join("")}
  </div>
  <div class="foot note">
    <p><b>免责声明：</b>本站仅用于健康科普，不能替代医生的诊断和治疗。用药请遵医嘱。</p>
    <p>内容核对：${REVIEWED}。</p>
  </div>`;
}

/* ---------- prefs ---------- */
const root = document.documentElement;
function applyPrefs(){
  const fs = store.get("fs"); fs && fs !== "0" ? root.dataset.fs = fs : delete root.dataset.fs;
  const th = store.get("theme"); th ? root.dataset.theme = th : delete root.dataset.theme;
}
applyPrefs();
$("#fsBtn").onclick = () => { const v = ((+store.get("fs")||0)+1)%3; store.set("fs", String(v)); applyPrefs(); toast(["标准字号","大字号","特大字号"][v]); };
$("#themeBtn").onclick = () => {
  const order = [null,"light","dark"], cur = store.get("theme"), nx = order[(order.indexOf(cur)+1)%3];
  store.set("theme", nx); applyPrefs(); toast({null:"跟随系统","light":"浅色模式","dark":"深色模式"}[nx]);
};
let toastT;
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("on"),2000); }

async function share(title, text){
  const url = location.href;
  if (navigator.share) { try { await navigator.share({title, text, url}); return; } catch(e){ if (e && e.name==="AbortError") return; } }
  try { await navigator.clipboard.writeText(title+"\n"+url); toast("链接已复制，可粘贴到微信、微博等"); }
  catch(e){ prompt("复制以下链接分享：", url); }
}
$("#shareBtn").onclick = () => {
  const n = currentNode && byId[currentNode];
  share(n ? n.t+" | "+META.title : META.title, n ? n.s : META.tagline);
};
window.addEventListener("scroll", () => $("#bar").classList.toggle("scrolled", scrollY > 4), {passive:true});

/* ---------- LEARN ---------- */
let learnCat = "all", learnQ = "";
function renderLearnShell(){
  $("#v-learn").innerHTML = `
    <div class="search"><label><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
      <span class="sr">搜索知识点</span><input id="q" type="search" enterkeyhint="search" placeholder="搜索：溶栓、阿司匹林、血压…" autocomplete="off"></label>
      <div class="chips" id="chips" role="toolbar" aria-label="按分类筛选">
        <button class="chip" data-c="all" aria-pressed="true">全部</button>
        ${CATS.map(c=>`<button class="chip" data-c="${c.id}" ${cc(c.id)} aria-pressed="false"><span class="dot"></span>${c.t}</button>`).join("")}
      </div>
    </div>
    <div id="learnList"></div>`;
  const q = $("#q");
  q.addEventListener("input", () => { learnQ = q.value.trim(); renderLearnList(); });
  $("#chips").onclick = e => { const b=e.target.closest(".chip"); if(!b) return; setCat(b.dataset.c); history.replaceState(null,"", b.dataset.c==="all"?"#/learn":"#/learn/"+b.dataset.c); };
}
function setCat(c){
  learnCat = catById[c] ? c : "all";
  document.querySelectorAll("#chips .chip").forEach(x => x.setAttribute("aria-pressed", x.dataset.c===learnCat));
  const on = $(`#chips .chip[data-c="${learnCat}"]`); on && on.scrollIntoView({block:"nearest",inline:"center"});
  renderLearnList();
}
function hay(n){ return [n.t,n.en,n.s,...(n.d||[]),...(n.k||[]),...(n.n||[]).flat()].join(" ").toLowerCase(); }
const HAY = Object.fromEntries(NODES.map(n=>[n.id,hay(n)]));
function hl(text){ if(!learnQ) return esc(text); const i=text.toLowerCase().indexOf(learnQ.toLowerCase()); if(i<0) return esc(text); return esc(text.slice(0,i))+"<mark>"+esc(text.slice(i,i+learnQ.length))+"</mark>"+esc(text.slice(i+learnQ.length)); }
function renderLearnList(){
  const terms = learnQ.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = NODES.filter(n => (learnCat==="all"||n.c===learnCat) && terms.every(t => HAY[n.id].includes(t)));
  if (!hits.length) { $("#learnList").innerHTML = `<div class="empty">没有找到与“${esc(learnQ)}”相关的知识点。<br>试试“血压”“溶栓”“支架”。</div>`; return; }
  const html = CATS.filter(c => hits.some(n=>n.c===c.id)).map(c => `
    <div class="group-h" ${cc(c.id)}><i></i>${c.t}<span class="muted small" style="font-weight:500">· ${hits.filter(n=>n.c===c.id).length}</span></div>
    <ul class="list">${hits.filter(n=>n.c===c.id).map(n=>`<li><a href="#/k/${n.id}"><div class="tx"><div class="tt">${hl(n.t)}</div><div class="ss">${hl(n.s)}</div></div>${ICON.chev}</a></li>`).join("")}</ul>`).join("");
  $("#learnList").innerHTML = (learnQ?`<p class="muted small" style="margin:12px 2px 0">找到 ${hits.length} 个结果</p>`:"") + html;
}

/* ---------- DETAIL ---------- */
let currentNode = null;
const host = u => { try { return new URL(u).hostname.replace(/^www\./,""); } catch(e){ return ""; } };
function refKind(u){ const h=host(u); if(h==="doi.org") return ["doi","DOI"]; if(/pubmed|ncbi/.test(h)) return ["doi","PMC"]; if(/mdcalc/.test(h)) return ["","工具"]; return ["","官网"]; }
function renderDetail(id){
  const n = byId[id]; if (!n) { location.replace("#/learn"); return; }
  currentNode = id;
  const c = catById[n.c];
  const siblings = NODES.filter(x=>x.c===n.c), i = siblings.indexOf(n);
  const all = NODES.indexOf(n), prev = NODES[all-1], next = NODES[all+1];
  const rel = [...nbr[id]].map(r=>byId[r]);
  const videos = [];
  (n.vl||[]).forEach(([t,u,p]) => videos.push(`<li><a href="${esc(u)}" target="_blank" rel="noopener"><span class="k">${esc(p)}</span><div><div class="tt">${esc(t)}</div><div class="src">${esc(host(u))}</div></div>${ICON.ext}</a></li>`));
  (n.v||[]).forEach(([t,zh,en]) => {
    videos.push(`<li><a href="https://search.bilibili.com/all?keyword=${encodeURIComponent(zh)}" target="_blank" rel="noopener"><span class="k bili">B站</span><div><div class="tt">${esc(t)}</div><div class="src">哔哩哔哩搜索：${esc(zh)} · 建议优先选择医院、医生认证账号</div></div>${ICON.ext}</a></li>`);
    videos.push(`<li><a href="https://www.youtube.com/results?search_query=${encodeURIComponent(en)}" target="_blank" rel="noopener"><span class="k yt">YouTube</span><div><div class="tt">${esc(en)}</div><div class="src">YouTube搜索 · 建议选择 AHA、Mayo Clinic、NHS 等官方频道</div></div>${ICON.ext}</a></li>`);
  });
  $("#v-detail").innerHTML = `
  <div class="d-head" ${cc(n.c)}>
    <a class="badge" href="#/learn/${c.id}">${c.icon} ${c.t} · ${i+1}/${siblings.length}</a>
    <h2 class="d-title">${esc(n.t)}</h2>
    <p class="d-en">${esc(n.en)}</p>
    <p class="d-lead">${esc(n.s)}</p>
  </div>
  ${reviewFlag(n.id)}
  <div ${cc(n.c)}>
  ${n.n ? `<h2>关键数字</h2><div class="nums">${n.n.map(([a,b])=>`<div class="num"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div>` : ""}
  <h2>详细解释</h2><div class="prose">${n.d.map(p=>`<p>${esc(p)}</p>`).join("")}</div>
  ${n.k ? `<h2>要点</h2><div class="card"><ul class="keys">${n.k.map(k=>`<li>${esc(k)}</li>`).join("")}</ul></div>` : ""}
  ${n.calc ? calcHTML(n) : ""}
  ${n.m ? `<h2>常见误区</h2>${n.m.map(([q,a])=>`<div class="myth"><div class="q">${esc(q)}</div><div class="a">${esc(a)}</div></div>`).join("")}` : ""}
  ${rel.length ? `<h2>关联知识</h2><div class="rel">${rel.map(r=>`<a href="#/k/${r.id}" ${cc(r.c)}><i></i>${esc(r.t)}</a>`).join("")}</div>
     <p style="margin:10px 0 0"><a href="#/graph/${n.id}">在知识图谱中查看关系 →</a></p>` : ""}
  <h2>权威资料</h2>
  <ul class="links">${n.ref.map(([t,u,s])=>{const [k,l]=refKind(u);return `<li><a href="${esc(u)}" target="_blank" rel="noopener"><span class="k ${k}">${l}</span><div><div class="tt">${esc(t)}</div><div class="src">${esc(s)} · ${esc(host(u))}</div></div>${ICON.ext}</a></li>`;}).join("")}</ul>
  ${videos.length ? `<h2>视频讲解</h2><ul class="links">${videos.join("")}</ul>
     <p class="note" style="margin-top:8px">视频链接指向官方页面或平台检索结果，以便始终看到最新内容。中国大陆用户建议使用B站。</p>` : ""}
  <div class="pager">
    ${prev?`<a href="#/k/${prev.id}"><small>‹ 上一条</small><span>${esc(prev.t)}</span></a>`:"<span></span>"}
    ${next?`<a class="next" href="#/k/${next.id}"><small>下一条 ›</small><span>${esc(next.t)}</span></a>`:"<span></span>"}
  </div>
  <p class="note foot">本条内容核对于 ${REVIEWED}，仅供科普参考，不能替代医生面诊。</p>
  ${siteFoot()}
  </div>`;
  if (n.calc) bindCalc(n);
  document.title = n.t + " | " + META.title;
}
function calcHTML(n){
  const k = n.calc;
  return `<h2>${esc(k.title)}</h2><div class="card calc" id="calc">
    ${k.items.map(([t,p,g],i)=>`<label><input type="checkbox" data-i="${i}" data-g="${g||""}" data-p="${p}"><span>${esc(t)}</span><span class="pts">+${p}</span></label>`).join("")}
    <div class="res low" id="calcRes" aria-live="polite"></div>
    <p class="note" style="margin:10px 0 0">${esc(k.note)}</p></div>`;
}
function bindCalc(n){
  const box = $("#calc"), out = $("#calcRes");
  const upd = () => {
    const s = [...box.querySelectorAll("input:checked")].reduce((a,x)=>a+ +x.dataset.p,0);
    const b = n.calc.bands.find(([lo,hi])=>s>=lo&&s<=hi) || n.calc.bands[n.calc.bands.length-1];
    out.className = "res "+b[3]; out.innerHTML = `<b>${s}</b><span>${esc(b[2])}</span>`;
  };
  box.addEventListener("change", e => {
    const t = e.target; if (t.checked && t.dataset.g) box.querySelectorAll(`input[data-g="${t.dataset.g}"]`).forEach(x=>{ if(x!==t) x.checked=false; });
    upd();
  });
  upd();
}

/* ---------- GRAPH ---------- */
let gMode = "ego", gStack = [];
const keyLabel = k => k==="root" ? META.rootLabel : k.startsWith("c:") ? catById[k.slice(2)].t : byId[k.slice(2)].t;
const keyColor = k => k==="root" ? "--sos" : k.startsWith("c:") ? catById[k.slice(2)].color : catById[byId[k.slice(2)].c].color;
function egoNeighbours(k){
  if (k==="root") return CATS.map(c=>"c:"+c.id);
  if (k.startsWith("c:")) return ["root", ...NODES.filter(n=>n.c===k.slice(2)).map(n=>"n:"+n.id)];
  const id = k.slice(2);
  return ["c:"+byId[id].c, ...[...nbr[id]].map(r=>"n:"+r)];
}
function wrap(t, max){
  t = t.replace(/[（(].*$/,"").replace(/：.*$/,"");
  const out=[]; for(let i=0;i<t.length && out.length<2;i+=max) out.push(t.slice(i,i+max));
  if (t.length > max*2) out[1] = out[1].slice(0,max-1)+"…";
  return out;
}
function renderGraphShell(){
  $("#v-graph").innerHTML = `
    <div class="tabs" role="tablist" id="gTabs" style="margin-top:8px">
      <button role="tab" data-m="ego" aria-selected="true">关系探索</button>
      <button role="tab" data-m="all" aria-selected="false">全景图谱</button>
    </div>
    <p class="muted small" id="gHint" style="margin:10px 2px">点击任意节点，以它为中心展开关联知识。</p>
    <div id="gBody"></div>`;
  $("#gTabs").onclick = e => { const b=e.target.closest("button"); if(!b) return; gMode=b.dataset.m; $("#gTabs").querySelectorAll("button").forEach(x=>x.setAttribute("aria-selected",x===b)); drawGraph(); };
}
let gCenter = "root";
function drawGraph(){
  $("#gHint").textContent = gMode==="ego" ? "点击任意节点，以它为中心展开关联知识。" : "双指或按钮缩放，拖动浏览。点击节点进入关系探索。";
  gMode==="ego" ? drawEgo() : drawAll();
}
function nodeSVG(k, x, y, r, isCenter){
  const lines = wrap(keyLabel(k), isCenter?7:6);
  const fs = isCenter?13:11;
  const icon = k==="root" ? (META.rootIcon || "🫀") : k.startsWith("c:") ? catById[k.slice(2)].icon : "";
  return `<g class="g-node${isCenter?" center":""}" data-k="${k}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" tabindex="0" role="button" aria-label="${esc(keyLabel(k))}">
    <circle class="ring" r="${r+4}" fill="none" stroke="transparent"/>
    <circle r="${r}" fill="var(${keyColor(k)})" ${isCenter?"":`fill-opacity=".9"`}/>
    ${icon?`<text y="${r*0.36}" style="font-size:${r*0.95}px">${icon}</text>`:`<circle r="${r*0.32}" fill="var(--surface)"/>`}
    <text y="${r+fs+3}" style="font-size:${fs}px">${lines.map((l,i)=>`<tspan x="0" dy="${i?fs*1.2:0}">${esc(l)}</tspan>`).join("")}</text>
  </g>`;
}
function drawEgo(){
  const k = gCenter, ns = egoNeighbours(k), N = ns.length;
  const W=380, H=380, cx=0, cy=-8;
  const two = N > 10;
  const pos = ns.map((nk,i)=>{ const a = -Math.PI/2 + i*2*Math.PI/N; const R = two ? (i%2?150:104) : 132; return [nk, cx+R*Math.cos(a), cy+R*Math.sin(a)]; });
  const crumbs = gStack.slice(-3).map(s=>`<button data-back="${s}">${esc(keyLabel(s).slice(0,8))}</button><span>›</span>`).join("");
  let center;
  if (k==="root") center = {t:META.title, s:"从"+CATS.length+"大模块出发，逐层探索。每个节点都可以展开它的关联知识。", href:"#/learn"};
  else if (k.startsWith("c:")) { const c=catById[k.slice(2)]; center={t:c.icon+" "+c.t, s:`本模块共 ${N-1} 个知识点。点击节点查看它们之间的关系。`, href:"#/learn/"+c.id}; }
  else { const n=byId[k.slice(2)]; center={t:n.t, s:n.s, href:"#/k/"+n.id}; }
  $("#gBody").innerHTML = `
   <div class="g-wrap g-ego">
     <div class="g-crumbs">${gStack.length?crumbs:""}<span>${gStack.length?"":"起点"}</span></div>
     <svg viewBox="${-W/2} ${-H/2} ${W} ${H}" role="group" aria-label="${esc(keyLabel(k))} 的关联图">
       ${pos.map(([,x,y])=>`<line class="edge" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`).join("")}
       ${pos.map(([nk,x,y])=>nodeSVG(nk,x,y,two?15:18,false)).join("")}
       ${nodeSVG(k,cx,cy,k.startsWith("n:")?26:30,true)}
     </svg>
   </div>
   <div class="card g-card">
     <h3>${esc(center.t)}</h3><p class="muted small" style="margin:0">${esc(center.s)}</p>
     <div class="actions">
       <a class="btn primary" href="${center.href}">${k.startsWith("n:")?"阅读详情":"查看列表"}</a>
       ${k!=="root"?`<button class="btn ghost" id="gUp">${gStack.length?"后退":"回到起点"}</button>`:""}
     </div>
   </div>`;
  const svg = $("#gBody svg");
  const go = nk => { if (nk===gCenter) { if (nk.startsWith("n:")) location.hash="#/k/"+nk.slice(2); return; } gStack.push(gCenter); gCenter=nk; history.replaceState(null,"", nk.startsWith("n:")?"#/graph/"+nk.slice(2):"#/graph"); drawEgo(); };
  svg.addEventListener("click", e => { const g=e.target.closest(".g-node"); g && go(g.dataset.k); });
  svg.addEventListener("keydown", e => { if ((e.key==="Enter"||e.key===" ") && e.target.closest(".g-node")) { e.preventDefault(); go(e.target.closest(".g-node").dataset.k); } });
  $("#gBody .g-crumbs").onclick = e => { const b=e.target.closest("button"); if(!b) return; const idx=gStack.lastIndexOf(b.dataset.back); gCenter=b.dataset.back; gStack=gStack.slice(0,idx); drawEgo(); };
  const up = $("#gUp"); if (up) up.onclick = () => { gCenter = gStack.pop() || "root"; drawEgo(); };
}
let gZoom = 1.6;
function drawAll(){
  const S=1000, C=S/2, parts=[];
  const cPos = {}, nPos = {};
  CATS.forEach((c,i)=>{ const a=-Math.PI/2+i*2*Math.PI/CATS.length; cPos[c.id]=[C+175*Math.cos(a), C+175*Math.sin(a), a]; });
  CATS.forEach(c=>{
    const list = NODES.filter(n=>n.c===c.id), m=list.length, [,,a0]=cPos[c.id], span=(2*Math.PI/CATS.length)*0.92;
    list.forEach((n,j)=>{ const a=a0-span/2+span*(j+.5)/m; const R=j%2?425:330; nPos[n.id]=[C+R*Math.cos(a), C+R*Math.sin(a)]; });
  });
  const seen=new Set();
  NODES.forEach(n=>nbr[n.id].forEach(r=>{ const key=[n.id,r].sort().join("|"); if(seen.has(key))return; seen.add(key); const [x1,y1]=nPos[n.id],[x2,y2]=nPos[r]; parts.push(`<path class="xedge" d="M${x1.toFixed(0)},${y1.toFixed(0)} Q${C},${C} ${x2.toFixed(0)},${y2.toFixed(0)}"/>`); }));
  CATS.forEach(c=>{ const [x,y]=cPos[c.id]; parts.push(`<line class="edge" x1="${C}" y1="${C}" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}"/>`); });
  NODES.forEach(n=>{ const [x,y]=nPos[n.id],[cx,cy]=cPos[n.c]; parts.push(`<line class="edge" x1="${cx.toFixed(0)}" y1="${cy.toFixed(0)}" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}"/>`); });
  NODES.forEach(n=>{ const [x,y]=nPos[n.id]; parts.push(nodeSVG("n:"+n.id,x,y,11,false)); });
  CATS.forEach(c=>{ const [x,y]=cPos[c.id]; parts.push(nodeSVG("c:"+c.id,x,y,24,false)); });
  parts.push(nodeSVG("root",C,C,34,true));
  $("#gBody").innerHTML = `
   <div class="g-wrap"><div class="g-over" id="gOver"><svg id="gAll" viewBox="0 0 ${S} ${S}" role="group" aria-label="全景知识图谱">${parts.join("")}</svg></div>
   <div class="zoom"><button id="zIn" aria-label="放大">+</button><button id="zOut" aria-label="缩小">−</button></div></div>
   <div class="legend">${CATS.map(c=>`<span ${cc(c.id)}><i></i>${c.t}</span>`).join("")}</div>`;
  const over=$("#gOver"), svg=$("#gAll");
  const setZ = (z, keepCenter=true) => {
    const w = over.clientWidth, cxr = keepCenter ? (over.scrollLeft + w/2)/(svg.clientWidth||w) : .5, cyr = keepCenter ? (over.scrollTop + over.clientHeight/2)/(svg.clientHeight||w) : .5;
    gZoom = Math.max(1, Math.min(4, z)); const px = Math.round(w*gZoom);
    svg.setAttribute("width", px); svg.setAttribute("height", px);
    over.scrollLeft = cxr*px - w/2; over.scrollTop = cyr*px - over.clientHeight/2;
  };
  setZ(gZoom, false);
  $("#zIn").onclick = () => setZ(gZoom*1.35); $("#zOut").onclick = () => setZ(gZoom/1.35);
  /* pinch zoom */
  let pd=0, pz=1;
  over.addEventListener("touchstart", e=>{ if(e.touches.length===2){ pd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); pz=gZoom; } }, {passive:true});
  over.addEventListener("touchmove", e=>{ if(e.touches.length===2 && pd){ e.preventDefault(); const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); setZ(pz*d/pd); } }, {passive:false});
  over.addEventListener("touchend", ()=>{ pd=0; });
  svg.addEventListener("click", e => { const g=e.target.closest(".g-node"); if(!g) return; gStack=[]; gCenter=g.dataset.k; gMode="ego"; $("#gTabs").querySelectorAll("button").forEach(x=>x.setAttribute("aria-selected",x.dataset.m==="ego")); drawGraph(); scrollTo(0,0); });
}

/* ---------- ROUTER ---------- */
const scrollMem = {};
let lastKey = null, navDepth = 0;
function route(){
  const h = location.hash.replace(/^#\/?/,"");
  const [seg, arg] = h.split("/");
  if (lastKey) scrollMem[lastKey] = scrollY;
  let view = "home", title = META.title, tab = "home";
  currentNode = null;
  if (seg==="k" && byId[arg]) { view="detail"; renderDetail(arg); title=catById[byId[arg].c].t; tab="learn"; }
  else if (seg==="learn") { view="learn"; tab="learn"; title="知识库"; if(!$("#q")) renderLearnShell(); setCat(arg||"all"); }
  else if (seg==="graph") { view="graph"; tab="graph"; title="知识图谱"; if(!$("#gTabs")) renderGraphShell(); if (arg && byId[arg]) { if (gCenter!=="n:"+arg) { gStack.push(gCenter); gCenter="n:"+arg; } gMode="ego"; $("#gTabs").querySelectorAll("button").forEach(x=>x.setAttribute("aria-selected",x.dataset.m==="ego")); } drawGraph(); }
  else if (seg==="sos" && sos) { view="sos"; tab="sos"; title="一键急救"; sos.render(); $("#v-sos").insertAdjacentHTML("beforeend", reviewFlag("sos"));  /* 放页尾：不挡急救电话按钮 */ }
  if (view!=="sos" && sos) sos.leave();
  if (view!=="detail") document.title = view==="home" ? META.title : title+" | "+META.title;
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("on", v.id==="v-"+view));
  document.querySelectorAll(".nav a").forEach(a => a.dataset.tab===tab ? a.setAttribute("aria-current","page") : a.removeAttribute("aria-current"));
  $("#barTitle").textContent = title;
  $("#bar").classList.toggle("has-back", view==="detail");
  const key = location.hash || "#/";
  lastKey = key;
  scrollTo(0, view==="detail" ? 0 : (scrollMem[key]||0));
}
$("#backBtn").onclick = () => navDepth > 1 ? history.back() : (location.hash = "#/learn");
window.addEventListener("hashchange", () => { navDepth++; route(); });
(home || defaultHome)();
$("#v-home").insertAdjacentHTML("beforeend", siteFoot());
route(); navDepth = 1;

if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
})();
