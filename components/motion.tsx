"use client";

import { useEffect } from "react";

/** final with every number scaled by e, keeping its decimals: ("3.65", .5) → "1.83", ("10–20", .5) → "5–10". */
const countText = (final: string, e: number) =>
  final.replace(/\d+(?:\.\d+)?/g, (n) => (parseFloat(n) * e).toFixed(n.split(".")[1]?.length ?? 0));

/** Count every [data-count] in (or at) a group up from 0 over 0.6 s, after the element's own --d. */
function countUp(group: Element) {
  const els = [...(group.matches("[data-count]") ? [group] : []), ...group.querySelectorAll("[data-count]")];
  els.forEach((el) => {
    const final = el.textContent ?? "";
    const delay = (parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0) * 1000;
    el.textContent = countText(final, 0);
    const t0 = performance.now() + delay;
    requestAnimationFrame(function tick(now) {
      const u = Math.min(1, Math.max(0, (now - t0) / 600));
      el.textContent = u < 1 ? countText(final, 1 - (1 - u) ** 3) : final;
      if (u < 1) requestAnimationFrame(tick);
    });
  });
}

/**
 * Turns on the Drafted motion (spec §6.0): adds html.motion, waits for the intro to hand over
 * (html.intro-done), then marks each [data-draw] group with data-in the first time it reaches the screen.
 * Renders nothing. Reduced-motion visitors get no class, so nothing is ever hidden for them.
 */
export function Motion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // JavaScript that arrives after the intro's 4 s CSS failsafe finds a page the visitor is already reading:
    // hiding it to draw it again would make them wait, so stay still.
    if (performance.now() > 3500) return;
    const html = document.documentElement;
    html.classList.add("motion");

    // A group is reached once its box is on screen above a line 88% down. Measured with getBoundingClientRect,
    // not IntersectionObserver: Chrome's observer applies the group's own clip-path, so a fully wiped-out group
    // crossing the top edge never "intersects" and would stay hidden.
    let pending: Element[] = [];
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = innerHeight * 0.88;
      pending = pending.filter((el) => {
        const r = el.getBoundingClientRect();
        // Reached: top above the 88% line, or fully on screen (the footer at the bottom of a tall page never
        // gets above that line).
        if ((r.top >= line && r.bottom > innerHeight) || r.bottom <= 0) return true;
        el.setAttribute("data-in", "");
        countUp(el);
        return false;
      });
      if (!pending.length) stop();
    };
    const onScroll = () => (raf ||= requestAnimationFrame(check));
    const stop = () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
    const start = () => {
      pending = [...document.querySelectorAll("[data-draw]")];
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
      check();
    };

    // The intro adds intro-done as its columns fly away; this fallback covers an intro that never ran.
    const fallback = setTimeout(() => html.classList.add("intro-done"), 4500);
    const mo = new MutationObserver(() => {
      if (!html.classList.contains("intro-done")) return;
      mo.disconnect();
      clearTimeout(fallback);
      start();
    });
    if (html.classList.contains("intro-done")) {
      clearTimeout(fallback);
      start();
    } else mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      clearTimeout(fallback);
      stop();
    };
  }, []);
  return null;
}
