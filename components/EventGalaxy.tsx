"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import { X, ArrowUpRight, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Group } from "three";
import { urlFor } from "@/lib/sanity";

/* ── Types ──────────────────────────────────────────────────────────────────── */

interface GalleryEvent {
  _id: string;
  name: string;
  slug: { current: string };
  date?: string;
  location?: string;
  categoryName: string;
  categorySlug: string;
  coverImage: { asset: unknown; hotspot?: unknown; crop?: unknown };
  photoCount?: number;
}

interface CardData {
  id: string;
  imageUrl: string | null;
  name: string;
  date?: string;
  location?: string;
  categoryName: string;
  href: string;
  photoCount?: number;
}

interface EventGalaxyProps {
  events: GalleryEvent[];
  tagline?: string;
  subTagline?: string;
}

/* ── Constants ──────────────────────────────────────────────────────────────── */

const DARK = "#09080a";
const GOLD = "#D4682A";
const TEAL = "#1F8C74";
const PASTELS = ["#FDE8D0", "#F5C8A4"];

const PLACEHOLDER_CARDS: CardData[] = [
  { id: "ph1", imageUrl: null, name: "Weddings",     categoryName: "Collection", href: "/gallery" },
  { id: "ph2", imageUrl: null, name: "Couples",      categoryName: "Collection", href: "/gallery" },
  { id: "ph3", imageUrl: null, name: "Family",       categoryName: "Collection", href: "/gallery" },
  { id: "ph4", imageUrl: null, name: "Housewarming", categoryName: "Collection", href: "/gallery" },
  { id: "ph5", imageUrl: null, name: "Portraits",    categoryName: "Collection", href: "/gallery" },
  { id: "ph6", imageUrl: null, name: "Celebrations", categoryName: "Collection", href: "/gallery" },
];

/* ── FloatingCard ────────────────────────────────────────────────────────────── */

function FloatingCard({
  card,
  position,
  index,
  onSelect,
}: {
  card: CardData;
  position: { x: number; y: number; z: number };
  index: number;
  onSelect: (card: CardData) => void;
}) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const pastel = PASTELS[index % PASTELS.length];

  useFrame(({ camera }) => {
    groupRef.current?.lookAt(camera.position);
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Invisible hit plane — larger than the visual card for easier clicking */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onSelect(card); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <planeGeometry args={[4.5, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0.01]}
        style={{
          transition: "transform 0.35s ease, filter 0.35s ease",
          transform: hovered ? "scale(1.14)" : "scale(1)",
          filter: hovered ? "brightness(1.1)" : "brightness(1)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "148px",
            height: "205px",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#1C1410",
            padding: "9px",
            userSelect: "none",
            boxShadow: hovered
              ? `0 28px 55px rgba(212,104,42,0.5), 0 0 28px rgba(212,104,42,0.22)`
              : "0 16px 35px rgba(0,0,0,0.75)",
            border: hovered
              ? "1.5px solid rgba(212,104,42,0.55)"
              : "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              style={{ width: "100%", height: "155px", objectFit: "cover", borderRadius: "6px", display: "block" }}
              draggable={false}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "155px",
                borderRadius: "6px",
                background: pastel,
                display: "flex",
                alignItems: "flex-end",
                padding: "8px",
              }}
            >
              <span style={{ fontFamily: "serif", fontSize: "13px", color: "#1A1614", opacity: 0.7 }}>
                {card.name}
              </span>
            </div>
          )}
          <div style={{ marginTop: "7px", textAlign: "center", padding: "0 2px" }}>
            <p style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "10px",
              fontWeight: 500,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "0.03em",
            }}>
              {card.name}
            </p>
            {card.categoryName !== "Collection" && (
              <p style={{ color: "rgba(212,104,42,0.7)", fontSize: "8px", margin: "2px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {card.categoryName}
              </p>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ── GalaxyScene (must live inside Canvas) ──────────────────────────────────── */

function GalaxyScene({
  cards,
  onSelect,
}: {
  cards: CardData[];
  onSelect: (c: CardData) => void;
}) {
  const positions = useMemo(() => {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const n = cards.length;
    return cards.map((_, i) => {
      const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = (2 * Math.PI * i) / goldenRatio;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const shell = 10 + (i % 3) * 3.5;
      return { x: x * shell, y: y * shell, z: z * shell };
    });
  }, [cards.length]);

  return (
    <>
      {/* Single efficient starfield — replaces the raw 10k-particle approach */}
      <Stars radius={90} depth={55} count={2800} factor={3.5} saturation={0.08} fade speed={0.35} />

      <ambientLight intensity={0.25} />
      <pointLight position={[14, 10, 8]} intensity={1.2} color={GOLD} />
      <pointLight position={[-12, -10, -10]} intensity={0.6} color={TEAL} />
      <pointLight position={[0, -15, 5]} intensity={0.3} color="#ffffff" />

      {cards.map((card, i) => (
        <FloatingCard key={card.id} card={card} position={positions[i]} index={i} onSelect={onSelect} />
      ))}
    </>
  );
}

/* ── Event Detail Modal ──────────────────────────────────────────────────────── */

function EventModal({ card, onClose }: { card: CardData; onClose: () => void }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) - r.height / 2) / 18;
    const ry = (r.width / 2 - (e.clientX - r.left)) / 18;
    el.style.transition = "none";
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform 0.5s ease-out";
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const formattedDate = card.date
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(card.date))
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[3px]"
      style={{ background: "rgba(9,8,10,0.82)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative max-w-sm w-full mx-5">
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 text-white/50 hover:text-white transition-colors duration-200"
        >
          <X className="w-7 h-7" />
        </button>

        <div
          ref={cardRef}
          className="rounded-xl overflow-hidden"
          style={{
            background: "#1C1410",
            border: "1px solid rgba(212,104,42,0.2)",
            transformStyle: "preserve-3d",
            boxShadow: "0 50px 100px rgba(0,0,0,0.7), 0 0 60px rgba(212,104,42,0.08)",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Cover image */}
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", aspectRatio: "3/2", background: PASTELS[0] }} />
          )}

          <div className="p-6">
            <p
              className="text-[9px] tracking-[0.4em] uppercase mb-1.5"
              style={{ color: GOLD }}
            >
              {card.categoryName}
            </p>
            <h3 className="font-serif text-2xl text-white mb-4 leading-snug">
              {card.name}
            </h3>

            <div className="flex flex-col gap-2 mb-6">
              {formattedDate && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {formattedDate}
                  </span>
                </div>
              )}
              {card.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {card.location}
                  </span>
                </div>
              )}
              {(card.photoCount ?? 0) > 0 && (
                <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(212,104,42,0.55)" }}>
                  {card.photoCount} photos
                </p>
              )}
            </div>

            <button
              onClick={() => router.push(card.href)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-xs tracking-[0.25em] uppercase font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: GOLD }}
            >
              View Event
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero overlay fallback (shown while Canvas loads) ────────────────────────── */

function HeroFallback({ tagline, subTagline }: { tagline: string; subTagline?: string }) {
  return (
    <div
      className="absolute inset-0 flex items-end pb-12 md:pb-16 px-6 md:px-16"
      style={{ background: `linear-gradient(155deg, #0e0b14 0%, ${DARK} 55%, #0c1410 100%)` }}
    >
      <div className="max-w-lg">
        <p className="text-[10px] tracking-[0.5em] uppercase mb-4" style={{ color: GOLD }}>
          Photography &amp; Video
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-white leading-[1.05] mb-4">
          {tagline}
        </h1>
        {subTagline && (
          <p className="text-white/40 text-sm md:text-base tracking-wide">
            {subTagline}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────────── */

export default function EventGalaxy({
  events,
  tagline = "Moments made to last.",
  subTagline,
}: EventGalaxyProps) {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const cards: CardData[] = useMemo(() => {
    const live = events.slice(0, 14).map((e) => ({
      id: e._id,
      imageUrl: e.coverImage?.asset
        ? urlFor(e.coverImage.asset as Parameters<typeof urlFor>[0])
            .width(420)
            .height(560)
            .fit("crop")
            .auto("format")
            .url()
        : null,
      name: e.name,
      date: e.date,
      location: e.location,
      categoryName: e.categoryName,
      href: `/gallery/${e.categorySlug}/${e.slug.current}`,
      photoCount: e.photoCount,
    }));

    // Pad with category placeholders when events are sparse
    if (live.length < 5) {
      return [...live, ...PLACEHOLDER_CARDS.slice(live.length, 8)];
    }
    return live;
  }, [events]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: DARK, height: "clamp(500px, 68vh, 780px)" }}
    >
      {/* 3D Canvas — single WebGL context for stars + cards */}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], fov: 56 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <GalaxyScene cards={cards} onSelect={setSelectedCard} />
          <OrbitControls
            enablePan={false}
            enableZoom
            enableRotate
            minDistance={9}
            maxDistance={40}
            autoRotate
            autoRotateSpeed={0.45}
            rotateSpeed={0.5}
            zoomSpeed={1.0}
          />
        </Suspense>
      </Canvas>

      {/* Polka-dot logo pattern — same as before, screen blended above canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/logos/icon.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.13,
          mixBlendMode: "screen",
        }}
      />

      {/* Top gradient — gives the transparent header nav a defined dark backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${DARK}cc 0%, ${DARK}44 12%, transparent 28%)`,
        }}
      />
      {/* Left-side gradient so hero text is always readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${DARK}e0 0%, ${DARK}99 38%, ${DARK}33 65%, transparent 100%)`,
        }}
      />
      {/* Bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${DARK}cc 0%, transparent 40%)`,
        }}
      />

      {/* Hero text — non-interactive overlay */}
      <div className="absolute inset-0 flex items-end pb-12 md:pb-16 px-6 md:px-16 pointer-events-none">
        <div className="max-w-lg">
          <p
            className="text-[10px] tracking-[0.5em] uppercase mb-4 animate-fade-in"
            style={{ color: GOLD }}
          >
            Photography &amp; Video
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-[1.05] mb-4 animate-fade-up">
            {tagline}
          </h1>
          {subTagline && (
            <p
              className="text-white/45 text-sm md:text-base font-light tracking-wide mb-8 max-w-md animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              {subTagline}
            </p>
          )}
          <div
            className="flex flex-wrap gap-3 animate-fade-up pointer-events-auto"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="/gallery"
              className="inline-block px-7 py-3 text-white text-xs tracking-[0.25em] uppercase font-semibold hover:opacity-80 transition-opacity duration-300"
              style={{ background: GOLD }}
            >
              View Gallery
            </a>
            <a
              href="/contact"
              className="inline-block px-7 py-3 border text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:border-[#1F8C74] hover:text-[#3AAA8C]"
              style={{
                borderColor: "rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Book a Session
            </a>
          </div>
        </div>
      </div>

      {/* Hint text */}
      <div className="absolute bottom-5 right-6 md:right-14 hidden sm:flex items-center gap-2 pointer-events-none z-10">
        <span className="text-[8px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.22)" }}>
          Drag · Scroll · Click to explore
        </span>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 right-8 md:right-16 hidden sm:flex flex-col items-end gap-3 z-10 pointer-events-none" style={{ right: "auto", left: "auto" }} />

      {/* Detail modal */}
      {selectedCard && (
        <EventModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </section>
  );
}
