"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LivingBackground } from "@/components/background/LivingBackground";
import { MonogramIntro } from "@/components/intro/MonogramIntro";
import { EnvelopeScene } from "@/components/envelope/EnvelopeScene";
import { StationeryNav } from "@/components/navigation/StationeryNav";
import { StorySection } from "@/components/story/StorySection";
import { EventsSection } from "@/components/events/EventsSection";
import { RSVPSection } from "@/components/rsvp/RSVPSection";
import { TravelSection } from "@/components/travel/TravelSection";
import { StationeryFooter } from "@/components/footer/StationeryFooter";
import { BackgroundMusic } from "@/components/audio/BackgroundMusic";

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-transparent text-[#fbf6ea]">
      {/* Living Atmospheric Environment (Dark Velvet, Golden embers) */}
      <LivingBackground />

      {/* Opening N/A Monogram Sequence */}
      {!introFinished && (
        <MonogramIntro onComplete={() => setIntroFinished(true)} />
      )}

      {/* Section 1: Slim Stationery Navigation Bar (Top bar matching reference) */}
      <StationeryNav />

      {/* Section 2: Hero & Interactive Physical Envelope Scene */}
      <EnvelopeScene />

      {/* Section 3: Our Story — Cinematic Vertical Timeline */}
      <StorySection />

      {/* Section 4: Lower Suite — The Celebration | Getting There | Kindly RSVP
          Three smoked-burgundy liquid-glass panels. Atmospheric tint is a
          pure radial-gradient (no CSS filter) so it composites without
          triggering full-page GPU raster repaints on every scroll frame. */}
      <section
        id="events-rsvp-travel-suite"
        aria-label="Wedding Celebration, Getting There, and RSVP"
        className="relative w-full max-w-6xl mx-auto my-10 sm:my-16 px-4 sm:px-0 select-none z-20"
      >
        {/* Scoped atmospheric tint — pure gradient, no filter, zero raster cost */}
        <div
          aria-hidden="true"
          className="absolute -inset-x-6 -inset-y-10 sm:-inset-x-10 sm:-inset-y-14 pointer-events-none rounded-[60px]"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 50% 48%, rgba(74,8,18,0.52) 0%, rgba(50,5,13,0.38) 38%, rgba(28,3,8,0.18) 62%, rgba(10,1,3,0.0) 80%)",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {/* Column 1: The Celebration (Event Details) */}
          <EventsSection />

          {/* Column 2: Getting There (Travel & Directions) */}
          <TravelSection />

          {/* Column 3: Kindly RSVP */}
          <RSVPSection />
        </div>
      </section>

      {/* Section 5: Stationery Editorial Footer */}
      <StationeryFooter />

      {/* Background Wedding Music Controller */}
      <BackgroundMusic />
    </div>
  );
}
