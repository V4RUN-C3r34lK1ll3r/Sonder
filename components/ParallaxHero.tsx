"use client";

import Link from "next/link";

interface ParallaxHeroProps {
  tagline?: string;
  subTagline?: string;
}

const CANVAS = "#09080a";
const GOLD   = "#D4682A";

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

// Cameras kept to edges, starting below the 76px fixed header
const CAMERAS = [
  { top: "14%", left: "2%",  size: 40, delay: "0s",   dur: "6.5s", dx: 100, dy: 55 },
  { top: "24%", left: "5%",  size: 32, delay: "2.2s", dur: "7.0s", dx: 85,  dy: 45 },
  { top: "12%", left: "13%", size: 36, delay: "4.5s", dur: "5.8s", dx: 110, dy: 60 },
  { top: "12%", left: "74%", size: 38, delay: "1.0s", dur: "6.0s", dx: 95,  dy: 50 },
  { top: "26%", left: "80%", size: 34, delay: "3.2s", dur: "7.5s", dx: 80,  dy: 42 },
  { top: "15%", left: "88%", size: 30, delay: "0.6s", dur: "5.5s", dx: 70,  dy: 40 },
  { top: "10%", left: "42%", size: 28, delay: "5.0s", dur: "6.2s", dx: 90,  dy: 48 },
  { top: "10%", left: "56%", size: 26, delay: "2.8s", dur: "8.0s", dx: 75,  dy: 38 },
];

// Inline SVG camera silhouette — no background issues
function CameraIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 0.68}
      viewBox="0 0 100 68"
      fill={GOLD}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grip */}
      <rect x="2" y="16" width="18" height="44" rx="4" />
      {/* Body */}
      <rect x="18" y="24" width="74" height="36" rx="3" />
      {/* Top deck */}
      <rect x="18" y="16" width="74" height="12" rx="2" />
      {/* Pentaprism hump */}
      <rect x="30" y="8" width="26" height="12" rx="3" />
      {/* Shutter button */}
      <circle cx="30" cy="19" r="4" fill="#B04818" />
      {/* Mode dial */}
      <circle cx="82" cy="13" r="5" fill="#B04818" />
      {/* Lens outer ring */}
      <circle cx="68" cy="42" r="22" fill="#B04818" />
      {/* Lens mid */}
      <circle cx="68" cy="42" r="15" fill={GOLD} />
      {/* Lens inner */}
      <circle cx="68" cy="42" r="9" fill="#B04818" />
      {/* Lens glint */}
      <circle cx="63" cy="38" r="3" fill="rgba(255,220,180,0.3)" />
    </svg>
  );
}

const CSS = `
  @keyframes scroll-hill {
    from { transform: translateX(0); }
    to   { transform: translateX(-33.333%); }
  }
  @keyframes cam-shoot {
    0%   { opacity: 0;   transform: translate(0px, 0px)                    scale(0.75); }
    10%  { opacity: 0.9; transform: translate(0px, 0px)                    scale(1);    }
    85%  { opacity: 0.5; }
    100% { opacity: 0;   transform: translate(var(--dx), var(--dy))        scale(0.5);  }
  }
`;

export default function ParallaxHero({ tagline, subTagline }: ParallaxHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "100svh",
        minHeight: "500px",
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
            ["--dx" as string]: `${c.dx}px`,
            ["--dy" as string]: `${c.dy}px`,
            animation: `cam-shoot ${c.dur} ease-in-out ${c.delay} infinite`,
            filter: "drop-shadow(0 0 5px rgba(212,104,42,0.45))",
          }}
        >
          <CameraIcon size={c.size} />
        </div>
      ))}

      {/* Scrolling hill layers */}
      {HILLS.map((h) => (
        <div key={h.id} className="absolute inset-x-0 bottom-0" style={{ zIndex: h.zIndex, height: "72%" }}>
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

      {/* Text — centred within the sky zone (top 42% of hero) */}
      <div
        className="absolute inset-x-0 flex flex-col items-center justify-center text-center px-6"
        style={{ top: 0, height: "28%", zIndex: 10 }}
      >
        <p
          className="text-[10px] tracking-[0.5em] uppercase mb-4"
          style={{ color: "#D4682A", letterSpacing: "0.5em" }}
        >
          Sonder Studios
        </p>
        <h1
          className="font-serif leading-[1.15] mb-4"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 4rem)",
            color: "#FFFFFF",
            textShadow: "0 2px 24px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.9)",
          }}
        >
          {tagline ?? "Every life is as vivid and full as your own."}
        </h1>
        <p
          className="text-sm md:text-base max-w-sm leading-relaxed mb-8"
          style={{
            color: "rgba(255,255,255,0.65)",
            textShadow: "0 1px 10px rgba(0,0,0,0.9)",
          }}
        >
          {subTagline ?? "Quiet, honest, and alive with meaning."}
        </p>
        <Link
          href="/gallery"
          className="inline-block border hover:bg-gold hover:text-canvas transition-all duration-300"
          style={{
            padding: "14px 40px",
            borderColor: "rgba(212,104,42,0.6)",
            color: "#D4682A",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          View the Work
        </Link>
      </div>
    </section>
  );
}
