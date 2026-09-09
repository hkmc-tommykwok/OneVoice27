import { useState } from "react";
import { Menu, X } from "lucide-react";
import { content } from "@/content";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <img
      src="./logo-zh.png"
      alt="同聲傳揚27｜全民宣教"
      className={`select-none ${size === "lg" ? "h-16 md:h-20" : "h-10 md:h-11"}`}
    />
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <div className="max-w-6xl mx-auto rounded-full p-[1.5px] bg-gradient-to-r from-[#e2549e]/70 via-[#7b5fd0]/50 to-[#43c6d8]/70 shadow-[0_10px_40px_-15px_rgba(123,95,208,0.5)]">
        <div className="rounded-full bg-[#14092b]/80 backdrop-blur-md">
          <div className="h-16 px-7 flex items-center justify-between">
            <a href="#top" aria-label="OneVoice27 首頁">
              <Logo />
            </a>
            <nav className="hidden md:flex items-center gap-10">
              {content.nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white text-sm font-bold tracking-widest hover:text-[#e88ec0] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
              aria-label="開啟選單"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl p-[1.5px] bg-gradient-to-r from-[#e2549e]/70 via-[#7b5fd0]/50 to-[#43c6d8]/70">
          <nav className="rounded-2xl bg-[#14092b]/95 backdrop-blur-md px-7 py-5 flex flex-col gap-4">
            {content.nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-white text-sm font-bold tracking-widest"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
