"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { weddingConfig } from "@/config/wedding";
import { EventDetailsPanel } from "./EventDetailsPanel";
import { GoldGlowFrame } from "@/components/ui/GoldGlowFrame";
import {
  WeddingRingsIcon,
  VenuePinIcon,
  SuitTuxedoIcon,
  EveningDressIcon,
} from "./EventIcons";
import { X, ExternalLink, MapPin, Phone } from "lucide-react";
import { CleanDate } from "@/components/ui/CleanDate";

type DossierSectionKey = "wedding" | "reception" | "dress-code" | "programme" | "locations";

interface DossierTabItem {
  id: DossierSectionKey;
  label: string;
}

const DOSSIER_TABS: DossierTabItem[] = [
  { id: "wedding", label: "1. Wedding" },
  { id: "reception", label: "2. Reception" },
  { id: "dress-code", label: "3. Dress Code" },
  { id: "programme", label: "4. Programme" },
  { id: "locations", label: "5. Locations" },
];

export const EventsSection: React.FC = () => {
  const [activeDossierTab, setActiveDossierTab] = useState<DossierSectionKey | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weddingEvent = weddingConfig.events.events.find((e) => e.id === "wedding") || weddingConfig.events.events[0];
  const receptionEvent = weddingConfig.events.events.find((e) => e.id === "reception") || weddingConfig.events.events[1] || weddingEvent;
  const programme = weddingConfig.events.programmeSchedule ?? [];
  const closingNote = weddingConfig.events.closingNote ?? ["WE CAN'T WAIT", "TO CELEBRATE WITH YOU"];
  const destinations = weddingConfig.travel.destinations;

  // Prevent background scrolling while dossier modal is open
  useEffect(() => {
    if (activeDossierTab) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDossierTab]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDossierTab(null);
      }
    };
    if (activeDossierTab) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDossierTab]);

  const activeMapUrl = (() => {
    if (activeDossierTab === "wedding") return weddingEvent?.mapUrl;
    if (activeDossierTab === "reception") return receptionEvent?.mapUrl;
    if (activeDossierTab === "locations") return receptionEvent?.mapUrl;
    return undefined;
  })();

  return (
    <>
      <GoldGlowFrame id="events" className="h-full scroll-mt-16">
        <div className="flex flex-col h-full">
          <div className="flex-1 p-6 sm:p-8">
            {/* Eyebrow & Title */}
            <div className="text-center">
              <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.35em] text-[#caa24d] uppercase font-medium">
                {weddingConfig.events.badge}
              </span>
              <h3 className="mt-1.5 font-cinzel text-lg sm:text-xl tracking-[0.14em] text-[#fbf6ea] font-normal">
                {weddingConfig.events.title}
              </h3>
              <div className="w-6 h-[1px] bg-[#caa24d]/60 mx-auto mt-2.5" />
            </div>

            {/* Elegant Detail Rows */}
            <div className="mt-7 space-y-6">
              {/* Row 1: Wedding Ceremony */}
              <div
                onClick={() => setActiveDossierTab("wedding")}
                className="flex items-start gap-4 p-2 rounded-sm hover:bg-[#caa24d]/5 transition-colors cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label="View Wedding Ceremony details"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveDossierTab("wedding");
                  }
                }}
              >
                <div className="text-[#caa24d] mt-0.5 group-hover:scale-105 transition-transform shrink-0">
                  <WeddingRingsIcon size={24} className="text-[#caa24d]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] text-[#fbf6ea] uppercase font-medium">
                    WEDDING
                  </h4>
                  <p className="mt-1 font-serif text-xs text-[#ecd9b8]">
                    <CleanDate value={weddingConfig.date.formatted} />
                  </p>
                  <p className="font-serif font-medium text-xs sm:text-[13px] tracking-wide text-[#caa24d] mt-0.5">
                    <CleanDate value={weddingConfig.date.time || "3:00 PM IST"} />
                  </p>
                </div>
              </div>

              {/* Row 2: Venue */}
              <div
                onClick={() => setActiveDossierTab("wedding")}
                className="flex items-start gap-4 p-2 rounded-sm hover:bg-[#caa24d]/5 transition-colors cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label="View Venue details"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveDossierTab("wedding");
                  }
                }}
              >
                <div className="text-[#caa24d] mt-0.5 group-hover:scale-105 transition-transform shrink-0">
                  <VenuePinIcon size={22} className="text-[#caa24d]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] text-[#fbf6ea] uppercase font-medium">
                    VENUE
                  </h4>
                  <p className="mt-1 font-serif text-xs font-medium text-[#ecd9b8]">
                    {weddingEvent.venue}
                  </p>
                </div>
              </div>

              {/* Row 3: Dress Code */}
              <div
                onClick={() => setActiveDossierTab("dress-code")}
                className="flex items-start gap-4 p-2 rounded-sm hover:bg-[#caa24d]/5 transition-colors cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label="View Dress Code details"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveDossierTab("dress-code");
                  }
                }}
              >
                <div className="text-[#caa24d] mt-0.5 group-hover:scale-105 transition-transform shrink-0">
                  <SuitTuxedoIcon size={22} className="text-[#caa24d]" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] text-[#fbf6ea] uppercase font-medium">
                    DRESS CODE
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-0.5">
                    <div className="flex items-center gap-2">
                      <SuitTuxedoIcon size={18} className="text-[#caa24d] shrink-0" />
                      <div>
                        <span className="block font-cinzel text-[8.5px] sm:text-[9px] tracking-[0.2em] text-[#caa24d]/80 uppercase font-medium">
                          MEN
                        </span>
                        <span className="block font-serif text-xs text-[#ecd9b8]">
                          Suit Up
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <EveningDressIcon size={18} className="text-[#caa24d] shrink-0" />
                      <div>
                        <span className="block font-cinzel text-[8.5px] sm:text-[9px] tracking-[0.2em] text-[#caa24d]/80 uppercase font-medium">
                          LADIES
                        </span>
                        <span className="block font-serif text-xs text-[#ecd9b8]">
                          Elegant Evening Wear
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PROGRAMME SCHEDULE — verified day flow ── */}
            {programme.length > 0 && (
              <div className="mt-9">
                <div className="flex items-center gap-3">
                  <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#caa24d]/30" aria-hidden="true" />
                  <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] text-[#e5c57b]/90 uppercase">
                    Programme Schedule
                  </span>
                  <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#caa24d]/30" aria-hidden="true" />
                </div>

                <ol className="relative mt-5 ml-1 space-y-4 list-none m-0 p-0">
                  {/* Vertical stem linking the schedule nodes */}
                  <span
                    aria-hidden="true"
                    className="absolute left-[4px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#caa24d]/45 via-[#caa24d]/25 to-transparent"
                  />
                  {programme.map((item) => (
                    <li key={item.time} className="relative grid grid-cols-[minmax(112px,auto)_1fr] sm:grid-cols-[minmax(150px,auto)_1fr] items-start gap-x-3 sm:gap-x-4 gap-y-1 pl-5">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[7px] w-[9px] h-[9px] rounded-full border border-[#e5c57b]/70 bg-[#2a070e]"
                        style={{ boxShadow: "0 0 8px rgba(233,196,124,0.35)" }}
                      />
                      <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.1em] text-[#fff0c7] whitespace-nowrap">
                        <CleanDate value={item.time} />
                      </span>
                      <span className="font-serif text-[11.5px] sm:text-xs text-[#d9c5a3]/90">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Celebration note with rose ornament — preserved footer */}
          <div className="relative px-6 sm:px-8 pb-7 pt-2 text-center">
            <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] text-[#e5c57b]/90 uppercase leading-relaxed">
              {closingNote.map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </p>
            {/* Rose ornament */}
            <div
              className="mt-3.5 mx-auto w-10 h-6 opacity-90"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 45% 60% at 50% 40%, #7d1f33 0%, #57121f 55%, transparent 75%), radial-gradient(ellipse 30% 40% at 38% 55%, #a8354b 0%, transparent 70%), radial-gradient(ellipse 30% 40% at 63% 55%, #a8354b 0%, transparent 70%)",
                filter: "blur(0.4px)",
              }}
            />
          </div>
        </div>
      </GoldGlowFrame>

      {/* =========================================================================
          INTERACTIVE FULL CELEBRATION DOSSIER MODAL
          Rendered via React Portal directly into document.body to ensure
          it pops up above all page layers, free of any parent container clipping
         ========================================================================= */}
      {mounted &&
        activeDossierTab &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Celebration Dossier"
            onClick={() => setActiveDossierTab(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl sm:max-w-2xl max-h-[88vh] rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1c0409] via-[#120205] to-[#0a0103] border border-[#caa24d]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(202,162,77,0.25)] flex flex-col overflow-hidden"
            >
              {/* Delicate gold corner accents */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#caa24d]/60 pointer-events-none z-20" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#caa24d]/60 pointer-events-none z-20" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#caa24d]/60 pointer-events-none z-20" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#caa24d]/60 pointer-events-none z-20" />

              {/* Modal Header */}
              <div className="px-5 sm:px-7 py-4 border-b border-[#caa24d]/30 flex items-center justify-between bg-[#190307]">
                <div>
                  <span className="font-cinzel text-[8.5px] sm:text-[9px] tracking-[0.3em] text-[#caa24d] uppercase font-medium">
                    THE CELEBRATION DOSSIER
                  </span>
                  <h3 className="font-cinzel text-base sm:text-xl text-[#fbf6ea] tracking-[0.12em] font-normal mt-0.5">
                    WEDDING DETAILS &amp; PROTOCOLS
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDossierTab(null)}
                  className="w-8 h-8 rounded-full border border-[#caa24d]/40 flex items-center justify-center text-[#caa24d] hover:text-[#fff0c7] hover:border-[#caa24d] hover:bg-[#caa24d]/15 transition-all cursor-pointer shadow-sm"
                  aria-label="Close celebration dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dossier Tabs Switcher — 5 verified sections */}
              <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-[#caa24d]/20 bg-[#130205] flex items-center gap-2 overflow-x-auto">
                {DOSSIER_TABS.map((tab) => {
                  const isActive = activeDossierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveDossierTab(tab.id)}
                      className={`px-3 py-1.5 font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase transition-all whitespace-nowrap cursor-pointer border rounded-sm ${
                        isActive
                          ? "bg-[#caa24d]/25 border-[#caa24d] text-[#fff0c7] font-medium shadow-[0_0_12px_rgba(202,162,77,0.25)]"
                          : "bg-transparent border-[#caa24d]/20 text-[#caa24d]/70 hover:border-[#caa24d]/50 hover:text-[#e5c57b]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-5 sm:p-7 overflow-y-auto max-h-[calc(88vh-135px)] flex-1">
                {/* SECTION 1: WEDDING */}
                {activeDossierTab === "wedding" && (
                  <div>
                    <div className="mb-2">
                      <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#caa24d] uppercase">
                        {weddingEvent.badge || "THE SACRED CEREMONY"}
                      </span>
                      <h4 className="font-cinzel text-base sm:text-lg text-[#fbf6ea] tracking-wide mt-0.5">
                        {weddingEvent.title}
                      </h4>
                      {weddingEvent.subtitle && (
                        <p className="font-serif italic text-xs text-[#caa24d]/80 mt-0.5">
                          {weddingEvent.subtitle}
                        </p>
                      )}
                    </div>
                    <EventDetailsPanel event={weddingEvent} />
                  </div>
                )}

                {/* SECTION 2: RECEPTION */}
                {activeDossierTab === "reception" && (
                  <div>
                    <div className="mb-2">
                      <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#caa24d] uppercase">
                        {receptionEvent.badge || "THE CELEBRATION"}
                      </span>
                      <h4 className="font-cinzel text-base sm:text-lg text-[#fbf6ea] tracking-wide mt-0.5">
                        {receptionEvent.title}
                      </h4>
                      {receptionEvent.subtitle && (
                        <p className="font-serif italic text-xs text-[#caa24d]/80 mt-0.5">
                          {receptionEvent.subtitle}
                        </p>
                      )}
                    </div>
                    <EventDetailsPanel event={receptionEvent} />
                  </div>
                )}

                {/* SECTION 3: DRESS CODE */}
                {activeDossierTab === "dress-code" && (
                  <div className="space-y-5">
                    <div>
                      <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#caa24d] uppercase">
                        ATTIRE GUIDELINES
                      </span>
                      <h4 className="font-cinzel text-base sm:text-lg text-[#fbf6ea] tracking-wide mt-0.5">
                        DRESS CODE
                      </h4>
                      <p className="font-serif italic text-xs text-[#caa24d]/80 mt-0.5">
                        Formal Wedding Celebration
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Men */}
                      <div className="p-5 rounded-none border border-[#caa24d]/30 bg-[#160307]/90 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-[#20050c] border border-[#caa24d]/30">
                            <SuitTuxedoIcon size={28} className="text-[#caa24d]" />
                          </div>
                          <div>
                            <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#caa24d] uppercase font-medium">
                              MEN
                            </span>
                            <h5 className="font-serif text-base text-[#fff0c7]">
                              Suit Up
                            </h5>
                          </div>
                        </div>
                        <p className="font-sans text-xs text-[#d1bfa7] leading-relaxed font-light">
                          Gentlemen are kindly requested to wear formal suits or tuxedos for the ceremony and evening celebration.
                        </p>
                      </div>

                      {/* Ladies */}
                      <div className="p-5 rounded-none border border-[#caa24d]/30 bg-[#160307]/90 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-[#20050c] border border-[#caa24d]/30">
                            <EveningDressIcon size={28} className="text-[#caa24d]" />
                          </div>
                          <div>
                            <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#caa24d] uppercase font-medium">
                              LADIES
                            </span>
                            <h5 className="font-serif text-base text-[#fff0c7]">
                              Elegant Evening Wear
                            </h5>
                          </div>
                        </div>
                        <p className="font-sans text-xs text-[#d1bfa7] leading-relaxed font-light">
                          Ladies are invited to wear elegant evening wear or formal celebratory attire.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 4: PROGRAMME */}
                {activeDossierTab === "programme" && (
                  <div className="space-y-5">
                    <div>
                      <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#caa24d] uppercase">
                        DAY FLOW
                      </span>
                      <h4 className="font-cinzel text-base sm:text-lg text-[#fbf6ea] tracking-wide mt-0.5">
                        PROGRAMME SCHEDULE
                      </h4>
                      <p className="font-serif italic text-xs text-[#caa24d]/80 mt-0.5">
                        <CleanDate value="Sunday, 15 November 2026" />
                      </p>
                    </div>

                    <div className="relative pl-6 space-y-6 pt-2">
                      <span
                        aria-hidden="true"
                        className="absolute left-[7px] top-3 bottom-3 w-[1px] bg-gradient-to-b from-[#caa24d]/50 via-[#caa24d]/30 to-transparent"
                      />
                      {programme.map((item) => (
                      <div key={item.time} className="relative grid grid-cols-[minmax(130px,auto)_1fr] gap-x-4 gap-y-1 items-start">
                          <span
                            aria-hidden="true"
                            className="absolute -left-[19px] top-[4px] w-[11px] h-[11px] rounded-full border border-[#e5c57b] bg-[#2a070e]"
                            style={{ boxShadow: "0 0 10px rgba(233,196,124,0.4)" }}
                          />
                          <span className="font-cinzel text-xs tracking-wider text-[#fff0c7] font-medium"><CleanDate value={item.time} /></span>
                          <p className="font-serif text-sm text-[#ecd9b8]">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-[#caa24d]/20 text-center">
                      <p className="font-cinzel text-[9.5px] sm:text-[10.5px] tracking-[0.28em] text-[#e5c57b]/90 uppercase">
                        WE CAN&apos;T WAIT TO CELEBRATE WITH YOU
                      </p>
                    </div>
                  </div>
                )}

                {/* SECTION 5: LOCATIONS */}
                {activeDossierTab === "locations" && (
                  <div className="space-y-5">
                    <div>
                      <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#caa24d] uppercase">
                        ALL DESTINATIONS
                      </span>
                      <h4 className="font-cinzel text-base sm:text-lg text-[#fbf6ea] tracking-wide mt-0.5">
                        LOCATIONS
                      </h4>
                      <p className="font-serif italic text-xs text-[#caa24d]/80 mt-0.5">
                        Essential navigation for our celebration
                      </p>
                    </div>

                    <div className="space-y-4">
                      {destinations.map((dest) => (
                        <div
                          key={dest.id}
                          className="p-4 rounded-none border border-[#caa24d]/30 bg-[#160307]/90 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#caa24d] uppercase font-medium">
                              {dest.category}
                            </span>
                            {dest.mapUrl && (
                              <a
                                href={dest.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#caa24d] hover:text-[#fff0c7] font-cinzel tracking-wider"
                              >
                                <span>MAPS</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <h5 className="font-serif text-base font-medium text-[#fff0c7]">
                            {dest.title}
                          </h5>

                          <div className="flex items-start gap-2 pt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#caa24d] shrink-0 mt-0.5" />
                            <p className="font-sans text-xs text-[#d1bfa7] leading-relaxed font-light">{dest.cityLabel}</p>
                          </div>

                          {dest.phone && (
                            <div className="flex items-center gap-2 pt-0.5 text-xs font-sans text-[#e5c57b]/90">
                              <Phone className="w-3.5 h-3.5 text-[#caa24d]" />
                              <span>Phone: {dest.phone}</span>
                            </div>
                          )}
                          {dest.contacts?.map((contact) => (
                            <div key={contact} className="flex items-center gap-2 pt-0.5 text-xs font-sans text-[#e5c57b]/90">
                              <Phone className="w-3.5 h-3.5 text-[#caa24d]" />
                              <span>{contact}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-5 sm:px-7 py-3 border-t border-[#caa24d]/25 bg-[#120205] flex items-center justify-between">
                {activeMapUrl ? (
                  <a
                    href={activeMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#caa24d] hover:text-[#fff0c7] font-cinzel tracking-wider"
                  >
                    <span>OPEN IN GOOGLE MAPS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => setActiveDossierTab(null)}
                  className="px-4 py-1.5 rounded-sm border border-[#caa24d]/50 text-[#caa24d] hover:bg-[#caa24d]/15 hover:border-[#caa24d] hover:text-[#fff0c7] text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
                >
                  CLOSE DOSSIER
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
