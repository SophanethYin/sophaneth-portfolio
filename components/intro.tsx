"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { useLenis } from "lenis/react";

/** True once the intro has started lifting, so the hero and header can play their entrance. */
export const IntroContext = createContext(true);

const letters = ["P", "H", "A", "N", "E", "T", "H"];
// Shown before the scramble starts, so the name never flashes on first paint.
const placeholder = ["Q", "Z", "R", "B", "X", "K", "M"];
// Counter value at which each column stops scrambling and locks into its letter.
const lockAt = [18, 30, 42, 54, 66, 80, 96];
// Curtain split per column: [1 = slide down, -1 = slide up, delay in s].
const split: [number, number][] = [[1, 0.04], [1, 0.16], [-1, 0.07], [1, 0.2], [-1, 0.14], [1, 0.12], [1, 0.08]];
// Soft wipe block per column: [top, height, slide direction, color].
const peach = "#FFD6CB";
const lilac = "#D9D3FF";
const blocks: [string, string, number, string][] = [
  ["50%", "50%", 1, peach],
  ["0%", "100%", -1, lilac],
  ["0%", "100%", -1, peach],
  ["65%", "35%", 1, lilac],
  ["0%", "70%", -1, peach],
  ["40%", "60%", 1, lilac],
  ["0%", "100%", -1, peach],
];
// The hero gradient, a touch deeper so the intro doesn't wash out.
const sheet = "linear-gradient(115deg,#FFDCD3 0%,#F6E1EE 40%,#DDE3FF 75%,#CFDCFF 100%)";
const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const easeInOut = [0.65, 0, 0.35, 1] as const;
const easeExpo = [0.87, 0, 0.13, 1] as const;

export function Intro({ onReveal }: { onReveal: () => void }) {
  const lenis = useLenis();
  const [phase, setPhase] = useState<"load" | "split" | "done">("load");
  const [count, setCount] = useState(0);
  const [chars, setChars] = useState(placeholder);
  const countRef = useRef(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      onReveal();
      return;
    }
    window.scrollTo(0, 0);
    const counter = animate(0, 100, {
      duration: 2.2,
      ease: [0.33, 0, 0.2, 1],
      onUpdate: (v) => {
        countRef.current = Math.round(v);
        setCount(countRef.current);
      },
      onComplete: () => {
        setPhase("split");
        onReveal();
      },
    });
    const scramble = setInterval(() => {
      setChars(letters.map((l, i) =>
        countRef.current >= lockAt[i] ? l : glyphs[Math.floor(Math.random() * glyphs.length)],
      ));
    }, 45);
    return () => {
      counter.stop();
      clearInterval(scramble);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "split") return;
    const t = setTimeout(() => setPhase("done"), 1450);
    return () => clearTimeout(t);
  }, [phase]);

  // Lock scrolling until the curtain has lifted.
  useEffect(() => {
    if (phase === "done") lenis?.start();
    else lenis?.stop();
  }, [lenis, phase]);

  if (phase === "done") return null;
  const splitting = phase === "split";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[60] grid grid-cols-7 ${splitting ? "pointer-events-none" : ""}`}
    >
      {letters.map((_, i) => {
        const [dir, delay] = split[i];
        const block = blocks[i];
        const locked = count >= lockAt[i];
        return (
          <motion.div
            key={i}
            // Each column shows its own slice of one wide gradient, so the background reads as a single sheet.
            className={`relative flex items-center justify-center overflow-hidden border-l border-white/80 will-change-transform first:border-l-0 ${
              splitting ? "shadow-[0_0_60px_-10px_rgba(42,28,158,.28)]" : ""
            }`}
            style={{ background: sheet, backgroundSize: "700% 100%", backgroundPosition: `${(i / 6) * 100}% 0` }}
            animate={{ y: splitting ? (dir > 0 ? "100%" : "-100%") : "0%" }}
            transition={{ duration: 1.15, ease: easeExpo, delay }}
          >
            <motion.div
              className="absolute inset-x-0 will-change-transform"
              style={{ top: block[0], height: block[1], background: block[3] }}
              initial={{ y: "0%" }}
              animate={{ y: block[2] > 0 ? "101%" : "-101%" }}
              transition={{ duration: 1.1, ease: easeInOut, delay: 0.1 + i * 0.05 }}
            />
            <span
              className={`relative pr-[.06em] text-[clamp(3.5rem,7.5vw,8.5rem)] font-extrabold italic leading-none tracking-[-0.04em] ${
                locked ? "text-clip bg-[linear-gradient(90deg,#4B2BC4,#7A3FD1_60%,#B04EC9)]" : "text-faint"
              }`}
            >
              {chars[i]}
            </span>
          </motion.div>
        );
      })}

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: splitting ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="absolute left-6 top-6 text-2xl font-bold italic tracking-[-0.02em] text-ink">
          Sophaneth<span className="text-coral">.</span>
        </span>
        <span className="absolute right-6 top-7 text-[15px] italic text-muted">Phnom Penh, Cambodia</span>
        <span className="absolute bottom-8 left-6 text-[15px] italic text-muted">Full‑stack Software Engineer</span>
        <span className="absolute bottom-5 right-6 text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold italic leading-none tabular-nums text-ink">
          {String(count).padStart(3, "0")}
        </span>
      </motion.div>

      <motion.div
        className={`absolute bottom-28 left-0 h-0.5 w-[85.714%] bg-[linear-gradient(90deg,#3B2BC4,#B04EC9)] ${
          splitting ? "origin-right" : "origin-left"
        }`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: splitting ? 0 : count / 100 }}
        transition={{ duration: splitting ? 0.25 : 0 }}
      />
    </div>
  );
}
