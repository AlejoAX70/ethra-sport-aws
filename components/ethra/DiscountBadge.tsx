import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  label: string;
  className?: string;
}

export function DiscountBadge({ label, className }: DiscountBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm bg-ethra-charcoal/90 px-2 py-0.5 font-display text-[10px] tracking-luxury uppercase text-ethra-gold",
        className,
      )}
    >
      {label}
    </span>
  );
}
