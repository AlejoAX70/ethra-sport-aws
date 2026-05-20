"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ethra/ProductCard";
import { StorefrontError } from "@/components/ethra/StorefrontError";
import type { StorefrontProduct, StorefrontCategory, StorefrontPagination } from "@/lib/storefront/types";

export function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const categoryId = searchParams.get("categoryId") || undefined;
  const q = searchParams.get("q") || "";

  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [pagination, setPagination] = useState<StorefrontPagination | null>(null);
  const [categories, setCategories] = useState<StorefrontCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const catRes = await fetch("/api/storefront/categories").then((r) => r.json());
        setCategories(catRes.categories || []);

        let url: string;
        if (q.trim()) {
          url = `/api/storefront/catalog/search?q=${encodeURIComponent(q)}&limit=20`;
        } else {
          const params = new URLSearchParams({ page: String(page), limit: "20" });
          if (categoryId) params.set("categoryId", categoryId);
          url = `/api/storefront/catalog?${params}`;
        }

        const res = await fetch(url).then((r) => r.json());
        setProducts(res.products || []);
        setPagination(res.pagination || null);
      } catch {
        setError("No pudimos cargar el catálogo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, categoryId, q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("q", searchInput.trim());
    router.push(`/catalogo?${params}`);
  };

  const navigatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
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
        <button type="submit" className="px-4 py-2.5 border border-ethra-black text-xs font-display tracking-wider uppercase hover:bg-ethra-black hover:text-ethra-bone transition-colors">
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

      {error && <StorefrontError message={error} />}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-[4/5] bg-ethra-cream" />
              <div className="h-4 w-2/3 bg-ethra-cream rounded" />
              <div className="h-3 w-1/3 bg-ethra-cream rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
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
                <button onClick={() => navigatePage(page - 1)} className="px-4 py-2 border border-ethra-stone/30 text-xs font-display tracking-wider uppercase hover:border-ethra-black transition-colors">
                  Anterior
                </button>
              )}
              <span className="px-4 py-2 text-xs font-display tracking-wider text-ethra-stone">
                {pagination.page} / {pagination.totalPages}
              </span>
              {pagination.hasNext && (
                <button onClick={() => navigatePage(page + 1)} className="px-4 py-2 border border-ethra-stone/30 text-xs font-display tracking-wider uppercase hover:border-ethra-black transition-colors">
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
