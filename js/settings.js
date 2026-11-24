/* Visitor settings: theme, accent, wallpaper, motion and sound.
   Loaded in <head> so the saved theme applies before the page paints.
   Choices are saved in this browser with localStorage. */
(() => {
  "use strict";

  const KEY = "os-settings";

  // fill: buttons and highlights. ink: text on top of fill.
  // onLight: darker version used for accent-colored text on the light theme.
  const ACCENTS = {
    amber:  { label: "Amber",  fill: "#FFB020", ink: "#1A1100", onLight: "#9A5B00" },
    coral:  { label: "Coral",  fill: "#FF6B5B", ink: "#2A0A06", onLight: "#C2382A" },
    lime:   { label: "Lime",   fill: "#A3E635", ink: "#142000", onLight: "#4D7C0F" },
    sky:    { label: "Sky",    fill: "#38BDF8", ink: "#03202E", onLight: "#0369A1" },
    violet: { label: "Violet", fill: "#A78BFA", ink: "#1B1035", onLight: "#6D28D9" }
  };

  const WALLPAPERS = {
    lights: "Drifting lights",
    topo: "Topographic",
    stars: "Starfield",
    gradient: "Plain gradient"
  };

  // theme "system" follows the visitor's device; motion null follows their
  // reduced-motion preference until they choose in Settings.
  const DEFAULTS = { theme: "system", accent: "amber", wallpaper: "lights", motion: null, sound: true };

  let s = { ...DEFAULTS };
  try { Object.assign(s, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (_) { /* storage blocked or corrupt */ }
  if (!["system", "light", "dark"].includes(s.theme)) s.theme = DEFAULTS.theme;
  if (!ACCENTS[s.accent]) s.accent = DEFAULTS.accent;
  if (!WALLPAPERS[s.wallpaper]) s.wallpaper = DEFAULTS.wallpaper;
  if (s.motion !== null && typeof s.motion !== "boolean") s.motion = null;
  if (typeof s.sound !== "boolean") s.sound = DEFAULTS.sound;

  const mqDark = matchMedia("(prefers-color-scheme: dark)");
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new Set();

  const theme = () => (s.theme === "system" ? (mqDark.matches ? "dark" : "light") : s.theme);
  const motion = () => (s.motion === null ? !mqReduce.matches : s.motion);

  function apply() {
    const root = document.documentElement;
    const t = theme();
    const a = ACCENTS[s.accent];
    root.dataset.theme = t;
    root.style.setProperty("--accent", a.fill);
    root.style.setProperty("--accent-ink", a.ink);
    root.style.setProperty("--accent-text", t === "light" ? a.onLight : a.fill);
    root.classList.toggle("no-motion", !motion());
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === "light" ? "#E8EDF5" : "#0B1220";
  }

  function emit() { listeners.forEach((fn) => fn()); }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) { /* ignore */ }
  }

  function set(key, value) {
    if (!(key in DEFAULTS)) return;
    s[key] = value;
    save();
    apply();
    emit();
  }

  function reset() {
    s = { ...DEFAULTS };
    try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ }
    apply();
    emit();
  }

  mqDark.addEventListener("change", () => { if (s.theme === "system") { apply(); emit(); } });
  mqReduce.addEventListener("change", () => { if (s.motion === null) { apply(); emit(); } });

  window.OS_SETTINGS = {
    ACCENTS, WALLPAPERS,
    get: (key) => s[key],
    set, reset, theme, motion,
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  };

  apply();
})();
