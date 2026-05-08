"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { urlFor } from "@/lib/sanity";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

// Two alternating orange pastels — light and dark
const PASTELS = [
  { bg: "#FDE8D0", accent: "#C06030" },  // light peach
  { bg: "#F5C8A4", accent: "#A03818" },  // deeper apricot
];

const ILLUSTRATIONS: Record<string, (accent: string) => ReactNode> = {
  weddings: (c) => (
    <svg viewBox="0 0 140 90" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="52" r="28" />
      <circle cx="90" cy="52" r="28" />
      <path d="M70 8 L76 19 L70 15 L64 19 Z" fill={c} stroke="none" />
      <path d="M64 19 L70 8 L76 19" />
    </svg>
  ),
  couples: (c) => (
    <svg viewBox="0 0 140 100" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="45" cy="20" r="13" />
      <path d="M24 88 C24 62 66 62 66 88" />
      <circle cx="95" cy="20" r="13" />
      <path d="M74 88 C74 62 116 62 116 88" />
      <path d="M70 48 C70 45 67 42 64 44 C61 46 61 51 70 56 C79 51 79 46 76 44 C73 42 70 45 70 48Z" fill={c} stroke="none" />
    </svg>
  ),
  family: (c) => (
    <svg viewBox="0 0 160 100" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="35" cy="16" r="12" />
      <path d="M16 88 C16 66 54 66 54 88" />
      <circle cx="125" cy="20" r="11" />
      <path d="M108 88 C108 68 142 68 142 88" />
      <circle cx="80" cy="36" r="9" />
      <path d="M58 88 C58 73 102 73 102 88" />
    </svg>
  ),
  housewarming: (c) => (
    <svg viewBox="0 0 140 108" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 50 L70 10 L128 50" />
      <rect x="22" y="50" width="96" height="52" />
      <path d="M56 102 L56 72 Q70 65 84 72 L84 102" />
      <rect x="28" y="58" width="18" height="16" />
      <line x1="37" y1="58" x2="37" y2="74" />
      <line x1="28" y1="66" x2="46" y2="66" />
      <path d="M70 82 C70 80 68 77 65 79 C62 81 62 85 70 88 C78 85 78 81 75 79 C72 77 70 80 70 82Z" fill={c} stroke="none" />
    </svg>
  ),
  portraits: (c) => (
    <svg viewBox="0 0 160 110" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Classic oval portrait frame */}
      <ellipse cx="80" cy="54" rx="54" ry="44" />
      {/* Head */}
      <circle cx="80" cy="34" r="14" />
      {/* Shoulders */}
      <path d="M46 90 Q46 68 80 65 Q114 68 114 90" />
    </svg>
  ),
  milestones: (c) => (
    <svg viewBox="0 0 160 110" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Mortarboard flat top */}
      <path d="M80 18 L140 44 L80 60 L20 44 Z" />
      {/* Cap bowl */}
      <path d="M50 50 L50 68 Q50 80 80 80 Q110 80 110 68 L110 50" />
      {/* Center stem */}
      <line x1="80" y1="60" x2="80" y2="80" />
      {/* Tassel cord */}
      <line x1="140" y1="44" x2="140" y2="64" />
      <line x1="133" y1="64" x2="147" y2="64" />
      {/* Tassel fringe */}
      <line x1="135" y1="64" x2="133" y2="77" />
      <line x1="140" y1="64" x2="140" y2="79" />
      <line x1="145" y1="64" x2="143" y2="76" />
      {/* Sparkle */}
      <path d="M26 26 L28 20 L30 26 L36 26 L31 30 L33 36 L28 32 L23 36 L25 30 L20 26 Z" fill={c} stroke="none" opacity="0.45" />
    </svg>
  ),
};

const ILLUSTRATION_ALIASES: Record<string, string> = {
  graduation: "milestones",
  prom: "milestones",
  celebrat: "milestones",
  milestone: "milestones",
  portrait: "portraits",
};

function getIllustration(category: Category, accent: string): ReactNode {
  const slug = category.slug?.current?.toLowerCase() ?? "";
  const name = category.name?.toLowerCase() ?? "";
  const text = slug + " " + name;

  for (const [trigger, target] of Object.entries(ILLUSTRATION_ALIASES)) {
    if (text.includes(trigger)) return ILLUSTRATIONS[target]?.(accent) ?? null;
  }
  for (const key of Object.keys(ILLUSTRATIONS)) {
    if (text.includes(key)) return ILLUSTRATIONS[key](accent);
  }
  return null;
}

const letterVariants: Variants = {
  hover: { y: "-50%", transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};

function AnimatedLetter({ letter }: { letter: string }) {
  if (letter === " ") return <span className="inline-block min-w-[0.35em]">&nbsp;</span>;
  return (
    <div className="inline-block h-[1em] overflow-hidden leading-none">
      <motion.span className="flex flex-col min-w-[1px]" variants={letterVariants}>
        <span>{letter}</span>
        <span>{letter}</span>
      </motion.span>
    </div>
  );
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  if (!category.slug?.current) return null;

  const pastel = PASTELS[index % PASTELS.length];
  const imageUrl = category.coverImage?.asset
    ? urlFor(category.coverImage.asset).width(900).height(700).fit("crop").auto("format").url()
    : null;

  const hasImage = !!imageUrl;

  return (
    <Link href={`/gallery/${category.slug.current}`} className="block">
      <motion.div
        whileHover="hover"
        transition={{ staggerChildren: 0.03 }}
        className="group relative h-72 md:h-80 w-full cursor-pointer overflow-hidden"
        style={{ background: hasImage ? "#000" : pastel.bg }}
      >
        {/* Background image or pastel — no image = no dark overlay */}
        {hasImage ? (
          <>
            <div
              className="absolute inset-0 transition-all duration-700 group-hover:scale-110 md:saturate-0 md:group-hover:saturate-100 saturate-100"
              style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:bg-black/30" />
          </>
        ) : (
          /* Subtle inner shadow for pastel cards to give depth */
          <div
            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-50"
            style={{ boxShadow: `inset 0 0 60px ${pastel.accent}22` }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-7">

          {/* Arrow top-right */}
          <motion.div
            className="ml-auto"
            style={{ color: hasImage ? "#fff" : pastel.accent }}
            variants={{ hover: { rotate: -45, transition: { duration: 0.4 } } }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M19.5 4.5H8.25M19.5 4.5v11.25" />
            </svg>
          </motion.div>

          {/* Line-art illustration — pastel cards only */}
          {!hasImage && (
            <div className="flex justify-center items-center opacity-30 -mt-2">
              <div className="w-40 h-28">
                {getIllustration(category, pastel.accent)}
              </div>
            </div>
          )}

          {/* Bottom text */}
          <div>
            <h2
              className="font-serif text-3xl md:text-4xl mb-2 tracking-wide"
              style={{ color: hasImage ? "#fff" : "#1A1614" }}
            >
              {category.name.split("").map((letter, i) => (
                <AnimatedLetter key={i} letter={letter} />
              ))}
            </h2>
            {category.description && (
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: hasImage ? "rgba(255,255,255,0.6)" : pastel.accent }}
              >
                {category.description}
              </p>
            )}
            {category.eventCount !== undefined && (
              <p
                className="mt-3 text-[10px] tracking-[0.35em] uppercase font-medium"
                style={{ color: pastel.accent }}
              >
                {category.eventCount} {category.eventCount === 1 ? "event" : "events"}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
