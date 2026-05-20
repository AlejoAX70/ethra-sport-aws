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

function GridColumnIcon({ columns, active }: { columns: CatalogGridColumns; active: boolean }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {Array.from({ length: columns }).map((_, index) => (
        <span
          key={index}
          className={`w-1 rounded-sm ${active ? "bg-ethra-black" : "bg-ethra-stone/50"}`}
          style={{ height: `${10 + index * 2}px` }}
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
    <div className="flex flex-col gap-4 border-b border-ethra-stone/20 px-6 py-4 md:flex-row md:items-center md:justify-end md:gap-8 md:px-10">
      {typeof total === "number" ? (
        <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone md:mr-auto">
          {total} productos
        </p>
      ) : (
        <span className="md:mr-auto" />
      )}

      <div className="flex flex-wrap items-center gap-5 md:gap-8">
        <Select value={sort} onValueChange={(value) => onSortChange(value as CatalogSortOption)}>
          <SelectTrigger className="h-auto w-auto gap-2 border-0 bg-transparent p-0 font-display text-[11px] tracking-[0.12em] uppercase text-ethra-charcoal shadow-none focus:ring-0">
            <SelectValue placeholder="Ordenar" />
            <ChevronDown className="h-3.5 w-3.5 text-ethra-stone" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-none border-ethra-stone/20">
            {(Object.keys(sortLabels) as CatalogSortOption[]).map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="rounded-none font-display text-[11px] tracking-[0.12em] uppercase"
              >
                {sortLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          className="font-display text-[11px] tracking-[0.12em] uppercase text-ethra-charcoal transition-colors hover:text-ethra-black"
        >
          Filtrar
        </button>

        <div className="flex items-center gap-3">
          {([2, 3, 4] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-label={`Ver ${option} columnas`}
              aria-pressed={columns === option}
              onClick={() => onColumnsChange(option)}
              className="p-1 transition-opacity hover:opacity-100"
            >
              <GridColumnIcon columns={option} active={columns === option} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
