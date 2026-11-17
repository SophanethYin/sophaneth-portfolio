// Shared blueprint pieces: section shell, sheet label row, browser frame, button styles and motion helpers.
import { Fragment } from "react";

/** Inline style for a draw-* element: start `s` seconds after its group is reached, optional duration. */
export const at = (s: number, dur?: number) =>
  ({ "--d": `${s}s`, ...(dur ? { "--dur": `${dur}s` } : {}) }) as React.CSSProperties;

/** A heading part: plain words, or [words, className] for coloured or outlined words. */
export type Part = string | [text: string, className: string];

/** Heading words, each rising out of its own slot, `step` seconds apart from `start`. */
export function rise(parts: Part[], start = 0.15, step = 0.05): React.ReactNode {
  const words = parts.flatMap((p) => {
    const [text, cls] = typeof p === "string" ? [p, ""] : p;
    return text.split(" ").map((w) => [w, cls] as const);
  });
  return words.map(([w, cls], k) => (
    <Fragment key={k}>
      {k > 0 && " "}
      <span className="slot">
        <span className={`draw-rise inline-block ${cls}`} style={at(start + k * step)}>
          {w}
        </span>
      </span>
    </Fragment>
  ));
}

/** Mono uppercase label text. Add a size class. */
export const mono = "font-mono uppercase tracking-[var(--tr,.1em)]"; // override spacing with [--tr:.08em]

/** Red primary button with the pressed shadow. */
export const btnRed = `press inline-block bg-red ${mono} font-semibold leading-none text-paper no-underline hover:text-paper`;

/** Standard button padding and size; pair with btnRed. */
export const btnPad = "px-[26px] py-4 text-sm";

/** Big uppercase display heading used by most sections. */
export const h2 = "m-0 font-display text-[clamp(44px,5.6vw,76px)] font-bold uppercase leading-[.95]";

export function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-[60px] border-t-[1.5px] border-ink pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-[72px] ${className}`}
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8">{children}</div>
    </section>
  );
}

/** "SHEET 02 / ABOUT ———— SCALE 1 : 1" row that opens every section. */
export function Sheet({
  left,
  right,
  className = "mb-10",
  delay = 0,
}: {
  left: string;
  right?: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      data-draw
      className={`flex items-center gap-3.5 ${mono} text-[10px] font-medium leading-none text-muted sm:text-[11px] lg:text-xs ${className}`}
    >
      <span className="draw-wipe" style={at(delay)}>
        {left}
      </span>
      <span className="draw-x h-px flex-1 origin-left bg-line2" style={at(delay + 0.05, 0.8)} />
      {right && (
        <span className="draw-wipe-l flex items-center gap-3.5" style={at(delay + 0.65)}>
          {right}
        </span>
      )}
    </div>
  );
}

const dot = <span className="size-[9px] rounded-full border-[1.5px] border-ink" />;

/** Browser chrome: three outlined dots and the address, over the content. */
export function Browser({
  url,
  extra,
  className = "",
  children,
}: {
  url: string;
  extra?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border-[1.5px] border-ink ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-ink px-3 py-2.5 font-mono text-[11px] leading-none tracking-[.06em] text-muted">
        <span className="flex min-w-0 items-center gap-2">
          {dot}
          {dot}
          {dot}
          <span className="ml-1.5 truncate">{url}</span>
        </span>
        {extra}
      </div>
      {children}
    </div>
  );
}

/**
 * A screenshot filling a 16:10 frame. Not lazy-loaded: every Shot sits inside a wipe, and a lazy picture in a box
 * that is still wiped shut counts as off screen, so it was only fetched after the wipe had shown an empty frame.
 */
export function Shot({ src, alt, fit = "cover" }: { src: string; alt: string; fit?: "cover" | "contain" }) {
  return (
    <div className="aspect-[16/10] overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`size-full ${fit === "cover" ? "object-cover object-left-top" : "object-contain"}`}
      />
    </div>
  );
}
