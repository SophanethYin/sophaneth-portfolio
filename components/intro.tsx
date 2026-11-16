"use client";

import { useEffect, useRef, useState } from "react";
import { mono } from "./ui";

// "Sheet strips" page-load intro (handoff option 1a). Every array is indexed by column, one column per letter.
const INTRO = {
  word: "PHANETH",
  top: [52, 100, 100, 64, 70, 38, 100], // top block height, % of column; the bottom block takes the rest
  fill: [
    ["hatch", "panel"],
    ["panel", "panel"],
    ["hatch", "hatch"],
    ["panel", "hatch"],
    ["hatch", "panel"],
    ["panel", "hatch"],
    ["panel", "panel"],
  ] as const, // [top, bottom]
  topStub: [0, 6, 10, 0, 14, 0, 40], // % of column left showing after the first move
  botStub: [5, 0, 0, 8, 0, 18, 0],
  lock: [0.42, 0.54, 0.66, 0.78, 0.98, 1.62, 1.76], // s, when each letter stops scrambling
  delay: [0, 0.12, 0.03, 0.15, 0.09, 0.05, 0.02], // fly-off delay after 2.40s
  dir: [1, 1, -1, 1, -1, 1, 1], // fly-off: 1 down, -1 up
  // Counter [time, value]. The hold at 72 is for effect, not real loading.
  count: [[0, 0], [0.12, 0], [0.3, 8], [0.78, 56], [0.98, 72], [1.5, 72], [1.8, 97], [2.1, 99], [2.3, 100]],
  skipTo: 2.2,
  end: 3.25,
};
const N = INTRO.word.length;

const clamp = (u: number) => Math.min(1, Math.max(0, u));
const io3 = (u: number) => (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2);
const io4 = (u: number) => (u < 0.5 ? 8 * u ** 4 : 1 - (-2 * u + 2) ** 4 / 2);
const o3 = (u: number) => 1 - (1 - u) ** 3;
const back = (u: number) => 1 + 2.70158 * (u - 1) ** 3 + 1.70158 * (u - 1) ** 2;
const span = (t: number, from: number, dur: number) => clamp((t - from) / dur);

function counter(t: number) {
  const k = INTRO.count;
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i][0]) {
      const u = (t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]);
      return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * u * u * (3 - 2 * u);
    }
  }
  return 100;
}

const fills = {
  hatch: {
    background: "repeating-linear-gradient(-45deg, rgba(27,58,143,.3) 0 1.5px, transparent 1.5px 10px), var(--card)",
    edge: "var(--ink)",
  },
  panel: {
    background:
      "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px) 0 0/20px 20px, linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px) 0 0/20px 20px, var(--panel)",
    edge: "rgba(255,255,255,.4)",
  },
};

const tag = "absolute border-[1.5px] border-ink bg-paper";
const small = `${mono} text-[clamp(9px,2.4vw,11px)] font-medium leading-[1.3]`;

export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current!;
    // The head script marks reduced-motion visitors; the overlay is already hidden by CSS.
    if (html.classList.contains("no-intro")) return setDone(true);

    const q = <T extends Element = HTMLElement>(s: string) => [...el.querySelectorAll<T>(s)];
    const cols = q("[data-col]"),
      shadows = q("[data-shadow]"),
      tops = q("[data-top]"),
      bots = cols.map((c) => c.querySelector<HTMLElement>("[data-bot]")), // per column: some columns have none
      scr = q("[data-scr]"),
      fin = q("[data-fin]"),
      fade = q("[data-fade]");
    const dot = el.querySelector<HTMLElement>("[data-dot]")!;
    const svg = el.querySelector<SVGSVGElement>("svg")!;
    const path = svg.querySelector("path")!;
    const num = el.querySelector<HTMLElement>("[data-num]")!;
    const bar = el.querySelector<HTMLElement>("[data-bar]")!;

    let t = 0,
      raf = 0,
      last = 0,
      skip = false,
      stopped = false,
      locked = false;
    const tick = INTRO.word.split("").map(() => -1);
    let shown = "000";

    const onSkip = () => (skip = true);
    addEventListener("pointerdown", onSkip);
    addEventListener("keydown", onSkip);

    const siblings = [...document.body.children].filter((c) => c !== el) as HTMLElement[];
    const lock = () => {
      locked = true;
      document.body.style.paddingRight = `${innerWidth - html.clientWidth}px`; // keep the scrollbar's space
      html.style.overflow = "hidden";
      siblings.forEach((s) => (s.inert = true));
    };
    const unlock = () => {
      removeEventListener("pointerdown", onSkip);
      removeEventListener("keydown", onSkip);
      removeEventListener("resize", curve);
      if (!locked) return;
      locked = false;
      html.style.overflow = "";
      document.body.style.paddingRight = "";
      siblings.forEach((s) => (s.inert = false));
    };
    const finish = () => {
      cancelAnimationFrame(raf);
      unlock();
      html.classList.add("intro-done");
      setDone(true);
    };

    function curve() {
      const w = innerWidth,
        h = innerHeight;
      const p = (x: number, y: number) => `${x * w},${y * h}`;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      path.setAttribute("d", `M ${p(0.49, 0)} C ${p(0.49, 0.09)} ${p(0.46, 0.14)} ${p(0.4, 0.18)} C ${p(0.33, 0.23)} ${p(0.26, 0.29)} ${p(0.18, 0.31)}`);
    }

    function frame(t: number) {
      // The columns start flying away at 2.4 s: hand over so the hero draws underneath them.
      if (t >= 2.4) html.classList.add("intro-done");
      for (let i = 0; i < N; i++) {
        const L = INTRO.lock[i];
        if (t < L) {
          const k = Math.floor(t / 0.055);
          if (k !== tick[i]) {
            tick[i] = k;
            scr[i].textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          }
        } else if (tick[i] !== Infinity) {
          tick[i] = Infinity;
          scr[i].textContent = INTRO.word[i]; // keeps the letter box the final letter's width
          scr[i].style.opacity = "0";
        }
        fin[i].style.opacity = String(span(t, L, 0.05));
        fin[i].style.transform = `scale(${1.22 - 0.22 * o3(span(t, L, 0.2))})`;

        // Blocks: open to a stub, then clear. Translate is in % of the block's own height.
        const H = INTRO.top[i];
        const tOpen = L - 0.36,
          tClear = Math.max(1.4 + 0.035 * i, tOpen + 0.34);
        const a = (H - INTRO.topStub[i]) / H;
        const yTop = a * io3(span(t, tOpen, 0.34)) + (1 - a) * io3(span(t, tClear, 0.3));
        tops[i].style.transform = `translateY(${-yTop * 100}%)`;
        const bot = bots[i];
        if (bot) {
          const B = 100 - H,
            bOpen = L - 0.3,
            bClear = Math.max(1.43 + 0.035 * i, bOpen + 0.34);
          const b = (B - INTRO.botStub[i]) / B;
          const yBot = b * io3(span(t, bOpen, 0.34)) + (1 - b) * io3(span(t, bClear, 0.3));
          bot.style.transform = `translateY(${yBot * 100}%)`;
        }

        const lift = o3(span(t, 2.28, 0.18));
        const fly = io4(span(t, 2.4 + INTRO.delay[i], 0.6));
        cols[i].style.transform = `translateY(${INTRO.dir[i] * 118 * fly}%) scale(${1 - 0.06 * lift})`;
        shadows[i].style.opacity = String(lift);
      }

      const v = counter(t);
      const s = String(Math.round(v)).padStart(3, "0");
      if (s !== shown) num.textContent = shown = s;
      bar.style.transform = `scaleX(${v / 100})`;

      path.style.strokeDashoffset = String(1 - io3(span(t, 1.55, 0.42)));
      path.style.opacity = String(1 - span(t, 2.05, 0.2));
      dot.style.transform = `scale(${back(span(t, 1.88, 0.26))})`;
      const f = String(1 - span(t, 2.22, 0.14));
      fade.forEach((e) => (e.style.opacity = f));
    }

    const fontsOrTimeout = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1000))]);
    fontsOrTimeout.then(() => {
      if (stopped) return;
      // The CSS failsafe hides the overlay at 4s; past that, the visitor is already reading the page.
      if (performance.now() > 4000) return finish();
      el.dataset.run = "";
      lock();
      curve();
      addEventListener("resize", curve);
      raf = requestAnimationFrame(function loop(now) {
        const dt = Math.min(50, now - (last || now)) / 1000;
        last = now;
        t = Math.max(t + dt, skip ? INTRO.skipTo : 0);
        if (t >= INTRO.end) return finish();
        frame(t);
        raf = requestAnimationFrame(loop);
      });
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      unlock();
    };
  }, []);

  if (done) return null;

  // Server-rendered at the t=0 frame: real letters in outline, blocks closed, counter at 000.
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="intro fixed inset-0 z-[100] grid overflow-hidden [container-type:inline-size] [--c:clamp(12px,2.6vmin,24px)]"
      style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
    >
      {INTRO.word.split("").map((ch, i) => {
        const H = INTRO.top[i];
        const [ft, fb] = INTRO.fill[i];
        return (
          <div key={i} data-col className="relative">
            <div
              data-shadow
              className="absolute inset-0 opacity-0 outline-[1.5px] outline-ink [outline-style:solid] shadow-[10px_10px_0_rgba(14,30,80,.3)]"
            />
            <div
              className="sheet-bg absolute inset-0 overflow-hidden"
              style={{
                backgroundPosition: `calc(${-i} * 100cqw / ${N}) 0`,
                borderRight: i < N - 1 ? "1px solid rgba(27,58,143,.24)" : undefined,
              }}
            >
              <div
                data-top
                className="absolute inset-x-0 top-0"
                style={{ height: `${H}%`, background: fills[ft].background, boxShadow: `inset 0 -1.5px 0 ${fills[ft].edge}` }}
              />
              {H < 100 && (
                <div
                  data-bot
                  className="absolute inset-x-0 bottom-0"
                  style={{ height: `${100 - H}%`, background: fills[fb].background, boxShadow: `inset 0 1.5px 0 ${fills[fb].edge}` }}
                />
              )}
              <div className="absolute inset-0 grid place-items-center">
                <span
                  className="relative grid font-display font-bold uppercase leading-none"
                  style={{ fontSize: "min(22vh, 17vw)" }}
                >
                  <span data-scr className="[grid-area:1/1] text-center text-paper [-webkit-text-stroke:1.5px_var(--ink)]">
                    {ch}
                  </span>
                  <span data-fin className="[grid-area:1/1] text-center text-ink opacity-0">
                    {ch}
                  </span>
                  {i === N - 1 && (
                    <span
                      data-dot
                      className="absolute top-[.77em] size-[.12em] bg-red"
                      style={{ left: "calc(50% + .31em)", transform: "scale(0)" }}
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <svg className="pointer-events-none absolute inset-0 size-full" fill="none">
        <path pathLength={1} stroke="var(--red)" strokeWidth={2} strokeDasharray={1} strokeDashoffset={1} />
      </svg>

      <div
        data-fade
        className={`${tag} left-[var(--c)] top-[var(--c)] px-3 py-2 font-display text-[clamp(18px,5vw,24px)] font-bold uppercase leading-none tracking-[.04em] text-ink`}
      >
        Sophaneth<span className="text-red">.</span>
      </div>
      <div data-fade className={`${tag} right-[var(--c)] top-[var(--c)] px-3 py-2.5 ${small} text-ink`}>
        Phnom Penh, Cambodia
      </div>
      <div data-fade className={`${tag} bottom-[calc(var(--c)+12px)] left-[var(--c)] px-3 py-2.5 ${small} text-ink`}>
        ERP Systems Developer
      </div>
      <div
        data-fade
        className={`${tag} bottom-[calc(var(--c)+12px)] right-[var(--c)] flex items-center gap-2.5 bg-card px-3.5 py-2`}
      >
        <span data-num className="font-display text-[clamp(34px,7vmin,60px)] font-bold leading-none tabular-nums text-ink">
          000
        </span>
        <span className={`${small} text-muted`}>
          Loading
          <br />
          Sheet 01
        </span>
      </div>

      <div data-fade className="absolute inset-x-0 bottom-0 h-3">
        <div className="h-[7px] bg-[repeating-linear-gradient(90deg,var(--ink)_0_1px,transparent_1px_5%)]" />
        <div data-bar className="h-[5px] origin-left bg-red" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
