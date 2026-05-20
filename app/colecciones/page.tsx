import Link from "next/link";
import { Navbar } from "@/components/ethra/Navbar";
import { Footer } from "@/components/ethra/Footer";
import { getCategories } from "@/lib/storefront/api";

export const metadata = {
  title: "Colecciones — Ethra Sport",
  description: "Explora las colecciones de ropa deportiva de lujo silencioso de Ethra Sport.",
};

export default async function ColeccionesPage() {
  const { categories } = await getCategories().catch(() => ({ categories: [] }));

  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h1 className="font-serif text-4xl md:text-5xl text-ethra-black mb-14">Colecciones</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/colecciones/${cat.id}`}
                className="group relative block aspect-[4/5] overflow-hidden"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-serif text-3xl md:text-4xl text-ethra-bone">{cat.name}</h3>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-display text-[10px] tracking-luxury uppercase text-ethra-bone/90">Ver colección</span>
                    <span className="h-px w-8 bg-ethra-gold-light transition-all duration-500 group-hover:w-14" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
