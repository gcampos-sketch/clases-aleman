import { useEffect, useRef, useState } from "react";

function readToken(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function FilamentCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const count = w < 640 ? 7 : 13;
    const lines = Array.from({ length: count }, (_, i) => ({
      base: 0.12 + (i / count) * 0.82,
      amp: 18 + ((i * 37) % 55),
      freq: 0.7 + ((i * 13) % 9) / 9,
      speed: 0.08 + ((i * 7) % 11) / 90,
      phase: (i * Math.PI) / 3.1,
      alpha: 0.10 + ((i * 5) % 7) / 55,
      width: 0.6 + ((i * 3) % 4) / 4,
    }));

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const l of lines) {
        ctx.beginPath();
        ctx.lineWidth = l.width;
        ctx.strokeStyle = color;
        ctx.globalAlpha = l.alpha;
        const step = 14;
        for (let x = 0; x <= w + step; x += step) {
          const p = x / Math.max(w, 1);
          const y =
            h * l.base +
            Math.sin(p * Math.PI * 2 * l.freq + t * l.speed * 6 + l.phase) * l.amp +
            Math.sin(p * Math.PI * 5.3 + t * l.speed * 2.3) * (l.amp * 0.28);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color]);

  return <canvas ref={ref} className="h-full w-full" aria-hidden="true" />;
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [color, setColor] = useState("oklch(0.878 0.166 92.2)");

  useEffect(() => {
    setMounted(true);
    setColor(readToken("--primary", "oklch(0.878 0.166 92.2)"));
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[900px] overflow-hidden">
      <div
        className={`absolute -top-40 -left-24 h-[420px] w-[420px] rounded-full bg-primary/25 blur-3xl ${
          reduced ? "" : "animate-blob-slow"
        }`}
      />
      <div
        className={`absolute top-24 right-[-10%] h-[460px] w-[460px] rounded-full bg-chart-5/20 blur-3xl ${
          reduced ? "" : "animate-blob-slower"
        }`}
      />
      <div
        className={`absolute top-[320px] left-1/3 h-[380px] w-[380px] rounded-full bg-primary/15 blur-3xl ${
          reduced ? "" : "animate-blob-slowest"
        }`}
      />

      {mounted && !reduced ? (
        <div className="absolute inset-0">
          <FilamentCanvas color={color} />
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
