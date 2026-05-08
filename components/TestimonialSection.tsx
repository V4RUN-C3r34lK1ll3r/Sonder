"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  event: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya & Arjun",
    event: "Wedding · Chennai",
    quote:
      "We didn't want a photographer — we wanted someone who would disappear into the moment and come back with proof that it was real. That's exactly what we got. Every photo feels like a memory, not a pose.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Kavya Menon",
    event: "Family · Pittsburgh",
    quote:
      "My parents haven't smiled that genuinely in photographs in years. Somehow you got them to just be themselves. I cried when I saw the gallery. Thank you for giving us something to hang on our walls forever.",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Rohan & Meera",
    event: "Couples · New Jersey",
    quote:
      "We were so nervous in front of the camera. Within ten minutes we forgot there was one. That's the magic. These photos are the most honest versions of us we've ever seen.",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Harsha & Divya",
    event: "Gender Reveal · Pittsburgh",
    quote:
      "We had no idea how emotional that day would be until we saw the photos. You captured every laugh, every tear, every moment we were too overwhelmed to notice ourselves. We are so grateful.",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b2a2cf7b?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Ananya Sharma",
    event: "Housewarming · Dallas",
    quote:
      "A housewarming is such a chaotic day — and yet somehow every single photo is calm, warm, and full of meaning. You have a rare gift for finding stillness in the noise.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Vikram & Nithya",
    event: "Wedding · Atlanta",
    quote:
      "Our families flew in from four cities. On the wedding day everything was a blur. These photographs are how we actually remember it. Quiet, full of feeling — exactly how we hoped it would be.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
  },
];

function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      cb();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [ref, cb]);
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => setExpanded(false));

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    document.addEventListener("keydown", onKey);
    const scrollY = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%;overflow:hidden`;
    document.body.dataset.scrollY = String(scrollY);
    return () => {
      document.removeEventListener("keydown", onKey);
      const y = parseInt(document.body.dataset.scrollY ?? "0");
      document.body.style.cssText = "";
      window.scrollTo({ top: y, behavior: "instant" });
    };
  }, [expanded]);

  const preview = t.quote.length > 110 ? t.quote.slice(0, 110) + "…" : t.quote;

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: "rgba(9,8,10,0.92)" }}
              className="absolute inset-0 backdrop-blur-md"
            />
            <motion.div
              ref={containerRef}
              layoutId={`card-${index}`}
              className="relative z-10 max-w-2xl w-full bg-surface border border-border p-10 md:p-14"
            >
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center border border-border text-muted hover:text-ivory hover:border-gold transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              <Quote className="w-8 h-8 text-gold mb-6 opacity-60" />

              <p className="font-serif text-2xl md:text-3xl text-ivory leading-[1.4] mb-10">
                {t.quote}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border saturate-0">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="font-serif text-ivory text-lg">{t.name}</p>
                  <p className="text-muted text-[10px] tracking-[0.3em] uppercase mt-0.5">{t.event}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={`card-${index}`}
        onClick={() => setExpanded(true)}
        whileHover={{ rotate: index % 2 === 0 ? 1.5 : -1.5, scale: 1.02, transition: { duration: 0.3 } }}
        className="w-72 md:w-80 flex-shrink-0 text-left"
      >
        <div className="bg-surface border border-border h-[420px] flex flex-col justify-between p-8 relative overflow-hidden group">
          {/* Gold corner accent */}
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gold/30 transition-all duration-500 group-hover:w-20 group-hover:h-20 group-hover:border-gold/60" />

          <Quote className="w-7 h-7 text-gold opacity-50" />

          <div className="flex-1 flex items-center">
            <p className="font-serif text-xl text-ivory/90 leading-[1.5]">
              {preview}
              {t.quote.length > 110 && (
                <span className="text-gold text-sm ml-1 not-italic">read more</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-border">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-border saturate-0 group-hover:saturate-100 transition-all duration-500">
              <Image src={t.avatar} alt={t.name} width={44} height={44} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="font-serif text-ivory">{t.name}</p>
              <p className="text-muted text-[9px] tracking-[0.35em] uppercase mt-0.5">{t.event}</p>
            </div>
          </div>
        </div>
      </motion.button>
    </>
  );
}

export function TestimonialSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 border-t border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-16 mb-10 flex items-end justify-between max-w-7xl mx-auto">
        <div>
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3">Kind words</p>
          <h2 className="font-serif text-4xl md:text-5xl text-ivory">What they say</h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="w-11 h-11 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="w-11 h-11 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth pl-6 md:pl-16 pr-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <TestimonialCard t={t} index={i} />
          </motion.div>
        ))}
        {/* Fade-out edge */}
        <div className="flex-shrink-0 w-16 md:w-32" />
      </div>
    </section>
  );
}
