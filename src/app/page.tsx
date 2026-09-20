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

      {/* Section 4: Lower Suite — The Celebration | Kindly RSVP | Getting There
          Three smoked-burgundy liquid-glass panels. The dark crimson bloom
          tint lives ONLY here — never behind the hero envelope. */}
      <section
        id="events-rsvp-travel-suite"
        aria-label="Wedding Celebration, RSVP, and Directions"
        className="relative w-full max-w-6xl mx-auto my-10 sm:my-16 px-4 sm:px-0 select-none z-20"
      >
        {/* Scoped atmospheric tint: blurred dark-crimson bloom + gentle radial
            darkness hugging the panel band; background florals stay visible
            around it. */}
        <div
          aria-hidden="true"
          className="absolute -inset-x-6 -inset-y-10 sm:-inset-x-10 sm:-inset-y-14 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 72% 62% at 50% 45%, rgba(74,8,18,0.55) 0%, rgba(40,4,10,0.35) 55%, rgba(20,2,6,0.0) 82%)",
            filter: "blur(30px)",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {/* The Celebration */}
          <EventsSection />

          {/* Kindly RSVP — liquid glass panel */}
          <RSVPSection />

          {/* Getting There (Travel) */}
          <TravelSection />
        </div>
      </section>

      {/* Section 5: Stationery Editorial Footer */}
      <StationeryFooter />

      {/* Background Wedding Music Controller */}
      <BackgroundMusic />
    </div>
  );
}
