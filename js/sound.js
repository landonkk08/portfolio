/* Interface sounds, synthesized with the Web Audio API (no audio files).
   Browsers only allow sound after the visitor's first click or key press,
   so everything stays silent until then. Turned on/off in Settings. */
(() => {
  "use strict";

  const S = window.OS_SETTINGS;
  let ctx = null;
  let master = null;

  function unlock() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
  }
  // Capture phase so the context exists before any click handler plays a sound.
  addEventListener("pointerdown", unlock, true);
  addEventListener("keydown", unlock, true);

  function tone({ f, to, dur = 0.12, type = "sine", g = 0.06, delay = 0 }) {
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(g, t + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  const SOUNDS = {
    click:    () => tone({ f: 1400, to: 900, dur: 0.035, type: "triangle", g: 0.035 }),
    toggle:   () => tone({ f: 880, to: 1180, dur: 0.06, type: "triangle", g: 0.04 }),
    open:     () => { tone({ f: 440, to: 660, dur: 0.12, g: 0.06 }); tone({ f: 880, dur: 0.18, g: 0.025, delay: 0.06 }); },
    close:    () => tone({ f: 620, to: 360, dur: 0.13, g: 0.055 }),
    minimize: () => tone({ f: 520, to: 300, dur: 0.1, type: "triangle", g: 0.045 }),
    chime:    () => {
      tone({ f: 659.25, dur: 1.1, g: 0.07 });               // E5
      tone({ f: 987.77, dur: 1.4, g: 0.06, delay: 0.14 });  // B5
      tone({ f: 1318.5, dur: 1.2, g: 0.02, delay: 0.14 });  // E6 shimmer
    }
  };

  function play(name) {
    // A context that is still resuming plays the sound as soon as it starts.
    if (!S.get("sound") || !ctx || ctx.state === "closed" || !SOUNDS[name]) return;
    SOUNDS[name]();
  }

  window.OS_SOUND = { play };
})();
