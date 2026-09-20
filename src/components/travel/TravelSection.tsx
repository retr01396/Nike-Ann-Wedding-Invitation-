"use client";

import React, { useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { GoldGlowFrame } from "@/components/ui/GoldGlowFrame";
import { MapPin, ExternalLink, Car, ChevronDown, ChevronUp } from "lucide-react";

export const TravelSection: React.FC = () => {
  const destinations = weddingConfig.travel.destinations;
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || "church");
  const [showAllInFlow, setShowAllInFlow] = useState(false);

  const selectedDest =
    destinations.find((d) => d.id === selectedDestId) || destinations[0];

  return (
    <GoldGlowFrame id="directions" className="h-full scroll-mt-16">
      <span id="travel" className="sr-only" aria-hidden="true" />

      <div className="flex flex-col h-full p-6 sm:p-8">
        {/* Eyebrow & Title matching reference */}
        <div className="text-center">
          <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.35em] text-[#caa24d] uppercase font-medium">
            {weddingConfig.travel.badge}
          </span>
          <h3 className="mt-1.5 font-cinzel text-lg sm:text-xl tracking-[0.14em] text-[#fbf6ea] font-normal">
            {weddingConfig.travel.title}
          </h3>
          <p className="mt-1.5 font-serif italic text-[11px] text-[#caa24d]/85">
            Find your way to our special day
          </p>
        </div>

        {/* 3 Location Selector Tabs */}
        <div className="mt-6 grid grid-cols-3 gap-1.5 p-1 bg-[#150206]/80 border border-[#caa24d]/25">
          {destinations.map((dest) => {
            const isActive = dest.id === selectedDest.id;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedDestId(dest.id)}
                className={`py-1.5 px-1 text-center font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.12em] uppercase transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#caa24d]/25 text-[#fff0c7] font-semibold border border-[#caa24d]/60 shadow-inner"
                    : "text-[#d8b257]/70 hover:text-[#fff0c7] hover:bg-[#caa24d]/10 border border-transparent"
                }`}
                aria-pressed={isActive}
              >
                {dest.category}
              </button>
            );
          })}
        </div>

        {/* Editorial Dark Cartography Map Card */}
        <div className="mt-5 relative w-full h-[150px] sm:h-[170px] rounded-none overflow-hidden border border-[#caa24d]/25 shadow-[0_10px_25px_rgba(0,0,0,0.8)] group">
          <Image
            src={selectedDest.mapPreviewImage || weddingConfig.images.directions.eventSpaceMap}
            alt={`Dark cartography map preview for ${selectedDest.title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-center filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Map Info Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 bg-black/35">
            <div className="w-7 h-7 rounded-full bg-[#1b0408]/90 border border-[#caa24d]/60 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5 text-[#caa24d]" />
            </div>
            <p className="mt-1.5 font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.22em] text-[#fff0c7] uppercase font-medium drop-shadow-md leading-relaxed">
              {selectedDest.title}
              <span className="block mt-0.5 text-[#e5c57b]/85">
                {selectedDest.cityLabel}
              </span>
            </p>
          </div>
        </div>

        {/* Key travel facts — matching the reference's icon rows */}
        <div className="mt-5 space-y-3 text-left">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#caa24d] shrink-0 mt-0.5" />
            <p className="font-sans text-[11px] text-[#ecd9b8]/85 font-light leading-relaxed">
              {selectedDest.address.replace(/\s*\[.*?\]\s*/g, " ").trim()}
            </p>
          </div>
          {selectedDest.estimatedTravelTime && (
            <div className="flex items-start gap-2.5">
              <Car className="w-3.5 h-3.5 text-[#caa24d] shrink-0 mt-0.5" />
              <p className="font-sans text-[11px] text-[#ecd9b8]/85 font-light">
                {selectedDest.estimatedTravelTime}
              </p>
            </div>
          )}
        </div>

        {/* Action Button: OPEN IN GOOGLE MAPS */}
        <div className="mt-6 flex flex-col items-center flex-1 justify-end">
          <a
            href={selectedDest.mapUrl || "https://maps.google.com/?q=Thrissur+Kerala"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 text-center border border-[#caa24d]/50 bg-transparent text-[#e5c57b] font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase hover:bg-[#caa24d]/10 hover:border-[#caa24d] hover:text-[#fff0c7] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>OPEN IN GOOGLE MAPS</span>
            <span className="text-xs">→</span>
          </a>

          {/* Secondary In-flow Toggle to see all 3 destinations without any modal */}
          <button
            type="button"
            onClick={() => setShowAllInFlow(!showAllInFlow)}
            className="mt-3 mb-1 text-[#caa24d]/75 hover:text-[#fff0c7] font-cinzel text-[8.5px] tracking-[0.2em] uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>{showAllInFlow ? "HIDE ALL LOCATIONS" : "VIEW ALL LOCATIONS"}</span>
            {showAllInFlow ? (
              <ChevronUp className="w-3 h-3 text-[#caa24d]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#caa24d]" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          IN-FLOW VIEW FOR ALL 3 LOCATIONS
          Purely rendered in-flow with ZERO modal or overlay dialogs
         ========================================================================= */}
      {showAllInFlow && (
        <div className="px-6 sm:px-7 pb-6 mt-2 pt-4 border-t border-[#caa24d]/25 space-y-3.5 animate-fade-in text-left">
          {destinations.map((dest, idx) => (
            <div
              key={dest.id}
              className={`p-3 rounded-none border transition-colors ${
                dest.id === selectedDest.id
                  ? "bg-[#1f050b]/90 border-[#caa24d]/50"
                  : "bg-[#140205]/80 border-[#caa24d]/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-[9px] tracking-[0.2em] text-[#caa24d] uppercase font-medium">
                  {idx + 1}. {dest.category}
                </span>
                <a
                  href={dest.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10.5px] text-[#caa24d] hover:text-[#fff0c7] font-cinzel tracking-wider"
                >
                  <span>MAPS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h4 className="font-cinzel text-xs text-[#fbf6ea] mt-1">
                {dest.title}
              </h4>
              <p className="font-serif italic text-[11px] text-[#caa24d]/85">
                {dest.subtitle}
              </p>
              <p className="text-[11px] text-[#ecd9b8]/80 font-sans mt-0.5">
                {dest.address.replace(/\s*\[.*?\]\s*/g, " ").trim()}
              </p>
              {dest.parkingInfo && (
                <p className="text-[10.5px] text-[#caa24d]/75 font-sans mt-1">
                  <strong>Parking:</strong> {dest.parkingInfo}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </GoldGlowFrame>
  );
};
