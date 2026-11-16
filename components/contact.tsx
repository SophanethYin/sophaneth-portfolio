"use client";

import { useState } from "react";
import { base, profile } from "@/lib/data";
import { at, mono, rise } from "./ui";

// ---- Data -------------------------------------------------------------------

const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? url;

const rows: { k: string; v: string; href?: string }[] = [
  { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
  { k: "Telegram", v: `@${handle(profile.telegram)}`, href: profile.telegram },
  { k: "GitHub", v: handle(profile.github), href: profile.github },
  { k: "Based in", v: "Phnom Penh, Cambodia" },
];

const topics = ["ERP system", "POS", "Website", "Other"];

type Inquiry = { name: string; email: string; message: string; projectType: string; honey: string };

/**
 * Emails the message through FormSubmit, because the site is a static export with no server of its own.
 * Throws on failure. The whole inquiry goes as one written message, so it reads like a normal email, not a table
 * of fields. `_replyto` makes Reply in the inbox answer the visitor.
 */
async function onSubmit({ name, email, message, projectType, honey }: Inquiry): Promise<void> {
  const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `Project inquiry from ${name}`,
      _template: "basic",
      _replyto: email,
      _honey: honey,
      message:
        `Hi Sophaneth, my name is ${name}${projectType ? ` and I need help with: ${projectType}.` : "."}` +
        `\n\n${message}\n\nReach me at ${email}`,
    }),
  });
  const data = await res.json();
  if (!res.ok || String(data.success) !== "true") throw new Error(data.message);
}

// ---- Section ----------------------------------------------------------------

const fieldLabel = `flex flex-col gap-2 ${mono} text-[11px] font-medium leading-none [--tr:.12em]`;
// outline-hidden, not outline-none: High Contrast mode drops the focus shadow, and this leaves it an outline to draw.
const field =
  "rounded-none border border-ink bg-paper px-3 font-sans text-base normal-case tracking-normal text-ink outline-hidden focus:shadow-[inset_0_-3px_0_var(--red)]";

export function ContactSection() {
  const [topic, setTopic] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // read now: the event drops it once we await
    const f = new FormData(form);
    setState("sending");
    try {
      await onSubmit({
        name: String(f.get("name")).trim(),
        email: String(f.get("email")).trim(),
        message: String(f.get("message")).trim(),
        projectType: topic,
        honey: String(f.get("_honey")),
      });
      form.reset();
      setTopic("");
      setNote("Sent! I'll reply within a day.");
      setState("done");
    } catch {
      setNote(`Something went wrong. Please email me at ${profile.email}.`);
      setState("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-[60px] border-t-[1.5px] border-ink pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-[72px]">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8">
        <div
          data-draw
          className={`mb-10 flex items-center gap-3.5 ${mono} text-[10px] font-medium leading-none text-muted sm:text-[11px] lg:text-xs`}
        >
          <span className="draw-wipe">Sheet 06 / Contact</span>
          <span className="draw-x h-px flex-1 origin-left bg-line2 [--d:.05s] [--dur:.8s]" />
          <span className="flex items-center gap-2">
            <span className="draw-dot size-[7px] rounded-full bg-ok [--d:.65s]" />
            <span className="draw-wipe-l [--d:.7s]">Open to new projects</span>
          </span>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <div data-draw>
            <h2 data-draw className="m-0 font-display text-[clamp(56px,7vw,96px)] font-bold uppercase leading-[.88]">
              {rise(["Let's", "build"])}
              <span className="slot block">
                <span className="draw-rise outline-text inline-block" style={at(0.25)}>
                  something<span className="text-red [-webkit-text-stroke:0]">.</span>
                </span>
              </span>
            </h2>
            <p className="draw-wipe mb-0 mt-[22px] max-w-[440px] text-lg leading-[1.6] text-muted" style={at(0.3, 0.7)}>
              Write to me right here. It lands straight in my inbox, and I read every message.
            </p>
            <dl className="m-0 mt-7 border-t-[1.5px] border-ink">
              {rows.map((r, i) => (
                <div
                  key={r.k}
                  style={at(0.4 + i * 0.08)}
                  className={`draw-wipe grid grid-cols-[110px_minmax(0,1fr)] items-baseline gap-4 py-4 ${
                    i === rows.length - 1 ? "border-b-[1.5px] border-ink" : "border-b border-dashed border-line2"
                  }`}
                >
                  <dt className={`${mono} text-[11px] font-medium leading-none [--tr:.14em] text-muted`}>{r.k}</dt>
                  <dd className="m-0 text-[19px] font-semibold leading-[1.3] [overflow-wrap:anywhere]">
                    {r.href ? (
                      <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="no-underline">
                        {r.v}
                      </a>
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href={profile.cvUrl}
              download="Yin-Sophaneth-CV.pdf"
              style={at(0.8)}
              className={`press draw-wipe mt-[30px] inline-block bg-ink [--sh:-12px] px-[26px] py-4 ${mono} text-sm font-semibold leading-none text-paper no-underline [--press:var(--red)] hover:text-paper`}
            >
              Download CV
            </a>
          </div>

          <div data-draw className="relative">
            <div style={at(0.5)} className="draw-wipe absolute -top-[22px] right-4 z-[1] flex items-center gap-2.5 border-[1.5px] border-ink bg-card px-3.5 py-2">
              <span className="font-display text-[30px] font-bold leading-none text-red">&lt; 24h</span>
              <span className={`${mono} text-[11px] font-medium leading-[1.35] [--tr:.08em] text-muted`}>
                usual
                <br />
                reply time
              </span>
            </div>
            {/* action and method: without JavaScript the message still posts to FormSubmit instead of landing in the URL. */}
            <form
              action={`https://formsubmit.co/${profile.email}`}
              method="post"
              onSubmit={submit}
              className="draw-wipe m-0 border-[1.5px] border-ink bg-card shadow-[8px_8px_0_var(--line2)] [--dur:.7s] [--sh:-12px]"
            >
              <div className="draw-wipe flex items-center gap-3 border-b-[1.5px] border-ink px-5 py-4" style={at(0.35)}>
                <img src={`${base}/logo.svg`} alt="" width={64} height={64} className="size-16" />
                <div>
                  <h3 className="m-0 font-display text-xl font-bold uppercase leading-none tracking-[.04em]">
                    Send me a <span className="text-red">message</span>
                  </h3>
                  <div className="mt-[5px] text-[15px] text-muted">Hi! What are you looking to build?</div>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Project type">
                  {topics.map((t, i) => {
                    const on = topic === t;
                    return (
                      <button
                        key={t}
                        style={at(0.45 + i * 0.05)}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTopic(on ? "" : t)}
                        className={`draw-wipe min-h-11 cursor-pointer border border-ink px-3.5 ${mono} text-xs font-medium leading-none [--tr:.08em] ${
                          on ? "bg-ink text-paper" : "bg-paper text-ink"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                {/* Spam trap: people never see or fill this, bots do, and FormSubmit drops those. */}
                <input name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-4">
                  <label className={`draw-wipe ${fieldLabel}`} style={at(0.6)}>
                    Your name
                    <input name="name" required autoComplete="name" placeholder="e.g. Dara Chan" className={`${field} h-[46px]`} />
                  </label>
                  <label className={`draw-wipe ${fieldLabel}`} style={at(0.65)}>
                    Your email
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      className={`${field} h-[46px]`}
                    />
                  </label>
                </div>
                <label className={`draw-wipe ${fieldLabel}`} style={at(0.7)}>
                  Your message
                  <textarea
                    style={at(0.9)}
                    name="message"
                    required
                    rows={6}
                    placeholder="Hi Sophaneth, I'm looking to build..."
                    className={`${field} draw-lines resize-y bg-[linear-gradient(var(--line2)_1px,transparent_1px)] bg-[size:100%_28px] bg-local py-3 leading-7`}
                  />
                </label>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  style={at(0.85)}
                  className={`press draw-wipe h-[54px] [--sh:-12px] cursor-pointer border-0 bg-red text-paper ${mono} text-sm font-semibold disabled:cursor-wait disabled:opacity-70`}
                >
                  {state === "sending" ? "Sending…" : "Send to Sophaneth →"}
                </button>
                <p aria-live="polite" className={`m-0 min-h-[1.2em] text-center text-sm ${state === "error" ? "text-red" : "text-ink"}`}>
                  {state === "done" || state === "error" ? note : ""}
                </p>
              </div>
            </form>
          </div>
        </div>

        <footer
          data-draw
          className={`mt-[88px] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] border-[1.5px] border-ink bg-card ${mono} text-[11px] font-medium leading-normal`}
        >
          <div className="draw-wipe border-r border-ink px-[18px] py-3.5">
            <div className="text-muted">Drawn by</div>© 2026 Yin Sophaneth
          </div>
          <div className="draw-wipe border-r border-ink px-[18px] py-3.5 [--d:.1s]">
            <div className="text-muted">Location</div>Phnom Penh, Cambodia
          </div>
          <div className="draw-wipe px-[18px] py-3.5 [--d:.2s]">
            <div className="text-muted">Sheet</div>06 of 06
          </div>
        </footer>
      </div>
    </section>
  );
}
