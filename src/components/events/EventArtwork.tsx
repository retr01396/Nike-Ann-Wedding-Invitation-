"use strict";
"use client";

import React from "react";
import Image from "next/image";

interface EventArtworkProps {
  src: string;
  alt: string;
  className?: string;
}

export const EventArtwork: React.FC<EventArtworkProps> = ({
  src,
  alt,
  className = "",
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-md p-1.5 transition-transform duration-700 ease-out hover:scale-[1.02] max-w-[280px] mx-auto ${className}`}
      style={{
        background: "linear-gradient(145deg, #22050b 0%, #120205 100%)",
        boxShadow:
          "0 12px 28px -8px rgba(0, 0, 0, 0.9), 0 0 20px -5px rgba(202, 162, 77, 0.1), inset 0 1px 0 rgba(255, 240, 199, 0.15)",
      }}
    >
      {/* Outer gold archival border */}
      <div className="absolute inset-0 rounded-md border border-[#caa24d]/25 pointer-events-none" />
      <div className="absolute inset-1 rounded-[4px] border border-[#caa24d]/15 border-dashed pointer-events-none" />

      {/* Delicate corner filigree accents */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#e5c57b]/60 pointer-events-none" />
      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#e5c57b]/60 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#e5c57b]/60 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#e5c57b]/60 pointer-events-none" />

      {/* Passe-partout image container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-[#0c0104]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 75vw, 280px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={false}
        />

        {/* Soft vignette & subtle warm gold sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140306]/60 via-transparent to-black/25 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-[#caa24d]/20 pointer-events-none" />
      </div>
    </div>
  );
};
