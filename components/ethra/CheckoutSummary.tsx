"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { toCdnImageUrl } from "@/lib/cdn";
import { formatStorefrontPrice } from "@/lib/storefront/format";

interface CheckoutSummaryProps {
  className?: string;
  showEditLink?: boolean;
}

export function CheckoutSummary({ className = "", showEditLink = true }: CheckoutSummaryProps) {
  const { items, subtotal, currency, itemCount } = useCart();

  const formattedSubtotal = formatStorefrontPrice({ amount: subtotal, currency });

  return (
    <aside
      className={`border border-ethra-stone/15 bg-ethra-cream/50 p-6 lg:sticky lg:top-[calc(6rem+var(--ethra-banner-offset,0px))] lg:self-start ${className}`}
    >
      <h2 className="font-display text-[11px] uppercase tracking-luxury text-ethra-charcoal">
        Tu bolsa ({itemCount} {itemCount === 1 ? "artículo" : "artículos"})
      </h2>
      <div className="gold-line my-4 w-full" aria-hidden />
      <ul className="space-y-4">
        {items.map((item) => {
          const variantParts = [
            item.selectedSize?.label ? `Talla: ${item.selectedSize.label}` : "",
            item.selectedColor?.name ?? "",
          ].filter(Boolean);

          return (
            <li
              key={`${item.productId}-${item.variantId ?? "base"}`}
              className="flex gap-3"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-ethra-cream">
                {item.imageUrl ? (
                  <Image
                    src={toCdnImageUrl(item.imageUrl)}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-ethra-stone/10" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-display text-sm text-ethra-black">{item.name}</p>
                  <span className="shrink-0 font-display text-sm text-ethra-black">
                    {formatStorefrontPrice({
                      amount: item.price.amount * item.quantity,
                      currency: item.price.currency,
                    })}
                  </span>
                </div>
                {variantParts.length > 0 && (
                  <p className="mt-0.5 flex items-center gap-1.5 font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
                    {variantParts.join(" · ")}
                    {item.selectedColor?.hex && (
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full border border-ethra-stone/20"
                        style={{ backgroundColor: item.selectedColor.hex }}
                        aria-hidden
                      />
                    )}
                  </p>
                )}
                <p className="mt-0.5 font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
                  Cant: {item.quantity}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="gold-line my-5 w-full" aria-hidden />
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
            Subtotal
          </span>
          <span className="font-display text-sm text-ethra-black">{formattedSubtotal}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
            Envío
          </span>
          <span className="font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
            Por confirmar
          </span>
        </div>
      </div>
      <div className="gold-line my-5 w-full" aria-hidden />
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
          Total
        </span>
        <span className="font-display text-base font-medium text-ethra-black">
          {formattedSubtotal}
        </span>
      </div>
      {showEditLink && (
        <Link
          href="/catalogo"
          className="mt-5 inline-block font-display text-[10px] uppercase tracking-luxury text-ethra-stone underline-offset-2 hover:underline"
        >
          Editar bolsa
        </Link>
      )}
      <p className="mt-4 flex items-center gap-1.5 font-display text-[10px] uppercase tracking-luxury text-ethra-stone/60">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-3 w-3 shrink-0"
          aria-hidden
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Pago seguro encriptado por Wompi
      </p>
    </aside>
  );
}
