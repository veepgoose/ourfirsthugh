// src/app/megalomaniacs/page.js
import Link from "next/link";
import MegalomaniacsBook from "../../components/MegalomaniacsBook";

export const metadata = { title: "Megalomaniacs of Truth" };

export default function MegalomaniacsPage() {
  return (
    <main
      className="smoke-layer relative min-h-screen overflow-hidden"
      style={{ "--smoke-opacity": 0.2, "--text-alpha": 0.94 }}
    >
      {/* soft breathing veil */}
      <div className="pointer-events-none absolute inset-0 z-0 poem-veil" />

      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-40 md:pt-24 flex flex-col items-center text-soft">
        {/* Title + tagline */}
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-['Cinzel'] goth-glow text-white/70 leading-tight text-[8.5vw] sm:text-5xl md:text-6xl fade-in-up">
            THE INFINITE UNFOLDING
          </h1>
          <p className="mt-3 italic text-slate-300/80 text-xs md:text-sm tracking-[0.28em] fade-in-delayed">
            where desire becomes devotion, and devotion becomes truth
          </p>
        </header>

        {/* the poem, as a book */}
        <div className="fade-in-up fade-in-delay-2">
          <MegalomaniacsBook />
        </div>

        <Link
          href="/"
          className="font-['Inter'] mt-10 text-[11px] uppercase tracking-[0.28em] text-slate-300/70 transition-colors duration-500 hover:text-white/90"
        >
          ← Back
        </Link>
      </section>

      {/* familiars */}
      <footer className="fixed bottom-4 left-0 right-0 z-10 flex items-end justify-center gap-6 pointer-events-none">
        <img
          src="/HeronEdit.png"
          alt="Heron by Martin"
          className="h-16 md:h-20 opacity-65 drop-shadow"
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