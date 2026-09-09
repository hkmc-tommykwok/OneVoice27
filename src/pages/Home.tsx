import Navbar from "@/components/onevoice/Navbar";
import Hero from "@/components/onevoice/Hero";
import WorldMap from "@/components/onevoice/WorldMap";
import Participate from "@/components/onevoice/Participate";
import About from "@/components/onevoice/About";
import { Involved, News, Resources, Footer } from "@/components/onevoice/Sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0716] text-[#f3f0ff]">
      <Navbar />
      <main>
        <Hero />
        <WorldMap />
        <Participate />
        <About />
        <Involved />
        <News />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}
