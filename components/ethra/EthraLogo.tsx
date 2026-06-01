import Image from "next/image";
import { ETHRA_BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

type EthraLogoVariant = "navbar" | "footer" | "display" | "compact";

const variantConfig: Record<
  EthraLogoVariant,
  { width: number; height: number; className: string; imageClassName: string }
> = {
  navbar: {
    width: 48,
    height: 48,
    className: "h-10 w-10 md:h-12 md:w-12",
    imageClassName: "object-contain",
  },
  footer: {
    width: 96,
    height: 96,
    className: "h-20 w-20 md:h-24 md:w-24",
    imageClassName: "rounded-full object-cover",
  },
  display: {
    width: 128,
    height: 128,
    className: "h-28 w-28 md:h-32 md:w-32",
    imageClassName: "rounded-full object-cover",
  },
  compact: {
    width: 32,
    height: 32,
    className: "h-8 w-8",
    imageClassName: "object-contain",
  },
};

interface EthraLogoProps {
  variant?: EthraLogoVariant;
  className?: string;
  priority?: boolean;
  /** Sombra suave para fondos con foto (navbar sobre hero) */
  elevated?: boolean;
}

export function EthraLogo({
  variant = "navbar",
  className,
  priority = false,
  elevated = false,
}: EthraLogoProps) {
  const config = variantConfig[variant];

  return (
    <Image
      src={ETHRA_BRAND.logoUrl}
      alt={ETHRA_BRAND.logoAlt}
      width={config.width}
      height={config.height}
      priority={priority}
      className={cn(
        config.className,
        config.imageClassName,
        elevated && "drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]",
        className,
      )}
    />
  );
}
