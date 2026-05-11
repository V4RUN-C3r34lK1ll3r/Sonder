"use client";

import Link from "next/link";

interface ParallaxHeroProps {
  tagline?: string;
  subTagline?: string;
}

const CANVAS = "#09080a";
const GOLD   = "#D4682A";

// Hill layers: far → near, slowest → fastest, darkest → slightly warmer
const HILLS = [
  {
    id: "h1", dur: "90s", zIndex: 1, color: "#1A0E08",
    path: "M0,180 L80,110 L160,150 L240,70 L320,130 L400,80 L480,140 L560,60 L640,125 L720,90 L800,148 L880,68 L960,128 L1040,98 L1120,158 L1200,74 L1280,118 L1360,84 L1440,138 L1440,300 L0,300 Z",
  },
  {
    id: "h2", dur: "60s", zIndex: 2, color: "#2D1A0F",
    path: "M0,210 L120,162 L240,196 L360,146 L480,186 L600,152 L720,200 L840,162 L960,202 L1080,156 L1200,192 L1320,164 L1440,206 L1440,300 L0,300 Z",
  },
  {
    id: "h3", dur: "38s", zIndex: 3, color: "#4A2518",
    path: "M0,235 Q90,205 180,240 Q270,275 360,234 Q450,196 540,240 Q630,278 720,236 Q810,196 900,242 Q990,280 1080,238 Q1170,200 1260,240 L1440,234 L1440,300 L0,300 Z",
  },
  {
    id: "h4", dur: "20s", zIndex: 5, color: "#0E0908",
    path: "M0,268 Q180,252 360,270 Q540,290 720,266 Q900,246 1080,272 Q1260,292 1440,264 L1440,300 L0,300 Z",
  },
];

const CSS = `
  @keyframes scroll-hill {
    from { transform: translateX(0); }
    to   { transform: translateX(-33.333%); }
  }
  @keyframes photog-float {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50%       { transform: translateX(-50%) translateY(-5px); }
  }
`;

export default function ParallaxHero({ tagline, subTagline }: ParallaxHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "520px", background: `linear-gradient(to bottom, #120A06 0%, ${CANVAS} 55%)` }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Warm horizon glow */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "50%",
          zIndex: 0,
          background: "radial-gradient(ellipse 130% 55% at 50% 100%, rgba(180,72,18,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Scrolling hill layers */}
      {HILLS.map((h) => (
        <div key={h.id} className="absolute inset-x-0 bottom-0" style={{ zIndex: h.zIndex, height: "58%" }}>
          <div
            style={{
              display: "flex",
              width: "300%",
              height: "100%",
              animation: `scroll-hill ${h.dur} linear infinite`,
            }}
          >
            {[0, 1, 2].map((n) => (
              <svg
                key={n}
                viewBox="0 0 1440 300"
                preserveAspectRatio="none"
                style={{ width: "33.333%", height: "100%", display: "block" }}
              >
                <path d={h.path} fill={h.color} />
              </svg>
            ))}
          </div>
        </div>
      ))}

      {/* Photographer silhouette */}
      <div
        className="absolute"
        style={{
          bottom: "3.5%",
          left: "50%",
          zIndex: 4,
          width: "clamp(64px, 9vw, 115px)",
          animation: "photog-float 4.5s ease-in-out infinite",
          filter: `drop-shadow(0 0 14px rgba(212,104,42,0.4))`,
        }}
      >
        <svg viewBox="0 0 80 120" fill={GOLD} xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="38" cy="13" r="10" />
          {/* Camera body */}
          <rect x="42" y="6" width="22" height="15" rx="3" />
          <rect x="52" y="3" width="9" height="5" rx="1.5" />
          {/* Lens */}
          <circle cx="57" cy="13" r="4.5" fill={CANVAS} opacity="0.5" />
          <circle cx="56" cy="12" r="1.5" fill="rgba(255,255,255,0.25)" />
          {/* Body */}
          <path d="M22 40 Q22 26 38 26 Q54 26 54 40 L52 70 L24 70 Z" />
          {/* Left arm raised to camera */}
          <path d="M24 40 Q28 26 42 16" stroke={GOLD} strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Right arm elbow-out */}
          <path d="M52 42 L65 38 L68 52" stroke={GOLD} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Camera strap */}
          <path d="M42 16 Q33 30 24 40" stroke={GOLD} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" />
          {/* Camera bag */}
          <rect x="11" y="48" width="13" height="17" rx="3" />
          {/* Legs */}
          <path d="M30 70 L25 103" stroke={GOLD} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M46 70 L54 103" stroke={GOLD} strokeWidth="9" strokeLinecap="round" fill="none" />
          {/* Feet */}
          <path d="M25 103 L10 108" stroke={GOLD} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M54 103 L68 108" stroke={GOLD} strokeWidth="7" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ zIndex: 10, paddingBottom: "16%" }}
      >
        <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5">
          Sonder Studios
        </p>
        <h1
          className="font-serif text-ivory leading-[1.1] mb-5"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
        >
          {tagline ?? "Every life is as vivid and full as your own."}
        </h1>
        <p className="text-muted text-sm md:text-base max-w-sm leading-relaxed mb-10">
          {subTagline ?? "Quiet, honest, and alive with meaning."}
        </p>
        <Link
          href="/gallery"
          className="inline-block px-8 py-3.5 border border-gold/40 text-gold text-xs tracking-[0.3em] uppercase hover:bg-gold hover:text-canvas transition-all duration-300"
        >
          View the Work
        </Link>
      </div>
    </section>
  );
}
