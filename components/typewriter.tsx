"use client";

import { useEffect, useState } from "react";
import { roles } from "@/lib/data";

/** Types each [muted lead, highlighted rest] item, holds it, deletes it, then moves to the next, looping forever. */
export function Typewriter({ items = roles }: { items?: [string, string][] }) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const [lead, rest] = items[index];
  const full = lead + rest;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(full.length);
      return;
    }
    let delay = deleting ? 35 : 75;
    if (!deleting && typed === full.length) delay = 1800; // hold the finished title
    if (deleting && typed === 0) delay = 350; // short pause before the next one

    const t = setTimeout(() => {
      if (!deleting && typed === full.length) setDeleting(true);
      else if (deleting && typed === 0) {
        setDeleting(false);
        setIndex((index + 1) % items.length);
      } else setTyped(typed + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [typed, deleting, index, full.length, items.length]);

  return (
    <>
      <span className="sr-only">{items.map((r) => r.join("")).join(", ")}</span>
      <span aria-hidden="true">
        {lead.slice(0, typed)}
        <span className="text-iris-deep">{rest.slice(0, Math.max(0, typed - lead.length))}</span>
        <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] animate-pulse rounded-full bg-coral" />
      </span>
    </>
  );
}
