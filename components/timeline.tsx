"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { journey } from "@/lib/data";

// The bar's tip sits 90% down the screen. A % of the viewport, so the timing scales with any screen height.
const TIP = "90%";
// Circle center from the top of its row (mt-3 + half of 18px).
const CIRCLE_Y = 21;
const cols =
  "grid grid-cols-[76px_20px_minmax(0,1fr)] gap-x-[clamp(12px,3vw,40px)] sm:grid-cols-[minmax(110px,220px)_28px_minmax(0,1fr)]";
const shown = { opacity: 1, y: 0 };
const rise = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

function Item({ j, active, rowRef }: { j: (typeof journey)[number]; active: boolean; rowRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={rowRef} className={`${cols} items-stretch`}>
      <motion.div
        className="flex flex-col items-end pb-14 pt-1.5 text-right"
        initial={false}
        animate={active ? shown : { opacity: 0, y: 40 }}
        transition={{ ...rise, delay: active ? 0.15 : 0 }}
      >
        <span
          className="text-[clamp(28px,3.4vw,46px)] font-extrabold italic leading-none tracking-[-0.02em]"
          style={{ color: j.color }}
        >
          {j.start}
        </span>
        <span className="mt-1.5 text-[15px] italic text-faint">→ {j.end}</span>
      </motion.div>

      <div className="relative flex justify-center">
        <motion.span
          className="relative mt-3 size-[18px]"
          initial={false}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={active ? { type: "spring", stiffness: 140, damping: 14 } : { duration: 0.4 }}
        >
          {active && (
            <motion.span
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: j.color }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            />
          )}
          <span
            className="absolute inset-0 rounded-full border-4 bg-paper"
            style={{ borderColor: j.color, boxShadow: `0 0 0 6px ${j.halo}` }}
          />
        </motion.span>
      </div>

      <motion.div
        className="flex flex-col gap-2.5 pb-14 pt-1"
        initial={false}
        animate={active ? shown : { opacity: 0, y: 40 }}
        transition={{ ...rise, delay: active ? 0.25 : 0 }}
      >
        <span className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: j.color }}>
          {j.kind}
        </span>
        <span className="text-[clamp(24px,2.6vw,34px)] font-bold italic leading-[1.1] text-ink">{j.title}</span>
        <span className="text-[17px] italic text-iris">{j.org}</span>
        <p className="m-0 mt-1 max-w-[620px] text-pretty text-base italic leading-[1.65] text-muted">{j.desc}</p>
        {j.tags && (
          <p className="m-0 mt-1.5 max-w-[620px] whitespace-pre-wrap text-[15px] italic leading-[1.7] text-ink">{j.tags}</p>
        )}
      </motion.div>
    </div>
  );
}

/** One gray line that fills like a loading bar as you scroll; each entry appears when the bar reaches its circle. */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  // 0 when the timeline's top meets the tip line, 1 when its bottom does.
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${TIP}`, `end ${TIP}`] });
  // One shared spring, so the bar glides after the scroll and can never skip ahead of itself.
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.001 });
  const reveal = useTransform(fill, (v) => `inset(0 0 ${(1 - v) * 100}% 0)`);

  // Where each circle sits, as a fraction of the timeline's height.
  const [stops, setStops] = useState<number[]>([]);
  useEffect(() => {
    const measure = () => {
      const h = ref.current?.offsetHeight || 1;
      setStops(rows.current.map((r) => ((r?.offsetTop ?? 0) + CIRCLE_Y) / h));
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);

  const [reached, setReached] = useState(0);
  useMotionValueEvent(fill, "change", (v) => setReached(stops.filter((s) => v >= s).length));

  // Color stops at each circle, so the bar blends purple → orange → purple along its length.
  const gradient = stops.length
    ? `linear-gradient(180deg,${stops.map((s, i) => `${journey[i].color} ${(s * 100).toFixed(1)}%`).join(",")})`
    : journey[0].color;

  return (
    <div ref={ref} className="relative flex flex-col">
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${cols}`}>
        <div />
        <div className="relative flex justify-center">
          <span className="absolute inset-y-0 w-0.5 bg-line" />
          <motion.span className="absolute inset-y-0 w-0.5" style={{ clipPath: reveal, background: gradient }} />
        </div>
      </div>
      {journey.map((j, i) => (
        <Item key={j.title} j={j} active={i < reached} rowRef={(el) => void (rows.current[i] = el)} />
      ))}
    </div>
  );
}
