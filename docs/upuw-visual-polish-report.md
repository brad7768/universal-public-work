# Rapport polish visuel UPUW — logo, mockups, CMS

Branche : `cursor/upuw-logo-mockup-cms-polish`  
Références : `docs/reference/upuw page1-8.png`, maquettes desktop/mobile  
Couleurs cibles : `#123B70`, `#F28C18`

---

## 1. Logo

| Action | Détail |
|--------|--------|
| Source | `logo upuw fond blanc.jpg` sur `main` (commit `c3bfc65`) |
| Canonique | `assets/brand/upuw-logo.jpg` — globe + script rouge + PUBLIC WORKS bleu |
| Sync build | `scripts/build.mjs` copie la racine → `assets/brand/` si le MD5 diffère |
| Shell | Header + footer : `<img>` avec alt FR/EN, ratio 2:1, `decoding="async"` |
| Nettoyage | Suppression de `assets/brand/logo-upuw-fond-blanc.jpg` (doublon) |
| CSS | `max-height` responsive header/footer ; footer logo sur fond blanc (maquette) |

**Preuve :** smoke vérifie `upuw-logo.jpg` sur 11 pages ; captures `upuw-home-*.png`, `upuw-devis-*.png` (375 / 1024 px).

---

## 2. CMS / contenu statique

Workflow documenté en en-tête de `scripts/build.mjs` :

- Éditer `src/pages/{fr,en}/*.html` et `data/*.json`
- Lancer **`npm run build`** → régénère `fr/`, `en/`, `sitemap.xml`, `_redirects`
- Netlify exécute désormais le build au déploiement (`netlify.toml`)

Aucune base de données ; les placeholders (`@products`, `@projects-home`, `@faq`, …) restent le contrat entre HTML source et données JSON.

---

## 3. Responsive (320–1440 px)

| Zone | Ajustements |
|------|-------------|
| Container | `clamp` padding latéral, largeur sûre à 320 px |
| Header | Top bar + tier-1 sticky ; hauteurs header réduites ≤992 / ≤380 px |
| Logo | `clamp(36px, 8vw, 48px)` |
| Hero pillars | 2 colonnes ≤520 px |
| Stats bar | Grille 2×2 ≤480 px |
| Services accueil | Grille 3×2 ≥900 px (maquette page 1) |
| Projets accueil | 4 colonnes ≥1024 px |
| Footer | 1 → 2 → 4 colonnes (520 / 992 px) |
| Devis | Panneau formulaire `width: 100%` ; grille quote-split sans débordement |

---

## 4. Mockups — corrigé vs restant

Comparaison visuelle **non pixel-perfect** (photos, icônes vectorielles et carrousels maquette ≠ assets actuels).

### Corrigé ou rapproché sur cette branche

- Logo image officiel site-wide (plus de placeholder texte)
- Barre supérieure bleue `#123B70`, hero cinématique avec overlay, bandeau stats orange/blanc
- Grilles services / projets / footer alignées sur la densité des planches desktop
- Devis : hero + formulaire multi-étapes + breadcrumbs ; mobile utilisable à 375 px

### Écarts encore visibles (Pass 3+)

| Page / bloc | Maquette | Site actuel |
|-------------|----------|-------------|
| Accueil — CTA hero secondaire | Icône « play » | Bouton outline sans icône |
| Accueil — bandeau 4 piliers | Icônes dorées | Texte seul |
| Accueil — cartes services | Icône ligne sous l’image | Lien texte orange |
| Accueil — réalisations | Carrousel + flèches | Grille statique 4 cartes |
| Accueil — devis bas de page | Formulaire complet inline | Lien vers `/fr/devis.html` (formulaire complet sur page dédiée) |
| Construction / études / équipements | Visuels et grilles spécifiques par planche | Structure OK ; photos stock génériques |
| Contact | Carte + formulaire côte à côte maquette | Split présent ; carte map placeholder |
| Global | Favicon, OG image, PDF brochures devis | Absents (inventaire §5) |

Contenu juridique / stats validé par le client : **conservé**.

---

## 5. Qualité

| Commande | Résultat |
|----------|----------|
| `npm run build` | OK — 50 pages |
| `npm run check-links` | OK |
| `npm run smoke` | OK — 11 URLs @ `http://127.0.0.1:8765` |
| Navigateur | Home + devis @ 375 px et 1024 px — pas de régression logo/nav signalée |

---

## 6. Déploiement

PR ouverte vers `main` — **non mergée** ; pas de claim production.
