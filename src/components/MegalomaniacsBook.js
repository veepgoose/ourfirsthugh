"use client";

// ─────────────────────────────────────────────────────────────────────────────
// <MegalomaniacsBook /> — "Megalomaniacs of Truth", the poem turned into a book.
//
// Self-contained: the page-turning engine, the sixteen leaves and the sound all
// live in this file.
//
//   import MegalomaniacsBook from "../../components/MegalomaniacsBook";
//   <MegalomaniacsBook />
//
// No images needed. The poem is the LINES array below, word for word; PAGES just
// says which lines sit on which leaf, how large, and how the page glows.
//
// PAGE-TURN CLIPS: fill TURN_CLIPS with files from public/ (e.g.
// "/audio/mega/turn-02.mp3"). Until then each turn uses a synth rustle + bell.
// ─────────────────────────────────────────────────────────────────────────────

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// ── the poem (unchanged) ─────────────────────────────────────────────────────
const LINES = [
  `I can’t wait to fuck you.`,
  `I dream of fucking you slowly, deeply; I can feel your cock within me now, just thinking about you.`,
  `I move so slowly that I can feel every micro movement, each bringing its own pulsation of intensity.`,
  `My pussy grips you, desperately, want becoming need, need becoming want.`,
  `Neither of us leads nor follows; we move as one being, transcending time, beyond pleasure, outrunning existence itself,`,
  `flowing through dimensions at a speed that is neither fast nor slow, only now.`,
  `Now, in this moment, I can feel you; no longer within me, and I no longer holding you,`,
  `as we move together with no beginning, no end, melting into each other.`,
  `No longer riding these waves of pleasure, we consume them, we command their flow,`,
  `as the gods once commanded the flow of existence itself. Where we flow, the gods have no power.`,
  `Here, it is only us, only the intensity of our creation. No gods, no laws to abide by,`,
  `only us, the co-creators of ecstasy.`,
  `I feel the electrifying cold shuddering down my spine as I fight to stop my eyes from rolling,`,
  `fighting to hold your gaze, the endless refraction of your pleasure mirrored in my own, and back again, and again, and again.`,
  `I cannot blink for fear of diminishing this bliss, this bliss that both destroys and rebuilds me in a new form all at once,`,
  `a form that both carries and is carried by you.`,
  `As I surrender to the feel of you moving imperceptibly slowly inside me, so slowly that every micro movement unleashes wave after wave of devotion,`,
  `devotion that drips from me, flooding your cock as I feel you harden, and the waves only intensify, and intensify, and intensify until you beg me to stop.`,
  `I will not stop this time. I’m no longer present, for I have crossed the threshold into a state that is boundless, and this time, you’re coming with me.`,
  `A place beyond this earthly pleasure, a place that only our soul-felt ecstasy can inhabit.`,
  `A place where nothing else exists, only this. This forever, as if nothing else had ever breathed itself into being,`,
  `not even this moment, as this moment is already gone, transmuting into something even more magnificently holy than it was before.`,
  `Now the reflections of pleasure refracted in our eyes are only light, a blinding light that consumes our entire as-one being.`,
  `Not two souls merging, but a new soul born of this moment. It is ours, it is bliss, it is both within and without us.`,
  `Don’t stop. Don’t ever stop.`,
  `And know this: I feel no guilt, no shame; all repression melts away.`,
  `I feel power, sovereignty, delighting in this moment, basking in the afterglow of our transcendence,`,
  `where we were reborn as megalomaniacs of Truth. There is a wildness unleashed within me,`,
  `and when I return to meet your gaze once again, I can see that you feel it too.`,
];

// One slot per page, indexed by the page you turn TO. null = synth rustle + bell.
const TURN_CLIPS = Array(16).fill(null);

// The bells climb with the heat of the poem, reach their peak on the light, then
// settle back onto the tonic.
const TURN_NOTES = [
  220, 261.63, 293.66, 329.63, 392, 329.63, 392, 440, 493.88, 523.25, 587.33, 659.25, 783.99, 659.25, 523.25, 440,
];

// ── the leaves ───────────────────────────────────────────────────────────────
//   lines  indexes into LINES, in the order they sit on the page
//   size   text size in cqw (1% of the leaf width)
//   gap    space between the lines in cqw
//   heat   0–1: how strongly the page glows (the poem warms as it goes)
//   rgb    the glow colour
//   gold   which of the page's lines (by LINES index) are set in gold
//   hl     a phrase to set in gold within its line
//   fx     "bloom" = the light closes in from the edges
// one dial for every page's text size (1 = as listed below)
const SCALE = 0.92;

const WINE = "122,28,44";
const EMBER = "168,62,38";
const AMBER = "214,150,56";
const LIGHT = "255,222,140";

const PAGES = [
  { lines: [0], size: 7.2, heat: 0.12, rgb: WINE },
  { lines: [1, 2], size: 4.6, gap: 4.4, heat: 0.2, rgb: WINE },
  { lines: [3, 4], size: 4.7, gap: 4.4, heat: 0.28, rgb: WINE },
  { lines: [5, 6, 7], size: 4.6, gap: 3.6, heat: 0.34, rgb: WINE },
  { lines: [8, 9], size: 4.7, gap: 4.4, heat: 0.4, rgb: EMBER },
  { lines: [10, 11], size: 4.9, gap: 4.6, heat: 0.46, rgb: EMBER, gold: [11] },
  { lines: [12, 13], size: 4.6, gap: 4.4, heat: 0.52, rgb: EMBER },
  { lines: [14, 15], size: 4.7, gap: 4.4, heat: 0.58, rgb: EMBER },
  { lines: [16, 17], size: 4.1, gap: 4, heat: 0.66, rgb: AMBER },
  { lines: [18], size: 5.6, heat: 0.72, rgb: AMBER, hl: "this time, you’re coming with me." },
  { lines: [19, 20, 21], size: 4.2, gap: 3.6, heat: 0.78, rgb: AMBER },
  { lines: [22], size: 5.8, heat: 0.9, rgb: LIGHT, fx: "bloom", hl: "a blinding light" },
  { lines: [23], size: 5.6, heat: 0.7, rgb: LIGHT },
  { lines: [24], size: 8, heat: 0.55, rgb: AMBER, gold: [24] },
  { lines: [25, 26], size: 4.9, gap: 4.6, heat: 0.4, rgb: AMBER },
  { lines: [27, 28], size: 5, gap: 4.6, heat: 0.3, rgb: AMBER, hl: "megalomaniacs of Truth" },
];

// split a line around the phrase that is set in gold
function renderLine(text, hl) {
  if (!hl) return text;
  const at = text.indexOf(hl);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <em className="bk-hl">{hl}</em>
      {text.slice(at + hl.length)}
    </>
  );
}

function ProseLeaf({ page }) {
  const gold = page.gold || [];
  let n = 0;
  return (
    <>
      <div
        className={"bk-heat" + (page.fx ? " bk-fx-" + page.fx : "")}
        style={{ "--h": page.heat, "--rgb": page.rgb }}
        aria-hidden="true"
      />
      {page.fx === "bloom" && <div className="bk-bloom" aria-hidden="true" />}
      <div className="bk-prose" style={{ "--s": page.size * SCALE + "cqw", "--gap": (page.gap ?? 3) * SCALE + "cqw" }}>
        {page.lines.map((li) => (
          <p key={li} className={"bk-p" + (gold.includes(li) ? " bk-gold" : "")} style={{ "--i": n++ }}>
            {renderLine(LINES[li], page.hl && LINES[li].includes(page.hl) ? page.hl : null)}
          </p>
        ))}
      </div>
    </>
  );
}

// fade a clip out and stop it (used when the next turn starts)
function fadeOutClip(el) {
  if (!el) return;
  let v = el.volume;
  const id = setInterval(() => {
    v = Math.max(0, v - 0.12);
    try {
      el.volume = v;
    } catch {}
    if (v <= 0) {
      clearInterval(id);
      el.pause();
    }
  }, 30);
}

// ── the book ─────────────────────────────────────────────────────────────────
function MegalomaniacsBook() {
  const total = PAGES.length;

  const bookRef = useRef(null);
  const leafRefs = useRef([]);
  const idxRef = useRef(0);
  const animating = useRef(false);
  const rafRef = useRef(0);

  const [page, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [scoreOn, setScoreOn] = useState(true);
  const [notesOn, setNotesOn] = useState(true);
  const notesRef = useRef(true);
  const openedRef = useRef(false);
  useEffect(() => {
    notesRef.current = notesOn;
  }, [notesOn]);
  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  const audio = useRef({
    ctx: null,
    master: null,
    ambientGain: null,
    lp: null,
    nodes: [],
    clipEl: null,
    mode: null,
  });

  // Stop all sound when the reader leaves the page.
  useEffect(() => {
    const A = audio.current;
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (A.clipEl) {
        A.clipEl.pause();
        A.clipEl = null;
      }
      A.nodes.forEach((o) => {
        try {
          o.stop();
        } catch {}
      });
      A.nodes = [];
      if (A.ctx && A.ctx.state !== "closed") A.ctx.close().catch(() => {});
      A.ctx = null;
      A.master = null;
      A.ambientGain = null;
      A.lp = null;
      A.mode = null;
    };
  }, []);

  const setLeafState = useCallback(() => {
    const i = idxRef.current;
    leafRefs.current.forEach((el, k) => {
      if (!el) return;
      el.style.display = k === i ? "block" : "none";
      el.style.transform = "rotateY(0deg)";
      // the leaf on show gets data-active, which (re)starts its animations
      if (k === i) el.setAttribute("data-active", "1");
      else el.removeAttribute("data-active");
      const sh = el.querySelector(".bk-sheen");
      if (sh) sh.style.opacity = 0;
    });
    setPage(i + 1);
  }, []);

  useEffect(() => {
    setLeafState();
  }, [setLeafState]);

  const go = useCallback(
    (dir) => {
      if (animating.current) return;
      const cur = idxRef.current;
      const next = cur + dir;
      if (next < 0 || next >= total) return;
      animating.current = true;
      playTurn(next);

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const outEl = leafRefs.current[cur];
      const inEl = leafRefs.current[next];
      if (reduce || !outEl || !inEl) {
        idxRef.current = next;
        setLeafState();
        animating.current = false;
        return;
      }
      const forward = dir > 0;
      inEl.style.display = "block";
      inEl.setAttribute("data-active", "1"); // its animation starts as the page turns
      outEl.style.display = "block";
      outEl.style.zIndex = 30;
      inEl.style.zIndex = 20;
      inEl.style.transform = "rotateY(0deg)";
      outEl.style.transformOrigin = forward ? "left center" : "right center";
      const sheen = outEl.querySelector(".bk-sheen");
      const start = performance.now();
      const dur = 700;
      const to = forward ? -170 : 170;
      const frame = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        outEl.style.transform = `rotateY(${to * e}deg)`;
        if (sheen) sheen.style.opacity = e * 0.7;
        if (t < 1) rafRef.current = requestAnimationFrame(frame);
        else {
          idxRef.current = next;
          animating.current = false;
          setLeafState();
        }
      };
      rafRef.current = requestAnimationFrame(frame);
    },
    [total, setLeafState] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // arrow keys (once the book is open) + horizontal swipe
  useEffect(() => {
    const onKey = (e) => {
      if (!openedRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const el = bookRef.current;
    let tx = null;
    const ts = (e) => {
      tx = e.changedTouches[0].clientX;
    };
    const te = (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
      tx = null;
    };
    el?.addEventListener("touchstart", ts, { passive: true });
    el?.addEventListener("touchend", te, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("touchstart", ts);
      el?.removeEventListener("touchend", te);
    };
  }, [go]);

  // ───────── sound ─────────
  function initAudio() {
    const A = audio.current;
    A.ctx = new (window.AudioContext || window.webkitAudioContext)();
    A.master = A.ctx.createGain();
    A.master.gain.value = 0.9;
    A.master.connect(A.ctx.destination);
    A.mode = "synth";
    startAmbient();
  }

  // a low, slow drone that opens up (the filter brightens) as the poem heats
  function startAmbient() {
    const A = audio.current,
      ctx = A.ctx;
    A.ambientGain = ctx.createGain();
    A.ambientGain.gain.value = 0.0001;
    A.ambientGain.connect(A.master);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 300;
    lp.Q.value = 0.7;
    lp.connect(A.ambientGain);
    A.lp = lp;
    const base = 82.41; // E2
    [
      [base, 0.15, "triangle"],
      [base * 1.5, 0.05, "sine"],
      [base * 2, 0.06, "sine"],
      [base * 3, 0.03, "sine"],
      [base * 4.003, 0.018, "sine"],
    ].forEach(([f, g, type]) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f * (1 + (Math.random() * 0.004 - 0.002));
      const og = ctx.createGain();
      og.gain.value = g;
      o.connect(og);
      og.connect(lp);
      o.start();
      A.nodes.push(o);
    });
    // a slow swell, like breathing
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ctx.createGain();
    lg.gain.value = 120;
    lfo.connect(lg);
    lg.connect(lp.frequency);
    lfo.start();
    A.nodes.push(lfo);
    A.ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    A.ambientGain.gain.exponentialRampToValueAtTime(0.34, ctx.currentTime + 4.5);
  }

  function brighten(pageIndex) {
    const A = audio.current;
    if (!A.ctx || !A.lp) return;
    const heat = PAGES[pageIndex].heat;
    A.lp.frequency.cancelScheduledValues(A.ctx.currentTime);
    A.lp.frequency.setTargetAtTime(280 + heat * 1100, A.ctx.currentTime, 1.2);
  }

  function playTurn(pageIndex) {
    const A = audio.current;
    if (!A.ctx) return;
    brighten(pageIndex);
    if (!notesRef.current) return;
    const ctx = A.ctx,
      now = ctx.currentTime;

    const clipSrc = TURN_CLIPS[pageIndex];
    if (clipSrc) {
      fadeOutClip(A.clipEl);
      try {
        const s = new Audio(clipSrc);
        s.volume = 0.8;
        s.play().catch(() => {});
        A.clipEl = s;
      } catch {}
    } else {
      // paper rustle (filtered noise)
      const dur = 0.3,
        len = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * (0.55 + 0.45 * Math.sin(t * 38 + Math.random()));
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2400;
      bp.Q.value = 0.8;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 900;
      const rg = ctx.createGain();
      rg.gain.value = 0.12;
      src.connect(bp);
      bp.connect(hp);
      hp.connect(rg);
      rg.connect(A.master);
      src.start(now);
    }

    // pitched bell keyed to the page — it rings longer as the poem heats
    const heat = PAGES[pageIndex].heat;
    const f = TURN_NOTES[pageIndex % TURN_NOTES.length];
    const ring = 2.2 + heat * 2.2;
    const bell = ctx.createOscillator();
    bell.type = "sine";
    bell.frequency.value = f;
    const harm = ctx.createOscillator();
    harm.type = "sine";
    harm.frequency.value = f * 2;
    const bg = ctx.createGain();
    bg.gain.value = 0.0001;
    const hg = ctx.createGain();
    hg.gain.value = 0.0001;
    bell.connect(bg);
    harm.connect(hg);
    bg.connect(A.master);
    hg.connect(A.master);
    bg.gain.setValueAtTime(0.0001, now);
    bg.gain.exponentialRampToValueAtTime(0.15, now + 0.03);
    bg.gain.exponentialRampToValueAtTime(0.0001, now + ring);
    hg.gain.setValueAtTime(0.0001, now);
    hg.gain.exponentialRampToValueAtTime(0.03 + heat * 0.03, now + 0.02);
    hg.gain.exponentialRampToValueAtTime(0.0001, now + ring * 0.55);
    bell.start(now);
    harm.start(now);
    bell.stop(now + ring + 0.1);
    harm.stop(now + ring * 0.55 + 0.1);
  }

  function toggleScore() {
    const A = audio.current;
    const on = !scoreOn;
    setScoreOn(on);
    if (!A.ctx || !A.ambientGain) return;
    A.ambientGain.gain.cancelScheduledValues(A.ctx.currentTime);
    A.ambientGain.gain.setTargetAtTime(on ? 0.34 : 0.0001, A.ctx.currentTime, 0.6);
  }

  function open() {
    initAudio();
    if (audio.current.ctx?.state === "suspended") audio.current.ctx.resume();
    brighten(idxRef.current);
    setOpened(true);
  }

  return (
    <div className="bk-root" data-open={opened ? "1" : undefined} style={{ "--bk-serif": serif.style.fontFamily }}>
      <div className="bk-stage">
        <div className="bk-book" ref={bookRef} role="group" aria-label={`Megalomaniacs of Truth, a poem in ${total} pages`}>
          {PAGES.map((p, i) => (
            <div key={i} className="bk-leaf" ref={(el) => (leafRefs.current[i] = el)} style={{ zIndex: total - i }}>
              <ProseLeaf page={p} />
              <div className="bk-sheen" />
              <div className="bk-zone bk-left" onClick={() => go(-1)} />
              <div className="bk-zone bk-right" onClick={() => go(1)} />
            </div>
          ))}
        </div>

        {/* the front of the book */}
        <div className={"bk-gate" + (opened ? " bk-gone" : "")} aria-hidden={opened}>
          <svg className="bk-rings" viewBox="-50 -50 100 100" aria-hidden="true">
            <circle className="bk-ring bk-r1" r="10" />
            <circle className="bk-ring bk-r2" r="20" />
            <circle className="bk-ring bk-r3" r="30" />
            <circle className="bk-ring bk-r4" r="40" />
            <circle className="bk-core" r="2.4" />
          </svg>
          <h2 className="bk-gtitle">Megalomaniacs of Truth</h2>
          <p className="bk-gsub">where desire becomes devotion</p>
          <button className="bk-open" onClick={open} tabIndex={opened ? -1 : 0}>
            Open the book
          </button>
        </div>
      </div>

      <div className="bk-hud">
        <button className={"bk-hbtn" + (scoreOn ? " bk-on" : "")} onClick={toggleScore}>
          <span className="bk-dot" />
          Score
        </button>
        <div className="bk-counter">
          <b>{page}</b> / {total}
        </div>
        <button className={"bk-hbtn" + (notesOn ? " bk-on" : "")} onClick={() => setNotesOn((v) => !v)}>
          <span className="bk-dot" />
          Page notes
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
}

export default memo(MegalomaniacsBook);

const CSS = `
.bk-root{--bk-page:#0d0b0c;--bk-page-rgb:13,11,12;--bk-parchment:#ece4d8;--bk-gold:#c9a24b;
  --bk-muted:rgba(203,213,225,.7);
  --bk-sans:"Inter",system-ui,sans-serif;
  display:flex;flex-direction:column;align-items:center;gap:1rem;
  font-family:var(--bk-serif),Georgia,serif;color:var(--bk-parchment)}
.bk-stage{position:relative;container-type:inline-size;
  width:min(88vw,calc(66svh * 612 / 792),480px);aspect-ratio:612 / 792}
.bk-book{position:absolute;inset:0;perspective:2200px;touch-action:pan-y}
.bk-leaf{position:absolute;inset:0;
  background:linear-gradient(90deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 7%),var(--bk-page);
  border:1px solid rgba(255,255,255,.1);border-radius:4px 12px 12px 4px;
  box-shadow:0 10px 40px rgba(0,0,0,.45),inset 0 0 60px rgba(0,0,0,.35);
  container-type:inline-size;overflow:hidden;transform-origin:left center;backface-visibility:hidden;will-change:transform;
  font-family:var(--bk-serif),Georgia,serif}

/* the glow behind the words — warmer and brighter as the poem goes on */
.bk-heat{position:absolute;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 85% 62% at 50% 54%,rgba(var(--rgb),calc(var(--h) * .5)) 0%,rgba(var(--rgb),calc(var(--h) * .2)) 48%,rgba(var(--rgb),0) 78%),
    radial-gradient(ellipse 120% 40% at 50% 112%,rgba(var(--rgb),calc(var(--h) * .45)) 0%,rgba(var(--rgb),0) 70%)}

.bk-prose{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:var(--gap,3cqw);padding:13cqw 11cqw 12cqw 12cqw;text-align:center}
.bk-p{margin:0;font-style:normal;font-weight:400;font-size:var(--s,4.6cqw);line-height:1.55;letter-spacing:.01em;text-wrap:balance;
  color:var(--bk-parchment);text-shadow:0 1px 16px rgba(0,0,0,.75)}
.bk-p.bk-gold,.bk-hl{color:var(--bk-gold);text-shadow:0 0 18px rgba(201,162,75,.28),0 1px 16px rgba(0,0,0,.7)}
.bk-hl{font-style:normal}

/* ── page animations: only on the page being shown, once the book is open ── */
.bk-root[data-open] .bk-leaf[data-active] .bk-heat{animation:bk-warm 3.2s ease-out both,bk-breathe 6s ease-in-out 3.2s infinite alternate}
.bk-root[data-open] .bk-leaf[data-active] .bk-p{animation:bk-line 1.5s ease-out both;animation-delay:calc(.35s + var(--i) * 1.1s)}
@keyframes bk-warm{from{opacity:0}to{opacity:1}}
@keyframes bk-breathe{from{opacity:1;transform:scale(1)}to{opacity:.78;transform:scale(1.04)}}
@keyframes bk-line{from{opacity:0;transform:translateY(1.6cqw);filter:blur(.8cqw)}to{opacity:1;transform:none;filter:blur(0)}}

/* the light: it closes in from the edges of the page */
.bk-bloom{position:absolute;inset:-20%;z-index:0;pointer-events:none;opacity:0;
  background:radial-gradient(closest-side,rgba(255,226,150,0) 46%,rgba(255,222,140,.55) 78%,rgba(255,240,200,.95) 100%)}
.bk-root[data-open] .bk-leaf[data-active] .bk-bloom{animation:bk-bloom 7s ease-in-out .6s both,bk-bloom-pulse 4s ease-in-out 7.6s infinite alternate}
@keyframes bk-bloom{0%{opacity:0;transform:scale(1.5)}100%{opacity:1;transform:scale(1)}}
@keyframes bk-bloom-pulse{from{opacity:1;transform:scale(1)}to{opacity:.8;transform:scale(1.07)}}

.bk-sheen{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;
  background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,0) 40%)}
.bk-zone{position:absolute;top:0;bottom:0;width:38%;z-index:6;cursor:pointer}
.bk-left{left:0}.bk-right{right:0}

.bk-gate{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3.6cqw;padding:0 8cqw;text-align:center;
  background:linear-gradient(90deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 7%),radial-gradient(120% 80% at 50% 38%,#1c1213 0%,var(--bk-page) 72%);
  border:1px solid rgba(255,255,255,.1);border-radius:4px 12px 12px 4px;
  box-shadow:0 10px 40px rgba(0,0,0,.45),inset 0 0 60px rgba(0,0,0,.35);
  transition:opacity .8s ease,visibility 0s linear .8s}
.bk-gate.bk-gone{opacity:0;visibility:hidden;pointer-events:none}
.bk-rings{width:52cqw;height:52cqw;overflow:visible;pointer-events:none;filter:drop-shadow(0 0 14px rgba(201,162,75,.28))}
.bk-ring{fill:none;stroke:#c9a24b;stroke-width:.45;transform-origin:center;animation:bk-ripple 7s ease-in-out infinite both}
.bk-r1{opacity:.9}.bk-r2{opacity:.65;animation-delay:-1.4s}.bk-r3{opacity:.42;animation-delay:-2.8s}.bk-r4{opacity:.24;animation-delay:-4.2s}
.bk-core{fill:#e9c26a;animation:bk-core 3.5s ease-in-out infinite alternate}
@keyframes bk-ripple{0%,100%{transform:scale(.92)}50%{transform:scale(1.08)}}
@keyframes bk-core{from{opacity:.55}to{opacity:1}}
.bk-gtitle{margin:0;font-family:"Cinzel",var(--bk-serif),serif;font-weight:600;font-size:max(17px,6.6cqw);line-height:1.2;
  letter-spacing:.04em;text-wrap:balance;color:rgba(255,255,255,.78);
  text-shadow:0 0 15px rgba(201,162,75,.3),0 0 35px rgba(201,162,75,.2)}
.bk-gsub{margin:0;font-style:italic;color:var(--bk-muted);font-size:max(13px,3.6cqw)}
.bk-open{margin-top:1.2cqw;background:none;border:1px solid rgba(201,162,75,.55);color:var(--bk-gold);border-radius:999px;
  font-family:var(--bk-sans);font-size:max(10px,2.3cqw);letter-spacing:.28em;text-transform:uppercase;
  padding:max(.7rem,2.4cqw) max(1.6rem,6.5cqw);cursor:pointer;transition:.35s}
.bk-open:hover{background:var(--bk-gold);color:#0e0d0c;border-color:var(--bk-gold)}
.bk-open:focus-visible,.bk-hbtn:focus-visible{outline:1px solid var(--bk-gold);outline-offset:4px}

.bk-hud{display:flex;align-items:center;justify-content:center;gap:1.4rem;font-family:var(--bk-sans)}
.bk-hbtn{background:none;border:0;color:var(--bk-muted);cursor:pointer;font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;padding:.4rem .2rem;transition:.25s;display:inline-flex;align-items:center;gap:.5rem}
.bk-hbtn:hover,.bk-hbtn.bk-on{color:var(--bk-gold)}
.bk-dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.5}
.bk-hbtn.bk-on .bk-dot{opacity:1;box-shadow:0 0 8px var(--bk-gold)}
.bk-counter{font-family:var(--bk-serif),Georgia,serif;font-style:italic;color:var(--bk-muted);font-size:1.05rem;min-width:4.5rem;text-align:center}
.bk-counter b{color:var(--bk-gold);font-style:normal;font-weight:500}
@media (prefers-reduced-motion:reduce){
  .bk-root[data-open] .bk-leaf[data-active] .bk-heat,.bk-root[data-open] .bk-leaf[data-active] .bk-p,
  .bk-root[data-open] .bk-leaf[data-active] .bk-bloom,.bk-ring,.bk-core{animation:none}
  .bk-bloom{opacity:.85}.bk-gate{transition:none}}
`;