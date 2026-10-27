# Inventaire des assets UPUW

Audit du dépôt `brad7768/universal-public-work` (Passe 1). Chemins relatifs à la racine du site publié.

---

## 1. Logo officiel UPUW

| Recherche | Résultat |
|-----------|----------|
| Fichiers `*logo*` | **Aucun** |
| SVG / PNG marque dans `assets/` | **Aucun** (hors photo produits) |
| Usage UI | Texte **« UPUW »** dans `<a class="logo">` sur toutes les pages |

**Conclusion : logo officiel ABSENT.**

### Chemins cibles recommandés (client / Pass 2)

| Fichier | Usage |
|---------|--------|
| `assets/brand/upuw-logo.svg` | Header, footer, OG image option |
| `assets/brand/upuw-logo-mark.svg` | Favicon, mobile compact |
| `assets/brand/upuw-logo-light.svg` | Sur fond `#123B70` (si fourni) |
| `assets/brand/favicon.ico` | Racine ou `assets/brand/` + `<link rel="icon">` |
| `assets/brand/apple-touch-icon.png` | 180×180 |

Formats acceptables : SVG prioritaire ; PNG @2x en repli.

---

## 2. Images — `assets/images/`

| Fichier | Dimensions | Taille | Référencé dans le repo | Usage actuel / prévu |
|---------|------------|--------|------------------------|----------------------|
| `hero-construction.jpg` | 1920×1280 | ~246 Ko | **Oui** — `css/styles.css` `.hero--home` | Hero accueil |
| `hero-about-visual.png` | 1024×682 (JPEG mal nommé `.png`) | ~88 Ko | **Oui** — `.hero-visual-inner` | Visuel page À propos |
| `about-architecture.jpg` | 1600×1197 | ~372 Ko | **Non** | **Orphelin** — candidat hero `construction.html` ou réalisations |
| `about-hero-planning.jpg` | 1600×1067 | ~164 Ko | **Non** | **Orphelin** — candidat ingénierie / devis |
| `product-survey.jpg` | 1200×800 | ~109 Ko | **Oui** — `.product-media--survey` | Carte station totale |
| `product-drone.jpg` | 1200×800 | ~32 Ko | **Oui** — `.product-media--drone` | Carte drone |
| `product-mixer.jpg` | 1200×800 | ~55 Ko | **Oui** — `.product-media--mixer` | Bétonnière |
| `product-blocks.jpg` | 1200×800 | ~91 Ko | **Oui** — `.product-media--blocks` | Parpaings / briques |
| `product-industrial.jpg` | 1200×1600 | ~325 Ko | **Oui** — `.product-media--industrial` | Matériel industriel |

**Total images présentes :** 9 fichiers (~1,48 Mo).

---

## 3. Assets manquants (à produire ou fournir)

### 3.1 Marque

- [ ] Logo UPUW (voir §1)  
- [ ] Favicon / PWA icons  
- [ ] Image OG par défaut (`assets/brand/og-default.jpg` 1200×630) — **absente** (Twitter/OG sans `og:image` aujourd’hui)

### 3.2 Réalisations (Pass 3)

Pour chaque projet (nombre **TBD** client), prévoir :

```
assets/images/projects/<slug>/hero.jpg
assets/images/projects/<slug>/thumb.jpg
assets/images/projects/<slug>/gallery-01.jpg …
```

Alt text FR + EN dans JSON, pas dans le nom de fichier.

### 3.3 Pages métier

| Page | Besoin image |
|------|----------------|
| `construction.html` | Hero chantier (réutiliser `hero-construction.jpg` ou `about-architecture.jpg`) |
| `ingenierie-plans.html` | Plans / BIM — **TBD** |
| `topographie-geomatique.html` | Drone / topo — `product-drone.jpg` ou photo dédiée |
| `realisations.html` | Thumbnails projets — **TBD** |
| `contact.html` | Carte statique ou embed — pas d’asset obligatoire |
| `devis.html` | Optionnel illustration — `about-hero-planning.jpg` candidat |

### 3.4 Produits

Les 5 visuels actuels suffisent pour le catalogue initial ; fiches PDF **TBD** (liens externes, pas stockées sans accord).

---

## 4. Autres fichiers statiques

| Chemin | Rôle |
|--------|------|
| `css/styles.css` | Feuille unique |
| `js/main.js` | Comportements globaux |
| `sitemap.xml` | 11 URLs (à étendre Pass 4) |
| `robots.txt` | Sitemap + allow all |
| `netlify.toml` | Headers sécurité + cache images |

Pas de fonts locales ; dépendance Google Fonts CDN.

---

## 5. Netlify / cache

Images servies avec `Cache-Control: public, max-age=31536000, immutable` (`netlify.toml`). Renommer ou remplacer une image exige **nouveau nom de fichier** ou invalidation cache.

---

## 6. Checklist livraison client (assets)

1. `assets/brand/upuw-logo.svg`  
2. `assets/brand/upuw-logo-mark.svg`  
3. `assets/brand/favicon.ico`  
4. `assets/brand/og-default.jpg` (1200×630, logo + photo chantier)  
5. Jeu photos réalisations (hero + thumb par projet, droits d’usage confirmés)  
6. Optionnel : corriger extension `hero-about-visual.png` → `.jpg` en Pass 2 (cosmétique SEO/mime)

---

*Inventaire généré par lecture directe du filesystem et grep des références dans `css/`, `html/`, `js/`.*
