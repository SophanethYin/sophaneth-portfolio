"use client";

import { useEffect, useState } from "react";
import { base, flowBill } from "@/lib/data";
import { ProjectModal } from "./project-modal";

// ---- Edit project content here ------------------------------------------------

const featured = {
  url: "flowbill.samai.com",
  screenshot: `${base}/erp-cover.webp`,
  badge: { value: "300", label: ["test documents", "matched to the cent"] },
  summary:
    "A custom ERP for a Cambodian rum distillery. It replaced spreadsheets with one system for sales documents, inventory, receivables and reporting, used every day on laptops, tablets and office TVs.",
  chips: [
    "Sales document chain",
    "USD / KHR & Cambodian tax",
    "Multi-warehouse inventory",
    "Local & export lines",
    "Management dashboards",
    "Role-based access",
  ],
  stack: ["React", "Vite", "Tailwind", "FastAPI", "SQLAlchemy", "PostgreSQL", "Nginx"],
};

type Slide = {
  title: string;
  accent?: string; // orange word after the title
  muted?: boolean; // greyed title + "?" placeholder (coming-soon slide)
  status: string;
  statusTone?: "indigo" | "orange";
  kind: string;
  desc: string;
  chips?: string[];
  stack?: string[];
  button?: { label: string; href: string };
  url?: string;
  screenshot?: string; // e.g. `${base}/projects/store.webp`
};

const projects: Slide[] = [
  {
    title: "“Name”",
    accent: "store",
    status: "Finished",
    kind: "University project · Web",
    desc: "An e-commerce site for shirts and other products, with catalogue, cart and checkout.",
    chips: ["Product catalogue", "Cart", "Checkout", "Responsive"],
    stack: ["Stack TBD"],
    button: { label: "Visit the store ↗", href: "#" },
    url: "store.example.com",
  },
  {
    title: "“Name”",
    accent: "budget app",
    status: "Finished",
    kind: "University project · Mobile",
    desc: "A mobile app to track income and expenses and set spending budgets.",
    chips: ["Income & expenses", "Budgets", "Spending charts"],
    stack: ["Stack TBD"],
    button: { label: "View project →", href: "#" },
  },
  {
    title: "Next project",
    muted: true,
    status: "Coming soon",
    statusTone: "orange",
    kind: "In progress",
    desc: "Something new is in the works.",
  },
];

// -------------------------------------------------------------------------------

const EASE = "cubic-bezier(.65,0,.25,1)";
const n = projects.length;
const track = [...projects, projects[0]]; // clone of slide 1 for the seamless loop

const chip = "rounded-full px-3 py-[5px] text-[13px] font-semibold";
const featureChip = "rounded-full border border-[#e6e3f0] bg-white px-3 py-1.5 text-[13px] text-[#1f1a5c]";
const stackLine = "text-[11px] uppercase not-italic tracking-[2px] text-[#a7a3c4]";
const titleCls = "m-0 text-[34px] font-extrabold leading-[1.05] sm:text-[40px] lg:text-[48px]";
const btn =
  "inline-flex h-[52px] w-fit items-center gap-2 rounded px-7 text-[17px] font-bold italic !text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5";

function Browser({ url, children }: { url?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_30px_70px_rgba(42,31,120,.16)]">
      <div className="flex h-[30px] items-center gap-1.5 bg-[#efedf7] px-3">
        <span className="size-2.5 rounded-full bg-[#ff5b35]" />
        <span className="size-2.5 rounded-full bg-[#ffc04d]" />
        <span className="size-2.5 rounded-full bg-[#1fb37a]" />
        <span className="ml-3 h-[18px] w-full max-w-[240px] truncate rounded-full bg-white px-3 text-[11px] not-italic leading-[18px] text-[#8a86a8]">
          {url}
        </span>
      </div>
      <div className="relative h-[240px] sm:h-[380px]">{children}</div>
    </div>
  );
}

function Shot({ src, alt }: { src?: string; alt: string }) {
  return src ? (
    <img src={src} alt={alt} className="size-full object-cover object-left-top" />
  ) : (
    <div className="flex size-full items-center justify-center bg-[#f6f4fb] text-sm text-[#a7a3c4]">{alt} screenshot</div>
  );
}

function SlideView({ p, hidden }: { p: Slide; hidden: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      inert={hidden}
      className="grid w-full shrink-0 grid-cols-1 items-center gap-14 px-1 py-12 sm:px-[84px] lg:grid-cols-[1fr_1.25fr]"
    >
      <div className="order-2 flex flex-col gap-[18px] lg:order-1">
        <div className="flex flex-wrap gap-2">
          <span className={`${chip} ${p.statusTone === "orange" ? "bg-[#ffece5] text-[#c43d1a]" : "bg-[#ece9ff] text-[#3b2fd0]"}`}>
            {p.status}
          </span>
          <span className={`${chip} border border-[#e6e3f0] bg-white text-[#1f1a5c]`}>{p.kind}</span>
        </div>
        <h4 className={`${titleCls} ${p.muted ? "text-[#a7a3c4]" : "text-[#1f1a5c]"}`}>
          {p.title}
          {p.accent && <span className="text-[#ff5b35]"> {p.accent}</span>}
        </h4>
        <p className="m-0 text-[17px] leading-[1.7] text-[#5a5680]">{p.desc}</p>
        {p.chips && (
          <div className="flex flex-wrap gap-2">
            {p.chips.map((c) => (
              <span key={c} className={featureChip}>
                {c}
              </span>
            ))}
          </div>
        )}
        {p.stack && <span className={stackLine}>{p.stack.join(" · ")}</span>}
        {p.button && (
          <a href={p.button.href} className={`${btn} bg-[#1f1a5c] hover:bg-[#3b2fd0]`}>
            {p.button.label}
          </a>
        )}
      </div>

      {/* Deck: two faded cards behind the browser */}
      <div className="relative order-1 lg:order-2">
        <div className="absolute inset-0 rounded-[14px] bg-white opacity-55 shadow-[0_30px_70px_rgba(42,31,120,.16)] [transform:translate(44px,22px)_rotate(4deg)_scale(.94)]" />
        <div className="absolute inset-0 rounded-[14px] bg-white opacity-85 shadow-[0_30px_70px_rgba(42,31,120,.16)] [transform:translate(22px,11px)_rotate(2.6deg)_scale(.97)]" />
        <div className="relative rotate-[1.2deg]">
          <Browser url={p.url}>
            {p.muted ? (
              <div className="flex size-full items-center justify-center bg-[#f6f4fb]">
                <span className="text-[96px] font-extrabold text-transparent [-webkit-text-stroke:1.5px_#b8b2dc]">?</span>
              </div>
            ) : (
              <Shot src={p.screenshot} alt={`${p.accent ?? p.title}`} />
            )}
          </Browser>
        </div>
      </div>
    </div>
  );
}

const arrowBase =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-2xl leading-none transition-colors duration-300 sm:absolute sm:top-[calc(50%-20px)] sm:size-[52px] sm:-translate-y-1/2";

export function Portfolio() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0); // 0..n, where n is the clone of slide 0
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // After a no-transition snap, turn the transition back on once the browser has painted.
  useEffect(() => {
    if (anim) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setAnim(true))));
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [anim]);

  const next = () => {
    if (idx >= n) {
      // Sitting on the clone (looks like slide 0): snap to the real slide 0, then animate to 1.
      setAnim(false);
      setIdx(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setIdx(1)));
    } else setIdx(idx + 1);
  };
  const prev = () => setIdx(idx <= 0 || idx >= n ? n - 1 : idx - 1);

  // Restarts on every move, so a click gives the full 4.5s before the next auto step.
  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(next, 4500);
    return () => clearTimeout(t);
  });

  const active = idx % n;

  return (
    <section id="work" className="bg-[#f8f7fc] italic">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[72px] px-[22px] py-12 sm:px-11 sm:py-24 lg:px-16">
        {/* 1) Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="m-0 text-[17px] text-[#3b2fd0]">Portfolio</p>
            <h2 className="m-0 text-[40px] font-extrabold leading-[1.05] tracking-[-1px] text-[#1f1a5c] sm:text-[60px]">
              My latest <span className="text-[#ff5b35]">projects</span>
            </h2>
          </div>
          <p className="m-0 text-base text-[#5a5680]">One in production, one shipped, one on the way.</p>
        </div>

        {/* 2) FlowBill hero */}
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
          <div className="relative -rotate-[1.2deg]">
            <Browser url={featured.url}>
              <Shot src={featured.screenshot} alt="FlowBill dashboard" />
            </Browser>
            <div className="absolute -bottom-[22px] right-2 flex rotate-2 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_30px_70px_rgba(42,31,120,.16)] sm:-right-6">
              <span className="text-[26px] font-extrabold text-[#3b2fd0]">{featured.badge.value}</span>
              <span className="text-xs leading-tight text-[#5a5680]">
                {featured.badge.label[0]}
                <br />
                {featured.badge.label[1]}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-wrap gap-2">
              <span className={`${chip} inline-flex items-center gap-2 bg-[#e5f7ef] text-[#11734d]`}>
                <span className="size-2 rounded-full bg-[#1fb37a] shadow-[0_0_0_3px_rgba(31,179,122,.25)]" />
                Live · since 2023
              </span>
              <span className={`${chip} bg-[#ffece5] text-[#c43d1a]`}>Client work</span>
            </div>
            <h3 className={`${titleCls} text-[#1f1a5c]`}>
              Flow<span className="text-[#3b2fd0]">Bill</span> ERP
            </h3>
            <p className="m-0 text-[17px] leading-[1.7] text-[#5a5680]">{featured.summary}</p>
            <div className="flex flex-wrap gap-2">
              {featured.chips.map((c) => (
                <span key={c} className={featureChip}>
                  {c}
                </span>
              ))}
            </div>
            <span className={stackLine}>{featured.stack.join(" · ")}</span>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              className={`${btn} bg-[#ff5b35] shadow-[0_14px_30px_-10px_rgba(255,91,53,.7)] hover:bg-[#e84a25]`}
            >
              Read the case study →
            </a>
          </div>
        </div>

        {/* 3) More projects slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <h3 className="m-0 text-[34px] font-extrabold text-[#1f1a5c]">
              More <span className="text-[#ff5b35]">projects</span>
            </h3>
            <span className="hidden text-sm text-[#8a86a8] sm:inline">Hover to pause</span>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="region"
            aria-roledescription="carousel"
            aria-label="More projects"
          >
            <div className="overflow-hidden">
              <div
                className="flex"
                style={{
                  transform: `translateX(-${idx * 100}%)`,
                  transition: anim ? `transform .8s ${EASE}` : "none",
                }}
                onTransitionEnd={(e) => {
                  if (e.target !== e.currentTarget || idx < n) return;
                  setAnim(false);
                  setIdx(0);
                }}
              >
                {track.map((p, i) => (
                  <SlideView key={i} p={p} hidden={i !== idx} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex h-11 items-center justify-center gap-4 sm:h-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous project"
                className={`${arrowBase} bg-white text-[#1f1a5c] shadow-[0_10px_30px_rgba(42,31,120,.16)] hover:bg-[#1f1a5c] hover:text-white sm:left-4`}
              >
                ‹
              </button>
              <div className="flex gap-2">
                {projects.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Show ${p.accent ?? p.title}`}
                    aria-current={i === active}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${i === active ? "w-7 bg-[#ff5b35]" : "w-2 bg-[#ddd9ec]"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className={`${arrowBase} bg-[#ff5b35] text-white shadow-[0_14px_30px_-10px_rgba(255,91,53,.7)] hover:bg-[#e84a25] sm:right-4`}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProjectModal project={flowBill} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
