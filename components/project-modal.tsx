"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useReducedMotion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import type { Project } from "@/lib/data";
import { Typewriter } from "./typewriter";
import { OutlineWord } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;
// The title's outline trick paints the inside of "Bill" this colour, so the sidebar starts with it.
const paper = "#FCEEF4";
const label = "m-0 text-[15px] font-normal italic text-iris";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease } },
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.3 } } as const;

/**
 * Full-screen project viewer. Native <dialog> gives Esc, focus trapping and the top layer;
 * motion animates the panel in on mount and out before the dialog actually closes.
 * Phone: everything stacks. Tablet: facts beside the title. Desktop (lg): identity sidebar on the left.
 */
export function ProjectModal({ project, open, onClose }: { project: Project; open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const [shown, setShown] = useState(false);
  const [i, setI] = useState(0);
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const n = project.gallery.length;

  useEffect(() => {
    const d = dialog.current;
    if (open && d && !d.open) {
      setI(0);
      setShown(true);
      d.showModal();
      lenis?.stop(); // keep the page behind still while the popup scrolls
    }
  }, [open, lenis]);

  useEffect(() => () => lenis?.start(), [lenis]);

  // Runs however the dialog ends up closed (our animation, or the browser forcing it on a second Esc).
  const finish = () => {
    closing.current = false;
    setShown(false);
    lenis?.start();
    onClose();
  };

  const close = async () => {
    if (closing.current) return;
    closing.current = true;
    const t = { duration: reduce ? 0 : 0.38, ease: [0.4, 0, 0.2, 1] as const };
    await Promise.all([
      panel.current && animate(panel.current, { opacity: 0, y: 36, scale: 0.97 }, t),
      overlay.current && animate(overlay.current, { opacity: 0 }, t),
    ]);
    dialog.current?.close();
  };

  const go = (k: number) => {
    const el = strip.current;
    if (el) el.scrollTo({ left: ((k + n) % n) * el.clientWidth, behavior: "smooth" });
  };

  const shot = project.gallery[i];
  const arrow = (d: 1 | -1, cls: string) => (
    <motion.button
      type="button"
      onClick={() => go(i + d)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={d > 0 ? "Next image" : "Previous image"}
      className={`grid size-11 place-items-center rounded-full text-xl shadow-float transition-colors ${d > 0 ? "bg-coral text-white hover:bg-ink" : "border border-line bg-white text-ink hover:bg-ink hover:text-white"} ${cls}`}
    >
      {d > 0 ? "›" : "‹"}
    </motion.button>
  );

  return (
    <dialog
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault(); // play the close animation instead of vanishing
        close();
      }}
      onClose={finish}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      aria-label={`${project.name.join("")} project details`}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent"
    >
      {shown && (
        <>
          <motion.div
            ref={overlay}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease }}
            className="absolute inset-0 bg-[#2a2350]/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panel}
            initial={{ opacity: 0, y: 64, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease }}
            className="absolute inset-0 overflow-hidden bg-white will-change-transform sm:inset-6 sm:mx-auto sm:max-w-[1280px] sm:rounded-3xl sm:shadow-[0_60px_120px_-40px_rgba(20,10,80,.6)]"
          >
            <motion.button
              type="button"
              onClick={close}
              aria-label="Close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.5, ease }}
              className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white text-2xl leading-none text-ink shadow-float transition-colors hover:bg-coral hover:text-white sm:right-6 sm:top-6"
            >
              ×
            </motion.button>

            <div
              data-lenis-prevent
              className="grid h-full overflow-y-auto overscroll-contain lg:grid-cols-[minmax(320px,410px)_1fr]"
            >
              {/* Identity: header on phone/tablet, sidebar on desktop */}
              <aside
                style={{ background: `linear-gradient(180deg, ${paper} 0, ${paper} 440px, #EEEBFF 70%, #E5EAFF 100%)` }}
              >
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-6 px-5 pb-6 pt-14 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-8 sm:pb-8 sm:pt-16 lg:flex-col lg:items-stretch lg:justify-start lg:gap-10 lg:px-11 lg:py-14"
                >
                  <div className="flex flex-col gap-3">
                    <motion.span variants={rise} className="text-lg font-bold italic text-faint lg:text-2xl">
                      Project {project.number}
                    </motion.span>
                    <h2 className="m-0 flex flex-wrap gap-x-[.2em] text-[clamp(52px,9vw,76px)] font-extrabold italic leading-[.95] tracking-[-0.02em] lg:flex-col lg:text-[96px]">
                      <motion.span variants={rise} className="text-clip bg-[linear-gradient(90deg,#4B2BC4,#7A3FD1_60%,#B04EC9)] pr-[.05em]">
                        {project.name[0]}
                      </motion.span>
                      <motion.span variants={rise}>
                        <OutlineWord text={project.name[1]} fill={paper} />
                      </motion.span>
                    </h2>
                    <motion.p
                      variants={rise}
                      className="m-0 min-h-[2.6em] text-[clamp(18px,2.2vw,22px)] font-bold italic leading-[1.3] text-faint lg:text-2xl"
                    >
                      <Typewriter items={project.taglines} />
                    </motion.p>
                  </div>

                  <motion.dl
                    variants={stagger}
                    className="m-0 grid shrink-0 grid-cols-2 gap-2 sm:block sm:min-w-[270px] sm:rounded-2xl sm:bg-white sm:px-5 sm:py-1 sm:shadow-card"
                  >
                    {project.facts.map((f) => (
                      <motion.div
                        key={f.k}
                        variants={rise}
                        className="rounded-xl bg-white px-3 py-2.5 sm:flex sm:items-baseline sm:justify-between sm:gap-6 sm:rounded-none sm:border-b sm:border-line sm:bg-transparent sm:px-0 sm:py-3 sm:last:border-0"
                      >
                        <dt className="text-xs italic text-faint sm:text-sm">{f.k}</dt>
                        <dd className="m-0 text-sm font-semibold text-ink sm:text-right">{f.v}</dd>
                      </motion.div>
                    ))}
                  </motion.dl>

                  <RoleAndStack project={project} className="hidden lg:flex" />
                </motion.div>
              </aside>

              {/* Main column */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex min-w-0 flex-col gap-10 px-5 py-8 sm:px-8 lg:gap-12 lg:px-14 lg:py-14"
              >
                <motion.section variants={rise} className="flex flex-col gap-3 lg:pr-16">
                  <h3 className={label}>Overview</h3>
                  <p className="m-0 text-pretty text-lg italic leading-[1.6] text-ink-soft lg:text-[22px]">
                    {project.overview.split("**").map((t, k) =>
                      k % 2 ? (
                        <strong key={k} className="font-bold text-ink">
                          {t}
                        </strong>
                      ) : (
                        t
                      ),
                    )}
                  </p>
                </motion.section>

                {/* Gallery: swipe on touch; arrows on the image (desktop) or under it (tablet) */}
                <motion.section variants={rise} aria-label="Screenshots" className="flex flex-col gap-4">
                  <div className="relative">
                    <div
                      ref={strip}
                      onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
                      className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl bg-[#F3F1FA] shadow-card [scrollbar-width:none]"
                    >
                      {project.gallery.map((g, k) => (
                        <div key={g.src} className="relative aspect-[16/10] w-full shrink-0 snap-center">
                          <Image
                            src={g.src}
                            alt={g.caption}
                            fill
                            sizes="(min-width: 1280px) 820px, 100vw"
                            loading={k === 0 ? "eager" : "lazy"}
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    {arrow(-1, "absolute -left-5 top-1/2 hidden -translate-y-1/2 lg:grid")}
                    {arrow(1, "absolute -right-5 top-1/2 hidden -translate-y-1/2 lg:grid")}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="m-0 flex min-w-0 items-baseline text-sm italic text-muted" aria-live="polite">
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="text-xl font-bold not-italic text-ink"
                      >
                        {i + 1}
                      </motion.span>
                      <span className="text-faint">&nbsp;/ {n}</span>
                      <motion.span
                        key={shot.src}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="ml-3"
                      >
                        {shot.caption}
                      </motion.span>
                    </p>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex items-center gap-1.5 lg:hidden" aria-hidden>
                        {project.gallery.map((g, k) => (
                          <span
                            key={g.src}
                            className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-6 bg-coral" : "w-1.5 bg-line"}`}
                          />
                        ))}
                      </div>
                      {arrow(-1, "hidden sm:grid lg:hidden")}
                      {arrow(1, "hidden sm:grid lg:hidden")}
                      <a
                        href={shot.src}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden text-sm italic text-iris underline underline-offset-4 hover:text-coral lg:inline"
                      >
                        Open full size ↗
                      </a>
                    </div>
                  </div>

                  <motion.div variants={stagger} className="hidden grid-cols-7 gap-3 lg:grid">
                    {project.gallery.map((g, k) => (
                      <motion.button
                        key={g.src}
                        variants={pop}
                        whileHover={{ y: -3 }}
                        type="button"
                        onClick={() => go(k)}
                        aria-label={`Show image ${k + 1}: ${g.caption}`}
                        aria-current={k === i}
                        className={`relative aspect-[16/10] overflow-hidden rounded-lg bg-[#F3F1FA] ring-2 transition-[opacity,box-shadow] duration-300 ${k === i ? "ring-coral" : "opacity-60 ring-transparent hover:opacity-100"}`}
                      >
                        <Image src={g.src} alt="" fill sizes="120px" className="object-cover object-top" />
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.section>

                <section className="flex flex-col">
                  <motion.h3
                    {...inView}
                    variants={rise}
                    className="m-0 border-b border-line pb-5 text-[clamp(28px,3.4vw,40px)] font-bold italic text-ink"
                  >
                    What it <span className="text-coral">does</span>
                  </motion.h3>
                  <ol className="m-0 list-none p-0">
                    {project.features.map((f, k) => (
                      <motion.li
                        key={f.title}
                        {...inView}
                        variants={stagger}
                        className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-line py-6 last:border-0 sm:gap-x-7 xl:grid-cols-[90px_260px_1fr] xl:gap-x-4"
                      >
                        <motion.span
                          variants={pop}
                          className="text-[30px] font-extrabold italic leading-none sm:row-span-2 sm:text-[40px] xl:row-span-1"
                        >
                          <OutlineWord text={String(k + 1).padStart(2, "0")} fill="#fff" stroke={3} />
                        </motion.span>
                        <motion.h4 variants={rise} className="m-0 text-lg font-bold italic text-ink sm:text-xl">
                          {f.title}
                        </motion.h4>
                        <motion.ul
                          variants={stagger}
                          className="col-span-2 m-0 mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.6] text-muted marker:text-coral sm:col-span-1 sm:col-start-2 sm:list-none sm:pl-0 xl:col-start-3 xl:mt-0"
                        >
                          {f.points.map((p) => (
                            <motion.li key={p} variants={rise}>
                              {p}
                            </motion.li>
                          ))}
                        </motion.ul>
                      </motion.li>
                    ))}
                  </ol>
                </section>

                <motion.div {...inView} variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <RoleAndStack project={project} className="flex rounded-2xl bg-[#F5F3FF] p-5 sm:p-6 lg:hidden" />
                  <motion.section
                    variants={rise}
                    className="flex flex-col gap-3 rounded-2xl bg-[linear-gradient(115deg,#3B2BC4,#8A45E0)] p-6 text-white lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-9"
                  >
                    <h3 className="m-0 shrink-0 text-[15px] font-normal italic text-white/80 lg:text-[28px] lg:font-bold lg:text-white">
                      What I <span className="lg:text-[#FFB59E]">learned</span>
                    </h3>
                    <p className="m-0 text-lg font-bold italic leading-[1.45] lg:text-[21px]">{project.learned}</p>
                  </motion.section>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </dialog>
  );
}

function RoleAndStack({ project, className }: { project: Project; className: string }) {
  return (
    <motion.div variants={stagger} className={`flex-col gap-8 ${className}`}>
      <motion.section variants={rise} className="flex flex-col gap-3">
        <h3 className={label}>My role</h3>
        <p className="m-0 text-[15px] leading-[1.7] text-ink-soft">{project.role}</p>
      </motion.section>
      <motion.section variants={rise} className="flex flex-col gap-3">
        <h3 className={label}>Built with</h3>
        <motion.ul variants={{ show: { transition: { staggerChildren: 0.03 } } }} className="m-0 flex list-none flex-wrap gap-2 p-0">
          {project.builtWith.map((t) => (
            <motion.li
              key={t}
              variants={pop}
              whileHover={{ y: -2 }}
              className="rounded-full bg-white px-3.5 py-1.5 text-[13px] text-ink-soft shadow-[0_4px_12px_-6px_rgba(42,28,158,.25)]"
            >
              {t}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
    </motion.div>
  );
}
