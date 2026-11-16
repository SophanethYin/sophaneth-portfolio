"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/lib/data";
import { Section, Sheet, at, h2, mono, rise } from "./ui";

const key = (color: string, text: string) => (
  <span className="flex items-center gap-2">
    <span className={`size-[9px] ${color}`} />
    {text}
  </span>
);

const clamp = (u: number) => Math.min(1, Math.max(0, u));

export function Experience() {
  const grid = useRef<HTMLDivElement>(null);

  // The line follows the scroll like a progress bar and never shrinks back (spec §6.6). The row segments touch,
  // so driving each from the same "pen" draws one continuous line. The pen sits on the same 88% line every other
  // section draws at, so rows never sit blank on screen and the line finishes before the toolkit starts.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const segs = [...grid.current!.querySelectorAll<HTMLElement>(".tl-seg")];
    const rows = [...grid.current!.querySelectorAll<HTMLElement>("[data-tl-row]")];
    const best = segs.map(() => 0);
    let raf = 0;
    const update = () => {
      raf = 0;
      const pen = innerHeight * 0.88;
      segs.forEach((s, i) => {
        // Measure the untransformed parent: the segment's own box is squashed by its scaleY.
        const r = s.parentElement!.getBoundingClientRect();
        best[i] = Math.max(best[i], clamp((pen - r.top) / r.height));
        s.style.transform = `scaleY(${best[i]})`;
      });
      rows.forEach((row) => {
        if (row.querySelector(".tl-mark")!.getBoundingClientRect().top + 8 <= pen) row.setAttribute("data-in", "");
      });
      if (best.every((b) => b === 1) && rows.every((r) => r.hasAttribute("data-in"))) stop();
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    const stop = () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section id="experience">
      <Sheet
        left="Sheet 04 / Resume"
        right={
          <>
            {key("bg-red", "Work")}
            {key("bg-ink", "Education")}
          </>
        }
      />
      <h2 data-draw className={`${h2} mb-14`}>
        {rise([["Experience", "text-red"], "& education"])}
      </h2>

      <div
        ref={grid}
        className="grid max-w-[940px] grid-cols-[64px_22px_minmax(0,1fr)] gap-x-2.5 sm:grid-cols-[110px_32px_minmax(0,1fr)] sm:gap-x-4 lg:grid-cols-[minmax(84px,150px)_32px_minmax(0,1fr)] lg:gap-x-5"
      >
        {journey.map((j, k) => {
          const last = k === journey.length - 1;
          const step = (n: number) => at(0.1 + n * 0.05);
          return (
            <div key={j.title} data-tl-row className="contents">
              <div className="text-right">
                <div className="slot block">
                  <div
                    className={`draw-rise inline-block font-display text-[28px] font-bold leading-none sm:text-[44px] lg:text-[56px] ${j.work ? "text-red" : ""}`}
                  >
                    {j.start}
                  </div>
                </div>
                <div
                  className="draw-wipe mt-1.5 font-mono text-[9px] font-medium uppercase leading-none tracking-[.08em] text-muted sm:text-[11px] lg:text-xs"
                  style={at(0.1)}
                >
                  → {j.end}
                </div>
              </div>
              <div className="relative">
                <span className="tl-seg absolute inset-y-0 left-[15px] w-[1.5px] bg-ink" />
                <span
                  className={`tl-mark draw-dot absolute left-2 top-5 box-border size-4 border-[3px] bg-paper ${j.work ? "border-red" : "border-ink"}`}
                />
                {last && <span className="draw-x absolute bottom-0 left-[9px] h-[1.5px] w-3.5 origin-left bg-ink" style={at(0.3)} />}
              </div>
              <div className={last ? "pb-6" : "pb-16"}>
                <div className={`draw-wipe ${mono} text-xs font-semibold leading-none [--tr:.14em] ${j.work ? "text-red" : ""}`} style={step(0)}>
                  {j.kind}
                </div>
                <h3
                  className="draw-wipe mb-0 mt-2.5 font-display text-2xl font-bold uppercase leading-none sm:text-[32px] lg:text-[clamp(30px,3.4vw,42px)]"
                  style={step(1)}
                >
                  {j.title}
                </h3>
                <div className="draw-wipe mt-2 text-[17px] font-medium leading-[1.4]" style={step(2)}>
                  {j.org}
                </div>
                <p className="draw-wipe mb-0 mt-3 text-pretty text-base leading-[1.6] text-muted" style={step(3)}>
                  {j.desc}
                </p>
                {j.tags && (
                  <div className={`draw-wipe mt-3.5 ${mono} text-[11px] font-medium leading-[1.8]`} style={step(4)}>
                    {j.tags}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
