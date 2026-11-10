# 医学知识图谱

手机优先、纯静态、无第三方依赖的医学科普知识图谱合集（可在中国大陆和微信内直接打开）。

| 图谱 | 状态 | 地址 |
|---|---|---|
| 心梗·脑梗 | 已上线 | `/stroke-mi/` |
| 新陈代谢 | 筹备中 | — |

## 心梗·脑梗功能

- 48 个知识点、8 大模块：每条都有详细解释、关键数字、要点、常见误区、关联知识、权威文献（DOI/官网），以及 B站/YouTube 视频链接
- 关系探索图谱 + 全景图谱（支持双指缩放）
- 一键急救：拨打当地急救电话（中国大陆 120、英国 999、香港 999）、记录发病时间（附时间窗提示）、心梗/卒中/心脏骤停分步指引、CPR 按压节拍器
  出处：中国大陆 120——[《院前医疗急救管理办法》第十三条](https://www.gov.cn/zhengce/2013-11/29/content_5713800.htm)（[国家卫健委 PDF 备用](https://www.nhc.gov.cn/wjw/c100221/202201/26ea3c97e82d466f9aa2b4a9901ae187/files/cd0981051e7a43c393a64abac3e7fe14.pdf)）；英国 999——[NHS](https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/)；香港 999——[香港消防处](https://www.hkfsd.gov.hk/chi/source/safety/Ambulance_Services_in_HK_chi.pdf)
- ABCD² 和 CHA₂DS₂-VA 自测
- 大字号、深色模式，可离线（PWA），可“添加到主屏幕”
- 每个知识点都有独立链接（如 `#/k/ivt`），可直接分享


- 在线：https://jackyyhhxjyxn.github.io/heart-brain-kg/
- 新增图谱：`node tools/new-graph.mjs <id> "<标题>" "<短名>" "<简介>"`，详见 `docs/ADDING_A_GRAPH.md`
- 校验：`node tools/validate.mjs`
- 本地预览：`python3 -m http.server 8765`，然后打开 http://localhost:8765/

仅供健康科普，不能替代医生诊疗。

## 许可 / License
- 内容（`stroke-mi/data.js`、`stroke-mi/home.js`、`stroke-mi/sos.js` 中的文字，以及根目录 `index.html`、`stroke-mi/index.html` 中的文字内容）：CC BY-NC-ND 4.0，见 LICENSE-CONTENT。可署名、原样、非商业转载；不得改编后发布。商业使用请另行联系授权。
- 代码（`shared/`、`tools/`、`registry.js`、根目录 `sw.js`、`stroke-mi/sw.js`，以及各 `index.html` 中的脚本与样式）：MIT，见 LICENSE。
- 页面引用的指南、机构资料和官方电话出处归各自权利人所有，不在上述许可范围内。
- 本项目为源码公开、内容非商业许可，不属于 OSI 定义的开源项目。

Content: CC BY-NC-ND 4.0. Code: MIT. Cited third-party sources remain with their owners.
