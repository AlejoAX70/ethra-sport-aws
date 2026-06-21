"use client";

import { ChevronDown } from "lucide-react";
import type { CatalogSortOption } from "@/lib/storefront/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CatalogGridColumns = 2 | 3 | 4;

interface CategoryCatalogToolbarProps {
  sort: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
  columns: CatalogGridColumns;
  onColumnsChange: (columns: CatalogGridColumns) => void;
  total?: number;
}

const sortLabels: Record<CatalogSortOption, string> = {
  newest: "Fecha de release",
  "name-asc": "Nombre A-Z",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
};

function GridColumnIcon({
  columns,
  active,
}: {
  columns: CatalogGridColumns;
  active: boolean;
}) {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {Array.from({ length: columns }).map((_, index) => (
        <span
          key={index}
          className="w-[3px] rounded-none transition-colors duration-200"
          style={{
            height: `${8 + index * 3}px`,
            backgroundColor: active
              ? "oklch(0.66 0.105 80)"
              : "oklch(0.665 0.008 80 / 0.45)",
          }}
        />
      ))}
    </span>
  );
}

export function CategoryCatalogToolbar({
  sort,
  onSortChange,
  columns,
  onColumnsChange,
  total,
}: CategoryCatalogToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-ethra-stone/15 px-6 py-4 md:flex-row md:items-center md:justify-end md:gap-8 md:px-10 bg-ethra-bone">
      {/* Product count */}
      {typeof total === "number" ? (
        <p className="font-display text-[9px] tracking-luxury uppercase text-ethra-stone md:mr-auto">
          {total} piezas
        </p>
      ) : (
        <span className="md:mr-auto" />
      )}

      <div className="flex flex-wrap items-center gap-5 md:gap-8">
        {/* Sort select */}
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as CatalogSortOption)}
        >
          <SelectTrigger className="h-auto w-auto gap-2 border-0 bg-transparent p-0 font-display text-[10px] tracking-luxury uppercase text-ethra-charcoal shadow-none focus:ring-0 hover:text-ethra-black transition-colors duration-200">
            <SelectValue placeholder="Ordenar" />
            <ChevronDown className="h-3 w-3 text-ethra-stone/60" />
          </SelectTrigger>
          <SelectContent
            align="end"
            className="rounded-none border-ethra-stone/20 bg-ethra-bone shadow-md"
          >
            {(Object.keys(sortLabels) as CatalogSortOption[]).map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="rounded-none font-display text-[10px] tracking-luxury uppercase cursor-pointer"
              >
                {sortLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Column selector */}
        <div className="flex items-center gap-3">
          {([2, 3, 4] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-label={`Ver ${option} columnas`}
              aria-pressed={columns === option}
              onClick={() => onColumnsChange(option)}
              className="p-1 transition-opacity hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <GridColumnIcon columns={option} active={columns === option} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
