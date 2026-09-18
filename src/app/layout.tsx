import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Playfair_Display, Cinzel, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nike & Ann — Wedding Invitation",
  description: "A brighter chapter together. Join us to celebrate the wedding of Nike and Ann on Sunday, 15 November 2026 in Thrissur, Kerala.",
  authors: [{ name: "Nike & Ann" }],
  openGraph: {
    title: "Nike & Ann — Wedding Invitation",
    description: "A brighter chapter together. Sunday, 15 November 2026 · Thrissur, Kerala",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0d0104",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${montserrat.variable} ${cinzel.variable} ${pinyon.variable}`}
    >
      <body className="bg-burgundy-950 text-gold-100 min-h-[100svh] overflow-x-hidden font-serif select-none antialiased">
        {children}
      </body>
    </html>
  );
}
