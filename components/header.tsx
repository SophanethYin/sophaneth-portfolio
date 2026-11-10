"use client";

import { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { nav } from "@/lib/data";
import { IntroContext } from "./intro";
import { CoralButton } from "./ui";

export function Header() {
  const revealed = useContext(IntroContext);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(nav[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the last section whose top has passed the middle of the screen (the last one at the page bottom).
  // Sections are looked up on every check, so a re-rendered section is never missed, and strips without
  // a nav link (like the stats band) keep the section above them highlighted.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = nav[0].href;
      for (const l of nav) {
        const el = document.querySelector(l.href);
        if (el && (atBottom || el.getBoundingClientRect().top <= mid)) current = l.href;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "bg-white/70 shadow-[0_10px_30px_-20px_rgba(42,28,158,.35)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 px-[22px] sm:px-11 lg:px-16 transition-[padding] duration-300 ${
          scrolled ? "py-3" : "py-4 md:py-6"
        }`}
      >
        <a href="#home" className="flex items-baseline gap-0.5 text-2xl font-bold italic tracking-[-0.02em] text-ink">
          Sophaneth<span className="text-coral">.</span>
        </a>
        <div className="flex-1" />
        <nav className="order-last -my-3 flex w-full gap-5 overflow-x-auto text-sm italic md:order-none md:w-auto md:gap-7 md:text-[15px]">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href ? "true" : undefined}
              // Vertical padding (cancelled by the nav's negative margin) gives a finger-sized tap area without moving the layout.
              className={`whitespace-nowrap py-3 ${active === l.href ? "text-coral" : "text-ink-soft"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <CoralButton href="#contact" className="px-[22px] py-[11px] text-[15px]">
          Hire Me
        </CoralButton>
      </div>
    </motion.header>
  );
}
