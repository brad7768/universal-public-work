# Inventaire des assets UPUW

Mise à jour **Passe 2 — alignement maquettes** (branche `cursor/upuw-passe-2-pages-ab3a`).

---

## 1. Logo officiel UPUW

| Fichier | Dimensions | Usage |
|---------|------------|--------|
| `assets/brand/upuw-logo.jpg` | 1024×512 (JPEG, fond blanc) | Header et footer — `<img>` sans déformation (`object-fit: contain`, hauteur max ~48px) |

Source : `logo upuw fond blanc.jpg` (dépôt `origin/main`), intégré en Passe 2.  
L’ancien `assets/brand/upuw-logo.svg` (placeholder texte) a été retiré.

---

## 2. Maquettes de référence (non publiées sur le site)

| Fichier | Rôle |
|---------|------|
| `docs/reference/upuw page1.png` … `upuw page8.png` | 8 pages principales FR (accueil → devis) |
| `docs/reference/maquette desktop upuw.png` | Vue d’ensemble desktop 15 pages |
| `docs/reference/maquette mobile upuw.png` | Vue d’ensemble mobile |

Ces fichiers ne sont pas servis en production ; ils servent à la validation visuelle et à la Passe 3.

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

## 4. Build & publication

| Élément | Détail |
|---------|--------|
| Source éditable | `src/pages/{fr,en}/*.html` + `data/*.json` |
| HTML publié | `fr/`, `en/` à la racine (commités ; Netlify `publish = "."`, **sans** commande de build) |
| Regénération locale | `npm run build` → écrit `fr/`, `en/`, `sitemap.xml`, `_redirects` |
| Vérification liens | `npm run check-links` |

---

## 5. Assets encore manquants (Pass 3+)

- Favicon / PWA icons  
- `og-default.jpg` (1200×630)  
- Photos réalisations client (remplacer placeholders JSON)  
- Brochures PDF mentionnées sur maquettes (devis)  
- URLs réseaux sociales officielles (actuellement placeholders)

---

*Dernière vérification : inventaire filesystem + `npm run check-links` après build.*
