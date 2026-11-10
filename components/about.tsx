"use client";

import { useState } from "react";
import { base, stats } from "@/lib/data";
import { Reveal } from "./reveal";

// ---- Data -------------------------------------------------------------------

const services = [
  {
    icon: "</>",
    title: "Front-end",
    titleColor: "#ff5b35",
    iconBg: "linear-gradient(135deg,#3b2fd0,#7b4cf0)",
    tilt: "-1.2deg",
    desc: "Fast, clear interfaces for people who use them all day.",
    tags: "React · Next.js · Tailwind · Bootstrap",
  },
  {
    icon: "API",
    title: "Back-end",
    titleColor: "#3b2fd0",
    iconBg: "linear-gradient(135deg,#ff8a50,#ff5b35)",
    tilt: "0.8deg",
    desc: "APIs, databases and documents that stay correct.",
    tags: "Python · FastAPI · PostgreSQL · Java",
  },
  {
    icon: "ERP",
    title: "Business systems",
    titleColor: "#3b2fd0",
    iconBg: "linear-gradient(135deg,#a24fd8,#7b4cf0)",
    tilt: "-0.6deg",
    desc: "ERP and POS that run sales, stock and accounting.",
    tags: "Ubuntu · Nginx · Playwright PDFs",
  },
];

// ---- Pieces -----------------------------------------------------------------

/**
 * Arch-topped photo that fades out downward, with a soft glow behind it.
 * Same structure at every size; only W × H changes (250×380, 280×460, 320×600, 420×780).
 * The photo is a cut-out (transparent background), so the arch gets a soft fill and the
 * figure sits a little below the top so the curve never clips the head.
 */
function Photo({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-[380px] w-[250px] sm:h-[460px] sm:w-[280px] lg:h-[600px] lg:w-[320px] 2xl:h-[780px] 2xl:w-[420px]">
      <div
        aria-hidden
        className="absolute left-1/2 top-[44%] aspect-square w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,70,232,.30) 0%, rgba(255,91,53,.15) 45%, transparent 72%)" }}
      />
      <div
        className="absolute inset-0 overflow-hidden rounded-t-full bg-[linear-gradient(180deg,#e8e3fb_0%,#f1ecfa_55%,#f8f7fc_100%)]"
        style={{
          maskImage: "linear-gradient(180deg,#000 0%,#000 55%,transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg,#000 0%,#000 55%,transparent 100%)",
        }}
      >
        {failed ? (
          // Shown until the photo file exists, so the layout still reads.
          <div className="grid h-full place-items-center bg-[#efedf6] px-6 text-center text-sm italic text-[#8a86a8]">
            Photo of you at work
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt="Sophaneth holding a bag strap"
            width={900}
            height={1984}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute left-0 top-[6%] h-auto w-full"
          />
        )}
      </div>
    </div>
  );
}

// ---- Section ----------------------------------------------------------------

/**
 * Phone: photo first (its fade runs into the text), then text, then cards.
 * Tablet: headline | bio on top, photo rising from the bottom edge beside the cards.
 * Laptop+: text | photo | cards in three columns, everything sitting on the bottom edge.
 */
export function AboutSection({ photoSrc = `${base}/images/about-candid.webp` }: { photoSrc?: string }) {
  return (
    <section id="about" className="relative overflow-hidden bg-[#f8f7fc]">
      <div className="mx-auto grid max-w-[1600px] gap-y-[18px] px-[22px] pb-12 pt-10 [grid-template-areas:'photo'_'head'_'bio'_'cards'] sm:grid-cols-2 sm:items-end sm:gap-x-10 sm:gap-y-9 sm:px-11 sm:pb-0 sm:pt-[72px] sm:[grid-template-areas:'head_bio'_'photo_cards'] lg:grid-cols-[minmax(0,1.45fr)_320px_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-x-12 lg:gap-y-[22px] lg:px-16 lg:pt-24 lg:[grid-template-areas:'head_photo_cards'_'bio_photo_cards'] 2xl:grid-cols-[minmax(0,1.5fr)_420px_minmax(0,1fr)] 2xl:gap-x-[72px] 2xl:gap-y-[26px] 2xl:pt-[130px]">
        <Reveal className="relative z-2 flex flex-col gap-[18px] [grid-area:head] lg:self-end lg:gap-[22px] 2xl:gap-[26px]">
          <span className="text-[15px] italic text-[#3b2fd0] sm:text-base lg:text-[17px] 2xl:text-[19px]">About me</span>
          <h2 className="m-0 text-pretty text-[38px] font-extrabold italic leading-[1.08] tracking-[-1px] text-[#1f1a5c] sm:text-[44px] lg:text-[50px] 2xl:text-[64px]">
            Why <span className="text-[#ff5b35]">hire me</span> for your{" "}
            <span className="text-[#3b2fd0]">next project?</span>
          </h2>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative z-2 flex flex-col gap-[18px] [grid-area:bio] sm:gap-4 lg:gap-[22px] lg:pb-24 2xl:gap-[26px] 2xl:pb-[130px]"
        >
          <p className="m-0 max-w-[58ch] text-base italic leading-[1.75] text-[#5a5680] sm:text-[15px] lg:text-[17px] 2xl:text-[19px]">
            Bachelor&apos;s in IT at NUM (GPA 3.65), now a Master&apos;s in Computer Science at ITC. Since 2023 I&apos;ve
            been building production software at Samai Distillery. I work alone on FlowBill, from requirements and database to
            the API, UI, PDFs and the server it runs on.
          </p>
          <p className="m-0 text-[17px] font-semibold italic text-[#1f1a5c] sm:text-base lg:text-lg 2xl:text-xl">
            I care about software people actually use every day.
          </p>
          <a
            href="#contact"
            className="inline-flex h-[54px] w-full flex-none items-center justify-center whitespace-nowrap rounded bg-[#ff5b35] px-8 font-bold italic text-white shadow-[0_14px_30px_rgba(255,91,53,.35)] transition-[transform,background-color] duration-300 hover:bg-[#1f1a5c] hover:text-white motion-safe:hover:-translate-y-0.5 sm:h-[52px] sm:w-fit lg:h-14 2xl:h-[60px] 2xl:px-10 2xl:text-lg"
          >
            Hire me
          </a>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mx-auto mb-[-40px] mt-2 [grid-area:photo] sm:mx-0 sm:mb-0 sm:mt-0 sm:pl-5 lg:-mt-10 lg:self-end lg:pl-0"
        >
          <Photo src={photoSrc} />
        </Reveal>

        <ul className="m-0 mt-2.5 flex list-none flex-col gap-3 p-0 [grid-area:cards] sm:mt-0 sm:gap-3.5 sm:pb-16 lg:self-end lg:gap-4 lg:pb-24 2xl:gap-5 2xl:pb-[130px]">
          {services.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={0.1 + i * 0.1}>
                <div
                  style={{ "--tilt": s.tilt } as React.CSSProperties}
                  className="flex gap-4 rounded-[14px] bg-white p-4 shadow-[0_18px_44px_rgba(42,31,120,.09)] transition-[rotate,translate] duration-[250ms] sm:p-[18px] sm:[rotate:var(--tilt)] motion-safe:hover:-translate-y-[3px] motion-safe:sm:hover:rotate-0 lg:p-5 2xl:p-[26px]"
                >
                  <span
                    className="grid size-11 flex-none place-items-center rounded-xl text-[15px] font-extrabold italic text-white sm:size-[46px] lg:size-[52px] lg:text-[17px] 2xl:size-[60px] 2xl:text-[19px]"
                    style={{ background: s.iconBg }}
                  >
                    {s.icon}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span
                      className="text-[19px] font-bold italic leading-tight lg:text-[21px] 2xl:text-2xl"
                      style={{ color: s.titleColor }}
                    >
                      {s.title}
                    </span>
                    <span className="text-sm italic leading-[1.45] text-[#4a4670] 2xl:text-base">{s.desc}</span>
                    <span className="mt-1 text-[10px] uppercase tracking-[1.8px] text-[#a7a3c4]">{s.tags}</span>
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="relative bg-paper">
      <div className="absolute inset-x-0 top-0 h-[134px] overflow-hidden bg-[radial-gradient(600px_200px_at_80%_30%,rgba(108,84,255,.55),rgba(108,84,255,0)_70%),radial-gradient(500px_220px_at_15%_80%,rgba(176,78,201,.35),rgba(176,78,201,0)_70%),linear-gradient(100deg,#0D0740_0%,#1A0F6B_55%,#2A1C9E_100%)]">
        <div className="absolute -inset-x-[10%] top-[30%] h-[200px] rounded-[50%] border-t border-[rgba(160,150,255,.25)]" />
        <div className="absolute -inset-x-[10%] top-[48%] h-[200px] rounded-[50%] border-t border-[rgba(160,150,255,.15)]" />
      </div>
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-2 gap-[clamp(12px,2.4vw,28px)] px-[22px] sm:px-11 lg:px-16 py-14 md:grid-cols-4">
        {stats.map((st, i) => (
          <Reveal key={st.label} delay={i * 0.08} className="group relative min-w-0">
            <div className="relative transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-3 group-hover:scale-[1.04]">
              <div className="pointer-events-none absolute bottom-3 right-2.5 h-[40%] w-[36%] origin-bottom-right rotate-3 shadow-[10px_14px_18px_-8px_rgba(27,20,70,.28)]" />
              <div className="relative flex flex-col overflow-hidden rounded-[14px_14px_22px_14px] shadow-[0_2px_8px_rgba(27,20,70,.06)] transition-shadow duration-500 group-hover:shadow-[0_28px_48px_-18px_rgba(59,43,196,.55)]">
                <div className="flex h-[78px] items-center justify-center bg-[linear-gradient(120deg,#E3DBF7_0%,#DCE4FB_100%)] px-3">
                  <span className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-iris">
                    {st.n}
                  </span>
                </div>
                <div className="flex justify-center bg-[linear-gradient(120deg,#F1EFFA_0%,#FFFFFF_70%)] px-2.5 pb-[18px] pt-3.5">
                  <span className="text-balance text-center text-[clamp(12px,1.3vw,15px)] text-[#3A3560]">{st.label}</span>
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-0 right-0 size-[26px] rounded-br-[22px] bg-[linear-gradient(135deg,rgba(255,255,255,0)_55%,rgba(225,221,243,.5)_85%,rgba(205,199,232,.6)_100%)]" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
