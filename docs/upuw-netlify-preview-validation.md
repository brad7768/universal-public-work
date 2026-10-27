# UPUW Netlify preview & form validation (Phases A–F)

**Repository:** [brad7768/universal-public-work](https://github.com/brad7768/universal-public-work)  
**Primary test target:** PR [#6](https://github.com/brad7768/universal-public-work/pull/6) (`cursor/upuw-preprod-review-pr5-ea4b`, base PR [#5](https://github.com/brad7768/universal-public-work/pull/5))  
**Validation branch / report PR:** `cursor/upuw-netlify-preview-validation-c399` (stacked on #6)  
**Date:** 2026-10-27  
**Agent run:** [bc-264fc186-9ced-55a4-93d5-597c0b0dc399](https://cursor.com/agents/bc-264fc186-9ced-55a4-93d5-597c0b0dc399)

## Verdict: **PASS WITH CONDITIONS**

Static publish layout, form markup, local build/smoke, and client-side prefill behave as expected on the PR #6 tree **after** the minimal `devis` product-prefill fix in this report PR. **Deploy Preview URL, live Netlify form POST proof, and dashboard/email confirmation remain blocked** pending Netlify/GitHub integration access from this environment.

**Stop:** No merge to `main`, no production deploy, no domain or env changes without human authorization.

---

## Phase A — Repository & publish model

| Check | Result |
|--------|--------|
| PR #6 base | `cursor/upuw-consolidation-pr2-pr3` (PR #5) — **confirmed** via `gh pr view 6` |
| Ancestry | `origin/cursor/upuw-consolidation-pr2-pr3` is ancestor of PR #6 HEAD — **confirmed** |
| `netlify.toml` publish dir | `publish = "."` (repo root) |
| Netlify build | `command = "npm run build"`; `NODE_VERSION = "20"` — runs on deploy/preview |
| Build vs publish | `npm run build` writes `fr/` + `en/` from `src/` via `scripts/build.mjs`; Netlify publishes repo root (not `dist/` unless `UPUW_DIST=1`) |
| Site ID in repo | **None** (`netlify.toml` has no `site_id`) |
| GitHub ↔ Netlify signal on PR #6 | Commit status **pending**, **zero** statuses; **no** Netlify bot comment on PR #6 |

**Publish implication:** Each Netlify deploy (production and Deploy Preview) runs `npm run build` so `fr/` and `en/` match `src/` at deploy time. Committed HTML in git should still be kept in sync locally before merge to ease review and offline checks.

---

## Phase B — Deploy Preview

| Attempt | Outcome |
|---------|---------|
| `gh pr view 6` deploy comment | **None** |
| `NETLIFY_AUTH_TOKEN` / `NETLIFY_*` in agent env | **Not present** (only unrelated `GH_*` telemetry) |
| `netlify` CLI | **Not installed** / not authenticated |
| Guessed preview URLs (`deploy-preview-6--*.netlify.app`) | HTTP 404, `server: Netlify` (site naming unknown) |
| `www.universalpublicworks.com` from agent VM | **DNS resolution failed** (cannot hit production from this pod) |

### Phase B status: **BLOCKED**

**Missing access (exact):**

1. Netlify **team member** or **personal access token** with rights on the linked UPUW site, **or**
2. Visible **Deploy Preview** link on PR #6 (requires GitHub app “Netlify” connected to `brad7768/universal-public-work`), **or**
3. Documented `*.netlify.app` preview URL for branch `cursor/upuw-preprod-review-pr5-ea4b`

**Not done:** Creating a new Netlify site (requires explicit user authorization per spec).

---

## Phase C — Form HTML inspection (source + built)

Forms under test: **`quote-request`** (devis), **`procurement`** (equipement).

### `quote-request` — `/fr/devis.html`, `/en/devis.html`

| Attribute | FR | EN |
|-----------|----|----|
| `name` | `quote-request` | `quote-request` |
| `data-netlify="true"` | Yes | Yes |
| Hidden `form-name` | `quote-request` | `quote-request` |
| `method` | `POST` | `POST` |
| Honeypot | `netlify-honeypot="bot-field"` + hidden `bot-field` | Same |
| Multi-step | 3 steps (`data-devis-next` / `data-devis-prev`) | Same |
| JS handler | `js/main.js` — `fetch("/", …)` + WhatsApp side channel | Same |

**Field names (Netlify payload):** `need_type`, `message`, `city`, `name`, `phone`, `email`, `consent`, `page`, `product_id`, `product`, `form-name`, `bot-field`.

**`?product=drone` prefill (devis):** Before this PR, markup lacked `#qv-product`, `#qv-product-id`, `#qv-product-row`, and `need_type` option `equipement`, so `applyDevisQueryParams()` in `main.js` could not prefill. **Fixed** in `src/pages/{fr,en}/devis.html` + rebuild. Browser check on local static server: **Achat d’équipement** + **Drones d’inspection** selected for `?product=drone`.

### `procurement` — `/fr/equipement.html`, `/en/equipement.html`

| Attribute | FR | EN |
|-----------|----|----|
| `name` | `procurement` | `procurement` |
| `data-netlify="true"` | Yes | Yes |
| Hidden `form-name` | `procurement` | `procurement` |
| `method` | `POST` | `POST` |
| Honeypot | Yes | Yes |

**Field names:** `name`, `phone`, `product`, `qty`, `note`, `page`, `form-name`, `bot-field`.

**`?product=drone` prefill (procurement):** **OK** — `#pf-product` set from query (`js/main.js`).

---

## Phase D — Live submissions (preview only)

| Test | Status |
|------|--------|
| POST `quote-request` with `test+upuw-preview@example.com` on **Deploy Preview** | **Not run** — no preview URL |
| POST `procurement` on preview | **Not run** |
| Netlify dashboard submission proof | **Not available** — no API/dashboard token |
| Local `python3 -m http.server` POST to `/` | **HTTP 501** (expected; not Netlify Forms) |

**Email notifications:** **Unknown** — requires Netlify UI configuration on the linked site; not verifiable from this run.

**Phase D status:** **BLOCKED** (same access gap as Phase B).

---

## Phase E — Build, links, smoke, spot checks

| Command | Result |
|---------|--------|
| `npm run build` | **OK** — 50 pages → `fr/`, `en/` |
| `npm run check-links` | **OK** |
| `npm run smoke` | **OK** (11 pages @ `http://127.0.0.1:8765` after local static server) |

**Spot checks (local server + browser):**

- FR/EN index: logo (`upuw-logo.jpg`), primary + secondary nav, FR/EN switcher, devis CTA — **OK**
- `devis.html?product=drone` prefill — **OK** (after fix)
- `equipement.html?product=drone` procurement prefill — **OK**
- Mobile layout: not exhaustively tested; desktop/narrow manual pass not repeated here

---

## Phase F — Minimal code change in this PR

**Issue:** Product catalog links use `devis.html?product=<id>` but devis templates did not expose DOM ids expected by `applyDevisQueryParams()`.

**Change:** Add `equipement` need type, hidden `product_id`, and product `<select>` to `src/pages/fr/devis.html` and `src/pages/en/devis.html`; regenerate committed HTML via `npm run build`.

---

## Conditions before production merge

1. Obtain **Deploy Preview** for PR #6 (or #7 stack) and repeat Phase D with `TEST` data only on preview.
2. In Netlify UI: register **`quote-request`** and **`procurement`**, enable email/webhook notifications, confirm submissions on preview (not only HTTP 200).
3. Human sign-off on PRs #2–#7 — **no agent merge**.

---

## Merge & deploy procedure (human only — do not execute from agents)

**No merge or production deploy is performed by automation.** Follow this order after review:

### Safe merge order (stacked PRs)

Merge into `main` in dependency order so each PR’s base is already on `main`:

1. **PR #5** → `main` (consolidation base)
2. **PR #6** → `main` (preprod review; depends on #5)
3. **PR #7** → `main` (this Netlify build + validation doc; depends on #6)

Alternatively, **squash-merge** each PR in the same sequence if your team prefers a linear history; do not merge #7 before #6 or #6 before #5.

### Deploy Preview testing (before merge)

- On each open PR, use the Netlify **Deploy Preview** link from the GitHub check or bot comment.
- Confirm `npm run build` succeeded in the Netlify deploy log.
- Spot-check FR/EN routes, forms (`quote-request`, `procurement`), and `devis.html?product=…` prefill on the **preview URL only** — not production.

### After merge to `main`

- Netlify **auto-deploys** from `main` when the GitHub ↔ Netlify link is active.
- Verify the **production** site URL (configured in Netlify) after the deploy completes; compare with the last approved Deploy Preview.
- Re-run form submission smoke tests on production only after explicit human approval.

---

## References

- `netlify.toml`, `package.json`, `scripts/build.mjs`, `js/main.js`
- Form pages: `fr/devis.html`, `en/devis.html`, `fr/equipement.html`, `en/equipement.html`
- Source templates: `src/pages/{fr,en}/devis.html`
