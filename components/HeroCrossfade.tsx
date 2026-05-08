"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/types";

interface HeroCrossfadeProps {
  settings: SiteSettings | null;
}

// Hardcoded dark — hero always stays dark regardless of page theme
const DARK = "#09080a";
const GRADIENTS = [
  "linear-gradient(155deg, #0e0b14 0%, #09080a 55%, #0c1410 100%)",
  "linear-gradient(155deg, #140b09 0%, #09080a 55%, #0e0c14 100%)",
  "linear-gradient(155deg, #091410 0%, #09080a 55%, #14100b 100%)",
];

export function HeroCrossfade({ settings }: HeroCrossfadeProps) {
  const heroImages = settings?.heroImages ?? [];
  const tagline = settings?.tagline ?? "Moments made to last.";
  const subTagline =
    settings?.subTagline ?? "South Asian weddings, families & celebrations.";

  return (
    <section
      className="relative overflow-hidden flex items-end"
      style={{ background: DARK, height: "clamp(440px, 60vh, 700px)" }}
    >
      {/* ── Base slides ── */}
      <div className="absolute inset-0">
        {heroImages.length > 0
          ? heroImages.map((img, i) => (
              <div key={i} className="hero-slide">
                <Image
                  src={urlFor(img.asset).width(1920).height(1080).fit("crop").auto("format").url()}
                  alt={img.alt ?? "Sonder Photography"}
                  fill
                  className="object-cover object-top"
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
            ))
          : GRADIENTS.map((bg, i) => (
              <div key={i} className="hero-slide" style={{ background: bg }} />
            ))}
      </div>

      {/* ── Dark cinematic overlays (hardcoded so they stay dark on light theme) ── */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to top, ${DARK} 0%, ${DARK}99 18%, ${DARK}40 55%, transparent 100%)` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to right, ${DARK}dd 0%, ${DARK}44 40%, transparent 100%)` }}
      />

      {/* ── Polka-dot pattern — above overlays so the icon colors show ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/logos/icon.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.32,
          mixBlendMode: "screen",
        }}
      />

      {/* ── Hero text ── */}
      <div className="relative z-10 px-6 md:px-16 pb-12 md:pb-16 max-w-3xl">
        <p className="text-[#D4682A] text-[10px] tracking-[0.5em] uppercase mb-4 animate-fade-in">
          Photography &amp; Film
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-4 animate-fade-up">
          {tagline}
        </h1>
        {subTagline && (
          <p
            className="text-white/50 text-sm md:text-base font-light tracking-wide mb-8 animate-fade-up max-w-md"
            style={{ animationDelay: "0.15s" }}
          >
            {subTagline}
          </p>
        )}
        <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/gallery"
            className="inline-block px-7 py-3 bg-[#D4682A] text-white text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#E8843E] transition-colors duration-300"
          >
            View Gallery
          </Link>
          <Link
            href="/contact"
            className="inline-block px-7 py-3 border border-white/25 text-white/80 text-xs tracking-[0.25em] uppercase hover:border-[#1F8C74] hover:text-[#3AAA8C] transition-all duration-300"
          >
            Book a Session
          </Link>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div className="absolute bottom-6 right-8 md:right-16 hidden sm:flex flex-col items-center gap-3 z-10">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-[9px] tracking-[0.35em] text-white/30 uppercase rotate-90 origin-right translate-y-2">
          Scroll
        </span>
      </div>
    </section>
  );
}
