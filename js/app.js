(() => {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const S = window.OS_SETTINGS;
  const sound = (name) => window.OS_SOUND.play(name);
  const phone = matchMedia("(max-width: 767px)");

  /* ---------- Icons ---------- */
  const PATHS = {
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    skills: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01" stroke-width="2.4"/><path d="M7 14h10"/>',
    unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/><path d="M12 15v2"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01" stroke-width="3"/>',
    games: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 10.5v4M5 12.5h4"/><path d="M15.5 12h.01M18 14h.01" stroke-width="3"/>',
    software: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    design: '<path d="M12 20l8-8-3-3-8 8z"/><path d="M17 9l-1.5-6L3 6l3 12.5 3-1.5"/><circle cx="10" cy="10" r="1.5"/>',
    min: '<path d="M5 12h14"/>',
    max: '<rect x="5" y="5" width="14" height="14" rx="1.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'
  };
  const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name] || ""}</svg>`;

  const CATS = {
    games: { label: "Games" },
    software: { label: "Software" },
    design: { label: "Design" }
  };
  const catLabel = (c) => (CATS[c] ? CATS[c].label : c || "");
  const extLink = (url) => /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";

  /* ---------- Apps ---------- */
  const APPS = {
    projects: { title: "Projects", icon: "folder", w: 780, h: 580, render: renderProjects },
    about: { title: "About me", icon: "user", w: 560, h: 520, render: renderAbout },
    skills: { title: "Skills & tools", icon: "skills", w: 560, h: 480, render: renderSkills },
    contact: { title: "Contact", icon: "mail", w: 460, h: 460, render: renderContact },
    resume: { title: "Resume.pdf", icon: "file", w: 440, h: 320, render: renderResume },
    settings: { title: "Settings", icon: "gear", w: 600, h: 640, render: renderSettings },
    // Not on the desktop: opened with Alt+/ (or #shortcuts) and the secret trick.
    shortcuts: { title: "Keyboard shortcuts", icon: "keyboard", w: 460, h: 600, render: renderShortcuts },
    secret: { title: "Secret.app", icon: "unlock", w: 440, h: 440, render: renderSecret }
  };
  const DESKTOP = [
    { app: "projects", label: "Projects" },
    { app: "about", label: "About me" },
    { app: "skills", label: "Skills" },
    { app: "contact", label: "Contact" },
    { app: "resume", label: "Resume" },
    { app: "settings", label: "Settings" },
    { href: "plain.html", label: "Plain view", icon: "list" }
  ];

  function getApp(id) {
    if (APPS[id]) return APPS[id];
    if (id.startsWith("project:")) {
      const p = D.projects.find((x) => x.id === id.slice(8));
      if (p) return { title: p.title, icon: CATS[p.category] ? p.category : "folder", w: 720, h: 620, render: (b) => renderProject(b, p) };
    }
    return null;
  }

  /* ---------- Window manager ---------- */
  const layer = $("#windows");
  const taskList = $("#taskList");
  const wins = new Map();
  let z = 10;
  let cascade = 0;

  /* ---------- Zoom animations ----------
     Windows grow out of whatever opened them (an icon, card, menu item or
     taskbar button) and shrink into their taskbar button when minimized. */
  const EASE_OUT = "cubic-bezier(.2, .8, .2, 1)";
  const EASE_IN_OUT = "cubic-bezier(.4, 0, .6, 1)";

  function zoomTransform(el, rect) {
    const w = el.getBoundingClientRect();
    if (!rect || !rect.width || !w.width) return null;
    return `translate(${rect.left - w.left}px, ${rect.top - w.top}px) scale(${rect.width / w.width}, ${rect.height / w.height})`;
  }

  function zoomIn(el, rect) {
    if (!S.motion() || !el.animate) return;
    const from = zoomTransform(el, rect);
    if (!from) return;
    el.classList.add("anim-js");
    el.animate(
      [{ transform: from, opacity: 0, offset: 0 }, { opacity: 1, offset: 0.35 }, { transform: "none", opacity: 1, offset: 1 }],
      { duration: 300, easing: EASE_OUT });
  }

  // Resolves to true when it finished, false if it was cancelled.
  function zoomOut(el, rect) {
    const to = S.motion() && el.animate ? zoomTransform(el, rect) : null;
    if (!to) return { done: Promise.resolve(true), cancel() {} };
    el.style.pointerEvents = "none";
    const anim = el.animate(
      [{ transform: "none", opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: to, opacity: 0 }],
      { duration: 240, easing: EASE_IN_OUT });
    const done = anim.finished.then(() => true, () => false).finally(() => { el.style.pointerEvents = ""; });
    return { done, cancel: () => anim.cancel() };
  }

  const isHidden = (win) => win.el.hidden || !!win.minimizing;

  function restoreWin(id, rect) {
    const win = wins.get(id);
    if (win.minimizing) { win.minimizing.cancel(); win.minimizing = null; }
    else if (win.el.hidden) { win.el.hidden = false; zoomIn(win.el, rect); }
    sound("open");
    focusWin(id);
    win.el.focus({ preventScroll: true });
  }

  // `from` is the on-screen rectangle of whatever opened the window (optional).
  function openWin(id, from) {
    const app = getApp(id);
    if (!app) return;
    const existing = wins.get(id);
    if (existing) {
      if (isHidden(existing)) { restoreWin(id, from); return; }
      focusWin(id);
      existing.el.focus({ preventScroll: true });
      return;
    }

    const tid = "w-" + id.replace(/[^a-z0-9]/gi, "-");
    const el = document.createElement("section");
    el.className = "window";
    el.tabIndex = -1;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-labelledby", tid);
    el.innerHTML = `
      <header class="titlebar">
        <span class="title-icon">${svg(app.icon)}</span>
        <div class="title" id="${tid}">${esc(app.title)}</div>
        <button class="win-btn min" type="button" aria-label="Minimize ${esc(app.title)}">${svg("min")}</button>
        <button class="win-btn max" type="button" aria-label="Maximize ${esc(app.title)}">${svg("max")}</button>
        <button class="win-btn close" type="button" aria-label="Close ${esc(app.title)}">
          <span class="x">${svg("close")}</span><span class="back">${svg("back")}Back</span>
        </button>
      </header>
      <div class="window-body"></div>`;

    const area = layer.getBoundingClientRect();
    const w = Math.min(app.w, area.width - 40);
    const h = Math.min(app.h, area.height - 40);
    const off = (cascade++ % 6) * 28;
    const x = clamp((area.width - w) / 2 - 60 + off, 20, Math.max(20, area.width - w - 20));
    const y = clamp((area.height - h) / 2 - 50 + off, 16, Math.max(16, area.height - h - 16));
    Object.assign(el.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });

    app.render($(".window-body", el));

    const task = document.createElement("button");
    task.type = "button";
    task.className = "task";
    task.innerHTML = `${svg(app.icon)}<span>${esc(app.title)}</span>`;
    task.addEventListener("click", () => {
      const win = wins.get(id);
      if (isHidden(win)) restoreWin(id, task.getBoundingClientRect());
      else if (win.el.classList.contains("is-focused")) minimizeWin(id);
      else { focusWin(id); sound("click"); }
    });
    taskList.append(task);

    wins.set(id, { el, task, opener: document.activeElement });
    layer.append(el);

    $(".min", el).addEventListener("click", () => minimizeWin(id));
    $(".max", el).addEventListener("click", () => toggleMax(id));
    $(".close", el).addEventListener("click", () => closeWin(id));
    el.addEventListener("pointerdown", () => focusWin(id));
    el.addEventListener("focusin", () => focusWin(id));
    makeDraggable(id, el, $(".titlebar", el));

    sound("open");
    zoomIn(el, from);
    focusWin(id);
    el.focus({ preventScroll: true });
  }

  function focusWin(id) {
    const win = wins.get(id);
    if (!win || win.el.classList.contains("is-focused")) return;
    wins.forEach((w) => { w.el.classList.remove("is-focused"); w.task.classList.remove("is-active"); });
    win.el.style.zIndex = ++z;
    win.el.classList.add("is-focused");
    win.task.classList.add("is-active");
  }

  function topVisible() {
    let best = null;
    wins.forEach((w, id) => {
      if (!isHidden(w) && (!best || +w.el.style.zIndex > +best.w.el.style.zIndex)) best = { id, w };
    });
    return best;
  }

  function blurAll() {
    wins.forEach((w) => { w.el.classList.remove("is-focused"); w.task.classList.remove("is-active"); });
  }

  function minimizeWin(id) {
    const win = wins.get(id);
    if (isHidden(win)) return;
    const anim = zoomOut(win.el, win.task.getBoundingClientRect());
    win.minimizing = anim;
    anim.done.then((finished) => {
      if (win.minimizing !== anim) return;
      win.minimizing = null;
      if (finished) win.el.hidden = true;
    });
    sound("minimize");
    blurAll();
    const next = topVisible();
    if (next) { focusWin(next.id); next.w.el.focus({ preventScroll: true }); }
    else win.task.focus();
  }

  function closeWin(id) {
    const win = wins.get(id);
    if (win.minimizing) win.minimizing.cancel();
    if (S.motion() && win.el.animate && !win.el.hidden) {
      win.el.style.pointerEvents = "none";
      win.el.animate(
        [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(8px)" }],
        { duration: 140, easing: EASE_IN_OUT }
      ).finished.finally(() => win.el.remove());
    } else {
      win.el.remove();
    }
    win.task.remove();
    wins.delete(id);
    sound("close");
    blurAll();
    const next = topVisible();
    if (win.opener && document.contains(win.opener) && win.opener !== document.body) {
      win.opener.focus({ preventScroll: true });
    } else if (next) {
      next.w.el.focus({ preventScroll: true });
    }
    if (next) focusWin(next.id);
  }

  function toggleMax(id) {
    const win = wins.get(id);
    const on = win.el.classList.toggle("is-max");
    $(".max", win.el).setAttribute("aria-label", `${on ? "Restore" : "Maximize"} ${getApp(id).title}`);
  }

  function makeDraggable(id, el, handle) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest("button") || phone.matches || el.classList.contains("is-max")) return;
      const area = layer.getBoundingClientRect();
      const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        el.style.left = clamp(ox + ev.clientX - sx, 120 - el.offsetWidth, area.width - 120) + "px";
        el.style.top = clamp(oy + ev.clientY - sy, 0, area.height - 42) + "px";
      };
      const up = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
    handle.addEventListener("dblclick", (e) => {
      if (!e.target.closest("button") && !phone.matches) toggleMax(id);
    });
  }

  /* ---------- Window contents ---------- */
  function cover(p, extra = "") {
    if (p.image) {
      return `<span class="cover ${extra}"><img src="${esc(p.image)}" alt="${extra ? esc(p.imageAlt || p.title) : ""}" loading="lazy"></span>`;
    }
    const initial = esc((p.title || "?").trim().charAt(0).toUpperCase());
    return `<span class="cover cover-gen ${extra}" style="--c:${esc(p.color || "#FFB020")}" aria-hidden="true">
      <span class="cover-tag">${esc(catLabel(p.category))}</span><span class="cover-initial">${initial}</span></span>`;
  }

  function renderProjects(body) {
    const counts = {};
    D.projects.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const filters = [["all", "All", D.projects.length]].concat(
      Object.keys(CATS).filter((k) => counts[k]).map((k) => [k, CATS[k].label, counts[k]]));

    body.innerHTML = `
      <p class="eyebrow">${D.projects.length} projects</p>
      <h2 class="win-h">Selected work</h2>
      <p class="lead">${esc(D.projectsIntro)}</p>
      <div class="filters" role="group" aria-label="Filter projects">
        ${filters.map(([k, label, n], i) => `<button class="chip-btn" type="button" data-cat="${k}" aria-pressed="${i === 0}">${esc(label)}<span class="count">${n}</span></button>`).join("")}
      </div>
      <ul class="proj-grid"></ul>`;

    const grid = $(".proj-grid", body);
    const draw = (cat) => {
      grid.innerHTML = D.projects
        .filter((p) => cat === "all" || p.category === cat)
        .map((p) => `<li><button class="card" type="button" data-id="${esc(p.id)}">
            ${cover(p)}
            <span class="card-body">
              <span class="card-title">${esc(p.title)}</span>
              <span class="card-meta">${esc(catLabel(p.category))} · ${esc(p.year)}</span>
              <span class="card-summary">${esc(p.summary)}</span>
            </span></button></li>`).join("");
    };
    draw("all");

    $(".filters", body).addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      $$("[data-cat]", body).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      draw(btn.dataset.cat);
    });
    grid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-id]");
      if (card) openWin("project:" + card.dataset.id, card.getBoundingClientRect());
    });
  }

  function renderProject(body, p) {
    const meta = [["Role", p.role], ["Year", p.year], ["Category", catLabel(p.category)]].filter(([, v]) => v);
    const media = p.video
      ? `<iframe class="video" src="${esc(p.video)}" title="${esc(p.title)} video" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`
      : cover(p, "detail-cover");
    body.innerHTML = `
      <p class="eyebrow">${esc(catLabel(p.category))} · ${esc(p.year)}</p>
      <h2 class="win-h">${esc(p.title)}</h2>
      <p class="lead">${esc(p.summary)}</p>
      ${media}
      <dl class="meta-row">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <div class="prose">${(p.description || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      ${p.gallery && p.gallery.length ? `<h3 class="section-h">Gallery</h3><div class="gallery">${p.gallery.map((src, i) =>
        `<button class="shot" type="button" data-shot="${i}" data-quiet aria-label="View screenshot ${i + 1} of ${p.gallery.length} full screen"><img src="${esc(src)}" alt="${esc(p.title)} screenshot ${i + 1}" loading="lazy"></button>`).join("")}</div>` : ""}
      ${p.tags && p.tags.length ? `<h3 class="section-h">Built with</h3><ul class="tags">${p.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>` : ""}
      ${p.links && p.links.length ? `<div class="actions">${p.links.map((l, i) => `<a class="btn${i === 0 ? " primary" : ""}" href="${esc(l.url)}"${extLink(l.url)}>${esc(l.label)}${svg("external")}</a>`).join("")}</div>` : ""}`;

    body.addEventListener("click", (e) => {
      const shot = e.target.closest("[data-shot]");
      if (shot) viewer.open(p.gallery, +shot.dataset.shot, p.title);
    });
  }

  /* ---------- Screenshot viewer (full-screen gallery) ---------- */
  const viewer = (() => {
    let el = null, imgs = [], idx = 0, title = "", opener = null, startX = null;

    function build() {
      el = document.createElement("div");
      el.className = "viewer";
      el.hidden = true;
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", "Screenshot viewer");
      el.innerHTML = `
        <button class="viewer-btn viewer-close" type="button" data-quiet aria-label="Close viewer">${svg("close")}</button>
        <button class="viewer-btn viewer-prev" type="button" data-quiet aria-label="Previous screenshot">${svg("back")}</button>
        <figure class="viewer-stage"><img alt=""><figcaption class="viewer-count" aria-live="polite"></figcaption></figure>
        <button class="viewer-btn viewer-next" type="button" data-quiet aria-label="Next screenshot">${svg("next")}</button>`;
      document.body.append(el);

      el.addEventListener("click", (e) => {
        if (e.target.closest(".viewer-close") || e.target === el || e.target.classList.contains("viewer-stage")) close();
        else if (e.target.closest(".viewer-prev")) go(-1);
        else if (e.target.closest(".viewer-next")) go(1);
      });
      // Swipe left/right on touch screens
      el.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") startX = e.clientX; });
      el.addEventListener("pointerup", (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      });
    }

    function show() {
      const img = $("img", el);
      img.src = imgs[idx];
      img.alt = `${title} screenshot ${idx + 1} of ${imgs.length}`;
      img.style.animation = "none";
      void img.offsetWidth; // restart the fade-in for each screenshot
      img.style.animation = "";
      $(".viewer-count", el).textContent = `${idx + 1} / ${imgs.length}`;
      el.classList.toggle("is-single", imgs.length < 2);
    }

    // Capture phase, so Esc and the arrow keys don't also reach the desktop.
    function onKey(e) {
      const keys = { Escape: close, ArrowLeft: () => go(-1), ArrowRight: () => go(1) };
      if (keys[e.key]) {
        e.preventDefault();
        e.stopImmediatePropagation();
        keys[e.key]();
      } else if (e.key === "Tab") {
        const f = $$(".viewer-btn", el).filter((b) => b.offsetParent !== null);
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      } else if (e.altKey) {
        e.stopImmediatePropagation(); // no desktop shortcuts while viewing
      }
    }

    function open(list, i, t) {
      if (!el) build();
      imgs = list; idx = i; title = t;
      opener = document.activeElement;
      show();
      el.hidden = false;
      document.addEventListener("keydown", onKey, true);
      sound("open");
      $(".viewer-close", el).focus();
    }

    function close() {
      el.hidden = true;
      document.removeEventListener("keydown", onKey, true);
      sound("close");
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    }

    function go(step) {
      if (imgs.length < 2) return;
      idx = (idx + step + imgs.length) % imgs.length;
      show();
      sound("click");
    }

    return { open };
  })();

  function initials(name) {
    return esc(String(name || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase());
  }

  function renderAbout(body) {
    const o = D.owner;
    const avatar = o.avatar
      ? `<img class="avatar" src="${esc(o.avatar)}" alt="${esc(o.name)}">`
      : `<span class="avatar" aria-hidden="true">${initials(o.name)}</span>`;
    body.innerHTML = `
      <div class="about-head">${avatar}<div>
        <h2 class="win-h">${esc(o.name)}</h2>
        <p>${esc(o.role)}${o.location ? " · " + esc(o.location) : ""}</p>
      </div></div>
      <div class="prose">${(o.bio || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      <div class="actions">
        <button class="btn primary" type="button" data-open="projects">See my projects</button>
        <button class="btn" type="button" data-open="contact">Get in touch</button>
      </div>`;
  }

  function renderSkills(body) {
    body.innerHTML = `
      <p class="eyebrow">Toolbox</p>
      <h2 class="win-h">Skills & tools</h2>
      ${D.skills.map((g) => `<h3 class="section-h">${esc(g.group)}</h3>
        <ul class="tags">${g.items.map((s) => `<li class="tag">${esc(s)}</li>`).join("")}</ul>`).join("")}`;
  }

  function renderContact(body) {
    const items = D.socials.map((s) =>
      `<li><a href="${esc(s.url)}"${extLink(s.url)}>${esc(s.label)}<span>${esc(s.handle || "")}</span></a></li>`);
    if (D.email) items.unshift(`<li><a href="mailto:${esc(D.email)}">Email<span>${esc(D.email)}</span></a></li>`);
    body.innerHTML = `
      <p class="eyebrow">Say hello</p>
      <h2 class="win-h">Contact</h2>
      <p class="lead">The best ways to reach me.</p>
      <ul class="contact-list">${items.join("")}</ul>`;
  }

  function renderResume(body) {
    body.innerHTML = `
      <p class="eyebrow">PDF</p>
      <h2 class="win-h">Resume</h2>
      <p class="lead">My experience, education and skills on one page.</p>
      <div class="actions">
        <a class="btn primary" href="${esc(D.resume)}" download>${svg("download")}Download resume</a>
        <a class="btn" href="${esc(D.resume)}" target="_blank" rel="noopener">${svg("external")}Open in new tab</a>
      </div>`;
  }

  function renderSettings(body) {
    const themes = [["system", "System"], ["light", "Light"], ["dark", "Dark"]];
    body.innerHTML = `
      <p class="eyebrow">System</p>
      <h2 class="win-h">Settings</h2>
      <p class="lead">Make ${esc(D.osName)} yours. Your choices are saved in this browser.</p>

      <fieldset class="set-group">
        <legend class="section-h">Theme</legend>
        <div class="segmented">${themes.map(([v, l]) =>
          `<label><input type="radio" name="theme" value="${v}"><span>${l}</span></label>`).join("")}</div>
      </fieldset>

      <fieldset class="set-group">
        <legend class="section-h">Accent color</legend>
        <div class="swatches">${Object.entries(S.ACCENTS).map(([k, a]) =>
          `<label class="swatch"><input type="radio" name="accent" value="${k}"><span class="swatch-dot" style="--sw:${a.fill}"></span><span class="swatch-label">${esc(a.label)}</span></label>`).join("")}</div>
      </fieldset>

      <fieldset class="set-group">
        <legend class="section-h">Wallpaper</legend>
        <div class="wall-grid">${Object.entries(S.WALLPAPERS).map(([k, l]) =>
          `<label class="wall-opt"><input type="radio" name="wallpaper" value="${k}"><span class="wall-thumb wall-thumb--${k}" aria-hidden="true"></span><span class="wall-name">${esc(l)}</span></label>`).join("")}</div>
      </fieldset>

      <div class="set-group">
        <h3 class="section-h">Experience</h3>
        <div class="switch-row">
          <span><strong>Motion</strong><small>Animations and moving wallpapers</small></span>
          <button type="button" role="switch" class="switch" data-key="motion" data-quiet aria-label="Motion"></button>
        </div>
        <div class="switch-row">
          <span><strong>Sounds</strong><small>Subtle interface sounds</small></span>
          <button type="button" role="switch" class="switch" data-key="sound" data-quiet aria-label="Sounds"></button>
        </div>
      </div>

      <div class="actions"><button type="button" class="btn" data-reset data-quiet>Reset to defaults</button></div>`;

    const sync = () => {
      ["theme", "accent", "wallpaper"].forEach((k) => {
        const input = $(`input[name="${k}"][value="${S.get(k)}"]`, body);
        if (input) input.checked = true;
      });
      $('[data-key="motion"]', body).setAttribute("aria-checked", String(S.motion()));
      $('[data-key="sound"]', body).setAttribute("aria-checked", String(S.get("sound")));
    };
    sync();
    // Keep in sync if the system theme changes while the window is open.
    const off = S.onChange(() => { if (!body.isConnected) off(); else sync(); });

    body.addEventListener("change", (e) => {
      const input = e.target;
      if (input.type !== "radio") return;
      S.set(input.name, input.value);
      sound("toggle");
    });
    body.addEventListener("click", (e) => {
      const sw = e.target.closest(".switch");
      if (sw) {
        const key = sw.dataset.key;
        const next = sw.getAttribute("aria-checked") !== "true";
        S.set(key, next);
        if (key !== "sound" || next) sound("toggle");
      }
      if (e.target.closest("[data-reset]")) { S.reset(); sound("toggle"); }
    });
  }

  /* ---------- Keyboard shortcuts ---------- */
  const IS_MAC = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
  const MOD = IS_MAC ? "⌥ Option" : "Alt";
  // `code` is the physical key, so shortcuts work on any keyboard layout.
  const SHORTCUTS = [
    { code: "KeyP", key: "P", app: "projects", label: "Open Projects" },
    { code: "KeyA", key: "A", app: "about", label: "Open About me" },
    { code: "KeyS", key: "S", app: "skills", label: "Open Skills" },
    { code: "KeyC", key: "C", app: "contact", label: "Open Contact" },
    { code: "KeyR", key: "R", app: "resume", label: "Open Resume" },
    { code: "Comma", key: ",", app: "settings", label: "Open Settings" },
    { code: "BracketLeft", key: "[", action: "prev", label: "Previous window" },
    { code: "BracketRight", key: "]", action: "next", label: "Next window" },
    { code: "KeyM", key: "M", action: "minimize", label: "Minimize window" },
    { code: "Slash", key: "/", app: "shortcuts", label: "Show this list" }
  ];

  function cycleWindows(step) {
    const ids = [...wins.keys()];
    if (!ids.length) return;
    const current = ids.findIndex((id) => wins.get(id).el.classList.contains("is-focused") && !isHidden(wins.get(id)));
    const next = ids[(current + step + ids.length) % ids.length];
    if (isHidden(wins.get(next))) restoreWin(next, wins.get(next).task.getBoundingClientRect());
    else { focusWin(next); wins.get(next).el.focus({ preventScroll: true }); sound("click"); }
  }

  document.addEventListener("keydown", (e) => {
    if (!e.altKey || e.ctrlKey || e.metaKey || phone.matches) return;
    const t = e.target;
    const typing = t.isContentEditable || /^(TEXTAREA|SELECT)$/.test(t.tagName) ||
      (t.tagName === "INPUT" && !["radio", "checkbox", "button", "range"].includes(t.type));
    if (typing) return;
    const sc = SHORTCUTS.find((s) => s.code === e.code);
    if (!sc) return;
    e.preventDefault();
    if (sc.app) openWin(sc.app);
    else if (sc.action === "prev") cycleWindows(-1);
    else if (sc.action === "next") cycleWindows(1);
    else if (sc.action === "minimize") {
      const top = topVisible();
      if (top && top.w.el.classList.contains("is-focused")) minimizeWin(top.id);
    }
  });

  function renderShortcuts(body) {
    const keys = (...k) => k.map((x) => `<kbd>${esc(x)}</kbd>`).join("");
    body.innerHTML = `
      <p class="eyebrow">Keyboard</p>
      <h2 class="win-h">Shortcuts</h2>
      <p class="lead">Hold ${esc(MOD)} and press a key.</p>
      <dl class="shortcut-list">
        ${SHORTCUTS.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${keys(MOD, s.key)}</dd></div>`).join("")}
        <div><dt>Close window</dt><dd>${keys("Esc")}</dd></div>
      </dl>`;
  }

  /* ---------- Secret app: click your name 5 times quickly ---------- */
  function renderSecret(body) {
    const s = D.secret || {};
    body.innerHTML = `
      <div class="secret">
        <span class="secret-badge" aria-hidden="true">${svg("unlock")}</span>
        <p class="eyebrow">Secret unlocked</p>
        <h2 class="win-h">${esc(s.title || "You found it!")}</h2>
        <div class="prose">${(s.message || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
        <p class="secret-foot">Keep it between us.</p>
      </div>`;
  }

  (() => {
    const name = $(".hello-name");
    let clicks = [];
    name.addEventListener("click", () => {
      const now = performance.now();
      clicks = clicks.filter((t) => now - t < 1500);
      clicks.push(now);
      if (clicks.length < 5) return;
      clicks = [];
      openWin("secret", name.getBoundingClientRect());
      sound("chime");
    });
  })();

  // Soft click for buttons and links that don't already make their own sound.
  document.addEventListener("click", (e) => {
    const el = e.target.closest("button, a");
    if (!el || el.closest("[data-open], .card, .win-btn, .task, [data-quiet]")) return;
    sound("click");
  });

  // Buttons inside windows that open other apps (e.g. "See my projects").
  layer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (btn) openWin(btn.dataset.open, btn.getBoundingClientRect());
  });

  /* ---------- Desktop icons & launcher ---------- */
  function itemHTML(item, cls) {
    const icon = item.icon || APPS[item.app].icon;
    const inner = cls === "icon"
      ? `<span class="icon-glyph">${svg(icon)}</span><span class="icon-label">${esc(item.label)}</span>`
      : `${svg(icon)}${esc(item.label)}`;
    return item.href
      ? `<a class="${cls}" href="${esc(item.href)}">${inner}</a>`
      : `<button class="${cls}" type="button" data-open="${item.app}">${inner}</button>`;
  }

  function buildDesktop() {
    const icons = $("#icons");
    icons.innerHTML = DESKTOP.map((it) => `<li>${itemHTML(it, "icon")}</li>`).join("");
    icons.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open]");
      if (btn) openWin(btn.dataset.open, ($(".icon-glyph", btn) || btn).getBoundingClientRect());
    });

    const launcher = $("#launcher");
    const osBtn = $("#osButton");
    launcher.innerHTML = `
      <div class="launcher-head"><strong>${esc(D.owner.name)}</strong><span>${esc(D.owner.role)}</span></div>
      ${DESKTOP.map((it) => itemHTML(it, "launcher-item")).join("")}`;
    const setLauncher = (open) => {
      launcher.hidden = !open;
      osBtn.setAttribute("aria-expanded", String(open));
      if (open) $(".launcher-item", launcher).focus();
    };
    osBtn.addEventListener("click", () => setLauncher(launcher.hidden));
    launcher.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open]");
      if (btn) {
        const rect = btn.getBoundingClientRect(); // measure before the menu hides
        setLauncher(false);
        openWin(btn.dataset.open, rect);
      }
    });
    document.addEventListener("pointerdown", (e) => {
      if (!launcher.hidden && !launcher.contains(e.target) && !osBtn.contains(e.target)) setLauncher(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!launcher.hidden) { setLauncher(false); osBtn.focus(); return; }
      const top = topVisible();
      if (top && top.w.el.classList.contains("is-focused")) closeWin(top.id);
    });
  }

  function fillText() {
    $$("[data-os-name]").forEach((el) => { el.textContent = D.osName; });
    $$("[data-owner-name]").forEach((el) => { el.textContent = D.owner.name; });
    $$("[data-owner-role]").forEach((el) => { el.textContent = D.owner.role; });
    document.title = `${D.owner.name} · Portfolio`;
    const tick = () => {
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      $$("[data-clock]").forEach((el) => { el.textContent = t; });
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Boot ---------- */
  function boot(done) {
    const el = $("#boot");
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; } catch (_) { /* storage blocked */ }
    if (seen) { el.remove(); done(); return; }

    const total = S.motion() ? 2000 : 600;
    const lines = [`Starting ${D.osName}…`, "Loading projects", "Mounting /games /software /design", "Ready"];
    const log = $("#bootLog");
    $(".boot-bar span", el).style.animationDuration = total + "ms";
    let i = 0;
    log.textContent = lines[i++];
    const step = setInterval(() => { log.textContent = lines[Math.min(i++, lines.length - 1)]; }, total / lines.length);

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearInterval(step);
      clearTimeout(timer);
      removeEventListener("keydown", finish);
      try { sessionStorage.setItem("booted", "1"); } catch (_) { /* ignore */ }
      el.classList.add("done");
      setTimeout(() => el.remove(), 450);
      sound("chime"); // only audible if the visitor clicked or pressed a key to skip
      done();
    };
    const timer = setTimeout(finish, total);
    el.addEventListener("click", finish);
    addEventListener("keydown", finish);
  }

  /* ---------- Deep links: #projects, #about, #project/<id> ---------- */
  function openFromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h || h === "secret") return; // the secret can't be deep-linked
    openWin(h.startsWith("project/") ? "project:" + h.slice(8) : h);
  }

  fillText();
  buildDesktop();
  boot(openFromHash);
  addEventListener("hashchange", openFromHash);
})();
