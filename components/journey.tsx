import { skillGroups } from "@/lib/data";
import { Reveal } from "./reveal";
import { Timeline } from "./timeline";
import { Eyebrow, SectionTitle } from "./ui";

export function Journey() {
  return (
    <section id="journey" className="mx-auto flex max-w-[1240px] flex-col gap-14 px-6 py-[clamp(72px,9vw,120px)]">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2.5">
          <Eyebrow>Resume</Eyebrow>
          <SectionTitle>
            <span className="text-coral">Experience</span> &amp; <span className="text-iris">Education</span>
          </SectionTitle>
        </div>
        <div className="flex gap-5 text-sm italic text-muted">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-coral" />
            Work
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-iris" />
            Education
          </span>
        </div>
      </Reveal>

      <Timeline />

      <div className="flex flex-col gap-10 pt-6">
        <Reveal className="flex flex-col gap-2.5">
          <Eyebrow>Skills</Eyebrow>
          <h3 className="m-0 text-[clamp(30px,3.4vw,44px)] font-bold italic leading-[1.1] text-ink">
            My <span className="text-coral">toolkit</span>
          </h3>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-[clamp(24px,4vw,56px)] gap-y-10">
          {skillGroups.map((g, i) => (
            <Reveal key={g.n} delay={i * 0.1} className="flex flex-col">
              <div className="flex items-baseline gap-3.5 border-b-2 border-ink pb-4">
                <span
                  className="text-clip pr-[.08em] text-[44px] font-extrabold italic leading-none"
                  style={{ backgroundImage: g.grad }}
                >
                  {g.n}
                </span>
                <span className="text-[22px] font-semibold italic text-ink">{g.title}</span>
              </div>
              {g.items.map((it) => (
                <div
                  key={it.name}
                  className="flex items-baseline justify-between gap-3 border-b border-line py-3.5 text-ink transition-all duration-300 hover:pl-2.5 hover:text-coral"
                >
                  <span className="text-[19px] font-medium italic">{it.name}</span>
                  <span className="text-right text-[13px] italic text-faint">{it.note}</span>
                </div>
              ))}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
