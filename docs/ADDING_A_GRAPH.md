# 新增一个图谱（例如 example）

1. 创建骨架（会把 `registry.js` 里的“筹备中”条目改为 live）：
   ```bash
   node tools/new-graph.mjs example "示例图谱" "示例" "示例说明"
   ```
2. **替换占位素材**：`<图谱id>/icon.svg`、`icon-192.png`、`icon-512.png`、`og.png` 目前是心梗图谱的复制品，不换的话社交分享会显示错误封面。
3. 编辑 `<图谱id>/data.js`：先定 6–8 个分类，再逐个写知识点（格式见 `docs/ARCHITECTURE.md`）。每个知识点至少 1 条权威来源。
4. （可选）专属首页：参照 `stroke-mi/home.js` 写 `home.js`，在 `index.html` 里加 `<script src="home.js"></script>`（放在 `data.js` 之后、`app.js` 之前），并把文件名加入 `sw.js` 的 `ASSETS`。
5. `node tools/validate.mjs`，本地预览，更新 `sw.js` 的 `V`，提交，按 `docs/UPDATE_WORKFLOW.md` 发布。
6. 在合集首页 `registry.js` 里修改图谱的 `desc`、`icon`、`color`。

## 内容规划建议（示例）
模块可考虑：能量代谢基础、血糖与糖尿病、血脂、尿酸与痛风、体重与肥胖、代谢综合征与脂肪肝、内分泌（甲状腺等）、评估工具（BMI、HOMA-IR、FIB-4）、生活方式干预。先做核心 30–40 个知识点上线，再迭代。
