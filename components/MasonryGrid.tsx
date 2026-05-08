"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { Lightbox } from "./Lightbox";
import { urlFor } from "@/lib/sanity";
import type { Photo } from "@/lib/types";

interface MasonryGridProps {
  photos: Photo[];
}

const breakpointCols = {
  default: 3,
  1024: 3,
  768: 2,
  640: 1,
};

export function MasonryGrid({ photos }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  if (photos.length === 0) {
    return (
      <div className="text-center py-24 text-muted">
        <p className="font-serif text-2xl mb-3">No photos yet</p>
        <p className="text-sm">
          Add photos in Sanity Studio and they&apos;ll appear here instantly.
        </p>
      </div>
    );
  }

  const slides = photos.map((photo) => ({
    src: urlFor(photo.image.asset).width(1920).auto("format").url(),
    alt: photo.alt,
  }));

  return (
    <>
      <Masonry
        breakpointCols={breakpointCols}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {photos.map((photo, index) => {
          const thumbUrl = urlFor(photo.image.asset)
            .width(800)
            .auto("format")
            .quality(80)
            .url();

          return (
            <div
              key={photo._id}
              className="group relative overflow-hidden cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-canvas/0 group-hover:bg-canvas/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-8 h-8 text-ivory"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </Masonry>

      {lightboxIndex !== null && (
        <Lightbox
          slides={slides}
          index={lightboxIndex}
          onClose={closeLightbox}
          onChange={setLightboxIndex}
        />
      )}
    </>
  );
}
