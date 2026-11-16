import { base, profile } from "@/lib/data";
import { Typewriter } from "./typewriter";
import { Sheet, at, btnRed, mono } from "./ui";

const roles = ["ERP Systems Developer", "Full-stack Software Engineer", "Back-end Developer", "Web Developer"];

const socials = [
  { href: profile.github, label: "GitHub" },
  { href: profile.telegram, label: "Telegram" },
  { href: `mailto:${profile.email}`, label: "Email" },
];

const corner = "draw-dot absolute size-[18px] border-ink";
const callout = "border-[1.5px] border-ink bg-card px-3.5 py-2.5";
// Red dot, then the leader line drawing away from the photo.
const leader = (d: number, origin: "origin-left" | "origin-right") => (
  <>
    <span className="draw-dot size-[9px] rounded-full bg-red" style={at(d)} />
    <span className={`draw-x h-px w-[34px] bg-red ${origin}`} style={at(d + 0.05, 0.3)} />
  </>
);

// Drawn as the intro lifts away (spec §6.1); every delay counts from intro-done.
export function Hero() {
  return (
    <section id="home" className="pb-16 pt-7 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-11">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8">
        <Sheet left="Sheet 01 / Home" right={<span>DWG No. YS-2026</span>} className="mb-12" delay={0.25} />

        <div
          data-draw
          className="grid items-center gap-10 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] sm:gap-8 lg:grid-cols-2 lg:gap-14"
        >
          <div>
            <div className="slot block font-display text-2xl font-semibold uppercase leading-none tracking-[.04em] text-muted sm:text-[28px] lg:text-[34px]">
              <span className="draw-rise inline-block" style={at(0.3)}>
                Hi! I&apos;m
              </span>
            </div>
            <h1 className="mb-0 mt-2.5 font-display text-[64px] font-bold uppercase leading-[.86] tracking-[.01em] sm:text-[80px] lg:text-[clamp(60px,8.6vw,116px)]">
              <span className="slot block">
                <span className="draw-rise inline-block" style={at(0.38)}>
                  Yin
                </span>
              </span>
              <span className="slot block">
                <span className="draw-rise outline-text inline-block" style={at(0.48)}>
                  Sophaneth
                </span>
              </span>
            </h1>
            <div className="mt-[22px] flex items-center gap-3 font-display text-[19px] font-semibold uppercase leading-[1.1] tracking-[.06em] sm:text-[22px] lg:text-[26px]">
              <span className="draw-x h-0.5 w-9 origin-left bg-red" style={at(0.8, 0.4)} />
              <span className="draw-wipe" style={at(0.88)}>
                <Typewriter items={roles} />
              </span>
            </div>
            <p
              className="draw-wipe mb-0 mt-6 max-w-[520px] text-pretty text-base leading-[1.65] text-muted sm:text-[17px] lg:text-lg"
              style={at(1, 0.9)}
            >
              I build business software end to end, from the database to the dashboard. Right now I&apos;m the solo
              engineer behind <strong className="text-ink">FlowBill</strong>, the ERP that runs sales, stock and
              accounting at Samai Distillery in <strong className="text-ink">Phnom Penh, Cambodia</strong>.
            </p>
            <div className={`mt-[26px] flex flex-wrap gap-2.5 ${mono} text-xs font-medium [--tr:.08em]`}>
              {socials.map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="draw-wipe inline-flex min-h-11 items-center border border-ink bg-card px-3 no-underline"
                  style={at(1.3 + i * 0.07)}
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="mt-[34px] flex flex-wrap items-center gap-6">
              <a
                href={profile.cvUrl}
                download="Yin-Sophaneth-CV.pdf"
                className={`${btnRed} draw-wipe px-7 py-[18px] text-sm [--sh:-12px]`}
                style={at(1.55)}
              >
                Download CV
              </a>
              <a
                href="#contact"
                className={`draw-wipe inline-flex min-h-11 items-center ${mono} text-sm font-semibold underline-offset-[6px]`}
                style={at(1.65)}
              >
                Let&apos;s talk →
              </a>
            </div>
          </div>

          {/* Fig. 1: the seated photo on a drafting frame, with two callouts on leader lines. */}
          <figure className="relative m-0 w-full max-w-[340px] justify-self-center sm:max-w-full lg:max-w-[500px]">
            <div className="relative border border-dashed border-line2 px-7 pt-7">
              <span className={`${corner} -left-px -top-px origin-top-left border-l-2 border-t-2`} style={at(0.35, 0.3)} />
              <span className={`${corner} -right-px -top-px origin-top-right border-r-2 border-t-2`} style={at(0.4, 0.3)} />
              <span className={`${corner} -bottom-px -left-px origin-bottom-left border-b-2 border-l-2`} style={at(0.45, 0.3)} />
              <span className={`${corner} -bottom-px -right-px origin-bottom-right border-b-2 border-r-2`} style={at(0.5, 0.3)} />
              {/* Dashed circle, drawn round from 12 o'clock like a compass, with a red pen riding the tip. */}
              <svg aria-hidden viewBox="0 0 100 100" className="absolute left-[10%] top-[9%] aspect-square w-4/5 overflow-visible opacity-55">
                <mask id="hero-compass" maskUnits="userSpaceOnUse" x="-5" y="-5" width="110" height="110">
                  <circle className="compass-draw" cx="50" cy="50" r="49.5" pathLength={1} transform="rotate(-90 50 50)" stroke="#fff" strokeWidth={6} fill="none" />
                </mask>
                <circle
                  cx="50"
                  cy="50"
                  r="49.5"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="4 4"
                  mask="url(#hero-compass)"
                />
              </svg>
              <span aria-hidden className="compass-pen absolute left-[10%] top-[9%] aspect-square w-4/5">
                <span className="absolute left-1/2 top-0 -ml-1.5 -mt-1.5 size-3 rounded-full bg-red" />
              </span>
              <span className="draw-y absolute inset-y-0 left-1/2 w-px origin-top bg-line2" style={at(0.55)} />
              <span className="draw-x absolute inset-x-0 top-[44%] h-px origin-left bg-line2" style={at(0.6)} />
              <img
                src={`${base}/portrait-sitting.webp`}
                alt="Yin Sophaneth sitting cross-legged with a laptop"
                width={900}
                height={1238}
                className="draw-wipe-up relative mt-[10%] block h-auto w-full"
                style={at(0.9)}
              />
            </div>
            <figcaption className={`mt-3.5 flex items-center gap-2.5 ${mono} text-[11px] font-medium leading-none text-muted`}>
              <span className="draw-fade h-3 w-px bg-ink" style={at(1.6)} />
              <span className="draw-x h-px flex-1 origin-right bg-ink" style={at(1.45, 0.5)} />
              <span className="draw-fade" style={at(1.5)}>
                Fig. 1 — Developer, seated
              </span>
              <span className="draw-x h-px flex-1 origin-left bg-ink" style={at(1.45, 0.5)} />
              <span className="draw-fade h-3 w-px bg-ink" style={at(1.6)} />
            </figcaption>

            {/* Below lg the photo is narrow, so this callout sits up in the empty corner, clear of the face. */}
            <div className="absolute -right-1.5 top-[2%] flex items-center sm:-right-3 lg:-right-[18px] lg:top-[16%]">
              {leader(1.6, "origin-left")}
              <div className={`draw-wipe flex items-center gap-2.5 ${callout} max-lg:px-2.5 max-lg:py-2`} style={at(1.8)}>
                <span data-count className="font-display text-[28px] font-bold leading-none lg:text-[34px]" style={at(1.85)}>
                  3+
                </span>
                <span className={`${mono} text-[11px] font-medium leading-[1.35] [--tr:.08em] text-muted`}>
                  Years
                  <br />
                  experience
                </span>
              </div>
            </div>
            <div className="absolute -left-1.5 bottom-[20%] flex flex-row-reverse items-center sm:-left-3 lg:-left-[18px]">
              {leader(1.8, "origin-right")}
              <div className={`draw-wipe-l ${callout}`} style={at(2)}>
                <div data-count className="font-display text-[34px] font-bold leading-none text-red" style={at(2.05)}>
                  3.65
                </div>
                <div className={`mt-1 ${mono} text-[11px] font-medium leading-none [--tr:.08em] text-muted`}>GPA · NUM</div>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
