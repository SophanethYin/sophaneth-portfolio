"use client";

import { useContext } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { base, profile } from "@/lib/data";
import { IntroContext } from "./intro";
import { Typewriter } from "./typewriter";
import { CoralButton } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

// Replays every time the hero scrolls back into view.
const inView = { once: false, amount: 0.3 } as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const socials = [
  { href: profile.github, label: "GH", title: "GitHub" },
  { href: `tel:${profile.phone}`, label: "TG", title: "Telegram" },
  { href: `mailto:${profile.email}`, label: "@", title: "Email" },
];

export function Hero() {
  const revealed = useContext(IntroContext);
  return (
    <section id="home" className="relative overflow-hidden bg-hero pb-[clamp(48px,6vw,96px)] pt-[108px] md:pt-[89px]">
      <div className="pointer-events-none absolute -right-[120px] -top-[160px] size-[520px] rounded-full border-[1.5px] border-white/90" />
      <div className="pointer-events-none absolute -bottom-[260px] -left-[200px] size-[520px] rounded-full border-[1.5px] border-white/90" />

      {/* Remounts when the intro lifts so the entrance plays in view, not behind the curtain. */}
      <div key={String(revealed)} className="relative z-2 mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-12 px-6 pt-[clamp(24px,4vw,56px)]">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={inView} className="flex flex-col gap-[18px]">
          <motion.span variants={rise} className="text-[clamp(28px,3vw,40px)] font-bold italic text-faint">
            Hi! I&apos;m
          </motion.span>
          <motion.h1
            variants={rise}
            className="m-0 flex flex-wrap gap-x-[.25em] text-[clamp(56px,7.4vw,104px)] font-extrabold italic leading-[.95] tracking-[-0.02em]"
          >
            <span className="text-clip bg-[linear-gradient(90deg,#4B2BC4,#7A3FD1_60%,#B04EC9)] pr-[.05em]">Yin</span>
            <span className="relative inline-block pr-[.05em]">
              <span className="text-plum [-webkit-text-stroke:4px_#7A3FD1]">Sophaneth</span>
              <span aria-hidden="true" className="absolute left-0 top-0 text-[#FBEEF4]">
                Sophaneth
              </span>
            </span>
          </motion.h1>
          <motion.span variants={rise} className="text-[clamp(22px,2.4vw,30px)] font-bold italic text-faint">
            <Typewriter />
          </motion.span>
          <motion.p variants={rise} className="m-0 max-w-[480px] text-pretty text-[17px] italic leading-[1.65] text-muted">
            I build business software end to end, from the database to the dashboard. Right now I&apos;m the solo
            engineer behind <strong className="font-semibold text-ink">Samai Flow</strong>, the ERP that runs sales,
            stock and accounting at Samai Distillery in{" "}
            <strong className="font-semibold text-ink">Phnom Penh, Cambodia</strong>.
          </motion.p>
          <motion.div variants={rise} className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                title={s.title}
                className="flex size-10 items-center justify-center rounded-full border border-white bg-white/70 text-xs font-semibold text-iris transition-colors hover:bg-iris hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </motion.div>
          <motion.div variants={rise} className="mt-3 flex flex-wrap items-center gap-7">
            <CoralButton href={profile.cvUrl} download="Yin-Sophaneth-CV.pdf" className="px-[30px] py-4 text-base">
              Download CV
            </CoralButton>
            <a
              href="#contact"
              className="-my-3 py-3 text-lg font-semibold italic text-iris-deep underline underline-offset-[5px] hover:text-coral"
            >
              Let&apos;s Talk
            </a>
          </motion.div>
        </motion.div>

        <div className="relative flex min-h-[520px] items-end justify-center">
          <motion.div
            initial={{ opacity: 0, scaleY: 0.85 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={inView}
            transition={{ duration: 1, ease }}
            style={{ originY: 1 }}
            className="absolute bottom-0 h-[92%] w-[min(400px,86%)] rounded-t-[220px] border border-white/95 bg-[linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.25))]"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="relative mb-5 aspect-[3/4] w-[min(360px,78%)] overflow-hidden rounded-[200px_200px_24px_24px] shadow-[0_40px_60px_-30px_rgba(42,28,158,.35)]"
          >
            <Image src={`${base}/portrait.jpg`} alt="Portrait of Yin Sophaneth" fill priority sizes="360px" className="object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inView}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="absolute right-[2%] top-[16%] z-3"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              className="flex items-center gap-2.5 rounded-xl border border-white bg-white/80 px-[18px] py-3 shadow-float backdrop-blur-[14px]"
            >
              <span className="text-3xl font-bold italic text-iris-deep">3+</span>
              <span className="flex flex-col text-[13px] italic leading-[1.2] text-muted">
                Years<span>Experience</span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inView}
            transition={{ duration: 0.6, delay: 0.85, ease }}
            className="absolute bottom-[22%] left-0 z-3"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
              className="flex flex-col gap-0.5 rounded-xl border border-white bg-white/80 px-[18px] py-3 shadow-float backdrop-blur-[14px]"
            >
              <span className="text-[22px] font-bold italic text-coral">3.65</span>
              <span className="text-xs italic text-muted">GPA · NUM</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
