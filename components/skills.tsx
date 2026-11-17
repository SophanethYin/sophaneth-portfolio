"use client";

import { useEffect, useRef, useState } from "react";
import { base, toolCategories, tools, type ToolCategory } from "@/lib/data";
import { MotionToggle } from "./motion";
import { mono, rise } from "./ui";

// ---- Orbit geometry (from the tool list, once) ------------------------------------
// One ring per category, fewest tools innermost. Each ring is at least 95px outside the last and big enough
// that its chips sit ~82px apart. The 740px drawing then shrinks so the outer ring fits a 325px radius.

const SIZE = 740;
const C = SIZE / 2;
const SPEEDS = [9, -6, 4]; // °/s, inner to outer; more rings reuse the pattern
const look: Record<ToolCategory, { bg: string; fg: string }> = {
  front: { bg: "var(--red)", fg: "var(--paper)" },
  back: { bg: "var(--panel)", fg: "#f4f0e6" },
  ops: { bg: "var(--card)", fg: "var(--ink)" },
};

const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (u: number) => Math.min(1, Math.max(0, u));
const o3 = (u: number) => 1 - (1 - u) ** 3;

const rings = (() => {
  const cats = (Object.keys(toolCategories) as ToolCategory[])
    .map((c) => ({ c, items: tools.filter((t) => t.category === c) }))
    .filter((r) => r.items.length)
    .sort((a, b) => a.items.length - b.items.length);
  let prev = 0;
  return cats.map(({ c, items }, i) => {
    const r = Math.round(Math.max(i === 0 ? 140 : prev + 95, (items.length * 82) / (2 * Math.PI)));
    prev = r;
    const off = -Math.PI / 2 + i * 0.3;
    return {
      cat: c,
      r,
      items: items.map((t, j) => {
        const a = (j / items.length) * 2 * Math.PI + off;
        // Rounded so the server and browser print the same CSS value (else hydration warns).
        return { ...t, x: Math.round(C + Math.cos(a) * r), y: Math.round(C + Math.sin(a) * r) };
      }),
    };
  });
})();
const FIT = Math.min(1, 325 / rings[rings.length - 1].r);

// --------------------------------------------------------------------------------------

export function Skills() {
  const box = useRef<HTMLDivElement>(null);
  const ringEls = useRef<(HTMLDivElement | null)[]>([]);
  const paused = useRef(false);
  const [scale, setScale] = useState(1); // how much the 740px drawing shrinks to fit its column
  const [hl, setHl] = useState<number | null>(null); // ring whose list row is hovered

  // Fit the drawing to its column.
  useEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / SIZE)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build, then spin. Once the orbit reaches the screen (the same 88% line as every other section), the build plays
  // by itself over 1.6 s: q runs 0 → 1 with time, not scroll. Once built, the rings spin while on screen; hovering or
  // "Pause animation" eases them to a stop, and fast scrolling speeds them up. Build state lives in CSS variables
  // (--bs scale, --bx/--by offset, --bo opacity) that the JSX transforms read, so no code ever writes a tool's
  // transform and its counter-rotation always holds. Nothing moves with reduced motion.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = box.current!;
    const q = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];
    const cross = q('[data-b="cross"]'),
      core = q('[data-b="core"]'),
      circles = q('[data-b="ring"]'),
      chipEls = q('[data-b="chip"]'),
      rows = [...root.closest("section")!.querySelectorAll<HTMLElement>("[data-ring]")];
    const set = (els: HTMLElement[], k: string, v: string) => els.forEach((e) => e.style.setProperty(k, v));
    let best = -1;
    let built = false;
    let t0 = 0; // when the orbit was reached

    function build(t: number) {
      const now = t0 ? clamp((t - t0) / 1600) : 0;
      if (now <= best) return;
      best = now;
      const ph = (from: number, len: number) => o3(clamp((best - from) / len));
      set(cross, "--bs", String(ph(0, 0.3)));
      set(core, "--bs", String(ph(0.05, 0.2)));
      circles.forEach((c) => c.style.setProperty("--bs", String(ph(0.1 + 0.12 * +c.dataset.i!, 0.35))));
      rows.forEach((row) => best >= 0.1 + 0.12 * +row.dataset.ring! && row.setAttribute("data-in", ""));
      chipEls.forEach((t) => {
        const i = +t.dataset.i!,
          j = +t.dataset.j!;
        const u = ph(0.25 + 0.14 * i + 0.012 * j, 0.3);
        t.style.setProperty("--bx", `${(C - parseFloat(t.style.left)) * (1 - u)}px`);
        t.style.setProperty("--by", `${(C - parseFloat(t.style.top)) * (1 - u)}px`);
        t.style.setProperty("--bs", String(0.3 + 0.7 * u));
        t.style.setProperty("--bo", u > 0 ? "1" : "0");
      });
      if (best < 1) return;
      // Built for good: hand everything back to the finished look and never write build state again.
      built = true;
      [...cross, ...core, ...circles, ...chipEls].forEach((e) => ["--bs", "--bx", "--by", "--bo"].forEach((k) => e.style.removeProperty(k)));
      rows.forEach((row) => row.setAttribute("data-in", ""));
    }
    build(0); // the hidden start state, so the finished orbit never shows before it is reached

    const angle = rings.map(() => 0);
    let run = 0; // eases up once built
    let boost = 0;
    let lastY = scrollY;
    let last = 0;
    let raf = 0;
    let onScreen = false;
    function tick(t: number) {
      raf = 0;
      if (built && !onScreen) return; // off screen: the observer starts the frames again
      const dt = Math.min(64, t - (last || t));
      last = t;
      raf = requestAnimationFrame(tick);
      if (!built) {
        t0 ||= t;
        build(t);
        lastY = scrollY;
        return;
      }
      boost = Math.min(10, boost * 0.9 + Math.abs(scrollY - lastY) * 0.06);
      lastY = scrollY;
      const hold = paused.current || document.documentElement.hasAttribute("data-still");
      run += ((hold ? 0 : 1) - run) * 0.08;
      if (run < 0.001) return; // at rest: nothing to move
      ringEls.current.forEach((el, i) => {
        if (!el) return;
        angle[i] += (SPEEDS[i % SPEEDS.length] * run * (1 + boost * 0.5) * dt) / 1000;
        el.style.setProperty("--r", `${angle[i]}deg`);
      });
    }

    // The observer's root stops at the 88% line, so "intersecting" means reached. Frames run only then, except that an
    // orbit already scrolled past (say, after a jump to #contact) still finishes its build: the ring list waits on it.
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1]; // the latest state, if several queued up
        onScreen = e.isIntersecting;
        if (raf || !(onScreen || (!built && e.boundingClientRect.top < 0))) return;
        last = 0;
        lastY = scrollY; // a jump made while away is not fast scrolling
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const chip = Math.max(1, 0.62 / scale); // phones: chips grow back to a tappable-looking size
  const labels = scale >= 0.7;

  return (
    <section id="skills" className="scroll-mt-[60px] overflow-hidden border-t-[1.5px] border-ink pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-[72px]">
      <div className="mx-auto grid max-w-[1680px] items-stretch gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-0">
        {/* On phones and tablets this column dissolves, so the orbit can sit between the title and the ring list. */}
        <div className="contents lg:flex lg:flex-col lg:justify-between lg:gap-9 lg:py-1">
          <div data-draw>
            <div className={`draw-wipe ${mono} text-xs font-medium leading-none text-muted`}>Sheet 05 / Skills · Plan view</div>
            <h2 className="mb-0 mt-[26px] font-display text-[clamp(44px,5.6vw,76px)] font-bold uppercase leading-[.95]">
              {rise(["My", ["toolkit", "text-red"]])}
            </h2>
          </div>
          <div className="order-2 flex flex-col border-t-[1.5px] border-ink lg:order-none">
            {rings.map((r, i) => (
              <div
                key={r.cat}
                data-ring={i}
                onMouseEnter={() => setHl(i)}
                onMouseLeave={() => setHl(null)}
                className={`draw-wipe grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-dashed border-line2 py-3.5 transition-colors ${
                  hl === i ? "bg-card" : ""
                }`}
              >
                <span className="font-mono text-xs font-semibold leading-none text-red">R{i + 1}</span>
                <span className="flex items-center gap-2.5 font-display text-2xl font-bold uppercase leading-none">
                  <span className="box-border size-3 border-[1.5px] border-ink" style={{ background: look[r.cat].bg }} />
                  {toolCategories[r.cat]}
                </span>
                <span className="font-mono text-xs font-medium leading-none text-muted">{pad(r.items.length)}</span>
              </div>
            ))}
            <div data-draw className={`draw-wipe flex justify-between pt-3 ${mono} text-[11px] font-medium leading-none [--tr:.08em] text-muted`}>
              <span>Scale 1 : {(1 / (FIT * scale)).toFixed(2)}</span>
              <MotionToggle />
              <span>{tools.length} parts</span>
            </div>
          </div>
        </div>

        <div
          ref={box}
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          role="img"
          aria-label={`Toolkit: ${rings.map((r) => `${toolCategories[r.cat]}: ${r.items.map((t) => t.name).join(", ")}`).join(". ")}`}
          className="relative order-1 aspect-square w-full max-w-[740px] justify-self-center lg:order-none"
        >
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: SIZE, height: SIZE, transform: `scale(${scale})` }}>
            <div className="relative size-full" style={{ transform: `scale(${FIT})` }}>
              <span data-b="cross" className="absolute inset-y-0 left-1/2 w-px bg-line2" style={{ transform: "scaleY(var(--bs,1))" }} />
              <span data-b="cross" className="absolute inset-x-0 top-1/2 h-px bg-line2" style={{ transform: "scaleX(var(--bs,1))" }} />
              {rings.map((r, i) => (
                <div
                  key={r.cat}
                  data-layer={i}
                  ref={(el) => {
                    ringEls.current[i] = el;
                  }}
                  className="absolute inset-0 transition-opacity duration-200 [transform:rotate(var(--r,0deg))]"
                  style={{ opacity: hl === null || hl === i ? 1 : 0.18 }}
                >
                  <span
                    data-b="ring"
                    data-i={i}
                    className={`absolute box-border rounded-full border-[1.5px] ${hl === i ? "border-solid border-red" : "border-dashed border-ink"}`}
                    style={{ left: C - r.r, top: C - r.r, width: 2 * r.r, height: 2 * r.r, transform: "scale(var(--bs,1))" }}
                  />
                  {r.items.map((t, j) => (
                    <div
                      key={t.name}
                      data-b="chip"
                      data-i={i}
                      data-j={j}
                      className="group absolute flex flex-col items-center gap-1.5"
                      style={{
                        left: t.x,
                        top: t.y,
                        transform: `translate(calc(-50% + var(--bx,0px)), calc(-50% + var(--by,0px))) rotate(calc(var(--r,0deg) * -1)) scale(calc(${chip} * var(--bs,1)))`,
                        opacity: "var(--bo,1)",
                      }}
                    >
                      <span
                        className="grid size-[54px] place-items-center rounded-full border-[1.5px] border-ink transition-[translate,box-shadow] duration-150 group-hover:-translate-x-[3px] group-hover:-translate-y-[3px] group-hover:shadow-[3px_3px_0_var(--ink)]"
                        style={{ background: look[r.cat].bg, color: look[r.cat].fg }}
                      >
                        {t.logo ? (
                          <span
                            className="size-[26px] bg-current"
                            style={{
                              mask: `url(${base}/logos/${t.logo}.svg) center/contain no-repeat`,
                              WebkitMask: `url(${base}/logos/${t.logo}.svg) center/contain no-repeat`,
                            }}
                          />
                        ) : (
                          <span className="font-display text-lg font-bold leading-none">{t.mono ?? t.name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </span>
                      {labels ? (
                        <span className={`whitespace-nowrap bg-paper px-[5px] py-[3px] ${mono} text-[10px] font-semibold leading-none [--tr:.06em]`}>
                          {t.name}
                        </span>
                      ) : (
                        // Labels are hidden at this size: hovering shows the name instead.
                        <span
                          className={`pointer-events-none absolute top-[60px] whitespace-nowrap bg-ink px-[5px] py-[3px] text-paper ${mono} text-[10px] font-semibold leading-none [--tr:.06em] [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-200 group-hover:[clip-path:inset(0)]`}
                        >
                          {t.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div
                data-b="core"
                className="absolute left-1/2 top-1/2 -ml-[60px] -mt-[60px] size-[120px] rounded-full"
                style={{ transform: `scale(calc(${chip} * var(--bs,1)))` }}
              >
                <img src={`${base}/logo-round.svg`} alt="YS" width={120} height={120} className="size-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
