// Writes the page titles and descriptions from `meta` in js/data.js into each
// page's HTML <head>, where search engines and link previews read them.
//
// Run from the project folder after changing `meta`, your name or your role:
//     node tools/update-meta.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load data.js the way the browser does, with a stand-in `window`.
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "js/data.js"), "utf8"), sandbox);
const D = sandbox.window.PORTFOLIO;
if (!D || !D.meta) throw new Error("js/data.js has no `meta` section.");

const fill = (t) => String(t).replace(/\{name\}/g, D.owner.name).replace(/\{role\}/g, D.owner.role);
const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const text = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const M = D.meta, P = M.pages || {};
const pages = [
  { file: "index.html",   title: M.title,           description: M.description,           siteName: true },
  { file: "plain.html",   title: P.plain.title,     description: P.plain.description },
  { file: "privacy.html", title: P.privacy.title,   description: P.privacy.description },
  { file: "terms.html",   title: P.terms.title,     description: P.terms.description },
  { file: "404.html",     title: P.notFound.title }
];

const warnings = [];
for (const page of pages) {
  const path = join(root, page.file);
  let html = readFileSync(path, "utf8");
  const before = html;
  const set = (label, pattern, tag) => {
    if (!pattern.test(html)) { warnings.push(`${page.file}: no ${label} tag found, skipped`); return; }
    html = html.replace(pattern, () => tag);
  };

  const title = fill(page.title);
  set("<title>", /<title>[^<]*<\/title>/, `<title>${text(title)}</title>`);
  if (page.description) {
    const desc = fill(page.description);
    set("description", /<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(desc)}">`);
    set("og:title", /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${attr(title)}">`);
    set("og:description", /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${attr(desc)}">`);
    if (desc.length > 160) warnings.push(`${page.file}: description is ${desc.length} characters; search results show about 155`);
  }
  if (page.siteName) set("og:site_name", /<meta property="og:site_name" content="[^"]*">/, `<meta property="og:site_name" content="${attr(D.owner.name)}">`);
  if (title.length > 65) warnings.push(`${page.file}: title is ${title.length} characters; search results show about 60`);

  if (html !== before) { writeFileSync(path, html); console.log(`Updated ${page.file}: ${title}`); }
  else console.log(`Unchanged ${page.file}`);
}
warnings.forEach((w) => console.warn("Warning: " + w));
