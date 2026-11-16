"use client";

import { useEffect, useState } from "react";

/**
 * Shows items[0] in full (so the server render and the hero's wipe-in have text), then after `wait` ms deletes it,
 * types the next item, holds it, and loops. Reduced motion keeps items[0] still.
 */
export function Typewriter({ items, wait = 3000 }: { items: string[]; wait?: number }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(items[0].length);
  const [del, setDel] = useState(false);
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setGo(true), wait);
    return () => clearTimeout(t);
  }, [wait]);

  useEffect(() => {
    if (!go) return;
    const full = items[i].length;
    const hold = !del && n === full;
    const t = setTimeout(
      () => {
        if (hold) setDel(true);
        else if (del && n === 0) {
          setDel(false);
          setI((i + 1) % items.length);
        } else setN(n + (del ? -1 : 1));
      },
      hold ? 2200 : del && n === 0 ? 300 : del ? 35 : 70,
    );
    return () => clearTimeout(t);
  }, [go, n, del, i, items]);

  return (
    <>
      <span className="sr-only">{items.join(", ")}</span>
      <span aria-hidden="true">
        {items[i].slice(0, n)}
        <span className="ml-1 inline-block h-[.9em] w-[3px] translate-y-[.1em] animate-pulse bg-red" />
      </span>
    </>
  );
}
