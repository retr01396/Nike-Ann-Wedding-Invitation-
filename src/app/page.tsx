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

      {/* Section 1: Hero & Interactive Physical Envelope Scene */}
      <EnvelopeScene />

      {/* Section 2: Slim Stationery Navigation Bar */}
      <StationeryNav />

      {/* Section 3: Our Story — 3-Column Editorial Magazine Spread */}
      <StorySection />

      {/* Section 4: Lower 3-Column Suite (The Celebration | Kindly RSVP | Getting There) */}
      <section
        id="events-rsvp-travel-suite"
        aria-label="Wedding Celebration, RSVP, and Directions"
        className="relative w-full max-w-6xl mx-auto my-8 sm:my-14 border-y border-[#caa24d]/25 bg-gradient-to-b from-[#180308]/85 via-[#120205]/90 to-[#0a0103]/90 backdrop-blur-sm shadow-[0_25px_60px_rgba(0,0,0,0.85)] select-none z-20"
      >
        {/* Left Edge Floral Framing with soft gradient feathering */}
        <div
          className="absolute top-0 -left-6 sm:-left-10 w-24 sm:w-32 h-full pointer-events-none overflow-hidden opacity-80 z-10 hidden md:block"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)",
            WebkitMaskComposite: "destination-in",
            maskComposite: "intersect",
          }}
        >
          <Image
            src="/images/wedding/lower-suite-edge-left.jpg"
            alt=""
            fill
            sizes="130px"
            className="object-cover object-left filter contrast-105"
          />
        </div>

        {/* Right Edge Velvet/Floral Framing with soft gradient feathering */}
        <div
          className="absolute top-0 -right-6 sm:-right-10 w-24 sm:w-32 h-full pointer-events-none overflow-hidden opacity-80 z-10 hidden md:block"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)",
            WebkitMaskComposite: "destination-in",
            maskComposite: "intersect",
          }}
        >
          <Image
            src="/images/wedding/lower-suite-edge-right.jpg"
            alt=""
            fill
            sizes="130px"
            className="object-cover object-right filter contrast-105"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#caa24d]/20 items-stretch">
          {/* Left Column: Event Details */}
          <EventsSection />

          {/* Center Column: Kindly RSVP */}
          <RSVPSection />

          {/* Right Column: Getting There (Travel) */}
          <TravelSection />
        </div>
      </section>

      {/* Section 5: Stationery Editorial Footer */}
      <StationeryFooter />
    </div>
  );
}
