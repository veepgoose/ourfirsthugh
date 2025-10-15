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
 
  const target = useMemo(() => new Date('2025-10-20T15:10:00'), []);
  const [now, setNow] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = now === null ? null : Math.max(0, target.getTime() - now);
  const { d, h, m, sec } = msLeft === null ? { d: 0, h: 0, m: 0, sec: 0 } : fmt(msLeft);
  const done = msLeft === 0;

  return (
    <main
      className="smoke-layer relative min-h-screen overflow-hidden"
      style={{
        '--smoke-opacity': 0.18, // tweak smoke strength
        '--text-alpha': 0.94,    // tweak global text alpha (used by .text-soft)
      }}
    >
      <section className="relative z-10 flex flex-col items-center justify-center gap-7 px-5 py-16 text-center text-soft">
        {/* Title (kept your heron/bat + 🖤 text) */}
<h1
  className="
    font-['Cinzel'] goth-glow font-extrabold tracking-tight leading-tight
    text-[9vw] sm:text-5xl md:text-7xl
    grid grid-cols-[auto_1fr_auto] items-center gap- sm:gap-3 w-full
  "
  style={{ letterSpacing: '.01em' }}
>
  {/* Left heron — keep your opacity/size */}
  <img
    src="/HeronEdit.png"
    alt="Heron"
    className="h-12 md:h-32 opacity-60 drop-shadow justify-self-start"
    loading="eager"
    decoding="async"
  />

  {/* Middle text — truly centered */}
<span
  className="
    text-white/65 text-center inline-block
    text-[7vw] sm:text-[5vw] md:text-[3.5vw] lg:text-6xl
  "
  style={{
    textShadow:
      '0 0 15px hsl(var(--hugh)/.3), 0 0 35px hsl(var(--hugh)/.2)',
    whiteSpace: 'nowrap',
  }}
>
  🖤OUR SECOND HUGH🖤
</span>

  {/* Right bat — keep your opacity/size */}
  <img
    src="/LittleBat.png"
    alt="Bat"
    className="h-12 md:h-32 opacity-60 drop-shadow justify-self-end"
    loading="eager"
    decoding="async"
  />
</h1>



        {/* Tagline */}
    <p
  className="max-w-2xl font-['Inter'] text-lg md:text-xl italic leading-relaxed text-slate-200/90 fade-text"
>
  Time unfurls its wings;<br />
   the spiral reverses,<br />
  not to repeat, but to deepen.<br />
  Neither echo nor shadow,<br />{' '}
  <span className="text-[hsl(var(--hugh))] font-semibold">
    only difference, refracted in familiarity
  </span>.
</p>


        {/* Date */}
        <p className="font-['Inter'] text-sm tracking-[0.28em] uppercase">
          Monday 20 October 2025
        </p>

        {/* Countdown (SSR-safe shell → live numbers → done) */}
        {!mounted ? (
          <div className="grid grid-cols-4 gap-3 mt-2 opacity-70">
            {['Days', 'Hours', 'Mins', 'Secs'].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-sm px-5 py-5 shadow-[0_10px_40px_rgba(0,0,0,.45)]"
              >
                <div
                  className="font-['Playfair Display'] text-3xl md:text-4xl tracking-wide"
                  style={{ color: 'hsl(var(--hugh))' }}
                >
                  --
                </div>
                <div className="text-[11px] mt-1 uppercase tracking-[0.2em] text-slate-300/80">
                  {label}
                </div>
              </div>
            ))}
          </div>
        ) : !done ? (
          <div className="grid grid-cols-4 gap-3 mt-2">
            {[
              ['Days', d],
              ['Hours', h],
              ['Mins', m],
              ['Secs', sec],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-sm px-5 py-5 shadow-[0_10px_40px_rgba(0,0,0,.45)]"
              >
                <div
                  className="font-['Playfair Display'] text-3xl md:text-4xl tracking-wide countdown-num"
                  style={{ color: 'hsl(var(--hugh))' }}
                  suppressHydrationWarning
                >
                  {String(value).padStart(2, '0')}
                </div>
                <div className="text-[11px] mt-1 uppercase tracking-[0.2em] text-slate-300/80">
                  {label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-4xl md:text-5xl goth-glow" style={{ color: 'hsl(var(--hugh))' }}>
            H U G H No2 ! 🫂
          </div>
        )}
      </section>

      {/* Bottom heron + bat (kept) */}
      <footer className="fixed bottom-4 left-0 right-0 z-10 flex items-end justify-center gap-6 pointer-events-none">
        <img
          src="/HeronEdit.png"
          alt="Heron by Martin"
          className="h-16 md:h-20 opacity-65 drop-shadow"
          loading="eager"
          decoding="async"
        />


        <img
          src="/Hugh.png"
          alt="Little bat"
          className="h-22 md:h-30 opacity-65 drop-shadow"
          loading="eager"
          decoding="async"
        />
        <img
          src="/LittleBat.png"
          alt="Little bat"
          className="h-16 md:h-20 opacity-65 drop-shadow"
          loading="eager"
          decoding="async"
        />
      </footer>
    </main>
  );
}
