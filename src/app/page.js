'use client';
import { useState, useEffect, useMemo } from 'react';

function formatTime(msLeft) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, sec };
}

export default function Page() {
  const target = useMemo(() => new Date('2025-10-12T12:00:00'), []);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = Math.max(0, target.getTime() - now);
  const { d, h, m, sec } = formatTime(msLeft);
  const done = msLeft === 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-slate-100 font-serif text-center px-4">
      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-black tracking-tight goth-glow">
        🦇 OUR FIRST HUGH 🦇
      </h1>

      {/* Tagline */}
      <p className="max-w-xl text-lg md:text-xl text-slate-300 italic leading-relaxed">
        The starting point of an IRL spiral – which, of course, doesn&apos;t really
        have a starting point, as spirals have neither a start <em>nor</em> an end
        point... Let&apos;s <span className="text-purple-400 font-bold">JUMP IN!!!</span> Yaaaay!!!
      </p>

      {/* Date */}
      <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">
        Saturday&nbsp;12&nbsp;October&nbsp;2025
      </p>

      {/* Countdown */}
      {!done ? (
        <div className="grid grid-cols-4 gap-3 mt-2">
          {[
            ['Days', d],
            ['Hours', h],
            ['Mins', m],
            ['Secs', sec],
          ].map(([label, val]) => (
            <div
              key={label}
              className="bg-zinc-900/70 border border-zinc-700 rounded-xl px-5 py-4 shadow-lg"
            >
              <div className="text-3xl font-mono text-purple-300 tabular-nums">
                {String(val).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-4xl text-purple-400 animate-pulse">
          H U G H ! 🫂
        </div>
      )}

      {/* Decorative bats & heron */}
      <div className="mt-10 text-2xl opacity-50 select-none">
        🦇 🦇 <span className="text-blue-400">🪶</span> 🦇
      </div>
    </main>
  );
}
