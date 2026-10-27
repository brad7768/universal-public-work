#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOGO = "../assets/brand/logo-upuw-fond-blanc.jpg";

const site = JSON.parse(fs.readFileSync(path.join(ROOT, "data/site.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "src/pages-manifest.json"), "utf8"));

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function navLink(item, activeId, kind) {
  const isActive =
    kind === "primary"
      ? item.id === activeId
      : item.id === activeId;
  const cls = isActive ? ' class="is-active"' : "";
  const current = isActive ? ' aria-current="page"' : "";
  return `<a href="${item.href}"${cls}${current}>${escapeHtml(item.label)}</a>`;
}

function renderHeader(lang, meta, nav) {
  const otherLang = lang === "fr" ? "en" : "fr";
  const pagePath = `/${lang}/${meta.slug || "index.html"}`;
  const canonicalSlug = meta.slug || "index.html";
  const frHref = lang === "fr" ? canonicalSlug : `../fr/${canonicalSlug}`;
  const enHref = lang === "en" ? canonicalSlug : `../en/${canonicalSlug}`;

  const primary = nav.primary
    .map((item) => navLink(item, meta.activePrimary, "primary"))
    .join("\n            ");

  const secondary = nav.secondary
    .map((item) => navLink(item, meta.activeSecondary, "secondary"))
    .join("\n            ");

  const mobilePrimary = nav.primary
    .map((item) => {
      const isActive = item.id === meta.activePrimary;
      return `<a href="${item.href}"${isActive ? ' class="is-active"' : ""}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n          ");

  const mobileSecondary = nav.secondary
    .map((item) => {
      const isActive = item.id === meta.activeSecondary;
      return `<a href="${item.href}"${isActive ? ' class="is-active"' : ""}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n            ");

  const footerLegal = nav.footer.legal
    .map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`)
    .join("\n            ");

  return {
    header: `<header class="site-header">
        <div class="header-tier1">
          <div class="container header-inner">
            <a href="index.html" class="logo">
              <img src="${LOGO}" width="160" height="48" alt="UPUW" />
            </a>
            <nav class="nav-desktop" aria-label="${lang === "fr" ? "Navigation principale" : "Main navigation"}">
              ${primary}
              <div class="lang-switch" role="navigation" aria-label="${escapeHtml(nav.langLabel)}">
                <span class="sr-only">${escapeHtml(nav.langLabel)}</span>
                <a href="${frHref}" class="${lang === "fr" ? "is-active" : ""}" lang="fr" hreflang="fr">FR</a>
                <a href="${enHref}" class="${lang === "en" ? "is-active" : ""}" lang="en" hreflang="en">EN</a>
              </div>
            </nav>
            <div class="header-actions">
              <a class="btn btn-primary btn-header-cta" href="${nav.cta.href}">${escapeHtml(nav.cta.label)}</a>
              <button
                type="button"
                class="menu-toggle"
                aria-expanded="false"
                aria-controls="mobile-drawer"
                aria-label="${escapeHtml(nav.mobileMenuLabel)}"
              >
                <span class="menu-toggle-bar"></span>
                <span class="menu-toggle-bar"></span>
                <span class="menu-toggle-bar"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="header-tier2" aria-label="${lang === "fr" ? "Expertises" : "Expertise areas"}">
          <div class="container header-tier2-inner">
            ${secondary}
          </div>
        </div>
      </header>
      <aside class="nav-mobile" id="mobile-drawer" aria-hidden="true" aria-label="${lang === "fr" ? "Menu mobile" : "Mobile menu"}">
        <nav>
          ${mobilePrimary}
          <p class="mobile-nav-heading">${escapeHtml(nav.secondaryLabel)}</p>
          <div class="mobile-nav-secondary">
            ${mobileSecondary}
          </div>
        </nav>
        <div class="mobile-nav-footer">
          <div class="mobile-lang" role="group" aria-label="${escapeHtml(nav.langLabel)}">
            <a href="${frHref}" class="${lang === "fr" ? "is-active" : ""}" lang="fr">Français</a>
            <a href="${enHref}" class="${lang === "en" ? "is-active" : ""}" lang="en">English</a>
          </div>
          <a class="btn btn-primary" href="${nav.cta.href}">${escapeHtml(nav.cta.label)}</a>
          <a class="btn btn-outline" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp +237 659 432 516</a>
        </div>
      </aside>`,
    footer: `<footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <a href="index.html" class="footer-logo">
              <img src="${LOGO}" width="140" height="42" alt="UPUW" />
            </a>
            <span>${escapeHtml(nav.footer.tagline)}</span>
          </div>
          <div class="footer-center">${escapeHtml(site.address.street)}, ${escapeHtml(site.address.locality)}, ${lang === "fr" ? "Cameroun" : "Cameroon"}</div>
          <nav class="footer-links" aria-label="${lang === "fr" ? "Liens de pied de page" : "Footer links"}">
            ${footerLegal}
            <a href="contact.html">${lang === "fr" ? "Contact" : "Contact"}</a>
            <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="${site.social.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="${site.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
          </nav>
          <p class="credit">
            <a href="https://edgewebz.com" target="_blank" rel="noopener noreferrer">${escapeHtml(nav.footer.credit)}</a>
          </p>
        </div>
      </footer>`,
    pagePath,
  };
}

function loadProducts(lang) {
  return JSON.parse(read(path.join(ROOT, `data/products.${lang}.json`)));
}

function loadProjects(lang) {
  return JSON.parse(read(path.join(ROOT, `data/projects.${lang}.json`)));
}

function loadServices(lang) {
  return JSON.parse(read(path.join(ROOT, `data/services.${lang}.json`)));
}

function productSheetHref(id) {
  return `fiche-produit-${id}.html`;
}

function projectDetailHref(id) {
  return `realisation-${id}.html`;
}

function serviceDetailHref(id) {
  return `service-${id}.html`;
}

function renderProducts(lang, wa, { catalogLinks = false } = {}) {
  const data = loadProducts(lang);
  const sheetLabel = lang === "fr" ? "Voir la fiche" : "View sheet";
  return data.products
    .map((p) => {
      const sheet = catalogLinks
        ? `<a class="btn btn-primary" href="${productSheetHref(p.id)}">${escapeHtml(sheetLabel)}</a>`
        : `<a class="btn btn-outline" href="${productSheetHref(p.id)}">${escapeHtml(sheetLabel)}</a>`;
      return `<article class="product-card reveal">
                <div class="product-media ${p.mediaClass}" role="presentation"></div>
                <div class="product-body">
                  <h3><a href="${productSheetHref(p.id)}">${escapeHtml(p.name)}</a></h3>
                  <p>${escapeHtml(p.description)}</p>
                  <p class="product-price">${escapeHtml(p.priceLabel)}</p>
                  <div class="card-actions">
                    ${sheet}
                    <a class="btn btn-outline" href="devis.html?product=${encodeURIComponent(p.id)}">${lang === "fr" ? "Devis" : "Quote"}</a>
                  </div>
                </div>
              </article>`;
    })
    .join("\n              ");
}

function renderProductOptions(lang) {
  const data = JSON.parse(read(path.join(ROOT, `data/products.${lang}.json`)));
  return data.products
    .map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`)
    .join("\n                  ");
}

function renderProjectsDisclaimer(lang) {
  const data = loadProjects(lang);
  if (!data.disclaimer || !data.projects.length) return "";
  return `<p class="notice-banner reveal" role="note">${escapeHtml(data.disclaimer)}</p>`;
}

function renderProjects(lang, limit) {
  const data = loadProjects(lang);
  if (!data.projects.length) {
    return `<p class="empty-state reveal">${escapeHtml(data.emptyMessage)}</p>`;
  }
  const list = limit ? data.projects.slice(0, limit) : data.projects;
  const cta = lang === "fr" ? "Voir la fiche" : "View case";
  return `<div class="project-grid">${list
    .map(
      (proj) => `<article class="project-card reveal">
        <a class="project-card-link" href="${projectDetailHref(proj.id)}">
          <div class="project-card-media" style="background-image:url('../assets/images/${proj.thumb || "hero-construction.jpg"}')"></div>
          <div class="project-card-body">
            <p class="project-card-meta">${escapeHtml(proj.sector || "")} · ${escapeHtml(proj.year || "")}</p>
            <h3>${escapeHtml(proj.title)}</h3>
            <p>${escapeHtml(proj.summary || "")}</p>
            <span class="project-card-cta">${escapeHtml(cta)}</span>
          </div>
        </a>
      </article>`
    )
    .join("")}</div>`;
}

function renderFaq(lang) {
  const data = JSON.parse(read(path.join(ROOT, `data/faq.${lang}.json`)));
  return data.categories
    .map(
      (cat) => `<section class="faq-category reveal" id="faq-${escapeHtml(cat.id)}">
        <h2>${escapeHtml(cat.title)}</h2>
        <div class="faq-list">
          ${(cat.items || [])
            .map(
              (item) => `<details class="faq-item">
              <summary>${escapeHtml(item.q)}</summary>
              <p>${escapeHtml(item.a)}</p>
            </details>`
            )
            .join("\n          ")}
        </div>
      </section>`
    )
    .join("\n            ");
}

function renderCatalogIntro(lang) {
  const data = loadProducts(lang);
  return escapeHtml(data.catalogIntro || "");
}

function renderFaqIntro(lang) {
  const data = JSON.parse(read(path.join(ROOT, `data/faq.${lang}.json`)));
  return escapeHtml(data.intro || "");
}

function injectBlocks(content, lang, slug) {
  let out = content;
  if (out.includes("<!-- @products -->")) {
    out = out.replace("<!-- @products -->", renderProducts(lang, site.whatsapp));
  }
  if (out.includes("<!-- @products-catalog -->")) {
    out = out.replace("<!-- @products-catalog -->", renderProducts(lang, site.whatsapp, { catalogLinks: true }));
  }
  if (out.includes("<!-- @catalog-intro -->")) {
    out = out.replace("<!-- @catalog-intro -->", renderCatalogIntro(lang));
  }
  if (out.includes("<!-- @product-options -->")) {
    out = out.replaceAll("<!-- @product-options -->", renderProductOptions(lang));
  }
  if (out.includes("<!-- @projects-home -->")) {
    out = out.replace("<!-- @projects-home -->", renderProjects(lang, 3));
  }
  if (out.includes("<!-- @projects-disclaimer -->")) {
    out = out.replace("<!-- @projects-disclaimer -->", renderProjectsDisclaimer(lang));
  }
  if (out.includes("<!-- @projects-full -->")) {
    out = out.replace("<!-- @projects-full -->", renderProjects(lang));
  }
  if (out.includes("<!-- @faq -->")) {
    out = out.replace("<!-- @faq -->", renderFaq(lang));
  }
  if (out.includes("<!-- @faq-intro -->")) {
    out = out.replace("<!-- @faq-intro -->", renderFaqIntro(lang));
  }
  return out;
}

function canonicalFor(lang, slug) {
  return slug === "index.html" ? `${site.domain}/${lang}/` : `${site.domain}/${lang}/${slug}`;
}

function renderPageShell(lang, meta, content) {
  const nav = JSON.parse(read(path.join(ROOT, `data/nav.${lang}.json`)));
  const { header, footer } = renderHeader(lang, meta, nav);
  const canonicalTag = canonicalFor(lang, meta.slug);
  const altFr = canonicalFor("fr", meta.slug);
  const altEn = canonicalFor("en", meta.slug);

  const fab = `<a
      class="fab-wa"
      href="https://wa.me/${site.whatsapp}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="${lang === "fr" ? "Contacter UPUW sur WhatsApp" : "Contact UPUW on WhatsApp"}"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      <span class="sr-only">WhatsApp</span>
    </a>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${canonicalTag}" />
    <link rel="alternate" hreflang="fr" href="${altFr}" />
    <link rel="alternate" hreflang="en" href="${altEn}" />
    <link rel="alternate" hreflang="x-default" href="${site.domain}/fr/" />
    <meta property="og:locale" content="${lang === "fr" ? "fr_FR" : "en_US"}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:url" content="${canonicalTag}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#123B70" />
    <link rel="stylesheet" href="../css/styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&amp;family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;0,9..40,800&amp;display=swap" rel="stylesheet" />
  </head>
  <body>
    <a class="skip-link" href="#${meta.mainId}">${escapeHtml(nav.skipLink)}</a>
    <div class="mobile-backdrop" aria-hidden="true" tabindex="-1"></div>
    <div class="page-wrap">
      ${header}
      <main class="page-main" id="${meta.mainId}">
${content}
      </main>
      ${footer}
    </div>
    ${fab}
    <script src="../js/main.js" defer></script>
  </body>
</html>
`;
}

function renderPage(lang, pageDef) {
  const meta = { slug: pageDef.slug, ...pageDef[lang] };
  const contentPath = path.join(ROOT, "src/pages", lang, pageDef.slug.replace(/\.html$/, "") + ".html");
  let content = read(contentPath);
  content = injectBlocks(content, lang, pageDef.slug);
  return renderPageShell(lang, meta, content);
}

function renderProjectDetailPage(lang, proj, allProjects) {
  const slug = projectDetailHref(proj.id);
  const idx = allProjects.findIndex((p) => p.id === proj.id);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;
  const navPrev = lang === "fr" ? "Projet précédent" : "Previous project";
  const navNext = lang === "fr" ? "Projet suivant" : "Next project";
  const back = lang === "fr" ? "Toutes les réalisations" : "All projects";
  const gallery = (proj.gallery || [proj.hero])
    .map(
      (img) =>
        `<figure class="detail-gallery-item"><img src="../assets/images/${escapeHtml(img)}" alt="" loading="lazy" /></figure>`
    )
    .join("\n              ");
  const content = `
        <section class="hero hero--page hero--detail">
          <div class="container hero-inner">
            <p class="hero-badge">${escapeHtml(proj.sector || "")}</p>
            <h1>${escapeHtml(proj.title)}</h1>
            <p class="lead">${escapeHtml(proj.summary || "")}</p>
          </div>
        </section>

        <section class="section detail-hero-media" style="padding-top:0">
          <div class="container">
            <div class="detail-hero-image" style="background-image:url('../assets/images/${escapeHtml(proj.hero || proj.thumb)}')"></div>
            <p class="notice-banner" role="note">${escapeHtml(loadProjects(lang).disclaimer || "")}</p>
          </div>
        </section>

        <section class="section">
          <div class="container detail-grid">
            <article class="detail-main reveal">
              <h2>${lang === "fr" ? "Contexte &amp; périmètre" : "Context &amp; scope"}</h2>
              <p>${escapeHtml(proj.scope || "")}</p>
              <h2>${lang === "fr" ? "Résultats" : "Outcomes"}</h2>
              <p>${escapeHtml(proj.results || "")}</p>
              <div class="detail-gallery">${gallery}</div>
            </article>
            <aside class="detail-aside reveal">
              <dl class="detail-facts">
                <div><dt>${lang === "fr" ? "Lieu" : "Location"}</dt><dd>${escapeHtml(proj.location || "TBD")}</dd></div>
                <div><dt>${lang === "fr" ? "Année" : "Year"}</dt><dd>${escapeHtml(proj.year || "TBD")}</dd></div>
                <div><dt>${lang === "fr" ? "Secteur" : "Sector"}</dt><dd>${escapeHtml(proj.sector || "TBD")}</dd></div>
              </dl>
              <a class="btn btn-primary" href="devis.html">${lang === "fr" ? "Demander un devis" : "Request a quote"}</a>
            </aside>
          </div>
        </section>

        <nav class="container detail-pager reveal" aria-label="${lang === "fr" ? "Navigation portfolio" : "Portfolio navigation"}">
          ${prev ? `<a href="${projectDetailHref(prev.id)}">← ${escapeHtml(navPrev)}</a>` : "<span></span>"}
          <a href="realisations.html">${escapeHtml(back)}</a>
          ${next ? `<a href="${projectDetailHref(next.id)}">${escapeHtml(navNext)} →</a>` : "<span></span>"}
        </nav>`;

  const meta = {
    slug,
    title: `${proj.title} | UPUW`,
    description: proj.summary || "",
    activePrimary: "realisations",
    mainId: lang === "fr" ? "contenu-principal" : "main-content",
  };
  return renderPageShell(lang, meta, content);
}

function renderProductDetailPage(lang, product) {
  const slug = productSheetHref(product.id);
  const specs = (product.specs || [])
    .map((s) => `<div><dt>${escapeHtml(s.label)}</dt><dd>${escapeHtml(s.value)}</dd></div>`)
    .join("\n                ");
  const content = `
        <section class="hero hero--page hero--buy">
          <div class="container hero-inner">
            <p class="hero-badge">${lang === "fr" ? "Fiche produit" : "Product sheet"}</p>
            <h1>${escapeHtml(product.name)}</h1>
            <p class="lead">${escapeHtml(product.longDescription || product.description)}</p>
          </div>
        </section>

        <section class="section" style="padding-top:0">
          <div class="container detail-grid">
            <div class="product-detail-media ${escapeHtml(product.mediaClass)}" role="presentation"></div>
            <aside class="detail-aside reveal">
              <p class="product-price">${escapeHtml(product.priceLabel)}</p>
              <dl class="detail-facts">${specs}</dl>
              <a class="btn btn-primary" href="devis.html?product=${encodeURIComponent(product.id)}">${lang === "fr" ? "Demander un devis" : "Request a quote"}</a>
              <a class="btn btn-outline" href="equipement.html#commande">${lang === "fr" ? "Formulaire procurement" : "Procurement form"}</a>
              <a class="btn btn-outline" href="catalogue-equipements.html">${lang === "fr" ? "Retour catalogue" : "Back to catalog"}</a>
            </aside>
          </div>
        </section>`;

  const meta = {
    slug,
    title: `${product.name} | UPUW`,
    description: product.description,
    activePrimary: "equipement",
    mainId: lang === "fr" ? "contenu-principal" : "main-content",
  };
  return renderPageShell(lang, meta, content);
}

function renderServiceDetailPage(lang, service) {
  const slug = serviceDetailHref(service.id);
  const sections = (service.sections || [])
    .map(
      (s) => `<article class="card reveal">
        <h2>${escapeHtml(s.heading)}</h2>
        <p>${escapeHtml(s.body)}</p>
      </article>`
    )
    .join("\n            ");
  const content = `
        <section class="hero hero--page ${escapeHtml(service.heroClass || "hero--page")}">
          <div class="container hero-inner">
            <p class="hero-badge">${escapeHtml(service.badge || "")}</p>
            <h1>${escapeHtml(service.title)}</h1>
            <p class="lead">${escapeHtml(service.summary || "")}</p>
          </div>
        </section>

        <section class="section" style="padding-top:0">
          <div class="container stack-cards">
            ${sections}
          </div>
        </section>

        <section class="section">
          <div class="container cta-band reveal">
            <h2>${lang === "fr" ? "Parler de ce service" : "Discuss this service"}</h2>
            <div class="cta-buttons">
              <a class="btn btn-primary" href="devis.html">${lang === "fr" ? "Demander un devis" : "Request a quote"}</a>
              <a class="btn btn-outline" href="${escapeHtml(service.relatedHref || "index.html")}">${escapeHtml(service.relatedLabel || "")}</a>
            </div>
          </div>
        </section>`;

  const meta = {
    slug,
    title: `${service.title} | UPUW`,
    description: service.summary || "",
    activePrimary: service.id === "construction" ? "construction" : null,
    activeSecondary: service.id === "ingenierie" || service.id === "topographie" ? service.id : null,
    mainId: lang === "fr" ? "contenu-principal" : "main-content",
  };
  return renderPageShell(lang, meta, content);
}

function collectSitemapUrls() {
  const urls = [];
  for (const lang of ["fr", "en"]) {
    for (const page of manifest) {
      urls.push(canonicalFor(lang, page.slug));
    }
    const projects = loadProjects(lang).projects;
    for (const p of projects) urls.push(canonicalFor(lang, projectDetailHref(p.id)));
    const products = loadProducts(lang).products;
    for (const p of products) urls.push(canonicalFor(lang, productSheetHref(p.id)));
    const services = loadServices(lang).services;
    for (const s of services) urls.push(canonicalFor(lang, serviceDetailHref(s.id)));
  }
  return urls;
}

function buildSitemap() {
  const urls = collectSitemapUrls();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n")}
</urlset>
`;
}

function buildRedirects() {
  return `/fr/services.html /fr/construction.html 301
/en/services.html /en/construction.html 301
/fr/buy.html /fr/equipement.html 301
/en/buy.html /en/equipement.html 301
/fr/about.html /fr/a-propos.html 301
/en/about.html /en/a-propos.html 301
/fr/policies.html /fr/politiques.html 301
/en/policies.html /en/politiques.html 301
`;
}

for (const lang of ["fr", "en"]) {
  fs.rmSync(path.join(ROOT, lang), { recursive: true, force: true });
}

write(path.join(ROOT, "sitemap.xml"), buildSitemap());
write(path.join(ROOT, "_redirects"), buildRedirects());

let pageCount = 0;

for (const page of manifest) {
  for (const lang of ["fr", "en"]) {
    const html = renderPage(lang, page);
    write(path.join(ROOT, lang, page.slug), html);
    pageCount += 1;
  }
}

for (const lang of ["fr", "en"]) {
  const projects = loadProjects(lang).projects;
  for (const proj of projects) {
    write(path.join(ROOT, lang, projectDetailHref(proj.id)), renderProjectDetailPage(lang, proj, projects));
    pageCount += 1;
  }
  const products = loadProducts(lang).products;
  for (const product of products) {
    write(path.join(ROOT, lang, productSheetHref(product.id)), renderProductDetailPage(lang, product));
    pageCount += 1;
  }
  const services = loadServices(lang).services;
  for (const service of services) {
    write(path.join(ROOT, lang, serviceDetailHref(service.id)), renderServiceDetailPage(lang, service));
    pageCount += 1;
  }
}

console.log(`Built ${pageCount} pages → ${ROOT}/{fr,en}/`);
