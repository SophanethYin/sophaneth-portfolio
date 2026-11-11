"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { nav } from "@/lib/data";
import { IntroContext } from "./intro";
import { CoralButton } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;
const sweep = [0.76, 0, 0.24, 1] as const;

// Menu button: three bars. The outer two swing into an X; the middle one shrinks away.
const bar = "absolute left-3 h-0.5 w-5 rounded-full bg-ink";
const swing = { type: "spring", stiffness: 320, damping: 24 } as const;

// Menu links rise out from behind their divider lines, one after another.
// On close they drop back in reverse order, faster.
const list: Variants = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const rise: Variants = {
  open: { y: 0, opacity: 1, transition: { duration: 0.6, ease } },
  closed: { y: "110%", opacity: 0, transition: { duration: 0.25 } },
};

/**
 * Laptop and up: logo, links and "Hire me" in one row.
 * Phone and tablet: logo and a menu button. The menu is a full-screen sheet that grows as a circle out of the button.
 */
export function Header() {
  const revealed = useContext(IntroContext);
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(nav[0].href);
  const [open, setOpen] = useState(false);
  // Where the circle grows from (the button's centre) and how far it must reach to cover the screen.
  const [spot, setSpot] = useState({ at: "100% 0%", reach: 0 });
  const button = useRef<HTMLButtonElement>(null);

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

  // While the menu is open: Escape closes it, the page behind can't scroll, and Tab can't reach it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const sections = document.querySelectorAll<HTMLElement>("main > section");
    sections.forEach((s) => (s.inert = true));
    lenis?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      sections.forEach((s) => (s.inert = false));
      lenis?.start();
    };
  }, [open, lenis]);

  const toggle = () => {
    const r = button.current?.getBoundingClientRect();
    if (r) setSpot({ at: `${r.left + r.width / 2}px ${r.top + r.height / 2}px`, reach: Math.hypot(innerWidth, innerHeight) });
    setOpen(!open);
  };
  const tone = (href: string, idle: string) => (active === href ? "text-coral" : idle);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.6, delay: 0.5, ease }}
        // The bar goes clear while the menu is open, so the sheet shows through behind the logo and the X.
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled && !open
            ? "bg-white/90 shadow-[0_10px_30px_-20px_rgba(42,28,158,.35)] backdrop-blur-xl lg:bg-white/70"
            : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center gap-x-6 px-[22px] sm:px-11 lg:px-16 transition-[padding] duration-300 ${
            scrolled ? "py-2 lg:py-3" : "py-2.5 lg:py-6"
          }`}
        >
          <a href="#home" className="flex items-baseline gap-0.5 text-2xl font-bold italic tracking-[-0.02em] text-ink">
            Sophaneth<span className="text-coral">.</span>
          </a>
          <div className="flex-1" />
          <nav className="-my-3 hidden gap-7 text-[15px] italic lg:flex">
            {nav.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={`whitespace-nowrap py-3 ${tone(l.href, "text-ink-soft")}`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <CoralButton href="#contact" className="px-[22px] py-[11px] text-[15px] max-lg:hidden">
            Hire me
          </CoralButton>
          <button
            ref={button}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative -mr-2.5 size-11 shrink-0 cursor-pointer rounded-full lg:hidden"
          >
            <motion.span className={`${bar} top-[15px]`} animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }} transition={swing} />
            <motion.span className={`${bar} top-[21px]`} animate={open ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }} transition={{ duration: 0.2 }} />
            <motion.span className={`${bar} top-[27px]`} animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }} transition={swing} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Site menu"
            data-lenis-prevent
            // Any link inside closes the menu. Scrolling is switched back on first, so the jump to the section works.
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest("a")) return;
              lenis?.start();
              setOpen(false);
            }}
            initial={{ clipPath: `circle(0px at ${spot.at})` }}
            animate={{ clipPath: `circle(${spot.reach}px at ${spot.at})`, transition: { duration: 0.7, ease: sweep } }}
            exit={{ clipPath: `circle(0px at ${spot.at})`, transition: { duration: 0.45, ease: sweep, delay: 0.1 } }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-hero px-[22px] pb-8 pt-[84px] sm:px-11 lg:hidden"
          >
            <motion.nav variants={list} initial="closed" animate="open" exit="closed" className="my-auto flex flex-col">
              {nav.map((l) => (
                // The clipped wrapper is what the link rises out from behind.
                <div key={l.href} className="overflow-hidden border-b border-ink/10">
                  <motion.a
                    variants={rise}
                    href={l.href}
                    aria-current={active === l.href ? "true" : undefined}
                    className={`block py-3 text-[clamp(30px,9vw,44px)] font-extrabold italic leading-[1.15] tracking-[-0.02em] ${tone(l.href, "text-ink")}`}
                  >
                    {l.label}
                  </motion.a>
                </div>
              ))}
              <motion.div variants={rise} className="mt-7">
                <CoralButton href="#contact" className="w-full justify-center px-[22px] py-4 text-base">
                  Hire me
                </CoralButton>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
