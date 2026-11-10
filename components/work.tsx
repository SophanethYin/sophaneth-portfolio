"use client";

import { useState } from "react";
import { flowBill, schoolProjects } from "@/lib/data";
import { ProjectModal } from "./project-modal";
import { Reveal } from "./reveal";
import { BrowserShot, Eyebrow, SectionTitle } from "./ui";

export function Work() {
  const [open, setOpen] = useState(false);
  return (
    <section id="work" className="relative bg-[linear-gradient(180deg,#F7F7FC_0%,#F1EDFF_100%)]">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-14 px-[22px] sm:px-11 lg:px-16 py-[clamp(72px,9vw,120px)]">
        <Reveal className="flex flex-col gap-2.5">
          <Eyebrow>Portfolio</Eyebrow>
          <SectionTitle>
            My latest <span className="text-coral">projects</span>
          </SectionTitle>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-12">
          <Reveal className="overflow-hidden rounded-2xl bg-white shadow-[0_40px_70px_-36px_rgba(42,28,158,.45)] transition-transform duration-500 hover:-translate-y-1.5">
            <button type="button" onClick={() => setOpen(true)} aria-label="Open FlowBill project details" className="block w-full cursor-pointer text-left">
              <BrowserShot src={flowBill.cover} alt="FlowBill ERP" placeholder="FlowBill cover" urlBar />
            </button>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-[18px]">
            <div className="flex flex-wrap gap-2.5">
              <span className="rounded-full bg-[#FFE4DC] px-3 py-[5px] text-[13px] font-semibold italic text-[#D9431F]">
                Client work
              </span>
              <span className="rounded-full bg-[#E4E0FF] px-3 py-[5px] text-[13px] font-semibold italic text-iris-deep">
                In production since 2023
              </span>
            </div>
            <h3 className="m-0 text-[clamp(34px,3.6vw,48px)] font-bold italic leading-[1.05] text-ink">
              Flow<span className="text-iris">Bill</span> ERP
            </h3>
            <p className="m-0 text-pretty text-[17px] italic leading-[1.65] text-muted">{flowBill.summary}</p>
            <div className="flex flex-wrap gap-2">
              {flowBill.chips.map((m) => (
                <span key={m} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] italic text-ink-soft">
                  {m}
                </span>
              ))}
            </div>
            <span className="text-xs uppercase tracking-[.12em] text-faint">{flowBill.stackLine}</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-2 inline-flex w-fit items-center gap-2.5 rounded bg-coral px-6 py-3.5 font-semibold italic text-white shadow-coral transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink"
            >
              View project <span aria-hidden>→</span>
            </button>
          </Reveal>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-7">
          {schoolProjects.map((p, i) => (
            <Reveal
              key={p.tag}
              delay={i * 0.1}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-36px_rgba(42,28,158,.4)] transition-transform duration-500 hover:-translate-y-1.5"
            >
              <BrowserShot src={p.image} alt={p.title} placeholder={p.placeholder} bg={p.bg} />
              <div className="flex flex-col gap-2 px-6 pb-[26px] pt-[22px]">
                <span className="text-xs font-semibold uppercase tracking-[.12em] text-coral">{p.tag}</span>
                <span className="text-2xl font-semibold italic text-ink">{p.title}</span>
                <span className="text-[15px] italic leading-[1.55] text-muted">{p.desc}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <ProjectModal project={flowBill} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
