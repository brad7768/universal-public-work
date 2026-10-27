#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const langs = ["fr", "en"];
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "src/pages-manifest.json"), "utf8"));
const slugs = manifest.map((p) => p.slug);

const hrefRe = /href="([^"#?]+)(?:[#?][^"]*)?"/g;
const errors = [];

for (const lang of langs) {
  for (const slug of slugs) {
    const file = path.join(ROOT, lang, slug);
    if (!fs.existsSync(file)) {
      errors.push(`MISSING ${lang}/${slug}`);
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    let m;
    while ((m = hrefRe.exec(html))) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) continue;
      if (href.startsWith("../")) {
        const target = path.join(ROOT, href.replace(/^\.\.\//, ""));
        if (!fs.existsSync(target) && !fs.existsSync(target.replace(/\/$/, ""))) {
          errors.push(`${lang}/${slug} → ${href} (asset missing)`);
        }
        continue;
      }
      if (!href.endsWith(".html") && href !== "index.html") continue;
      const target = path.join(ROOT, lang, path.basename(href));
      if (!fs.existsSync(target)) {
        errors.push(`${lang}/${slug} → ${href}`);
      }
    }
  }
}

for (const rootFile of ["index.html", "404.html", "css/styles.css", "js/main.js", "assets/brand/upuw-logo.jpg"]) {
  if (!fs.existsSync(path.join(ROOT, rootFile))) errors.push(`MISSING root: ${rootFile}`);
}

if (errors.length) {
  console.error("Link check failed:\n" + errors.join("\n"));
  process.exit(1);
}
console.log(`OK — ${langs.length * slugs.length} pages, internal links and key assets.`);
