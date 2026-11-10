import { Reveal } from "./reveal";
import { Timeline } from "./timeline";
import { Eyebrow, SectionTitle } from "./ui";

export function Journey() {
  return (
    <section id="journey" className="mx-auto flex max-w-[1600px] flex-col gap-14 px-[22px] sm:px-11 lg:px-16 py-[clamp(72px,9vw,120px)]">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2.5">
          <Eyebrow>Resume</Eyebrow>
          <SectionTitle>
            <span className="text-coral">Experience</span> &amp; <span className="text-iris">education</span>
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
    </section>
  );
}
