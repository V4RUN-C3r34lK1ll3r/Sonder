"use client";

import Link from "next/link";

interface ParallaxHeroProps {
  tagline?: string;
  subTagline?: string;
}

const CANVAS = "#09080a";

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

// Camera icons scattered across the sky — each shoots diagonally and fades
const CAMERAS = [
  { top: "10%", left: "5%",  size: 38, delay: "0s",    dur: "6s",  dx: 120, dy: 60  },
  { top: "6%",  left: "22%", size: 32, delay: "1.5s",  dur: "7s",  dx: 90,  dy: 50  },
  { top: "18%", left: "40%", size: 42, delay: "3.0s",  dur: "5.5s",dx: 140, dy: 70  },
  { top: "8%",  left: "58%", size: 30, delay: "0.8s",  dur: "8s",  dx: 100, dy: 55  },
  { top: "14%", left: "72%", size: 36, delay: "2.2s",  dur: "6.5s",dx: 110, dy: 65  },
  { top: "5%",  left: "85%", size: 28, delay: "4.0s",  dur: "5s",  dx: 80,  dy: 45  },
  { top: "22%", left: "30%", size: 34, delay: "5.5s",  dur: "7.5s",dx: 130, dy: 60  },
  { top: "12%", left: "52%", size: 40, delay: "2.8s",  dur: "6s",  dx: 95,  dy: 50  },
];

const CSS = `
  @keyframes scroll-hill {
    from { transform: translateX(0); }
    to   { transform: translateX(-33.333%); }
  }

  @keyframes cam-shoot {
    0%         { opacity: 0;   transform: translate(0px, 0px) scale(0.7); }
    12%        { opacity: 0.9; transform: translate(0px, 0px) scale(1);   }
    80%        { opacity: 0.6; }
    100%       { opacity: 0;   transform: translate(var(--dx), var(--dy)) scale(0.5); }
  }
`;

export default function ParallaxHero({ tagline, subTagline }: ParallaxHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "80vh",
        minHeight: "480px",
        maxHeight: "820px",
        background: `linear-gradient(to bottom, #120A06 0%, ${CANVAS} 60%)`,
      }}
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

      {/* Camera shooting stars */}
      {CAMERAS.map((c, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: c.top,
            left: c.left,
            zIndex: 6,
            width: c.size,
            height: c.size,
            // CSS custom properties for per-element translate values
            ["--dx" as string]: `${c.dx}px`,
            ["--dy" as string]: `${c.dy}px`,
            animation: `cam-shoot ${c.dur} ease-in-out ${c.delay} infinite`,
            filter: "drop-shadow(0 0 6px rgba(212,104,42,0.5))",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/camera.png"
            alt=""
            width={c.size}
            height={c.size}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ))}

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

      {/* Text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ zIndex: 10, paddingBottom: "10%" }}
      >
        <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5">
          Sonder Studios
        </p>
        <h1
          className="font-serif text-ivory leading-[1.1] mb-5"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
        >
          {tagline ?? "Every life is as vivid and full as your own."}
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
