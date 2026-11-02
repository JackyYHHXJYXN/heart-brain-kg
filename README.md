# 心梗·脑梗知识图谱

面向公众的心肌梗死与脑卒中科普知识图谱，手机优先，纯静态，无第三方依赖（中国大陆可正常访问，微信内可直接打开）。

- 48 个知识点、8 大模块：每条都有详细解释、关键数字、要点、常见误区、关联知识、权威文献（DOI/官网），以及 B站/YouTube 视频链接
- 关系探索图谱 + 全景图谱（支持双指缩放）
- 一键急救：拨打 120、记录发病时间（附时间窗提示）、心梗/卒中/心脏骤停分步指引、CPR 按压节拍器
- ABCD² 和 CHA₂DS₂-VA 自测
- 大字号、深色模式，可离线（PWA），可“添加到主屏幕”
- 每个知识点都有独立链接（如 `#/k/ivt`），可直接分享

## 发布到 GitHub Pages

```bash
gh repo create heart-brain-kg --public --source . --push
gh api -X POST repos/{owner}/heart-brain-kg/pages -f "source[branch]=main" -f "source[path]=/"
```

几分钟后可通过 `https://<用户名>.github.io/heart-brain-kg/` 访问。

如果改了仓库名或用户名，请把 `index.html` 里所有 `https://jackyyhhxjyxn.github.io/heart-brain-kg/` 替换为新地址。这样微信、微博、X、Facebook 等平台的分享卡片才能正确显示封面图 `og.png`。

## 社交媒体分享说明

- **微博 / X / Facebook / LinkedIn / Telegram / WhatsApp**：读取 Open Graph 标签，自动生成标题、摘要和封面卡片。
- **微信**：链接可直接打开。没有公众号 JS-SDK 时，微信不保证显示自定义卡片；页面已放置隐藏的封面图，作为微信抓取缩略图的兜底。
- 平台会缓存卡片。修改后可用 Facebook Sharing Debugger 等工具刷新。

## 更新内容

所有内容都在 `data.js` 中，字段说明见文件头注释。修改后同步更新 `sw.js` 中的版本号 `V`，让离线缓存刷新。

## 免责声明

仅供健康科普，不能替代医生诊疗。内容核对时间：2026-11。
