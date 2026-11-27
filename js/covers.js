/* Generated project covers, shared by the desktop (app.js) and the link-preview
   image (tools/og-image.html). Exposes window.coverArt(project). */
(() => {
  "use strict";

  /* Generated cover patterns, one style per category, drawn in the project's
     color. Each project gets its own arrangement, seeded from its id, so the
     same project always looks the same. The bottom-left stays quiet for the
     big letter. Drawn on a 160×100 canvas (the 16:10 cover shape). */
  function seeded(str) {
    let h = 2166136261;
    for (const ch of String(str)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => {
      h = (h + 0x6D2B79F5) | 0;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const r1 = (n) => Math.round(n * 10) / 10;

  const PATTERNS = {
    // Games: pixel tiles, like a retro level map, denser toward the top-right.
    games(rand) {
      let out = "";
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const x = col / 15, y = row / 9;
          const chance = 0.06 + 0.42 * x * (1 - y * 0.6) - (x < 0.4 && y > 0.45 ? 1 : 0);
          if (rand() < chance) {
            out += `<rect x="${col * 10 + 1}" y="${row * 10 + 1}" width="8" height="8" rx="1" opacity="${r1(0.18 + rand() * 0.5)}"/>`;
          }
        }
      }
      return out;
    },
    // Software: rows of code-like bars with indents, plus a blinking cursor.
    software(rand) {
      let out = "", indent = 0, last = null;
      for (let i = 0; i < 9; i++) {
        const y = 12 + i * 9;
        indent = Math.max(0, Math.min(3, indent + (rand() < 0.35 ? 1 : rand() < 0.4 ? -1 : 0)));
        let x = 64 + indent * 9;
        const tokens = 1 + Math.floor(rand() * 3);
        for (let t = 0; t < tokens && x < 150; t++) {
          const w = Math.min(150 - x, 8 + Math.floor(rand() * 26));
          out += `<rect x="${x}" y="${y}" width="${w}" height="3.6" rx="1.8" opacity="${r1(0.25 + rand() * 0.4)}"/>`;
          x += w + 4;
        }
        last = { x: Math.min(x, 150), y };
      }
      out += `<rect class="cover-cursor" x="${last.x}" y="${last.y - 1.4}" width="3" height="6.4" rx=".6"/>`;
      return out;
    },
    // Design: a small composition of overlapping shapes.
    design(rand) {
      const cx = 108 + rand() * 24, cy = 34 + rand() * 18, r = 22 + rand() * 10;
      const sx = 70 + rand() * 20, sy = 14 + rand() * 20, s = 24 + rand() * 12, rot = Math.round(rand() * 40 - 20);
      const tx = 112 + rand() * 20, ty = 62 + rand() * 14;
      return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" opacity=".42"/>
        <rect x="${r1(sx)}" y="${r1(sy)}" width="${r1(s)}" height="${r1(s)}" rx="2" opacity=".3" transform="rotate(${rot} ${r1(sx + s / 2)} ${r1(sy + s / 2)})"/>
        <path d="M${r1(tx)} ${r1(ty - 26)} L${r1(tx + 22)} ${r1(ty + 12)} L${r1(tx - 22)} ${r1(ty + 12)} Z" opacity=".55"/>
        <circle cx="${r1(sx + 6)}" cy="${r1(cy + r * 0.6)}" r="${r1(9 + rand() * 6)}" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".7"/>`;
    }
  };

  function coverArt(p) {
    const draw = PATTERNS[p.category];
    if (!draw) return "";
    return `<svg class="cover-art" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" fill="currentColor" aria-hidden="true" focusable="false">${draw(seeded(p.id || p.title))}</svg>`;
  }

  window.coverArt = coverArt;
})();
