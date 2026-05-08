"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isHome = pathname === "/";
  // Transparent over dark hero = use white text; solid header = use dark text
  const overDarkHero = isHome && !scrolled && !menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        overDarkHero
          ? "bg-transparent border-b border-white/10"
          : "bg-canvas/97 backdrop-blur-md border-b border-border shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 h-[76px] flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Sonder Studios">
          <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Image src="/logos/icon.png" alt="Sonder" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col leading-none">
            <span className={`font-serif text-[22px] tracking-[0.22em] uppercase transition-colors duration-300
              ${overDarkHero ? "text-white group-hover:text-[#D4682A]" : "text-ivory group-hover:text-gold"}`}>
              Sonder
            </span>
            <span className={`text-[8px] tracking-[0.5em] uppercase font-light mt-[2px]
              ${overDarkHero ? "text-[#3AAA8C]" : "text-teal"}`}>
              Studios
            </span>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[14px] tracking-[0.12em] uppercase font-medium transition-colors duration-300 ${
                pathname.startsWith(href)
                  ? "text-gold"
                  : overDarkHero
                  ? "text-white/75 hover:text-white"
                  : "text-ivory/60 hover:text-ivory"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`ml-2 px-6 py-2.5 border text-[13px] tracking-[0.12em] uppercase font-medium transition-all duration-300 ${
              overDarkHero
                ? "border-white/30 text-white hover:border-[#1F8C74] hover:text-[#3AAA8C]"
                : "border-teal/50 text-teal hover:bg-teal hover:text-white"
            }`}
          >
            Book Now
          </Link>
        </nav>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle navigation"
        >
          <span className={`block w-6 h-[1.5px] transition-all duration-300
            ${overDarkHero ? "bg-white" : "bg-ivory"}
            ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-6 h-[1.5px] transition-all duration-300
            ${overDarkHero ? "bg-white" : "bg-ivory"}
            ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[1.5px] transition-all duration-300
            ${overDarkHero ? "bg-white" : "bg-ivory"}
            ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
      } bg-canvas/97 backdrop-blur-md border-b border-border`}>
        <nav className="flex flex-col px-6 pb-6 gap-5 pt-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[14px] tracking-[0.12em] uppercase font-medium transition-colors duration-300 ${
                pathname.startsWith(href) ? "text-gold" : "text-ivory/60"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact" className="self-start px-5 py-2 border border-teal/50 text-teal text-[13px] tracking-[0.12em] uppercase">
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
