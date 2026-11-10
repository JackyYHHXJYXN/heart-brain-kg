#!/usr/bin/env node
// 新建一个图谱骨架：
//   node tools/new-graph.mjs <id> "<完整标题>" "<短名(≤6字)>" "<一句话简介>" 
// 例： node tools/new-graph.mjs metabolism "新陈代谢知识图谱" "代谢" "糖、脂、尿酸与体重" 
// 会创建 <id>/ 目录、把 registry.js 里同 id 的条目改为 live（没有则追加），不会覆盖已存在的目录。
import fs from "node:fs"; import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const [id, title, short, desc] = args;
if (!id || !title || !short || !desc || !/^[a-z0-9-]+$/.test(id)) { console.error('用法: node tools/new-graph.mjs <id(小写字母数字-)> "<标题>" "<短名>" "<简介>"'); process.exit(1); }
const dir = path.join(root, id);
if (fs.existsSync(dir)) { console.error(`✗ ${id}/ 已存在，不覆盖`); process.exit(1); }
const SITE = "https://jackyyhhxjyxn.github.io/heart-brain-kg/";
const today = new Date().toISOString().slice(0, 10), ym = today.slice(0, 7);
const fill = s => s.replaceAll("{{ID}}", id).replaceAll("{{TITLE}}", title).replaceAll("{{SHORT}}", short).replaceAll("{{DESC}}", desc).replaceAll("{{TAGLINE}}", desc).replaceAll("{{SITE}}", SITE);
fs.mkdirSync(dir);
let html = fill(fs.readFileSync(path.join(root, "tools/template/index.html"), "utf8"));
html = html.replace("<!--HOME_JS-->", "");  // 需要专属首页时：新建 home.js 并在此加 <script src=\"home.js\"></script>
// 默认不带“急救”页（它是心梗·脑梗专属）。需要时：参照 stroke-mi/sos.js 写 sos.js，并在 index.html 加回急救标签和 <section id="v-sos">、<script src="sos.js">
html = html.replace("<!--SOS_JS-->", "").replace(/\s*<a href="#\/sos"[^\n]*<\/a>/, "").replace(/\s*<section class="view" id="v-sos"[^\n]*<\/section>/, "");
fs.writeFileSync(path.join(dir, "index.html"), html);
fs.writeFileSync(path.join(dir, "data.js"), `/* ${title} — 内容数据（字段说明见 docs/ARCHITECTURE.md）。核对日期：${ym}。仅供科普，不能替代医生诊疗。 */
(function () {
  const doi = (d) => "https://doi.org/" + d;
  const CATS = [
    { id: "base", t: "认识疾病", e: "基础", icon: "📘", ic: "book", color: "--c-base" },
    // 颜色变量可用 --c-base --c-risk --c-sign --c-aid --c-mi --c-st --c-prev --c-tool
  ];
  const NODES = [
    {
      id: "example", uid: "${id}/example", type: "concept", chk: "${ym}", c: "base", t: "示例知识点", en: "Example",
      s: "一句话摘要。",
      n: [["数字", "说明"]],
      d: ["第一段详细解释。", "第二段。"],
      k: ["要点一", "要点二"],
      m: [["常见误区", "事实"]],
      r: [],
      ref: [["权威资料标题", "https://example.org", "来源机构"]],
      v: [["视频标题", "中文检索词", "English search words"]],
    },
  ];
  window.KG = {
    META: { id: "${id}", title: "${title}", rootLabel: "${short}", tagline: "${desc}", eyebrow: "" },
    CATS, NODES, REVIEWED: "${ym}",
  };
})();
`);
let sw = fs.readFileSync(path.join(root, "stroke-mi/sw.js"), "utf8").replace(/const V = "[^"]+"/, `const V = "${id}-${today}"`).replace('"home.js", "sos.js", ', "");
fs.writeFileSync(path.join(dir, "sw.js"), sw);
const mf = JSON.parse(fs.readFileSync(path.join(root, "stroke-mi/manifest.webmanifest"), "utf8")); mf.name = title; mf.short_name = short; mf.description = desc;
fs.writeFileSync(path.join(dir, "manifest.webmanifest"), JSON.stringify(mf, null, 2) + "\n");
for (const f of ["icon.svg", "icon-192.png", "icon-512.png", "og.png"]) fs.copyFileSync(path.join(root, "stroke-mi", f), path.join(dir, f));  // 占位：上线前务必换成本图谱自己的图标和封面
// registry
const regFile = path.join(root, "registry.js"); let reg = fs.readFileSync(regFile, "utf8");
const re = new RegExp(`(\\{ id: "${id}",[^\\n]*?)status: "soon"`);
if (re.test(reg)) reg = reg.replace(re, '$1status: "live"');
else reg = reg.replace(/\n\];/, `\n  { id: "${id}", title: "${title}", desc: "${desc}", icon: "📘", ic: "book", color: "#2563eb", status: "live" },\n];`);
fs.writeFileSync(regFile, reg);
console.log(`✓ 已创建 ${id}/。下一步：\n  1. 把 ${id}/icon*.png、og.png 换成本图谱自己的（目前是心梗图谱的占位图，社交分享会显示错图！）\n  2. 编辑 ${id}/data.js，填入知识点\n  3. node tools/validate.mjs`);
