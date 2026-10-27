#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

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
              <img src="../assets/brand/upuw-logo.svg" width="160" height="44" alt="UPUW" />
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
              <img src="../assets/brand/upuw-logo.svg" width="140" height="38" alt="UPUW" />
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

function renderProducts(lang, wa) {
  const data = JSON.parse(read(path.join(ROOT, `data/products.${lang}.json`)));
  return data.products
    .map(
      (p) => `<article class="product-card reveal">
                <div class="product-media ${p.mediaClass}" role="presentation"></div>
                <div class="product-body">
                  <h3>${escapeHtml(p.name)}</h3>
                  <p>${escapeHtml(p.description)}</p>
                  <p class="product-price">${escapeHtml(p.priceLabel)}</p>
                  <a class="btn btn-outline" href="https://wa.me/${wa}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.cta)}</a>
                </div>
              </article>`
    )
    .join("\n              ");
}

function renderProductOptions(lang) {
  const data = JSON.parse(read(path.join(ROOT, `data/products.${lang}.json`)));
  return data.products
    .map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`)
    .join("\n                  ");
}

function renderProjects(lang, limit) {
  const data = JSON.parse(read(path.join(ROOT, `data/projects.${lang}.json`)));
  if (!data.projects.length) {
    return `<p class="empty-state reveal">${escapeHtml(data.emptyMessage)}</p>`;
  }
  const list = limit ? data.projects.slice(0, limit) : data.projects;
  return `<div class="project-grid">${list
    .map(
      (proj) => `<article class="project-card reveal">
        <div class="project-card-media" style="background-image:url('../assets/images/${proj.thumb || "hero-construction.jpg"}')"></div>
        <div class="project-card-body">
          <h3>${escapeHtml(proj.title)}</h3>
          <p>${escapeHtml(proj.summary || "")}</p>
        </div>
      </article>`
    )
    .join("")}</div>`;
}

function injectBlocks(content, lang, slug) {
  let out = content;
  if (out.includes("<!-- @products -->")) {
    out = out.replace("<!-- @products -->", renderProducts(lang, site.whatsapp));
  }
  if (out.includes("<!-- @product-options -->")) {
    out = out.replace("<!-- @product-options -->", renderProductOptions(lang));
  }
  if (out.includes("<!-- @projects-home -->")) {
    out = out.replace("<!-- @projects-home -->", renderProjects(lang, 3));
  }
  if (out.includes("<!-- @projects-full -->")) {
    out = out.replace("<!-- @projects-full -->", renderProjects(lang));
  }
  return out;
}

function renderPage(lang, pageDef) {
  const meta = { slug: pageDef.slug, ...pageDef[lang] };
  const nav = JSON.parse(read(path.join(ROOT, `data/nav.${lang}.json`)));
  const contentPath = path.join(ROOT, "src/pages", lang, pageDef.slug.replace(/\.html$/, "") + ".html");
  let content = read(contentPath);
  content = injectBlocks(content, lang, pageDef.slug);

  const { header, footer } = renderHeader(lang, meta, nav);
  const canonical = `${site.domain}/${lang}/${pageDef.slug === "index.html" ? "" : pageDef.slug}`.replace(/\/$/, "/");
  const canonicalTag =
    pageDef.slug === "index.html"
      ? `${site.domain}/${lang}/`
      : `${site.domain}/${lang}/${pageDef.slug}`;
  const altFr = `${site.domain}/fr/${pageDef.slug === "index.html" ? "" : pageDef.slug}`.replace(/\/$/, "/");
  const altEn = `${site.domain}/en/${pageDef.slug === "index.html" ? "" : pageDef.slug}`.replace(/\/$/, "/");

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

function buildSitemap() {
  const urls = [];
  for (const lang of ["fr", "en"]) {
    for (const page of manifest) {
      const loc =
        page.slug === "index.html"
          ? `${site.domain}/${lang}/`
          : `${site.domain}/${lang}/${page.slug}`;
      urls.push(`  <url><loc>${loc}</loc></url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
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

// Clean dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const dir of ["css", "js", "assets", "data"]) {
  copyDir(path.join(ROOT, dir), path.join(DIST, dir));
}

for (const file of ["index.html", "404.html", "robots.txt"]) {
  fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file));
}

write(path.join(DIST, "sitemap.xml"), buildSitemap());
write(path.join(DIST, "_redirects"), buildRedirects());

for (const page of manifest) {
  for (const lang of ["fr", "en"]) {
    const html = renderPage(lang, page);
    write(path.join(DIST, lang, page.slug), html);
  }
}

console.log(`Built ${manifest.length * 2} pages → ${DIST}`);
