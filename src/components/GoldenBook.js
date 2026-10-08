"use client";

// ─────────────────────────────────────────────────────────────────────────────
// <GoldenBook /> — "Our Golden Hugh", a ten-page poem you turn like a book.
//
// Self-contained: the page-turning engine, the ten leaves and the sound all live
// in this file. Drop <GoldenBook /> anywhere:
//
//   import GoldenBook from "../components/GoldenBook";   // from src/app/page.js
//   <GoldenBook />
//
// Needs:  public/GoldenHugh.png   (the gold figure)
//
// PAGE-TURN CLIPS: fill TURN_CLIPS below with files from public/ (e.g.
// "/audio/golden/turn-02.mp3"). Until then each turn uses a synth rustle + bell.
// ─────────────────────────────────────────────────────────────────────────────

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const IMG = "/golden-hugh.png";
const IMG_AR = 615 / 591; // image height ÷ width

// One slot per page, indexed by the page you turn TO (slot 1 plays as you turn
// from page 1 to page 2). null = synth rustle + bell. Slot 0 only plays if the
// reader turns back to page 1.
const TURN_CLIPS = [
  null, // → page 1  (only when turning back)
  null, // → page 2  Behold
  null, // → page 3  the wink
  null, // → page 4
  null, // → page 5
  null, // → page 6  my heart does not long
  null, // → page 7  No:
  null, // → page 8  my heart knows
  null, // → page 9  …Only You
  null, // → page 10 Simply …You
];

// Synth bell per page — bright through the gold pages, low at "No:", home on A.
const TURN_NOTES = [392, 523.25, 659.25, 783.99, 880, 493.88, 329.63, 392, 392, 392];

// ── layout helper ────────────────────────────────────────────────────────────
// Lays lines out top to bottom. A line is a string, "" (a blank gap), or
// { t, size, accent, x, dy, align }.  x is the centre unless align is "l".
const LEAF_H = (100 * 792) / 612; // leaf height in cqw
function stack(lines, o = {}) {
  const { x = 50, y = 10, size = 9, lead = 1.3, align = "c" } = o;
  let cy = y;
  const out = [];
  for (const ln of lines) {
    const l = typeof ln === "string" ? { t: ln } : ln;
    const s = l.size ?? size;
    if (l.t === "") {
      cy += (s * lead * 100) / LEAF_H;
      continue;
    }
    out.push([l.t, l.x ?? x, cy + (l.dy ?? 0), s, l.accent ? 1 : 0, l.align ?? align]);
    cy += (s * lead * 100) / LEAF_H;
  }
  return out;
}

const img = (o) => ({ src: IMG, ar: IMG_AR, ...o });

// ── the ten leaves ───────────────────────────────────────────────────────────
// Tokens are [text, left%, top%, size(cqw), accent(0/1), align("c"|"l"|"r")].
// The figure appears through pages 1–6 and, from "No:" onward, the page is empty.
const LEAVES = [
  // 1 — Look! at the top, the figure centred, the line beneath him
  {
    images: [img({ zoom: 0.7, point: [0.5, 0.5], at: [50, 50], shimmer: true, fx: "fadein" })],
    tokens: [
      ["Look!", 50, 6, 8, 0, "c"],
      ...stack(["how he glitters", "and shines"], { y: 84, size: 4.5 }),
    ],
  },
  // 2 — Behold smallest, Golden largest
  {
    images: [img({ zoom: 0.88, point: [0.5, 1], at: [50, 104], fx: "glow" })],
    tokens: stack(
      [
        { t: "Behold -", size: 4 },
        { t: "Our Hugh", size: 5.5 },
        { t: "of", size: 4.5 },
        { t: "Golden!", size: 10, accent: true },
      ],
      { y: 7, lead: 1.25 }
    ),
  },
  // 3 — the whole stanza, centred, no image
  {
    images: [],
    tokens: stack(
      ["how he dazzles", "how he winks", "a knowing wink", "without eyes"],
      { y: 40, size: 4, lead: 1.7 }
    ),
  },
  // 4
  {
    images: [img({ zoom: 0.8, point: [0.5, 1], at: [50, 101], opacity: 0.8, fx: "glow" })],
    tokens: stack(
      [{ t: "Our Hugh", size: 10.5 }, { t: "of", size: 5 }, { t: "Golden", size: 12, accent: true }],
      { y: 8, lead: 1.25 }
    ),
  },
  // 5 — the figure at full brightness
  {
    images: [img({ zoom: 0.55, point: [0.5, 1], at: [76, 101], opacity: 1 })],
    tokens: stack(
      [{ t: "Our" }, { t: "Golden", accent: true }, { t: "Hugh" }],
      { x: 12, y: 9, size: 11, align: "l", lead: 1.2 }
    ),
  },
  // 6 — the figure centred and all but gone; the last line beneath him
  {
    images: [img({ zoom: 0.5, point: [0.5, 0.5], at: [50, 52], opacity: 0.3, fx: "fadeaway" })],
    tokens: [
      ...stack(["my heart", "it does not", "long"], { x: 13, y: 9, size: 4, align: "l", lead: 1.3 }),
      ...stack(["for a Golden", "Hugh"], { x: 50, y: 78, size: 4.2, lead: 1.4 }),
    ],
  },
  // 7 — gold
  {
    images: [],
    tokens: [["No:", 50, 46, 10, 1, "c"]],
  },
  // 8 — answers page 6, same place on the page
  {
    images: [],
    tokens: stack(
      ["my heart", "knows", "all", "", "that it ever", "knew"],
      { x: 13, y: 9, size: 4, align: "l", lead: 1.2 }
    ),
  },
  // 9
  {
    images: [],
    tokens: [
      ["…Only", 34, 43, 5, 0, "l"],
      ["You", 47, 50, 8, 1, "l"],
    ],
  },
  // 10 — Simply in gold, You in white
  {
    images: [],
    tokens: stack(
      [{ t: "Simply", size: 5, x: 45, accent: true }, { t: "…You 🐢", size: 7 }],
      { y: 43, lead: 1.5 }
    ),
  },
];

// ── image layer on a leaf ────────────────────────────────────────────────────
// Everything is measured in the leaf's own units (cqw = 1% of the leaf width).
//   zoom     image width as a multiple of the leaf width
//   point    [x, y] fractions of the IMAGE…
//   at       …placed at this [x, y] position on the LEAF, in %
//   fx       animation when the page is shown: "fadein" | "glow" | "fadeaway"
function LeafImage({ src, ar = 1, zoom = 1, point = [0.5, 0.5], at = [50, 50], opacity = 1, shimmer = false, fx = null }) {
  const w = zoom * 100;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={"bk-img" + (shimmer ? " bk-shimmer" : "") + (fx ? " bk-fx-" + fx : "")}
      style={{
        width: w + "cqw",
        left: `calc(${at[0]}% - ${point[0] * w}cqw)`,
        top: `calc(${at[1]}% - ${point[1] * w * ar}cqw)`,
        opacity,
        "--bk-o": opacity,
      }}
    />
  );
}

function ConcreteLeaf({ tokens = [], images = [], scrim = null }) {
  return (
    <>
      {images.map((im, i) => (
        <LeafImage key={"img" + i} {...im} />
      ))}
      {(scrim === "top" || scrim === "both") && <div className="bk-scrim bk-scrim-top" />}
      {(scrim === "bottom" || scrim === "both") && <div className="bk-scrim bk-scrim-bottom" />}
      {tokens.map((w, i) => (
        <span
          key={i}
          className={w[4] ? "bk-w bk-a" : "bk-w"}
          style={{
            left: w[1] + "%",
            top: w[2] + "%",
            fontSize: w[3] + "cqw",
            transform: w[5] === "c" ? "translateX(-50%)" : w[5] === "r" ? "translateX(-100%)" : undefined,
          }}
        >
          {w[0]}
        </span>
      ))}
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
function GoldenBook() {
  const pages = LEAVES.map((l, i) => <ConcreteLeaf key={i} tokens={l.tokens} images={l.images} scrim={l.scrim} />);
  const total = pages.length;

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
      const dur = 640;
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

  function startAmbient() {
    const A = audio.current,
      ctx = A.ctx;
    A.ambientGain = ctx.createGain();
    A.ambientGain.gain.value = 0.0001;
    A.ambientGain.connect(A.master);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 560;
    lp.Q.value = 0.6;
    lp.connect(A.ambientGain);
    const base = 110;
    [
      [base, 0.13, "triangle"],
      [base * 1.5, 0.05, "sine"],
      [base * 2, 0.06, "sine"],
      [base * 2.997, 0.028, "sine"],
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
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.045;
    const lg = ctx.createGain();
    lg.gain.value = 220;
    lfo.connect(lg);
    lg.connect(lp.frequency);
    lfo.start();
    A.nodes.push(lfo);
    A.ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    A.ambientGain.gain.exponentialRampToValueAtTime(0.32, ctx.currentTime + 4.5);
  }

  function playTurn(pageIndex) {
    const A = audio.current;
    if (!A.ctx || !notesRef.current) return;
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
      bp.frequency.value = 2600;
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

    // pitched bell keyed to the page
    const f = TURN_NOTES[pageIndex % TURN_NOTES.length];
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
    bg.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
    bg.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
    hg.gain.setValueAtTime(0.0001, now);
    hg.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
    hg.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    bell.start(now);
    harm.start(now);
    bell.stop(now + 2.7);
    harm.stop(now + 1.5);
  }

  function toggleScore() {
    const A = audio.current;
    const on = !scoreOn;
    setScoreOn(on);
    if (!A.ctx || !A.ambientGain) return;
    A.ambientGain.gain.cancelScheduledValues(A.ctx.currentTime);
    A.ambientGain.gain.setTargetAtTime(on ? 0.32 : 0.0001, A.ctx.currentTime, 0.6);
  }

  function open() {
    initAudio();
    if (audio.current.ctx?.state === "suspended") audio.current.ctx.resume();
    setOpened(true);
  }

  return (
    <div className="bk-root" data-open={opened ? "1" : undefined} style={{ "--bk-serif": serif.style.fontFamily }}>
      <div className="bk-stage">
        <div className="bk-book" ref={bookRef} role="group" aria-label={`Our Golden Hugh, a poem in ${total} pages`}>
          {pages.map((node, i) => (
            <div key={i} className="bk-leaf" ref={(el) => (leafRefs.current[i] = el)} style={{ zIndex: total - i }}>
              {node}
              <div className="bk-sheen" />
              <div className="bk-zone bk-left" onClick={() => go(-1)} />
              <div className="bk-zone bk-right" onClick={() => go(1)} />
            </div>
          ))}
        </div>

        {/* the front of the book */}
        <div className={"bk-gate" + (opened ? " bk-gone" : "")} aria-hidden={opened}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bk-cover" src={IMG} alt="" aria-hidden="true" draggable={false} />
          <h2 className="bk-gtitle">Our Golden Hugh</h2>
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

export default memo(GoldenBook);

const CSS = `
.bk-root{--bk-page:#0e0d0c;--bk-page-rgb:14,13,12;--bk-parchment:#e9e3d6;--bk-gold:#c9a24b;
  --bk-muted:rgba(203,213,225,.7);
  --bk-sans:"Inter",system-ui,sans-serif;
  display:flex;flex-direction:column;align-items:center;gap:1rem;
  font-family:var(--bk-serif),Georgia,serif;color:var(--bk-parchment)}
.bk-stage{position:relative;container-type:inline-size;
  width:min(86vw,calc(62svh * 612 / 792),460px);aspect-ratio:612 / 792}
.bk-book{position:absolute;inset:0;perspective:2200px;touch-action:pan-y}
.bk-leaf{position:absolute;inset:0;
  background:linear-gradient(90deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 7%),var(--bk-page);
  border:1px solid rgba(255,255,255,.1);border-radius:4px 12px 12px 4px;
  box-shadow:0 10px 40px rgba(0,0,0,.45),inset 0 0 60px rgba(0,0,0,.35);
  container-type:inline-size;overflow:hidden;transform-origin:left center;backface-visibility:hidden;will-change:transform;
  font-family:var(--bk-serif),Georgia,serif}
.bk-img{position:absolute;z-index:0;max-width:none;height:auto;pointer-events:none;user-select:none;-webkit-user-drag:none}
.bk-shimmer{animation:bk-glint 4.6s ease-in-out infinite}
@keyframes bk-glint{0%,100%{filter:brightness(1) saturate(1)}50%{filter:brightness(1.2) saturate(1.18)}}

/* ── page animations: only run on the page being shown, once the book is open ── */
.bk-root[data-open] .bk-leaf[data-active] .bk-fx-fadein{
  animation:bk-fadein 4.5s ease-in-out .5s both,bk-glint 4.6s ease-in-out infinite}
.bk-root[data-open] .bk-leaf[data-active] .bk-fx-glow{
  animation:bk-glow-build 4.5s ease-out .2s both,bk-glow-pulse 3.6s ease-in-out 4.7s infinite alternate}
.bk-root[data-open] .bk-leaf[data-active] .bk-fx-fadeaway{
  animation:bk-fadeaway 7s ease-in-out both}
@keyframes bk-fadein{from{opacity:0}to{opacity:var(--bk-o,1)}}
@keyframes bk-fadeaway{0%,57%{opacity:var(--bk-o,.3)}100%{opacity:0}}
@keyframes bk-glow-build{
  0%{filter:brightness(1) saturate(1) drop-shadow(0 0 0 rgba(255,200,90,0)) drop-shadow(0 0 0 rgba(214,170,70,0))}
  100%{filter:brightness(1.18) saturate(1.15) drop-shadow(0 0 2.4cqw rgba(255,206,110,.8)) drop-shadow(0 0 7cqw rgba(214,170,70,.55))}}
@keyframes bk-glow-pulse{
  0%{filter:brightness(1.18) saturate(1.15) drop-shadow(0 0 2.4cqw rgba(255,206,110,.8)) drop-shadow(0 0 7cqw rgba(214,170,70,.55))}
  100%{filter:brightness(1.32) saturate(1.25) drop-shadow(0 0 3.6cqw rgba(255,214,130,.95)) drop-shadow(0 0 11cqw rgba(226,178,70,.7))}}
.bk-scrim{position:absolute;left:0;right:0;z-index:1;pointer-events:none}
.bk-scrim-top{top:0;height:36%;background:linear-gradient(to bottom,rgb(var(--bk-page-rgb)) 0%,rgba(var(--bk-page-rgb),.93) 52%,rgba(var(--bk-page-rgb),0) 100%)}
.bk-scrim-bottom{bottom:0;height:34%;background:linear-gradient(to top,rgb(var(--bk-page-rgb)) 0%,rgba(var(--bk-page-rgb),.93) 52%,rgba(var(--bk-page-rgb),0) 100%)}
.bk-w{position:absolute;z-index:1;white-space:nowrap;line-height:1;text-align:left;color:var(--bk-parchment);
  text-shadow:0 1px 16px rgba(0,0,0,.7)}
.bk-w.bk-a{color:var(--bk-gold);letter-spacing:.03em;text-shadow:0 0 18px rgba(201,162,75,.18),0 1px 16px rgba(0,0,0,.7)}
.bk-sheen{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;
  background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,0) 40%)}
.bk-zone{position:absolute;top:0;bottom:0;width:38%;z-index:6;cursor:pointer}
.bk-left{left:0}.bk-right{right:0}

.bk-gate{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3.6cqw;padding:0 8cqw;text-align:center;
  background:linear-gradient(90deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 7%),radial-gradient(120% 80% at 50% 38%,#17140f 0%,var(--bk-page) 72%);
  border:1px solid rgba(255,255,255,.1);border-radius:4px 12px 12px 4px;
  box-shadow:0 10px 40px rgba(0,0,0,.45),inset 0 0 60px rgba(0,0,0,.35);
  transition:opacity .8s ease,visibility 0s linear .8s}
.bk-gate.bk-gone{opacity:0;visibility:hidden;pointer-events:none}
.bk-cover{height:44cqw;width:auto;max-width:70cqw;object-fit:contain;pointer-events:none;user-select:none;
  filter:drop-shadow(0 0 22px rgba(201,162,75,.3))}
.bk-gtitle{margin:0;font-family:"Cinzel",var(--bk-serif),serif;font-weight:600;font-size:max(17px,7cqw);line-height:1.15;
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
@media (prefers-reduced-motion:reduce){.bk-shimmer,.bk-root[data-open] .bk-leaf[data-active] .bk-img{animation:none}.bk-gate{transition:none}}
`;