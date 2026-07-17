"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { resolveBannerHref } from "@/lib/storefront/banner-link";
import type { StorefrontPersistentBanner } from "@/lib/storefront/types";
import { useBannerVisibility } from "@/hooks/useBannerVisibility";
import { useSetBannerOffsetVar } from "@/hooks/useSetBannerOffsetVar";

/** Tiempo que cada mensaje permanece visible antes de rotar al siguiente. */
const DISPLAY_MS = 4200;
/** Duración de la animación de deslizamiento (estilo "rodillo"). */
const TRANSITION_MS = 650;

export function PersistentPromoBanner({
  banners,
}: {
  banners?: StorefrontPersistentBanner[];
}) {
  const { state, isHydrated, dismissPersistent } = useBannerVisibility();
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [instant, setInstant] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const visible = (banners ?? []).filter(
    (b) => !state.dismissedPersistentBannerIds.includes(b.id),
  );

  useSetBannerOffsetVar(isHydrated && visible.length > 0 ? node : null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Si la cantidad de mensajes activos cambia (el admin activa/desactiva
  // alguno, o el usuario cierra la franja), evita quedar con un índice
  // fuera de rango.
  useEffect(() => {
    setDisplayIndex((i) => (i >= visible.length ? 0 : i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.length]);

  // Un solo mensaje activo: no hay nada que rotar, se muestra fijo.
  useEffect(() => {
    if (visible.length <= 1) return;
    const timer = setInterval(() => {
      if (reducedMotion) {
        setDisplayIndex((i) => (i + 1) % visible.length);
        return;
      }
      setIsSliding(true);
    }, DISPLAY_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.length, reducedMotion]);

  const handleTransitionEnd = () => {
    if (!isSliding) return;
    // Al terminar el giro: avanzar el índice y "teletransportar" el
    // carrete de vuelta a su posición de reposo sin transición (el nuevo
    // mensaje "siguiente" queda preparado arriba, fuera de vista, listo
    // para el próximo giro) — evita el salto visible hacia atrás.
    setInstant(true);
    setDisplayIndex((i) => (i + 1) % visible.length);
    setIsSliding(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
  };

  if (!isHydrated || visible.length === 0) return null;

  const current = visible[displayIndex];
  const next = visible[(displayIndex + 1) % visible.length];

  return (
    <div
      ref={setNode}
      className="fixed inset-x-0 top-0 z-[55] h-8 md:h-9 lg:h-10 bg-ethra-black motion-safe:animate-in motion-safe:slide-in-from-top motion-safe:fade-in duration-200"
    >
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center px-12">
        <div className="relative h-4 w-full max-w-[85%] overflow-hidden sm:max-w-xl">
          <div
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateY(${isSliding ? "100%" : "0%"})`,
              transition: instant
                ? "none"
                : `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            }}
            className="absolute inset-x-0 top-0 h-full"
          >
            {/* Mensaje siguiente: preparado arriba, fuera de vista; entra al girar hacia abajo. */}
            <Link
              href={resolveBannerHref(next)}
              aria-hidden
              tabIndex={-1}
              className="pointer-events-none absolute inset-x-0 -top-full flex h-full items-center justify-center truncate font-display text-[11px] font-medium leading-none tracking-luxury uppercase text-ethra-gold"
            >
              {next.message}
            </Link>
            {/* Mensaje actual. */}
            <Link
              href={resolveBannerHref(current)}
              aria-label={current.message}
              className="absolute inset-x-0 top-0 flex h-full items-center justify-center truncate font-display text-[11px] font-medium leading-none tracking-luxury uppercase text-ethra-gold"
            >
              {current.message}
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={() => dismissPersistent(visible.map((b) => b.id))}
          aria-label="Cerrar banner"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center"
        >
          <X className="h-4 w-4 text-ethra-gold" />
        </button>
      </div>
    </div>
  );
}
