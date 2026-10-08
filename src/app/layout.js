import "./globals.css";

export const metadata = {
  title: "🖤 OUR GOLDEN HUGH 🖤",
  description:
    "Time unfurls its wings; the spiral reverses, not to repeat, but to deepen.",
  icons: {
    icon: "/Hugh.png",
  },
  openGraph: {
    title: "🖤 Our Second Hugh 🖤",
    description:
      "Time unfurls its wings; the spiral reverses, not to repeat, but to deepen.",
    url: "https://ourfirsthugh.lol",
    siteName: "Our Golden Hugh",
    images: [
      {
        url: "/Hugh.png",
        width: 800,
        height: 600,
        alt: "Hugh",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🖤 Our Golden Hugh 🖤",
    description:
      "Time unfurls its wings; the spiral reverses, not to repeat, but to deepen.",
    images: ["/Hugh.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Inter:wght@400;600&family=Playfair+Display:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/Hugh.png" type="image/png" />

        {/* Manual fallback meta tags for platforms that don’t use Next metadata */}
        <meta property="og:title" content="🖤 Our Golden Hugh 🖤" />
        <meta
          property="og:description"
          content="Time unfurls its wings; the spiral reverses, not to repeat, but to deepen."
        />
        <meta property="og:image" content="/Hugh.png" />
        <meta property="og:url" content="https://ourfirsthugh.lol" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <body className="bg-black text-slate-100 font-[Inter] min-h-screen">
        {children}
      </body>
    </html>
  );
}
