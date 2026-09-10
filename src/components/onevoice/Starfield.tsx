import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  sprite: HTMLCanvasElement; // 預渲染的柔焦光斑
  cx: number; // sprite 中心偏移
  base: number;
  amp: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
  driftPhase: number;
  driftSpeed: number;
  driftRange: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  len: number;
};

// 白、淡藍、粉、青——對應原站 Hero 的光點色調
const TINTS = ["255,255,255", "214,225,255", "255,214,236", "197,240,246"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** 預渲染一顆柔焦光斑到離屏畫布，之後每幀只做 drawImage，避免 ctx.filter 的昂貴模糊運算 */
function makeSprite(radius: number, tint: string): HTMLCanvasElement {
  const pad = Math.ceil(radius * 3.2);
  const size = (radius + pad) * 2;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const cx = size / 2;
  const grad = g.createRadialGradient(cx, cx, 0, cx, cx, radius + pad);
  grad.addColorStop(0, `rgba(${tint},0.95)`);
  grad.addColorStop(0.25, `rgba(${tint},0.45)`);
  grad.addColorStop(0.6, `rgba(${tint},0.12)`);
  grad.addColorStop(1, `rgba(${tint},0)`);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(cx, cx, radius + pad, 0, Math.PI * 2);
  g.fill();
  return c;
}

/**
 * Hero 區域專用星空：
 * 柔和模糊的漂浮光點（緩慢游移＋閃爍淡出）＋偶爾劃過的流星。
 * 應蓋在 Hero 影片之上、內容之下。
 */
export default function Starfield({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let raf = 0;
    let nextMeteorAt = 0;
    let w = 0;
    let h = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(150, Math.round((w * h) / 14000));
      stars = Array.from({ length: count }, () => {
        const big = Math.random() < 0.22;
        const r = big ? rand(2.2, 4.2) : rand(0.7, 1.6);
        const tint = TINTS[Math.floor(Math.random() * TINTS.length)];
        const sprite = makeSprite(r, tint);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          sprite,
          cx: sprite.width / 2,
          base: rand(0.18, 0.4),
          amp: rand(0.3, 0.55),
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.3, 1.1),
          driftX: rand(-1, 1),
          driftY: rand(-1, 1),
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: rand(0.05, 0.18),
          driftRange: big ? rand(14, 30) : rand(6, 14),
        };
      });
    };

    const spawnMeteor = (now: number) => {
      const fromLeft = Math.random() < 0.5;
      const speed = rand(7, 11);
      const angle = rand(Math.PI * 0.14, Math.PI * 0.3);
      const dir = fromLeft ? 1 : -1;
      meteors.push({
        x: fromLeft ? rand(-0.05, 0.5) * w : rand(0.5, 1.05) * w,
        y: rand(-0.05, 0.35) * h,
        vx: Math.cos(angle) * speed * dir,
        vy: Math.abs(Math.sin(angle)) * speed,
        life: now,
        maxLife: rand(900, 1500),
        len: rand(90, 170),
      });
      nextMeteorAt = now + rand(4500, 11000);
    };

    const drawStar = (s: Star, now: number) => {
      const t = now / 1000;
      const tw = reduced
        ? s.base + s.amp * 0.5
        : s.base + s.amp * Math.pow(0.5 + 0.5 * Math.sin(s.phase + t * s.speed * Math.PI), 1.6);
      const alpha = Math.min(1, Math.max(0, tw));

      const dx = reduced ? 0 : Math.sin(s.driftPhase + t * s.driftSpeed * Math.PI * 2) * s.driftRange * s.driftX;
      const dy = reduced ? 0 : Math.cos(s.driftPhase + t * s.driftSpeed * Math.PI * 2) * s.driftRange * s.driftY;

      ctx.globalAlpha = alpha;
      ctx.drawImage(s.sprite, s.x + dx - s.cx, s.y + dy - s.cx);
    };

    const drawMeteor = (m: Meteor, now: number) => {
      const t = (now - m.life) / m.maxLife;
      if (t >= 1) return false;

      const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
      const mag = Math.hypot(m.vx, m.vy);
      const nx = m.vx / mag;
      const ny = m.vy / mag;
      const tailX = m.x - nx * m.len;
      const tailY = m.y - ny * m.len;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
      grad.addColorStop(0.3, `rgba(197,240,246,${0.45 * fade})`);
      grad.addColorStop(1, "rgba(197,240,246,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      const head = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 6);
      head.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
      head.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
      ctx.fill();

      m.x += m.vx;
      m.y += m.vy;
      return true;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      for (const s of stars) drawStar(s, now);
      ctx.globalAlpha = 1;
      if (!reduced && now >= nextMeteorAt) spawnMeteor(now);
      meteors = meteors.filter((m) => drawMeteor(m, now));
    };

    resize();
    nextMeteorAt = performance.now() + 1200;
    raf = requestAnimationFrame(frame);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // 滾出視窗或分頁切到背景時暫停繪製，節省效能
    const visibleObserver = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    visibleObserver.observe(canvas);
    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      visibleObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
