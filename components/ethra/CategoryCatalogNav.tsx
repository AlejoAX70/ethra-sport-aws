import Link from "next/link";
import type { CategoryNavItem } from "@/lib/storefront/format";

interface CategoryCatalogNavProps {
  items: CategoryNavItem[];
  activeId: string;
}

export function CategoryCatalogNav({ items, activeId }: CategoryCatalogNavProps) {
  if (items.length === 0) return null;

  return (
    <nav className="border-b border-ethra-stone/15 bg-ethra-bone">
      <ul className="flex gap-8 overflow-x-auto px-6 py-5 md:gap-12 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id} className="shrink-0 relative pb-1">
              <Link
                href={`/colecciones/${item.id}`}
                className={`font-display text-[10px] tracking-luxury uppercase whitespace-nowrap transition-colors duration-300 block ${
                  isActive
                    ? "text-ethra-black"
                    : "text-ethra-stone hover:text-ethra-charcoal"
                }`}
              >
                {item.name}
              </Link>

              {/* Gold underline for active item */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "oklch(0.66 0.105 80 / 0.65)" }}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
