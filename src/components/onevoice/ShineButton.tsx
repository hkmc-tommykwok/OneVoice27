import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const SHINE_STYLES = `
@property --ov-hero-beam {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@keyframes ov-hero-beam-spin {
  from { --ov-hero-beam: 0deg; }
  to   { --ov-hero-beam: 360deg; }
}
.ov-shine-btn {
  --ov-hero-beam: 0deg;
  position: relative;
  z-index: 0;
  isolation: isolate;
  border-radius: 999px;
  min-height: 52px;
  overflow: hidden !important;
  border: 1.5px solid transparent !important;
  color: rgb(248 247 251) !important;
  box-shadow:
    inset 0 0 0 1px rgb(217 222 244 / 0.34),
    0 10px 30px rgb(59 77 161 / 0.34),
    0 2px 10px rgb(3 2 18 / 0.28);
  background:
    linear-gradient(125deg, rgb(108 44 104) 0%, rgb(59 77 161) 50%, rgb(57 114 126) 100%) padding-box,
    conic-gradient(
      from var(--ov-hero-beam),
      transparent 0deg,
      transparent 238deg,
      rgb(170 217 220) 270deg,
      rgb(248 234 244) 294deg,
      white 304deg,
      rgb(240 211 231) 316deg,
      transparent 348deg,
      transparent 360deg
    ) border-box !important;
  animation: ov-hero-beam-spin 3s linear infinite;
  transition: box-shadow 320ms, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateY(0);
  cursor: pointer;
  text-transform: uppercase;
}
.ov-shine-btn:hover { transform: translateY(-2px); }
.ov-shine-btn::before,
.ov-shine-btn::after { content: ""; position: absolute; pointer-events: none; }
.ov-shine-btn::before {
  z-index: 0;
  inset: 1px;
  border-radius: inherit;
  background:
    radial-gradient(circle at 20% 12%, rgb(248 234 244 / 0.16), transparent 34%),
    linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.08) 50%, transparent 70%);
}
.ov-shine-btn::after {
  z-index: 1;
  inset: 2px;
  border-radius: inherit;
  opacity: 0.42;
  background-image: radial-gradient(
    circle,
    rgb(248 247 251 / 0.72) 0.8px,
    transparent 1.1px
  );
  background-size: 7px 7px;
  mask-image: conic-gradient(
    from var(--ov-hero-beam),
    transparent 0deg 242deg,
    rgb(0 0 0 / 0.18) 260deg,
    black 286deg 316deg,
    rgb(0 0 0 / 0.18) 338deg,
    transparent 356deg 360deg
  );
  animation: ov-hero-beam-spin 3s linear infinite;
}
.ov-shine-btn > span { position: relative; z-index: 2; }
`;

type ShineButtonProps = {
  href?: string;
  children: ReactNode;
  type?: "submit";
  className?: string;
  style?: CSSProperties;
};

export default function ShineButton({ href, children, type, className = "", style }: ShineButtonProps) {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const el = document.createElement("style");
    el.id = "ov-shine-btn-styles";
    el.textContent = SHINE_STYLES;
    document.head.appendChild(el);
  }, []);

  const cls = `ov-shine-btn inline-flex select-none items-center justify-center gap-2 px-10 py-4 text-sm font-bold tracking-[0.08em] ${className}`;
  const inner = (
    <span className="flex w-full items-center justify-center gap-2">{children}</span>
  );

  if (type === "submit") {
    return (
      <button type="submit" className={cls} style={style}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href} className={cls} style={style}>
      {inner}
    </a>
  );
}
