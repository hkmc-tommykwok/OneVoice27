import { useState, type ReactNode } from "react";
import { ArrowRight, Music, FolderDown, Clapperboard, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { content } from "@/content";

export function Involved() {
  const c = content.involved;
  return (
    <section className="section-glow py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">{c.eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5">{c.title}</h2>
          <p className="text-[#b9b1dd] max-w-xl mx-auto">{c.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {c.cards.map((card) => (
            <article key={card.title} className="card-glass rounded-2xl overflow-hidden flex flex-col group">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={`./${card.image}`}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 gap-6 p-8">
                <h3 className="text-xl font-extrabold">{card.title}</h3>
                <a
                  href={card.href}
                  className="mt-auto inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#cfc9ec] hover:text-white transition-colors"
                >
                  <span className="border-b border-[#5a4a8f] pb-1">{card.action}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const NEWS_PAGE_SIZE = 6;

export function News() {
  const c = content.news;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(c.items.length / NEWS_PAGE_SIZE);
  const pageItems = c.items.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE);

  return (
    <section id="news" className="section-glow py-24 px-5 bg-[#120b28]/60">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">{c.eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5">{c.title}</h2>
          <p className="text-[#b9b1dd] max-w-xl mx-auto">{c.subtitle}</p>
        </div>
        <div key={page} className="ov-panel-in grid md:grid-cols-3 gap-5">
          {pageItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-glass rounded-2xl overflow-hidden group relative flex flex-col min-h-[320px]"
            >
              <img
                src={`./${item.image}`}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
              <div className="relative mt-auto p-6">
                <h3 className="text-lg font-bold leading-snug text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
        {pageCount > 1 && (
          <nav className="mt-14 flex items-center justify-center gap-6" aria-label="最新消息分頁">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="上一頁"
              className="text-[#cfc9ec] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-default cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={3} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-label={`第 ${n} 頁`}
                aria-current={n === page ? "page" : undefined}
                className={`min-w-10 h-10 px-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  n === page
                    ? "bg-[#3a2d63] text-white"
                    : "text-[#b9b1dd] hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              aria-label="下一頁"
              className="text-[#cfc9ec] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-default cursor-pointer"
            >
              <ChevronRight className="w-7 h-7" strokeWidth={3} />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

/** 音樂資源下載清單 */
const MUSIC_DOWNLOADS = [
  {
    title: "同聲傳揚27主題曲 - 歌譜 [PDF]",
    format: "PDF",
    href: "https://hope-documents.fra1.digitaloceanspaces.com/67054013a60919c92d92c959/PIl1787819788226.pdf",
  },
  {
    title: "同聲傳揚27主題曲 - 純音樂",
    format: "ZIP",
    href: "https://hope-documents.fra1.digitaloceanspaces.com/67054013a60919c92d92c959/vVx1787819861503.zip",
  },
  {
    title: "同聲傳揚27主題曲 - 音樂影片",
    format: "DRIVE",
    href: "https://drive.google.com/drive/folders/1xsJ2jOc1C__MNQxid6Lw5VjRBpKF4SV8",
  },
];

type DownloadItem = { title: string; format: string; href: string };

/** 素材資源下載清單（依語言分組，與原站 Materials 面板一致） */
const HOPE_DOCS = "https://hope-documents.fra1.digitaloceanspaces.com/67054013a60919c92d92c959/";
const ENGLISH_MATERIALS: DownloadItem[] = [
  { title: "OneVoice27 template PPTX", format: "PPTX", href: `${HOPE_DOCS}S4z1787584266485.pptx` },
  { title: "OneVoice27 Presentation PDF", format: "PDF", href: `${HOPE_DOCS}R4n1787584270370.pdf` },
  { title: "OneVoice27 Brochure PDF", format: "PDF", href: `${HOPE_DOCS}pGK1787584274551.pdf` },
  { title: "ENG logo PNG", format: "PNG", href: `${HOPE_DOCS}omL1787584642273.png` },
  { title: "ENG logo Adventist PNG", format: "PNG", href: `${HOPE_DOCS}wiS1787584642347.png` },
  { title: "OneVoice27—file", format: "ZIP", href: `${HOPE_DOCS}uq31788340270047.zip` },
  { title: "OneVoice27-VideoPresentation-Large", format: "MP4", href: "https://cdn.onevoice27.org/OneVoice27-VideoPresentation-Large.mp4" },
  { title: "OneVoice27 VideoPresentation-short", format: "MP4", href: "https://cdn.onevoice27.org/OneVoice27-VideoPresentation-short.mp4" },
];

const CHINESE_MATERIALS: DownloadItem[] = [
  { title: "同聲傳揚27 簡報範本", format: "PPTX", href: "https://docs.google.com/presentation/d/1HoxrvCXBb3uwNHia5qA-sANyq1XnrH4M/edit?slide=id.p7#slide=id.p7" },
  { title: "同聲傳揚27 簡報", format: "PDF", href: "https://drive.google.com/file/d/1W-Njgjs2K52ZMmH6bFa-q8NyFfsbK9mY/view?usp=drive_link" },
  { title: "同聲傳揚27 小冊子", format: "PDF", href: "https://drive.google.com/file/d/13g4tY9KIJ-s-EDPMH_CRz3GRMuQQeiwH/view?usp=drive_link" },
  { title: "中文Logo", format: "DRIVE", href: "https://drive.google.com/drive/folders/10kWyQPn4EmHeRsEbWGPA__fZlQgNOFoK?usp=sharing" },
  { title: "同聲傳揚27介紹影片", format: "MP4", href: "https://drive.google.com/file/d/1TYg8yx6stWuTZooA7RmZr1ztNgPpRlvz/view" },
];

const MATERIAL_GROUPS: { label: string; items: DownloadItem[] }[] = [
  { label: "中文資源", items: CHINESE_MATERIALS },
  { label: "英文資源", items: ENGLISH_MATERIALS },
];

/** 影片資源下載清單（與原站 Video 面板一致） */
const VIDEO_DOWNLOADS: DownloadItem[] = [
  { title: "影片背景", format: "ZIP", href: "https://cdn.onevoice27.org/onevoice-video-backgrounds.zip" },
];

/** 單張下載卡片 */
function DownloadCard({ item }: { item: DownloadItem }) {
  return (
    <article className="card-glass rounded-2xl p-8 flex flex-col min-h-[220px]">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h4 className="text-lg font-extrabold leading-snug">{item.title}</h4>
        <span className="shrink-0 rounded-md border border-[#8d84b8]/60 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#cfc9ec]">
          {item.format}
        </span>
      </div>
      <a
        href={item.href}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto self-center text-xs font-bold tracking-[0.25em] text-[#43c6d8] hover:text-[#a9eef7] uppercase transition-colors"
      >
        下載
      </a>
    </article>
  );
}

/** 下載面板通用外框：返回按鈕 + 標題 + 副標題，於原地閃入 */
function ResourcePanel({
  onBack,
  title,
  subtitle,
  children,
}: {
  onBack: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="ov-panel-in max-w-6xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="mb-12 rounded-full border border-dashed border-[#b9b1dd]/70 px-7 py-2.5 text-xs font-bold tracking-[0.25em] text-white uppercase hover:border-white hover:bg-white/5 transition-colors cursor-pointer"
      >
        返回
      </button>
      <h3 className="text-3xl font-black mb-4">{title}</h3>
      <p className="text-[#b9b1dd] leading-relaxed mb-12">{subtitle}</p>
      {children}
    </div>
  );
}

/** 音樂下載面板：點擊「探索音樂」後於原地閃入，與原站行為一致 */
function MusicPanel({ onBack }: { onBack: () => void }) {
  return (
    <ResourcePanel onBack={onBack} title="音樂" subtitle="下載官方主題曲及相關資源。">
      <div className="grid md:grid-cols-3 gap-5">
        {MUSIC_DOWNLOADS.map((item) => (
          <DownloadCard key={item.title} item={item} />
        ))}
      </div>
    </ResourcePanel>
  );
}

/** 素材下載面板：依語言分組的可摺疊下載清單 */
function MaterialsPanel({ onBack }: { onBack: () => void }) {
  return (
    <ResourcePanel onBack={onBack} title="素材" subtitle="在此找到各種語言的資源，隨時下載使用。">
      <div>
        {MATERIAL_GROUPS.map((group) => (
          <details key={group.label} className="group border-b border-[#3a2d63]/60 py-2" open={group.label === "中文資源"}>
            <summary className="flex items-center justify-between gap-3 py-4 cursor-pointer list-none select-none">
              <span className="text-lg font-extrabold">{group.label}</span>
              <ChevronDown className="w-5 h-5 text-[#b9b1dd] transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="grid md:grid-cols-3 gap-5 pb-8 pt-2">
              {group.items.map((item) => (
                <DownloadCard key={item.title} item={item} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </ResourcePanel>
  );
}

/** 影片下載面板 */
function VideosPanel({ onBack }: { onBack: () => void }) {
  return (
    <ResourcePanel onBack={onBack} title="影片" subtitle="製作並與他人分享這項計劃的裝飾元素。">
      <div className="grid md:grid-cols-3 gap-5">
        {VIDEO_DOWNLOADS.map((item) => (
          <DownloadCard key={item.title} item={item} />
        ))}
      </div>
    </ResourcePanel>
  );
}

export function Resources() {
  const c = content.resources;
  const icons = [Music, FolderDown, Clapperboard];
  const colors = ["#b9b1dd", "#43c6d8", "#e2549e"];
  const [panel, setPanel] = useState<"none" | "music" | "materials" | "videos">("none");
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="resources" className="section-glow py-24 px-5 starfield overflow-hidden">
      {/* 懸停卡片時，整個區塊背景以該卡片主題色發光（與原站一致） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: panel === "none" && hovered !== null ? 1 : 0,
          background:
            hovered !== null
              ? `radial-gradient(900px 620px at ${hovered === 0 ? "30%" : hovered === 1 ? "50%" : "70%"} 58%, ${colors[hovered]}38, transparent 70%)`
              : "none",
        }}
      />
      <div className="relative max-w-6xl mx-auto">
        {panel === "none" && (
          <div className="ov-panel-in text-center mb-12 max-w-xl mx-auto">
            <p className="eyebrow mb-4">{c.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5">{c.title}</h2>
            <p className="text-[#b9b1dd]">{c.subtitle}</p>
          </div>
        )}
        {panel === "music" && <MusicPanel onBack={() => setPanel("none")} />}
        {panel === "materials" && <MaterialsPanel onBack={() => setPanel("none")} />}
        {panel === "videos" && <VideosPanel onBack={() => setPanel("none")} />}
        {panel === "none" && (
          <div className="ov-panel-in grid md:grid-cols-3 gap-5">
            {c.cards.map((card, i) => {
              const Icon = icons[i];
              return (
                <article
                  key={card.tag}
                  className="card-glass rounded-2xl p-8 flex flex-col"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="flex items-center justify-between mb-10">
                    <span className="eyebrow">{card.tag}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: colors[i], boxShadow: `0 0 10px ${colors[i]}` }}
                    />
                  </div>
                  <Icon className="w-7 h-7 text-[#b9b1dd] mb-4" />
                  <h3 className="text-xl font-extrabold mb-2">{card.title}</h3>
                  <p className="text-sm text-[#b9b1dd] leading-relaxed mb-8">{card.desc}</p>
                  <button
                    type="button"
                    onClick={() => setPanel(i === 0 ? "music" : i === 1 ? "materials" : "videos")}
                    className="mt-auto inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#cfc9ec] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="border-b border-[#5a4a8f] pb-1">{card.action}</span>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const c = content.footer;
  return (
    <footer className="relative py-20 px-5 text-center overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[300px] rounded-[100%] border-t border-[#3a2d63]/50 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[220px] rounded-[100%] border-t border-[#3a2d63]/40 pointer-events-none" />
      <div className="relative flex flex-col items-center gap-3 mb-14">
        <img
          src="./logo-footer.png"
          alt="同聲傳揚27｜全民宣教"
          className="h-16 md:h-20 w-auto select-none"
        />
      </div>
      <div className="relative text-xs text-[#8d84b8] space-y-1.5">
        <p>{c.copyright}</p>
        <p>{c.address}</p>
      </div>
    </footer>
  );
}
