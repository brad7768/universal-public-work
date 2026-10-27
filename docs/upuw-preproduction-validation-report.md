# UPUW pre-production validation report — PR #5 review

**Review date:** 2026-10-27  
**Snapshot reviewed:** PR [#5](https://github.com/brad7768/universal-public-work/pull/5) (`cursor/upuw-consolidation-pr2-pr3`)  
**Fixes branch:** `cursor/upuw-preprod-review-pr5-ea4b` → PR #6 (stacked on #5)  
**Reviewer:** Cloud agent pre-prod pass (no merge, no deploy)

## Scope reviewed

| Area | Coverage |
|------|----------|
| Pages | **50** built FR/EN pages (+ root `index.html`, `404.html`) |
| Visual (browser) | FR: home, FAQ, confidentialité, mentions légales, catalogue, fiche produit (drone), service construction, réalisation Mendong; EN spot-check: FAQ, catalogue |
| Viewports | **375px**, **1024px** (visual); automated HTML audit all pages |
| Mockups | `docs/reference/` (desktop/mobile + page1–8) — complementary pages aligned to PR #2 cinematic system in this pass |
| Forms | `quote-request` (devis), `procurement` (équipement), `netlify.toml` |
| Content | JSON/data + legal templates — flag only, no fabricated legal/stats |

Reference consolidation notes: [`docs/upuw-consolidation-report.md`](./upuw-consolidation-report.md).

## Tests run (actual results)

| Command | Result |
|---------|--------|
| `npm run build` | **PASS** — `Built 50 pages → {fr,en}/` |
| `npm run check-links` | **PASS** — `Link check OK (fr/, en/ + root pages)` (run after build; first run without build can fail on missing `fr/confidentialite.html`) |
| Custom SEO/a11y scan (52 HTML files) | **0 critical**; expected gaps on root redirect + 404 (see anomalies) |
| hreflang mirror check (50 page pairs) | **PASS** — 0 missing EN/FR counterparts |
| Asset path check (`../assets/*` from built pages) | **PASS** — 0 broken paths |
| `node scripts/smoke-pages.mjs http://127.0.0.1:8765` | **PASS** — 11 key URLs, logo + h1 present |
| Playwright / `npm test` | **Not in repo** — added optional `scripts/smoke-pages.mjs` (fetch-based), not Playwright |
| Netlify form POST (live preview) | **NOT TESTED** — no Netlify deploy or form submission in this environment |
| Local form submit | **NOT TESTED** — static server only; client validation not exercised end-to-end |

## Fixes applied (PR #6 branch)

1. **Cinematic heroes on complementary pages** — `hero--legal hero--cinematic` on FAQ, confidentialité, mentions légales (FR+EN templates); `hero--cinematic` on catalogue (`hero--buy`).
2. **Detail page visual parity** — `hero--cinematic` on project, product, and service detail shells in `scripts/build.mjs`.
3. **CSS** — `.hero--legal.hero--cinematic`, `.hero--detail.hero--cinematic` backgrounds and light text on badges/leads.
4. **A11y** — project gallery images: descriptive `alt` from project title (was empty).
5. **404** — `main` id `contenu-principal` for skip-link consistency.
6. **Build constant** — `LOGO` path aligned to `upuw-logo.jpg` (header/footer already used this in output).
7. **Smoke script** — `scripts/smoke-pages.mjs` for local HTTP checks.

Regenerated outputs: `npm run build` after template/build/CSS changes.

## Remaining anomalies (prioritized)

### P0 — human / legal before launch

| Item | Notes |
|------|--------|
| Legal TBD | Mentions légales, confidentialité, politiques: RCCM, NIU, DPO, e-mail éditeur, textes juridiques **TBD** — placeholders only |
| Portfolio claims | Project cards/detail copy **illustrative** (`data/projects.*` disclaimer) — not client-verified |
| Home stats bar | `+50` projects, `10+` years — **not sourced** in repo; flag for client confirmation or soften/remove |
| Social URLs | `data/site.json` → generic facebook/linkedin/youtube/instagram roots — verify real profiles |

### P1 — SEO / UX

| Item | Notes |
|------|--------|
| Root `index.html` | Language redirect only — no `<h1>`/`<main>` (by design); has meta description + hreflang |
| `404.html` | `noindex` — no canonical/hreflang (acceptable for error page) |
| `politiques.html` | Still section-header layout (no full-width cinematic hero) — lower priority vs FAQ/legal trio |
| Devis hidden inputs | Audit notes inputs without visible labels (page slug fields) — low risk |

### P2 — tooling / ops

| Item | Notes |
|------|--------|
| No Playwright E2E | Recommend Netlify preview + form detection test post-merge |
| Build not in Netlify CI | `netlify.toml` publishes repo root; committed HTML must stay in sync after `npm run build` |
| Duplicate brand file | `logo-upuw-fond-blanc.jpg` unused — optional cleanup |

## Forms / Netlify status

| Form | `name` | Markup | Honeypot | Tested submit |
|------|--------|--------|----------|----------------|
| Devis | `quote-request` | `data-netlify="true"`, `form-name` hidden, multi-step UI + `js/main.js` | `bot-field` (sr-only) | **No** |
| Procurement | `procurement` | Same pattern on équipement page | `bot-field` (sr-only) | **No** |

`netlify.toml`: security headers, cache for `/assets/images/*`, `/assets/brand/*`, `/css/*`, `/js/*`; publish `.`; no form-specific config (Netlify auto-detects forms on deploy).

**Honest status:** Markup matches Netlify Forms static HTML requirements; **production registration and spam handling unverified** until deploy + test submission.

## Unverified content inventory

- **Stats:** `renderStats()` — +50 projects, 10+ years, 100% quality (marketing, not documented).
- **Projects:** Mendong voirie, bâtiment admin, topo drone — years/locations/results TBD in JSON.
- **Products:** Specs/prices “sur devis”; many TBD fields in `data/products.*`.
- **Services / FAQ:** Operational answers marked TBD in JSON.
- **Legal:** All RCCM/NIU/DPO/publisher fields TBD on mentions; privacy bases TBD.
- **Contact:** Phone/WhatsApp/email from `site.json` — **not independently verified** against client records.
- **Politiques date:** “9 mai 2026” — editorial, needs legal sign-off.

## PR base & safe merge order (recommendation only — not executed)

```text
main
 └── PR #2  cursor/upuw-passe-2-pages-ab3a        (Pass 2 — core pages)
      └── PR #5 cursor/upuw-consolidation-pr2-pr3  (consolidates #2 + #3)
           └── PR #6 cursor/upuw-preprod-review-pr5-ea4b (this review fixes)
```

| PR | Role | Merge note |
|----|------|------------|
| #2 | Mockup-aligned core 8×2 pages | **Base for #5** — merge first into `main` OR merge #5 as single integration |
| #3 | Complementary 50-page data/templates | Absorbed by #5; **close or merge after #5** to avoid duplicate history |
| #4 | Pass 4 validation report only | Parallel QA doc; **not required** for #5 code path |
| #5 | Consolidation | Target integration branch off #2 |
| #6 | Pre-prod fixes | Merge **after #5** (or rebase onto `main` once #5 lands) |

**Suggested sequence to `main`:**  
1) Merge **#5** (or #2 then cherry-pick strategy — prefer **#5 alone** if it already contains #3).  
2) Merge **#6**.  
3) Archive/close **#3** and **#4** if redundant.  
4) Run Netlify preview on `main`, submit test forms, legal content pass.

## Verdict

**GO WITH CONDITIONS**

Site is structurally sound: build/link checks pass, bilingual parity and assets OK, complementary pages visually aligned with PR #2 cinematic treatment after PR #6 fixes. **Do not treat as production-ready** until client/legal validates TBD content, home stats, portfolio copy, Netlify forms on preview, and social/contact details.

---

*Human validation requested — no merge performed in this pass.*
