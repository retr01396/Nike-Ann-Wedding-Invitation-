"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { weddingConfig } from "@/config/wedding";
import type { TimelineMilestone } from "@/types/wedding";
import { X, BookOpen } from "lucide-react";

const EASE_LUX = [0.22, 1, 0.36, 1] as const;

const fadeSlide = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, delay, ease: EASE_LUX },
});

/* ------------------------------------------------------------------ */
/* Single Milestone Row                                               */
/* ------------------------------------------------------------------ */
const MilestoneRow: React.FC<{
  milestone: TimelineMilestone;
  isLast?: boolean;
}> = ({ milestone, isLast = false }) => {
  return (
    <li className="relative grid grid-cols-[64px_1fr] sm:grid-cols-[84px_1fr] md:grid-cols-[96px_1fr] gap-4 sm:gap-6 md:gap-7 items-start pb-8 sm:pb-11 md:pb-12 last:pb-0">
      {/* ── LEFT: Circular framed milestone portrait ─────────────────────── */}
      <motion.div {...fadeSlide(0.05)} className="relative col-start-1 row-start-1">
        <div
          className="relative aspect-square rounded-full p-[2px] w-14 sm:w-[76px] md:w-[88px] mx-auto"
          style={{
            background:
              "linear-gradient(135deg, #e8c987 0%, #a37c2e 50%, #d9b46a 100%)",
            boxShadow:
              "0 10px 24px rgba(0,0,0,0.85), 0 0 16px rgba(202,162,77,0.25)",
          }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0d0104]">
            <Image
              src={milestone.image}
              alt={milestone.imageAlt}
              fill
              sizes="(max-width: 640px) 56px, (max-width: 768px) 76px, 88px"
              className="object-cover object-center"
            />
            {/* Subtle inner vignette */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.08] via-transparent to-black/40 pointer-events-none" />
          </div>
        </div>

        {/* Luminous Node on the connecting line */}
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE_LUX }}
          className="absolute top-1/2 -translate-y-1/2 -right-[6px] sm:-right-[8px] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-[#8c6b24] via-[#fff0c7] to-[#caa24d] shadow-[0_0_12px_rgba(255,240,199,0.9)] border border-[#fff0c7]/80"
          aria-hidden="true"
        >
          <span className="absolute inset-[3px] rounded-full bg-[#1b0409]" />
        </motion.span>
      </motion.div>

      {/* ── RIGHT: Date tag + milestone narrative ─────────────────────────── */}
      <div className="col-start-2 row-start-1 min-w-0 pt-0.5">
        <motion.span
          {...fadeSlide(0.1)}
          className="block font-cinzel text-xs sm:text-sm tracking-[0.25em] text-[#fff0c7] font-medium"
        >
          {milestone.year}
        </motion.span>

        <motion.h3
          {...fadeSlide(0.14)}
          className="mt-0.5 font-serif text-sm sm:text-base text-[#fbf6ea] font-medium tracking-wide"
        >
          {milestone.title}
        </motion.h3>

        <motion.p
          {...fadeSlide(0.18)}
          className="mt-1 font-serif text-[11px] sm:text-[12.5px] text-[#c9b190]/90 leading-relaxed max-w-sm"
        >
          {milestone.shortDescription ?? milestone.description}
        </motion.p>
      </div>
    </li>
  );
};

/* ------------------------------------------------------------------ */
/* Master Story Section                                                */
/* ------------------------------------------------------------------ */
export const StorySection: React.FC = () => {
  const lineWrapRef = useRef<HTMLDivElement>(null);
  const [isFullStoryOpen, setIsFullStoryOpen] = useState(false);
  const { storyTimeline, storyIntro } = weddingConfig;

  // Prevent background scrolling while reading modal is open
  useEffect(() => {
    if (isFullStoryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullStoryOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullStoryOpen(false);
    };
    if (isFullStoryOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullStoryOpen]);

  // Scroll-driven luminous line that draws top-to-bottom through the track
  const { scrollYProgress } = useScroll({
    target: lineWrapRef,
    offset: ["start 70%", "end 65%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  return (
    <section
      id="our-story"
      aria-label="Our Story"
      className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-20 select-none scroll-mt-16"
    >
      {/* Anchor alias for #story */}
      <span id="story" className="sr-only" aria-hidden="true" />

      {/* Main Grid: Polaroids on Left | Intro Content | Vertical Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1.15fr] gap-8 sm:gap-10 lg:gap-14 items-start justify-center">
        
        {/* ═══ 1. LEFT: VINTAGE POLAROID PHOTO STACK (matching reference) ═══ */}
        <motion.div
          {...fadeSlide(0.05)}
          className="relative w-full max-w-[310px] sm:max-w-[340px] mx-auto lg:mx-0 order-1 pt-2 sm:pt-4"
        >
          {/* Top Polaroid: Tree Sculpture ("First steps") */}
          <div
            className="relative w-[230px] sm:w-[250px] bg-[#f8f3ea] p-3 pb-8 shadow-[0_18px_40px_rgba(0,0,0,0.88)] border border-[#e4d9c3] rounded-sm transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10"
          >
            {/* Washi Tape: First steps */}
            <div
              className="absolute -top-3 left-4 px-3 py-0.5 bg-[#eadecb]/95 backdrop-blur-sm border border-[#cebe9f] shadow-sm transform -rotate-2"
            >
              <span className="font-script text-base sm:text-lg text-[#3b0914] tracking-wide">
                First steps
              </span>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#180306]">
              <Image
                src={storyIntro.polaroids?.top.image || weddingConfig.images.story.editorial.polaroid01}
                alt={storyIntro.polaroids?.top.alt || "Nike and Ann with sculpture"}
                fill
                sizes="250px"
                className="object-cover object-top filter contrast-[1.03] brightness-[0.98]"
              />
            </div>
          </div>

          {/* Bottom Polaroid: Festive Evening Wear ("Forever feels right") */}
          <div
            className="relative w-[230px] sm:w-[250px] bg-[#f8f3ea] p-3 pb-8 shadow-[0_24px_50px_rgba(0,0,0,0.92)] border border-[#e4d9c3] rounded-sm transform rotate-4 hover:rotate-1 transition-transform duration-500 -mt-16 sm:-mt-20 ml-16 sm:ml-20 z-20"
          >
            {/* Washi Tape: Forever feels right */}
            <div
              className="absolute -top-3 right-5 px-3.5 py-0.5 bg-[#eadecb]/95 backdrop-blur-sm border border-[#cebe9f] shadow-sm transform rotate-1"
            >
              <span className="font-script text-base sm:text-lg text-[#3b0914] tracking-wide">
                Forever feels right
              </span>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#180306]">
              <Image
                src={storyIntro.polaroids?.bottom.image || weddingConfig.images.story.editorial.polaroid02}
                alt={storyIntro.polaroids?.bottom.alt || "Nike and Ann in festive evening attire"}
                fill
                sizes="250px"
                className="object-cover object-center filter contrast-[1.03] brightness-[0.98]"
              />
            </div>
          </div>
        </motion.div>

        {/* ═══ 2. CENTER-LEFT: EDITORIAL NARRATIVE & CTA ═══ */}
        <div className="order-2 lg:order-2 flex flex-col justify-start pt-2 sm:pt-4 max-w-md mx-auto lg:mx-0">
          <motion.div {...fadeSlide(0.08)} className="flex items-center gap-3">
            <span className="inline-block w-8 h-[1px] bg-[#caa24d]/60" aria-hidden="true" />
            <span className="font-cinzel text-[9.5px] sm:text-[10.5px] tracking-[0.38em] text-[#caa24d] uppercase font-medium">
              OUR STORY
            </span>
          </motion.div>

          <motion.h2
            {...fadeSlide(0.12)}
            className="mt-3 font-display text-2xl sm:text-3xl lg:text-[32px] tracking-[0.14em] text-[#f3ead6] font-normal leading-snug"
          >
            TWO SOULS,
            <br />
            A SHARED JOURNEY
          </motion.h2>

          <motion.p
            {...fadeSlide(0.16)}
            className="mt-4 font-serif text-xs sm:text-sm text-[#c9b190] leading-relaxed"
          >
            Some stories begin with a chance encounter. Ours began with our families, a little faith, and a matrimonial site.
          </motion.p>

          <motion.div {...fadeSlide(0.2)}>
            <button
              type="button"
              onClick={() => setIsFullStoryOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-[#caa24d]/45 text-[#e5c57b] font-cinzel text-[9px] sm:text-[10px] tracking-[0.28em] uppercase hover:bg-[#caa24d]/10 hover:border-[#caa24d] hover:text-[#fff0c7] transition-all cursor-pointer shadow-sm"
            >
              <span>READ OUR FULL STORY</span>
              <span className="text-xs">→</span>
            </button>
          </motion.div>

          {/* Script calligraphy: Perhaps / It Was / Grace */}
          <motion.div
            {...fadeSlide(0.24)}
            className="mt-8 sm:mt-12 pt-4 border-t border-[#caa24d]/15 flex items-start gap-3"
          >
            <p
              className="font-script text-2xl sm:text-3xl text-[#e5c57b]/90 leading-[1.35] -rotate-2 origin-left"
              style={{ textShadow: "0 2px 16px rgba(202,162,77,0.25)" }}
            >
              Perhaps
              <br />
              It Was
              <br />
              Grace
            </p>
          </motion.div>
        </div>

        {/* ═══ 3. CENTER: ANIMATED VERTICAL TIMELINE ═══ */}
        <div ref={lineWrapRef} className="relative order-3 mx-auto lg:mx-0 w-full max-w-md pt-2 sm:pt-4">
          {/* Connecting vertical line */}
          <div
            className="absolute left-[30px] sm:left-[41px] md:left-[47px] top-4 bottom-4 w-[2px] pointer-events-none"
            aria-hidden="true"
          >
            {/* Guide line */}
            <div className="absolute inset-0 w-[1px] mx-auto bg-[#caa24d]/20" />
            {/* Illuminated drawn line */}
            <motion.div
              style={{ scaleY: lineScale, transformOrigin: "top" }}
              className="absolute inset-0 w-[2px] bg-gradient-to-b from-[#e5c57b] via-[#fff0c7] to-[#caa24d] shadow-[0_0_12px_rgba(255,240,199,0.65)]"
            />
          </div>

          <ol className="relative z-10 list-none m-0 p-0">
            {storyTimeline.milestones.map((milestone, i) => (
              <MilestoneRow
                key={milestone.id}
                milestone={milestone}
                isLast={i === storyTimeline.milestones.length - 1}
              />
            ))}
          </ol>
        </div>
      </div>

      {/* ═══ FULL STORY READING MODAL (Stationery Dossier Dialog) ═══ */}
      <AnimatePresence>
        {isFullStoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-text">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullStoryOpen(false)}
              className="absolute inset-0 bg-[#0a0103]/85 backdrop-blur-xl"
            />

            {/* Modal Dialog Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: EASE_LUX }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#1e040a] via-[#140206] to-[#0d0104] border border-[#caa24d]/40 rounded-xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsFullStoryOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#caa24d]/30 bg-[#2b0711]/60 flex items-center justify-center text-[#caa24d] hover:text-[#fff0c7] hover:border-[#caa24d] transition-colors cursor-pointer"
                aria-label="Close story dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="text-center pb-6 border-b border-[#caa24d]/20">
                <div className="flex items-center justify-center gap-2 text-[#caa24d] mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-cinzel text-[9.5px] tracking-[0.35em] uppercase">
                    OUR JOURNEY
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl tracking-wide text-[#fff0c7]">
                  {storyIntro.fullStoryTitle || "Perhaps It Was Grace"}
                </h3>
                <p className="mt-1 font-serif italic text-xs text-[#caa24d]/80">
                  Nike &amp; Ann&apos;s True Story
                </p>
              </div>

              {/* Story Narrative Paragraphs */}
              <div className="mt-6 space-y-4 font-serif text-sm sm:text-base text-[#ecd9b8]/90 leading-relaxed">
                {(storyIntro.fullStory || []).map((paragraph, idx) => (
                  <p key={idx} className={idx === 0 ? "text-base sm:text-lg text-[#fff0c7] italic font-serif leading-relaxed" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Modal Closing Button */}
              <div className="mt-8 pt-6 border-t border-[#caa24d]/20 text-center">
                <button
                  type="button"
                  onClick={() => setIsFullStoryOpen(false)}
                  className="px-6 py-2 border border-[#caa24d]/40 text-[#e5c57b] font-cinzel text-[9.5px] tracking-[0.25em] uppercase hover:bg-[#caa24d]/10 transition-colors cursor-pointer"
                >
                  CLOSE READING
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
