"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";
import { paymentStatusQueryOptions } from "@/lib/storefront/queries";

export function CheckoutResultView() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ??
    searchParams.get("id") ??
    "";
  const { clearCart } = useCart();

  const statusQuery = useQuery(paymentStatusQueryOptions(reference));

  const status = statusQuery.data?.status ?? "PENDING";
  const isFinal = useMemo(
    () => ["APPROVED", "DECLINED", "ERROR", "VOIDED", "REFUNDED"].includes(status),
    [status],
  );

  useEffect(() => {
    if (status === "APPROVED") {
      clearCart();
    }
  }, [status, clearCart]);

  const isPolling = !isFinal && !statusQuery.isError;
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!reference || isFinal || statusQuery.isError) {
      setTimedOut(false);
      return;
    }

    setTimedOut(false);
    const timer = window.setTimeout(() => setTimedOut(true), 60_000);
    return () => window.clearTimeout(timer);
  }, [reference, isFinal, statusQuery.isError]);

  let title = "Procesando tu pago";
  let description = "Esto puede tardar unos segundos.";
  let tone: "neutral" | "success" | "error" = "neutral";

  if (status === "APPROVED") {
    title = "Pago aprobado";
    description = "Gracias por tu compra. Recibirás confirmación por correo.";
    tone = "success";
  } else if (status === "DECLINED") {
    title = "Pago rechazado";
    description = "Tu banco o la pasarela rechazó el pago. Puedes intentar de nuevo.";
    tone = "error";
  } else if (status === "ERROR" || status === "VOIDED") {
    title = "No se completó el pago";
    description = "Ocurrió un problema con la transacción.";
    tone = "error";
  } else if (statusQuery.isError) {
    title = "No pudimos verificar el pago";
    description = "Si ya pagaste, guardaremos tu referencia y te contactaremos.";
    tone = "error";
  } else if (timedOut) {
    title = "Confirmación en curso";
    description =
      "Tu pago puede tardar un poco más. Revisa tu correo; la referencia quedó registrada.";
  }

  const showPollingSpinner = isPolling && !timedOut && tone === "neutral";

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      {tone === "success" && (
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-700/30 bg-emerald-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-7 w-7 text-emerald-700"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {tone === "error" && (
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-200 bg-red-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-7 w-7 text-red-600"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      )}

      {showPollingSpinner && (
        <div
          className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-ethra-stone/20 border-t-ethra-charcoal"
          aria-hidden
        />
      )}

      <div
        className={
          tone === "success"
            ? "text-emerald-700"
            : tone === "error"
              ? "text-red-700"
              : "text-ethra-charcoal"
        }
      >
        <h1 className="font-serif text-3xl">{title}</h1>
        <p className="mt-4 font-display text-sm text-ethra-stone">{description}</p>
      </div>

      {reference && (
        <p className="mt-6 font-mono text-xs text-ethra-stone">
          Referencia: {reference}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {status === "APPROVED" ? (
          <Link
            href="/catalogo"
            className="bg-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-bone"
          >
            Ver catálogo
          </Link>
        ) : (
          <>
            <Link
              href="/catalogo"
              className="border border-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone"
            >
              Volver a la tienda
            </Link>
            {(status === "DECLINED" || status === "ERROR") && (
              <Link
                href="/checkout"
                className="bg-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-bone"
              >
                Reintentar pago
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
