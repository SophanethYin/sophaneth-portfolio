"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, type Variants } from "motion/react";
import { base, profile } from "@/lib/data";
import { OutlineWord } from "./ui";

// ---- Data -------------------------------------------------------------------

const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? url;

const rows: { k: string; v: string; icon: string; href?: string }[] = [
  { k: "Email", v: profile.email, icon: "gmail", href: `mailto:${profile.email}` },
  { k: "Telegram", v: `@${handle(profile.telegram)}`, icon: "telegram", href: profile.telegram },
  { k: "GitHub", v: handle(profile.github), icon: "github", href: profile.github },
  { k: "Based in", v: "Phnom Penh, Cambodia", icon: "googlemaps" },
];

const options = [
  { label: "ERP system", reply: "I need an ERP system." },
  { label: "POS", reply: "I need a POS." },
  { label: "Website", reply: "I need a website." },
  { label: "Other", reply: "I need something else." },
];

type Inquiry = { name: string; email: string; message: string; projectType: string };

/**
 * TODO: connect this to your own form service. Return nothing (or resolve) on success; throw on failure.
 * Until then it opens the visitor's email app with the message filled in, and says so.
 */
async function onSubmit({ name, email, message, projectType }: Inquiry): Promise<string | void> {
  const body =
    `Hi Sophaneth, my name is ${name}${projectType ? ` and I need help with: ${projectType}.` : "."}` +
    `\n\n${message}\n\nReach me at ${email}`;
  window.location.href =
    `mailto:${profile.email}?subject=${encodeURIComponent(`Project inquiry from ${name}`)}` +
    `&body=${encodeURIComponent(body)}`;
  return "Your email app is opening with your message. Just hit send.";
}

// ---- Pieces -----------------------------------------------------------------

const ease = [0.22, 1, 0.36, 1] as const;
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const slide: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};
const pop: Variants = {
  hidden: { scale: 0, rotate: -30 },
  show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 420, damping: 16 } },
};
const drop: Variants = {
  hidden: { opacity: 0, y: -60 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 11, delay: 0.35 } },
};
const input =
  "h-12 w-full rounded-xl border-[1.5px] border-[#e6e3f0] bg-[#faf9fd] px-4 text-base text-[#1f1a5c] outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#a7a3c4] focus:border-[#7b3fe4] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,63,228,.12)]";
const fieldLabel = "flex flex-col gap-1.5 text-sm font-semibold italic text-[#1f1a5c]";

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${base}/logos/${name}.svg`} alt="" width={22} height={22} draggable={false} className="size-[22px]" />;
}

function Bubble({ from, children }: { from: "bot" | "me"; children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.4, ease }}
      className={`m-0 max-w-[92%] px-[15px] py-[11px] text-[15px] leading-[1.45] ${
        from === "me"
          ? "self-end rounded-[16px_16px_4px_16px] bg-[linear-gradient(135deg,#3b2fd0,#8b46e8)] text-white"
          : "self-start rounded-[16px_16px_16px_4px] bg-white text-[#1f1a5c] shadow-[0_6px_18px_-8px_rgba(42,31,120,.25)]"
      }`}
    >
      {children}
    </motion.p>
  );
}

/** Floating badges: one rAF loop bobs them, and eases a hover lift in/out. */
function useBadges(count: number, phases: number[], baseRot: number[]) {
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const hover = useRef<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const h = Array(count).fill(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      els.current.forEach((el, i) => {
        if (!el) return;
        const target = hover.current[i] ? 1 : 0;
        h[i] = still ? target : h[i] + (target - h[i]) * 0.15;
        const y = (still ? 0 : Math.sin(t * 1.6 + phases[i]) * 7) - h[i] * 10;
        el.style.transform = `translateY(${y}px) rotate(${baseRot[i] * (1 - h[i])}deg) scale(${1 + h[i] * 0.08})`;
        el.style.boxShadow = `0 ${16 + h[i] * 14}px ${36 + h[i] * 20}px rgba(42,31,120,${0.16 + h[i] * 0.1})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (i: number) => ({
    ref: (el: HTMLDivElement | null) => {
      els.current[i] = el;
    },
    onPointerEnter: () => (hover.current[i] = true),
    onPointerLeave: () => (hover.current[i] = false),
  });
}

/** True at tablet width and up. Starts true so the server render matches the common desktop case. */
function useWide(query = "(min-width: 640px)") {
  const [match, setMatch] = useState(true);
  useEffect(() => {
    const mq = matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

// ---- Section ----------------------------------------------------------------

export function ContactSection() {
  const [pick, setPick] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");
  const badge = useBadges(2, [0, 1.7], [3, -2]);
  const chosen = options.find((o) => o.label === pick);
  // Watch the column (not the tablet, which starts rotated out of place) to swing the tablet up and down.
  const stage = useRef<HTMLDivElement>(null);
  const up = useInView(stage, { amount: 0.35 });
  const wide = useWide();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const msg = await onSubmit({
        name: String(f.get("name")).trim(),
        email: String(f.get("email")).trim(),
        message: String(f.get("message")).trim(),
        projectType: pick,
      });
      setNote(msg || "Thanks! I'll reply within a day.");
      setState("done");
    } catch {
      setNote(`Something went wrong. Please email me at ${profile.email}.`);
      setState("error");
    }
  }

  // Badges pop in once the tablet has landed, and leave first when it swings down.
  // The outer motion layer does the pop; the inner div keeps the rAF bob/hover transform.
  const badgePop = {
    initial: { opacity: 0, scale: 0.6 },
    animate: up ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 },
    transition: up ? { delay: 1.05, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const } : { duration: 0.2 },
  };

  const badgeA = (
    <motion.div {...badgePop} className="absolute right-2 top-0 z-3 w-fit sm:right-6">
      <div {...badge(0)} className="flex items-center gap-3 rounded-xl bg-white px-[18px] py-3 will-change-transform">
        <span className="text-[28px] font-extrabold italic leading-none text-[#ff5b35] xl:text-[32px]">&lt; 24h</span>
        <span className="text-[13px] italic leading-[1.25] text-[#5a5680]">
          usual
          <br />
          reply time
        </span>
      </div>
    </motion.div>
  );

  const badgeB = (
    <motion.div {...badgePop} className="absolute bottom-0 left-2 z-3 w-fit sm:bottom-4 sm:left-[30px]">
      <div {...badge(1)} className="flex items-center gap-3 rounded-xl bg-white px-[18px] py-3 will-change-transform">
        <span className="size-2.5 rounded-full bg-[#1fb37a] shadow-[0_0_0_4px_rgba(31,179,122,.15)]" />
        <span className="text-[15px] font-semibold italic text-[#1f1a5c]">Open to new projects</span>
      </div>
    </motion.div>
  );

  // Device entrance. Tablet+ swings a quarter-turn up around its pinned bottom-right corner.
  // Phone pulls straight up from below with a small tilt that straightens out: on a narrow screen a corner swing
  // would sweep the full-width phone sideways off the screen.
  const rest = { rotate: 0, y: 0, scale: 1, opacity: 1 };
  const hidden = wide ? { rotate: -90, y: 0, scale: 1, opacity: 0 } : { rotate: 6, y: 180, scale: 0.92, opacity: 0 };
  const deviceTransition = up
    ? wide
      ? { rotate: { duration: 1.1, ease: [0.34, 1.45, 0.64, 1] as const }, opacity: { duration: 0.35 } }
      : { type: "spring" as const, stiffness: 120, damping: 17, opacity: { duration: 0.4 } }
    : wide
      ? { rotate: { duration: 0.7, delay: 0.2, ease: [0.55, 0, 0.75, 0] as const }, opacity: { duration: 0.3, delay: 0.6 } }
      : { duration: 0.5, delay: 0.15, ease: [0.55, 0, 0.75, 0] as const, opacity: { duration: 0.3, delay: 0.35 } };

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(100deg,#fdeef0 0%,#f5effb 50%,#e9edff 100%)" }}
    >
      <div className="pointer-events-none absolute -bottom-[200px] -right-[160px] size-[560px] rounded-full border border-white/95" />

      <div className="relative mx-auto max-w-[1600px] px-[22px] pb-10 pt-16 sm:px-11 sm:pt-20 lg:px-16 xl:pt-28">
        {/*
          One grid, three arrangements:
          phone   - head, intro, device, contacts, CV (one column)
          tablet  - headline left, intro + CV right, device full width, contacts in two columns
          laptop+ - text column on the left (vertically centred), device on the right
        */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          className="grid gap-x-10 gap-y-7 [grid-template-areas:'head'_'intro'_'device'_'rows'_'cv'] md:grid-cols-2 md:[grid-template-areas:'head_intro'_'head_cv'_'device_device'_'rows_rows'] lg:grid-cols-[minmax(360px,32%)_1fr] lg:grid-rows-[1fr_auto_auto_auto_auto_1fr] lg:gap-x-16 lg:[grid-template-areas:'._device'_'head_device'_'intro_device'_'rows_device'_'cv_device'_'._device']"
        >
          <div className="@container flex flex-col gap-7 [grid-area:head]">
            <motion.span variants={rise} className="text-[17px] italic text-[#3b2fd0] xl:text-[19px]">
              Contact
            </motion.span>
            <h2 className="m-0 flex flex-col text-[clamp(40px,13cqi,62px)] leading-none tracking-[-2px] sm:text-[clamp(44px,16cqi,92px)]">
              <motion.span variants={rise} className="font-extrabold italic text-[#1f1a5c]">
                Let&apos;s build
              </motion.span>
              <motion.span variants={rise} className="whitespace-nowrap font-bold italic">
                <OutlineWord text="something" fill="#F9EEF4" stroke={3.2} />
                {/* The full stop drops in with a bounce, then keeps a slow heartbeat. */}
                <motion.span variants={drop} className="inline-block text-[#ff5b35]">
                  <motion.span
                    className="inline-block"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                  >
                    .
                  </motion.span>
                </motion.span>
              </motion.span>
            </h2>
          </div>

          <motion.p
            variants={rise}
            className="m-0 text-[17px] italic leading-[1.6] text-[#5a5680] [grid-area:intro] md:self-end xl:text-[clamp(17px,1.2vw,22px)]"
          >
            Write to me right here. It lands straight in my inbox, and I read every message.
          </motion.p>

          <motion.ul variants={stagger} className="m-0 list-none p-0 [grid-area:rows] md:grid md:grid-cols-2 md:gap-x-10 lg:block">
            {rows.map((r) => {
              const cells = (
                <>
                  <motion.span variants={pop} className="grid place-items-center">
                    <span className="grid place-items-center transition-transform duration-300 ease-out group-hover:-rotate-12 group-hover:scale-125">
                      <Icon name={r.icon} />
                    </span>
                  </motion.span>
                  {/* Phone: label stacked over the value. Wider: label and value become their own grid columns. */}
                  <span className="flex min-w-0 flex-col gap-0.5 sm:contents">
                    <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#a7a3c4] transition-colors duration-300 group-hover:text-[#3b2fd0]">
                      {r.k}
                    </span>
                    <span className="relative min-w-0 self-start justify-self-start sm:self-auto">
                      <span className="block truncate whitespace-nowrap text-base font-bold italic text-[#1f1a5c] transition-colors duration-300 group-hover:text-[#ff5b35] xl:text-[clamp(16px,1.1vw,20px)]">
                        {r.v}
                      </span>
                      {/* underline that draws in on hover */}
                      <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-[#ff5b35] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </span>
                  </span>
                </>
              );
              const grid =
                "group grid grid-cols-[28px_minmax(0,1fr)] items-center gap-2.5 py-3 sm:grid-cols-[28px_76px_minmax(0,1fr)] xl:grid-cols-[28px_96px_minmax(0,1fr)] xl:py-4";
              return (
                <motion.li key={r.k} variants={slide} className="border-t border-[rgba(31,26,92,.1)]">
                  {r.href ? (
                    <a
                      href={r.href}
                      target={r.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className={`${grid} transition-transform duration-300 hover:translate-x-1.5`}
                    >
                      {cells}
                    </a>
                  ) : (
                    <div className={grid}>{cells}</div>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>

          <motion.a
            variants={rise}
            href={profile.cvUrl}
            download="Yin-Sophaneth-CV.pdf"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex h-[52px] w-full items-center justify-center rounded-md bg-[#1f1a5c] px-7 text-[17px] font-semibold italic text-white shadow-[0_14px_28px_-14px_rgba(31,26,92,.6)] transition-colors duration-300 [grid-area:cv] hover:bg-[#3b2fd0] hover:text-white sm:w-fit md:self-start"
          >
            Download CV
          </motion.a>

          {/* Device. Badge A sits in the stage's top padding, badge B in its bottom padding. */}
          <div ref={stage} className="relative pb-[58px] pt-[52px] [grid-area:device] sm:pb-[82px] sm:pt-[78px] lg:self-center">
            {badgeA}
            <motion.div
              initial={hidden}
              animate={up ? rest : hidden}
              transition={deviceTransition}
              style={wide ? { originX: 1, originY: 1 } : { originX: 0.5, originY: 1 }}
              className="will-change-transform"
            >
            {/* Phone: rounded bezel with a notch. Tablet+: wider bezel with a fixed, screen-scaled height. */}
            <div className="flex flex-col rounded-[36px] bg-[#1f1a2e] p-2 shadow-[0_30px_60px_-24px_rgba(42,31,120,.45)] sm:h-[clamp(540px,36vw,700px)] sm:rounded-[32px] sm:p-3.5 sm:shadow-[0_40px_80px_rgba(42,31,120,.28)] -rotate-[1.5deg]">
              <span aria-hidden className="mx-auto mb-2 mt-1 block h-[5px] w-16 shrink-0 rounded-full bg-white/25 sm:hidden" />
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] bg-[#faf9fd] sm:rounded-[20px]">
                <div className="flex items-center gap-3 border-b border-[#eeecf5] bg-white px-5 py-3.5">
                  <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,#3b2fd0,#8b46e8)] font-bold italic text-white">
                    YS
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-base font-bold italic text-[#1f1a5c]">Sophaneth</span>
                    <span className="text-xs text-[#1fb37a]">online</span>
                  </span>
                </div>

                <div className="grid min-h-0 flex-1 sm:grid-cols-[230px_1fr] xl:grid-cols-[clamp(230px,16vw,300px)_1fr]">
                  {/* Chat */}
                  <div className="flex flex-col gap-2.5 border-[#eeecf5] p-4 max-sm:border-b sm:overflow-y-auto sm:border-r">
                    <Bubble from="bot">Hi! What are you looking to build?</Bubble>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Project type">
                      {options.map((o) => {
                        const on = pick === o.label;
                        return (
                          <motion.button
                            key={o.label}
                            type="button"
                            aria-pressed={on}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setPick(on ? "" : o.label)}
                            className={`h-[34px] cursor-pointer rounded-full border-[1.5px] px-3.5 text-sm transition-colors duration-200 ${
                              on
                                ? "border-[#1f1a5c] bg-[#1f1a5c] text-white"
                                : "border-[#e1ddef] bg-white text-[#3b2fd0] hover:border-[#3b2fd0]"
                            }`}
                          >
                            {o.label}
                          </motion.button>
                        );
                      })}
                    </div>
                    <AnimatePresence mode="popLayout">
                      {chosen && (
                        <motion.div key={chosen.label} className="flex flex-col gap-2.5" exit={{ opacity: 0 }}>
                          <Bubble from="me">{chosen.reply}</Bubble>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 }}
                            className="flex flex-col"
                          >
                            <Bubble from="bot">Nice. Tell me about it on the right →</Bubble>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Form */}
                  <form onSubmit={submit} className="flex min-h-0 flex-col gap-3.5 bg-white px-[22px] py-5">
                    <h3 className="m-0 text-xl font-bold italic text-[#1f1a5c]">
                      Send me a <span className="text-[#ff5b35]">message</span>
                    </h3>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <label className={fieldLabel}>
                        Your name
                        <input name="name" required autoComplete="name" placeholder="e.g. Dara Chan" className={input} />
                      </label>
                      <label className={fieldLabel}>
                        Your email
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@company.com"
                          className={input}
                        />
                      </label>
                    </div>
                    <label className={`${fieldLabel} min-h-0 flex-1`}>
                      Your message
                      <textarea
                        name="message"
                        placeholder="Hi Sophaneth, I'm looking to build…"
                        className={`${input} h-auto min-h-[120px] flex-1 resize-none py-3 leading-[1.5]`}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="h-[54px] w-full shrink-0 cursor-pointer rounded-[10px] bg-[#ff5b35] text-lg font-bold italic text-white shadow-[0_14px_28px_rgba(255,91,53,.35)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {state === "sending" ? "Sending…" : "Send to Sophaneth ➤"}
                    </button>
                    <p
                      aria-live="polite"
                      className={`m-0 min-h-[1.2em] text-center text-sm italic ${state === "error" ? "text-[#ff5b35]" : "text-[#1fb37a]"}`}
                    >
                      {state === "done" || state === "error" ? note : ""}
                    </p>
                  </form>
                </div>
              </div>
            </div>
            </motion.div>
            {badgeB}
          </div>
        </motion.div>

        <footer className="mt-10 flex flex-col gap-1 border-t sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4 border-[rgba(31,26,92,.1)] pt-6 text-sm italic text-[#8a86a8]">
          <span>© 2026 Yin Sophaneth</span>
          <span>Phnom Penh, Cambodia</span>
        </footer>
      </div>
    </section>
  );
}
