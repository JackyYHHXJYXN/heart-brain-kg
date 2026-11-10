#!/usr/bin/env node
// 校验所有图谱：node tools/validate.mjs
// 检查：必填字段、id 唯一、分类存在、关联(r)指向存在的节点、链接为 https、视频/引用结构、sw.js 版本号是否随内容变化
import fs from "node:fs"; import path from "node:path"; import vm from "node:vm"; import crypto from "node:crypto";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const registry = (() => { const w = {}; vm.runInNewContext(fs.readFileSync(path.join(root, "registry.js"), "utf8"), { window: w }); return w.REGISTRY; })();
let errors = 0, warns = 0;
const err = (g, m) => { errors++; console.error(`✗ [${g}] ${m}`); };
const warn = (g, m) => { warns++; console.warn(`! [${g}] ${m}`); };
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
  console.log(`✓ ${r.id}: ${NODES.length} 个知识点, ${CATS.length} 个分类, 核对日期 ${REVIEWED}`);
}
console.log(`\n${errors} 个错误, ${warns} 个提醒`);
process.exit(errors ? 1 : 0);
