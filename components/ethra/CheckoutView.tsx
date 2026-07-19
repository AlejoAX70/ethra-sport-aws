"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { formatStorefrontPrice } from "@/lib/storefront/format";
import { CheckoutSummary } from "./CheckoutSummary";
import { WompiWidgetLauncher } from "./WompiWidgetLauncher";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Nombre requerido").max(255),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().min(7, "Teléfono requerido").max(64),
  address: z.string().min(5, "Dirección requerida").max(500),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function FieldErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

const inputBaseClass =
  "w-full border border-ethra-stone/40 bg-transparent px-4 py-3 font-display text-sm text-ethra-black placeholder:text-ethra-stone/40 focus:border-ethra-black focus:outline-none focus:ring-0";

const labelClass =
  "mb-1.5 block font-display text-[11px] uppercase tracking-luxury text-ethra-stone";

export function CheckoutView() {
  const { items, isEmpty, subtotal, currency, itemCount } = useCart();
  const {
    phase,
    error,
    intent,
    lineErrors,
    submit,
    onWidgetClosed,
    onWidgetAbandoned,
    reset,
    isSubmitting,
  } = useCheckout(items);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [wompiReady, setWompiReady] = useState(false);

  const formattedTotal = formatStorefrontPrice({ amount: subtotal, currency });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (isEmpty && phase === "idle") {
      toast.message("Tu bolsa está vacía");
    }
  }, [isEmpty, phase]);

  useEffect(() => {
    if (phase !== "widget_open") {
      setWompiReady(false);
    }
  }, [phase]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await submit(values);
  });

  const fieldErrorClass = (field: keyof CheckoutFormValues) =>
    form.formState.errors[field] ? "border-red-400/70 pr-10" : "";

  const buttonLabel = () => {
    if (phase === "creating_intent") return "Procesando…";
    if (phase === "widget_open") return "Abriendo pasarela…";
    return `Pagar ${formattedTotal} con Wompi`;
  };

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-serif text-xl text-ethra-charcoal">No hay productos en tu bolsa</p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block border border-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Mobile: resumen colapsable sticky */}
      <div className="sticky top-0 z-10 -mx-6 border-b border-ethra-stone/15 bg-ethra-bone px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setIsSummaryExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between py-4"
          aria-expanded={isSummaryExpanded}
        >
          <span className="flex items-center gap-2 font-display text-[11px] uppercase tracking-luxury text-ethra-charcoal">
            {isSummaryExpanded ? "Ocultar bolsa" : `Expandir bolsa (${itemCount} items)`}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`h-3.5 w-3.5 transition-transform ${isSummaryExpanded ? "rotate-180" : ""}`}
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          <span className="font-display text-sm text-ethra-black">Total: {formattedTotal}</span>
        </button>
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isSummaryExpanded ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          <CheckoutSummary className="mb-4 border-0 bg-transparent p-0" showEditLink />
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px] lg:pt-0 pt-8">
        <section>
          <h1 className="font-serif text-3xl text-ethra-black">Checkout</h1>
          <p className="mt-2 font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
            Completa tus datos para finalizar la compra
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Grupo 1: Contacto */}
            <div>
              <h2 className="font-display text-[11px] uppercase tracking-luxury text-ethra-charcoal">
                Paso 1 — Contacto
              </h2>
              <div className="mt-4 space-y-5 border-t border-ethra-stone/15 pt-5">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Nombre completo
                    <span className="ml-0.5 text-ethra-stone/60">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      placeholder="Nombre y apellido"
                      disabled={isSubmitting}
                      {...form.register("fullName")}
                      className={`${inputBaseClass} ${fieldErrorClass("fullName")}`}
                    />
                    {form.formState.errors.fullName && <FieldErrorIcon />}
                  </div>
                  {form.formState.errors.fullName && (
                    <p className="mt-1 font-display text-xs text-red-700">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Correo electrónico
                    <span className="ml-0.5 text-ethra-stone/60">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      disabled={isSubmitting}
                      {...form.register("email")}
                      className={`${inputBaseClass} ${fieldErrorClass("email")}`}
                    />
                    {form.formState.errors.email && <FieldErrorIcon />}
                  </div>
                  {form.formState.errors.email && (
                    <p className="mt-1 font-display text-xs text-red-700">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Teléfono
                    <span className="ml-0.5 text-ethra-stone/60">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      placeholder="+57 300 000 0000"
                      disabled={isSubmitting}
                      {...form.register("phone")}
                      className={`${inputBaseClass} ${fieldErrorClass("phone")}`}
                    />
                    {form.formState.errors.phone && <FieldErrorIcon />}
                  </div>
                  {form.formState.errors.phone && (
                    <p className="mt-1 font-display text-xs text-red-700">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Grupo 2: Dirección */}
            <div>
              <h2 className="font-display text-[11px] uppercase tracking-luxury text-ethra-charcoal">
                Paso 2 — Dirección de envío
              </h2>
              <div className="mt-4 border-t border-ethra-stone/15 pt-5">
                <label htmlFor="address" className={labelClass}>
                  Dirección
                  <span className="ml-0.5 text-ethra-stone/60">*</span>
                </label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="Ej: Calle 93 #15-40, Apto 502, Bogotá, Cundinamarca"
                  disabled={isSubmitting}
                  {...form.register("address")}
                  className={`${inputBaseClass} resize-none ${form.formState.errors.address ? "border-red-400/70" : ""}`}
                />
                <p className="mt-1.5 font-display text-[10px] uppercase tracking-luxury text-ethra-stone/60">
                  Incluye ciudad, estado y código postal
                </p>
                {form.formState.errors.address && (
                  <p className="mt-1 font-display text-xs text-red-700">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {error && phase === "error" && (
              <div className="rounded-none border border-red-200/60 bg-red-50/40 p-5">
                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 shrink-0 text-red-500"
                    aria-hidden
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-medium text-red-800">
                      No pudimos procesar tu pago
                    </p>
                    <p className="mt-1 font-display text-sm text-red-700">{error}</p>
                    {lineErrors.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-4 font-display text-sm text-red-700">
                        {lineErrors.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/catalogo"
                        className="border border-ethra-black px-4 py-2 font-display text-[10px] uppercase tracking-luxury text-ethra-black"
                      >
                        Editar bolsa
                      </Link>
                      <button
                        type="button"
                        onClick={reset}
                        className="bg-ethra-black px-4 py-2 font-display text-[10px] uppercase tracking-luxury text-ethra-bone"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 bg-ethra-black px-6 py-4 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-bone transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting && <Spinner className="h-4 w-4 text-ethra-bone" />}
                {buttonLabel()}
              </button>

              {phase === "widget_open" && !wompiReady && (
                <p className="mt-3 text-center font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
                  Cargando Wompi de forma segura…
                </p>
              )}

              <p className="mt-3 flex items-center justify-center gap-1.5 font-display text-[10px] uppercase tracking-luxury text-ethra-stone/60">
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
            </div>
          </form>

          {intent && phase === "widget_open" && (
            <WompiWidgetLauncher
              intent={intent}
              customer={{
                fullName: form.getValues("fullName"),
                email: form.getValues("email"),
                phone: form.getValues("phone"),
              }}
              onComplete={onWidgetClosed}
              onError={onWidgetAbandoned}
              onReady={() => setWompiReady(true)}
            />
          )}
        </section>

        {/* Desktop: aside sticky */}
        <div className="hidden lg:block">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
}
