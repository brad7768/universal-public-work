# Rapport de validation finale — UPUW (Passe 4)

**Dépôt :** [brad7768/universal-public-work](https://github.com/brad7768/universal-public-work)  
**Date :** 2026-10-27  
**Branche auditée :** `cursor/upuw-passe-3-complementary-133a` (PR [#3](https://github.com/brad7768/universal-public-work/pull/3))  
**Périmètre :** QA statique FR/EN, liens, responsive, formulaires (sans succès simulé), a11y/SEO de base, contenu TBD.  
**Hors scope appliqué :** aucun merge de PR, aucun déploiement production.

---

## 1. Résumé exécutif

Le site **Passe 3** livre **50 pages HTML** générées (`npm run build`) en **fr/** et **en/**, avec logo **`assets/brand/logo-upuw-fond-blanc.jpg`**, formulaires devis/procurement branchés sur **Netlify Forms + WhatsApp** (messages honnêtes en local), FAQ en `<details>`, catalogue → fiches produit → devis `?product=`, et fiches réalisation/service.

**Points bloquants process (avant merge PR #3) :**

1. **PR #3 en conflit** avec la tête de **PR #2** (`mergeable: CONFLICTING` sur GitHub) : la branche Passe 3 a divergé à partir du commit `13fd73a` et **n’intègre pas** les commits d’alignement maquettes `9c8b5b0` / `2ca7b54` (barre contact, nav P2, `docs/reference/`, logo `upuw-logo.jpg`, etc.).
2. **Rebase/merge P2→P3** tenté en local : **~15 conflits** (`netlify.toml`, `build.mjs`, templates Pass 2, etc.) — **non résolu** dans cette passe (attente validation humaine).

**Qualité technique sur la branche P3 seule :** `npm run build` et `npm run check-links` **OK** ; pas de scroll horizontal détecté (Playwright, 5 pages × 8 largeurs) ; menu mobile s’ouvre à 390px ; préremplissage devis `?product=drone` **OK**.

**Backend :** les formulaires **ne garantissent pas** la réception tant que Netlify Forms (`quote-request`, `procurement`) n’est pas enregistré et testé en **deploy preview** — le front l’affiche explicitement.

---

## 2. État dépôt et pull requests

| Élément | Constats |
|---------|----------|
| **main** | `42d8780` — docs Passe 1 + assets maquettes/logo uploadés |
| **PR #2** `cursor/upuw-passe-2-pages-ab3a` | Base : `cursor/pass1-audit-docs-0f93` ; **OPEN**, `MERGEABLE` ; 3 commits au-dessus de main ; **aucun check CI** reporté |
| **PR #3** `cursor/upuw-passe-3-complementary-133a` | Base GitHub : **branche PR #2** ; **OPEN**, **`CONFLICTING`** ; 1 commit Passe 3 (`7dd9067`) |
| **Ancêtre commun P2 ∩ P3** | `13fd73a` — **la pointe de P2 (`2ca7b54`) n’est pas ancêtre de P3** |
| **CI** | Aucun workflow signalé sur les branches PR #2 et #3 |
| **Netlify** | `netlify.toml` : `publish = "."` — **pas de commande de build obligatoire** (HTML racine commité ; build Node optionnel en dev) |

**Recommandation merge order :** mettre à jour PR #3 sur la tête de PR #2 (rebase ou merge), résoudre conflits, puis revoir visuellement vs `docs/reference/` (présents sur P2, **absents sur P3**).

---

## 3. Inventaire des 15 types de pages (FR + EN)

Mapping **spec Passe 1** → **implémentation P2+P3** (slugs réels). Chaque type a un miroir **fr/** et **en/** sauf utilitaires racine.

| # | Type (spec) | Slug(s) livré(s) | Chemins FR | Chemins EN |
|---|-------------|------------------|------------|------------|
| 1 | Accueil | `index.html` | `fr/index.html` | `en/index.html` |
| 2 | Construction | `construction.html` | `fr/construction.html` | `en/construction.html` |
| 3 | Ingénierie & plans | Hub `etudes-topographie.html#ingenierie` + détail `service-ingenierie.html` | `fr/etudes-topographie.html`, `fr/service-ingenierie.html` | `en/…` |
| 4 | Topographie & géomatique | Hub `#topographie` + `service-topographie.html` | `fr/etudes-topographie.html`, `fr/service-topographie.html` | `en/…` |
| 5 | Expertise technique | Ancre `construction.html#expertise` + `service-expertise.html` | `fr/construction.html`, `fr/service-expertise.html` | `en/…` |
| 6 | Équipement | `equipement.html` (+ redirects legacy `buy.html`) | `fr/equipement.html` | `en/equipement.html` |
| 7 | Réalisations | `realisations.html` | `fr/realisations.html` | `en/realisations.html` |
| 8 | Fiche projet | `realisation-{id}.html` (×3) | `fr/realisation-voirie-mendong.html`, `…-batiment-admin.html`, `…-topo-drone.html` | `en/realisation-*.html` |
| 9 | À propos | `a-propos.html` | `fr/a-propos.html` | `en/a-propos.html` |
| 10 | Devis | `devis.html` | `fr/devis.html` | `en/devis.html` |
| 11 | Contact | `contact.html` | `fr/contact.html` | `en/contact.html` |
| 12 | Politiques | `politiques.html` | `fr/politiques.html` | `en/politiques.html` |
| 13 | Confidentialité | `confidentialite.html` | `fr/confidentialite.html` | `en/confidentialite.html` |
| 14 | Mentions légales | `mentions-legales.html` | `fr/mentions-legales.html` | `en/mentions-legales.html` |
| 15 | FAQ | `faq.html` | `fr/faq.html` | `en/faq.html` |

**Pages complémentaires Passe 3 (hors numérotation spec, présentes dans sitemap) :**

- Catalogue : `fr/catalogue-equipements.html`, `en/catalogue-equipements.html`
- Fiches produit (×5) : `fr/fiche-produit-{survey,drone,mixer,blocks,industrial}.html` (+ EN)
- Détails service (×4) : `fr/service-{construction,ingenierie,topographie,expertise}.html` (+ EN)

**Utilitaires :** `index.html` (redirect langue), `404.html` (bilingue, `noindex`).

**Total généré :** **50** pages (`npm run build`).

### Logo

- Fichier servi : **`assets/brand/logo-upuw-fond-blanc.jpg`** (présent, ~67 Ko).
- **`assets/brand/upuw-logo.svg`** présent mais **non utilisé** dans le HTML généré.
- PR #2 utilise aussi **`upuw-logo.jpg`** (non présent sur branche P3 seule) — écart à résorber au merge P2/P3.

---

## 4. Navigation, liens et redirects

### Automatisé

| Test | Résultat |
|------|----------|
| `npm run check-links` | **PASS** — tous les `href` internes fr/en + racine |

### Spot-check manuel (chemins critiques)

| Parcours | Résultat |
|----------|----------|
| Catalogue → fiche → devis | **OK** — ex. `fiche-produit-drone.html` → `devis.html?product=drone` |
| Devis `?product=` | **OK** (Playwright) — domaine `equipement`, select produit `drone`, hidden `product_id` |
| Réalisations → fiche projet | **OK** — liens vers `realisation-*.html` |
| Construction → fiche service | **OK** — lien `service-construction.html` |
| Tier-2 expertises | **OK** — `#ingenierie`, `#topographie`, `#expertise` existent |
| hreflang FR ↔ EN | **OK** sur échantillon (`faq.html`, `catalogue-equipements.html`) |
| WhatsApp | **OK** — `https://wa.me/237659432516` (footer, mobile drawer, contact) |
| `tel:` / `mailto:` | **Absent** — téléphone uniquement via WhatsApp (non bloquant, amélioration possible) |
| `404.html` | **OK** — liens `/`, `/fr/`, `/en/` |
| `_redirects` | **OK** — `services→construction`, `buy→equipement`, `about→a-propos`, `policies→politiques` |
| `sitemap.xml` | **OK** — 50 URLs, **0 fichier manquant** à la racine |

**Écart spec :** pas de **filtres** portfolio (sidebar maquette page6) — grille statique + bandeau disclaimer.

---

## 5. Responsive et comparaison maquettes

### Tests Playwright (serveur static local, headless Chromium)

Pages : accueil, construction, catalogue, devis, FAQ.  
Largeurs : **320, 375, 390, 430, 768, 1024, 1280, 1440** px.

| Critère | Résultat |
|---------|----------|
| Scroll horizontal (`scrollWidth > clientWidth`) | **0 échec** sur 40 mesures |
| Menu mobile (390px, accueil) | **OK** — `.nav-mobile.is-open` après clic toggle |
| Hero / footer / formulaires | Pas de débordement mesuré ; revue visuelle pixel-perfect **non faite** |

### Comparaison `docs/reference/` (maquettes)

Sur **branche P3 seule**, le dossier **`docs/reference/` n’existe pas** (fichiers sur PR #2). Comparaison directe PNG **non réalisée** sur cet arbre git.

Écarts **documentés Passe 2** (toujours pertinents après merge) : wizard devis 3 étapes vs 5 maquette, stats/chiffres non certifiés, pas de carrousel projets, icônes ligne orange simplifiées, carte OSM contact absente sur P3 (`contact.html` : placeholder texte).

**Logo :** attributs `width="160" height="48"` — ratio approximatif ; pas de distorsion signalée en audit automatisé.

---

## 6. Formulaires et interactions

### Devis (`quote-request`, `#devis-form`)

| Comportement | Résultat |
|--------------|----------|
| Champs requis étape 1 | **OK** — `reportValidity()` bloque si nom/téléphone vides |
| Téléphone invalide (`type=tel`, ex. `abc`) | **OK** — bloqué par validation native |
| Email facultatif | **OK** — `type=email` si renseigné |
| Wizard 3 étapes | **OK** — next/prev |
| Consentement RGPD | **OK** — checkbox requise étape 3 ; texte **TBD client** |
| Soumission | `preventDefault` ; POST `/` ; statut **loading → error (local) ou neutral (HTTP OK)** — **pas de message « succès garanti »** |
| WhatsApp recap | **OK** — ouverture `_blank` après POST |
| Note backend | **OK** — bloc `.backend-note` + hint étape 3 |

**Local :** POST vers serveur static → **échec attendu** ; message *« Impossible de joindre Netlify Forms… »* — **comportement correct**.

**Prérequis Netlify :** activer form `quote-request`, notifications, test preview ; confirmer réception dans le dashboard.

### Procurement (`procurement`, `#procure-form`, `equipement.html`)

| Comportement | Résultat |
|--------------|----------|
| `?product=` sur `#pf-product` | **OK** (logique `main.js`) |
| Validation HTML5 | **OK** — `reportValidity()` |
| Netlify POST | Tentative silencieuse + WhatsApp — **pas de faux succès UI** |

### FAQ

| Comportement | Résultat |
|--------------|----------|
| Accordéon | **OK** — `<details class="faq-item">` natif ; ouverture vérifiée (Playwright) |

### Catalogue

| Fonction | Résultat |
|----------|----------|
| Filtre / recherche JS | **Non implémenté** — grille statique |

---

## 7. Accessibilité et SEO (revue ciblée)

| Élément | État | Action Passe 4 |
|---------|------|----------------|
| Skip link | **OK** — `Aller au contenu principal` / EN |
| Hiérarchie titres | **OK** sur échantillon (un `h1` par page hero) |
| Labels formulaires | **OK** — `<label for=…>` sur devis/procurement |
| Alt logo | **Minimal** — `alt="UPUW"` (pourrait être descriptif) |
| Focus menu mobile | **Partiel** — trap focus basique dans `main.js` |
| Contraste | **Non mesuré** (Lighthouse non exécuté) |
| `canonical` + `hreflang` | **OK** sur pages manifest |
| `robots.txt` + sitemap | **OK** |
| Open Graph | **Partiel** — `og:title`, `og:description`, `og:url` ; **`og:image` absent** |
| JSON-LD | Présent sur accueil P2 ; **à revérifier** post-merge sur P3 |
| LinkedIn/Instagram | **Placeholders** — URLs génériques |

---

## 8. Contenu FR/EN et sections légales

| Zone | Constat |
|------|---------|
| Parité structurelle FR/EN | **OK** — build miroir |
| Projets portfolio | **Illustratifs** — disclaimer bannière + `data/projects.*.json` |
| Stats accueil / réalisations | **Reprise maquette** — **non certifiées client** |
| RCCM, DPO, hébergeur | **TBD** — `mentions-legales.html`, `confidentialite.html` |
| Texte consentement devis | **TBD** juridique |
| Horaires, carte contact | **TBD** |
| FAQ | Contenu éditorial + entrées TBD dans JSON |
| Spec slugs `ingenierie-plans.html` etc. | **Non utilisés** — remplacés par hub + pages service (documenté ci-dessus) |

Aucun contenu légal ou chiffre d’affaires **inventé** dans cette passe.

---

## 9. Tests exécutés (résultats réels)

| Commande / outil | Résultat |
|------------------|----------|
| `npm run build` | **PASS** — `Built 50 pages → {fr,en}/` |
| `npm run check-links` | **PASS** |
| Playwright responsive audit (script local, non commité) | **PASS** — 0 scroll horizontal |
| Playwright devis prefill `?product=drone` | **PASS** |
| Playwright FAQ `<details>` | **PASS** |
| Playwright soumission devis complète | **Non terminé** (timeout visibilité étape 3 — tests partiels manuels via wizard OK) |
| Lighthouse / axe | **Non exécuté** |
| Netlify preview forms | **Non exécuté** (hors VM / pas de deploy) |
| CI GitHub | **Aucun check** |

---

## 10. Recommandations, corrections et suite

### Avant merge (priorité haute)

1. **Résoudre conflit PR #3 / PR #2** — intégrer alignement maquettes + conserver pages Passe 3.
2. **Tester formulaires** sur deploy Netlify preview (devis + procurement).
3. **Valider avec le client** : stats, projets, RCCM, privacy, URLs sociales, carte OSM.

### Améliorations non bloquantes

- Ajouter `tel:+237659432516` à côté du lien WhatsApp (contact/footer).
- `og:image` (logo ou visuel hero).
- Filtres portfolio (Pass 3 spec UI) si exigés maquette.
- Rebrancher comparaison visuelle avec `docs/reference/upuw page*.png` après merge P2.
- Utiliser SVG logo pour écrans retina (optionnel).

### PR Passe 4

Cette passe propose **PR #4** (`cursor/upuw-passe-4-validation-2f69`) empilée sur **PR #3**, contenant **ce rapport** uniquement — **sans merge** des PR #2/#3/#4 tant qu’autorisé.

---

*Rapport généré dans le cadre UP-5 — Passe 4 validation. Aucun déploiement production, aucun merge effectué.*
