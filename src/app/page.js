'use client';
import { useMemo, useState, useEffect } from 'react';

function fmt(msLeft) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, sec };
}

export default function Page() {
  // Target: Sat 12 Oct 2025 12:00 (local time on the viewer’s machine)
  const target = useMemo(() => new Date('2025-10-12T12:00:00'), []);
  const [now, setNow] = useState(null);     // null until mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // While SSR/first paint, render a stable shell to avoid mismatches
  const msLeft = now === null ? null : Math.max(0, target.getTime() - now);
  const { d, h, m, sec } = msLeft === null ? { d: 0, h: 0, m: 0, sec: 0 } : fmt(msLeft);
  const done = msLeft === 0;

  return (
    <main
      className="smoke-layer relative min-h-screen overflow-hidden"
      style={{
        '--smoke-opacity': .18, // tweak smoke strength
        '--text-alpha': .94     // tweak global text alpha (used by .text-soft)
      }}
    >
      <section className="relative z-10 flex flex-col items-center justify-center gap-7 px-5 py-16 text-center text-soft">
        {/* Title */}
      <h1
  className="font-['Cinzel'] goth-glow text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
  style={{ letterSpacing: '.02em' }}
>
          <span className="align-middle mr-2">🦇</span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(180deg, hsl(var(--hugh)/.95), hsl(var(--hugh)/.65))' }}
          >
            OUR FIRST HUGH
          </span>
          <span className="align-middle ml-2">🦇</span>
        </h1>

        {/* Tagline */}
        <p className="max-w-2xl font-[Inter] text-lg md:text-xl italic leading-relaxed">
          The starting point of an IRL spiral – which, of course, doesn&apos;t really
          have a starting point, as spirals have neither a start <em>nor</em> an end
          point... Let&apos;s <span className="text-[hsl(var(--hugh))] font-semibold">JUMP IN!!!</span> Yaaaay!!!
        </p>

        {/* Date */}
        <p className="font-[Inter] text-sm tracking-[0.28em] uppercase">
          Saturday 12 October 2025
        </p>

        {/* Countdown */}
        {!mounted ? (
          // SSR-safe placeholder shell (no changing numbers)
          <div className="grid grid-cols-4 gap-3 mt-2 opacity-70">
            {['Days','Hours','Mins','Secs'].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-sm px-5 py-5 shadow-[0_10px_40px_rgba(0,0,0,.45)]"
              >
           <div
  className="font-['Playfair Display'] text-3xl md:text-4xl tracking-wide countdown-num"
  style={{ color: 'hsl(var(--hugh))' }}
  suppressHydrationWarning
>
  {String(val).padStart(2, '0')}
</div>

                <div className="text-[11px] mt-1 uppercase tracking-[0.2em] text-slate-300/80">{label}</div>
              </div>
            ))}
          </div>
        ) : !done ? (
          <div className="grid grid-cols-4 gap-3 mt-2">
            {[
              ['Days', d], ['Hours', h], ['Mins', m], ['Secs', sec],
            ].map(([label, val]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-sm px-5 py-5 shadow-[0_10px_40px_rgba(0,0,0,.45)]"
              >
                <div
                  className="font-[Playfair Display] text-3xl md:text-4xl tracking-wide countdown-num"
                  style={{ color: 'hsl(var(--hugh))' }}
                  suppressHydrationWarning
                >
                  {String(val).padStart(2, '0')}
                </div>
                <div className="text-[11px] mt-1 uppercase tracking-[0.2em] text-slate-300/80">{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-4xl md:text-5xl goth-glow" style={{ color: 'hsl(var(--hugh))' }}>
            H U G H ! 🫂
          </div>
        )}

     
      </section>
      <footer className="fixed bottom-4 left-0 right-0 z-10 flex items-end justify-center gap-6 pointer-events-none">
  <img
    src="/HeronEdit.png"
    alt="Heron by Martin"
    className="h-16 md:h-20 opacity-90 drop-shadow"
    loading="eager"
    decoding="async"
  />
  <img
    src="/LittleBat.png"
    alt="Little bat"
    className="h-12 md:h-16 opacity-90 drop-shadow"
    loading="eager"
    decoding="async"
  />
</footer>

    </main>
  );
}
