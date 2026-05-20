"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = isHome && !scrolled
    ? "text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.9),_0_0_2px_rgba(0,0,0,0.7)]"
    : "text-ethra-charcoal";

  const logoColor = isHome && !scrolled
    ? "text-ethra-bone"
    : "text-ethra-black";

  const iconColor = isHome && !scrolled
    ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
    : "text-ethra-charcoal";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ethra-bone/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10 h-16 md:h-20">
        <Link
          href="/"
          className={`font-serif text-base md:text-lg tracking-wide ${logoColor}`}
        >
          ETHRA <span className="mx-1 text-ethra-stone">·</span> SPORT
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {[
            { label: "Colecciones", href: "/colecciones" },
            { label: "Filosofía", href: "/filosofia" },
            { label: "Contacto", href: "#" },
          ].map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`font-display text-[12px] font-medium tracking-luxury uppercase transition-colors duration-300 hover:text-ethra-gold ${textColor}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          aria-label="Bolsa"
          className={`transition-colors duration-300 hover:text-ethra-gold ${iconColor}`}
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.25} aria-hidden />
        </button>
      </nav>
    </header>
  );
}
