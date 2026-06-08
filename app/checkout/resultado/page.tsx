import { Suspense } from "react";
import { Navbar } from "@/components/ethra/Navbar";
import { Footer } from "@/components/ethra/Footer";
import { CheckoutResultView } from "@/components/ethra/CheckoutResultView";

export const dynamic = "force-dynamic";

export default function CheckoutResultPage() {
  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <p className="py-24 text-center font-display text-sm text-ethra-stone">
              Cargando resultado…
            </p>
          }
        >
          <CheckoutResultView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
