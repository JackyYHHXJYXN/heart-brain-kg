# 架构

## 设计目标
多个医学图谱共用一套引擎，互不影响；增加新图谱只需要写内容；不需要构建工具（直接部署静态文件）。

## 加载顺序（每个图谱的 index.html）
```
../shared/app.css
data.js          → 定义 window.KG = { META, CATS, NODES, REVIEWED }
home.js (可选)   → 注册专属首页  window.KG.plugins.home
sos.js  (可选)   → 注册专属急救页 window.KG.plugins.sos
../shared/app.js → 引擎启动
```

## data.js 格式
- `META`：`id`（必须等于目录名）、`title`、`rootLabel`（关系图中心名）、`tagline`、`eyebrow`
- `CATS`：`{ id, t, e, icon, color }`，`color` 是 CSS 变量名：`--c-base --c-risk --c-sign --c-aid --c-mi --c-st --c-prev --c-tool`（要新颜色在 `shared/app.css` 的 `:root` 里加变量，亮暗两套）
- `NODES`（知识点）：
  - `id` 唯一，用于链接 `#/k/<id>`；**发布后不要改 id**（会破坏已分享的链接）
  - `c` 分类 id；`t` 标题；`en` 英文名；`s` 一句话摘要
  - `n` 关键数字 `[[数值, 说明]]`；`d` 详细解释（段落数组）；`k` 要点；`m` 误区 `[[误区, 事实]]`
  - `r` 关联知识点 id（双向，用于关系图）
  - `ref` 权威资料 `[[标题, https URL, 来源]]`（至少 1 条）
  - `v` 视频检索 `[[标题, 中文关键词, 英文关键词]]`（自动生成 B 站/YouTube 搜索链接）；`vl` 直达视频页 `[[标题, URL, 平台]]`
  - `calc` 评分计算器（可选，见 stroke-mi 的 abcd2、chads）

## 插件接口
- `home.js`：`(window.KG.plugins = window.KG.plugins || {}).home = ctx => { …; return renderHome; }`
- `sos.js`：同样注册 `sos`，返回 `{ render(), leave() }`；`leave()` 在离开页面时清理计时器、音频
- `ctx` 提供：`$ esc cc ICON store toast NODES CATS byId catById REVIEWED META`
- 不写 home.js 就用引擎自带的默认首页（标题 + 分类卡片）。急救页是急症类图谱专用，代谢类等不需要，新建时默认不含。

## 路由（hash）
`#/` 首页、`#/learn[/<分类>]` 知识库、`#/k/<id>` 详情、`#/graph[/<id>]` 关系图、`#/sos` 急救。

## 缓存与更新
每个图谱的 `sw.js` 网络优先、离线回退缓存；`V` 版本号变化会清掉旧缓存。改内容或共用引擎后务必更新 `V`。

## URL 与分享
- 站点根：`https://jackyyhhxjyxn.github.io/heart-brain-kg/`，图谱在 `/<id>/`
- 旧链接 `根/#/k/ivt` 由根目录 `index.html` 自动跳转到 `stroke-mi/`（社交平台爬虫不执行脚本，所以旧链接的预览卡片显示的是合集首页信息）
- 每个图谱有自己的 `og.png`（1200×630）和 meta；社交平台会缓存卡片，更新封面后要在各平台的调试工具里刷新
