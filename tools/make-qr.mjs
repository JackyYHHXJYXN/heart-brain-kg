#!/usr/bin/env node
// 为合集首页和每个已上线的图谱生成二维码（PNG + SVG）到 share/：
//   npm install        （只需一次，装二维码库）
//   node tools/make-qr.mjs
// 二维码里编码的是网址本身，网址不变二维码就永远有效。打印时用 SVG；发微信/朋友圈用 PNG。
import fs from "node:fs"; import path from "node:path"; import vm from "node:vm";
import QRCode from "qrcode";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = "https://jackyyhhxjyxn.github.io/heart-brain-kg/";
const w = {}; vm.runInNewContext(fs.readFileSync(path.join(root, "registry.js"), "utf8"), { window: w });
const items = [{ id: "hub", url: SITE }, ...w.REGISTRY.filter(r => r.status === "live").map(r => ({ id: r.id, url: `${SITE}${r.id}/` }))];
fs.mkdirSync(path.join(root, "share"), { recursive: true });
for (const it of items) {
  const opt = { errorCorrectionLevel: "M", margin: 2, color: { dark: "#111111", light: "#ffffff" } };
  await QRCode.toFile(path.join(root, "share", `qr-${it.id}.png`), it.url, { ...opt, width: 1024 });
  fs.writeFileSync(path.join(root, "share", `qr-${it.id}.svg`), await QRCode.toString(it.url, { ...opt, type: "svg" }));
  console.log(`✓ share/qr-${it.id}.png / .svg  →  ${it.url}`);
}
