"use strict";

import React from "react";
import Image from "next/image";
import { MapPinIcon } from "./TravelIcons";
import { weddingConfig } from "@/config/wedding";

interface TravelMapPreviewProps {
  title: string;
  cityLabel: string;
  mapPreviewImage?: string;
  isConfirmed?: boolean;
}

export const TravelMapPreview: React.FC<TravelMapPreviewProps> = ({
  title,
  cityLabel,
  mapPreviewImage = weddingConfig.images.directions.eventSpaceMap,
  isConfirmed = false,
}) => {
  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/10.5] rounded-none overflow-hidden border border-[#caa24d]/35 bg-[#140206] shadow-xl group cursor-default transition-all duration-500 hover:border-[#caa24d]/60">
      {/* Delicate Gold Corner Brackets (Luxury Stationery Frame) */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#caa24d]/60 pointer-events-none z-20" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#caa24d]/60 pointer-events-none z-20" />
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#caa24d]/60 pointer-events-none z-20" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#caa24d]/60 pointer-events-none z-20" />

      {/* Cartographic SVG Map Artwork */}
      <div className="relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105">
        <Image
          src={mapPreviewImage}
          alt={`Stylized cartographic map preview for ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          priority={false}
        />
      </div>

      {/* Subtle Vignette & Shading Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#100104]/90 via-transparent to-[#100104]/30 z-10" />

      {/* Center Radar Ripple Glow (Enhances the SVG pin on hover) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-16 h-16 rounded-full bg-[#caa24d]/10 animate-ping opacity-25" />
      </div>

      {/* Bottom Locality Badge matching Reference: "THRISSUR, KERALA" */}
      <div className="absolute bottom-3 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-20 px-3 text-center">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#120206]/85 border border-[#caa24d]/30 backdrop-blur-sm shadow-md">
          <MapPinIcon className="w-3 h-3 text-[#caa24d]" />
          <span className="font-serif text-[9px] sm:text-[10px] tracking-[0.25em] text-[#fff0c7] uppercase font-medium">
            {cityLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
