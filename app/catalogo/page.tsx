import { Suspense } from "react";
import { ShopLayout } from "@/components/ethra/ShopLayout";
import { CatalogoContent } from "./CatalogoContent";

export const metadata = {
  title: "Catálogo — Ethra Sport",
  description: "Explora el catálogo completo de Ethra Sport.",
};

export default function CatalogoPage() {
  return (
    <ShopLayout>
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">
            <div className="h-12 w-48 bg-ethra-cream rounded animate-pulse mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <div className="aspect-[4/5] bg-ethra-cream" />
                  <div className="h-4 w-2/3 bg-ethra-cream rounded" />
                  <div className="h-3 w-1/3 bg-ethra-cream rounded" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <CatalogoContent />
      </Suspense>
    </ShopLayout>
  );
}
