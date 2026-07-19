"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentIntentAction } from "@/lib/storefront/actions";
import type { CreateIntentResponse } from "@/lib/storefront/types";
import type { CartItem } from "@/store/cart";

export type CheckoutPhase =
  | "idle"
  | "creating_intent"
  | "widget_open"
  | "processing"
  | "approved"
  | "declined"
  | "error";

export interface GuestCheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export function useCheckout(items: CartItem[]) {
  const router = useRouter();
  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<CreateIntentResponse | null>(null);
  const [lineErrors, setLineErrors] = useState<string[]>([]);

  const submit = useCallback(
    async (customer: GuestCheckoutForm) => {
      if (phase === "creating_intent" || phase === "widget_open") return;

      setError(null);
      setLineErrors([]);
      setPhase("creating_intent");

      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? undefined,
          quantity: item.quantity,
        })),
        customer,
      };

      const result = await createPaymentIntentAction(payload);

      if (!result.ok) {
        if (result.status === 409) {
          setError("Pagos no disponibles para esta tienda.");
        } else if (result.status === 422) {
          const data = result.data as { lines?: string[]; message?: string } | undefined;
          setLineErrors(data?.lines ?? []);
          setError(data?.message ?? "Algunos productos cambiaron. Revisa tu bolsa.");
        } else if (result.status === 400) {
          setError(result.message || "Error en los datos enviados. Verifica los campos e intenta de nuevo.");
        } else {
          setError(result.message);
        }
        setPhase("error");
        return null;
      }

      setIntent(result.data);
      setPhase("widget_open");
      return result.data;
    },
    [items, phase],
  );

  const onWidgetClosed = useCallback(
    (reference: string) => {
      setPhase("processing");
      router.push(`/checkout/resultado?reference=${encodeURIComponent(reference)}`);
    },
    [router],
  );

  const reset = useCallback(() => {
    setPhase("idle");
    setError(null);
    setIntent(null);
    setLineErrors([]);
  }, []);

  return {
    phase,
    error,
    intent,
    lineErrors,
    submit,
    onWidgetClosed,
    reset,
    isSubmitting: phase === "creating_intent" || phase === "widget_open",
  };
}
