"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";

interface CarouselEvent {
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

interface EventCarouselProps {
  events: CarouselEvent[];
}

const CARD_WIDTH = 300;   // shrinks well on mobile; still looks great on desktop
const CARD_GAP = 16;
const STEP = CARD_WIDTH + CARD_GAP;

const PLACEHOLDER_EVENTS: CarouselEvent[] = [
  { _id: "p1", name: "Priya & Arjun", slug: { current: "#" }, date: "2026-02-15", location: "Chennai", categoryName: "Weddings", categorySlug: "weddings", coverImage: { asset: null }, photoCount: 48 },
  { _id: "p2", name: "The Sharma Family", slug: { current: "#" }, date: "2026-01-20", location: "Pittsburgh", categoryName: "Family", categorySlug: "family", coverImage: { asset: null }, photoCount: 32 },
  { _id: "p3", name: "Rohan & Meera", slug: { current: "#" }, date: "2025-12-10", location: "New Jersey", categoryName: "Couples", categorySlug: "couples", coverImage: { asset: null }, photoCount: 24 },
  { _id: "p4", name: "Vikram & Nithya", slug: { current: "#" }, date: "2025-11-05", location: "Atlanta", categoryName: "Weddings", categorySlug: "weddings", coverImage: { asset: null }, photoCount: 62 },
  { _id: "p5", name: "Kavya Housewarming", slug: { current: "#" }, date: "2025-10-18", location: "Dallas", categoryName: "Housewarming", categorySlug: "housewarming", coverImage: { asset: null }, photoCount: 19 },
];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=720&h=960&fit=crop",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=720&h=960&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=720&h=960&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=720&h=960&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=720&h=960&fit=crop",
];

export function EventCarousel({ events }: EventCarouselProps) {
  const [current, setCurrent] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayEvents = events.length > 0 ? events : PLACEHOLDER_EVENTS;
  if (displayEvents.length === 0) return null;

  const clampedMax = Math.max(0, displayEvents.length - 1);

  const slideTo = (index: number) => {
    const next = Math.max(0, Math.min(index, clampedMax));
    setCurrent(next);
    animate(x, -next * STEP, { type: "spring", stiffness: 300, damping: 35 });
  };

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-16 mb-8 flex items-end justify-between max-w-7xl mx-auto">
        <div>
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3">Recent Work</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ivory">Stories we've told</h2>
        </div>
        {/* Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => slideTo(current - 1)}
            disabled={current === 0}
            className="w-11 h-11 border border-border flex items-center justify-center text-muted
              hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => slideTo(current + 1)}
            disabled={current === clampedMax}
            className="w-11 h-11 border border-border flex items-center justify-center text-muted
              hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={containerRef}
        className="pl-5 sm:pl-8 md:pl-12 lg:pl-16 cursor-grab active:cursor-grabbing select-none"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -clampedMax * STEP, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            const threshold = STEP / 3;
            if (info.offset.x < -threshold) slideTo(current + 1);
            else if (info.offset.x > threshold) slideTo(current - 1);
            else slideTo(current);
          }}
          className="flex gap-4"
          style={{ x, width: `${displayEvents.length * STEP}px` }}
        >
          {displayEvents.map((event, i) => (
            <EventCard key={event._id} event={event} index={i} current={current} placeholderImage={PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]} />
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-10">
        {displayEvents.map((_, i) => (
          <button
            key={i}
            onClick={() => slideTo(i)}
            className={`transition-all duration-300 rounded-full
              ${i === current ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-border hover:bg-muted"}`}
          />
        ))}
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
  current,
  placeholderImage,
}: {
  event: CarouselEvent;
  index: number;
  current: number;
  placeholderImage?: string;
}) {
  const distance = index - current;
  const isActive = distance === 0;

  const imageUrl = event.coverImage?.asset
    ? urlFor(event.coverImage.asset as Parameters<typeof urlFor>[0])
        .width(720)
        .height(960)
        .fit("crop")
        .auto("format")
        .url()
    : (placeholderImage ?? null);

  const formattedDate = event.date
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
        new Date(event.date)
      )
    : null;

  return (
    <motion.div
      animate={{
        scale: isActive ? 1 : 0.94,
        opacity: Math.abs(distance) > 2 ? 0.3 : isActive ? 1 : 0.65,
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: CARD_WIDTH, flexShrink: 0 }}
    >
      <Link
        href={`/gallery/${event.categorySlug}/${event.slug.current}`}
        className="group block relative overflow-hidden"
        style={{ height: 380 }}
        draggable={false}
      >
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl ?? undefined}
          alt={event.name}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient — hardcoded dark so it works on light page theme */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #09080a 0%, rgba(9,8,10,0.35) 45%, transparent 100%)" }} />

        {/* Category pill */}
        <div className="absolute top-5 left-5">
          <span className="text-[9px] tracking-[0.4em] uppercase text-[#E8843E] border border-[#D4682A]/40 px-3 py-1.5 bg-[#09080a]/60 backdrop-blur-sm">
            {event.categoryName}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-serif text-2xl text-white mb-2 leading-snug group-hover:text-[#E8843E] transition-colors duration-300">
            {event.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-muted text-[10px] tracking-[0.3em] uppercase mb-4">
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && event.location && <span>·</span>}
            {event.location && <span>{event.location}</span>}
          </div>
          <div className="flex items-center gap-2 text-gold text-[10px] tracking-[0.35em] uppercase
            opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span>View {event.photoCount ? `${event.photoCount} photos` : "gallery"}</span>
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
