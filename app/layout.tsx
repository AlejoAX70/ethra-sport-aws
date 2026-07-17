import type { Metadata } from "next";
import { ETHRA_BRAND } from "@/lib/brand";
import { getCmsConfig } from "@/lib/cms/api";
import { CartProvider } from "@/store/cart";
import { BannerVisibilityProvider } from "@/store/banner-visibility";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SiteBanners } from "@/components/ethra/SiteBanners";
import { EthraToaster } from "@/components/ethra/EthraToaster";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const cmsConfig = await getCmsConfig().catch(() => null);
  const title = cmsConfig?.default_meta_title ?? "Ethra Sport — Pureza en Movimiento";
  const description =
    cmsConfig?.default_meta_description ??
    "Ethra Sport: ropa deportiva de quiet luxury. Diseño minimalista, alto rendimiento y materiales nobles para el movimiento esencial.";
  const logoUrl = cmsConfig?.logo_url ?? ETHRA_BRAND.logoUrl;

  return {
    title,
    description,
    icons: {
      icon: cmsConfig?.favicon_url ?? logoUrl,
      apple: cmsConfig?.favicon_url ?? logoUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: logoUrl ? [{ url: logoUrl, width: 512, height: 512, alt: ETHRA_BRAND.logoAlt }] : undefined,
    },
    twitter: {
      card: "summary",
      images: logoUrl ? [logoUrl] : undefined,
    },
  };
}

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
        <QueryProvider>
          <BannerVisibilityProvider>
            <SiteBanners />
            <CartProvider>
              {children}
              <EthraToaster />
            </CartProvider>
          </BannerVisibilityProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
