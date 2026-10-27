#!/usr/bin/env node
/**
 * Lightweight smoke check: fetch key pages from a local static server.
 * Usage: node scripts/smoke-pages.mjs [baseUrl]
 * Example: python3 -m http.server 8765 &  && node scripts/smoke-pages.mjs http://127.0.0.1:8765
 */
const base = (process.argv[2] || "http://127.0.0.1:8765").replace(/\/$/, "");

const paths = [
  "/fr/index.html",
  "/en/index.html",
  "/fr/faq.html",
  "/en/faq.html",
  "/fr/confidentialite.html",
  "/fr/mentions-legales.html",
  "/fr/catalogue-equipements.html",
  "/fr/fiche-produit-drone.html",
  "/fr/service-construction.html",
  "/fr/realisation-voirie-mendong.html",
  "/fr/devis.html",
];

const failures = [];
for (const p of paths) {
  const url = base + p;
  try {
    const res = await fetch(url);
    if (!res.ok) failures.push(`${p} → HTTP ${res.status}`);
    else {
      const text = await res.text();
      if (!text.includes("<h1")) failures.push(`${p} → missing h1`);
      if (!text.includes("upuw-logo.jpg")) failures.push(`${p} → missing logo ref`);
    }
  } catch (e) {
    failures.push(`${p} → ${e.message}`);
  }
}

if (failures.length) {
  console.error("Smoke failed:\n" + failures.join("\n"));
  process.exit(1);
}
console.log(`Smoke OK (${paths.length} pages @ ${base})`);
