# Spécifications des 15 pages UPUW (FR / EN)

Chaque page existe en **deux fichiers** miroirs : `fr/<slug>.html` et `en/<slug>.html`. Contenu **TBD** = placeholder ou à fournir par le client — ne pas inventer dates, certifications, prix, statuts juridiques.

Légende : **Existant** = page ou contenu déjà dans le repo ; **Nouveau** = à créer Passes 2–4.

---

## 1. Accueil — `index.html`

| | FR | EN |
|---|----|----|
| Route | `/fr/` ou `/fr/index.html` | `/en/` |
| Titre nav | Accueil | Home |
| Statut | **Existant** (refonte) | **Existant** |

**Sections cibles**

1. Hero : badge, H1 entrepreneur général, sous-titre zone Yaoundé / capitale nationale (**existant**, texte à valider).  
2. Tags / piliers (3 cartes ou chiffres clés) — **existant partiel**.  
3. Aperçu services (liens vers pôles) — remplacer liens WhatsApp seuls par pages dédiées.  
4. Bandeau réalisations (3 projets depuis JSON) — **TBD** projets.  
5. CTA devis + WhatsApp — **existant**.  
6. SEO : Organization + LocalBusiness JSON-LD — **existant**.

**Parité FR/EN :** structure identique ; numéro téléphone partagé.

---

## 2. Construction — `construction.html`

| | FR | EN |
|---|----|----|
| Nav | Construction | Construction |
| Statut | **Nouveau** | **Nouveau** |

**Sections**

1. Hero page (`hero--page`) : travaux publics, génie civil, coordination chantier.  
2. Processus (études → exécution → réception) — contenu **TBD**.  
3. Types d’ouvrages (routes, bâtiments, réseaux) — **TBD**, pas de liste fictive certifiée.  
4. Sécurité & qualité (reprise valeurs about : EPI, rapports) — **existant** à migrer.  
5. CTA devis + WhatsApp.  
6. Liens croisés vers Réalisations et Expertises.

**Source contenu :** fusion narrative `services.html` pôle 01 + positionnement `about.html`.

---

## 3. Ingénierie & plans — `ingenierie-plans.html`

| Nav FR | Nav EN |
|--------|--------|
| Ingénierie & plans | Engineering & plans |

**Sections :** hero ; description plans 2D/3D BIM-ready (**existant** services #02) ; livrables ; CTA devis. **TBD :** exemples de plans floutés / images client.

---

## 4. Topographie & géomatique — `topographie-geomatique.html`

**Sections :** drone, MNT, orthophotos (**services #03**) ; bornage & implantation (**#04**) ; équipement (lien `equipement.html`) ; CTA mission. **TBD :** périmètre géographique exact, délais type.

---

## 5. Expertise technique — `expertise-technique.html`

**Sections :** audits, contre-expertises, contrôle qualité (**services #05**) ; méthodologie **TBD** ; CTA audit WhatsApp / devis.

---

## 6. Équipement — `equipement.html` (ex-`buy.html`)

| | |
|---|---|
| Statut | **Existant** → renommer + redirects |

**Sections :** hero procurement ; grille produits (5 items + images CSS) ; formulaire `#procure-form` Netlify + WhatsApp ; mentions prix « sur devis » — **ne pas inventer tarifs**.

**Parité :** champs formulaire traduits (`data-lang`).

---

## 7. Réalisations — `realisations.html`

**Sections :** hero portfolio ; filtres (secteur, année) — **UI Pass 3**, données JSON ; grille cartes projet ; CTA contact. **TBD :** tous les projets (photos, légendes FR/EN).

---

## 8. Fiche projet — `realisation-projet.html`

Gabarit pour **un** projet (Pass 3) ; extensions futures via JSON + build (plusieurs HTML statiques ou param `?id=` documenté — **éviter SPA**).

**Sections :** hero image ; contexte ; périmètre UPUW ; galerie ; résultats **TBD** ; navigation prev/next ; CTA.

---

## 9. À propos — `a-propos.html` (ex-`about.html`)

**Sections :** hero split + visuel (**existant**) ; mission / vision ; valeurs (Sécurité, Données, Impact local) ; CTA WhatsApp. **TBD :** équipe, historique, chiffres.

---

## 10. Demande de devis — `devis.html`

**Sections :** intro ; formulaire (nom, org, téléphone, email optionnel, type de besoin, message, pièce jointe **hors scope static** sauf lien cloud) ; consentement RGPD **TBD** ; soumission Netlify + WhatsApp (même pattern que procurement). **Prérequis :** nom form Netlify, notifications.

---

## 11. Contact — `contact.html`

**Sections :** adresse Marché Mendong, Yaoundé (**existant** footer/schema) ; téléphone WhatsApp ; horaires **TBD** ; carte (OpenStreetMap embed **TBD**) ; liens sociaux (URLs placeholder LinkedIn/Instagram à remplacer). Pas de formulaire obligatoire si devis séparé — **décision client**.

---

## 12. Politiques — `politiques.html`

**Existant** — hub multi-sections avec nav scroll-spy (`main.js`).

**Sections actuelles :** à inventorier depuis HTML (CGU, procurement, etc.). Pass 4 : alléger en pointant vers `confidentialite.html` et `mentions-legales.html`.

---

## 13. Confidentialité — `confidentialite.html`

**Nouveau** — texte legal privacy **TBD** client. Structure : `policy-layout` ou page simple.

---

## 14. Mentions légales — `mentions-legales.html`

**Nouveau** — raison sociale, RCCM, siège, hébergeur **TBD** (Netlify + domaine). **Ne pas inventer** identifiants légaux.

---

## 15. FAQ — `faq.html`

**Nouveau** — liste Q/R depuis JSON ; catégories (devis, délais, zone géographique, paiement) — réponses **TBD** ou reprise contenu policies si pertinent.

---

## Matrice de parité FR/EN

| Exigence | Détail |
|----------|--------|
| Structure DOM | Sections homologues, mêmes classes CSS |
| `<head>` | `hreflang`, `canonical`, OG/Twitter traduits |
| JSON-LD | Types adaptés à la langue (`inLanguage`) |
| Nav / footer | Labels traduits, mêmes slugs de fichier |
| Formulaires | Messages WhatsApp bilingues (`data-lang`) |
| Assets | Images partagées ; alt text traduit |

---

## Pages utilitaires (hors 15)

| Fichier | Rôle |
|---------|------|
| `/index.html` | Redirect langue |
| `/404.html` | Erreur bilingue |

---

## Dépréciations

| Ancienne | Action |
|----------|--------|
| `services.html` | Redirect 301 → `construction.html` ou tier-2 hub après migration contenu |
| `buy.html` | Redirect → `equipement.html` |
| `about.html` | Redirect → `a-propos.html` |

---

*Contenu métier dérivé des fichiers `fr/*.html` audités ; pages nouvelles alignées sur le brief projet (Construction, Réalisations, Contact, Devis) et découpage des 6 pôles services actuels.*
