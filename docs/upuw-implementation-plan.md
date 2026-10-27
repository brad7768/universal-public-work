# Plan d’implémentation UPUW — site statique bilingue

**Projet :** Universal Public Works (`brad7768/universal-public-work`)  
**Périmètre de ce document :** fondation (Passe 1) et feuille de route Passes 2–4  
**Stack actuelle (confirmée par audit) :** HTML / CSS / JS vanilla, hébergement Netlify, **aucune étape de build**, pas de dépendances npm, pas de tests automatisés.

---

## 1. État des lieux (Passe 1)

### 1.1 Stack et déploiement

| Élément | Détail |
|--------|--------|
| Hébergement | Netlify (`netlify.toml`, `publish = "."`) |
| Build | Aucune commande de build |
| CSS | `css/styles.css` (~1 300 lignes, tokens `:root`) |
| JS | `js/main.js` (menu mobile, reveal, formulaire procurement → WhatsApp + POST Netlify Forms) |
| i18n | Dossiers `fr/` et `en/`, liens `hreflang`, commutation manuelle FR/EN |
| Racine `/` | `index.html` — redirection JS (`localStorage`, `?lang=`, `navigator.languages`) vers `/fr/` ou `/en/` |
| SEO | `sitemap.xml`, `robots.txt`, métadonnées OG/Twitter/JSON-LD par page |
| 404 | `404.html` (bilingue, style `lang-picker`) |

### 1.2 Plan de site actuel vs cible

**Actuel (10 pages contenu + utilitaires)**

| Route FR | Route EN | Rôle |
|----------|----------|------|
| `/fr/index.html` | `/en/index.html` | Accueil |
| `/fr/services.html` | `/en/services.html` | Hub 6 pôles métiers |
| `/fr/buy.html` | `/en/buy.html` | Catalogue équipement + formulaire Netlify |
| `/fr/about.html` | `/en/about.html` | À propos |
| `/fr/policies.html` | `/en/policies.html` | Politiques (multi-sections, nav latérale) |
| `/` | — | Sélecteur / redirect langue |
| `/404.html` | — | Erreur |

**Cible (15 pages × 2 langues = 30 fichiers HTML de contenu)**

Convention proposée : **slugs kebab-case identiques en FR et EN** (contenu traduit, URL parallel). Les slugs EN peuvent rester en anglais (`construction.html` partagé) ou utiliser des équivalents (`projects.html` vs `realisations.html`) — **recommandation : slugs identiques** pour simplifier la commutation de langue (remplacement `../en/` ↔ `../fr/`).

| # | Fichier | FR (titre nav) | EN (titre nav) | Provenance / note |
|---|---------|----------------|----------------|-------------------|
| 1 | `index.html` | Accueil | Home | Existant — refonte IA |
| 2 | `construction.html` | Construction | Construction | **Nouveau** — EG, travaux publics, chantiers |
| 3 | `ingenierie-plans.html` | Ingénierie & plans | Engineering & plans | Extrait de `services.html` (pôles 01–02) |
| 4 | `topographie-geomatique.html` | Topographie & géomatique | Surveying & geomatics | Extrait (pôles 03–04) |
| 5 | `expertise-technique.html` | Expertise technique | Technical expertise | Extrait (pôle 05) |
| 6 | `equipement.html` | Équipement | Equipment | Renommage `buy.html` + redirects |
| 7 | `realisations.html` | Réalisations | Projects | **Nouveau** — grille alimentée par JSON |
| 8 | `realisation-projet.html` | Fiche projet (modèle) | Project detail (template) | **Nouveau** — gabarit + query/hash ou slug statique |
| 9 | `a-propos.html` | À propos | About | Renommage `about.html` |
| 10 | `devis.html` | Demande de devis | Request a quote | **Nouveau** — formulaire(s) |
| 11 | `contact.html` | Contact | Contact | **Nouveau** — coordonnées, carte TBD, WhatsApp |
| 12 | `politiques.html` | Politiques | Policies | Existant — hub légal |
| 13 | `confidentialite.html` | Confidentialité | Privacy | **Nouveau** — section extraite ou dupliquée depuis policies |
| 14 | `mentions-legales.html` | Mentions légales | Legal notice | **Nouveau** — contenu TBD client |
| 15 | `faq.html` | FAQ | FAQ | **Nouveau** — questions TBD |

**Pages actuelles à traiter en migration**

- `services.html` : **déprécier** après Passes 2–3 — remplacer par header 2 niveaux + pages pôle ; conserver redirect Netlify `_redirects` ou `301` depuis `/fr/services.html` vers `/fr/construction.html` ou hub temporaire.
- `buy.html` → `equipement.html` (redirect obligatoire pour SEO).

**Hors décompte « 15 pages » :** `/`, `404.html` (inchangés).

### 1.3 Stratégie de composants partagés (recommandation)

**Problème :** header, footer, drawer mobile, FAB WhatsApp et blocs `<head>` SEO sont **copiés-collés** sur chaque page (~10×2 fichiers aujourd’hui ; 30 demain).

**Options évaluées**

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| Copie manuelle | Zéro build, statut quo | Erreurs nav/SEO, coût de maintenance élevé |
| Includes serveur (SSI) | HTML pur en prod | Non activé par défaut sur Netlify static |
| Script de build minimal (Node) | Partials, 30 pages cohérentes, CI Netlify | Introduit une **commande build** (changement `netlify.toml`) |

**Décision recommandée (Passe 2) :** script Node minimal (`scripts/build.mjs` + partials HTML dans `_partials/`) exécuté par Netlify :

```toml
[build]
  command = "node scripts/build.mjs"
  publish = "dist"
```

- **Source** : `src/fr/*.html`, `src/en/*.html` ou templates Nunjucks/ETA légers **sans** migrer vers React/Vite.
- **Sortie** : miroir de l’arborescence actuelle dans `dist/` (chemins `/fr/`, `/css/`, `/js/` inchangés pour les visiteurs).
- **Justification :** 30 pages × header 2 niveaux + footers légaux = risque de régression inacceptable en copie manuelle ; le coût d’un build de ~50 lignes est faible vs 15 pages métier.

**Alternative de repli :** si le client refuse tout build, maintenir un **manifeste** (`docs/component-checklist.md`) et snippets commentés — **non recommandé**.

### 1.4 Header deux niveaux (spécification cible)

**Niveau 1 (sticky)**  
- Logo UPUW (image SVG/PNG — **absent aujourd’hui**, texte « UPUW ») → `index.html`  
- Nav primaire : Accueil · Construction · Réalisations · Équipement · À propos · Contact  
- Commutateur FR | EN (conserver `hreflang` + `localStorage`)  
- CTA primaire : « Demander un devis » → `devis.html` (desktop) ; drawer mobile reprend CTA  

**Niveau 2 (sous-barre, desktop ≥993px)**  
- Liens secondaires : Ingénierie & plans · Topographie · Expertise · (option) FAQ  
- Style : bande `surface-2`, typo plus petite, pas de sticky séparé (scroll avec tier 1 ou collapse au scroll — à trancher Pass 2)

**Mobile :** tier 2 intégré dans le drawer sous un libellé « Expertises ».

### 1.5 Modèle de données statique

| Donnée | Fichier proposé | Consommateurs |
|--------|-----------------|---------------|
| Réalisations / chantiers | `data/projects.fr.json`, `data/projects.en.json` | `realisations.html`, `realisation-projet.html`, accueil |
| Catalogue équipement | `data/products.fr.json`, `data/products.en.json` | `equipement.html` (remplace markup hardcodé) |
| FAQ | `data/faq.fr.json`, `data/faq.en.json` | `faq.html` |
| Nav / footer labels | `data/nav.fr.json`, `data/nav.en.json` | partials build |

Rendu : **build script** injecte JSON en HTML statique (pas de fetch client obligatoire — meilleur SEO, pas de CORS).

### 1.6 Formulaires et intégrations

| Formulaire | Comportement actuel | Cible |
|------------|---------------------|-------|
| `#procure-form` sur `buy.html` | `preventDefault` → POST Netlify Forms + ouverture WhatsApp | Étendre pattern à `devis.html` ; champs TBD |
| CTA WhatsApp | `https://wa.me/237659432516` (+ messages encodés) | Centraliser constante dans `js/main.js` ou `data/site.json` |
| Netlify Forms | `data-netlify="true"`, honeypot | **Prérequis Netlify UI** : activer notifications ; tester en prod (ne pas simuler succès en local) |
| Contact email | Absent | TBD : Formspree, Netlify, ou WhatsApp seul — **décision client Pass 2** |

**Prérequis backend documentés (non simulés) :**

1. Compte Netlify avec formulaires activés pour chaque `name` de form distinct.  
2. Page de remerciement ou message inline (actuellement redirection WhatsApp uniquement).  
3. Optionnel : webhook Zapier/Make pour CRM.  
4. Numéro WhatsApp validé (+237 659 432 516 — présent dans le code, à confirmer côté client).

### 1.7 Risques de régression (migration IA)

1. **Liens externes / SEO** : URLs `buy.html`, `services.html`, `about.html` indexées → redirects 301 requis.  
2. **Sitemap / hreflang** : 30 URLs à maintenir ; incohérence FR/EN si slugs divergent.  
3. **Formulaire Netlify** : interception JS — toute nouvelle page devis doit dupliquer attributs `data-netlify` + hidden `form-name`.  
4. **Couleurs marque** : site utilise `#ea580c` (Tailwind orange), spec `#F28C18` / `#123B70` — refonte visuelle Pass 2 peut casser contrastes.  
5. **Images orphelines** : `about-architecture.jpg`, `about-hero-planning.jpg` non référencées — risque d’oubli ou double emploi.  
6. **Redirect racine** : dépendance JS pour `/` — conserver `noscript` et liens directs.  
7. **Netlify trailing slash** : commentaire dans `netlify.toml` — éviter règles redirect `/fr` ⟷ `/fr/` conflictuelles.

### 1.8 Rollback

- Chaque passe = branche + PR ; déploiement Netlify preview par PR.  
- Rollback prod : revert merge ou repoint branche `main` vers commit précédent.  
- Si build introduit en Pass 2 : conserver branche `legacy-static` sans build pendant transition.

---

## 2. Les quatre passes

### Passe 1 — Audit & documentation ✅ (courante)

- Audit repo, inventaire assets, docs canoniques, rapport interne.  
- **Aucune** page métier nouvelle, **aucun** changement stack sans accord.

### Passe 2 — Fondations

- Introduire build partials (si validé).  
- Tokens design system (`#123B70`, `#F28C18`) mappés progressivement.  
- Header 2 niveaux + footer étendu (liens légaux).  
- Fichiers JSON données (projets, produits, FAQ squelettes).  
- Redirects `buy` → `equipement`, `about` → `a-propos`.  
- Logo officiel intégré si fourni.

### Passe 3 — Pages métier (lot A)

- `construction`, pôles ingénierie/topographie/expertise, `realisations` + template projet.  
- Migration contenu depuis `services.html`.  
- Mise à jour `sitemap.xml`, JSON-LD.

### Passe 4 — Pages métier (lot B) & QA

- `devis`, `contact`, `confidentialite`, `mentions-legales`, `faq`.  
- Parité FR/EN, accessibilité, tests manuels navigateurs.  
- Revue liens morts, Lighthouse, validation formulaires **en environnement Netlify preview**.

---

## 3. Checklist d’exécution Passe 2

- [ ] Valider avec client : build Node vs copie manuelle.  
- [ ] Recevoir logo (`assets/brand/upuw-logo.svg` + variante claire/foncée).  
- [ ] Créer `scripts/build.mjs` + `_partials/header.html`, `footer.html`, `head-base.html`.  
- [ ] Ajouter variables CSS marque sans casser `--accent` existant (mapping documenté).  
- [ ] Créer `data/*.json` squelettes (projets vides OK, pas de faits inventés).  
- [ ] Configurer `_redirects` Netlify pour anciennes URLs.  
- [ ] Mettre à jour `netlify.toml` (`command`, `publish = "dist"`).  
- [ ] Documenter champs formulaires `devis.html` + noms Netlify Forms.  
- [ ] Inventorier contenu TBD (mentions légales, raison sociale, RC, etc.).  
- [ ] Test manuel : menu mobile, lang switch, procure/devis POST (preview Netlify).

---

## 4. Prérequis client / contenu

- Logo vectoriel et charte typo (condensée pour titres si exigée).  
- Liste réalisations (photos, titres, secteurs, dates **réelles**).  
- Textes légaux (mentions, confidentialité, CGV).  
- URLs LinkedIn / Instagram définitives (placeholders aujourd’hui).  
- Confirmation numéro WhatsApp et politique de réponse.  
- Décision : formulaire contact email vs WhatsApp-only.

---

*Document produit en Passe 1 — dernière révision : audit du dépôt tel que cloné sur branche `main` (commit `5be20cb`).*
