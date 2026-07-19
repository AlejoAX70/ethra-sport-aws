"use client";

import { useEffect, useRef, useState } from "react";
import type { CreateIntentResponse } from "@/lib/storefront/types";

declare global {
  interface Window {
    WidgetCheckout?: new (config: Record<string, unknown>) => {
      open: (callback: (result: { transaction?: { status?: string } }) => void) => void;
    };
  }
}

const WOMPI_WIDGET_URL = "https://checkout.wompi.co/widget.js";
const WOMPI_ORIGIN = "https://checkout.wompi.co";

// El widget de Wompi solo invoca el callback de `checkout.open()` cuando hay
// una transacción (o tokenización) real. Si el usuario cierra el widget sin
// pagar (Esc, "volver al comercio", etc.), notifica por postMessage con uno
// de estos `event` — y nunca llama al callback — dejando la app esperando
// para siempre si no los escuchamos por nuestra cuenta.
const WOMPI_ABANDON_EVENTS = new Set([
  "escpressed",
  "merchantreturnclicked",
  "merchantcontinueclicked",
]);

interface WompiWidgetLauncherProps {
  intent: CreateIntentResponse;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  onComplete: (reference: string) => void;
  onError: (message: string) => void;
  onReady?: () => void;
}

function loadWompiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No browser"));
  if (window.WidgetCheckout) return Promise.resolve();

  const existing = document.querySelector(`script[src="${WOMPI_WIDGET_URL}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Wompi")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WOMPI_WIDGET_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el widget de pago"));
    document.body.appendChild(script);
  });
}

export function WompiWidgetLauncher({
  intent,
  customer,
  onComplete,
  onError,
  onReady,
}: WompiWidgetLauncherProps) {
  const launched = useRef(false);
  const [loading, setLoading] = useState(true);
  const settledRef = useRef(false);

  useEffect(() => {
    if (launched.current) return;
    launched.current = true;

    let cancelled = false;

    (async () => {
      try {
        await loadWompiScript();
        if (cancelled || !window.WidgetCheckout) {
          throw new Error("Widget de Wompi no disponible");
        }

        if (!intent.publicKey) {
          throw new Error(
            "Llave pública de Wompi no configurada. Contacta al administrador de la tienda.",
          );
        }

        const checkout = new window.WidgetCheckout({
          currency: intent.currency,
          amountInCents: intent.amountInCents,
          reference: intent.reference,
          publicKey: intent.publicKey,
          signature: { integrity: intent.signature },
          redirectUrl: intent.redirectUrl,
          ...(intent.expirationTime ? { expirationTime: intent.expirationTime } : {}),
          customerData: {
            email: customer.email,
            fullName: customer.fullName,
            phoneNumber: customer.phone,
            phoneNumberPrefix: "+57",
          },
        });

        setLoading(false);
        onReady?.();
        checkout.open(() => {
          settledRef.current = true;
          onComplete(intent.reference);
        });
      } catch (err) {
        if (!cancelled) {
          settledRef.current = true;
          onError((err as Error)?.message ?? "Error al abrir el widget de pago");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [intent, customer, onComplete, onError, onReady]);

  useEffect(() => {
    function handleWompiMessage(event: MessageEvent) {
      if (event.origin !== WOMPI_ORIGIN) return;
      if (settledRef.current) return;

      const type = (event.data as { event?: string } | null | undefined)?.event;
      if (type && WOMPI_ABANDON_EVENTS.has(type)) {
        settledRef.current = true;
        onError("Cerraste la ventana de pago antes de completarlo. Puedes intentarlo de nuevo.");
      }
    }

    window.addEventListener("message", handleWompiMessage);
    return () => window.removeEventListener("message", handleWompiMessage);
  }, [onError]);

  if (loading) {
    return null;
  }

  return null;
}
