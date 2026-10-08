'use client';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';


function fmt(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, sec };
}

export default function Page() {

  const firstHugh = useMemo(() => new Date('2025-10-11T12:00:00'), []);
  const [now, setNow] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);


  const elapsedMs = now === null ? null : Math.max(0, now - firstHugh.getTime());
  const { d, h, m, sec } = elapsedMs === null ? { d: 0, h: 0, m: 0, sec: 0 } : fmt(elapsedMs);

  return (
    <main
      className="smoke-layer relative min-h-screen overflow-hidden"
      style={{
        '--smoke-opacity': 0.18,
        '--text-alpha': 0.94,
      }}
    >
      <section className="relative z-10 flex flex-col items-center justify-center gap-7 px-5 py-16 text-center text-soft">

      
        <h1
          className="
            font-['Cinzel'] goth-glow font-extrabold tracking-tight leading-tight
            text-[9vw] sm:text-5xl md:text-7xl
            grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 w-full
          "
          style={{ letterSpacing: '.01em' }}
        >
          <img
            src="/HeronEdit.png"
            alt="Heron"
            className="h-12 md:h-32 opacity-60 drop-shadow justify-self-start"
            loading="eager"
            decoding="async"
          />

          <span
            className="text-white/65 text-center inline-block"
            style={{
              textShadow: '0 0 15px hsl(var(--hugh)/.3), 0 0 35px hsl(var(--hugh)/.2)',
              whiteSpace: 'nowrap',
            }}
          >
            🖤OUR FIRST HUGH🖤
          </span>

          <img
            src="/LittleBat.png"
            alt="Bat"
            className="h-12 md:h-32 opacity-60 drop-shadow justify-self-end"
            loading="eager"
            decoding="async"
          />
        </h1>

       
        <p className="max-w-2xl font-['Inter'] text-lg md:text-xl italic leading-relaxed text-slate-200/90">
          There was never a beginning - only this slow collision,<br />
          time folding its wings around <br />
           <span className="text-[hsl(var(--hugh))] font-semibold">
              our first hugh
          </span>
        </p>

    
        <p className="font-['Inter'] text-sm tracking-[0.28em] uppercase">
          Since Saturday 11 October 2025
        </p>

       
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
        ) : (
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
        )}

        <Link
          href="/"
          className="font-['Inter'] mt-4 text-[11px] uppercase tracking-[0.28em] text-slate-300/70 transition-colors duration-500 hover:text-white/90"
        >
          ← Back
        </Link>

    
      </section>

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
          alt="Hugh"
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