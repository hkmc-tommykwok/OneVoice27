import { lazy, Suspense } from "react";
import Navbar from "@/components/onevoice/Navbar";
import Hero from "@/components/onevoice/Hero";
import { Involved, News, Resources, Footer } from "@/components/onevoice/Sections";

// 地圖與後續區塊延遲載入：首屏只需 Navbar + Hero，
// 其餘（含整個 maplibre 地圖庫）在背景非同步載入。
const WorldMap = lazy(() => import("@/components/onevoice/WorldMap"));
const Participate = lazy(() => import("@/components/onevoice/Participate"));
const About = lazy(() => import("@/components/onevoice/About"));

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0716] text-[#f3f0ff]">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <WorldMap />
          <Participate />
          <About />
          <Involved />
          <News />
          <Resources />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
