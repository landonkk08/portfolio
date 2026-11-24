(() => {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const phone = matchMedia("(max-width: 767px)");

  /* ---------- Icons ---------- */
  const PATHS = {
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    skills: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01" stroke-width="3"/>',
    games: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 10.5v4M5 12.5h4"/><path d="M15.5 12h.01M18 14h.01" stroke-width="3"/>',
    software: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    design: '<path d="M12 20l8-8-3-3-8 8z"/><path d="M17 9l-1.5-6L3 6l3 12.5 3-1.5"/><circle cx="10" cy="10" r="1.5"/>',
    min: '<path d="M5 12h14"/>',
    max: '<rect x="5" y="5" width="14" height="14" rx="1.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
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
    resume: { title: "Resume.pdf", icon: "file", w: 440, h: 320, render: renderResume }
  };
  const DESKTOP = [
    { app: "projects", label: "Projects" },
    { app: "about", label: "About me" },
    { app: "skills", label: "Skills" },
    { app: "contact", label: "Contact" },
    { app: "resume", label: "Resume" },
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

  function openWin(id) {
    const app = getApp(id);
    if (!app) return;
    const existing = wins.get(id);
    if (existing) {
      existing.el.hidden = false;
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
      if (win.el.hidden) { win.el.hidden = false; focusWin(id); }
      else if (win.el.classList.contains("is-focused")) minimizeWin(id);
      else focusWin(id);
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
      if (!w.el.hidden && (!best || +w.el.style.zIndex > +best.w.el.style.zIndex)) best = { id, w };
    });
    return best;
  }

  function blurAll() {
    wins.forEach((w) => { w.el.classList.remove("is-focused"); w.task.classList.remove("is-active"); });
  }

  function minimizeWin(id) {
    const win = wins.get(id);
    win.el.hidden = true;
    blurAll();
    const next = topVisible();
    if (next) { focusWin(next.id); next.w.el.focus({ preventScroll: true }); }
    else win.task.focus();
  }

  function closeWin(id) {
    const win = wins.get(id);
    win.el.remove();
    win.task.remove();
    wins.delete(id);
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
      if (card) openWin("project:" + card.dataset.id);
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
      ${p.gallery && p.gallery.length ? `<h3 class="section-h">Gallery</h3><div class="gallery">${p.gallery.map((src, i) => `<img src="${esc(src)}" alt="${esc(p.title)} screenshot ${i + 1}" loading="lazy">`).join("")}</div>` : ""}
      ${p.tags && p.tags.length ? `<h3 class="section-h">Built with</h3><ul class="tags">${p.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>` : ""}
      ${p.links && p.links.length ? `<div class="actions">${p.links.map((l, i) => `<a class="btn${i === 0 ? " primary" : ""}" href="${esc(l.url)}"${extLink(l.url)}>${esc(l.label)}${svg("external")}</a>`).join("")}</div>` : ""}`;
  }

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

  // Buttons inside windows that open other apps (e.g. "See my projects").
  layer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (btn) openWin(btn.dataset.open);
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
      if (btn) openWin(btn.dataset.open);
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
      if (btn) { setLauncher(false); openWin(btn.dataset.open); }
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

  /* ---------- Wallpaper: a dot grid lit by drifting lights ---------- */
  function wallpaper() {
    const canvas = $("#wallpaper");
    const ctx = canvas.getContext("2d");
    const GAP = 26;
    const lights = [
      { amber: true, r: 420, sx: 0.00009, sy: 0.00013, px: 0.0, py: 1.2 },
      { amber: false, r: 520, sx: 0.00006, sy: 0.00008, px: 2.1, py: 0.3 },
      { amber: true, r: 260, sx: 0.00012, sy: 0.00007, px: 4.0, py: 2.6 }
    ];
    const cursor = { x: 0, y: 0, a: 0, target: 0 };
    let w = 0, h = 0, raf = 0, last = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion.matches) draw(0);
    }

    function draw(t) {
      const scale = Math.max(w, h) / 1400;
      const pos = lights.map((l) => ({
        amber: l.amber, r: l.r * scale,
        x: w * (0.5 + 0.45 * Math.sin(t * l.sx + l.px)),
        y: h * (0.5 + 0.42 * Math.cos(t * l.sy + l.py))
      }));
      cursor.a += (cursor.target - cursor.a) * 0.08;
      if (cursor.a > 0.01) pos.push({ amber: true, r: 170, x: cursor.x, y: cursor.y, k: cursor.a });

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0B1220";
      ctx.fillRect(0, 0, w, h);

      // Soft glow behind each light
      for (const p of pos) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        const rgb = p.amber ? "255,176,32" : "76,120,220";
        g.addColorStop(0, `rgba(${rgb},${p.amber ? 0.09 : 0.12})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }

      // Dots: dim base, amber or blue where lights fall
      const lit = [];
      ctx.fillStyle = "rgba(140,152,176,0.13)";
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          let a = 0, b = 0;
          for (const p of pos) {
            const dx = x - p.x, dy = y - p.y;
            const f = 1 - (dx * dx + dy * dy) / (p.r * p.r);
            if (f > 0) { const v = f * f * (p.k ?? 1); if (p.amber) a += v; else b += v; }
          }
          if (a > 0.03 || b > 0.03) lit.push(x, y, a, b);
          else ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        }
      }
      for (let i = 0; i < lit.length; i += 4) {
        const x = lit[i], y = lit[i + 1], a = Math.min(lit[i + 2], 1), b = Math.min(lit[i + 3], 1);
        const s = 1.5 + a * 1.6 + b * 0.6;
        ctx.globalAlpha = Math.min(0.13 + a * 0.75 + b * 0.4, 1);
        ctx.fillStyle = a >= b * 0.7 ? "#FFB020" : "#7FA2E6";
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      raf = requestAnimationFrame(loop);
      if (t - last < 33) return; // ~30fps is plenty for slow drift
      last = t;
      draw(t);
    }
    function start() {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches || document.hidden) { draw(0); return; }
      raf = requestAnimationFrame(loop);
    }

    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", start);
    reduceMotion.addEventListener("change", start);
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      cursor.x = e.clientX - r.left; cursor.y = e.clientY - r.top; cursor.target = 1;
    });
    document.addEventListener("pointerleave", () => { cursor.target = 0; });
    resize();
    start();
  }

  /* ---------- Boot ---------- */
  function boot(done) {
    const el = $("#boot");
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; } catch (_) { /* storage blocked */ }
    if (seen) { el.remove(); done(); return; }

    const total = reduceMotion.matches ? 600 : 2000;
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
      done();
    };
    const timer = setTimeout(finish, total);
    el.addEventListener("click", finish);
    addEventListener("keydown", finish);
  }

  /* ---------- Deep links: #projects, #about, #project/<id> ---------- */
  function openFromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    openWin(h.startsWith("project/") ? "project:" + h.slice(8) : h);
  }

  fillText();
  buildDesktop();
  wallpaper();
  boot(openFromHash);
  addEventListener("hashchange", openFromHash);
})();
