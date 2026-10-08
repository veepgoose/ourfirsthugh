import GoldenBook from "../../components/GoldenBook";

export const metadata = {
  title: "🖤 Our Golden Hugh 🖤",
  description: "A very short poem, in ten pages.",
};

export default function GoldenPage() {
  return (
    <main
      className="smoke-layer relative min-h-screen overflow-hidden"
      style={{ "--smoke-opacity": 0.18, "--text-alpha": 0.94 }}
    >
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center text-soft">
        <div className="fade-in-up fade-in-delay-2">
          <GoldenBook />
        </div>
      </section>
    </main>
  );
}