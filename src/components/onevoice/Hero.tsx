import { ArrowDown } from "lucide-react";
import { content } from "@/content";
import ShineButton from "./ShineButton";
import Starfield from "./Starfield";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col items-center justify-end text-center overflow-hidden"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/globe-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#0b0716]/35" />
      {/* 星空蓋在影片之上、文字之下 */}
      <Starfield />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b0716] via-[#0b0716]/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0b0716]/70 to-transparent" />
      <div className="relative max-w-3xl mx-auto px-5 pb-28 pt-40">
        <p className="eyebrow mb-6">{content.hero.eyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 drop-shadow-[0_4px_24px_rgba(11,7,22,0.9)]">
          <span className="brand-gradient">{content.hero.title}</span>
        </h1>
        <p className="text-[#d8d2f2] text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12 drop-shadow-[0_2px_12px_rgba(11,7,22,0.9)]">
          {content.hero.subtitle}
        </p>
        <ShineButton href="#participate">{content.hero.cta}</ShineButton>
      </div>
      <a
        href="#map"
        className="absolute bottom-7 text-[#8d84b8] hover:text-white transition-colors animate-bounce"
        aria-label="向下捲動"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
}
