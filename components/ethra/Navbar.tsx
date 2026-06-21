"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EthraLogo } from "./EthraLogo";
import { CartNavButton } from "./CartNavButton";

const DEFAULT_NAV = [
  { label: "Colecciones", href: "/colecciones" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Filosofía", href: "/filosofia" },
  { label: "Contacto", href: "/contacto" },
];

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  menuItems?: NavItem[];
}

export function Navbar({ menuItems }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const items = menuItems ?? DEFAULT_NAV;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = isHome && !scrolled
    ? "text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.9),_0_0_2px_rgba(0,0,0,0.7)]"
    : "text-ethra-charcoal";

  const iconColor = isHome && !scrolled
    ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
    : "text-ethra-charcoal";

  const logoElevated = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ethra-bone/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10 h-16 md:h-20">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-90"
          aria-label="Ethra Sport — Inicio"
        >
          <EthraLogo variant="navbar" priority elevated={logoElevated} />
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {items.map((item) => (
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

        <CartNavButton className={iconColor} />
      </nav>
    </header>
  );
}
