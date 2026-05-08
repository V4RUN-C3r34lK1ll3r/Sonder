import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">

        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex-shrink-0">
              <Image src="/logos/icon.png" alt="Sonder" fill className="object-contain" />
            </div>
            <div className="leading-none">
              <p className="font-serif text-[17px] tracking-[0.28em] text-ivory uppercase">Sonder</p>
              <p className="text-[8px] tracking-[0.45em] text-teal uppercase mt-0.5">Studios</p>
            </div>
          </div>
          <p className="text-muted text-sm leading-relaxed max-w-xs">
            Quiet, honest, and alive with meaning — South Asian celebrations told with intention.
          </p>
        </div>

        {/* Nav column */}
        <div>
          <p className="text-[9px] tracking-[0.45em] text-teal uppercase mb-5">Navigate</p>
          <nav className="flex flex-col gap-3">
            {[
              { href: "/gallery", label: "Gallery" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/admin/upload", label: "Upload" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-ivory/50 text-sm tracking-wide hover:text-ivory transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA column */}
        <div>
          <p className="text-[9px] tracking-[0.45em] text-teal uppercase mb-5">Let&apos;s work together</p>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Based in the US. Available for destination weddings worldwide.
          </p>
          <Link
            href="/contact"
            className="inline-block px-7 py-3 border border-gold/40 text-gold text-[10px] tracking-[0.3em] uppercase hover:bg-gold hover:text-canvas transition-all duration-300"
          >
            Book a Session
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted/50 text-[10px] tracking-widest uppercase">
            &copy; {year} Sonder Studios
          </p>
          <p className="text-muted/40 text-[10px] tracking-widest uppercase">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
