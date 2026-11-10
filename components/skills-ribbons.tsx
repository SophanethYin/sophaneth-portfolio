"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { base } from "@/lib/data";
import { Reveal } from "./reveal";

type Category = "front" | "back" | "ops";

// Add tools here. `logo` is the file name (without .svg) in public/logos/.
const tools: { name: string; context: string; category: Category; logo: string }[] = [
  { name: "React", context: "FlowBill UI", category: "front", logo: "react" },
  { name: "Next.js", context: "Web apps", category: "front", logo: "nextjs" },
  { name: "JavaScript", context: "Daily", category: "front", logo: "javascript" },
  { name: "Tailwind CSS", context: "Styling", category: "front", logo: "tailwindcss" },
  { name: "Bootstrap", context: "School projects", category: "front", logo: "bootstrap" },
  { name: "Vite", context: "Build tooling", category: "front", logo: "vite" },
  { name: "Python", context: "Daily", category: "back", logo: "python" },
  { name: "FastAPI", context: "ERP API", category: "back", logo: "fastapi" },
  { name: "SQLAlchemy", context: "ORM", category: "back", logo: "sqlalchemy" },
  { name: "PostgreSQL", context: "Production DB", category: "back", logo: "postgresql" },
  { name: "Java", context: "University", category: "back", logo: "java" },
  { name: "Stripe", context: "Payments", category: "back", logo: "stripe" },
  { name: "Ubuntu", context: "Server", category: "ops", logo: "ubuntu" },
  { name: "Nginx", context: "Reverse proxy", category: "ops", logo: "nginx" },
  { name: "Jinja2", context: "PDF templates", category: "ops", logo: "jinja2" },
  { name: "Playwright", context: "PDF rendering", category: "ops", logo: "playwright" },
];

const categories: Record<Category, { label: string; grad: string }> = {
  front: { label: "Front-end", grad: "linear-gradient(135deg,#ff7a45,#ff4f3a)" },
  back: { label: "Back-end & data", grad: "linear-gradient(135deg,#3b2fd0,#8b46e8)" },
  ops: { label: "Ops & documents", grad: "linear-gradient(135deg,#8b46e8,#c64fd2)" },
};

// Repeat the list until one copy is wider than a wide screen (~200px per pill), then render that copy twice.
const copy = Array.from({ length: Math.max(1, Math.ceil(1400 / (tools.length * 200))) }, () => tools).flat();

function Logo({ tool }: { tool: (typeof tools)[number] }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${base}/logos/${tool.logo}.svg`}
      alt=""
      width={34}
      height={34}
      draggable={false}
      className="size-7 shrink-0 object-contain md:size-[34px]"
    />
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * One looping ribbon. Auto-scrolls at `speed` px/s, pauses while a mouse hovers it,
 * and can be dragged / flicked (mouse or touch) or swiped with a trackpad, in either direction.
 * `from` is the side it slides in from when the stage scrolls into view.
 */
function Ribbon({
  speed,
  reverse,
  from,
  delay = 0,
  className,
}: {
  speed: number;
  reverse?: boolean;
  from: "left" | "right";
  delay?: number;
  className: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // x: offset, v: fling velocity (px/s) that glides out after a drag.
  const s = useRef({ x: 0, v: 0, hover: false, drag: false, lastX: 0, lastT: 0 });
  const list = reverse ? [...copy].reverse() : copy;

  useEffect(() => {
    const el = track.current;
    const box = wrap.current;
    if (!el || !box) return;
    const auto = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : speed;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = s.current;
      if (!st.drag) {
        st.x += ((st.hover ? 0 : auto) + st.v) * dt;
        st.v *= Math.exp(-3 * dt);
      }
      const half = el.scrollWidth / 2;
      while (st.x <= -half) st.x += half; // `while`: a hard fling can jump more than one loop in a frame
      while (st.x > 0) st.x -= half;
      el.style.transform = `translate3d(${st.x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Sideways trackpad swipe / shift+wheel moves the ribbon; vertical wheel still scrolls the page.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      s.current.x -= e.deltaX;
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener("wheel", onWheel);
    };
  }, [speed]);

  const end = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.drag) return;
    st.drag = false;
    if (e.timeStamp - st.lastT > 80) st.v = 0; // held still before letting go: no fling
  };

  return (
    <motion.div
      variants={{
        hidden: { x: from === "right" ? "110%" : "-110%" },
        show: { x: 0, transition: { duration: 2.4, delay, ease } },
      }}
      className={`absolute -inset-x-[60px] ${className}`}
    >
      <div
        ref={wrap}
        onPointerEnter={(e) => e.pointerType === "mouse" && (s.current.hover = true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && (s.current.hover = false)}
        onPointerDown={(e) => {
          const st = s.current;
          st.drag = true;
          st.v = 0;
          st.lastX = e.clientX;
          st.lastT = e.timeStamp;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const st = s.current;
          if (!st.drag) return;
          const dx = e.clientX - st.lastX;
          const dt = (e.timeStamp - st.lastT) / 1000;
          st.x += dx;
          if (dt > 0) st.v = Math.max(-3000, Math.min(3000, 0.7 * st.v + 0.3 * (dx / dt)));
          st.lastX = e.clientX;
          st.lastT = e.timeStamp;
        }}
        onPointerUp={end}
        onPointerCancel={end}
        className="cursor-grab touch-pan-y select-none overflow-hidden py-[18px] active:cursor-grabbing"
      >
      <div ref={track} className="flex w-max gap-3.5 pr-3.5 will-change-transform">
        {[0, 1].map((half) =>
          list.map((t, k) => (
            <div
              key={`${half}-${k}`}
              className="flex shrink-0 items-center gap-3 rounded-full bg-white py-2.5 pl-2.5 pr-[22px]"
            >
              <Logo tool={t} />
              <span className="whitespace-nowrap text-[17px] font-bold italic text-[#1f1a5c] md:text-xl">{t.name}</span>
              {reverse ? (
                <span className="whitespace-nowrap text-sm italic text-[#8a86a8]">{t.context}</span>
              ) : (
                <span className="size-2 shrink-0 rounded-full" style={{ background: categories[t.category].grad }} />
              )}
            </div>
          )),
        )}
      </div>
      </div>
    </motion.div>
  );
}

/** "My toolkit": two tilted ribbons of tool logos crossing each other, scrolling in opposite directions forever. */
export function SkillsRibbons() {
  return (
    <section
      id="skills"
      aria-labelledby="toolkit-title"
      className="overflow-hidden pt-[72px]"
      style={{ background: "linear-gradient(100deg,#fdeef0 0%,#f5effb 50%,#e9edff 100%)" }}
    >
      <Reveal className="mx-auto flex max-w-[1600px] flex-col gap-6 px-[22px] sm:px-11 lg:px-16 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2.5">
          <span className="text-[17px] italic text-[#3b2fd0]">Skills</span>
          <h2
            id="toolkit-title"
            className="m-0 text-[40px] font-extrabold italic leading-none tracking-[-1px] text-[#1f1a5c] md:text-[60px]"
          >
            My <span className="text-[#ff5b35]">toolkit</span>
          </h2>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
          {Object.values(categories).map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-[15px] italic text-[#5a5680]">
              <span className="size-2.5 rounded-full" style={{ background: c.grad }} />
              {c.label}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Screen readers get the plain list; the ribbons are decoration. */}
      <ul className="sr-only">
        {tools.map((t) => (
          <li key={t.name}>
            {t.name}: {t.context} ({categories[t.category].label})
          </li>
        ))}
      </ul>

      {/* The stage (not the off-screen ribbons) watches the viewport, then tells both ribbons to slide in. */}
      <motion.div
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }} // slide in once per page load

        className="relative h-[300px] md:h-[380px]"
      >
        <Ribbon
          speed={-45}
          from="right"
          className="top-[50px] -rotate-4 bg-[linear-gradient(90deg,#3b2fd0,#8b46e8)] shadow-[0_20px_50px_rgba(59,47,208,.3)] md:top-[70px]"
        />
        <Ribbon
          speed={45}
          reverse
          from="left"
          delay={0.35}
          className="top-[160px] rotate-3 bg-[linear-gradient(90deg,#ff7a45,#ff4f3a)] shadow-[0_20px_50px_rgba(255,91,53,.3)] md:top-[200px]"
        />
      </motion.div>
    </section>
  );
}
