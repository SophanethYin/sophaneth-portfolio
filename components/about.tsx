import { services, stats } from "@/lib/data";
import { Reveal } from "./reveal";
import { CoralButton, Eyebrow, SectionTitle } from "./ui";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-14 px-6 py-[clamp(72px,9vw,120px)]"
    >
      <Reveal className="flex flex-col gap-5">
        <Eyebrow>About Me</Eyebrow>
        <SectionTitle>
          Why you <span className="text-coral">hire me</span> for your <span className="text-iris">next project?</span>
        </SectionTitle>
        <p className="m-0 text-pretty text-[17px] italic leading-[1.7] text-muted">
          I earned my Bachelor&apos;s in IT at the National University of Management (GPA 3.65), I&apos;m now doing a
          Master&apos;s in Computer Science at the Institute of Technology of Cambodia, and I&apos;ve been building
          production software at Samai Distillery since 2023. I work alone on Samai Flow, so I handle requirements,
          database design, the API, the UI, PDF documents and the server it runs on. I care about software people
          actually use every day.
        </p>
        <CoralButton href="#contact" className="self-start px-7 py-3.5">
          Hire Me
        </CoralButton>
      </Reveal>

      <div className="flex flex-col gap-[22px]">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1} className={s.offset}>
            <div className="group grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-[18px] rounded-[14px] bg-white px-[26px] py-[22px] shadow-card transition-transform duration-300 hover:-translate-y-1">
              <span
                className="flex size-14 items-center justify-center rounded-[14px] text-lg font-bold italic text-white"
                style={{ background: s.iconBg }}
              >
                {s.icon}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className={`text-2xl font-semibold italic ${s.titleClass}`}>{s.title}</span>
                <span className="text-sm italic text-muted">{s.desc}</span>
                <span className="mt-1 text-[11px] uppercase tracking-[.12em] text-faint">{s.tools}</span>
              </div>
              <span
                className={`flex size-[30px] items-center justify-center rounded-full border border-line text-sm transition-transform duration-300 group-hover:rotate-45 ${
                  s.highlight ? "bg-coral text-white" : "bg-white text-iris-deep"
                }`}
              >
                ↗
              </span>
            </div>
          </Reveal>
        ))}
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
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-2 gap-[clamp(12px,2.4vw,28px)] px-6 py-14 md:grid-cols-4">
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
