"use client";

import { useState } from "react";
import { flowBill, pitchLab, type Project } from "@/lib/data";
import { CaseStudy } from "./case-study";
import { Browser, Section, Sheet, Shot, at, btnPad, btnRed, h2, mono, rise } from "./ui";

// ---- Edit project content here ------------------------------------------------

const featuredSummary =
  "A custom ERP for a Cambodian rum distillery. It replaced spreadsheets with one system for sales documents, inventory, receivables and reporting, used every day on laptops, tablets and office TVs.";

type Slide = {
  status: string;
  kind: string;
  title: string;
  accent: string;
  desc: string;
  project?: Project; // adds the screenshot and "Read the case study"
  visit?: string;
};

const more: Slide[] = [
  {
    status: "Finished",
    kind: "E-commerce · Web",
    title: "Pitchlab",
    accent: "football shop",
    desc: pitchLab.summary,
    project: pitchLab,
    visit: "https://football-shop-liard.vercel.app/en",
  },
  {
    status: "Coming soon",
    kind: "In progress",
    title: "Next",
    accent: "project",
    desc: "Something new is in the works.",
  },
];

// -------------------------------------------------------------------------------

const total = more.length + 1; // FlowBill is drawing 01
const tag = `${mono} text-[11px] font-semibold leading-none`;

/** "Want a demo? Contact me": jumps to the form and starts the message for them, unless they've already written one. */
const demo = (name: string) => (
  <a
    href="#contact"
    onClick={() => {
      const box = document.querySelector<HTMLTextAreaElement>('#contact textarea[name="message"]');
      if (box && !box.value.trim()) box.value = `Hi Sophaneth, I'd like a demo of ${name}.`;
    }}
    className={`draw-wipe mt-5 flex w-fit flex-wrap [--d:1s] items-center gap-x-2 border-t border-dashed border-line2 pt-4 ${mono} text-xs font-medium [--tr:.08em] text-muted no-underline`}
  >
    Want a demo?
    <span className="font-semibold text-red underline underline-offset-4">Contact me</span>
  </a>
);

export function Portfolio() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <Section id="portfolio">
      <Sheet left="Sheet 03 / Portfolio" right={<span>{total} drawings</span>} />
      <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
        <h2 data-draw className={h2}>
          {rise(["My latest", ["projects", "text-red"]])}
        </h2>
        <p data-draw className="draw-wipe m-0 text-[17px] text-muted" style={at(0.4)}>
          One in production, one shipped, one on the way.
        </p>
      </div>

      {/* Drawing 01: FlowBill */}
      <div className="grid items-center gap-9 sm:gap-10 lg:grid-cols-2 lg:gap-12">
        <div data-draw className="relative">
          <Browser url={flowBill.url} className="draw-wipe bg-card shadow-[8px_8px_0_var(--line2)] [--dur:.7s] [--sh:-12px]">
            <div className="draw-wipe-up" style={at(0.35)}>
              <Shot src={flowBill.cover!} alt="FlowBill sales dashboard" />
            </div>
          </Browser>
          <div
            className="draw-wipe pointer-events-none absolute -bottom-[22px] -right-1.5 flex items-center gap-3 border-[1.5px] border-ink bg-card px-4 py-3 sm:-right-3 lg:-right-[18px]"
            style={at(0.8)}
          >
            <span data-count className="font-display text-[40px] font-bold leading-none text-red" style={at(0.85)}>
              300
            </span>
            <span className={`${mono} text-[11px] font-medium leading-[1.4] [--tr:.08em] text-muted`}>
              test documents
              <br />
              matched to the cent
            </span>
          </div>
        </div>
        <div data-draw>
          <div className={`draw-wipe flex flex-wrap gap-2 ${tag}`}>
            <span className="flex items-center gap-2 border border-ink bg-card px-2.5 py-[7px]">
              <span className="size-[7px] rounded-full bg-ok" />
              Live · since 2023
            </span>
            <span className="border border-red bg-card px-2.5 py-[7px] text-red">Client work</span>
          </div>
          <h3 className="mb-0 mt-[18px] font-display text-[clamp(48px,5.4vw,72px)] font-bold uppercase leading-[.95]">
            <span className="slot">
              <span className="draw-rise inline-block" style={at(0.1)}>
                {flowBill.name[0]}
                <span className="outline-text">{flowBill.name[1]}</span>
              </span>
            </span>{" "}
            <span className="slot">
              <span className="draw-rise inline-block" style={at(0.15)}>
                ERP
              </span>
            </span>
          </h3>
          <p className="draw-wipe mb-0 mt-[18px] text-pretty text-[17px] leading-[1.65] text-muted" style={at(0.3, 0.7)}>
            {featuredSummary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[15px]">
            {flowBill.chips.map((c, i) => (
              <span key={c} className="draw-wipe border border-dashed border-ink px-[11px] py-1.5" style={at(0.45 + i * 0.05)}>
                {c}
              </span>
            ))}
          </div>
          <div className={`draw-wipe mt-5 ${mono} text-[11px] font-medium leading-[1.7] [--tr:.12em] text-muted`} style={at(0.8)}>
            {flowBill.stackLine}
          </div>
          <button
            type="button"
            onClick={() => setOpen(flowBill)}
            className={`${btnRed} ${btnPad} draw-wipe mt-[26px] cursor-pointer border-0 [--sh:-12px]`}
            style={at(0.9)}
          >
            Read the case study<span className="sr-only"> ({flowBill.name.join("")})</span>
          </button>
          {demo("FlowBill ERP")}
        </div>
      </div>

      {/* Drawings 02+, one under another */}
      <div data-draw className="mb-6 mt-[72px] sm:mb-7 sm:mt-[88px] lg:mb-8 lg:mt-[104px]">
        <h3 className="m-0 font-display text-[44px] font-bold uppercase leading-none">{rise(["More", ["projects", "text-red"]], 0)}</h3>
      </div>
      <div className="flex flex-col gap-6">
        {more.map((s) =>
          s.project ? (
            <div
              key={s.title}
              data-draw
              className="draw-wipe grid items-center gap-9 border-[1.5px] border-ink bg-card p-5 [--dur:.6s] sm:gap-10 sm:p-7 lg:grid-cols-2 lg:gap-12 lg:p-8"
            >
              <div>
                <div className={`flex flex-wrap gap-2 ${tag}`}>
                  <span className="border border-ink bg-ink px-2.5 py-[7px] text-paper">{s.status}</span>
                  <span className="border border-ink px-2.5 py-[7px]">{s.kind}</span>
                </div>
                <h4 className="mb-0 mt-[18px] font-display text-[clamp(40px,4.4vw,56px)] font-bold uppercase leading-[.95]">
                  {s.title} <span className="text-red">{s.accent}</span>
                </h4>
                <p className="mb-0 mt-4 text-pretty text-[17px] leading-[1.65] text-muted">{s.desc}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button type="button" onClick={() => setOpen(s.project!)} className={`${btnRed} ${btnPad} cursor-pointer border-0`}>
                    Read the case study<span className="sr-only"> ({s.title})</span>
                  </button>
                  {s.visit && (
                    <a href={s.visit} target="_blank" rel="noreferrer" className={`inline-flex min-h-11 items-center ${mono} text-sm font-semibold`}>
                      Visit the store
                    </a>
                  )}
                </div>
                {demo(`${s.title} ${s.accent}`)}
              </div>
              <Browser url={s.project.url} className="draw-wipe bg-paper [--d:.1s]">
                <Shot src={s.project.cover!} alt={`${s.title} ${s.accent}`} />
              </Browser>
            </div>
          ) : (
            // Not built yet: a slim dashed placeholder, not a full card with an empty picture.
            <div
              key={s.title}
              data-draw
              className={`draw-wipe flex flex-wrap items-center gap-x-4 gap-y-2 border-[1.5px] border-dashed border-line2 px-5 py-4 sm:px-7 ${tag}`}
            >
              <span className="text-red">{s.status}</span>
              <span className="font-display text-2xl font-bold tracking-normal text-muted">
                {s.title} {s.accent}
              </span>
              <span className="font-sans text-[15px] font-normal normal-case tracking-normal text-muted">{s.desc}</span>
            </div>
          ),
        )}
      </div>

      {open && <CaseStudy project={open} onClose={() => setOpen(null)} />}
    </Section>
  );
}
