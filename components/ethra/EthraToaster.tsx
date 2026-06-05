"use client";

import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function EthraToaster() {
  const isMobile = useIsMobile();

  return (
    <Toaster
      position={isMobile ? "bottom-center" : "bottom-left"}
      toastOptions={{
        style: {
          background: "var(--ethra-bone)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius)",
          color: "var(--ethra-black)",
          boxShadow: "0 4px 16px oklch(0.18 0.003 80 / 0.08)",
        },
        classNames: {
          title: "font-display text-[12px] font-medium",
          description: "font-display text-[11px] text-ethra-stone",
        },
      }}
    />
  );
}
