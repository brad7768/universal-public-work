# Système de design UPUW

Document de référence pour les Passes 2–4. Décrit l’**existant** (`css/styles.css`) et la **cible marque** (#123B70, #F28C18) sans inventer de composants non présents dans le repo.

---

## 1. Couleurs

### 1.1 Spécification marque (cible)

| Token sémantique | Hex | Usage prévu |
|------------------|-----|-------------|
| Bleu UPUW (primaire) | `#123B70` | Titres hero, header tier 2, liens institutionnels, fonds footer option |
| Orange UPUW (accent) | `#F28C18` | CTA, soulignements nav, FAB WhatsApp, badges |
| Neutres | À définir avec client | Texte, bordures, surfaces |

### 1.2 Implémentation actuelle (`:root`)

| Variable CSS | Valeur actuelle | Écart vs marque |
|--------------|-----------------|-----------------|
| `--bg` | `#fafafa` | OK neutre |
| `--surface` | `#ffffff` | OK |
| `--surface-2` | `#f4f4f5` | OK |
| `--border` | `#e4e4e7` | OK |
| `--text` | `#18181b` | OK |
| `--text-muted` | `#52525b` | OK |
| `--accent` | `#ea580c` | Proche mais ≠ `#F28C18` |
| `--accent-hover` | `#c2410c` | Dérivé orange actuel |
| `--accent-soft` | `rgba(234, 88, 12, 0.12)` | À recalculer sur `#F28C18` |
| `--gold` | `#b45309` | Prix produits — revoir vs orange marque |

**Bleu marque `#123B70` :** non utilisé aujourd’hui ; titres hero utilisent `#0f172a` (slate).

**Passe 2 :** introduire alias explicites puis basculer consommateurs :

```css
:root {
  --upuw-blue: #123B70;
  --upuw-orange: #F28C18;
  /* migration progressive : --accent: var(--upuw-orange); */
}
```

Vérifier contrastes WCAG AA (texte blanc sur `#123B70`, texte sombre sur `#F28C18`).

---

## 2. Typographie

### 2.1 Actuel

- **Corps / UI :** [DM Sans](https://fonts.google.com/specimen/DM+Sans) (Google Fonts), variable `400–1000`, chargée sur chaque page HTML.
- **Titres :** même famille, `font-weight: 800`, pas de face condensée dédiée.
- **Style nav / boutons :** uppercase, `letter-spacing: 0.08–0.22em`, tailles `0.65–0.82rem`.

### 2.2 Cible (brief)

- Conserver DM Sans pour le corps (lisibilité longue, déjà intégrée).
- **Titres display :** ajouter une face **condensée** (ex. **Barlow Condensed**, **Roboto Condensed**, ou police fournie client) — **Passe 2**, avec fallback `DM Sans` pour FOUT/perf.
- Charger uniquement les graisses utilisées (400, 600, 700, 800) pour limiter le poids.

### 2.3 Échelle type (dérivée du CSS existant)

| Élément | Taille | Poids |
|---------|--------|-------|
| H1 hero accueil | `clamp(1.85rem, 4.5vw, 3rem)` | 800 |
| H1 page intérieure | `clamp(1.75rem, 4vw, 2.65rem)` | 800 |
| H2 section | `clamp(1.45rem, 3vw, 2rem)` | 800 |
| H3 carte | `~1.1rem` | 700 |
| Corps | hérité `1rem`, `line-height: 1.65` | 400 |
| Nav desktop | `0.7rem` | 700 |
| Boutons | `0.68rem` | 800 |

---

## 3. Espacement & layout

| Token / pattern | Valeur |
|-----------------|--------|
| `--header-h` | `72px` |
| `.container` | `min(1180px, 92vw)` |
| Sections `.section` | `padding: clamp(2.75rem, 6vw, 5rem) 0` |
| `--radius` | `6px` (cartes `10–14px` en dur) |
| Grilles | `.grid-2`, `.grid-3`, `.service-grid`, `.product-grid` avec breakpoints `840px`, `900px`, `992px` |

**Breakpoints clés**

- `992px` : nav desktop → menu hamburger  
- `900px` : hero split une colonne  
- `840px` : grilles 3→1  
- `720px` : footer empilé  
- `680px` : layout politiques  

---

## 4. Composants

### 4.1 Boutons (`.btn`)

- **Primary :** fond `--accent`, texte `#050505`, hover shadow orange.  
- **Outline :** bordure neutre, hover fond léger.  
- Touch target menu : `44×44px` (`.menu-toggle`).

**Cible :** primary sur `--upuw-orange` ; option secondaire outline bleu `#123B70`.

### 4.2 Cartes

- `.card`, `.card-service`, `.product-card`, `.card-mission`, `.value-chip` — bordure `1px`, hover lift.  
- Numéros de service `.card-num` en filigrane.

### 4.3 Hero

- `.hero--home` : image `hero-construction.jpg` + dégradés.  
- `.hero--page` : badge + titre + sous-titre `.muted`.  
- `.hero--split` : texte + `.hero-visual` (about).

### 4.4 Header / footer (existant)

- Header sticky, blur, logo **texte** « UPUW ».  
- Footer 3 colonnes + crédit edgewebz.  
- **Cible Pass 2 :** logo image + barre tier 2 (voir plan d’implémentation).

### 4.5 FAB WhatsApp (`.fab-wa`)

- Fixe bas-droite, dégradé orange, `z-index: 120`.  
- Aligner couleur sur orange marque en Pass 2.

### 4.6 Formulaires (`.procure-panel`, `.form-row`)

- Labels uppercase petits, champs pleine largeur, focus bordure accent.  
- Réutiliser pour `devis.html` et éventuellement `contact.html`.

### 4.7 CTA band (`.cta-band`)

- Fond dégradé peach (`#fff7ed` → `#fdba74`) — peut entrer en conflit avec palette bleu/orange ; revisiter Pass 3.

### 4.8 Politiques (`.policy-layout`)

- Nav sticky latérale + blocs `.policy-block` ; pattern réutilisable pour FAQ longue.

---

## 5. Motion

- `--ease: cubic-bezier(0.4, 0, 0.2, 1)`  
- `.reveal` + `IntersectionObserver` dans `main.js`  
- `@media (prefers-reduced-motion: reduce)` : animations neutralisées — **bonne pratique à conserver**

---

## 6. Accessibilité (notes)

| Point | État | Action Pass 2+ |
|-------|------|----------------|
| Focus visible | `:focus-visible` outline accent | Vérifier sur boutons orange/bleu |
| Menu mobile | `aria-expanded`, `aria-hidden`, Escape, focus trap basique | Renforcer trap (Tab cycle) |
| Images décoratives | `aria-hidden` sur icônes | Alt text sur futures photos chantiers |
| Langue | `lang` sur `<html>` et commutateur | Maintenir parité hreflang |
| Contraste | Orange actuel sur blanc OK | Revalider après `#F28C18` et bleu header |
| Skip link | Absent | Ajouter « Aller au contenu » vers `#main-content` / `#contenu-principal` |

---

## 7. Icônes & illustration

- Pas de bibliothèque d’icônes ; symboles Unicode dans cartes services (◇ △ ✕).  
- WhatsApp : SVG inline dans FAB.  
- **Logo :** absent — voir inventaire assets.

---

*Référence code : `css/styles.css`, `js/main.js`. Aucune modification CSS en Passe 1.*
