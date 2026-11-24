(() => {
  "use strict";

  const D = window.PORTFOLIO;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const CATS = { games: "Games", software: "Software", design: "Design" };
  const ext = (url) => /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
  const o = D.owner;

  document.title = `${o.name} · Portfolio`;

  const projects = D.projects.map((p) => `
    <article class="plain-project" id="${esc(p.id)}">
      <p class="eyebrow">${esc(CATS[p.category] || p.category)} · ${esc(p.year)}${p.role ? " · " + esc(p.role) : ""}</p>
      <h3>${esc(p.title)}</h3>
      <p class="lead" style="margin:0 0 12px">${esc(p.summary)}</p>
      <div class="prose">${(p.description || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      ${p.tags && p.tags.length ? `<ul class="tags">${p.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>` : ""}
      ${p.links && p.links.length ? `<div class="actions">${p.links.map((l) => `<a class="btn" href="${esc(l.url)}"${ext(l.url)}>${esc(l.label)}</a>`).join("")}</div>` : ""}
    </article>`).join("");

  const contacts = (D.email ? [`<li><a href="mailto:${esc(D.email)}">Email<span>${esc(D.email)}</span></a></li>`] : [])
    .concat(D.socials.map((s) => `<li><a href="${esc(s.url)}"${ext(s.url)}>${esc(s.label)}<span>${esc(s.handle || "")}</span></a></li>`));

  document.getElementById("plain").innerHTML = `
    <div class="plain-top">
      <a href="index.html">← Back to the desktop</a>
      <a href="${esc(D.resume)}" download>Download resume</a>
    </div>
    <header>
      <h1>${esc(o.name)}</h1>
      <p class="hello-role">${esc(o.role)}${o.location ? " · " + esc(o.location) : ""}</p>
    </header>
    <main>
      <h2>About</h2>
      <div class="prose">${(o.bio || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      <h2>Projects</h2>
      ${projects}
      <h2>Skills &amp; tools</h2>
      <dl class="plain-skills">${D.skills.map((g) => `<dt>${esc(g.group)}</dt><dd>${g.items.map(esc).join(", ")}</dd>`).join("")}</dl>
      <h2>Contact</h2>
      <ul class="contact-list">${contacts.join("")}</ul>
    </main>
    <footer class="plain-footer"><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms and conditions</a></footer>`;
})();
