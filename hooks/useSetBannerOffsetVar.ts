"use client";

import { useLayoutEffect } from "react";

const BANNER_OFFSET_VAR = "--ethra-banner-offset";

/**
 * Fija --ethra-banner-offset a la altura REAL (medida con ResizeObserver) del
 * elemento del banner persistente, en vez de un valor fijo. Así el offset
 * sigue automáticamente los breakpoints responsive de la franja (h-8/md:h-9/lg:h-10)
 * sin duplicar esa lógica de tamaños en JS, evitando que ambos se desincronicen.
 */
export function useSetBannerOffsetVar(element: HTMLElement | null) {
  useLayoutEffect(() => {
    if (!element) {
      document.documentElement.style.setProperty(BANNER_OFFSET_VAR, "0px");
      return;
    }

    const setOffset = () => {
      document.documentElement.style.setProperty(BANNER_OFFSET_VAR, `${element.offsetHeight}px`);
    };

    setOffset();
    const resizeObserver = new ResizeObserver(setOffset);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.setProperty(BANNER_OFFSET_VAR, "0px");
    };
  }, [element]);
}
