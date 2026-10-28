"use client";

import { useEffect, useRef } from "react";

const TRAIL_MS = 380;
const RIPPLE_MS = 650;

type Dot = { x: number; y: number; t: number };

// Trail colors from tail (0) to pointer (1): purple → pink → coral, so the two brand colors blend.
const stops: [number, number, number][] = [
  [122, 63, 209], // #7A3FD1
  [214, 74, 160], // pink midpoint
  [255, 94, 58], // #FF5E3A
];

function mix(life: number) {
  const s = life < 0.5 ? 0 : 1;
  const t = life < 0.5 ? life * 2 : (life - 0.5) * 2;
  const [a, b] = [stops[s], stops[s + 1]];
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",");
}

/** A fading gradient trail behind the mouse and a ring that ripples out on click. Mouse only. */
export function CursorFx() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const trail: Dot[] = [];
    const ripples: Dot[] = [];
    const move = (e: PointerEvent) => {
      // Coalesced events fill in the gaps when the mouse moves fast, so the line stays smooth.
      for (const c of e.getCoalescedEvents?.() ?? [e]) trail.push({ x: c.clientX, y: c.clientY, t: performance.now() });
    };
    const down = (e: PointerEvent) => ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() });

    let raf = 0;
    const draw = (now: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
      while (ripples.length && now - ripples[0].t > RIPPLE_MS) ripples.shift();

      // Butt caps: round caps overlap at every joint and make the line look beaded.
      ctx.lineCap = "butt";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const life = 1 - (now - b.t) / TRAIL_MS; // 1 at the pointer, 0 at the tail
        // sqrt keeps the purple tail visible longer before it fades out.
        ctx.strokeStyle = `rgba(${mix(life)},${Math.sqrt(life) * 0.85})`;
        ctx.lineWidth = 1 + life * 4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const rp of ripples) {
        const p = (now - rp.t) / RIPPLE_MS;
        const eased = 1 - (1 - p) ** 3;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, 4 + eased * 16, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,94,58,${(1 - p) * 0.12})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,94,58,${(1 - p) * 0.9})`;
        ctx.lineWidth = 2 * (1 - p) + 0.5;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    addEventListener("pointermove", move);
    addEventListener("pointerdown", down);
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />;
}
