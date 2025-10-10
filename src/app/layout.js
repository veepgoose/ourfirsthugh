import "./globals.css";

export const metadata = { title: "ourfirsthugh" };

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
<link rel="icon" href="/HeronEdit.png" type="image/png" />


      </head>
     <body className="bg-black text-slate-100 font-[Inter] min-h-screen">{children}</body>

    </html>
  );
}
