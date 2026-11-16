"use client";

import { useEffect, useState } from "react";
import { base, nav } from "@/lib/data";
import { mono } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(nav[0].href);
  const [cyan, setCyan] = useState(false);

  // Scroll-spy: the section crossing a line 30% down the screen is the active link.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-30% 0px -69% 0px" },
    );
    nav.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) io.observe(el);
    });
    setCyan(document.documentElement.dataset.theme === "cyanotype");
    return () => io.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = cyan ? "paper" : "cyanotype";
    document.documentElement.dataset.theme = next;
    setCyan(!cyan);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const links = (menu: boolean) =>
    nav.map((n, i) => (
      <a
        key={n.href}
        href={n.href}
        onClick={() => setOpen(false)}
        aria-current={active === n.href ? "true" : undefined}
        // Menu rows drop in one after another on open, and lift out together on close.
        style={menu ? { transitionDelay: open ? `${60 + i * 35}ms` : "0ms" } : undefined}
        // Underlined as well as red: colour alone can't mark the current section (WCAG 1.4.1).
        className={`flex items-center ${active === n.href ? "text-red underline decoration-2 underline-offset-4" : "no-underline"} ${
          menu
            ? `min-h-12 border-b border-dashed border-line2 transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`
            : ""
        }`}
      >
        {pad(i + 1)} {n.label}
      </a>
    ));

  const hire = (
    <a
      href="#contact"
      onClick={() => setOpen(false)}
      className="bg-red px-[18px] py-3 font-semibold text-paper no-underline transition-colors hover:bg-ink hover:text-paper"
    >
      Hire me
    </a>
  );

  const square = `grid min-h-11 min-w-11 cursor-pointer place-items-center border-[1.5px] border-ink bg-card px-3.5 text-ink ${mono} text-xs font-semibold`;

  return (
    <header className="sticky top-0 z-20 border-b-[1.5px] border-ink bg-paper">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-x-6 px-5 py-3.5 sm:px-8">
        <a
          href="#home"
          className="flex items-center gap-3 font-display text-[28px] font-bold uppercase leading-none tracking-[.04em] text-ink no-underline"
        >
          <img src={`${base}/logo.svg`} alt="" width={36} height={36} className="size-9" />
          Sophaneth<span className="text-red">.</span>
        </a>

        <div className="flex items-center gap-[22px]">
          <nav aria-label="Main" className={`hidden items-center gap-[22px] ${mono} text-xs font-medium [--tr:.08em] lg:flex`}>
            {links(false)}
            {hire}
          </nav>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={cyan ? "Switch to paper theme" : "Switch to cyanotype theme"}
              title={cyan ? "Paper theme" : "Cyanotype theme"}
              className={square}
            >
              <span aria-hidden className="size-3.5 rounded-full border-[1.5px] border-ink bg-[linear-gradient(90deg,var(--ink)_50%,transparent_50%)]" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              className={`${square} lg:hidden`}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Always mounted so it can slide shut: the row's height eases between 0fr and 1fr. */}
        <div
          inert={!open}
          className={`grid w-full transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none lg:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav
            aria-label="Main"
            className={`flex min-h-0 flex-col overflow-hidden ${mono} text-xs font-medium [--tr:.08em] [&>a:last-child]:mt-3 [&>a:last-child]:text-center`}
          >
            <span className="h-3 flex-none" />
            {links(true)}
            {hire}
          </nav>
        </div>
      </div>
    </header>
  );
}
