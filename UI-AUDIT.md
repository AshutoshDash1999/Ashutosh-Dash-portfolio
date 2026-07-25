# UI Audit — Accessibility & SEO

**Date:** 2026-07-25
**Scope:** `src/` — home page, `/client-work`, `/open-source`, `/insights`, shared UI primitives, theme tokens
**Skills applied:** `.agents/skills/accessibility` (WCAG 2.2), `.agents/skills/seo-audit`
**Method:** static source review + programmatic contrast math on OKLCH tokens from `src/app/globals.css`. No live-site crawl, no Lighthouse run, no screen-reader session.

---

## Executive summary

The site has a solid a11y foundation — skip link, `lang="en"`, `aria-label` on icon buttons, `aria-hidden` on decorative icons, 44px touch-target base rule, JSON-LD Person schema. Gaps are concentrated in three places:

1. **Dark-mode color contrast is broken in whole sections.** Three full-width sections put `--foreground` (near-white in dark theme) on light chart colors. Measured as low as **1.51:1** vs a 4.5:1 requirement. This is the single biggest issue.
2. **No `prefers-reduced-motion` support anywhere.** Zero matches in the codebase. Every section animates on scroll, the marquee scrolls infinitely, and the card game auto-flips on a 1s timer. WCAG 2.3.3 / vestibular-disorder risk.
3. **`robots.txt` has a malformed sitemap URL** — the sitemap is effectively undiscoverable, and the sitemap itself lists only 1 of 4 pages.

Also found: dead Tailwind classes (`text-muted-foreground`, `chart-1`) that silently render nothing, cards that are `<div>`s pretending to be headings, nested interactive controls in Reviews, and a focus ring hardcoded to black.

**Top 5 by priority**

| # | Issue | Where |
|---|-------|-------|
| 1 | Dark-mode section contrast down to 1.51:1 | Experience, FAQ, Contact |
| 2 | No reduced-motion handling at all | globals.css + every section |
| 3 | Broken sitemap URL in robots.txt; sitemap missing 3 pages | `public/robots.txt`, `public/sitemap.xml` |
| 4 | Hero job title 2.33:1 (`text-main` on light bg) | `hero.tsx:132` |
| 5 | Card titles are `<div>`, no `<h2>`/`<h3>` anywhere on the home page | `card.tsx:31` + all sections |

---

## A. Accessibility findings

### A1. Dark-mode section contrast failures — CRITICAL (WCAG 1.4.3 AA)

Three sections set a colored background but inherit `--foreground`, which flips to near-white (`oklch(92.49%)`) in dark theme. The chart colors stay light in both themes, so dark mode collapses.

Measured ratios (sRGB, computed from the OKLCH values in `globals.css`):

| Element | Light | Dark | Required |
|---|---|---|---|
| Experience body text on `bg-chart-2` — [experience.tsx:14](src/components/sections/experience.tsx#L14) | 10.88 ✅ | **1.91** ❌ | 4.5 |
| Contact/social card region on `bg-chart-3` — [social-links.tsx:62](src/components/sections/social-links.tsx#L62) | 13.18 ✅ | **1.51** ❌ | 4.5 |
| FAQ heading, `text-secondary-background` on `bg-chart-4` — [faq.tsx:48-51](src/components/sections/faq.tsx#L48-L51) | **3.79** ⚠️ | 5.21 ✅ | 3.0 (large) / 4.5 (normal) |

The Experience and Contact numbers are below even the 3:1 UI-component floor — text is effectively unreadable in dark mode. The FAQ heading squeaks past 3:1 as large text but fails if any normal-size text lands on that background.

**Fix:** stop relying on inherited `--foreground` over fixed chart colors. Either (a) pin these sections to `text-main-foreground` (black, which scores 10.88 / 13.18 / 5.54 on chart-2/3/4 respectively and is theme-stable), or (b) add dark-theme variants of `--chart-2/3/4` that darken enough for light text. Option (a) is one-line-per-section and preserves the neo-brutalist look.

### A2. No `prefers-reduced-motion` support — SERIOUS (WCAG 2.3.3)

`grep -r "prefers-reduced-motion\|useReducedMotion" src/` → **zero matches.**

Animations currently running unconditionally:
- First-load blur transition — [first-load-animation.tsx:36-41](src/components/layout/first-load-animation.tsx#L36-L41)
- Every section's scroll-triggered entrance (`whileInView` + stagger) — projects, reviews, experience, FAQ, tech-skills, footer, social-links
- Infinite marquee, 30s loop, never pauses — [globals.css:81-100](src/app/globals.css#L81-L100), [marquee.tsx](src/components/ui/marquee.tsx)
- Card game idle auto-flip on `setInterval(…, 1000)` — [card-game.tsx:222-244](src/components/sections/card-game.tsx#L222-L244)
- View Transition slide+scale between routes — [globals.css:229-235](src/app/globals.css#L229-L235)

The auto-flipping cards plus the infinite marquee are the highest-risk: continuous motion the user can't stop.

**Fix (two parts):**
1. Add the standard media-query block to `globals.css` to neutralize CSS animations, marquee, and view transitions.
2. In JS, use Motion's `useReducedMotion()` to skip `initial`/`whileInView` offsets and to disable the card-game idle interval — CSS alone can't stop a `setInterval`-driven state change.

### A3. Hero job title fails contrast — SERIOUS (WCAG 1.4.3)

[hero.tsx:132](src/components/sections/hero.tsx#L132) renders the `<h2>` job title with `text-main` on `--background`:

- Light theme: **2.33:1** ❌ (needs 3:1 as large text)
- Dark theme: 4.96:1 ✅

This is the second thing a visitor reads. `--main` is a mid-lightness purple (70.28%) sitting on a very light lavender background (93.88%) — too close in light theme.

**Fix:** darken `--main` for light theme only (around `oklch(55% 0.19 295)` clears 4.5:1 against both the light bg and white cards), or drop `text-main` here and use `--foreground` with a colored underline/accent block for the neo-brutalist emphasis.

### A4. Nested interactive controls in Reviews — SERIOUS (WCAG 4.1.2)

[reviews.tsx:85-124](src/components/sections/reviews.tsx#L85-L124): a `<Card>` (a `<div>`) carries `role="button"`, `tabIndex={0}`, and a keydown handler — and contains a LinkedIn `<Link>` wrapping a `<Button>` inside it.

Problems:
- Interactive-inside-interactive is invalid ARIA; screen readers announce it inconsistently and the inner control may be unreachable in some AT navigation modes.
- The card's accessible name (`View full review from X`) collides with the nested link's name.
- `role="button"` on a div re-implements what `<button>` gives free (the skill's guidance: prefer native elements).

**Fix:** make the card non-interactive and put the "read full review" affordance on an actual `<button>` inside the card, sibling to the LinkedIn link. Keeps both controls independently focusable and announced.

### A5. Focus ring hardcoded black — SERIOUS (WCAG 1.4.11, 2.4.7)

[button.tsx:7](src/components/ui/button.tsx#L7) — every button ships `focus-visible:ring-black focus-visible:ring-offset-2` with `ring-offset-white`.

In dark theme the focus ring is black-on-dark: the offset ring renders white (from `ring-offset-white`) but the ring itself is black against a dark background. The `--ring` token already exists and correctly flips (`oklch(0% 0 0)` light → `oklch(100% 0 0)` dark) — it's just not used here.

**Fix:** `focus-visible:ring-ring` + `ring-offset-background` instead of the hardcoded values. The card game already does this correctly ([card-game.tsx:284](src/components/sections/card-game.tsx#L284)) — the button primitive is the outlier.

### A6. No heading hierarchy inside cards — SERIOUS (WCAG 1.3.1, 2.4.6)

[card.tsx:31-39](src/components/ui/card.tsx#L31-L39) — `CardTitle` renders a `<div>`. Every card title on the site is therefore invisible to screen-reader heading navigation.

Home page heading outline as it currently stands:
```
h1  Ashutosh Dash
h2  Frontend Developer | React & Next.js   ← subtitle, not a section
h2  Projects
h2  Frequently asked questions
h2  Reviews
h2  Experience
(no headings at all for the 20+ card titles)
```

`/client-work` and `/open-source` are worse — one `h1`, then nothing. Users who navigate by heading (a primary screen-reader pattern) get a flat list with no way into the content.

**Fix:** add an `as` prop to `CardTitle` (default `div` for back-compat) and pass `as="h3"` from experience, projects, reviews, FAQ, client-work, and open-source cards. Also reconsider the hero `<h2>` — a job-title subtitle isn't a section heading; a `<p>` with heading styling is more honest and frees `h2` for real sections.

### A7. Marquee content duplicated to AT — MODERATE (WCAG 1.3.1)

[marquee.tsx:6-33](src/components/ui/marquee.tsx#L6-L33): the first copy of the skill list is exposed to screen readers; the second is correctly `aria-hidden`. Good. But the visible copy is a bare `<span>` list with no label or list semantics, so a screen reader hears 17 tech names with no framing, mid-page, in the middle of an infinite scroll.

**Fix:** wrap the visible copy in `<ul role="list">` with a visually-hidden `<h2>Tech stack</h2>`, and mark the whole marquee container as a labelled region.

### A8. Smaller items

- **Skip-link target isn't focusable.** [layout.tsx:135](src/app/layout.tsx#L135) points at `#hero`, but `<section id="hero">` has no `tabindex="-1"` — several browsers move the scroll position but leave focus on `<body>`, so the next Tab returns to the nav. Add `tabIndex={-1}` to the hero section. Also, the skip link only exists on the home page target; on `/insights` etc. `#hero` doesn't exist at all, so the link is dead. Point it at a `#main-content` id set on the `<main>` in both [page.tsx:10](src/app/page.tsx#L10) and [page-layout.tsx:7](src/components/layout/page-layout.tsx#L7).
- **`scroll-behavior: smooth` unconditional.** [globals.css:106](src/app/globals.css#L106) — belongs inside the reduced-motion guard.
- **Sticky nav can obscure focus.** [navbar.tsx:83](src/components/navbar.tsx#L83) is `sticky top-0` at 64–80px tall, and no `scroll-margin-top` is set anywhere. Anchor-nav to `#projects` etc. lands the focused element under the bar (WCAG 2.4.11, new in 2.2). Add `scroll-margin-top: 5rem` to `section[id]` and `:target`.
- **No `aria-current` on nav links.** [navbar.tsx:123-147](src/components/navbar.tsx#L123-L147) — the active route isn't announced (WCAG 3.2.3 supporting practice). `usePathname()` + `aria-current="page"`.
- **Theme toggle doesn't announce state.** [navbar.tsx:152-156](src/components/navbar.tsx#L152-L156) — label is a static "Toggle dark mode". Make it reflect target state ("Switch to light mode") and set `aria-pressed`.
- **Card game has no live region.** [card-game.tsx](src/components/sections/card-game.tsx) — match/no-match/win are purely visual. A screen-reader user gets no feedback. Add `aria-live="polite"` status text. Also note the game is a `<div>` grid of buttons with no `role="grid"`, so there's no spatial context; at minimum, label each button with its position ("Card 3 of 12").
- **Analytics banner isn't announced and traps nothing.** [analytics-banner.tsx:27](src/components/analytics-banner.tsx#L27) — a fixed-position `Alert` appears after mount with no `role="status"`, so screen readers never learn it exists. It also sits at `bottom-10` over content with no focus management.
- **Skeleton loaders unannounced.** [loading.tsx](src/app/loading.tsx), [hero.tsx:29](src/components/sections/hero.tsx#L29) — no `aria-busy` / `role="status"`, so AT users hear nothing during load.
- **`.dark` border stays pure black.** `--border: oklch(0% 0 0)` in both themes ([globals.css:35](src/app/globals.css#L35)). Against the dark background (30.14%) that's a 2.6:1 edge — the defining neo-brutalist border nearly vanishes in dark mode. Cosmetic, but it undercuts the design intent stated in AGENTS.md ("light and dark parity").

### A9. What's already correct

Worth stating so it doesn't get regressed: skip link present; `lang="en"`; all icon buttons have `aria-label`; decorative icons carry `aria-hidden`; `min-height/min-width: 44px` base rule for interactive elements exceeds the 24px WCAG 2.2 target-size minimum; external links use `rel="noopener noreferrer"` and announce "(opens in new tab)" in social links; Radix Dialog/Sheet/Select handle focus trapping natively; card game buttons use correct `focus-visible:ring-ring` + `ring-offset-background`.

---

## B. SEO findings

### B1. `robots.txt` sitemap URL is malformed — HIGH

[public/robots.txt](public/robots.txt):
```
Sitemap: https://ashutoshdash.insitemap.xml
```
Missing the `/` — resolves to a nonexistent host path. Crawlers get a 404 on sitemap discovery.

**Fix:** `https://ashutoshdash.in/sitemap.xml`.

### B2. Sitemap lists 1 of 4 pages, and is static — HIGH

[public/sitemap.xml](public/sitemap.xml) contains only the homepage, with `lastmod: 2026-01-21` (six months stale). Missing `/client-work` and `/open-source` — both are indexable, both have unique canonical + OG metadata, and neither is linked from any sitemap. `/insights` is correctly `noindex` and should stay out.

**Fix:** delete both static files and generate them. Next.js App Router supports `src/app/sitemap.ts` and `src/app/robots.ts`, which auto-derive `lastmod` and stay correct as pages are added.

### B3. Duplicated title on `/insights` — MEDIUM

[insights/layout.tsx:9](src/app/insights/layout.tsx#L9) sets `title: "Site Insights | Ashutosh Dash"` as a plain string. The root layout's template is `"%s | Ashutosh Dash"` ([layout.tsx:41](src/app/layout.tsx#L41)), which applies to string titles — rendering **"Site Insights | Ashutosh Dash | Ashutosh Dash"**. The sibling layouts get this right (`title: "Client Work"`, bare).

**Fix:** `title: "Site Insights"`, or `title: { absolute: "Site Insights | Ashutosh Dash" }`.

### B4. Keyword meta tag stuffed with 17+ terms — LOW (but worth cleaning)

[layout.tsx:23-35](src/app/layout.tsx#L23-L35) builds a keywords list of ~10 role variants plus every entry in `techSkills`. Google has ignored `<meta keywords>` since 2009; it carries no ranking benefit and the volume reads as a spam signal to the handful of engines that still parse it.

**Fix:** drop it, or trim to 5–8 genuine terms. Low urgency — no active harm on Google.

### B5. Missing structured data opportunities — MEDIUM

Current JSON-LD ([layout.tsx:112-128](src/app/layout.tsx#L112-L128)) is a well-formed `Person` with `sameAs`, `knowsAbout`, `alumniOf`. Good baseline. Missing:

- **`FAQPage` schema** — the FAQ section has 4 real Q&A pairs in `data.json` and is a direct rich-result eligibility win.
- **`WebSite`** with `url` + `name`, enabling sitelinks search box eligibility.
- **`BreadcrumbList`** on `/client-work` and `/open-source`.
- `Person.alumniOf` currently maps to company names but `alumniOf` semantically means educational institutions — employers belong in `worksFor` / `hasOccupation`. Minor correctness issue that could confuse entity extraction.

### B6. Homepage `h1` is just the name — MEDIUM

[hero.tsx:129](src/components/sections/hero.tsx#L129) — the `h1` is `"Ashutosh Dash"`, and the role ("Frontend Developer | React & Next.js") is demoted to `h2`. For a portfolio the target queries are role-based ("react developer", "next.js developer"), not name-based — someone searching the name will find the site regardless.

**Fix:** either fold the role into the `h1` ("Ashutosh Dash — Frontend Developer") or keep the name as `h1` and make sure the role text appears within the first 100 words in a crawlable non-decorative element. Currently it does appear early, so this is an optimization, not a defect.

### B7. Internal linking is thin — MEDIUM

`/client-work` and `/open-source` are reachable only from the navbar. Nothing on the homepage body links to them, and they don't link to each other or back to specific home sections. Both are one click from home so they aren't orphaned, but they receive almost no internal link equity and the anchor text is nav-generic.

**Fix:** add contextual links from the Projects section ("see more client work →") and cross-link the two pages in their footers.

### B8. Cover image / OG — verify

`cover.webp` and `insights-cover.webp` are referenced at 1200×630 in metadata. Not verified against actual file dimensions in this audit — worth a quick check that the real assets match, since mismatched OG dimensions cause cropping in LinkedIn/Twitter cards (the primary sharing surface for a portfolio).

---

## C. Code-quality issues found along the way

Not a11y or SEO, but they're breaking the UI:

### C1. `text-muted-foreground` is a dead class — the token doesn't exist

Used in 5 places:
- [client-work-content.tsx:60](src/app/client-work/_components/client-work-content.tsx#L60)
- [open-source-content.tsx:64](src/app/open-source/_components/open-source-content.tsx#L64), [:82](src/app/open-source/_components/open-source-content.tsx#L82)
- [analytics-banner.tsx:33](src/components/analytics-banner.tsx#L33)
- [chart.tsx:217](src/components/ui/chart.tsx#L217), [:264](src/components/ui/chart.tsx#L264)

`globals.css` defines no `--muted-foreground` and no `--color-muted-foreground` in the `@theme inline` block. Tailwind emits nothing, so these elements silently fall back to inherited `--foreground` — the intended visual de-emphasis never happens. Both page intro paragraphs (the first thing a visitor reads on those pages) are affected.

**Fix:** define `--muted-foreground` for both themes (roughly `oklch(45% 0.02 300)` light / `oklch(72% 0.02 300)` dark, both clearing 4.5:1) and register it in `@theme inline`. Note the FAQ page also uses `text-foreground/70` and `text-foreground/60` inline for the same purpose — worth consolidating onto the token.

### C2. `chart-1` used without the `bg-` prefix

- [projects.tsx:116](src/components/sections/projects.tsx#L116) — `className="flex-1 chart-1 h-12 md:h-10"`
- [client-work-content.tsx:92](src/app/client-work/_components/client-work-content.tsx#L92) — `className="w-full chart-1"`

`chart-1` isn't a Tailwind class. Both "Demo" and "View Project" buttons intended a distinct color and instead fall through to the default purple `bg-main` — meaning the Code/Demo button pair on every project card is visually identical when it was meant to be differentiated.

**Fix:** `bg-chart-1`. Then re-check contrast — `bg-chart-1` is close to `bg-main`, so a different chart color may serve the differentiation better.

### C3. Global transition selector is very broad

[globals.css:131-149](src/app/globals.css#L131-L149) applies transitions to `[class*="bg-"]`, `[class*="text-"]`, `[class*="border-"]`, `div[class]`, `span[class]`. The comment claims this is more performant than `*`, but `div[class]` + `span[class]` matches essentially every element on the page anyway. On the insights page (six Recharts charts, hundreds of nodes) this is meaningful style-recalc cost on every theme toggle.

**Fix:** scope to the elements that actually need color transitions, or accept `*` and be honest about it — the current selector list is the same cost with more complexity.

---

## Prioritized action plan

**P0 — Broken / blocking**
1. Fix dark-mode contrast in Experience, FAQ, Contact sections (A1)
2. Fix `robots.txt` sitemap URL (B1)
3. Fix the two dead Tailwind classes: `text-muted-foreground`, `chart-1` (C1, C2)

**P1 — WCAG AA compliance**
4. Add `prefers-reduced-motion` — CSS block + `useReducedMotion()` for the card-game interval and section variants (A2)
5. Fix hero job-title contrast (A3)
6. Fix the button focus ring to use `--ring` (A5)
7. Un-nest the Reviews card interactive controls (A4)

**P2 — Semantics & discoverability**
8. `CardTitle` `as` prop + real `h3`s across all card sections (A6)
9. Generate `sitemap.ts` / `robots.ts`; include all indexable routes (B2)
10. Fix the `/insights` duplicated title (B3)
11. Skip-link target + `scroll-margin-top` for the sticky nav (A8)
12. `aria-current` on nav links; stateful theme-toggle label (A8)

**P3 — Polish & upside**
13. FAQPage + WebSite JSON-LD; fix `alumniOf` → `worksFor` (B5)
14. Card game live region and positional labels (A8)
15. Marquee list semantics + hidden heading (A7)
16. Dark-theme `--border` lightening (A8)
17. Internal linking between home / client-work / open-source (B7)
18. Trim the keywords meta (B4); narrow the global transition selector (C3)

---

## Verification not performed

Stated plainly so the report isn't over-read:

- **No Lighthouse or axe run.** Netlify has `@netlify/plugin-lighthouse` configured, so CI scores exist — worth pulling those numbers to confirm.
- **No Core Web Vitals data.** The site self-reports vitals to PostHog via `web-vitals.ts` and renders them at `/insights` — that dashboard is the real source, not this audit.
- **No screen-reader session.** All AT findings are inferred from markup, not observed.
- **Contrast ratios are computed from the OKLCH source values,** not sampled from rendered pixels. Motion opacity states and overlay layers could shift them further.
- **Schema validation** should go through Google's Rich Results Test — JSON-LD injected via `dangerouslySetInnerHTML` renders fine, but only a rendering validator confirms eligibility.
