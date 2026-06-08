"use client";

import { useCart } from "@/hooks/useCart";
import { formatStorefrontPrice } from "@/lib/storefront/format";

export function CheckoutSummary() {
  const { items, subtotal, currency } = useCart();

  const formattedSubtotal = formatStorefrontPrice({ amount: subtotal, currency });

  return (
    <aside className="border border-ethra-stone/20 bg-ethra-cream/40 p-6">
      <h2 className="font-display text-[11px] uppercase tracking-luxury text-ethra-charcoal">
        Resumen
      </h2>
      <div className="gold-line my-4 w-full" aria-hidden />
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variantId ?? "base"}`} className="flex justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-display text-sm text-ethra-black">{item.name}</p>
              <p className="font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
                Cant. {item.quantity}
              </p>
            </div>
            <span className="shrink-0 font-display text-sm text-ethra-black">
              {formatStorefrontPrice({
                amount: item.price.amount * item.quantity,
                currency: item.price.currency,
              })}
            </span>
          </li>
        ))}
      </ul>
      <div className="gold-line my-5 w-full" aria-hidden />
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
          Total
        </span>
        <span className="font-display text-base font-medium text-ethra-black">
          {formattedSubtotal}
        </span>
      </div>
    </aside>
  );
}
