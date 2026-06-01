import type { Metadata } from "next";
import { ETHRA_BRAND } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ethra Sport — Pureza en Movimiento",
  description:
    "Ethra Sport: ropa deportiva de quiet luxury. Diseño minimalista, alto rendimiento y materiales nobles para el movimiento esencial.",
  icons: {
    icon: ETHRA_BRAND.logoUrl,
    apple: ETHRA_BRAND.logoUrl,
  },
  openGraph: {
    title: "Ethra Sport — Pureza en Movimiento",
    description: "Colección esencial de ropa deportiva de lujo silencioso.",
    type: "website",
    images: [
      {
        url: ETHRA_BRAND.logoUrl,
        width: 512,
        height: 512,
        alt: ETHRA_BRAND.logoAlt,
      },
    ],
  },
  twitter: {
    card: "summary",
    images: [ETHRA_BRAND.logoUrl],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@300;400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
