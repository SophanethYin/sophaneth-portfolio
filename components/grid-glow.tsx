"use client";

import { useEffect, useRef } from "react";

const R = 300; // lamp radius; .grid-glow in globals.css is 2R wide
const CELL = 100; // the major grid (5 cells); the lamp's grid sheet is one CELL wider than the lamp

/**
 * A lamp over the drawing: near the mouse the sheet's grid lines darken to full ink and fade back into the paper.
 * A small round window follows the mouse, behind the content (cards and panels cover it). Inside it, a slightly
 * larger sheet of grid slides the other way, so its lines stay exactly on the page's own grid. Both only ever move
 * by transform, so the browser slides two ready-made layers and never redraws them.
 * Mouse and trackpad only; touch screens never see it.
 */
export function GridGlow() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const g = el.current!;
    const sheet = g.firstElementChild as HTMLElement;
    let x = 0,
      y = 0,
      raf = 0;
    const back = (n: number) => -(((n % CELL) + CELL) % CELL); // slide the sheet back to the last grid line
    const paint = () => {
      raf = 0;
      const left = Math.round(x) - R,
        top = Math.round(y) - R;
      g.style.transform = `translate(${left}px,${top}px)`;
      // The page grid starts at the top left of the document and repeats every CELL, so this lines up.
      sheet.style.transform = `translate(${back(left)}px,${back(top + Math.round(scrollY))}px)`;
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

  return (
    <div ref={el} aria-hidden className="grid-glow">
      <div />
    </div>
  );
}
