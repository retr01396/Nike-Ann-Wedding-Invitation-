"use strict";
"use client";

import React from "react";
import Image from "next/image";

interface AlbumPhotoProps {
  src: string;
  alt: string;
  orientation?: "portrait" | "landscape";
  caption?: string;
  location?: string;
  className?: string;
}

export const AlbumPhoto: React.FC<AlbumPhotoProps> = ({
  src,
  alt,
  orientation = "portrait",
  caption,
  location,
  className = "",
}) => {
  const isLandscape = orientation === "landscape";

  return (
    <div
      className={`group relative overflow-hidden rounded-lg p-2.5 sm:p-3 transition-transform duration-700 ease-out hover:scale-[1.015] ${className}`}
      style={{
        background: "linear-gradient(145deg, #25070d 0%, #150306 100%)",
        boxShadow:
          "0 24px 48px -12px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(202, 162, 77, 0.12), inset 0 1px 0 rgba(255, 240, 199, 0.2)",
      }}
    >
      {/* Outer gold archival border */}
      <div className="absolute inset-0 rounded-lg border border-[#caa24d]/25 pointer-events-none" />
      <div className="absolute inset-1 rounded-[6px] border border-[#caa24d]/10 border-dashed pointer-events-none" />

      {/* Decorative corner accents */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#e5c57b]/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#e5c57b]/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#e5c57b]/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#e5c57b]/60 pointer-events-none" />

      {/* Passe-partout archival matte frame */}
      <div
        className={`relative overflow-hidden rounded-[4px] bg-[#0d0104] ${
          isLandscape ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/5]"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          // Async decode off the main thread prevents the Android
          // half-decoded image flash when entering the Story section.
          decoding="async"
          priority={false}
        />

        {/* Soft vignette & subtle warm gold shimmer sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140306]/60 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-[#caa24d]/20 pointer-events-none" />

        {/* Location watermark chip on photo */}
        {location && (
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-[#160307]/80 backdrop-blur-sm border border-[#caa24d]/30 text-[10px] sm:text-[11px] font-serif tracking-widest text-[#fcedc7]/90 uppercase pointer-events-none">
            {location}
          </div>
        )}
      </div>

      {/* Optional bottom handwritten-style caption */}
      {caption && (
        <div className="pt-2 text-center">
          <p className="font-serif italic text-xs sm:text-sm text-[#e5c57b]/80 tracking-wide">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};
