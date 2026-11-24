/* Animated desktop wallpaper, drawn on a <canvas>.
   Styles: lights, topo, stars, gradient (picked in Settings).
   Uses the current theme and accent colors, runs at about 30fps, and shows a
   still frame when motion is off or the tab is hidden. */
(() => {
  "use strict";

  const S = window.OS_SETTINGS;
  const canvas = document.getElementById("wallpaper");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w = 0, h = 0, raf = 0, last = 0;
  let C = null;            // current colors
  let stars = [];
  let field = null;        // topo height field
  const cursor = { x: 0, y: 0, a: 0, target: 0, nx: 0, ny: 0 };

  const rgb = (hex) => {
    const n = parseInt(hex.trim().replace("#", ""), 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const light = S.theme() === "light";
    C = {
      light,
      bg: cs.getPropertyValue("--bg").trim(),
      accent: rgb(cs.getPropertyValue("--accent")),
      muted: rgb(cs.getPropertyValue("--muted")),
      text: rgb(cs.getPropertyValue("--text")),
      blue: light ? "60,100,200" : "76,120,220"
    };
  }

  function clear() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);
  }

  function glow(x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${color},${alpha})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  /* ---------- Drifting lights on a dot grid ---------- */
  const LIGHTS = [
    { amber: true, r: 420, sx: 0.00009, sy: 0.00013, px: 0.0, py: 1.2 },
    { amber: false, r: 520, sx: 0.00006, sy: 0.00008, px: 2.1, py: 0.3 },
    { amber: true, r: 260, sx: 0.00012, sy: 0.00007, px: 4.0, py: 2.6 }
  ];
  function drawLights(t) {
    const GAP = 26;
    const scale = Math.max(w, h) / 1400;
    const pos = LIGHTS.map((l) => ({
      amber: l.amber, r: l.r * scale,
      x: w * (0.5 + 0.45 * Math.sin(t * l.sx + l.px)),
      y: h * (0.5 + 0.42 * Math.cos(t * l.sy + l.py))
    }));
    if (cursor.a > 0.01) pos.push({ amber: true, r: 170, x: cursor.x, y: cursor.y, k: cursor.a });

    clear();
    for (const p of pos) {
      glow(p.x, p.y, p.r, p.amber ? C.accent : C.blue, p.amber ? (C.light ? 0.16 : 0.09) : (C.light ? 0.1 : 0.12));
    }

    const lit = [];
    ctx.fillStyle = `rgba(${C.muted},${C.light ? 0.3 : 0.13})`;
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
    const accent = `rgb(${C.accent})`, blue = `rgb(${C.blue})`;
    for (let i = 0; i < lit.length; i += 4) {
      const a = Math.min(lit[i + 2], 1), b = Math.min(lit[i + 3], 1);
      const s = 1.5 + a * 1.6 + b * 0.6;
      ctx.globalAlpha = Math.min((C.light ? 0.3 : 0.13) + a * 0.75 + b * 0.4, 1);
      ctx.fillStyle = a >= b * 0.7 ? accent : blue;
      ctx.fillRect(lit[i] - s / 2, lit[i + 1] - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Topographic contour lines (marching squares) ---------- */
  const CELL = 16;
  function drawTopo(t) {
    const cols = Math.ceil(w / CELL) + 1, rows = Math.ceil(h / CELL) + 1;
    if (!field || field.length !== cols * rows) field = new Float32Array(cols * rows);
    const sc = 1400 / Math.max(w, h, 1);
    for (let j = 0; j < rows; j++) {
      const y = j * CELL * sc;
      for (let i = 0; i < cols; i++) {
        const x = i * CELL * sc;
        field[j * cols + i] =
          Math.sin(x * 0.0042 + t * 0.00011) * Math.cos(y * 0.0051 - t * 0.00008) +
          0.65 * Math.sin((x * 0.7 - y * 0.5) * 0.0063 + t * 0.00007) +
          0.45 * Math.cos((x * 0.35 + y * 0.8) * 0.0089 - t * 0.00013);
      }
    }

    clear();
    glow(w * 0.85, h * 0.1, Math.max(w, h) * 0.6, C.accent, C.light ? 0.1 : 0.06);

    let k = 0;
    for (let L = -1.8; L <= 1.8; L += 0.3, k++) {
      const major = k % 4 === 0;
      ctx.beginPath();
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = field[j * cols + i], b = field[j * cols + i + 1];
          const c = field[(j + 1) * cols + i + 1], d = field[(j + 1) * cols + i];
          const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
          if (idx === 0 || idx === 15) continue;
          const x0 = i * CELL, y0 = j * CELL;
          const T = () => [x0 + CELL * (L - a) / (b - a), y0];
          const R = () => [x0 + CELL, y0 + CELL * (L - b) / (c - b)];
          const B = () => [x0 + CELL * (L - d) / (c - d), y0 + CELL];
          const Lf = () => [x0, y0 + CELL * (L - a) / (d - a)];
          const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
          switch (idx) {
            case 1: case 14: seg(Lf(), B()); break;
            case 2: case 13: seg(B(), R()); break;
            case 3: case 12: seg(Lf(), R()); break;
            case 4: case 11: seg(T(), R()); break;
            case 5: seg(T(), Lf()); seg(B(), R()); break;
            case 6: case 9: seg(T(), B()); break;
            case 7: case 8: seg(T(), Lf()); break;
            case 10: seg(T(), R()); seg(Lf(), B()); break;
          }
        }
      }
      ctx.lineWidth = major ? 1.3 : 1;
      ctx.strokeStyle = major
        ? `rgba(${C.accent},${C.light ? 0.7 : 0.5})`
        : `rgba(${C.muted},${C.light ? 0.35 : 0.2})`;
      ctx.stroke();
    }
  }

  /* ---------- Starfield with parallax ---------- */
  function makeStars() {
    const n = Math.round((w * h) / 5500);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      tw: Math.random() * Math.PI * 2,
      accent: Math.random() < 0.12
    }));
  }
  function drawStars(t, dt) {
    clear();
    glow(w * 0.15, h * 0.9, Math.max(w, h) * 0.6, C.blue, C.light ? 0.08 : 0.1);
    const base = C.light ? C.text : "230,234,242";
    for (const s of stars) {
      s.x -= s.z * dt * 0.012;
      s.y -= s.z * dt * 0.004;
      if (s.x < -4) s.x += w + 8;
      if (s.y < -4) s.y += h + 8;
      const x = s.x + cursor.nx * s.z * 28, y = s.y + cursor.ny * s.z * 28;
      const a = (0.2 + 0.7 * s.z) * (0.75 + 0.25 * Math.sin(t * 0.002 + s.tw)) * (C.light ? 0.7 : 1);
      ctx.fillStyle = `rgba(${s.accent ? C.accent : base},${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.5 + s.z * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------- Plain gradient (still) ---------- */
  function drawGradient() {
    clear();
    const m = Math.max(w, h);
    glow(w * 0.85, h * 0.1, m * 0.75, C.accent, C.light ? 0.22 : 0.16);
    glow(w * 0.1, h * 0.95, m * 0.7, C.blue, C.light ? 0.14 : 0.18);
  }

  const STYLES = {
    lights: { draw: drawLights, animated: true },
    topo: { draw: drawTopo, animated: true },
    stars: { draw: drawStars, animated: true },
    gradient: { draw: drawGradient, animated: false }
  };
  const current = () => STYLES[S.get("wallpaper")] || STYLES.lights;

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < 33) return;
    const dt = last ? Math.min(t - last, 100) : 0;
    last = t;
    cursor.a += (cursor.target - cursor.a) * 0.08;
    cursor.nx += ((cursor.target ? cursor.x / w - 0.5 : 0) - cursor.nx) * 0.05;
    cursor.ny += ((cursor.target ? cursor.y / h - 0.5 : 0) - cursor.ny) * 0.05;
    current().draw(t, dt);
  }

  function restart() {
    cancelAnimationFrame(raf);
    last = 0;
    readColors();
    const style = current();
    if (!style.animated || !S.motion() || document.hidden) {
      style.draw(20000, 0); // a pleasant fixed moment for the still frame
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
    restart();
  }

  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", restart);
  S.onChange(restart);
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = canvas.getBoundingClientRect();
    cursor.x = e.clientX - r.left; cursor.y = e.clientY - r.top; cursor.target = 1;
  });
  document.addEventListener("pointerleave", () => { cursor.target = 0; });

  resize();
})();
