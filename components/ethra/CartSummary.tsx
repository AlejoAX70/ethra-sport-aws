"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { formatStorefrontPrice } from "@/lib/storefront/format";

interface CartSummaryProps {
  onEmptied?: () => void;
}

export function CartSummary({ onEmptied }: CartSummaryProps) {
  const { items, subtotal, currency, clearCart, restoreItems } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!confirmClear) return;
    const timer = window.setTimeout(() => setConfirmClear(false), 5000);
    return () => window.clearTimeout(timer);
  }, [confirmClear]);

  const formattedSubtotal = formatStorefrontPrice({
    amount: subtotal,
    currency,
  });

  const handleConfirmClear = () => {
    const previousItems = [...items];
    clearCart();
    setConfirmClear(false);
    onEmptied?.();
    toast("Bolsa vaciada", {
      duration: 6000,
      action: {
        label: "Deshacer",
        onClick: () => restoreItems(previousItems),
      },
    });
  };

  return (
    <footer className="shrink-0 border-t border-transparent px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="gold-line mb-5 w-full" aria-hidden />

      <div className="flex items-baseline justify-between">
        <span className="font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
          SUBTOTAL
        </span>
        <span className="cart-subtotal-fade font-display text-base font-medium text-ethra-black">
          {formattedSubtotal}
        </span>
      </div>
      <p className="mt-1 font-display text-[10px] text-ethra-stone">
        Envío y tasas calculados al pagar
      </p>

      <button
        type="button"
        disabled
        title="Disponible próximamente"
        className="mt-5 w-full cursor-not-allowed bg-ethra-black px-6 py-4 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-bone"
      >
        PROCEDER AL PAGO
      </button>

      {confirmClear ? (
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={handleConfirmClear}
            aria-label="Confirmar, vaciar toda la bolsa"
            className="flex-1 border border-ethra-black py-3 font-display text-[10px] uppercase tracking-luxury text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
          >
            CONFIRMAR
          </button>
          <button
            type="button"
            onClick={() => setConfirmClear(false)}
            aria-label="Cancelar"
            className="flex-1 border border-ethra-stone/40 py-3 font-display text-[10px] uppercase tracking-luxury text-ethra-stone transition-colors hover:border-ethra-black hover:text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
          >
            CANCELAR
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          aria-label="Vaciar toda la bolsa"
          className="mt-3 w-full border border-ethra-stone/40 py-3 font-display text-[10px] uppercase tracking-luxury text-ethra-stone transition-colors hover:border-ethra-black hover:text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
        >
          VACIAR BOLSA
        </button>
      )}
    </footer>
  );
}
