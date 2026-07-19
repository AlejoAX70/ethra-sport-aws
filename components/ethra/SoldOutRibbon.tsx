export function SoldOutRibbon() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <span className="absolute left-1/2 top-1/2 w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-ethra-black py-1.5 text-center font-display text-[10px] tracking-luxury uppercase text-ethra-bone shadow-sm">
        Agotado
      </span>
    </div>
  );
}
