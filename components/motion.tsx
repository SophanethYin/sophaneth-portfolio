"use client";

import { useEffect, useSyncExternalStore } from "react";

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
    // A lazy image loads once it nears the screen, but a group clipped out by html.motion counts as off screen, so its
    // picture would only be fetched as its wipe uncovered it and would pop in late. Fetch them now, behind the intro.
    document.querySelectorAll<HTMLImageElement>("[data-draw] img[loading=lazy]").forEach((img) => (img.loading = "eager"));

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

// ---- Pause (WCAG 2.2.2) -----------------------------------------------------------
// html[data-still] pauses the looping motion: the hero typewriter and the toolkit orbit.

const watchStill = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-still"] });
  return () => mo.disconnect();
};

/** True while the visitor has paused the looping motion. */
export const useStill = () =>
  useSyncExternalStore(watchStill, () => document.documentElement.hasAttribute("data-still"), () => false);

/** Pauses or plays all looping motion, wherever it sits. Hidden with reduced motion, where nothing loops. */
export function MotionToggle() {
  const still = useStill();
  return (
    <button
      type="button"
      onClick={() => document.documentElement.toggleAttribute("data-still")}
      // -my/py: a 24px tap target that doesn't make the label row taller
      className="-my-1.5 inline-flex cursor-pointer items-center gap-1.5 py-1.5 uppercase hover:text-red motion-reduce:hidden"
    >
      <svg aria-hidden viewBox="0 0 10 10" className="size-2 flex-none" fill="currentColor">
        <path d={still ? "M2 1l7 4-7 4z" : "M1.5 1H4v8H1.5zM6 1h2.5v8H6z"} />
      </svg>
      {still ? "Play animation" : "Pause animation"}
    </button>
  );
}
