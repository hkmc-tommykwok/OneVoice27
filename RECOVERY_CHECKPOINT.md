# 翻译项目恢复检查点

更新时间：2026-09-09（第二次更新：新增 Google 試算表報名寫入；第三次更新：修復 Vercel 部署；第四次更新：新增星空動效；第五次更新：星空改為 Hero 專用柔焦光點；第六次更新：同步原站地圖數據；第七次更新：接入報名端點＋About 影片封面圖＋標題空格）

## 本次更新
- 報名端點：`src/config/registration.ts` 已填入使用者的 Apps Script /exec URL，表單正式連接 Google 試算表（展示模式小字提示自動隱藏）
- About 影片封面：`public/video-poster.jpg`（使用者提供）置於 logo 圖層之下，`opacity-70`，加一層深色漸變以融合
- Hero 標題：`同心合意   一個聲音`（中間三個空格）

## 地圖數據同步（原站）
- 數字：`src/content.ts` → 個人 6,087、群體 1,601（取自原站 onevoice27.org 實時值）
- 光點：`src/map/lights.json` 已用原站 4,090 個真實 pins（含 coordinates/count/type，individual=粉 c:1、group=青 c:2）取代舊的示意光點，保留 5,201 個暗色底點；count→大小映射：≥20→1.8、≥10→1.5、≥3→1.25、其餘→1
- 光暈：WorldMap glow 層加大加亮以更貼近原站聚集發光效果

## 效能優化
- 首屏 JS 由單一 2.4MB 包拆分為：入口 268KB（gzip 86KB）＋按需加載的 WorldMap（2.1MB 地圖庫）、Participate、About、Sections 分塊
- `src/pages/Home.tsx`：Hero 以下區塊改為 React.lazy + Suspense 背景非同步載入
- 星空：光斑預渲染為離屏 sprite，每幀只 drawImage（移除昂貴的 ctx.filter blur），星星數降至 ≤150，滾出視窗或分頁切背景時自動暫停
- Hero 影片加 `preload="metadata"`

## 星空動效（Hero 專用）
- 组件：`src/components/onevoice/Starfield.tsx`（canvas，absolute 铺满 Hero section）
- 挂载：`src/components/onevoice/Hero.tsx`，层叠顺序＝视频 → 星空 → 内容，仅作用于 Hero 区域
- 效果：柔和模糊的漂浮光点（缓慢游移＋明暗闪烁淡出，部分大光斑）＋每 4.5–11 秒随机一颗流星斜向划过
- 尊重 prefers-reduced-motion（減少動態時停止閃爍漂浮與流星）
- 已用本地預覽截圖驗證

## Vercel 部署修复
- 问题：`package-lock.json` 中 148 个包的下载地址指向沙盒内部镜像 `npm.mirrors.msh.team`，Vercel 无法解析该域名，`npm install` 报 ENOTFOUND。
- 修复：已全部替换为官方 `https://registry.npmjs.org/`，integrity 哈希不变（已抽查比对一致），`npm ci --dry-run` 通过，生产构建通过。
- 部署到 GitHub/Vercel 时务必提交这份修复后的 `package-lock.json`。

## 专案识别
- 专案名：翻译项目恢复
- 当前内容：OneVoice27 繁体中文静态网站
- 工作区路径：`/mnt/agents/output/app`
- 备份解压区：`/mnt/agents/output/translation-recovery/app`

## 报名功能（Google Sheets）
- 表单：`src/components/onevoice/Participate.tsx`
- 端点配置：`src/config/registration.ts`（`REGISTRATION_ENDPOINT` 留空＝展示模式）
-  Apps Script 代码：`google-apps-script.gs`
- 设置步骤：`GOOGLE_SHEETS_SETUP.md`
- 状态：代码已就绪，等待用户部署 Apps Script 并把 /exec URL 贴入配置后生效。
- 数据列：送出時間、光的類型、機構名稱、名字、姓氏、地址、電子郵件、同意接收電子報。

## 当前恢复状态
- 已从上传压缩包 `Kimi_Agent_翻译项目恢复.zip` 完整解出。
- 项目已复制到标准网站工作区 `/mnt/agents/output/app`。
- 已确认使用 React + TypeScript + Vite + Tailwind CSS。
- 已执行依赖安装与生产构建，构建成功。
- `src/App.css` 中 Vite 模板残留样式已清空，避免污染现有设计。
- `src/components/onevoice/Participate.tsx` 已补注说明：当前表单为前端展示版，不会把资料送出或保存到服务器。

## 翻译状态
- 全站主要可见文案集中在：`src/content.ts`
- 页面结构：`src/pages/Home.tsx`
- 组件文案或 aria 文案：
  - `src/components/onevoice/Navbar.tsx`
  - `src/components/onevoice/Hero.tsx`
  - `src/components/onevoice/About.tsx`
  - `src/components/onevoice/Participate.tsx`
  - `src/components/onevoice/Sections.tsx`
  - `src/components/onevoice/WorldMap.tsx`
- 地图中文对照：
  - `src/map/cityNames.ts`
  - `src/map/countryNames.ts`

## 术语约定
- OneVoice27：同聲傳揚27
- One Voice：同心合意，一個聲音
- Light your light：點亮你的光
- Individual light：個人之光
- Group beacon：群體燈塔
- Resources：資源中心
- News：最新消息
- Participate：參與行動

## 已知限制
- 表单提交仅显示成功状态；没有后端、数据库或跨设备保存。
- 外链资源与 YouTube 影片需要网络可用才会显示。
- 地图 glyph 字体使用远程 URL；如果远程字体不可达，地图文字标签可能受影响。

## 下次恢复方式
1. 打开 `/mnt/agents/output/app`。
2. 运行 `npm install`（如依赖缺失）。
3. 运行 `npm run build`。
4. 若继续翻译，只改 `src/content.ts` 与少量组件中的 aria / 资源标题。
5. 每次修改后同步更新本检查点文件。
