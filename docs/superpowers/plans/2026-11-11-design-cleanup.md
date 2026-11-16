# Design Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every AI-slop tell and layout bug found in the 2026-11-11 design audit, at mobile, tablet, laptop and desktop widths, while keeping the site's identity.

**Architecture:** No new components and no new dependencies. Fix the shared layer first (colour tokens, one button, one section title, one reveal), then walk the page top to bottom, deleting more than adding. A browser check script, written first and failing, defines "done" for layout, tap targets, text size and contrast.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4 (`@theme` tokens in `app/globals.css`), `motion`, `lenis`.

**Spec:** The audit findings, listed under "Findings this plan closes" below. There is no separate spec file.

## Findings this plan closes

| # | Finding | Task |
|---|---|---|
| F1 | Placeholder projects are live (`“Name” store`, `Stack TBD`, `store.example.com`, `#` links, "?" slide) | 7 |
| F2 | Indigo-to-violet gradients and gradient text over a pink-to-blue wash | 2, 5–9 |
| F3 | Five floating tilted stat badges; GPA shown four times, "3+" twice | 5, 6, 7, 9 |
| F4 | Three identical service cards with gradient icons | 6 |
| F5 | Same heading formula on every section (label + one coloured word), stock copy | 2, 6–9 |
| F6 | Motion overload: preloader, cursor trail, typewriter, bobbing badges, pulsing dot, auto-carousel, replaying entrances, tilts | 3, 5–9 |
| F7 | Fake tablet and fake chat around the contact form; copy claims the form reaches the inbox when it opens the email app | 9 |
| F8 | Every button is primary coral ("Hire me" ×3, "Download CV" ×2) | 2, 4–6, 9 |
| F9 | Two near-identical palettes (hardcoded hex beside tokens); 27 font sizes | 2, 10 |
| F10 | All body text italic; 10–11px labels at about 2.4:1 contrast | 2, 10 |
| F11 | Tablet: "Hire me" wraps and overlaps "Hi! I'm"; 136px header | 4 |
| F12 | Mobile: nav cut off mid-word; portrait below first screen; 8px carousel dots | 4, 5, 7 |
| F13 | Laptop: hero call to action on the bottom edge; empty band under carousel | 5, 7 |
| F14 | Fake browser chrome and pill badges around the FlowBill screenshot | 7 |

## Global Constraints

- **Keep:** Jost, coral + indigo, both photos, the two tool ribbons (tilt included), the scroll-filled timeline, the FlowBill case-study modal.
- **No new dependencies** in `package.json`. No new components. Prefer deleting.
- **Colours:** components use theme tokens only. No hex literals, no `rgb()`/`rgba()` literals except inside the `@theme` block.
- **Gradients:** none, except the two listed in Task 10 (photo fade mask, timeline progress line).
- **Italic:** only on `h1`–`h4`, the logo, and the timeline year. Everything else upright.
- **Type sizes:** Tailwind named sizes only (`text-xs` 12, `text-sm` 14, `text-base` 16, `text-lg` 18, `text-xl` 20, `text-2xl` 24, `text-3xl` 30) plus the four display clamps defined in Tasks 2, 5 and 8. Nothing below 12px.
- **Buttons:** at most one coral button per section. Minimum height 44px.
- **Motion:** each element animates in once. Nothing loops except the ribbons. Honour `prefers-reduced-motion` (already set by `MotionConfig reducedMotion="user"`).
- **Copy:** sentence case, no em dashes, no arrow chains (existing repo rule).
- **Git:** no commits during this plan. The owner reviews in the browser first, then asks for the commit through the `github-push` skill. No Co-Authored-By line. Never push.
- **Dev server:** `npm run dev` serves `http://localhost:1688`.

## Review Focus

Conditions the audit did not measure but a visitor will hit. Each has a check in the task named.

1. **320px-wide phones:** nav and hero must not scroll sideways or clip. Check in Task 1 (viewport `320×640`, assertion A1 and A8).
2. **Reduced motion:** with the preloader gone, content must be visible immediately and nothing may be left at `opacity: 0`. Check in Task 3, Step 5.
3. **Keyboard users:** every link, button and field shows a visible focus ring. Check in Task 2, Step 5.
4. **GitHub Pages base path:** image and CV paths must still go through `base` from `lib/data.ts` after edits. Check in Task 10, Step 3.
5. **Long contact values:** the email address must not overflow its row at 320px. Covered by A1 at `320×640` once Task 9 is done.

## File map

| File | Change |
|---|---|
| `app/globals.css` | Tokens, focus ring, delete gradient utilities |
| `components/ui.tsx` | `Button` (replaces `CoralButton`), `SectionTitle`, `OutlineWord` colour; delete `Eyebrow`, `BrowserShot` |
| `components/providers.tsx` | Drop intro and cursor effect |
| `components/intro.tsx`, `components/cursor-fx.tsx`, `components/typewriter.tsx` | Delete |
| `components/reveal.tsx` | Animate once |
| `components/header.tsx` | Two-row layout below `lg`, solid scrolled state |
| `components/hero.tsx` | Flat background, no badges, static role line |
| `components/about.tsx` | Plain list instead of cards; simpler `Stats` |
| `components/portfolio.tsx` | FlowBill only; no carousel, no browser chrome |
| `components/project-modal.tsx` | Flat colours, static tagline |
| `components/journey.tsx`, `components/timeline.tsx` | Heading, upright text |
| `components/skills-ribbons.tsx` | Heading, flat colours |
| `components/contact.tsx` | Plain form, honest copy |
| `lib/data.ts` | Nav labels, stats, tagline, timeline colours; delete `roles` |
| `<scratchpad>/audit/check.mjs` | Check script (outside the repo) |

`<scratchpad>` is `C:\Users\phane\AppData\Local\Temp\claude\c17ae67cc5b7dc8a\a6b42ab6-3b2f-4214-8814-68348e3c0347\scratchpad`. It already holds `audit/shoot.mjs` and `playwright-core`. If the folder is gone, recreate it: `npm init -y && npm i playwright-core@1.56.0`, and launch Chromium from `%LOCALAPPDATA%\ms-playwright\chromium-1194`.

---

### Task 1: Check script that fails today

**Files:**
- Create: `<scratchpad>/audit/check.mjs`

**Interfaces:**
- Produces: `node check.mjs` prints one line per failed assertion as `FAIL <viewport> <id> <detail>` and exits 1 if any failed, else prints `ALL PASS` and exits 0. Later tasks run it.

- [ ] **Step 1: Write `check.mjs`.** Reuse the launch code from `shoot.mjs`. For each viewport `320×640`, `390×844`, `768×1024`, `1366×768`, `1920×1080`: open `http://localhost:1688`, wait 2s, then evaluate these assertions.

| Id | Assertion | Viewports |
|---|---|---|
| A1 | `documentElement.scrollWidth <= clientWidth` | all |
| A2 | every visible `a, button, input, textarea` is at least 44px tall and 24px wide, unless it sits inside a `p` | all |
| A3 | no text leaf has computed `font-size` below 12px | all |
| A4 | no element has `background-clip: text`; no element has a `backdrop-filter` | all |
| A5 | at most 14 distinct computed font sizes among text leaves | all |
| A6 | `header` bottom is at or above the top of the element before `#home h1` | all |
| A7a | `#home a[href="#contact"]` bottom is at most `innerHeight - 24` | 1366×768, 1920×1080 |
| A7b | `#home img` top is at most 700 | 390×844 |
| A8 | `header nav`: `scrollWidth <= clientWidth` | all |
| A9 | `body.innerText` does not match `/TBD|example\.com|“Name”|Coming soon/` | 1366×768 |
| A10 | every text leaf has contrast of at least 4.5:1 (3:1 when font size is 24px or more) against the nearest ancestor with a non-transparent `background-color` | 1366×768, 390×844 |
| A11 | no element still has computed `opacity` below 1 after scrolling to the bottom in 600px steps and back to the top (ignore elements with `aria-hidden="true"`) | 390×844 |

- [ ] **Step 2: Run it against the current site.**

Run: `node "<scratchpad>/audit/check.mjs"`
Expected: exit 1, with FAIL lines for at least A2, A3, A4, A5, A6 (768), A7b, A8 (390), A9, A10.

---

### Task 2: Tokens and shared primitives

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui.tsx`

**Interfaces:**
- Produces (tokens, usable as `bg-*`, `text-*`, `border-*`):

| Token | Value | Use |
|---|---|---|
| `ink` | `#1b1446` | headings, body emphasis |
| `ink-soft` | `#4a4570` | body text |
| `muted` | `#5a5578` | secondary text |
| `faint` | `#68638a` (was `#a7a3be`) | small labels, placeholders |
| `line` | `#e4e2f2` | hairlines, borders |
| `paper` | `#f7f7fc` | page background |
| `wash` | `#efedf9` (new) | hero, toolkit, contact, modal sidebar background |
| `coral` | `#ff5e3a` | button fill, dots, lines |
| `coral-deep` | `#cc3a18` (new) | coral-coloured text |
| `iris` | `#3b2bc4` | accent text, outline word |
| `--shadow-card` | unchanged | modal panel, form card |

- Deleted tokens: `iris-deep`, `plum`, `orchid`, `mint`, `--shadow-coral`, `--shadow-float`. Deleted utilities: `bg-hero`, `bg-contact`, `text-clip`.
- Produces (`components/ui.tsx`):
  - `Button({ href, children, variant = "primary", className, download, onClick, type, disabled })`. Renders `<a>` when `href` is given, otherwise `<button>`. Both variants: `min-h-11`, `px-6`, `rounded`, `text-base font-semibold`, upright, no shadow, no hover lift. `primary`: `bg-coral text-ink`, hover `bg-ink text-white`. `secondary`: `border border-ink text-ink`, hover `bg-ink text-white`.
  - `SectionTitle({ children, id })`: `h2`, `text-[clamp(36px,4.2vw,54px)] font-extrabold italic leading-[1.05] tracking-[-0.02em] text-ink`. Single colour; callers pass plain text.
  - `OutlineWord({ text, fill, stroke })`: unchanged signature; stroke and text colour become `var(--color-iris)`.
- Deleted exports: `CoralButton`, `Eyebrow`, `BrowserShot`.

- [ ] **Step 1: Edit the `@theme` block** to the table above; delete the three `@utility` blocks.
- [ ] **Step 2: Base layer.** `body`: `bg-paper text-ink-soft antialiased`. Links: `text-iris hover:text-coral-deep`. Add `:focus-visible { outline: 2px solid var(--color-iris); outline-offset: 2px; }`.
- [ ] **Step 3: Rewrite `ui.tsx`** to the interfaces above.
- [ ] **Step 4: Type-check.** Run: `npx tsc --noEmit`. Expected: errors only for the removed names (`CoralButton`, `Eyebrow`, `BrowserShot`, removed colour classes are not type errors). Those call sites are fixed in Tasks 4–9; note the list.
- [ ] **Step 5: Focus ring check (Review Focus 3).** After Task 4, load the page, press Tab five times. Expected: each focused link or button shows a 2px indigo outline.

---

### Task 3: Remove the gimmick motion

**Files:**
- Delete: `components/intro.tsx`, `components/cursor-fx.tsx`, `components/typewriter.tsx`
- Modify: `components/providers.tsx`, `components/reveal.tsx`, `components/header.tsx`, `components/hero.tsx`, `components/project-modal.tsx`, `lib/data.ts`

**Interfaces:**
- Produces: `Providers` renders only `MotionConfig` and `ReactLenis` around `children`. `IntroContext` no longer exists. `Reveal` keeps its props; its `viewport` becomes `{ once: true, margin: "-80px" }`.
- Produces (`lib/data.ts`): `roles` deleted. `Project.taglines` replaced by `tagline: [string, string]`; `flowBill.tagline = ["Custom ", "ERP for Samai Distillery"]`.

- [ ] **Step 1: Delete the three files** and their imports in `providers.tsx`.
- [ ] **Step 2: `header.tsx` and `hero.tsx`:** remove `useContext(IntroContext)`. Header animates in on mount (`animate={{ opacity: 1, y: 0 }}`, no delay). Hero: delete the `key={String(revealed)}` remount.
- [ ] **Step 3: Replace both `<Typewriter />` uses** with static text: hero shows `Full-stack software engineer`; the modal shows `project.tagline` as lead (muted) + rest (ink).
- [ ] **Step 4: Run** `npx tsc --noEmit`. Expected: no errors mentioning `intro`, `cursor-fx`, `typewriter`, `roles` or `taglines`.
- [ ] **Step 5: Reduced-motion check (Review Focus 2).** Run `check.mjs` once with the Playwright context option `reducedMotion: "reduce"` at `390×844`. Expected: A11 passes and the hero `h1` is visible within 500ms of load.

---

### Task 4: Header

**Files:**
- Modify: `components/header.tsx`, `lib/data.ts`

**Interfaces:**
- Consumes: `Button` from Task 2.
- Produces (`lib/data.ts`): `nav` has five entries, in order: `#about` "About", `#work` "Projects", `#journey` "Experience", `#skills` "Toolkit", `#contact` "Contact". "Home" is removed (the logo links to `#home`). The active-section logic falls back to no highlight while in the hero.

- [ ] **Step 1: Layout.** One row from `lg` up: logo, spacer, nav, button. Below `lg`: logo and button on the first row, nav on a second full-width row with `justify-between`. Replace every `md:` class in this file with `lg:`. This closes F11 (the button can no longer wrap).
- [ ] **Step 2: Nav links** upright, `text-sm lg:text-base`, active link `text-coral-deep`, others `text-ink-soft`. Keep the `py-3` tap padding. Logo link gets `py-2` so it is 44px tall.
- [ ] **Step 3: Scrolled state:** `bg-paper border-b border-line`. Remove `bg-white/70`, the shadow and `backdrop-blur-xl`.
- [ ] **Step 4: Button:** `<Button href="#contact" variant="secondary">Hire me</Button>`.
- [ ] **Step 5: Run `check.mjs`.** Expected: A6 and A8 pass at all five viewports.

---

### Task 5: Hero

**Files:**
- Modify: `components/hero.tsx`

**Interfaces:**
- Consumes: `Button`, `OutlineWord` from Task 2.

- [ ] **Step 1: Background and decoration.** Section: `bg-wash`, top padding `pt-[108px] lg:pt-[89px]`. Delete the two white ring `div`s, the gradient arch, and both floating badge blocks ("3+ Years Experience", "3.65 GPA"). Keep one arch behind the portrait: flat `bg-white`, no border, no animation of its own.
- [ ] **Step 2: Name.** `h1` size `text-[clamp(48px,6.2vw,96px)]`. "Yin" is solid `text-iris`. "Sophaneth" stays an `OutlineWord` with `fill="var(--color-wash)"`.
- [ ] **Step 3: Text.** "Hi! I'm": `text-xl text-muted`, upright. Role line: `text-xl font-semibold text-ink`, upright. Paragraph: `text-base lg:text-lg text-ink-soft`, upright, same words.
- [ ] **Step 4: Actions.** Delete the three social icon links (they repeat in Contact). One row: `<Button href="#contact">Get in touch</Button>` and a text link `Download CV` (`text-base font-semibold text-ink underline`, `py-3`).
- [ ] **Step 5: Motion.** `inView` becomes `{ once: true, amount: 0.3 }`. Keep the stagger on the text column and one fade-up on the portrait. Delete the other three `motion.div` wrappers.
- [ ] **Step 6: Fit the first screen.** Portrait column `min-h-[420px] sm:min-h-[520px]`. Inner grid top padding `pt-4 lg:pt-8`.
- [ ] **Step 7: Run `check.mjs`.** Expected: A7a passes at 1366×768 and 1920×1080; A7b passes at 390×844.

---

### Task 6: About and stats

**Files:**
- Modify: `components/about.tsx`, `lib/data.ts`

**Interfaces:**
- Consumes: `SectionTitle`, `Reveal`.
- Produces (`lib/data.ts`): `stats` has three entries: `3+` "Years in production", `8` "ERP modules shipped", `10–20` "Daily users on FlowBill". The GPA entry is removed; GPA now appears only in the timeline.

- [ ] **Step 1: Heading.** Delete the "About me" label. `<SectionTitle>Sole engineer on a production ERP since 2023.</SectionTitle>`.
- [ ] **Step 2: Bio.** Upright, `text-base lg:text-lg text-ink-soft`. First sentence becomes `Bachelor's in IT at NUM, now a Master's in Computer Science at ITC.` (GPA removed). Rest unchanged. Keep the bold line, upright, `text-ink`. Delete the "Hire me" button.
- [ ] **Step 3: Services.** Replace the three cards with a plain `dl` in the same grid area: three rows separated by `border-t border-line`, no card, no icon, no tilt, no shadow. Term: `text-lg font-semibold text-ink`. Description: `text-base text-ink-soft`. Delete `icon`, `iconBg`, `titleColor`, `tilt`, `tags` from the data.

| Term | Description |
|---|---|
| Front-end | The FlowBill screens: document forms, stock views and dashboards used all day. |
| Back-end | The API and PostgreSQL schema where invoice totals match to the cent. |
| Server and documents | The Ubuntu server, Nginx and the PDF pipeline it runs on. |

- [ ] **Step 4: Photo.** Delete the radial glow `div`. Arch fill becomes flat `bg-wash`. Keep the fade mask.
- [ ] **Step 5: `Stats`.** Replace the dark band and paper-curl cards with a `dl`, `grid-cols-3`, `border-y border-line`, `py-10`, on `bg-paper`. Number: `text-3xl font-bold text-ink`. Label: `text-sm text-muted`. No hover effects.
- [ ] **Step 6: Run `check.mjs`.** Expected: no new FAIL lines; A10 passes for this section.

---

### Task 7: Projects and case-study modal

**Files:**
- Modify: `components/portfolio.tsx`, `components/project-modal.tsx`

**Interfaces:**
- Consumes: `Button`, `SectionTitle`, `OutlineWord`, `flowBill.tagline` (Task 3).
- Produces: `Portfolio` keeps one piece of state, `open`. Section id stays `work`.

- [ ] **Step 1: Delete the carousel.** Remove `projects`, `Slide`, `track`, `SlideView`, `arrowBase`, the `idx`/`anim`/`paused`/`reduced` state, their effects, and the whole "More projects" block. Remove `Browser` and the `italic` class on the section.
- [ ] **Step 2: Heading.** `<SectionTitle>Projects</SectionTitle>`. Delete the "Portfolio" label and the "One in production, one shipped, one on the way." line.
- [ ] **Step 3: Screenshot.** A plain frame: `overflow-hidden rounded-xl border border-line`, no rotation, no window dots, no address pill, no shadow. Under it, a caption in normal flow: `300 test documents matched to the cent.` (`text-sm text-muted`). The floating badge is deleted.
- [ ] **Step 4: Details column.** Replace the two pills with one line: `Client work, live since 2023` (`text-sm font-semibold text-muted`). Title `FlowBill ERP` in one colour, `text-3xl font-extrabold italic text-ink`. Summary upright. The six feature pills become a two-column `ul` with coral markers, `text-base text-ink-soft`. Stack line: `text-xs uppercase tracking-widest text-faint`. Action: `<Button onClick={() => setOpen(true)}>Read the case study</Button>`.
- [ ] **Step 5: Modal colours.** Sidebar background flat `bg-wash`; `paper` constant becomes `var(--color-wash)`. "Flow" solid `text-iris`. "What it does": plain text, no coloured span. "What I learned" card: flat `bg-iris`, heading `text-white`. Delete the `pop` variant and every `whileHover`. Body text upright. The overlay becomes `bg-ink/80` and loses `backdrop-blur-sm`. The panel shadow becomes `shadow-card`. The numbered `OutlineWord` fill becomes `var(--color-white)`.
- [ ] **Step 6: Run `check.mjs`.** Expected: A9 passes; A2 no longer lists carousel dots.
- [ ] **Step 7: Modal check by hand.** Open the case study at 390 and 1366 wide. Expected: opens, Esc closes, arrow keys change the screenshot, no gradient visible.

---

### Task 8: Experience and toolkit

**Files:**
- Modify: `components/journey.tsx`, `components/timeline.tsx`, `components/skills-ribbons.tsx`, `lib/data.ts`

**Interfaces:**
- Consumes: `SectionTitle`.
- Produces (`lib/data.ts`): `work.color = "var(--color-coral-deep)"`, `edu.color = "var(--color-iris)"`; `halo` values use `color-mix(in srgb, <color> 14%, transparent)`.

- [ ] **Step 1: Journey heading.** `<SectionTitle>Experience and education</SectionTitle>`, one colour. Delete the "Resume" label. Legend text upright.
- [ ] **Step 2: Timeline text.** Year keeps `text-[clamp(28px,3.4vw,46px)]` italic. Kind label `text-xs`. Title `text-2xl font-bold text-ink`, upright. Organisation `text-lg text-iris`, description `text-base text-muted`, tags `text-base text-ink-soft`, all upright. Motion unchanged.
- [ ] **Step 3: Toolkit heading.** `<SectionTitle id="toolkit-title">Toolkit</SectionTitle>`. Delete the "Skills" label. Section background flat `bg-wash`.
- [ ] **Step 4: Ribbons.** Bands become flat `bg-iris` and flat `bg-coral`; delete their coloured shadows. Category dots become flat: front `coral`, back `iris`, ops `ink`. Pill text upright, `text-lg`. Keep the tilt, the loop and the drag.
- [ ] **Step 5: Run `check.mjs`.** Expected: A10 passes for both sections.

---

### Task 9: Contact

**Files:**
- Modify: `components/contact.tsx`

**Interfaces:**
- Consumes: `Button`, `SectionTitle`.
- Produces: `ContactSection` with the same `onSubmit` behaviour (opens the email app). Deleted: `useBadges`, `useWide`, `Bubble`, `pop`, `drop`, `slide`, the device frame, both floating badges, the white ring.

- [ ] **Step 1: Layout.** Section `bg-wash`. One column below `lg`; from `lg`, two columns: text left, form right. Order on phone: heading, intro, form, contact rows, CV button.
- [ ] **Step 2: Copy.**

| Element | Text |
|---|---|
| Heading | `Contact` |
| Intro | `Fill in the form and your email app opens with the message ready to send. Or reach me directly below.` |
| Status line | `Open to new projects. I usually reply within a day.` |
| Option group label | `What do you need?` |
| Submit | `Open in email app` |
| After submit | `Your email app is opening with your message. Just hit send.` (unchanged) |

- [ ] **Step 3: Form card.** `rounded-xl border border-line bg-white p-6`, no rotation, no bezel, no avatar, no "online". Inside, top to bottom: option group (the four existing options as `aria-pressed` buttons, `min-h-11`, selected `bg-ink text-white`), name, email, message, submit. Delete "Send me a message".
- [ ] **Step 4: Fields.** Labels `text-sm font-semibold text-ink`, upright. Inputs keep `h-12`; border `border-line`, focus border `iris`; placeholder `text-faint`. Submit is `<Button type="submit">`. Status note `text-ink`; error note `text-coral-deep`.
- [ ] **Step 5: Contact rows.** Keep the four rows and icons. Label `text-xs uppercase tracking-widest text-faint`. Value `text-base font-semibold text-ink`, upright, `break-all` on the email. Hover changes colour only: delete the icon rotate, row slide and drawn underline. Rows are `min-h-11`.
- [ ] **Step 6: CV.** `<Button href={profile.cvUrl} download="Yin-Sophaneth-CV.pdf" variant="secondary">Download CV</Button>`.
- [ ] **Step 7: Motion.** One `stagger` + `rise` on the grid, `viewport={{ once: true, amount: 0.15 }}`. Delete everything else, including the pulsing full stop.
- [ ] **Step 8: Footer.** Upright, `text-sm text-muted`.
- [ ] **Step 9: Run `check.mjs`.** Expected: A1 passes at 320×640 (Review Focus 5); A2 no longer lists the option buttons.
- [ ] **Step 10: Submit by hand.** Fill the form, pick "POS", submit. Expected: the email app opens with subject `Project inquiry from <name>` and the body mentions POS.

---

### Task 10: Sweep and verify

**Files:**
- Modify: any file the checks below flag.

- [ ] **Step 1: Source checks.** Run each from the repo root.

| Command | Expected |
|---|---|
| `grep -rnE "#[0-9a-fA-F]{3,8}\b\|rgba?\(" components` | no output |
| `grep -rn "gradient" components` | exactly two files: `about.tsx` (photo fade mask), `timeline.tsx` (progress line) |
| `grep -rnE "repeat: Infinity\|animate-pulse\|backdrop-blur\|text-clip\|whileHover" components` | no output |
| `grep -rnE "rotate" components` | only `skills-ribbons.tsx` (`-rotate-4`, `rotate-3`) and the modal close animation if kept |
| `grep -rn "italic" components` | only `ui.tsx` (`SectionTitle`), `header.tsx` (logo), `hero.tsx` (`h1`), `timeline.tsx` (year), `portfolio.tsx` and `project-modal.tsx` (`h2`–`h4`) |
| `grep -rnE "text-\[[0-9]" components` | no output (the display clamps start with `text-[clamp`, so they do not match) |

- [ ] **Step 2: Type-check and build.** Run: `npx tsc --noEmit` then `npm run build`. Expected: both finish with no errors.
- [ ] **Step 3: Base path (Review Focus 4).** Run: `grep -rnE "src=\"/|href=\"/" components`. Expected: no output (every asset path goes through `base`).
- [ ] **Step 4: Full check.** Run: `node "<scratchpad>/audit/check.mjs"`. Expected: `ALL PASS`, exit 0.
- [ ] **Step 5: Screenshots.** Run: `node "<scratchpad>/audit/shoot.mjs"` and look at every image at all four sizes. Expected: no clipped text, no overlap, no empty band taller than one section gap, no element from the "Deleted" lists above.
- [ ] **Step 6: Hand over.** Report the before and after numbers (page height per viewport, distinct font sizes, failed assertions) and wait for the owner's review before any commit.

## Decisions the owner can still change

| Decision | Chosen here | Alternative |
|---|---|---|
| University projects | Removed until real names and screenshots exist | Add them back as plain rows under FlowBill |
| Preloader | Removed | Keep a shorter one |
| GPA | Shown once, in the timeline | Keep it as a fourth stat |
| Coral button text | Dark ink on coral (5.6:1) | White on a darker coral `#d63f1c` (4.6:1) |
| Headings | Plain nouns ("Projects", "Toolkit", "Contact") | Your own wording |
| Contact form | Still opens the email app, copy now says so | Wire a form service so it really sends |
