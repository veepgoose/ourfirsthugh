// src/app/megalomaniacs/page.js
import Link from "next/link";

export const metadata = { title: "Megalomaniacs of Truth" };

export default function MegalomaniacsPage() {
  const lines = [
    "I can’t wait to fuck you.",
    "I dream of fucking you slowly, deeply; I can feel your cock within me now, just thinking about you.",
    "I move so slowly that I can feel every micro movement, each bringing its own pulsation of intensity.",
    "My pussy grips you, desperately, want becoming need, need becoming want.",
    "Neither of us leads nor follows; we move as one being, transcending time, beyond pleasure, outrunning existence itself,",
    "flowing through dimensions at a speed that is neither fast nor slow, only now.",
    "Now, in this moment, I can feel you; no longer within me, and I no longer holding you,",
    "as we move together with no beginning, no end, melting into each other.",
    "No longer riding these waves of pleasure, we consume them, we command their flow,",
    "as the gods once commanded the flow of existence itself. Where we flow, the gods have no power.",
    "Here, it is only us, only the intensity of our creation. No gods, no laws to abide by,",
    "only us, the co-creators of ecstasy.",
    "I feel the electrifying cold shuddering down my spine as I fight to stop my eyes from rolling,",
    "fighting to hold your gaze, the endless refraction of your pleasure mirrored in my own, and back again, and again, and again.",
    "I cannot blink for fear of diminishing this bliss, this bliss that both destroys and rebuilds me in a new form all at once,",
    "a form that both carries and is carried by you.",
    "As I surrender to the feel of you moving imperceptibly slowly inside me, so slowly that every micro movement unleashes wave after wave of devotion,",
    "devotion that drips from me, flooding your cock as I feel you harden, and the waves only intensify, and intensify, and intensify until you beg me to stop.",
    "I will not stop this time. I’m no longer present, for I have crossed the threshold into a state that is boundless, and this time, you’re coming with me.",
    "A place beyond this earthly pleasure, a place that only our soul-felt ecstasy can inhabit.",
    "A place where nothing else exists, only this. This forever, as if nothing else had ever breathed itself into being,",
    "not even this moment, as this moment is already gone, transmuting into something even more magnificently holy than it was before.",
    "Now the reflections of pleasure refracted in our eyes are only light, a blinding light that consumes our entire as-one being.",
    "Not two souls merging, but a new soul born of this moment. It is ours, it is bliss, it is both within and without us.",
    "Don’t stop. Don’t ever stop.",
    "And know this: I feel no guilt, no shame; all repression melts away.",
    "I feel power, sovereignty, delighting in this moment, basking in the afterglow of our transcendence,",
    "where we were reborn as megalomaniacs of Truth. There is a wildness unleashed within me,",
    "and when I return to meet your gaze once again, I can see that you feel it too.",
  ];

  return (
    <main
      className="smoke-layer relative min-h-screen overflow-hidden"
      style={{ "--smoke-opacity": 0.2, "--text-alpha": 0.94 }}
    >
      {/* soft veil that “breathes” */}
      <div className="pointer-events-none absolute inset-0 z-0 poem-veil" />

      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-24 text-soft">
        {/* Title + tagline */}
        <header className="text-center mb-10 md:mb-12">
          <h1
            className="font-['Cinzel'] goth-glow text-white/70 leading-tight
                       text-[8.5vw] sm:text-5xl md:text-6xl fade-in-up"
          >
            THE INFINITE UNFOLDING
          </h1>
          <p className="mt-3 italic text-slate-300/80 text-xs md:text-sm tracking-[0.28em] fade-in-delayed">
            where desire becomes devotion, and devotion becomes truth
          </p>
        </header>

        {/* Poem container with unfurling mask + breathing */}
        <article className="unfurl-mask breath text-lg md:text-xl leading-relaxed italic">
          {lines.map((t, i) => (
            <p
              key={i}
              className="line-reveal"
              style={{ "--i": i }}
              // keep colour subtle; key phrases can be highlighted with <em> if you like
            >
              {t}
            </p>
          ))}
        </article>

        {/* Portal back to countdown */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="group relative inline-block glow-fade glow-delay-1 pt-10"
            aria-label="Return to the portal"
          >
            {/* chaotic arrow (desktop only; mobile hidden via your .chaotic-arrow rule if you like) */}
            <span
              className="chaotic-arrow absolute -top-7 left-1/2 -translate-x-1/2 z-20
                         text-[hsl(var(--hugh))] text-3xl glow-fade glow-delay-2"
              aria-hidden="true"
            >
              <span className="inline-block float-rebel">↷</span>
            </span>

            <span
              className="relative btn-shimmer block rounded-full border border-white/10
                         bg-black/40 px-5 py-3 text-slate-300 backdrop-blur-sm
                         shadow-[0_6px_30px_rgba(0,0,0,.35)]
                         hover:text-white hover:border-white/20 hover:bg-black/60
                         transition-all duration-500"
            >
              <span className="block leading-tight text-center">
                <strong>Return to the portal</strong>
              </span>
              {/* shimmer sweep */}
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--hugh)/0.25)] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[2200ms] ease-out" />
              </span>
            </span>
          </Link>
        </div>
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
