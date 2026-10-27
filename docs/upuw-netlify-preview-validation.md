# UPUW — Validation finale préproduction (Netlify preview + technique)

**Repository:** [brad7768/universal-public-work](https://github.com/brad7768/universal-public-work)  
**Date:** 2026-10-27  
**Agent run:** [bc-21df9807-4bd4-59da-a81b-0e895965724e](https://cursor.com/agents/bc-21df9807-4bd4-59da-a81b-0e895965724e)  
**Branche rapport:** `cursor/upuw-final-preprod-validation-724e` → PR **#10** (doc)  
**Commit testé (local + référence contenu):** `dd98cf0` (`main` — merge PR #9)  
**Deploy Preview utilisé:** PR [#9](https://github.com/brad7768/universal-public-work/pull/9) — [https://deploy-preview-9--spectacular-paprenjak-42249c.netlify.app](https://deploy-preview-9--spectacular-paprenjak-42249c.netlify.app) (commit Netlify `19e9034`, deploy `6ae103fdcb6d7ffdfcf0a88e`)  
**Production Netlify (sans domaine custom):** [https://spectacular-paprenjak-42249c.netlify.app](https://spectacular-paprenjak-42249c.netlify.app) — pages clés **HTTP 200** depuis l’agent  
**Domaine custom `www.universalpublicworks.com`:** **non résolu** depuis l’environnement agent (DNS) — canonical/hreflang pointent déjà vers ce domaine dans le HTML.

## Conclusion : **VALIDÉ AVEC RÉSERVES**

Le site préprod sur preview #9 / `*.netlify.app` est **techniquement publiable** (build, liens, smoke preview, formulaires POST → page « Thank you » Netlify). **Réserves** : preuve dashboard Netlify absente, contenus chiffres/portfolio encore illustratifs, mentions légales partielles, domaine production non testé ici.

**Stop agent :** aucun merge PR #10, aucun déploiement prod/domaine, aucune suppression — **autorisation humaine requise** pour mise en prod et validation dashboard.

---

## Étape 1 — État GitHub (vérifié live)

| PR | Titre | État | Base → Head | Fusion |
|----|--------|------|-------------|--------|
| [#5](https://github.com/brad7768/universal-public-work/pull/5) | Consolidation PR #2 + PR #3 | **MERGED** | `cursor/upuw-passe-2-pages-ab3a` ← `cursor/upuw-consolidation-pr2-pr3` | 2026-10-27 |
| [#6](https://github.com/brad7768/universal-public-work/pull/6) | Pre-production review fixes (PR #5) | **MERGED** | branche #5 ← `cursor/upuw-preprod-review-pr5-ea4b` | 2026-10-27 |
| [#7](https://github.com/brad7768/universal-public-work/pull/7) | Netlify preview validation + devis prefill | **MERGED** | branche #6 ← `cursor/upuw-netlify-preview-validation-c399` | 2026-10-27 |
| [#9](https://github.com/brad7768/universal-public-work/pull/9) | Logo sync, Netlify build, mockup & responsive polish | **MERGED** | `main` ← `cursor/upuw-logo-mockup-cms-polish` | 2026-10-27T20:26:48Z |

**`main` (origin):** `dd98cf0` — merge PR #9. Modèle publish : `netlify.toml` → `command = "npm run build"`, `publish = "."`, `NODE_VERSION = "20"`.

### Deploy Preview (preuve)

- Commentaire bot **Netlify** sur PR #9 : Deploy Preview **SUCCESS** → URL ci-dessus.
- Checks GitHub PR #9 : `netlify/spectacular-paprenjak-42249c/deploy-preview` → SUCCESS.
- **Pas de token `NETLIFY_*`** dans l’environnement agent → pas d’accès CLI/dashboard API.

---

## Étape 2 — Formulaires sur **PREVIEW** (pas local seul)

Formulaires : **`quote-request`** (`/fr/devis.html`, `/en/devis.html`), **`procurement`** (`/fr/equipement.html`, `/en/equipement.html`).

### Inspection HTML publié (PREVIEW, après build Netlify)

| Élément | `quote-request` | `procurement` |
|---------|-----------------|---------------|
| `name` | `quote-request` | `procurement` |
| Hidden `form-name` | `quote-request` | `procurement` |
| Honeypot `bot-field` | Oui | Oui |
| `method="POST"` | Oui | Oui |
| Attributs `data-netlify` dans HTML servi | **Absents** (Netlify les retire après enregistrement au build — **comportement attendu**) |
| Site ID injecté (snippet Netlify) | `04b23b89-9df8-421d-b4de-163d3ca19121` | Idem |

**Source repo (LOCAL, avant traitement Netlify) :** `data-netlify="true"` + `netlify-honeypot` présents dans `fr/devis.html` / `fr/equipement.html` générés par `npm run build`.

Champs principaux : devis — `need_type`, `message`, `city`, `name`, `phone`, `email`, `consent`, `page`, `product`, `product_id` ; procurement — `name`, `phone`, `product`, `qty`, `note`, `page`.

### Soumissions synthétiques (PREVIEW uniquement)

| Test | URL | Résultat HTTP | Preuve livraison |
|------|-----|---------------|------------------|
| POST `quote-request` | `…/fr/devis.html` | **200** | Page HTML Netlify **« Thank you! »** |
| POST `procurement` | `…/fr/equipement.html` | **200** | Page HTML Netlify **« Thank you! »** |

Données : e-mail `test+upuw-preprod-<timestamp>@example.com`, téléphone fictif, libellés **TEST UPUW preprod synthetic** — **aucune donnée commerciale réelle**.

### Dashboard Netlify

| Vérification | Statut |
|--------------|--------|
| Entrées visibles dans Forms (UI) | **NOT VERIFIED** — pas d’accès dashboard/token |
| Notifications e-mail / webhook | **NOT VERIFIED** |

**Interprétation :** HTTP 200 + page de remerciement Netlify = **forte indication** d’acceptation côté Forms ; **validation opérationnelle = réservée humain avec accès Netlify**.

### Mobile (PREVIEW)

| Page | 375px | 1024px (index) |
|------|-------|----------------|
| `/fr/devis.html` | **PASS** — étapes devis, pas de scroll horizontal | — |
| `/fr/equipement.html` | **PASS** | — |
| `/fr/index.html` | — | **PASS** |

Détail : [`internal/mobile-tablet-testing-pr9.md`](/cursor/stores/bc-01a1182e-9d67-79ea-a7db-81f197b99417/internal/mobile-tablet-testing-pr9.md) (Project store). Avertissement console **aria-hidden** sur menu mobile — non bloquant fonctionnel.

---

## Étape 3 — Technique

### LOCAL (commit `dd98cf0`, `/workspace`)

| Commande | Résultat |
|----------|----------|
| `npm run build` | **OK** — 50 pages → `fr/`, `en/` |
| `npm run check-links` | **OK** |
| `npm run smoke` (sans serveur) | **ÉCHEC attendu** — fetch localhost refusé |
| `npm run smoke` avec `python3 -m http.server 8765` | **OK** — 11 pages @ `http://127.0.0.1:8765` |

### PREVIEW (Deploy Preview #9)

| Commande | Résultat |
|----------|----------|
| `npm run smoke -- https://deploy-preview-9--spectacular-paprenjak-42249c.netlify.app` | **OK** — 11 pages |
| Assets `/assets/brand/upuw-logo.jpg`, `/js/main.js` | **HTTP 200** |
| SEO spot (index FR/EN) | `description`, `og:title`, `canonical` + **hreflang fr/en/x-default** présents (URLs `https://www.universalpublicworks.com/...`) |

**JS / liens / assets :** aucune erreur bloquante signalée sur preview ; liens internes OK via `check-links` + smoke preview.

---

## Étape 4 — Contenu commercial

| Zone | Présentation | Statut |
|------|----------------|--------|
| Barre stats accueil/réalisations (`+50`, `10+`, etc.) | Chiffres **marketing** dans `scripts/build.mjs` (`renderStats`) | **Illustratif / non audité** — pas de disclaimer inline sur la barre |
| Portfolio (`data/projects.*.json`) | Disclaimer JSON + texte « placeholders » sur `realisations` | **Explicitement non vérifié** ; titres « Exemple — … », années `TBD` |
| Contacts WhatsApp / tel | `+237 659 432 516`, `+237 654 804 123`, Mendong | **Approuvé contenu site** (cohérent manifest + pages) — pas de test d’appel |
| Fiches produits / services | Contenu éditorial CMS/data | **Représentatif** ; prix/devis via formulaires |
| Mentions légales / RCCM | Pages présentes | **Champs légaux partiels / TBD** (héritage audits passes 1–4) |
| Identité visuelle | Logo `assets/brand/upuw-logo.jpg` | **Préservée** (PR #9) |

---

## Actions prioritaires (humain)

1. **Netlify UI** — confirmer les 2 soumissions TEST du 2026-10-27 sur preview ; activer/vérifier notifications pour `quote-request` et `procurement`.
2. **Contenu** — remplacer stats `+50` / `10+` par chiffres validés **ou** ajouter mention « indicatif » visible ; alimenter portfolio réel (JSON + visuels).
3. **Juridique** — finaliser RCCM, éditeur, politique confidentialité avec conseil si besoin.
4. **Domaine** — connecter `www.universalpublicworks.com` à Netlify et retester hreflang/canonical en prod.
5. **Accessibilité** — corriger avertissement `aria-hidden` menu mobile (faible priorité).
6. **Go-live** — après réserves levées : déployer `main` (déjà mergé #9) **avec autorisation explicite** ; ne pas merger PR #10 sans relecture si doc seule.

---

## Références

- `netlify.toml`, `package.json`, `scripts/build.mjs`, `scripts/smoke-pages.mjs`, `js/main.js`
- Données : `data/projects.fr.json`, `data/site.json`
- PR Netlify preview : [#9](https://github.com/brad7768/universal-public-work/pull/9)
