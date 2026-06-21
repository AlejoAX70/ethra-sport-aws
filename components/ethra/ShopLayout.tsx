import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface ShopLayoutProps {
  children: React.ReactNode;
  /** When false the main element has no top padding — use on pages with full-bleed dark hero sections */
  padTop?: boolean;
}

export function ShopLayout({ children, padTop = true }: ShopLayoutProps) {
  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main className={padTop ? "pt-20" : ""}>{children}</main>
      <Footer />
    </div>
  );
}
