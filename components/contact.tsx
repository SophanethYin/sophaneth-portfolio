"use client";

import { useState } from "react";
import { channels, profile, topics } from "@/lib/data";
import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";

const fieldLabel = "flex items-baseline gap-2.5 text-[13px] font-semibold uppercase tracking-[.14em] text-ink";
const fieldNum = "text-[15px] italic tracking-normal text-coral";
const fieldInput =
  "w-full border-0 border-b-[1.5px] border-[#C9C3E6] bg-transparent px-0.5 py-2.5 text-[19px] text-ink outline-none transition-colors focus:border-iris";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");

  function send() {
    if (!name || !email) {
      setNote("Add your name and email first.");
      return;
    }
    const body =
      `Hi Sophaneth, my name is ${name}${topic ? ` and I need help with: ${topic}.` : "."}` +
      `\n\n${msg}\n\nReach me at ${email}`;
    window.location.href =
      `mailto:${profile.email}?subject=${encodeURIComponent(`Project inquiry from ${name}`)}` +
      `&body=${encodeURIComponent(body)}`;
    setNote("Opening your email app…");
  }

  return (
    <section id="contact" className="relative bg-contact">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-16 px-6 pb-10 pt-[clamp(72px,9vw,120px)]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="m-0 text-[clamp(40px,6vw,84px)] font-extrabold italic leading-none tracking-[-0.01em] text-ink">
              Let&apos;s build <span className="text-coral">something.</span>
            </h2>
          </div>
          <span className="flex items-center gap-2.5 text-[15px] italic text-muted">
            <span className="size-[9px] rounded-full bg-mint shadow-[0_0_0_5px_rgba(34,176,125,.18)]" />
            Usually replies within a day
          </span>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-x-[clamp(32px,6vw,96px)] gap-y-14">
          <Reveal className="flex flex-col gap-7">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-8">
              <label className="flex flex-col gap-1.5">
                <span className={fieldLabel}>
                  <span className={fieldNum}>01</span>Your name
                </span>
                <input
                  value={name}
                  onChange={(e) => (setName(e.target.value), setNote(""))}
                  placeholder="e.g. Dara Chan"
                  className={fieldInput}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={fieldLabel}>
                  <span className={fieldNum}>02</span>Your email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => (setEmail(e.target.value), setNote(""))}
                  placeholder="you@company.com"
                  className={fieldInput}
                />
              </label>
            </div>
            <div className="flex flex-col gap-3.5">
              <span className={fieldLabel}>
                <span className={fieldNum}>03</span>What do you need?
              </span>
              <div className="flex flex-wrap gap-2.5">
                {topics.map((t) => {
                  const on = topic === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setTopic(on ? "" : t)}
                      className={`cursor-pointer rounded-full border-[1.5px] px-[18px] py-2.5 text-[15px] font-medium transition-colors ${
                        on ? "border-iris bg-iris text-white" : "border-[#C9C3E6] bg-white/60 text-iris hover:border-iris"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>
                <span className={fieldNum}>04</span>Message
              </span>
              <textarea
                value={msg}
                onChange={(e) => (setMsg(e.target.value), setNote(""))}
                rows={3}
                placeholder="Tell me a bit about your project"
                className={`${fieldInput} resize-y leading-[1.6]`}
              />
            </label>
            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={send}
                className="cursor-pointer rounded border-0 bg-coral px-[34px] py-[18px] text-[17px] font-semibold italic text-white shadow-coral transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink"
              >
                Send message
              </button>
              <span aria-live="polite" className="text-[15px] italic text-muted">
                {note}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col border-t-2 border-ink">
            {channels.map((c) => (
              <a
                key={c.k}
                href={c.href}
                className="grid grid-cols-[76px_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-[rgba(42,28,158,.15)] py-[22px] text-ink transition-all duration-300 hover:pl-2.5 hover:text-coral sm:grid-cols-[100px_minmax(0,1fr)_auto] sm:gap-4"
              >
                <span className="text-xs font-semibold uppercase tracking-[.12em] text-faint sm:text-[13px] sm:tracking-[.14em]">{c.k}</span>
                <span className="break-words text-[clamp(17px,1.9vw,24px)] font-semibold italic">{c.v}</span>
                <span className="text-xl">{c.arrow}</span>
              </a>
            ))}
            <a
              href={profile.cvUrl}
              download="Yin-Sophaneth-CV.pdf"
              className="mt-7 inline-flex items-center gap-2.5 self-start rounded bg-ink px-7 py-4 font-semibold italic text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-iris hover:text-white"
            >
              Download CV
            </a>
          </Reveal>
        </div>

        <div className="flex w-full flex-wrap justify-between gap-4 border-t border-[rgba(42,28,158,.12)] pt-6 text-[13px] italic text-[#7A7596]">
          <span>© 2026 Yin Sophaneth</span>
          <span>Phnom Penh, Cambodia</span>
        </div>
      </div>
    </section>
  );
}
