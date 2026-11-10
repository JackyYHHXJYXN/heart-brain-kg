/* 图谱注册表：新增图谱时在此加一行（也可用 node tools/new-graph.mjs 自动加）。
 * status: "live" 已上线；"soon" 筹备中（首页显示为灰色、不可点击）；"draft" 不在首页显示、目录不进 Git（只在本地校验） */
window.REGISTRY = [
  { id: "stroke-mi", title: "心梗·脑梗知识图谱", desc: "识别症状、院前急救、医院救治、二级预防。48 个知识点，附权威文献与视频。", icon: "🫀", ic: "pulse", color: "#2f63c8", status: "live" },
  { id: "metabolism", title: "新陈代谢知识图谱", desc: "血糖、血脂、尿酸、体重、代谢综合征与脂肪肝。36 个知识点，附权威文献、视频与自查工具。", icon: "🔥", ic: "flame", color: "#b7791f", status: "draft" },
];
