# Inventaire des assets UPUW

Mise à jour **logo + polish mockup/CMS** (branche `cursor/upuw-logo-mockup-cms-polish`).

---

## 1. Logo officiel UPUW

| Fichier | Dimensions | Usage |
|---------|------------|--------|
| `assets/brand/upuw-logo.jpg` | 1024×512 (JPEG, fond blanc) | Header et footer — `<img>` (`object-fit: contain`, max-height ~48px header / ~36px footer) |

| Source dépôt | Rôle |
|--------------|------|
| `logo upuw fond blanc.jpg` (racine, `origin/main`) | Upload client ; **copié automatiquement** vers `assets/brand/upuw-logo.jpg` à chaque `npm run build` |

L’ancien doublon `assets/brand/logo-upuw-fond-blanc.jpg` a été retiré.  
Pas de logo HTML / texte « UPUW » dans le shell — image officielle uniquement.

---

## 2. Maquettes de référence (non publiées sur le site)

| Fichier | Rôle |
|---------|------|
| `docs/reference/upuw page1.png` … `upuw page8.png` | 8 pages principales FR (accueil → devis) |
| `docs/reference/maquette desktop upuw.png` | Vue d’ensemble desktop 15 pages |
| `docs/reference/maquette mobile upuw.png` | Vue d’ensemble mobile |

Ces fichiers ne sont pas servis en production ; ils servent à la validation visuelle.

---

## 3. Images — `assets/images/`

| Fichier | Référencé | Usage actuel |
|---------|-----------|--------------|
| `hero-construction.jpg` | Oui | Hero cinématique accueil, cartes services |
| `hero-about-visual.png` | Oui | Hero À propos |
| `about-architecture.jpg` | Oui | Collages, réalisations placeholder |
| `about-hero-planning.jpg` | Oui | Études, contact, collages |
| `product-survey.jpg` | Oui | Produits / équipements |
| `product-drone.jpg` | Oui | Topographie, portfolio placeholder |
| `product-mixer.jpg` | Oui | Hero équipement |
| `product-blocks.jpg` | Oui | Produits |
| `product-industrial.jpg` | Oui | Produits |

**Portfolio :** les cartes projet dans `data/projects.*.json` utilisent ces visuels avec badge « Visuel illustratif » tant que le client n’a pas fourni de photos certifiées.

---

## 4. Build & publication (« CMS » statique)

| Élément | Détail |
|---------|--------|
| Corps de page | `src/pages/{fr,en}/*.html` + placeholders (`<!-- @products -->`, `@stats`, …) |
| Données listes | `data/*.json` (produits, projets, services, FAQ, nav) |
| Registre pages | `src/pages-manifest.json` |
| Générateur | `scripts/build.mjs` (en-tête fichier = doc workflow) |
| HTML publié | `fr/`, `en/` à la racine |
| Netlify | `netlify.toml` — `command = "npm run build"`, `NODE_VERSION = "20"`, `publish = "."` |
| Vérification | `npm run check-links`, `npm run smoke` (serveur local requis pour smoke) |

---

## 5. Assets encore manquants (Pass 3+)

- Favicon / PWA icons  
- `og-default.jpg` (1200×630)  
- Photos réalisations client (remplacer placeholders JSON)  
- Brochures PDF mentionnées sur maquettes (devis)  
- URLs réseaux sociales officielles (actuellement placeholders)

---

*Dernière vérification : build + check-links + smoke (11 URLs) sur cette branche.*
