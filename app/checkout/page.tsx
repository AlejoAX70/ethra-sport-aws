import { Navbar } from "@/components/ethra/Navbar";
import { Footer } from "@/components/ethra/Footer";
import { CheckoutView } from "@/components/ethra/CheckoutView";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main>
        <CheckoutView />
      </main>
      <Footer />
    </div>
  );
}
