"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ethra/ProductCard";
import type {
  StorefrontCategory,
  StorefrontPagination,
  StorefrontProduct,
} from "@/lib/storefront/types";

interface Props {
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
  pagination: StorefrontPagination | null;
  page: number;
  categoryId?: string;
  q: string;
}

export function CatalogoContent({
  categories,
  products,
  pagination,
  page,
  categoryId,
  q,
}: Props) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(q);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("q", searchInput.trim());
    router.push(`/catalogo?${params}`);
  };

  const navigatePage = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`/catalogo?${params}`);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">
      <h1 className="font-serif text-4xl md:text-5xl text-ethra-black mb-10">Catálogo</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ethra-stone" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2.5 border border-ethra-stone/30 bg-transparent text-sm placeholder:text-ethra-stone/60 focus:outline-none focus:border-ethra-black"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 border border-ethra-black text-xs font-display tracking-wider uppercase hover:bg-ethra-black hover:text-ethra-bone transition-colors"
        >
          Buscar
        </button>
      </form>

      {!q && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/catalogo"
            className={`px-4 py-2 text-xs font-display tracking-wider uppercase border transition-colors ${!categoryId ? "bg-ethra-black text-ethra-bone border-ethra-black" : "border-ethra-stone/30 text-ethra-charcoal hover:border-ethra-black"}`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoryId=${cat.id}`}
              className={`px-4 py-2 text-xs font-display tracking-wider uppercase border transition-colors ${categoryId === cat.id ? "bg-ethra-black text-ethra-bone border-ethra-black" : "border-ethra-stone/30 text-ethra-charcoal hover:border-ethra-black"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-ethra-stone text-sm py-20 text-center">No se encontraron productos.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-14">
              {pagination.hasPrev && (
                <button
                  onClick={() => navigatePage(page - 1)}
                  className="px-4 py-2 border border-ethra-stone/30 text-xs font-display tracking-wider uppercase hover:border-ethra-black transition-colors"
                >
                  Anterior
                </button>
              )}
              <span className="px-4 py-2 text-xs font-display tracking-wider text-ethra-stone">
                {pagination.page} / {pagination.totalPages}
              </span>
              {pagination.hasNext && (
                <button
                  onClick={() => navigatePage(page + 1)}
                  className="px-4 py-2 border border-ethra-stone/30 text-xs font-display tracking-wider uppercase hover:border-ethra-black transition-colors"
                >
                  Siguiente
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
