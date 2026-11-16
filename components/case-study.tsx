"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";
import { Browser, at, btnRed, mono, rise } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");
const label = `${mono} text-xs font-semibold leading-none [--tr:.12em] text-red`;
const h3 = "m-0 font-display text-[clamp(40px,4.6vw,60px)] font-bold uppercase leading-[.95]";
const chip = "border px-[9px] py-[7px]";

/**
 * Full-screen case study drawn as a second sheet. Native <dialog> gives Esc, focus trapping and the top layer.
 * Closes with ✕, Esc or "Back to portfolio"; ←/→ page through the screenshots.
 */
export function CaseStudy({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const n = p.gallery.length;
  const go = (d: number) => setI((k) => (k + d + n) % n);
  const sheet = `03-${String.fromCharCode(64 + Number(p.number))}`; // project 01 → 03-A

  useEffect(() => {
    dialog.current?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // The sheet scrolls inside the dialog, not the window, so it reveals its own [data-draw] groups: each draws the
  // first time it reaches the same 88% line the page uses (or is fully on screen).
  useEffect(() => {
    const d = dialog.current!;
    const groups = [...d.querySelectorAll<HTMLElement>("[data-draw]")];
    let opened = false;
    const check = () =>
      groups.forEach((g) => {
        if (g.hasAttribute("data-in")) return;
        const r = g.getBoundingClientRect();
        if (r.top >= innerHeight * 0.88 && r.bottom > innerHeight) return;
        // Delays are timed to follow the unroll. A group scrolled to later shifts them all by its earliest one
        // (--late), so it starts drawing at once and keeps its stagger.
        if (opened) {
          const ds = [g, ...g.querySelectorAll("*")]
            .filter((e) => e.className.toString().includes("draw-"))
            .map((e) => parseFloat(getComputedStyle(e).getPropertyValue("--d")) || 0);
          if (ds.length) g.style.setProperty("--late", `${Math.min(...ds)}s`);
        }
        g.setAttribute("data-in", "");
      });
    check();
    opened = true;
    d.addEventListener("scroll", check, { passive: true });
    return () => d.removeEventListener("scroll", check);
  }, []);

  // Closing plays the exit animation first; the dialog really closes when the overlay's fade ends.
  const [closing, setClosing] = useState(false);
  const toContactAfter = useRef(false);
  const close = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) dialog.current?.close();
    else setClosing(true);
  };
  const finish = () => {
    onClose();
    if (toContactAfter.current)
      setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 30);
  };
  const toContact = () => {
    toContactAfter.current = true;
    close();
  };

  const parts = [...p.builtWith.front, ...p.builtWith.back, ...p.builtWith.ops].length;

  return (
    <dialog
      ref={dialog}
      aria-label={`${p.name.join("")} case study`}
      onClose={finish}
      onCancel={(e) => {
        e.preventDefault(); // Esc: animate out instead of vanishing
        close();
      }}
      onAnimationEnd={(e) => {
        // Child wipes and the backdrop fade also end animations; only the roll-up closes.
        if (closing && e.target === e.currentTarget && e.animationName === "cs-rollup") dialog.current?.close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      data-closing={closing || undefined}
      className="cs-overlay fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-transparent p-0 text-ink backdrop:bg-[rgba(14,30,80,.72)] sm:p-5 lg:px-4 lg:py-6"
    >
      <div className="cs-sheet bg-grid mx-auto max-w-[1480px] border-[1.5px] border-ink bg-paper shadow-[12px_12px_0_rgba(0,0,0,.25)]">
        <div
          className={`sticky top-0 z-[3] flex items-stretch justify-between border-b-[1.5px] border-ink bg-paper sm:-top-5 lg:-top-6 ${mono} text-[11px] font-medium leading-none`}
        >
          <div className="flex flex-wrap items-center gap-3.5 px-5 py-3.5 text-muted">
            <span className="text-red">Case study</span>
            <span>Sheet {sheet}</span>
            <span>
              Project {p.number} — {p.name.join("")}
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close case study"
            className="w-14 flex-none cursor-pointer border-0 border-l-[1.5px] border-ink bg-card font-mono text-[22px] text-ink transition-colors hover:bg-red hover:text-paper"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap items-start">
          {/* One scroll for the whole sheet: the side panel scrolls with the page, no scroll bar of its own. */}
          {/* Each block is its own group, so on phones the lower ones wait until scrolled to. */}
          <aside className="box-border flex max-w-full flex-[1_1_420px] flex-col gap-8 px-5 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
            <div data-draw>
              <div className={`${mono} text-xs font-medium leading-none [--tr:.12em] text-muted`}>Project {p.number}</div>
              <h2 className="mb-0 mt-3.5 font-display text-[clamp(72px,8vw,112px)] font-bold uppercase leading-[.84]">
                <span className="slot block">
                  <span className="draw-rise inline-block [--d:.55s]">{p.name[0]}</span>
                </span>
                <span className="slot block">
                  <span className="draw-rise outline-text inline-block [--d:.62s]">{p.name[1]}</span>
                </span>
              </h2>
              <div className="draw-wipe mt-4 flex items-center [--d:.7s] gap-2.5 font-display text-xl font-semibold uppercase leading-[1.2] tracking-[.05em]">
                <span className="h-0.5 w-7 flex-none bg-red" />
                {p.tagline}
              </div>
            </div>

            <dl data-draw className="m-0 border-[1.5px] border-ink bg-card">
              <div
                className={`draw-wipe border-b-[1.5px] border-ink bg-ink px-3 py-2 text-paper ${mono} text-[11px] font-semibold leading-none [--d:.62s] [--tr:.12em]`}
              >
                Title block
              </div>
              {p.facts.map((f, k) => (
                <div key={f.k} className="draw-wipe grid grid-cols-[96px_minmax(0,1fr)] border-b border-line2 last:border-0" style={at(0.69 + k * 0.07)}>
                  <dt className={`border-r border-line2 p-3 ${mono} text-[11px] font-medium leading-[1.3] text-muted`}>{f.k}</dt>
                  <dd className="m-0 flex items-center gap-2 p-3 text-base font-semibold leading-[1.3]">
                    {f.k === "Status" && <span className="size-2 flex-none rounded-full bg-ok" />}
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div data-draw>
              <div className={`draw-wipe ${label}`} style={at(0.95)}>
                My role
              </div>
              <p className="draw-wipe mb-0 mt-3 text-pretty text-[17px] leading-[1.65] text-muted" style={at(1, 0.7)}>
                {p.role}
              </p>
            </div>

            <div data-draw>
              <div className={`draw-wipe ${label}`} style={at(1.1)}>
                Built with · {parts} parts
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-xs font-medium leading-none tracking-[.04em]">
                {[
                  ...p.builtWith.front.map((t) => [t, "border-ink bg-card"]),
                  ...p.builtWith.back.map((t) => [t, "border-ink bg-panel text-cream"]),
                  ...p.builtWith.ops.map((t) => [t, "border-dashed border-ink"]),
                ].map(([t, cls], k) => (
                  <span key={t} className={`draw-dot ${chip} ${cls}`} style={at(1.15 + k * 0.025)}>
                    {t}
                  </span>
                ))}
              </div>
              <div className={`draw-fade mt-3 flex flex-wrap gap-3.5 ${mono} text-[10px] font-medium leading-none text-muted`} style={at(1.2 + parts * 0.025)}>
                <span>□ Front-end</span>
                <span>■ Back-end</span>
                <span>┄ Ops &amp; tests</span>
              </div>
            </div>
          </aside>

          <div className="box-border min-w-0 flex-[999_1_560px] border-l-[1.5px] border-ink bg-card px-5 pb-10 pt-7 sm:px-7 sm:pb-12 sm:pt-9 lg:px-9 lg:pb-14 lg:pt-10">
            <div data-draw>
            <div className={label}>00 — Overview</div>
            <p className="draw-wipe mb-0 mt-4 max-w-[820px] text-pretty text-[clamp(22px,2.4vw,30px)] leading-[1.45] [--d:.9s] [--dur:.7s]">
              {p.overview.split("**").map((t, k) =>
                k % 2 ? (
                  <strong key={k} className="font-semibold shadow-[inset_0_-8px_0_rgba(198,61,23,.18)]">
                    {t}
                  </strong>
                ) : (
                  t
                ),
              )}
            </p>

            {/* Gallery */}
            <Browser
              url={p.url}
              className="draw-wipe mt-10 bg-paper [--d:1s]"
              extra={
                <span className="flex-none">
                  FIG. {pad(i + 1)} / {pad(n)}
                </span>
              }
            >
              <div className="aspect-[16/10]">
                <img key={i} src={p.gallery[i].src} alt={p.gallery[i].caption} className="cs-shot size-full object-contain" />
              </div>
              <div className="grid grid-cols-[56px_minmax(0,1fr)_56px] border-t-[1.5px] border-ink">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous screenshot"
                  className="min-h-14 cursor-pointer border-0 border-r-[1.5px] border-ink bg-card font-mono text-xl text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  ←
                </button>
                <div className="flex min-w-0 items-center gap-3.5 px-4 py-2.5" aria-live="polite">
                  <span className="font-display text-[32px] font-bold leading-none text-red">{pad(i + 1)}</span>
                  <span className="text-base leading-[1.35]">{p.gallery[i].caption}</span>
                </div>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next screenshot"
                  className="min-h-14 cursor-pointer border-0 border-l-[1.5px] border-ink bg-red font-mono text-xl text-paper transition-colors hover:bg-ink"
                >
                  →
                </button>
              </div>
            </Browser>
            </div>

            <div data-draw className="draw-wipe mt-[18px] border-[1.5px] border-ink" style={at(1.1)}>
              <div
                className={`draw-wipe border-b-[1.5px] border-ink px-3 py-2 ${mono} text-[11px] font-semibold leading-none [--tr:.12em] text-muted`}
                style={at(1.2)}
              >
                Drawing index · use ← → keys
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                {p.gallery.map((g, k) => (
                  <button
                    key={g.src}
                    type="button"
                    onClick={() => setI(k)}
                    aria-current={k === i}
                    style={at(1.3 + k * 0.04)}
                    className={`draw-wipe flex min-h-11 cursor-pointer items-baseline gap-2.5 border-0 border-b border-r border-dashed border-line2 px-3 py-2.5 text-left text-sm leading-[1.3] ${
                      k === i ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-paper"
                    }`}
                  >
                    <span className={`font-mono text-[11px] font-semibold leading-none ${k === i ? "text-red" : "text-muted"}`}>
                      {pad(k + 1)}
                    </span>
                    <span>{g.caption}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* What it does */}
            <div data-draw className="mt-[72px] flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-ink pb-4">
              <h3 className={h3}>{rise(["What it", ["does", "text-red"]], 0)}</h3>
              <span className={`draw-wipe-l ${mono} text-[11px] font-medium leading-none [--tr:.12em] text-muted`} style={at(0.25)}>
                Spec 01–{pad(p.features.length)}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] border-l-[1.5px] border-ink">
              {p.features.map((f, k) => (
                <div key={f.title} data-draw className="draw-wipe border-b-[1.5px] border-r-[1.5px] border-ink p-6" style={at((k % 3) * 0.08)}>
                  {/* Centred, so a title that wraps to two lines sits evenly beside its number. */}
                  <div className="flex items-center gap-3.5">
                    <span className="flex-none font-display text-[44px] font-bold leading-none text-transparent [-webkit-text-stroke:1.2px_var(--red)]">
                      {pad(k + 1)}
                    </span>
                    <h4 className="m-0 font-display text-2xl font-bold uppercase leading-[1.05] tracking-[.02em]">{f.title}</h4>
                  </div>
                  <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0 text-base leading-normal text-muted">
                    {f.points.map((pt) => (
                      <li key={pt} className="border-l-2 border-line2 pl-[18px]">
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {f.flow && (
                    <div className={`mt-4 flex flex-wrap items-center gap-1.5 ${mono} text-[10px] font-medium leading-none [--tr:.08em]`}>
                      {f.flow.map((step, s) => (
                        <span key={step} className="contents">
                          {s > 0 && <span className="text-red">→</span>}
                          <span className={`border border-ink px-[7px] py-1.5 ${s === f.flow!.length - 1 ? "bg-ink text-paper" : ""}`}>
                            {step}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* What I learned */}
            <div data-draw className="mt-[72px] border-b-[1.5px] border-ink pb-4">
              <h3 className={h3}>{rise(["What I", ["learned", "text-red"]], 0)}</h3>
            </div>
            <p data-draw className="draw-wipe mb-0 mt-7 border-l-[3px] border-red pl-4 text-[clamp(22px,2.4vw,28px)] font-semibold leading-[1.35]">
              {p.learned}
            </p>
            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
              {p.lessons.map((l, k) => (
                <div key={l.title} data-draw className="draw-wipe border-[1.5px] border-ink bg-paper p-[22px]" style={at((k % 3) * 0.08)}>
                  <div className={`${mono} text-[11px] font-semibold leading-none [--tr:.12em] text-red`}>Lesson {pad(k + 1)}</div>
                  <h4 className="mb-0 mt-2.5 font-display text-[26px] font-bold uppercase leading-[1.05]">{l.title}</h4>
                  <p className="mb-0 mt-2.5 text-base leading-[1.55] text-muted">{l.points.join(" ")}</p>
                </div>
              ))}
            </div>

            <div data-draw className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-[1.5px] border-dashed border-line2 pt-6">
              <button
                type="button"
                onClick={close}
                className={`draw-wipe min-h-[52px] cursor-pointer border-[1.5px] border-ink bg-transparent px-[22px] text-ink ${mono} text-[13px] font-semibold transition-colors hover:bg-ink hover:text-paper`}
              >
                ← Back to portfolio
              </button>
              <button type="button" onClick={toContact} className={`${btnRed} draw-wipe min-h-[52px] cursor-pointer border-0 px-6 text-[13px] [--sh:-12px]`} style={at(0.1)}>
                Build something like this →
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
