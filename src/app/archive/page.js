import Link from "next/link";

export const metadata = {
  title: "🖤 The Archive 🖤",
  description: "Where the Hughs have been.",
};

// ─────────────────────────────────────────────────────────────────────────────
// THE ARCHIVE — a shelf of books, one spine per page.
// To add a book, copy a line and change it:
//   href    the route (matches the folder name inside src/app — case matters!)
//   title   the gold lettering down the spine
//   color   optional spine colour (otherwise it takes the next from COLORS)
//   h / w   optional height / width multiplier (1 = normal) for a bit of variety
// A new shelf starts automatically after every BOOKS_PER_SHELF books.
// ─────────────────────────────────────────────────────────────────────────────
const ENTRIES = [
  { href: "/first", title: "Our First Hugh", h: 1.0, w: 1.0 },
  { href: "/Second", title: "Our Second Hugh", h: 1.08, w: 1.12 },
  { href: "/megalomaniacs", title: "Megalomaniacs", h: 0.95, w: 0.94 },
];

const BOOKS_PER_SHELF = 4;
const COLORS = ["#000", "#000", "#000", "#000", "#000", "#000"];
const GOLD = "#c9a24b";
const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

function Spine({ entry, index }) {
  const color = entry.color ?? COLORS[index % COLORS.length];
  return (
    <li className="fade-in-up" style={{ animationDelay: `${0.15 + index * 0.12}s` }}>
      <Link
        href={entry.href}
        aria-label={entry.title}
        className="group block rounded-[3px] outline-none"
      >
        <span
          className="relative flex flex-col items-center justify-between rounded-[3px_3px_2px_2px] py-4
                     shadow-[0_10px_18px_-8px_rgba(0,0,0,.9)] transition-all duration-500
                     group-hover:-translate-y-3 group-focus-visible:-translate-y-3
                     group-hover:shadow-[0_0_32px_rgba(201,162,75,.28),0_20px_30px_-10px_rgba(0,0,0,.85)]
                     group-focus-visible:shadow-[0_0_0_2px_rgba(201,162,75,.7)]"
          style={{
            width: `calc(var(--w) * ${entry.w ?? 1})`,
            height: `calc(var(--base) * ${entry.h ?? 1})`,
            background: `linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(255,255,255,.08) 16%, rgba(255,255,255,0) 42%, rgba(0,0,0,.45) 100%), ${color}`,
          }}
        >
          {/* gold foil bands */}
          <span className="pointer-events-none absolute inset-x-0 top-[7%] h-px" style={{ background: GOLD, opacity: 0.55 }} />
          <span className="pointer-events-none absolute inset-x-0 top-[9%] h-px" style={{ background: GOLD, opacity: 0.35 }} />
          <span className="pointer-events-none absolute inset-x-0 bottom-[7%] h-px" style={{ background: GOLD, opacity: 0.55 }} />
          <span className="pointer-events-none absolute inset-x-0 bottom-[9%] h-px" style={{ background: GOLD, opacity: 0.35 }} />

          <span
            className="font-['Cinzel'] relative mt-[14%] text-sm font-semibold md:text-base transition-all duration-500 group-hover:brightness-125"
            style={{ color: GOLD, textShadow: "0 0 10px rgba(201,162,75,.35)" }}
          >
            {NUMERALS[index] ?? index + 1}
          </span>

          <span
            className="font-['Cinzel'] relative flex-1 py-3 text-[13px] font-semibold tracking-[0.1em] md:text-[17px] md:tracking-[0.12em] transition-all duration-500 group-hover:brightness-125"
            style={{
              writingMode: "vertical-rl",
              color: GOLD,
              textShadow: "0 0 12px rgba(201,162,75,.3), 0 1px 2px rgba(0,0,0,.6)",
              whiteSpace: "nowrap",
            }}
          >
            {entry.title}
          </span>

          <span aria-hidden="true" className="relative mb-[14%] text-[10px]" style={{ color: GOLD, opacity: 0.8 }}>
            ◆
          </span>
        </span>
      </Link>
    </li>
  );
}

export default function ArchivePage() {
  const shelves = [];
  for (let i = 0; i < ENTRIES.length; i += BOOKS_PER_SHELF) shelves.push(ENTRIES.slice(i, i + BOOKS_PER_SHELF));

  return (
    <main
      className="smoke-layer relative min-h-screen overflow-hidden"
      style={{ "--smoke-opacity": 0.18, "--text-alpha": 0.94 }}
    >
      <section className="relative z-10 flex flex-col items-center gap-10 px-5 pt-16 pb-24 text-center text-soft">
        <h1
          className="
            font-['Cinzel'] font-extrabold tracking-tight leading-tight
            text-[9vw] sm:text-5xl md:text-7xl
            grid grid-cols-[auto_1fr_auto] items-center w-full
          "
          style={{ letterSpacing: ".01em" }}
        >
          <img
            src="/HeronEdit.png"
            alt="Heron"
            className="h-12 md:h-32 opacity-60 drop-shadow justify-self-start"
            loading="eager"
            decoding="async"
          />
          <span
            className="text-white/65 text-center inline-block text-[7vw] sm:text-[3vw] md:text-[3.5vw] lg:text-6xl"
            style={{
              textShadow: "0 0 15px hsl(var(--hugh)/.3), 0 0 35px hsl(var(--hugh)/.2)",
              whiteSpace: "nowrap",
            }}
          >
            🖤THE ARCHIVE🖤
          </span>
          <img
            src="/LittleBat.png"
            alt="Bat"
            className="h-12 md:h-32 opacity-60 drop-shadow justify-self-end"
            loading="eager"
            decoding="async"
          />
        </h1>

        

        {/* the shelves */}
        <div
          className="relative flex w-full max-w-2xl flex-col gap-12 overflow-hidden rounded-xl border border-white/10 bg-black/40 px-4 pt-14 pb-4 shadow-[0_10px_40px_rgba(0,0,0,.45),inset_0_0_60px_rgba(0,0,0,.5)] md:px-8
                   [--base:250px] [--w:62px] md:[--base:300px] md:[--w:82px]"
          style={{ backgroundImage: "radial-gradient(60% 45% at 50% 0%, rgba(201,162,75,.13), transparent 70%)" }}
        >
          {shelves.map((row, r) => (
            <div key={r}>
              <ul className="flex items-end justify-center gap-1.5 md:gap-2">
                {row.map((entry, i) => (
                  <Spine key={entry.href} entry={entry} index={r * BOOKS_PER_SHELF + i} />
                ))}
              </ul>
              {/* the plank */}
              <div
                aria-hidden="true"
                className="-mx-4 h-3.5 md:-mx-8"
                style={{
                  background: "linear-gradient(#3b2e21 0%, #22190f 55%, #0d0906 100%)",
                  boxShadow: "0 14px 24px -6px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.14)",
                }}
              />
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="font-['Inter'] mt-2 text-[11px] uppercase tracking-[0.28em] text-slate-300/70 transition-colors duration-500 hover:text-white/90"
        >
          ← Back
        </Link>
      </section>
  <footer className="fixed bottom-4 left-0 right-0 z-10 flex items-end justify-center gap-6 pointer-events-none">
        <img src="/HeronEdit.png" alt="Heron by Martin" className="h-16 md:h-20 opacity-65 drop-shadow" />
        <img src="/Hugh.png" alt="Hugh" className="h-22 md:h-30 opacity-65 drop-shadow" />
        <img src="/LittleBat.png" alt="Little bat" className="h-16 md:h-20 opacity-65 drop-shadow" />
      </footer>
      
    </main>
  );
}