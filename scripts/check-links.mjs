#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["fr", "en"];
const errors = [];

function walkHtml(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkHtml(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function resolveTarget(fromFile, href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (/^https?:\/\//i.test(href)) return null;
  const clean = href.split("?")[0].split("#")[0];
  if (!clean) return null;
  const fromDir = path.dirname(fromFile);
  let resolved = path.normalize(path.join(fromDir, clean));
  if (resolved.endsWith(path.sep) || !path.extname(resolved)) {
    resolved = path.join(resolved, "index.html");
  }
  return resolved;
}

for (const lang of LANGS) {
  const langDir = path.join(ROOT, lang);
  if (!fs.existsSync(langDir)) {
    errors.push(`Missing language directory: ${lang}/`);
    continue;
  }
  for (const file of walkHtml(langDir)) {
    const html = fs.readFileSync(file, "utf8");
    const hrefs = [...html.matchAll(/\shref="([^"]+)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      const target = resolveTarget(file, href);
      if (!target) continue;
      if (!fs.existsSync(target)) {
        errors.push(`${path.relative(ROOT, file)} → ${href} (missing ${path.relative(ROOT, target)})`);
      }
    }
  }
}

for (const rootPage of ["index.html", "404.html"]) {
  const p = path.join(ROOT, rootPage);
  if (!fs.existsSync(p)) errors.push(`Missing root file: ${rootPage}`);
}

if (errors.length) {
  console.error("Link check failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log(`Link check OK (${LANGS.map((l) => l + "/").join(", ")} + root pages)`);
