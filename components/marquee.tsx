"use client";

import { motion } from "motion/react";
import { marqueeWords } from "@/lib/data";

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="flex flex-none items-center gap-12 pr-12">
      {marqueeWords.map((w, i) => (
        <span key={w} className="flex items-center gap-12">
          <span
            className={`whitespace-nowrap text-[clamp(48px,7vw,96px)] font-extrabold italic leading-[1.1] ${
              i % 2 ? "text-ink" : "text-clip bg-[linear-gradient(90deg,#3B2BC4,#B04EC9)] pr-[.08em]"
            }`}
          >
            {w}
          </span>
          <span className="text-[32px] text-coral">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden pb-6 pt-2">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        <Run />
        <Run hidden />
      </motion.div>
    </div>
  );
}
