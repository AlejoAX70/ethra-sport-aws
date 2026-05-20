import Link from "next/link";
import type { CategoryNavItem } from "@/lib/storefront/format";

interface CategoryCatalogNavProps {
  items: CategoryNavItem[];
  activeId: string;
}

export function CategoryCatalogNav({ items, activeId }: CategoryCatalogNavProps) {
  if (items.length === 0) return null;

  return (
    <nav className="border-b border-ethra-stone/20">
      <ul className="flex gap-6 overflow-x-auto px-6 py-4 md:gap-10 md:px-10 md:py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id} className="shrink-0">
              <Link
                href={`/colecciones/${item.id}`}
                className={`font-display text-[11px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-ethra-black"
                    : "text-ethra-stone hover:text-ethra-charcoal"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
