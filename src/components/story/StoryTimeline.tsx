"use strict";
"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { weddingConfig } from "@/config/wedding";
import { TimelineItem } from "./TimelineItem";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const StoryTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const bgPathRef = useRef<SVGPathElement>(null);
  const sparkRef = useRef<SVGCircleElement>(null);

  // Refs for RAF-batching scroll-driven state updates
  const pendingActiveRef = useRef<boolean[] | null>(null);
  const rafActiveRef = useRef<number>(0);

  const { storyTimeline } = weddingConfig;
  const [activeIndices, setActiveIndices] = useState<boolean[]>(
    new Array(storyTimeline.milestones.length).fill(false)
  );
  const [lineHeight, setLineHeight] = useState<number>(1000);

  // Measure timeline height — debounced to avoid layout thrashing on resize
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    const measureHeight = () => {
      if (trackRef.current) {
        const height = trackRef.current.offsetHeight;
        setLineHeight(Math.max(height, 500));
      }
    };

    const updateDimensions = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(measureHeight, 150);
    };

    measureHeight(); // measure immediately on mount
    window.addEventListener("resize", updateDimensions, { passive: true });

    // Extra check after images potentially load and shift layout
    const timer = setTimeout(measureHeight, 500);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(debounceTimer);
      clearTimeout(timer);
    };
  }, [storyTimeline.milestones.length]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const glowPath = glowPathRef.current;
      const spark = sparkRef.current;
      if (!path || !containerRef.current) return;

      const pathLength = path.getTotalLength();

      // Set initial state for both the drawing line and its blurred halo
      const pathsToAnimate = [path];
      if (glowPath) pathsToAnimate.push(glowPath);

      gsap.set(pathsToAnimate, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      if (spark) {
        gsap.set(spark, { opacity: 0 });
      }

      // Master ScrollTrigger for drawing the dynamic central line
      ScrollTrigger.create({
        trigger: trackRef.current || containerRef.current,
        start: "top 65%",
        end: "bottom 75%",
        scrub: 0.4,
        onUpdate: (self) => {
          const progress = self.progress;
          const currentOffset = pathLength * (1 - progress);
          gsap.set(pathsToAnimate, { strokeDashoffset: currentOffset });

          // Update spark bead position at the leading edge
          if (spark) {
            if (progress > 0.01 && progress < 0.99) {
              const point = path.getPointAtLength(pathLength * progress);
              gsap.set(spark, {
                cx: point.x,
                cy: point.y,
                opacity: 1,
              });
            } else if (progress >= 0.99) {
              const endPoint = path.getPointAtLength(pathLength);
              gsap.set(spark, {
                cx: endPoint.x,
                cy: endPoint.y,
                opacity: 1,
              });
            } else {
              gsap.set(spark, { opacity: 0 });
            }
          }

          // Compute which milestones are passed by the drawing line.
          // RAF-batch the React setState so it doesn't run synchronously on
          // every scroll tick — only fires once per animation frame when
          // something actually changed.
          const totalMilestones = storyTimeline.milestones.length;
          const newActives = storyTimeline.milestones.map((_, idx) => {
            const milestoneThreshold = (idx + 0.35) / totalMilestones;
            return progress >= milestoneThreshold;
          });

          // Only schedule an update if something changed
          const changed = newActives.some(
            (isActive, idx) => isActive !== (pendingActiveRef.current ?? [])[idx]
          );
          if (changed) {
            pendingActiveRef.current = newActives;
            if (!rafActiveRef.current) {
              rafActiveRef.current = requestAnimationFrame(() => {
                rafActiveRef.current = 0;
                if (pendingActiveRef.current) {
                  setActiveIndices((current) =>
                    current.some((isActive, idx) => isActive !== pendingActiveRef.current![idx])
                      ? pendingActiveRef.current!
                      : current
                  );
                }
              });
            }
          }
        },
      });

      // Individual scrub animations for each milestone row
      const items = containerRef.current.querySelectorAll(".timeline-item");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.15, y: 45 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 45%",
              scrub: 0.6,
            },
          }
        );
      });

      // Closing section reveal
      const closing = containerRef.current.querySelector(".timeline-closing");
      if (closing) {
        gsap.fromTo(
          closing,
          { opacity: 0, y: 30, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: closing,
              start: "top 85%",
              end: "top 55%",
              scrub: 0.6,
            },
          }
        );
      }
    }, containerRef);

    // Refresh ScrollTrigger after slight delay to ensure correct offsets
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      // Cancel any pending RAF to prevent stale state updates after unmount
      if (rafActiveRef.current) {
        cancelAnimationFrame(rafActiveRef.current);
        rafActiveRef.current = 0;
      }
      ctx.revert();
    };
  }, [lineHeight, storyTimeline.milestones]);

  return (
    <section
      id="our-story"
      ref={containerRef}
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden"
    >
      {/* Header / Badge */}
      <div className="text-center max-w-xl mx-auto mb-12 sm:mb-20 space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#20050a]/90 border border-[#caa24d]/35 text-[11px] font-serif tracking-[0.25em] text-[#caa24d] uppercase shadow-md">
          <span className="w-1 h-1 rounded-full bg-[#e5c57b]" />
          <span>{storyTimeline.badge}</span>
          <span className="w-1 h-1 rounded-full bg-[#e5c57b]" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff0c7] via-[#f7e6b5] to-[#caa24d]">
          {storyTimeline.title}
        </h2>

        <p className="font-serif italic text-sm sm:text-base text-[#e5c57b]/85 max-w-md mx-auto">
          {storyTimeline.subtitle}
        </p>

        {/* Delicate decorative flourish */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#caa24d]/50" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#caa24d]" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#caa24d]/50" />
        </div>
      </div>

      {/* Timeline track wrapper */}
      <div ref={trackRef} className="relative w-full">
        {/* ============================================================ */}
        {/* DYNAMIC DRAWING SVG TIMELINE LINE */}
        {/* ============================================================ */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-0"
          style={{ width: "32px", height: `${lineHeight}px` }}
        >
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 32 ${lineHeight}`}
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="timeline-line-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8c6b24" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#caa24d" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fff0c7" stopOpacity="1" />
              </linearGradient>

              <filter id="gold-line-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>

            {/* Background faint guide line */}
            <path
              ref={bgPathRef}
              d={`M 16 20 L 16 ${lineHeight - 20}`}
              stroke="#caa24d"
              strokeWidth="1"
              strokeOpacity="0.15"
              strokeDasharray="4 6"
            />

            {/* Blurred glow halo behind active drawing line */}
            <path
              ref={glowPathRef}
              d={`M 16 20 L 16 ${lineHeight - 20}`}
              stroke="url(#timeline-line-glow)"
              strokeWidth="4"
              filter="url(#gold-line-blur)"
              opacity="0.7"
            />

            {/* Primary dynamic drawing line */}
            <path
              ref={pathRef}
              d={`M 16 20 L 16 ${lineHeight - 20}`}
              stroke="url(#timeline-line-glow)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Illuminated leading spark bead */}
            <circle
              ref={sparkRef}
              r="4.5"
              fill="#fff0c7"
              filter="url(#gold-line-blur)"
              className="drop-shadow-[0_0_8px_rgba(255,240,199,0.9)]"
            />
          </svg>
        </div>

        {/* Milestones list */}
        <div className="relative z-10 flex flex-col space-y-4 sm:space-y-8">
          {storyTimeline.milestones.map((milestone, index) => (
            <TimelineItem
              key={milestone.id}
              milestone={milestone}
              index={index}
              isActive={activeIndices[index]}
            />
          ))}
        </div>
      </div>

      {/* Closing Quote & Archival Monogram Seal */}
      {storyTimeline.closingQuote && (
        <div className="timeline-closing relative mt-20 sm:mt-28 md:mt-36 pt-8 text-center max-w-xl mx-auto px-4 z-10">
          {/* Ornate separator seal */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#caa24d]/60 to-transparent" />
            <div className="w-9 h-9 rounded-full bg-[#1e050a] border border-[#caa24d]/50 flex items-center justify-center shadow-[0_0_15px_rgba(202,162,77,0.3)]">
              <span className="font-serif text-[11px] font-bold text-[#fcedc7] tracking-wider">
                N&amp;A
              </span>
            </div>
            <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#caa24d]/60 to-transparent" />
          </div>

          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#fff0c7] via-[#f7e6b5] to-[#caa24d] font-normal leading-relaxed">
            &ldquo;{storyTimeline.closingQuote.line1}&rdquo;
          </p>
          <p className="font-sans text-xs sm:text-sm tracking-[0.2em] text-[#caa24d]/80 uppercase mt-3 font-light">
            {storyTimeline.closingQuote.line2}
          </p>
        </div>
      )}
    </section>
  );
};
