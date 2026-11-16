# Site motion: design

Date: 2026-11-16. Owner: Yin Sophaneth. Status: waiting for the owner's approval.

Mockups the owner reviewed (local only, git-ignored): `.superpowers/brainstorm/775-1794766931/content/`
(`motion-style.html`, `timing.html`, `case-open.html`, `toolkit-v2.html`, `hero.html`).

## 1. Intent

The blueprint redesign is finished and looks right when it's still, but nothing moves when you scroll.
The owner wants the whole portfolio to feel alive: the page should look like a drawing being made in
front of the visitor as they scroll down. The old "keep motion minimal" rules (2026-11-11 cleanup plan)
were written for the previous design and don't apply here.

What success looks like: a visitor scrolls down and every section *draws itself* once, crisply, in the
blueprint language (pen lines, text rising out of slots, wipes). Two parts follow the visitor's scroll:
the Experience line and the toolkit. Nothing makes them wait, and nothing ever undoes itself.

## 2. Decisions the owner made

| Topic | Decision |
|---|---|
| Style | **Drafted**: lines draw like a pen, text slides up out of a slot, things wipe in left to right. Crisp, **no bounce or overshoot anywhere**. (The owner briefly picked "Stamped", then switched to Drafted.) |
| When | Each part draws **once**, the first time the visitor reaches it, and then stays finished. Scrolling back up never undoes anything. |
| Experience line | Grows with the visitor's scroll like a download bar, and **never shrinks back** when they scroll up. Each dot and its text appear the moment the line reaches them. |
| Case study open/close | **Unroll**: the sheet pulls down from the top with a red pen line riding its bottom edge, then the title rises and the rows wipe in. Closing rolls it back up. |
| Toolkit | **Builds with your scroll**: scrolling opens the rings and pushes each tool out of the YS disc onto its ring. It is finished when the orbit reaches the middle of the screen, then the slow spin starts. Scrolling back up leaves it built. |
| Toolkit logos | Logos and name tags **always stay upright**: while building, while spinning, and while scrolling. (The owner caught a mockup bug where they turned upside down.) |
| Hero | Approved as mocked up in `hero.html` (sequence in §6.1). |

## 3. Goals, non-goals, anti-goals

**Goals**
- Every section draws itself once, in the Drafted style, as it comes on screen.
- The hero draws itself as the intro lifts away, so the two feel like one move.
- The Experience line and the toolkit build follow the scroll, and only move forward.
- The case study unrolls open and rolls closed.
- It works the same on phones, tablets and desktops, in both themes (Paper and Cyanotype).

**Non-goals**
- No new npm dependency (no `motion`, GSAP or Lenis).
- No change to the page-load intro's own animation, the mobile menu, or the button press.
- No scroll reveals inside the case study below its first screen; that content is just there.
- No cursor effects, parallax, pinned or "scroll-jacked" sections, or looping animation. The orbit's
  existing slow spin is the only thing that loops.

**Anti-goals (it fails if any of these happen, even if it "works")**
- Content stays hidden because JavaScript failed, loaded late, or the visitor scrolled fast.
- A visitor has to wait for an animation before they can read or click something.
- Anything bounces, wobbles or overshoots.
- Toolkit logos tilt or turn upside down.
- Scrolling becomes janky on a mid-range phone.
- Visitors who ask for reduced motion see any movement.

## 4. Constraints

- Stack: Next.js 15 static export (`output: "export"`), React 19, Tailwind 4 with tokens in
  `app/globals.css`. Hosted on GitHub Pages under a base path (`lib/data.ts` → `base`).
- Hero, About and Experience are server components today. Keep sections server components where
  possible; put browser code in small client pieces.
- Colours only through the existing CSS variables, so Cyanotype keeps working.
- Animate only `transform`, `opacity`, `clip-path`, `stroke-dashoffset`, and one `background-size`
  (contact textarea). Nothing that changes layout.
- Owner's git rules: no commits until the owner asks through the `github-push` skill, never push, and no
  co-author lines. This doc is therefore **not** committed yet (the brainstorming skill's "commit the
  spec" step is overridden by that rule).

## 5. Approaches considered

1. **Plain CSS plus one small observer script (chosen).** Keyframes live in `globals.css`. One client
   component, mounted once, marks each part as it reaches the screen. The Experience line and the
   toolkit build use a few lines of scroll code each.
   - Zero new dependencies, almost no added JS.
   - Matches how the intro, case study and orbit are already built.
2. **Re-add the `motion` library.** React-friendly (`whileInView`, `useScroll`), but about 35 KB more JS,
   turns most sections into client components, and the redesign removed it on purpose.
3. **GSAP + ScrollTrigger.** Most powerful, but about 50 KB, and a second animation system next to the
   CSS. Too much for "draw once, plus two scroll-linked parts".

**Rejected along the way:** pure CSS scroll-driven animations (`animation-timeline: view()`, Baseline
since Firefox 159, October 2026) for the Experience line and toolkit. They scrub backwards when the
visitor scrolls up, and the owner chose "never goes back", so those two need a small script that keeps
the furthest point reached (a high-water mark).

The owner talked about look and feel, not tools, so approach 1 is the builder's call, and it was stated to
the owner before this doc was written.

## 6. Design

### 6.0 Shared mechanism

**Who sees motion.** A new client component `components/motion.tsx` is mounted once in `app/layout.tsx`
(next to `<Intro />`). On mount, if `prefers-reduced-motion: reduce` does **not** match, it adds the class
`motion` to `<html>`. Every hidden starting state is scoped under `html.motion`. So visitors without JS,
visitors who want reduced motion, and crawlers all get the finished page with nothing hidden.

**Reaching a part.** Parts that draw are marked with `data-draw` (one per *group*, e.g. a heading block or
a card grid). The component waits until `<html>` has `intro-done` (§6.1), so nothing finishes drawing
hidden under the intro. Then it makes one `IntersectionObserver` with `threshold: 0` and
`rootMargin: "0px 0px -12% 0px"`. That means a group triggers as soon as its top passes 88% down the
screen, which also works for groups taller than the screen. When a group intersects, the component sets
`data-in` on it and stops watching it. Children animate with their own delays, set as an inline CSS
variable `--d` (seconds).

**Never stuck hidden.**
- If JS never runs, `html.motion` is never added, so nothing is hidden.
- Groups the visitor skips past (for example by clicking a nav link) draw when they later scroll back to
  them. That is still "the first time you reach it".
- Hero fallback: the component sets `intro-done` on `<html>` after 4.5 s if the intro hasn't set it
  (see §6.1).

**Vocabulary.** These are CSS classes in `globals.css`. Each runs when an ancestor has `data-in` (or, for
the hero, when `<html>` has `intro-done`). Use `animation-fill-mode: backwards` so that after the
animation the element is back to its normal style, with no leftover clip or transform. Easing tokens on
`:root`:
- `--ease-draw: cubic-bezier(.65,0,.35,1)` for pen-like moves.
- `--ease-rise: cubic-bezier(.16,1,.3,1)` for text rising.

| Class | Hidden state | Move | Default timing |
|---|---|---|---|
| `draw-rise` (inside a `.slot`, which is `overflow: hidden`) | `translateY(105%)` | rises into place | 0.75 s, `--ease-rise` |
| `draw-wipe` | `clip-path: inset(0 100% 0 0)` | wipes left → right | 0.5 s, `--ease-draw` |
| `draw-wipe-l` | `inset(0 0 0 100%)` | wipes right → left | 0.45 s |
| `draw-wipe-up` | `inset(100% 0 0 0)` | wipes bottom → top | 0.9 s |
| `draw-x` / `draw-y` | `scaleX(0)` / `scaleY(0)`, origin set per use | line draws | 0.6–0.8 s, `--ease-draw` |
| `draw-dot` | `scale(0)` | dot appears, no overshoot | 0.22 s, ease-out |
| `draw-fade` | `opacity: 0` | fades | 0.5 s (captions only) |

**Further rules for the vocabulary**
- **Shadows:** for elements with an offset shadow (red buttons, the FlowBill frame, the form card), the
  wipe's visible end uses negative right and bottom insets (for example `inset(0 -12px -12px 0)`), so the
  shadow isn't cut off mid-animation.
- **Headings:** section `h2`s and project titles rise **word by word**. Each word sits in its own slot,
  0.05 s apart, keeping its colour or outline. This is the builder's call, because line breaks change
  with screen width.
- **Slots:** a slot gets a little bottom padding (about 0.06 em) with a matching negative margin, so
  descenders and outline strokes aren't clipped. Verify `outline-text` words at every breakpoint.

**Count-up.** Elements with `data-count` animate their number from 0 over 0.6 s (ease-out cubic) when
their group draws, after their own `--d`.
- Keep decimals and any non-digit text: "3+" counts 0 → 3 then shows "+", "3.65" counts 0.00 → 3.65, and
  "10–20" counts both numbers.
- The server-rendered text is the final value, so no-JS and reduced-motion visitors see real numbers.

### 6.1 Hero (approved mockup: `hero.html`)

**Trigger.** The intro adds `intro-done` to `<html>` when its letter columns start flying away. That is
`t = 2.40 s` in `INTRO`, or immediately when the visitor skips, or in `finish()` if it ends early. The
hero's delays count from that moment, so it draws while the columns fly off.

**Sequence** (seconds after `intro-done`):

| Time | Piece | Move |
|---|---|---|
| 0.25 | "Sheet 01 / Home" label | wipe |
| 0.30 | sheet rule | draw-x from left |
| 0.90 | "DWG No. YS-2026" | wipe-l |
| 0.30 | "Hi! I'm" | rise |
| 0.38 / 0.48 | "YIN" / "SOPHANETH" | rise (whole line each; the hero has fixed line breaks) |
| 0.80 | red dash | draw-x, 0.4 s |
| 0.88 | "ERP Systems Developer" | wipe |
| 1.00 | lead paragraph | wipe, 0.9 s, as one piece |
| 1.30 / 1.37 / 1.44 | GitHub / Telegram / Email | wipe |
| 1.55 / 1.65 | Download CV (with its shadow) / Let's talk | wipe |
| 0.35–0.50 | four frame corners, 0.05 s apart | scale 0 → 1 from their own corner, 0.3 s, `--ease-rise` |
| 0.55 / 0.60 | vertical / horizontal crosshair | draw-y from top / draw-x from left, 0.7 s |
| 0.65 | dashed circle | compass draw, 0.9 s linear, from 12 o'clock clockwise, with a red pen dot riding the tip (fades at the end) |
| 0.90 | photo | wipe-up, 0.9 s |
| 1.45 | caption rules | draw outward from the caption text |
| 1.50 / 1.60 | caption text / end ticks | fade |
| 1.60 → 1.85 | "3+" callout | dot, then leader (draws away from the photo), then box wipe at 1.80, count at 1.85 |
| 1.80 → 2.05 | "3.65" callout | dot, leader, box wipe-l at 2.00, count 0.00 → 3.65 at 2.05 |

**Compass circle.** Replace today's dashed `span` (rounded, `border-dashed`, opacity .55) with an inline
SVG of the same size and position. The dashed circle is masked by a solid circle whose
`stroke-dashoffset` animates from 1 to 0 (`pathLength="1"`, rotated -90° so it starts at the top).

### 6.2 Every section opener

The `Sheet` row in `components/ui.tsx` draws for every section:
1. The left label wipes in.
2. The rule draws from the left (0.8 s).
3. The right-hand label wipes in from the right at 0.6 s.

The section `h2` then rises word by word, starting at 0.15 s. This applies to About, Portfolio,
Experience, Skills (its own header markup) and Contact (its own sheet row markup).

### 6.3 About

- Bio paragraph: wipe (0.7 s).
- Pull quote: the red left rule draws downwards, then the text wipes in.
- "Hire me": wipe, with its shadow.
- Fig. 2 photo panel: wipes left → right (0.7 s). Its "Fig. 2 — Elevation" tag wipes in after.
- Cards A, B, C: wipe in 0.12 s apart. On phones, where they stack, each card is its own group.
- Stats strip: the cells wipe in 0.08 s apart and each number counts up ("3+", "8", "10–20", "3.65").

### 6.4 Portfolio

FlowBill (drawing 01):
- The browser frame plots in left → right, including its address bar and shadow. Then the screenshot
  wipes up inside it.
- The "300" callout wipes in after the frame and counts 0 → 300.
- The text column follows in order:
  1. Status tags.
  2. The FLOW/BILL ERP title, word by word.
  3. The summary (wipe).
  4. Feature chips, 0.05 s apart.
  5. The stack line.
  6. "Read the case study".

More projects:
- The header row and arrows wipe in, then the card wipes in.
- **Switching projects** with the arrows re-keys the card content, so it wipes in again (0.45 s), left to
  right. There's no exit animation.

### 6.5 Case study (Unroll; approved mockup: `case-open.html`)

**Opening**
- The blue dim moves from the dialog's own background to `::backdrop`, which fades in over 0.3 s. The
  dialog's background becomes transparent.
- The dialog (fixed, full screen) unrolls with `clip-path` from `inset(0 0 100% 0)` to `inset(0)`:
  0.65 s, `--ease-draw`, starting at 0.05 s. Clipping the dialog rather than the sheet keeps the unroll
  screen-sized however long the sheet is.
- A 2 px red pen line rides the unroll edge. It's a pseudo-element of the dialog, fixed at the top, as
  wide as the sheet, and moves `translateY(0 → 100dvh)` with the same timing, fading out at the end.
- Then the first-screen content draws:
  - The FLOW/BILL title rises at 0.55 s.
  - The tagline wipes in.
  - The title-block rows wipe in at 0.62 s and 0.07 s apart.
  - The overview paragraph wipes in at 0.9 s.
  - The gallery frame wipes in at 1.0 s.

**Closing (✕, Esc, "Back to portfolio", "Build something like this")**
- The dialog rolls up: `clip-path` back to `inset(0 0 100% 0)`, 0.4 s, accelerating.
- The `::backdrop` fades out over 0.25 s, starting at 0.2 s.
- The dialog really closes on that backdrop fade's `animationend`. Check `animationName`, because
  `::backdrop` and dialog animation events both arrive on the dialog.
- Esc still animates out (keep the existing `onCancel` `preventDefault`).

**Unchanged:** reduced-motion visitors get an instant open and close (existing), as do the scroll lock,
focus handling, ←/→ gallery keys and the screenshot fade.

### 6.6 Experience (scroll-linked, never goes back)

**Structure.** Keep today's per-row line segments. They touch end to end, so driving every segment from
the same pen draws **one continuous line**. Each segment's `scaleY` (from its top) is how far the pen has
passed down that segment, kept at its highest value.

**Progress**
- Use a "pen" point 60% down the screen.
- Progress `p` = how far the pen has passed down the timeline, from 0 to 1, but always kept at the
  **highest value reached** (it never goes back down).
- On scroll, inside a `requestAnimationFrame` with a passive listener, set the line's `transform:
  scaleY(p)`. Add a short linear transition (about 0.08 s) to smooth wheel steps.

**Rows.** When the pen passes a row's marker:
- the square marker draws (draw-dot),
- the year rises,
- the "→ end" label, kind, title, organisation, description and tags wipe in, 0.05 s apart.

Rows never switch back off. The end tick draws when `p` reaches 1. Once `p` is 1, remove the scroll
listener.

**Edge cases**
- If the page loads already past the timeline (reload or anchor), `p` is computed immediately and the
  rows draw at once.
- Section heading and sheet row use the shared opener (§6.2).

**Client code.** Experience needs a client component: either `experience.tsx` becomes `"use client"`, or
a small client child wraps the timeline. This is the builder's choice.

### 6.7 Toolkit (scroll-linked build; approved mockup: `toolkit-v2.html`)

**Build progress `q`**
- `q` = `clamp((viewportHeight − orbitTop) / (viewportHeight/2 + orbitHeight/2))`, kept at the highest
  value reached.
- So `q` is 0 when the orbit's top meets the bottom of the screen, and 1 when its centre reaches the
  middle.
- Compute it in the existing `requestAnimationFrame` loop in `components/skills.tsx`.

**What each phase does** (each phase maps its slice of `q` to 0–1, then applies ease-out cubic):

| Slice of `q` | What happens |
|---|---|
| 0 – 0.30 | crosshair lines grow from the centre |
| 0.05 – 0.25 | YS disc scales up (keeping its phone `chip` scale) |
| ring `i`: (0.10 + 0.12·i) for 0.35 | ring circle scales from the centre; ring list row `R{i+1}` wipes in when its slice starts |
| tool `j` on ring `i`: (0.25 + 0.14·i + 0.012·j) for 0.30 | the tool moves from the centre to its spot, scale 0.3 → 1 (times `chip`), and becomes visible once its slice starts |

**When `q` reaches 1**
- Stop writing build styles for good.
- Clear the inline transforms so the normal counter-rotating transform takes over.
- Let the spin start, easing up from 0 with the existing `run` lerp.

**Upright rule (owner's requirement).** The chip transform must always end in
`rotate(calc(var(--r) * -1))` once the ring can spin. The mockup bug came from build code writing
transforms *after* the build had finished.
- During the build the rings are at 0°, so build transforms need no rotation.
- After the build, no code may write chip transforms.

**Kept from today:** the hover-pause, the fast-scroll speed-up (now only after the build), and the phone
chip sizing and label hiding.

**Reduced motion:** built and still (today's behaviour).

**Hover extras** (the owner didn't pick, so the builder kept both; both are mouse-only and do nothing on
touch):
- **Hover a tool:** its disc lifts `translate(-3px,-3px)` with a `3px 3px 0` ink shadow, and the spin
  eases to a stop (as today). Where labels are hidden (`scale < 0.7`), a name tag wipes in under the
  disc. Where labels already show, no extra tag.
- **Hover a ring row in the list:** the other rings fade to 0.18 opacity, the hovered ring's dashed
  circle turns solid red, and the row gets the card background.

### 6.8 Contact

- The sheet row and heading use the opener (§6.2). The "Open to new projects" dot appears with draw-dot.
- Then, in order:
  1. Lead paragraph (wipe).
  2. Info rows, 0.08 s apart.
  3. Download CV (wipe with shadow).
- Form side, in order:
  1. The form card wipes in (with its shadow).
  2. The "< 24h" tab wipes in.
  3. The header, topic chips (0.05 s apart) and fields wipe in.
  4. The textarea's ruled lines draw across: animate `background-size` from `0% 28px` to `100% 28px`
     over 0.8 s.
- The footer title-block cells wipe in, 0.1 s apart.

## 7. Quality bar

**Performance**
- One `IntersectionObserver` for the whole page.
- The two scroll handlers are passive and run inside `requestAnimationFrame`. Each stops working once it
  is complete (Experience removes its listener; the toolkit stops writing build styles).
- No layout-changing properties are animated.

**Accessibility**
- With reduced motion there's no movement at all, and nothing is hidden at any time.
- Hidden states use `clip-path` and `transform`, never `display: none` or `visibility`, so screen readers
  read everything.
- Focus order and dialog behaviour are unchanged.

**Themes:** all lines and dots use tokens (`--ink`, `--red`, `--line2`), so Cyanotype works.

## 8. How we'll know it's done

**Build:** `npm run build` passes.

**Automated check** with Playwright, kept outside the repo in the scratchpad. Run it at 1440×900,
768×1024, 390×844 and 320×640 unless an item names one size.

| # | What it checks |
|---|---|
| 1 | After scrolling to the bottom in 600 px steps, waiting, and returning to the top: no element inside a `[data-draw]` group, the hero, the timeline or the orbit is left hidden. That means computed opacity 1, `clip-path` of `none`, and no leftover scale(0) or translate. |
| 2 | With reduced motion emulated, `<html>` has no `motion` class, and nothing is hidden right after load. |
| 3 | With JavaScript disabled, all content is visible. |
| 4 | Scrolling down through Experience and then up, the line's scale never decreases, and no row turns off. |
| 5 | The toolkit builds while scrolling. After the build, 6 s of spin and more scrolling, every chip's on-screen rotation is 0° (±0.5°). Scrolling back up leaves it built. |
| 6 | The case study opens on click. ✕, Esc and "Back to portfolio" each close it, page scroll is restored, and "Build something like this" lands on Contact. |
| 7 | No horizontal page scroll at 320 px and 390 px. |
| 8 | No console errors. |
| 9 | The hero is fully drawn about 3 s after `intro-done` (the intro sets it about 2.4 s after it starts). Pressing a key during the intro skips it: `intro-done` arrives within 0.5 s, and the hero is drawn about 3 s after that. |

**Owner review:** the owner reviews in the browser with `npm run dev` (http://localhost:1688) on desktop
and phone before asking for a commit through `github-push`.

## 9. Calls the builder made (owner, please check)

1. Approach 1: plain CSS plus one small observer script, no new library.
2. Section headings rise **word by word**, because line breaks change with screen width. The hero name
   rises line by line, because its breaks are fixed.
3. The FlowBill frame **plots in left to right** (border, address bar and shadow together) instead of
   tracing its four sides.
4. Content further down inside the case study doesn't animate. Only its first screen draws in.
5. Both toolkit hover extras are kept. The tool name tag only appears where labels are hidden.
6. The Experience "pen" sits 60% down the screen. The toolkit finishes building when its centre reaches
   the middle.
7. The case study's blue dim moves to `::backdrop`, so it can fade while the sheet unrolls.
8. Numbers that count up: the About stats, FlowBill's "300", and the hero's "3+" and "3.65".
9. Paragraphs wipe in as one piece, not line by line.
10. This doc isn't committed, per your no-commit rule.
