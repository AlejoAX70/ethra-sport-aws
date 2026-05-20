import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ethra Sport — Pureza en Movimiento",
  description:
    "Ethra Sport: ropa deportiva de quiet luxury. Diseño minimalista, alto rendimiento y materiales nobles para el movimiento esencial.",
  openGraph: {
    title: "Ethra Sport — Pureza en Movimiento",
    description: "Colección esencial de ropa deportiva de lujo silencioso.",
    type: "website",
  },
  twitter: {
    card: "summary",
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
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
