import { useState } from "react";
import { Play } from "lucide-react";
import { content } from "@/content";

const YOUTUBE_ID = "aYRZlyjs_Cw";

export default function About() {
  const c = content.about;
  const [playing, setPlaying] = useState(false);

  return (
    <section id="about" className="section-glow py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <p className="eyebrow mb-4">{c.eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          <span className="brand-gradient">{c.title}</span>
        </h2>
        <p className="text-[#cfc9ec] text-lg leading-relaxed mb-12">{c.lead}</p>

        <div className="relative rounded-2xl overflow-hidden card-glass aspect-video mb-14 group">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
              title="同聲傳揚27｜全民宣教"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              aria-label="播放影片"
            >
              {/* 影片縮圖（70% 透明，與深色星空背景融合） */}
              <img
                src="./video-poster.jpg"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1a0f35]/70 via-[#241243]/60 to-[#0d1b2e]/70" />
              <img
                src="./logo-video.png"
                alt="同聲傳揚27｜全民宣教"
                className="relative w-3/4 max-w-[520px] select-none"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-[#e2549e]/80 group-hover:bg-[#e2549e] flex items-center justify-center transition-colors shadow-[0_0_40px_rgba(226,84,158,0.5)]">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {c.pillars.map((pillar) => (
            <article key={pillar.num} className="card-glass rounded-2xl p-7 flex flex-col">
              <div className="flex items-baseline gap-3 mb-6">
                <span
                  className="text-6xl leading-none [font-family:'Figtree',sans-serif] font-black [font-variant-numeric:lining-nums_tabular-nums] bg-clip-text text-transparent [text-shadow:0_2px_12px_rgba(210,142,190,0.18)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(145deg, rgba(248,247,251,0.92), rgba(217,222,244,0.9) 52%, rgba(143,157,214,0.88))",
                  }}
                >
                  {pillar.num}
                </span>
                <h3 className="text-2xl font-extrabold">{pillar.title}</h3>
              </div>
              <ul className="space-y-3 text-sm text-[#cfc9ec] leading-relaxed mb-8">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b06bd6] mt-2 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 border-t border-[#3a2d63] text-sm text-[#b9b1dd] leading-relaxed">
                {pillar.foot}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
