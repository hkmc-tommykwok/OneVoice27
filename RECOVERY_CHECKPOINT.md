# 翻译项目恢复检查点

更新时间：2026-09-09（第二次更新：新增 Google 試算表報名寫入）

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
