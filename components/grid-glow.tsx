"use client";

import { useEffect, useRef } from "react";

/**
 * A lamp over the drawing: near the mouse the sheet's grid lines darken to full ink and fade back into the paper.
 * One fixed, viewport-sized layer behind the content (cards and panels cover it), its grid shifted with the scroll
 * so it sits exactly on the page's own grid. Mouse and trackpad only; touch screens never see it.
 */
export function GridGlow() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const g = el.current!;
    let x = 0,
      y = 0,
      raf = 0;
    const paint = () => {
      raf = 0;
      g.style.setProperty("--mx", `${x}px`);
      g.style.setProperty("--my", `${y}px`);
      // The page grid starts at the top of the document and repeats every 100px (5 cells), so this lines up.
      g.style.backgroundPositionY = `${-(scrollY % 100)}px`;
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      g.dataset.on = "";
      raf ||= requestAnimationFrame(paint);
    };
    const onScroll = () => (raf ||= requestAnimationFrame(paint));
    const leave = () => delete g.dataset.on;
    addEventListener("pointermove", move, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={el} aria-hidden className="grid-glow" />;
}
