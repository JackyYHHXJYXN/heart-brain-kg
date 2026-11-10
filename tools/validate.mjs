#!/usr/bin/env node
// 校验所有图谱：node tools/validate.mjs
// 检查：必填字段、id 唯一、分类存在、关联(r)指向存在的节点、链接为 https、视频/引用结构、sw.js 版本号是否随内容变化、分级审核（tools/review-tiers.json、reviews.json）、专业库闸门（tools/pro-governed.json）
import fs from "node:fs"; import path from "node:path"; import vm from "node:vm"; import crypto from "node:crypto";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const registry = (() => { const w = {}; vm.runInNewContext(fs.readFileSync(path.join(root, "registry.js"), "utf8"), { window: w }); return w.REGISTRY; })();
let errors = 0, warns = 0;
const err = (g, m) => { errors++; console.error(`✗ [${g}] ${m}`); };
const warn = (g, m) => { warns++; console.warn(`! [${g}] ${m}`); };
const loadJson = f => { const p = path.join(root, "tools", f); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null; };
const TIERS = loadJson("review-tiers.json") || { graphs: {} }, REVIEWS = loadJson("reviews.json") || {};
const tierA = id => new Set(((TIERS.graphs || {})[id] || {}).A || []);
const isSigned = (gid, nid) => { const v = (REVIEWS[gid] || {})[nid]; return !!(v && v.by && /^\d{4}-\d{2}-\d{2}$/.test(v.on || "")); };
for (const r of registry) {
  const dir = path.join(root, r.id), file = path.join(dir, "data.js");
  if (!fs.existsSync(file)) { if (r.status === "live") err(r.id, "注册为 live 但没有 data.js"); continue; }
  const win = {}; vm.runInNewContext(fs.readFileSync(file, "utf8"), { window: win });
  const { META, CATS, NODES, REVIEWED } = win.KG || {};
  if (!META || !CATS || !NODES || !REVIEWED) { err(r.id, "KG 缺少 META/CATS/NODES/REVIEWED"); continue; }
  for (const k of ["id", "title", "rootLabel", "tagline"]) if (!META[k]) err(r.id, `META.${k} 缺失`);
  if (META.id !== r.id) err(r.id, `META.id(${META.id}) 与目录名不一致`);
  const cats = new Set(CATS.map(c => c.id)), ids = new Set();
  for (const n of NODES) {
    const g = `${r.id}/${n.id}`;
    if (ids.has(n.id)) err(g, "id 重复"); ids.add(n.id);
    if (!cats.has(n.c)) err(g, `分类 ${n.c} 不存在`);
    for (const k of ["t", "s", "d"]) if (!n[k] || (Array.isArray(n[k]) && !n[k].length)) err(g, `缺少 ${k}`);
    if (!(n.k || []).length) warn(g, "没有要点 k（评分工具类可以没有）");
    if (!(n.ref || []).length) err(g, "缺少权威资料 ref（每个知识点至少 1 条）");
    if (!(n.v || []).length && !(n.vl || []).length) warn(g, "没有任何视频");
    for (const x of n.ref || []) { if (!/^https:\/\//.test(x[1] || "")) err(g, `ref 链接不是 https: ${x[1]}`); if (x.length < 3) warn(g, `ref 缺少来源名: ${x[0]}`); }
    for (const x of n.vl || []) if (!/^https:\/\//.test(x[1] || "")) err(g, `vl 链接不是 https: ${x[1]}`);
  }
  for (const n of NODES) for (const x of n.r || []) if (!ids.has(x)) err(`${r.id}/${n.id}`, `关联 ${x} 不存在`);
  // 孤立节点
  const linked = new Set(); NODES.forEach(n => (n.r || []).forEach(x => { linked.add(n.id); linked.add(x); }));
  NODES.filter(n => !linked.has(n.id)).forEach(n => warn(`${r.id}/${n.id}`, "没有任何关联，图谱里会是孤点"));
  // 版本号提醒：data.js 哈希与 sw.js 中记录的不一致时提示（见 docs/UPDATE_WORKFLOW.md）
  const sw = path.join(dir, "sw.js");
  if (fs.existsSync(sw)) {
    const h = crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex").slice(0, 8);
    const stamp = path.join(dir, ".content-hash");
    const old = fs.existsSync(stamp) ? fs.readFileSync(stamp, "utf8").trim() : "";
    if (old && old !== h) warn(r.id, "data.js 自上次发布后有改动：请更新 sw.js 的 V 版本号，然后运行 node tools/validate.mjs --stamp");
    if (process.argv.includes("--stamp")) { fs.writeFileSync(stamp, h + "\n"); console.log(`  已记录 ${r.id} 内容哈希 ${h}`); }
  }
  checkReview(r, NODES);
  checkPro(r, NODES);
  console.log(`✓ ${r.id}: ${NODES.length} 个知识点, ${CATS.length} 个分类, 核对日期 ${REVIEWED}`);
}

// 分级审核（2026-11-03 Jacky 批准）：A 级 = 读者可能直接据此行动、出错会伤人的内容（急救、用药剂量、是否就医、自评工具），
// 必须有执业医师签字（tools/reviews.json）；B 级 = 一般知识，靠自动闸门 + 独立复核。A 级清单见 tools/review-tiers.json。
function checkReview(r, NODES) {
  const t = (TIERS.graphs || {})[r.id]; if (!t) return;
  const A = tierA(r.id), ids = new Set(NODES.map(n => n.id).concat(t.pages || []));
  for (const x of A) if (!ids.has(x)) err(r.id, `A 级清单里的 ${x} 不存在`);
  const unsigned = [...A].filter(x => !isSigned(r.id, x));
  const live = r.status === "live";
  if (unsigned.length) {
    const msg = `A 级未经医生签字 ${unsigned.length}/${A.size}: ${unsigned.join(", ")}`;
    if (!live) warn(r.id, msg + "（非 live，只提醒）");
    else if (t.allowPendingA) warn(r.id, msg + "（allowPendingA：允许待审核上线，页面必须显示“待执业医师审核”标签）");
    else err(r.id, msg);
  }
  console.log(`  分级审核 ${r.id}: A 级 ${A.size} 个，已签字 ${A.size - unsigned.length} 个`);
}

// 专业库闸门（2026-11-03 合并方案）：受约束分类里的知识点必须用 pro 字段关联专业库条目。
// live 图谱：缺关联 / 条目不存在 / 条目未核实原文 / 已被取代 / n 里的数字在关联条目中找不到 → 错误；
// A 级知识点另需关联条目全部签字。非 live 图谱只提醒。
function checkPro(r, NODES) {
  const cfgFile = path.join(root, "tools", "pro-governed.json");
  if (!fs.existsSync(cfgFile)) return;
  const cfg = JSON.parse(fs.readFileSync(cfgFile, "utf8")), gcfg = (cfg.graphs || {})[r.id];
  if (!gcfg) return;
  const live = r.status === "live", bad = live ? err : warn, A = tierA(r.id);
  const idxFile = path.join(root, cfg.index || "private/pro_index.json");
  const governed = NODES.filter(n => (gcfg.cats || []).includes(n.c) || n.pro);
  if (!fs.existsSync(idxFile)) { bad(r.id, `找不到专业库索引 ${cfg.index}（先运行 export_pro_index.py），${governed.length} 个受约束知识点无法核对`); return; }
  const idx = JSON.parse(fs.readFileSync(idxFile, "utf8")).recs || {};
  const nums = s => (String(s).match(/\d+(?:\.\d+)?/g) || []).map(Number);
  const same = (a, b) => Math.abs(a - b) <= Math.max(0.051, Math.abs(b) * 0.01);
  let linked = 0, ready = 0;
  for (const n of governed) {
    const g = `${r.id}/${n.id}`, ids = n.pro || [];
    if (!ids.length) { bad(g, "受专业库约束，但没有 pro 关联"); continue; }
    linked++;
    const recs = ids.map(id => [id, idx[id]]);
    const miss = recs.filter(([, x]) => !x).map(([id]) => id);
    if (miss.length) { err(g, `pro 指向的专业库条目不存在: ${miss.join(", ")}`); continue; }
    const problems = [];
    const unver = recs.filter(([, x]) => x.verification === "unverified" || x.kind === "not_read").map(([id]) => id);
    if (unver.length) problems.push(`条目未核实原文: ${unver.join(", ")}`);
    if (A.has(n.id)) { const u = recs.filter(([, x]) => !x.signed).length; if (u) problems.push(`A 级：关联条目未签字 ${u}/${ids.length}`); }
    const old = recs.filter(([, x]) => x.status !== "current").map(([id]) => id);
    if (old.length) problems.push(`已非现行版本: ${old.join(", ")}`);
    const pool = recs.flatMap(([, x]) => x.numbers || []);
    const lost = [...new Set((n.n || []).flatMap(x => nums(x[0])))].filter(v => !pool.some(p => same(v, p)));
    if (lost.length) problems.push(`关键数字在专业库中找不到: ${lost.join(", ")}`);
    if (problems.length) bad(g, problems.join("；")); else ready++;
  }
  console.log(`  专业库闸门 ${r.id}: 受约束 ${governed.length} 个，已关联 ${linked} 个，通过 ${ready} 个${live ? "" : "（非 live，只提醒）"}`);
}
// 生成 shared/site-meta.js（页面用的审核状态与反馈链接；唯一来源是 tools/review-tiers.json、reviews.json、site-config.json）
{
  const site = loadJson("site-config.json") || {}, fb = site.feedbackUrl || "";
  if (fb && !/^https:\/\//.test(fb)) err("site", `feedbackUrl 不是 https: ${fb}`);
  const review = {};
  for (const [gid, t] of Object.entries(TIERS.graphs || {})) {
    const signed = {};
    for (const x of t.A || []) if (isSigned(gid, x)) { const v = REVIEWS[gid][x]; signed[x] = { by: v.by, on: v.on }; }
    review[gid] = { A: t.A || [], signed };
  }
  const out = "/* 自动生成：node tools/validate.mjs。不要手改；改 tools/review-tiers.json、reviews.json、site-config.json */\nwindow.SITE_META = " + JSON.stringify({ feedbackUrl: /^https:\/\//.test(fb) ? fb : "", review }) + ";\n";
  const f = path.join(root, "shared", "site-meta.js"), old = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
  if (old !== out) { fs.writeFileSync(f, out); warn("site", "已重新生成 shared/site-meta.js：请更新所有图谱 sw.js 的 V 版本号再发布"); }
}
console.log(`\n${errors} 个错误, ${warns} 个提醒`);
process.exit(errors ? 1 : 0);
