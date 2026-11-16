# Site Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every section of the blueprint portfolio draws itself once, in the "Drafted" style, as the visitor reaches it. The Experience line and the toolkit build follow the scroll and never go back. The case study unrolls open and rolls closed.

**Architecture:** The motion vocabulary is plain CSS in `app/globals.css`: `draw-*` classes, hidden only under `html.motion`, that play once their group has `data-in`. One client component, `components/motion.tsx`, mounted in the layout, does three things:
- adds `motion` to `<html>`,
- waits for the intro to set `intro-done`,
- marks `[data-draw]` groups with `data-in` as they reach the screen, and runs count-ups.

Experience and Skills keep their own small scroll code for the two scroll-linked parts.

**Tech Stack:** Next.js 15 (static export), React 19, Tailwind CSS 4, TypeScript. Checks use `playwright-core` 1.56.0, kept outside the repo.

**Spec:** `docs/superpowers/specs/2026-11-16-site-motion-design.md` (approved 2026-11-16). Read §6 for each section's sequence. Mockups: `.superpowers/brainstorm/775-1794766931/content/*.html` (git-ignored, open them in a browser for reference).

## Global Constraints

- **No new npm dependency.** No `motion`, GSAP or Lenis, and `package.json` stays unchanged.
- **Drafted style: no bounce or overshoot anywhere.** The only easings allowed are:
  - `--ease-draw: cubic-bezier(.65,0,.35,1)`
  - `--ease-rise: cubic-bezier(.16,1,.3,1)`
  - `ease-out`, `ease-in` and `linear`
  - the case-study close curve `cubic-bezier(.4,0,1,1)`
- **Draw once.** Each part draws the first time the visitor reaches it. Scrolling back up never undoes anything.
- **Hiding:** hidden starting states exist only under `html.motion`. Hide with `clip-path`, `transform` or `opacity`, never `display: none` or `visibility`.
- **Animated properties:** only `transform`, `opacity`, `clip-path`, `stroke-dashoffset`, and `background-size` (contact textarea only).
- **Colours** only through the CSS variables (`--ink`, `--red`, `--line2` …), so the Cyanotype theme works.
- **Reduced motion:** no movement and nothing hidden, at any time.
- **Toolkit:** logos and name tags always stay upright, while building, while spinning and while scrolling.
- **Copy and layout don't change.** Only motion is added.
- **Git:** no commits during this plan. The owner reviews in the browser and asks for the commit through the `github-push` skill. Never push, and no co-author lines.
- **Dev server:** `npm run dev` serves http://localhost:1688. Don't run `npm run build` while the dev server is up, because they share `.next`. Type-check with `npx tsc --noEmit`, and build only in Task 9.

## Review Focus

These are the input classes most likely to bite a visitor that the spec implies but no single feature test covers. Each has a check in the task named.

1. **Jumping from the nav** (for example "06 Contact") skips past sections. Contact must draw, and everything passed must be drawn after scrolling back up. Check `anchor-jump`, Task 1.
2. **Opening the page partway down** (a reload, or a link with `#experience` or `#contact`). The parts already passed must be drawn right away, not stuck waiting. Checks `experience-hash` (Task 6) and `toolkit-hash` (Task 7).
3. **Closing the case study while it is still unrolling** (Esc straight away). It must close, and page scroll must come back. Check `case-close-early`, Task 5.
4. **The Cyanotype theme.** Every pen line, dot and wipe must work and nothing may stay hidden. Check `cyanotype`, Task 9.
5. **The window resizing mid-build** (phone rotation, or desktop resize while the toolkit is half built). It must finish built and upright, with no sideways scroll. Check `toolkit-resize`, Task 7.

---

## Shared contract (defined in Task 1, used by every task)

| Name | Kind | Meaning |
|---|---|---|
| `html.motion` | class | Added by `<Motion />` when reduced motion is off. All hidden states live under it. |
| `html.intro-done` | class | Added by the intro when its columns start flying away, on skip, or in `finish()`. `<Motion />` adds it itself after 4.5 s as a fallback. |
| `data-draw` | attribute | A group. `<Motion />` watches it after `intro-done` and sets `data-in` the first time it reaches the screen. |
| `data-in` | attribute | "Play now." It's also set directly by Experience (rows), Skills (ring list rows) and the case-study dialog (static attribute). |
| `draw-rise`, `draw-wipe`, `draw-wipe-l`, `draw-wipe-up`, `draw-x`, `draw-y`, `draw-dot`, `draw-fade`, `draw-lines` | classes | The vocabulary (spec §6.0). They play when the element or an ancestor has `data-in`. |
| `slot` | class | An `overflow: hidden` inline-block wrapper for one `draw-rise` element. Add `block` for a whole line. |
| `--d` | CSS var, registered `<time>`, **not inherited** | Delay of this element, measured from its group's `data-in`. |
| `--dur` | CSS var, not registered (inherits) | Duration override. Set it only on elements with no `draw-*` descendants. |
| `--sh` | CSS var | Negative length (for example `-12px`) that keeps an offset shadow outside the wipe's clip. |
| `data-count` | attribute | The element's text is the final value. It counts up from 0 over 0.6 s after its own `--d`. |
| `at(s, dur?)` | `components/ui.tsx` | `(s: number, dur?: number) => React.CSSProperties`. Inline `--d` (and `--dur`) for computed delays. Static delays may use Tailwind arbitrary properties instead: `[--d:1s]`, `[--dur:.7s]`, `[--sh:-12px]`. |
| `rise(parts, start?, step?)` | `components/ui.tsx` | `(parts: Part[], start = 0.15, step = 0.05) => React.ReactNode`, where `type Part = string \| [text: string, className: string]`. It splits each part into words, and each word becomes `<span class="slot"><span class="draw-rise inline-block {className}" style={at(start + k*step)}>word</span></span>`, joined by spaces. |

**Check script:** `$SCRATCH/motion/check.mjs`, where `$SCRATCH` is `C:\Users\phane\AppData\Local\Temp\claude\c17ae67cc5b7dc8a\040b4a4d-cc48-4093-a934-5b73ed74994c\scratchpad`. `playwright-core` 1.56.0 is installed in `$SCRATCH/node_modules`.
- If it's missing: `cd $SCRATCH && npm init -y && npm i playwright-core@1.56.0`.
- Chromium lives at `%LOCALAPPDATA%\ms-playwright\chromium-1194\chrome-win\chrome.exe`.
- Run it as `node $SCRATCH/motion/check.mjs <name> [<name> …]` (no names runs all). It prints `PASS <name>` or `FAIL <name>: why` and exits 1 on any failure.
- Before the first run in a session, start `npm run dev` and load http://localhost:1688 once, so the dev compile isn't counted against check timeouts.

---

### Task 1: Motion engine and section openers

**Deliverable:** after the intro, every section's sheet row draws and its heading rises word by word, once, when reached. Nothing is hidden for reduced-motion or no-JS visitors.

**Files:**
- Create: `components/motion.tsx`
- Create: `$SCRATCH/motion/check.mjs` (outside the repo)
- Modify: `app/globals.css` (add the vocabulary block after the `@layer base` block)
- Modify: `app/layout.tsx` (mount `<Motion />` after `<Intro />`)
- Modify: `components/intro.tsx` (`frame()` and `finish()` add `intro-done`)
- Modify: `components/ui.tsx` (`at`, `rise`, `Part`, `Sheet` draws)
- Modify: `components/about.tsx`, `components/portfolio.tsx`, `components/experience.tsx` (section `h2`)
- Modify: `components/skills.tsx` (title block)
- Modify: `components/contact.tsx` (sheet row and `h2`)

**Interfaces:**
- Produces: everything in the Shared contract table, except `data-count` (Task 2).
- `export function Motion(): null` in `components/motion.tsx`.
- `Sheet` gains `delay?: number` (default `0`): the left label is `draw-wipe` at `delay`, the rule is `draw-x origin-left` at `delay + 0.05` with `--dur .8s`, and the right label is `draw-wipe-l` at `delay + 0.65`. The `Sheet` root gets `data-draw`.

- [ ] **Step 1: Write the check script with the baseline checks**

Create `$SCRATCH/motion/check.mjs`:

```js
// Motion checks for the portfolio (spec §8). Usage: node check.mjs [name ...]. Needs `npm run dev` on :1688.
import { chromium } from "playwright-core";

const URL = process.env.URL ?? "http://localhost:1688";
const SIZES = [[1440, 900], [768, 1024], [390, 844], [320, 640]];
const browser = await chromium.launch({
  executablePath: `${process.env.LOCALAPPDATA}/ms-playwright/chromium-1194/chrome-win/chrome.exe`,
});

function assert(ok, msg) {
  if (!ok) throw new Error(msg);
}

async function open([w, h] = SIZES[0], opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
  const p = await ctx.newPage();
  p.errors = [];
  p.on("pageerror", (e) => p.errors.push(e.message));
  // The site has no favicon, so the browser's /favicon.ico 404 is not an app error.
  p.on("console", (m) => m.type() === "error" && !m.location().url.endsWith("/favicon.ico") && p.errors.push(m.text()));
  return p;
}

/** Load the page and wait for the intro to remove itself. */
async function load(p, hash = "") {
  await p.goto(`${URL}/${hash}`);
  await p.waitForSelector(".intro", { state: "detached", timeout: 10_000 }).catch(() => {});
}

const jump = (p, y) => p.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
const center = (p, sel) => p.$eval(sel, (e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
const hasClass = (p, c) => p.evaluate((c) => document.documentElement.classList.contains(c), c);

/** draw-* elements in or at `scope` that are not at rest (still hidden or still moving). */
const restless = (p, scope = "body") =>
  p.evaluate(
    (s) =>
      [...document.querySelectorAll(`${s} [class*="draw-"], ${s}[class*="draw-"]`)]
        .filter((el) => {
          const c = getComputedStyle(el);
          return +c.opacity < 0.99 || c.clipPath !== "none" || c.transform !== "none";
        })
        .map((el) => `${[...el.classList].filter((c) => c.startsWith("draw-")).join(".")} "${el.textContent.trim().slice(0, 24)}"`),
    scope,
  );

/** Scroll to the bottom in 600 px steps, let everything finish, then go back to the top. */
async function scrollPass(p) {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 600) {
    await jump(p, y);
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(3000);
  await jump(p, 0);
  await p.waitForTimeout(1000);
}

const checks = {
  async "motion-on"() {
    const p = await open();
    await load(p);
    assert(await hasClass(p, "motion"), "html.motion missing after the intro");
    assert((await restless(p, "#portfolio h2")).length > 0, "Portfolio heading should still be hidden before it is reached");
    await center(p, "#portfolio h2");
    await p.waitForTimeout(1500);
    assert((await restless(p, "#portfolio h2")).length === 0, "Portfolio heading did not draw once reached");
  },
  async "no-leftovers"() {
    for (const s of SIZES) {
      const p = await open(s);
      await load(p);
      await scrollPass(p);
      const left = await restless(p);
      const waiting = await p.$$eval("[data-draw]:not([data-in])", (e) => e.length);
      assert(!left.length && !waiting, `${s}: ${waiting} groups never drew; still hidden: ${left.slice(0, 4).join(" | ")}`);
      await p.context().close();
    }
  },
  async "anchor-jump"() {
    const p = await open();
    await load(p);
    await p.click('header nav a[href="#contact"]');
    await p.waitForTimeout(2500);
    assert((await restless(p, "#contact")).length === 0, "Contact did not draw after jumping to it from the nav");
    for (let y = await p.evaluate(() => scrollY); y >= 0; y -= 600) {
      await jump(p, y);
      await p.waitForTimeout(250);
    }
    await p.waitForTimeout(3000);
    const left = await restless(p);
    assert(!left.length, `still hidden after jumping to Contact and scrolling back up: ${left.slice(0, 4).join(" | ")}`);
  },
  async "reduced-motion"() {
    const p = await open(SIZES[2], { reducedMotion: "reduce" });
    await p.goto(URL);
    await p.waitForTimeout(800);
    assert(!(await hasClass(p, "motion")), "html.motion set despite reduced motion");
    const left = await restless(p);
    assert(!left.length, `hidden with reduced motion: ${left.slice(0, 4).join(" | ")}`);
  },
  async "no-js"() {
    const p = await open(SIZES[0], { javaScriptEnabled: false });
    await p.goto(URL);
    await p.waitForTimeout(4500); // the CSS failsafe hides the intro at 4 s
    assert(!(await hasClass(p, "motion")), "html.motion without JavaScript");
    const left = await restless(p);
    assert(!left.length, `hidden without JavaScript: ${left.slice(0, 4).join(" | ")}`);
  },
  async "no-hscroll"() {
    for (const s of [SIZES[3], SIZES[2]]) {
      const p = await open(s);
      await load(p);
      await scrollPass(p);
      assert(await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${s}: page scrolls sideways`);
      await p.context().close();
    }
  },
  async console() {
    const p = await open();
    await load(p);
    await scrollPass(p);
    assert(!p.errors.length, p.errors.join(" | "));
  },
};

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(checks);
let failed = 0;
for (const n of names) {
  try {
    await checks[n]();
    console.log(`PASS ${n}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${n}: ${e.message}`);
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run it to see the baseline**

Run: `node $SCRATCH/motion/check.mjs`
Expected: `FAIL motion-on: html.motion missing after the intro`. The other six pass, because nothing is hidden yet, so they guard against regressions from here on.

- [ ] **Step 3: Add the vocabulary to `app/globals.css`**

Add it after the `@layer base { … }` block, unlayered, so it wins over Tailwind utilities. This block is the shared contract, so copy it exactly:

```css
/* ---- Drafted motion (spec §6.0) -------------------------------------------------------
   Hidden starting states apply only under html.motion. A group gets data-in when it is reached;
   draw-* elements on or inside it then play after their own --d. Fill mode "backwards" leaves each
   element on its own style once it has moved. */
@property --d {
  syntax: "<time>";
  inherits: false;
  initial-value: 0s;
}
:root {
  --ease-draw: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-rise: cubic-bezier(0.16, 1, 0.3, 1);
}
.slot {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding: 0 0.04em 0.08em; /* room for outline strokes and descenders */
  margin: 0 -0.04em -0.08em;
}
@keyframes draw-rise { from { transform: translateY(105%); } }
@keyframes draw-wipe { from { clip-path: inset(0 100% var(--sh, 0px) 0); } to { clip-path: inset(0 var(--sh, 0px) var(--sh, 0px) 0); } }
@keyframes draw-wipe-l { from { clip-path: inset(0 0 var(--sh, 0px) 100%); } to { clip-path: inset(0 var(--sh, 0px) var(--sh, 0px) 0); } }
@keyframes draw-wipe-up { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0); } }
@keyframes draw-x { from { transform: scaleX(0); } }
@keyframes draw-y { from { transform: scaleY(0); } }
@keyframes draw-dot { from { transform: scale(0); } }
@keyframes draw-fade { from { opacity: 0; } }
@keyframes draw-lines { from { background-size: 0% 28px; } }

.motion .draw-rise { transform: translateY(105%); }
.motion .draw-wipe { clip-path: inset(0 100% var(--sh, 0px) 0); }
.motion .draw-wipe-l { clip-path: inset(0 0 var(--sh, 0px) 100%); }
.motion .draw-wipe-up { clip-path: inset(100% 0 0 0); }
.motion .draw-x { transform: scaleX(0); }
.motion .draw-y { transform: scaleY(0); }
.motion .draw-dot { transform: scale(0); }
.motion .draw-fade { opacity: 0; }
.motion .draw-lines { background-size: 0% 28px; }

/* :is([data-in], [data-in] *) matches the group itself and everything inside it. */
.motion :is([data-in], [data-in] *).draw-rise { transform: none; animation: draw-rise var(--dur, 0.75s) var(--ease-rise) var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-wipe { clip-path: none; animation: draw-wipe var(--dur, 0.5s) var(--ease-draw) var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-wipe-l { clip-path: none; animation: draw-wipe-l var(--dur, 0.45s) var(--ease-draw) var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-wipe-up { clip-path: none; animation: draw-wipe-up var(--dur, 0.9s) var(--ease-draw) var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-x { transform: none; animation: draw-x var(--dur, 0.7s) var(--ease-draw) var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-y { transform: none; animation: draw-y var(--dur, 0.7s) var(--ease-draw) var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-dot { transform: none; animation: draw-dot var(--dur, 0.22s) ease-out var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-fade { opacity: 1; animation: draw-fade var(--dur, 0.5s) ease-out var(--d) backwards; }
.motion :is([data-in], [data-in] *).draw-lines { background-size: 100% 28px; animation: draw-lines var(--dur, 0.8s) var(--ease-draw) var(--d) backwards; }
```

- [ ] **Step 4: Implement `Motion(): null` in `components/motion.tsx`**

Start the file with `"use client"`. Everything happens in a single `useEffect(…, [])` that cleans up after itself:
1. If `matchMedia("(prefers-reduced-motion: reduce)")` matches, return and do nothing.
2. Add `motion` to `document.documentElement`.
3. **Wait for the intro.** If `<html>` already has `intro-done`, start now. Otherwise watch `<html>`'s `class` attribute with a `MutationObserver` until it does. Also set a 4500 ms `setTimeout` that adds `intro-done` itself.
4. **Start:** create one `IntersectionObserver` with `{ threshold: 0, rootMargin: "0px 0px -12% 0px" }`, and observe every `[data-draw]` element present at that moment. When one intersects: `setAttribute("data-in", "")`, then `unobserve` it.
5. **Cleanup:** disconnect both observers and clear the timer.

Mount it in `app/layout.tsx` as `<Motion />` right after `<Intro />`.

- [ ] **Step 5: Make the intro announce `intro-done` in `components/intro.tsx`**

- In `frame(t)`: when `t >= 2.4` (columns start flying, `INTRO.delay` comment), add `intro-done` to `html`.
- In `finish()`: add `intro-done` too. This covers the "already past 4 s" path and early ends.

Skipping jumps `t` to `INTRO.skipTo` (2.2), so `intro-done` follows about 0.2 s later. Nothing extra is needed for skip.

- [ ] **Step 6: Add `at`, `Part` and `rise` to `components/ui.tsx`, and make `Sheet` draw**

Use the signatures from the Shared contract. In `rise`, a part's words keep that part's `className` (for example `text-red`, `outline-text`). `Sheet` gets `data-draw` on its root and the `delay` prop, with classes as listed in this task's Interfaces.

- [ ] **Step 7: Turn the section headings into `rise` groups**

Each `h2` (or title block) gets `data-draw` and its text through `rise`. The words, colours and outlines stay exactly as they are today:

| File | Element | `rise` parts |
|---|---|---|
| `about.tsx` | `h2` | `["Why", ["hire me", "text-red"], "for your", ["next project?", "outline-text"]]` |
| `portfolio.tsx` | `h2` | `["My latest", ["projects", "text-red"]]` |
| `experience.tsx` | `h2` | `[["Experience", "text-red"], "& education"]` |
| `skills.tsx` | the title `div` around the sheet label and `h2` → `data-draw` | label: `draw-wipe`; `h2`: `["My", ["toolkit", "text-red"]]` |
| `contact.tsx` | the sheet row `div` → `data-draw` | left label `draw-wipe`; rule `draw-x origin-left [--d:.05s] [--dur:.8s]`; status dot `draw-dot [--d:.65s]`; status text `draw-wipe-l [--d:.7s]` |
| `contact.tsx` | `h2` → `data-draw` | `rise(["Let's", "build"])`, then a `slot block` holding one `draw-rise` span at `at(0.25)` that contains the existing `outline-text` "something" and its red full stop |

- [ ] **Step 8: Type-check**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 9: Run the checks**

Run: `node $SCRATCH/motion/check.mjs`
Expected: all seven `PASS`.

---

### Task 2: Hero draws as the intro lifts, plus count-up

**Deliverable:** the hero draws itself in the approved `hero.html` sequence, starting at `intro-done`, and the two callout numbers count up.

**Files:**
- Modify: `components/motion.tsx` (count-up)
- Modify: `components/hero.tsx`
- Modify: `app/globals.css` (compass rules)
- Test: `$SCRATCH/motion/check.mjs` (add `hero`, `hero-skip`)

**Interfaces:**
- Consumes: Task 1's contract, and `Sheet`'s `delay`.
- Produces: `data-count` handling, used by Tasks 3 and 4.
- Produces: `countText(final: string, e: number): string`, internal to `motion.tsx`.

- [ ] **Step 1: Add the failing checks**

Add to `checks`:

```js
async hero() {
  const p = await open();
  await p.goto(URL);
  await p.waitForFunction(() => document.documentElement.classList.contains("motion"), null, { timeout: 15_000 });
  assert(!(await hasClass(p, "intro-done")), "intro-done set before the intro flew away");
  assert((await restless(p, "#home")).length > 0, "the hero should wait for the intro");
  await p.waitForFunction(() => document.documentElement.classList.contains("intro-done"), null, { timeout: 6000 });
  await p.waitForTimeout(3200);
  const left = await restless(p, "#home");
  assert(!left.length, `hero not drawn 3.2 s after intro-done: ${left.slice(0, 4).join(" | ")}`);
  assert((await p.$eval("#home .compass-draw", (e) => parseFloat(getComputedStyle(e).strokeDashoffset))) === 0, "compass circle not drawn");
  const nums = await p.$$eval("#home [data-count]", (es) => es.map((e) => e.textContent));
  assert(nums.join() === "3+,3.65", `callout numbers ended as ${nums}`);
},
async "hero-skip"() {
  const p = await open();
  await p.goto(URL);
  await p.waitForFunction(() => document.documentElement.classList.contains("motion"), null, { timeout: 15_000 });
  await p.keyboard.press("Space");
  await p.waitForFunction(() => document.documentElement.classList.contains("intro-done"), null, { timeout: 1500 });
  await p.waitForTimeout(3200);
  assert((await restless(p, "#home")).length === 0, "hero not drawn 3.2 s after skipping the intro");
},
```

- [ ] **Step 2: Run them to see them fail**

Run: `node $SCRATCH/motion/check.mjs hero hero-skip`
Expected: `FAIL hero: the hero should wait for the intro`. `hero-skip` may pass vacuously, which is fine.

- [ ] **Step 3: Add count-up to `components/motion.tsx`**

When a group gets `data-in`, run the count on the group itself (if it has `data-count`) and on every `[data-count]` inside it:
- Read `final` from the element's `textContent`.
- Read the delay from `parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0`, in seconds.
- Set the text to `countText(final, 0)` straight away.
- After the delay, animate `e` from 0 to 1 over 600 ms with `1 - (1 - u) ** 3` in `requestAnimationFrame`.
- Finish on exactly `final`.

The number format is fixed, so use this body:

```ts
/** final with every number scaled by e, keeping its decimals: ("3.65", .5) → "1.83", ("10–20", .5) → "5–10". */
const countText = (final: string, e: number) =>
  final.replace(/\d+(?:\.\d+)?/g, (n) => (parseFloat(n) * e).toFixed(n.split(".")[1]?.length ?? 0));
```

- [ ] **Step 4: Mark up the hero in `components/hero.tsx`**

The text column and the figure sit in the grid `div`, which gets `data-draw`. `Sheet` uses `delay={0.25}`. Delays are seconds after `data-in` (spec §6.1):

| Element | Classes and delay |
|---|---|
| "Hi! I'm" | `slot block` > `draw-rise` `at(0.3)` |
| "Yin" / "Sophaneth" lines | each `slot block` > `draw-rise inline-block` `at(0.38)` / `at(0.48)` (keep `outline-text` on Sophaneth) |
| red dash `span` | `draw-x origin-left` `at(0.8, 0.4)` |
| "ERP Systems Developer" | `draw-wipe` `at(0.88)` |
| lead `p` | `draw-wipe` `at(1.0, 0.9)` |
| socials | each `draw-wipe` `at(1.3 + i * 0.07)` |
| Download CV | `draw-wipe [--sh:-12px]` `at(1.55)` |
| Let's talk | `draw-wipe` `at(1.65)` |
| corners (4) | `draw-dot` with `origin-top-left` / `origin-top-right` / `origin-bottom-left` / `origin-bottom-right`, `at(0.35 + k * 0.05, 0.3)` |
| vertical / horizontal crosshair | `draw-y origin-top` `at(0.55)` / `draw-x origin-left` `at(0.6)` |
| photo `img` | `draw-wipe-up` `at(0.9)` |
| caption rule left / right | `draw-x origin-right` / `draw-x origin-left`, both `at(1.45, 0.5)` |
| caption text / end ticks | `draw-fade` `at(1.5)` / `at(1.6)` |
| "3+" callout | `leader(1.6, "origin-left")`; box `draw-wipe` `at(1.8)`; number `data-count` `at(1.85)` |
| "3.65" callout | `leader(1.8, "origin-right")`; box `draw-wipe-l` `at(2.0)`; number `data-count` `at(2.05)` |

Replace the shared `leader` fragment with `leader(d: number, origin: "origin-left" | "origin-right")`. It returns the dot (`draw-dot`, `at(d)`) and the line (`draw-x {origin}`, `at(d + 0.05, 0.3)`), and keeps today's sizes and colours.

**Compass circle.** Replace the dashed `span` (`left-[10%] top-[9%] aspect-square w-4/5 rounded-full border border-dashed border-ink opacity-55`) with an `aria-hidden` inline SVG of the same box: `viewBox="0 0 100 100"`, `overflow-visible`, `opacity-55`.
- Inside it, a `<mask id="hero-compass" maskUnits="userSpaceOnUse" x="-5" y="-5" width="110" height="110">` holds a white circle with class `compass-draw` and `cx=50 cy=50 r=49.5 pathLength=1 transform="rotate(-90 50 50)" stroke-width=6 fill=none`.
- The visible circle: `cx=50 cy=50 r=49.5 fill=none stroke=var(--ink) stroke-width=1 vector-effect=non-scaling-stroke stroke-dasharray="4 4" mask="url(#hero-compass)"`.
- Add a sibling `span.compass-pen` with the same box (`aria-hidden`), holding a 12 px red dot centred on its top edge. It is the pen.

- [ ] **Step 5: Add the compass rules to `app/globals.css`**

Put them under the vocabulary:

```css
.compass-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
.compass-pen { opacity: 0; pointer-events: none; }
@keyframes compass-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes compass-pen { 0% { transform: rotate(0); opacity: 1; } 96% { opacity: 1; } 100% { transform: rotate(360deg); opacity: 0; } }
.motion [data-draw]:not([data-in]) .compass-draw { stroke-dashoffset: 1; }
.motion [data-in] .compass-draw { animation: compass-draw 0.9s linear 0.65s backwards; }
.motion [data-in] .compass-pen { animation: compass-pen 0.9s linear 0.65s forwards; }
```

- [ ] **Step 6: Type-check, then run the checks**

Run: `npx tsc --noEmit && node $SCRATCH/motion/check.mjs hero hero-skip no-leftovers reduced-motion no-js`
Expected: all `PASS`.

---

### Task 3: About

**Deliverable:** the About section draws as specified in spec §6.3, and the stats count up.

**Files:**
- Modify: `components/about.tsx`
- Test: `$SCRATCH/motion/check.mjs` (add `about`)

**Interfaces:**
- Consumes: the vocabulary, `at`, and `data-count` (Task 2).

- [ ] **Step 1: Add the failing check**

```js
async about() {
  const p = await open();
  await load(p);
  const nums = "#about [data-count]";
  await p.$eval(nums, (e) => e.closest("[data-draw]").scrollIntoView({ block: "center", behavior: "instant" }));
  await p.waitForTimeout(300);
  const mid = await p.$$eval(nums, (es) => es.map((e) => e.textContent));
  assert(mid.length === 4 && parseFloat(mid[3]) < 3.65, `stats should still be counting up, read ${mid}`);
  await p.waitForTimeout(2000);
  const end = await p.$$eval(nums, (es) => es.map((e) => e.textContent));
  assert(end.join("|") === "3+|8|10–20|3.65", `stats ended as ${end}`);
  await center(p, "#about h2");
  await p.waitForTimeout(2500);
  const left = await restless(p, "#about");
  assert(!left.length, `About not fully drawn: ${left.slice(0, 4).join(" | ")}`);
},
```

- [ ] **Step 2: Run it to see it fail**

Run: `node $SCRATCH/motion/check.mjs about`
Expected: `FAIL about: … Cannot read properties of null` (there's no `[data-count]` yet), or "stats should still be counting up".

- [ ] **Step 3: Mark up `components/about.tsx`**

| Group (`data-draw`) | Elements |
|---|---|
| left column `div` (the `h2` keeps its own Task 1 group) | bio `p` `draw-wipe at(0.35, 0.7)`; pull quote: move its red rule into an absolutely positioned `span` (`left-0 inset-y-0 w-[3px] bg-red draw-y origin-top at(0.6, 0.4)`), keep `pl-3.5`, and wrap the text in `span.draw-wipe at(0.75)`; "Hire me" `draw-wipe [--sh:-12px] at(0.9)` |
| photo panel `div` (it is its own `draw-wipe [--dur:.7s]`) | "Fig. 2 — Elevation" tag `draw-wipe at(0.6)` |
| each service card (it is its own `draw-wipe`) | card `at(i * 0.12)` |
| stats strip `div` (it is its own `draw-wipe [--dur:.8s]`) | each number `div` gets `data-count` `at(0.2 + i * 0.08)` |

- [ ] **Step 4: Type-check, then run the checks**

Run: `npx tsc --noEmit && node $SCRATCH/motion/check.mjs about no-leftovers`
Expected: both `PASS`.

---

### Task 4: Portfolio

**Deliverable:** FlowBill and More projects draw as specified in spec §6.4, "300" counts up, and switching projects wipes the card in again.

**Files:**
- Modify: `components/portfolio.tsx`
- Test: `$SCRATCH/motion/check.mjs` (add `portfolio`)

**Interfaces:**
- Consumes: the vocabulary, `at`, `rise` and `data-count`.
- Produces: `data-switch` on the two re-keyed card children, used by the check.

- [ ] **Step 1: Add the failing check**

```js
async portfolio() {
  const p = await open();
  await load(p);
  for (const sel of ["#portfolio h2", "#portfolio h3", "#portfolio h4"]) {
    await center(p, sel);
    await p.waitForTimeout(1500);
  }
  let left = await restless(p, "#portfolio");
  assert(!left.length, `Portfolio not fully drawn: ${left.slice(0, 4).join(" | ")}`);
  assert((await p.$eval("#portfolio [data-count]", (e) => e.textContent)) === "300", "the 300 callout should end on 300");
  const before = await p.$eval("#portfolio h4", (e) => e.textContent);
  await p.click('button[aria-label="Next project"]');
  await p.waitForTimeout(80);
  assert((await restless(p, "#portfolio [data-switch]")).length > 0, "switching projects should wipe the card in again");
  await p.waitForTimeout(1000);
  left = await restless(p, "#portfolio");
  assert(!left.length && (await p.$eval("#portfolio h4", (e) => e.textContent)) !== before, "the next project did not finish drawing");
},
```

- [ ] **Step 2: Run it to see it fail**

Run: `node $SCRATCH/motion/check.mjs portfolio`
Expected: `FAIL portfolio: … failed to find element matching selector "#portfolio [data-count]"`.

- [ ] **Step 3: Mark up `components/portfolio.tsx`**

| Group (`data-draw`) | Elements |
|---|---|
| the side `p` "One in production, …" (it is its own group) | `draw-wipe at(0.4)` |
| FlowBill left column `div.relative` | `Browser` gets `className` `draw-wipe [--sh:-12px] [--dur:.7s]`; wrap `<Shot>` in `div.draw-wipe-up at(0.35)`; "300" callout box `draw-wipe [--d:.8s]`; the "300" `span` gets `data-count` `[--d:.85s]` |
| FlowBill right column `div` | tags row `draw-wipe`; `h3` as two slots: `[Flow+outline Bill]` `draw-rise at(0.1)` and `ERP` `draw-rise at(0.15)` (no space between Flow and Bill, as today); summary `p` `draw-wipe at(0.3, 0.7)`; each chip `draw-wipe at(0.45 + i * 0.05)`; stack line `draw-wipe at(0.8)`; "Read the case study" `draw-wipe [--sh:-12px] at(0.9)` |
| More projects header row | `h3` via `rise(["More", ["projects", "text-red"]], 0)`; counter-and-arrows `div` `draw-wipe-l at(0.2)` |
| the project card `div` (it is its own `draw-wipe [--dur:.6s]`) | its text `div` and its screenshot (`Browser` or "?" box) get `key={idx}`, `data-switch` and `draw-wipe` (`at(0)` and `at(0.1)`), so an arrow click re-mounts them and they wipe in again |

- [ ] **Step 4: Type-check, then run the checks**

Run: `npx tsc --noEmit && node $SCRATCH/motion/check.mjs portfolio no-leftovers`
Expected: both `PASS`.

---

### Task 5: Case study unroll

**Deliverable:** the case study unrolls from the top with a red pen line on its edge, and its first screen draws in. Every close path rolls it back up. Spec §6.5.

**Files:**
- Modify: `components/case-study.tsx`
- Modify: `app/globals.css` (replace the "Case-study open / close" block)
- Test: `$SCRATCH/motion/check.mjs` (add `case-study`, `case-close-early`)

**Interfaces:**
- Consumes: the vocabulary and `at`. The dialog carries a static `data-in=""`, so `draw-*` elements inside it play on mount.

- [ ] **Step 1: Add the failing checks**

```js
async "case-study"() {
  const p = await open();
  await load(p);
  const openIt = async () => {
    await center(p, "#portfolio h3");
    await p.click("text=Read the case study");
  };
  const closed = async (why) => {
    await p.waitForTimeout(900);
    assert(!(await p.$("dialog[open]")), `${why}: still open`);
    assert(await p.evaluate(() => document.body.style.overflow === ""), `${why}: page scroll not restored`);
  };
  await openIt();
  await p.waitForTimeout(150);
  assert(await p.$eval("dialog[open]", (d) => getComputedStyle(d).clipPath !== "none"), "the sheet should be unrolling");
  await p.waitForTimeout(1700);
  assert(await p.$eval("dialog[open]", (d) => getComputedStyle(d).clipPath === "none"), "the unroll left a clip");
  const left = await restless(p, "dialog");
  assert(!left.length, `case study first screen not drawn: ${left.slice(0, 4).join(" | ")}`);
  await p.keyboard.press("Escape");
  await closed("Esc");
  await openIt();
  await p.waitForTimeout(1200);
  await p.click('button[aria-label="Close case study"]');
  await closed("✕");
  await openIt();
  await p.waitForTimeout(1200);
  await p.click("text=← Back to portfolio");
  await closed("Back to portfolio");
  await openIt();
  await p.waitForTimeout(1200);
  await p.click("text=Build something like this");
  await closed("Build something like this");
  await p.waitForTimeout(1200);
  const top = await p.$eval("#contact", (e) => e.getBoundingClientRect().top);
  assert(Math.abs(top) < 120, `"Build something like this" should land on Contact (its top is at ${top}px)`);
},
async "case-close-early"() {
  const p = await open();
  await load(p);
  await center(p, "#portfolio h3");
  await p.click("text=Read the case study");
  await p.waitForTimeout(150);
  await p.keyboard.press("Escape");
  await p.waitForTimeout(1000);
  assert(!(await p.$("dialog[open]")), "closing during the unroll left the case study open");
  assert(await p.evaluate(() => document.body.style.overflow === ""), "page scroll not restored");
},
```

- [ ] **Step 2: Run them to see them fail**

Run: `node $SCRATCH/motion/check.mjs case-study case-close-early`
Expected: `FAIL case-study: the sheet should be unrolling`.

- [ ] **Step 3: Replace the case-study CSS in `app/globals.css`**

Delete the `sheet-in`, `sheet-out` and `.cs-overlay` rules from the "Case-study open / close" block. Keep `fade-in` and `fade-out` (`.cs-shot` still uses `fade-in`). Add:

```css
@keyframes cs-unroll { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0); } }
@keyframes cs-rollup { from { clip-path: inset(0); } to { clip-path: inset(0 0 100% 0); } }
@keyframes cs-pen { from { transform: translateY(0); opacity: 1; } 90% { opacity: 1; } to { transform: translateY(100dvh); opacity: 0; } }
@media (prefers-reduced-motion: no-preference) {
  .cs-overlay { animation: cs-unroll 0.65s var(--ease-draw) 0.05s backwards; }
  .cs-overlay::backdrop { animation: fade-in 0.3s ease-out; }
  /* the red pen line riding the unroll edge, as wide as the sheet */
  .cs-overlay::after {
    content: "";
    position: fixed;
    top: -2px;
    left: 0;
    right: 0;
    max-width: 1280px;
    margin-inline: auto;
    height: 2px;
    background: var(--red);
    pointer-events: none;
    animation: cs-pen 0.65s var(--ease-draw) 0.05s both;
  }
  .cs-overlay[data-closing] { animation: cs-rollup 0.4s cubic-bezier(0.4, 0, 1, 1) both; }
  .cs-overlay[data-closing]::backdrop { animation: fade-out 0.3s ease-in 0.1s both; }
  .cs-overlay[data-closing]::after { content: none; }
  .cs-shot { animation: fade-in 0.3s ease-out; }
}
```

- [ ] **Step 4: Update `components/case-study.tsx`**

- On the `dialog`:
  - Swap `bg-[rgba(14,30,80,.72)]` for `bg-transparent`.
  - Swap `backdrop:bg-transparent` for `backdrop:bg-[rgba(14,30,80,.72)]`.
  - Add `data-in=""`.
- Close on the roll-up: change `onAnimationEnd` to close only when `closing && e.target === e.currentTarget && e.animationName === "cs-rollup"`. Child wipes and the backdrop also end animations.
- First-screen draws:
  - `h2` lines: each `slot block` > `draw-rise inline-block`, at `[--d:.55s]` and `[--d:.62s]`.
  - Tagline row: `draw-wipe [--d:.7s]`.
  - "Title block" header row: `draw-wipe [--d:.62s]`.
  - Each fact row: `draw-wipe` `at(0.69 + k * 0.07)`.
  - Overview `p`: `draw-wipe [--d:.9s] [--dur:.7s]`.
  - Gallery `Browser`: `draw-wipe [--d:1s]`.

  Nothing below the gallery animates (spec §9, call 4).

- [ ] **Step 5: Type-check, then run the checks**

Run: `npx tsc --noEmit && node $SCRATCH/motion/check.mjs case-study case-close-early reduced-motion`
Expected: all `PASS`.

---

### Task 6: Experience line follows the scroll

**Deliverable:** the timeline line grows with the visitor's scroll and never shrinks. Each row draws when the line reaches it. Spec §6.6.

**Files:**
- Modify: `components/experience.tsx` (becomes `"use client"`)
- Modify: `app/globals.css` (segment rule)
- Test: `$SCRATCH/motion/check.mjs` (add `experience`, `experience-hash`)

**Interfaces:**
- Consumes: the vocabulary. Rows use `data-in`, set by this component, not by `<Motion />`.
- Produces: class `tl-seg` on each row's line segment, `data-tl-row` on each row's `contents` wrapper, and `tl-mark` on each row's square marker.

- [ ] **Step 1: Add the failing checks**

```js
async experience() {
  const p = await open(SIZES[2]);
  await load(p);
  const read = () =>
    p.evaluate(() => ({
      seg: [...document.querySelectorAll("#experience .tl-seg")].map((e) => new DOMMatrix(getComputedStyle(e).transform).d),
      rows: [...document.querySelectorAll("#experience [data-tl-row]")].map((e) => e.hasAttribute("data-in")),
    }));
  const top = await p.$eval("#experience", (e) => e.getBoundingClientRect().top + scrollY);
  const end = top + (await p.$eval("#experience", (e) => e.offsetHeight));
  let prev = await read();
  assert(prev.seg.length === 3 && prev.seg.every((s) => s === 0), `the line should start undrawn: ${prev.seg}`);
  const ys = [];
  for (let y = top - 900; y <= end; y += 120) ys.push(y);
  for (let y = end; y >= top - 400; y -= 300) ys.push(y); // then back up
  for (const y of ys) {
    await jump(p, y);
    await p.waitForTimeout(160);
    const now = await read();
    now.seg.forEach((s, i) => assert(s >= prev.seg[i] - 1e-6, `segment ${i} shrank from ${prev.seg[i]} to ${s} at y=${y}`));
    now.rows.forEach((r, i) => assert(r || !prev.rows[i], `row ${i} switched off at y=${y}`));
    prev = now;
  }
  assert(prev.seg.every((s) => s > 0.999) && prev.rows.every(Boolean), `not finished: ${JSON.stringify(prev)}`);
  await p.waitForTimeout(1000);
  assert((await restless(p, "#experience")).length === 0, "a row did not finish drawing");
},
async "experience-hash"() {
  const p = await open();
  await load(p, "#experience");
  await p.waitForTimeout(1500);
  const rows = await p.$$eval("#experience [data-tl-row]", (es) => es.map((e) => e.hasAttribute("data-in")));
  assert(rows[0], `rows the pen has passed should draw when the page opens at #experience: ${rows}`);
},
```

- [ ] **Step 2: Run them to see them fail**

Run: `node $SCRATCH/motion/check.mjs experience experience-hash`
Expected: `FAIL experience: the line should start undrawn:` (there are no `.tl-seg` elements yet).

- [ ] **Step 3: Add the segment rule to `app/globals.css`**

```css
.motion .tl-seg { transform: scaleY(0); transform-origin: top; transition: transform 0.08s linear; }
```

- [ ] **Step 4: Rewrite `components/experience.tsx` as a client component**

**Markup**
- Each row's `contents` wrapper gets `data-tl-row`.
- The existing line `span` gets class `tl-seg`.
- The square marker gets `tl-mark draw-dot`.
- The year moves into a `slot block` > `draw-rise inline-block`.
- "→ end" gets `draw-wipe at(0.1)`.
- Kind, title, organisation, description and tags each get `draw-wipe` `at(0.1 + k * 0.05)`.
- The last row's end tick gets `draw-x origin-left at(0.3)`.

**Effect** (a `ref` on the grid, `useEffect(…, [])`)
1. If reduced motion matches, return.
2. `pen = innerHeight * 0.6`, read on every update.
3. For each segment `i`: `best[i] = max(best[i], clamp((pen - rect.top) / rect.height))`, then write `style.transform = scaleY(best[i])`.
4. For each row whose `.tl-mark` `rect.top + 8 <= pen`: set `data-in` on the row. It is never removed.
5. Run the update once on mount, then on `scroll` (passive) through a single pending `requestAnimationFrame`, and on `resize`.
6. Once every `best` is 1 and every row has `data-in`, remove the listeners.

Segments touch end to end, so one pen draws one continuous line (spec §6.6).

- [ ] **Step 5: Type-check, then run the checks**

Run: `npx tsc --noEmit && node $SCRATCH/motion/check.mjs experience experience-hash reduced-motion no-js no-leftovers`
Expected: all `PASS`.

---

### Task 7: Toolkit builds with the scroll, plus hover extras

**Deliverable:** the orbit builds as the visitor scrolls, finishes at the middle of the screen, then spins. Logos never tilt. Hovering a tool lifts it, and hovering a ring row highlights that ring. Spec §6.7.

**Files:**
- Modify: `components/skills.tsx`
- Test: `$SCRATCH/motion/check.mjs` (add `toolkit`, `toolkit-hash`, `toolkit-resize`, `toolkit-hover`)

**Interfaces:**
- Consumes: the vocabulary (ring list rows use `draw-wipe` and get `data-in` from this component).
- Produces these build hooks:
  - `data-b="cross"` on both crosshair spans,
  - `data-b="core"` on the YS disc,
  - `data-b="ring"` + `data-i` on each ring circle,
  - `data-b="chip"` + `data-i` + `data-j` on each tool,
  - `data-layer={i}` on each ring `div`,
  - `data-ring={i}` on each list row.
- Build state lives only in CSS variables on those elements:
  - `--bs`: scale factor.
  - `--bx`, `--by`: offset from the final spot, in px of the 740 drawing.
  - `--bo`: opacity.

  No code ever writes a chip's `transform`.

- [ ] **Step 1: Add the failing checks**

```js
// Each tool's opacity, whether it is still building, and its on-screen tilt (ring rotation × counter-rotation).
const chips = (p) =>
  p.evaluate(() =>
    [...document.querySelectorAll('#skills [data-b="chip"]')].map((c) => {
      const m = new DOMMatrix(getComputedStyle(c.parentElement).transform).multiply(new DOMMatrix(getComputedStyle(c).transform));
      return { tilt: Math.abs((Math.atan2(m.b, m.a) * 180) / Math.PI), op: +getComputedStyle(c).opacity, building: c.style.getPropertyValue("--bx") !== "" };
    }),
  );
const ORBIT = '#skills [role="img"]';
const orbitBox = (p) => p.$eval(ORBIT, (e) => ({ top: e.getBoundingClientRect().top + scrollY, h: e.offsetHeight }));
const built = (cs) => cs.every((c) => !c.building && c.op === 1);
```

Add to `checks`:

```js
async toolkit() {
  const p = await open();
  await load(p);
  const { top, h } = await orbitBox(p);
  await jump(p, top - 900 + 40); // orbit top just on screen
  await p.waitForTimeout(200);
  assert((await chips(p)).every((c) => c.op < 0.01), "tools should start hidden inside the YS disc");
  await jump(p, top + h / 2 - 450 - 200); // part way
  await p.waitForTimeout(200);
  const mid = await chips(p);
  assert(mid.some((c) => c.op > 0) && mid.some((c) => c.building), "the toolkit should be part-built part way");
  await jump(p, top + h / 2 - 450); // centre at the middle of a 900 px screen
  await p.waitForTimeout(300);
  assert(built(await chips(p)), "the toolkit should be fully built when its centre reaches the middle");
  await p.waitForTimeout(6000); // let it spin
  await jump(p, top - 300);
  await p.waitForTimeout(150);
  await jump(p, top + 200);
  await p.waitForTimeout(300);
  const s = await chips(p);
  assert(s.every((c) => c.tilt < 0.5), `tools tilted, worst ${Math.max(...s.map((c) => c.tilt)).toFixed(1)}°`);
  await jump(p, 0);
  await p.waitForTimeout(300);
  await center(p, ORBIT);
  assert(built(await chips(p)), "the toolkit should stay built after scrolling up");
  assert((await restless(p, "#skills")).length === 0, "ring list rows not drawn");
},
async "toolkit-hash"() {
  const p = await open();
  await load(p, "#contact"); // opens past the toolkit
  await center(p, ORBIT);
  await p.waitForTimeout(200);
  assert(built(await chips(p)), "a toolkit already scrolled past should be built at once");
},
async "toolkit-resize"() {
  const p = await open();
  await load(p);
  const { top, h } = await orbitBox(p);
  await jump(p, top + h / 2 - 450 - 200);
  await p.waitForTimeout(200);
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(400);
  await center(p, ORBIT);
  await p.waitForTimeout(400);
  const s = await chips(p);
  assert(built(s) && s.every((c) => c.tilt < 0.5), "after a resize mid-build the toolkit should finish built and upright");
  assert(await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), "page scrolls sideways after resize");
},
async "toolkit-hover"() {
  const p = await open();
  await load(p);
  await center(p, ORBIT);
  await p.waitForTimeout(500);
  await p.hover('#skills [data-ring="0"]');
  await p.waitForTimeout(400);
  const on = await p.$$eval("#skills [data-layer]", (es) => es.map((e) => +getComputedStyle(e).opacity));
  assert(on[0] === 1 && on.slice(1).every((o) => o <= 0.2), `hovering R1 should fade the other rings: ${on}`);
  await p.mouse.move(5, 5);
  await p.waitForTimeout(400);
  const off = await p.$$eval("#skills [data-layer]", (es) => es.map((e) => +getComputedStyle(e).opacity));
  assert(off.every((o) => o === 1), `rings should return to full: ${off}`);
},
```

- [ ] **Step 2: Run them to see them fail**

Run: `node $SCRATCH/motion/check.mjs toolkit toolkit-hash toolkit-resize toolkit-hover`
Expected: `FAIL toolkit: tools should start hidden inside the YS disc`.

- [ ] **Step 3: Move every build-able transform onto CSS variables in the JSX**

The variables default to the finished look, so with no JS or with reduced motion nothing changes:

| Element | `style` |
|---|---|
| vertical / horizontal crosshair | `transform: scaleY(var(--bs,1))` / `scaleX(var(--bs,1))`, with transform-origin at the centre |
| ring circle | `transform: scale(var(--bs,1))` |
| YS disc | `transform: scale(calc(${chip} * var(--bs,1)))` (replaces `scale(${chip})`) |
| tool | `transform: translate(calc(-50% + var(--bx,0px)), calc(-50% + var(--by,0px))) rotate(calc(var(--r,0deg) * -1)) scale(calc(${chip} * var(--bs,1)))`, `opacity: var(--bo,1)` |

Add the `data-*` hooks from this task's Interfaces. Each ring list row gets `draw-wipe`. The "Scale 1 : x / N parts" row becomes its own `data-draw` group with `draw-wipe`.

- [ ] **Step 4: Build inside the existing spin effect**

The effect already returns under reduced motion, so the build is skipped there too.
1. Cache the hooks once.
2. Each frame, `q = clamp((innerHeight - r.top) / (innerHeight / 2 + r.height / 2))` from the orbit box's `getBoundingClientRect()`, then `best = max(best, q)`. Start `best` at `-1` so the first frame always writes.
3. Only when `best` grew, write, with `ph(from, len) = o3(clamp((best - from) / len))`:
   - cross `--bs = ph(0, .3)`
   - core `--bs = ph(.05, .2)`
   - ring `i` `--bs = ph(.10 + .12i, .35)`
   - list row `i` gets `data-in` when `best ≥ .10 + .12i`
   - tool `(i, j)`: `u = ph(.25 + .14i + .012j, .3)`, then `--bx = (370 − x)(1 − u)px`, `--by = (370 − y)(1 − u)px`, `--bs = .3 + .7u`, and `--bo = u > 0 ? 1 : 0`
4. When `best` reaches 1:
   - `removeProperty` every build variable,
   - set `data-in` on all rows,
   - mark the build done, and never write build variables again.
5. **Spin:** angles advance only after the build is done. `run` starts at `0` (today it is `1`), so the spin eases up. The fast-scroll boost applies only after the build.

- [ ] **Step 5: Add the hover extras**

**Tools**
- The tool `div` gets `group`.
- Its disc gets `transition-[translate,box-shadow] duration-150 group-hover:-translate-x-[3px] group-hover:-translate-y-[3px] group-hover:shadow-[3px_3px_0_var(--ink)]`.
- When `labels` is false, render a name tag under the disc. It's absolutely positioned at `top-[60px]`, uses the existing label's look (`bg-ink text-paper`, mono 10px), and has `[clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-200 group-hover:[clip-path:inset(0)]`.

**Ring rows**
- Add `const [hl, setHl] = useState<number | null>(null)`.
- Rows: `onMouseEnter={() => setHl(i)}`, `onMouseLeave={() => setHl(null)}`, and `bg-card` while `hl === i`.
- Ring layer: `opacity: hl === null || hl === i ? 1 : 0.18`, with `transition-opacity duration-200`.
- Ring circle: `border-solid border-red` while `hl === i`, otherwise today's `border-dashed border-ink`.
- Keep the existing pause on hovering the orbit.

- [ ] **Step 6: Type-check, then run the checks**

Run: `npx tsc --noEmit && node $SCRATCH/motion/check.mjs toolkit toolkit-hash toolkit-resize toolkit-hover reduced-motion no-leftovers`
Expected: all `PASS`.

---

### Task 8: Contact

**Deliverable:** the Contact section draws as specified in spec §6.8, including the textarea's ruled lines.

**Files:**
- Modify: `components/contact.tsx`
- Test: `$SCRATCH/motion/check.mjs` (add `contact`)

**Interfaces:**
- Consumes: the vocabulary and `at`.

- [ ] **Step 1: Add the failing check**

```js
async contact() {
  const p = await open();
  await load(p);
  for (const sel of ["#contact h2", "#contact form", "#contact footer"]) {
    await center(p, sel);
    await p.waitForTimeout(1800);
  }
  const left = await restless(p, "#contact");
  assert(!left.length, `Contact not fully drawn: ${left.slice(0, 4).join(" | ")}`);
  assert((await p.$eval("#contact textarea", (e) => getComputedStyle(e).backgroundSize)) === "100% 28px", "textarea lines did not draw");
  assert((await p.$$eval("#contact .draw-lines", (e) => e.length)) === 1, "the textarea should carry draw-lines");
},
```

- [ ] **Step 2: Run it to see it fail**

Run: `node $SCRATCH/motion/check.mjs contact`
Expected: `FAIL contact: the textarea should carry draw-lines`.

- [ ] **Step 3: Mark up `components/contact.tsx`**

| Group (`data-draw`) | Elements |
|---|---|
| left column `div` (the `h2` keeps its Task 1 group) | lead `p` `draw-wipe at(0.3, 0.7)`; each info row `draw-wipe at(0.4 + i * 0.08)`; Download CV `draw-wipe [--sh:-12px] at(0.8)` |
| form side `div.relative` | `form` `draw-wipe [--sh:-12px] [--dur:.7s]`; "< 24h" tab `draw-wipe at(0.5)`; form header `div` `draw-wipe at(0.35)`; each topic chip `draw-wipe at(0.45 + i * 0.05)`; name / email / message labels `draw-wipe` `at(0.6)` / `at(0.65)` / `at(0.7)`; `textarea` `draw-lines at(0.9)`; submit `draw-wipe [--sh:-12px] at(0.85)` |
| `footer` | each cell `draw-wipe at(i * 0.1)` |

- [ ] **Step 4: Type-check, then run the checks**

Run: `npx tsc --noEmit && node $SCRATCH/motion/check.mjs contact anchor-jump no-leftovers`
Expected: all `PASS`.

---

### Task 9: Whole-site verification and handover

**Deliverable:** every check passes at every size and in both themes, the static build succeeds, and the owner has the review notes.

**Files:**
- Test: `$SCRATCH/motion/check.mjs` (add `cyanotype`)

- [ ] **Step 1: Add the Cyanotype check (Review Focus 4)**

```js
async cyanotype() {
  const p = await open();
  await p.addInitScript(() => localStorage.setItem("theme", "cyanotype"));
  await load(p);
  await scrollPass(p);
  assert((await p.evaluate(() => document.documentElement.dataset.theme)) === "cyanotype", "theme not applied");
  const left = await restless(p);
  assert(!left.length && !p.errors.length, `Cyanotype: hidden ${left.slice(0, 4).join(" | ")} errors ${p.errors.join(" | ")}`);
},
```

- [ ] **Step 2: Run every check**

Run: `node $SCRATCH/motion/check.mjs`
Expected: 21 lines, every one `PASS`, exit 0.

- [ ] **Step 3: Check the rules by search**

| Run | Expected |
|---|---|
| `git diff --stat -- package.json package-lock.json` | no output (no new dependency) |
| `grep -rnE "cubic-bezier\([^)]*1\.[0-9]" app components` | no output (no overshoot curve) |
| `grep -rnE "display:\s*none\|visibility:\s*hidden" app/globals.css` | only the existing intro failsafe and `.no-intro .intro` lines |

- [ ] **Step 4: Production build**

Stop the dev server. Run `npm run build`, then restart `npm run dev`.
Expected: the build ends with the static export summary and exits 0.

- [ ] **Step 5: Hand over to the owner**

Tell the owner the work is ready to review at http://localhost:1688, on desktop and phone, in both themes. Remind them that nothing is committed: when they're happy, they ask for the commit through `github-push`.
