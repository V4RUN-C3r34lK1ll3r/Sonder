"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

interface LightboxProps {
  slides: Slide[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export function Lightbox({ slides, index, onClose, onChange }: LightboxProps) {
  const slide = slides[index];

  const prev = useCallback(() => {
    onChange((index - 1 + slides.length) % slides.length);
  }, [index, slides.length, onChange]);

  const next = useCallback(() => {
    onChange((index + 1) % slides.length);
  }, [index, slides.length, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!slide) return null;

  return (
    <div
      className="fixed inset-0 z-[100] backdrop-blur-sm flex items-center justify-center" style={{ background: "rgba(9,8,10,0.97)" }}
      onClick={onClose}
    >
      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.src}
          alt={slide.alt}
          className="max-w-full max-h-[85vh] object-contain select-none"
        />
        {slide.alt && (
          <p className="absolute bottom-0 left-0 right-0 text-center text-muted text-sm py-2">
            {slide.alt}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-ivory/60 hover:text-ivory transition-colors duration-200 p-2"
        aria-label="Close lightbox"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-ivory transition-colors duration-200 p-3"
            aria-label="Previous photo"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-ivory transition-colors duration-200 p-3"
            aria-label="Next photo"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-muted text-xs tracking-widest">
        {index + 1} / {slides.length}
      </div>
    </div>
  );
}
