// Writes the page titles and descriptions from `meta` in js/data.js into each
// page's HTML <head>, where search engines and link previews read them.
// Also writes canonical tags, the home page's JSON-LD "Person" block,
// sitemap.xml and robots.txt from `siteUrl`.
//
// Run from the project folder after changing `meta`, `siteUrl`, your name or your role:
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
// path: the page's address relative to siteUrl (for canonical tags and the sitemap).
const pages = [
  { file: "index.html",   path: "",             title: M.title,         description: M.description, siteName: true, person: true },
  { file: "plain.html",   path: "plain.html",   title: P.plain.title,   description: P.plain.description },
  { file: "privacy.html", path: "privacy.html", title: P.privacy.title, description: P.privacy.description },
  { file: "terms.html",   path: "terms.html",   title: P.terms.title,   description: P.terms.description },
  { file: "404.html",     title: P.notFound.title }
];

const warnings = [];
let base;
try { base = new URL(D.siteUrl); } catch { base = null; }
if (base && !base.pathname.endsWith("/")) base.pathname += "/";
if (!base) warnings.push("siteUrl in js/data.js is missing or not a full URL; canonical tags, structured data, sitemap.xml and robots.txt were skipped");

// Structured data for the home page: tells search engines who the site is about.
const personJson = () => {
  const o = D.owner;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: o.name,
    jobTitle: o.role,
    url: base.href,
    sameAs: (D.socials || []).map((s) => s.url).filter((u) => /^https?:/i.test(u))
  };
  if (o.location) person.homeLocation = { "@type": "Place", name: o.location };
  // "<" is escaped so the JSON can never close the <script> tag early.
  return JSON.stringify(person, null, 2).replace(/</g, "\\u003c").replace(/\n/g, "\n  ");
};
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

  if (base && page.path !== undefined) {
    const url = new URL(page.path, base).href;
    // Canonical: the one address search engines should use for this page.
    const canonical = `<link rel="canonical" href="${attr(url)}">`;
    if (/<link rel="canonical" href="[^"]*">/.test(html)) html = html.replace(/<link rel="canonical" href="[^"]*">/, () => canonical);
    else {
      const desc = html.match(/<meta name="description" content="[^"]*">/);
      if (desc) html = html.replace(desc[0], () => `${desc[0]}\n  ${canonical}`);
      else warnings.push(`${page.file}: no description tag to place the canonical tag after, skipped`);
    }
    if (/<meta property="og:url" content="[^"]*">/.test(html)) html = html.replace(/<meta property="og:url" content="[^"]*">/, () => `<meta property="og:url" content="${attr(url)}">`);
  }
  if (base && page.person) {
    const block = `<script type="application/ld+json">\n  ${personJson()}\n  </script>`;
    if (/<script type="application\/ld\+json">[\s\S]*?<\/script>/.test(html)) html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => block);
    else html = html.replace(/\n<\/head>/, () => `\n  ${block}\n</head>`);
  }

  if (html !== before) { writeFileSync(path, html); console.log(`Updated ${page.file}: ${title}`); }
  else console.log(`Unchanged ${page.file}`);
}
// ---- sitemap.xml and robots.txt, built from siteUrl ----
// The sitemap lists the public pages (not 404.html). robots.txt blocks the
// tools/ folder and points to the sitemap.
const writeIfChanged = (file, content) => {
  const path = join(root, file);
  let old = null;
  try { old = readFileSync(path, "utf8"); } catch { /* new file */ }
  if (old === content) { console.log(`Unchanged ${file}`); return; }
  writeFileSync(path, content);
  console.log(`${old === null ? "Created" : "Updated"} ${file}`);
};

if (base) {
  const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const urls = pages.filter((p) => p.path !== undefined).map((p) => new URL(p.path, base).href);
  writeIfChanged("sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!-- Generated by tools/update-meta.mjs from siteUrl in js/data.js. Don't edit by hand. -->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${xml(u)}</loc></url>\n`).join("") +
    `</urlset>\n`);
  writeIfChanged("robots.txt",
    `# Generated by tools/update-meta.mjs from siteUrl in js/data.js. Don't edit by hand.\n` +
    `# Search engines only read this file at the root of a domain. See README: "Search engines".\n` +
    `User-agent: *\n` +
    `Disallow: ${new URL("tools/", base).pathname}\n\n` +
    `Sitemap: ${new URL("sitemap.xml", base).href}\n`);
  if (base.pathname !== "/") warnings.push(`siteUrl is in a subfolder (${base.pathname}), so search engines won't read robots.txt there; submit sitemap.xml in Google Search Console instead`);
}

warnings.forEach((w) => console.warn("Warning: " + w));
