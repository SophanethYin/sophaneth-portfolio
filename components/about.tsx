import { base, stats } from "@/lib/data";
import { Section, Sheet, at, btnPad, btnRed, mono, rise } from "./ui";

const services = [
  {
    letter: "A",
    title: "Front-end",
    desc: "Fast, clear interfaces for people who use them all day.",
    tags: "React · Next.js · Tailwind · Bootstrap",
  },
  {
    letter: "B",
    title: "Back-end",
    desc: "APIs, databases and documents that stay correct.",
    tags: "Python · FastAPI · PostgreSQL · Java",
  },
  {
    letter: "C",
    title: "Business systems",
    desc: "ERP and POS that run sales, stock and accounting.",
    tags: "Ubuntu · Nginx · Playwright PDFs",
  },
];

export function AboutSection() {
  return (
    <Section id="about">
      <Sheet left="Sheet 02 / About me" right={<span>Scale 1 : 1</span>} />

      <div className="grid items-start gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div data-draw>
          <h2 data-draw className="m-0 text-balance font-display text-[clamp(44px,5.2vw,68px)] font-bold uppercase leading-[.95]">
            {rise(["Why", ["hire me", "text-red"], "for your", ["next project?", "outline-text"]])}
          </h2>
          <p className="draw-wipe mb-0 mt-6 text-pretty text-[17px] leading-[1.7] text-muted" style={at(0.35, 0.7)}>
            Bachelor&apos;s in IT at NUM (GPA 3.65), now a Master&apos;s in Computer Science at ITC. Since 2023 I&apos;ve
            been building production software at Samai Distillery. I work alone on FlowBill, from requirements and
            database to the API, UI, PDFs and the server it runs on.
          </p>
          <p className="relative mb-0 mt-5 pl-3.5 text-[19px] font-semibold leading-[1.4]">
            <span className="draw-y absolute inset-y-0 left-0 w-[3px] origin-top bg-red" style={at(0.6, 0.4)} />
            <span className="draw-wipe block" style={at(0.75)}>
              I care about software people actually use every day.
            </span>
          </p>
          <a href="#contact" className={`${btnRed} ${btnPad} draw-wipe mt-7 [--sh:-12px]`} style={at(0.9)}>
            Hire me
          </a>
        </div>

        {/* Fig. 2: the standing photo, cropped to the upper body, on a dark gridded panel. */}
        <div data-draw className="draw-wipe relative aspect-[3/4] overflow-hidden [--dur:.7s] border-[1.5px] border-ink bg-panel bg-[linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] bg-[size:20px_20px]">
          <img
            src={`${base}/images/standing.webp`}
            alt="Yin Sophaneth standing, holding a bag strap"
            width={1400}
            height={1867}
            loading="lazy"
            className="-ml-[66%] -mt-[47%] block h-auto w-[200%] max-w-none"
          />
          <span
            style={at(0.6)}
            className={`draw-wipe absolute bottom-3 left-3 border border-white/50 bg-[#16307a] px-2 py-1.5 ${mono} text-[11px] font-medium leading-none text-cream`}
          >
            Fig. 2 — Elevation
          </span>
        </div>

        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3 lg:col-span-1 lg:grid-cols-1">
          {services.map((s, i) => (
            <div key={s.letter} data-draw className="draw-wipe border-[1.5px] border-ink bg-card p-5" style={at(i * 0.12)}>
              <div className="flex items-baseline gap-3">
                <span className="border border-red px-1.5 py-1 font-mono text-xs font-semibold leading-none text-red">
                  {s.letter}
                </span>
                <h3 className="m-0 font-display text-[26px] font-bold uppercase leading-none tracking-[.03em]">{s.title}</h3>
              </div>
              <p className="mb-0 mt-3 text-base leading-normal text-muted">{s.desc}</p>
              <div
                className={`mt-3.5 border-t border-dashed border-line2 pt-3 ${mono} text-[11px] font-medium leading-[1.6] text-muted`}
              >
                {s.tags}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div data-draw className="draw-wipe mt-16 grid grid-cols-2 gap-[1.5px] border-[1.5px] border-ink bg-ink [--dur:.8s] sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="bg-card p-6">
            <div
              data-count
              style={at(0.2 + i * 0.08)}
              className={`font-display text-[40px] font-bold leading-none sm:text-5xl lg:text-6xl ${i === stats.length - 1 ? "text-red" : ""}`}
            >
              {s.n}
            </div>
            <div className={`mt-2.5 ${mono} text-xs font-medium leading-[1.4] [--tr:.08em] text-muted`}>{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
