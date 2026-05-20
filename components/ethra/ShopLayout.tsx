import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
