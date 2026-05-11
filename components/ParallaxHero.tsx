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

// Each shooting star: position in sky, angle, size, delay, duration
const STARS = [
  { top: "12%", left: "8%",  angle: 32, len: 80,  delay: "0.2s",  dur: "1.1s", loop: "5.8s"  },
  { top: "6%",  left: "25%", angle: 28, len: 110, delay: "1.4s",  dur: "0.9s", loop: "7.2s"  },
  { top: "18%", left: "45%", angle: 35, len: 65,  delay: "0.7s",  dur: "1.2s", loop: "6.1s"  },
  { top: "8%",  left: "62%", angle: 25, len: 95,  delay: "2.1s",  dur: "1.0s", loop: "8.4s"  },
  { top: "15%", left: "75%", angle: 30, len: 75,  delay: "0.4s",  dur: "1.3s", loop: "5.2s"  },
  { top: "5%",  left: "88%", angle: 38, len: 55,  delay: "1.8s",  dur: "0.8s", loop: "7.7s"  },
  { top: "22%", left: "33%", angle: 27, len: 90,  delay: "3.0s",  dur: "1.1s", loop: "9.0s"  },
  { top: "10%", left: "55%", angle: 33, len: 70,  delay: "2.5s",  dur: "1.0s", loop: "6.5s"  },
];

const CSS = `
  @keyframes scroll-hill {
    from { transform: translateX(0); }
    to   { transform: translateX(-33.333%); }
  }

  @keyframes shoot {
    0%   { opacity: 0;   transform: translateX(0)    translateY(0); }
    8%   { opacity: 1; }
    85%  { opacity: 0.7; }
    100% { opacity: 0;   transform: translateX(180px) translateY(90px); }
  }

  @keyframes flash-burst {
    0%        { opacity: 0; transform: scale(0.2); }
    10%, 25%  { opacity: 1; transform: scale(1); }
    50%, 100% { opacity: 0; transform: scale(0.1); }
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

      {/* Shooting stars — camera shutter flashes */}
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: s.top, left: s.left, zIndex: 6 }}
        >
          {/* Flash burst at head */}
          <div
            style={{
              position: "absolute",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,210,160,0.95) 0%, rgba(212,104,42,0.6) 50%, transparent 100%)",
              transform: "translate(-50%, -50%)",
              animation: `flash-burst ${s.dur} ease-out ${s.delay} both`,
              animationIterationCount: "infinite",
              animationDelay: s.delay,
              // stagger the loop slightly per star
              animationDuration: s.loop,
            }}
          />
          {/* Trail */}
          <div
            style={{
              width: `${s.len}px`,
              height: "1.5px",
              borderRadius: "2px",
              background: `linear-gradient(to right, rgba(255,210,160,0.9), rgba(212,104,42,0.5) 40%, transparent)`,
              transform: `rotate(${s.angle}deg)`,
              transformOrigin: "left center",
              animation: `shoot ${s.dur} ease-out both`,
              animationIterationCount: "infinite",
              animationDelay: s.delay,
              animationDuration: s.loop,
            }}
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
