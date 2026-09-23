"use client";

import React from "react";

/**
 * GoldGlowFrame — SMOKED BURGUNDY LIQUID GLASS (per the approved reference)
 *
 * The three lower-suite panels (Event Details / RSVP / Getting There) read
 * as tall slabs of polished smoked-burgundy glass:
 *   • dark translucent burgundy substrate with strong backdrop blur
 *   • soft internal reflections + a slow drifting diagonal sheen
 *   • thin champagne/gold outer edge, brightest as curved light at corners
 *   • gentle inner shadow along the lower rim (glass thickness)
 *   • the floral/liquid background stays visible through the glass
 * Rounded but not SaaS-round; the border catches light like polished glass.
 */
interface GoldGlowFrameProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const GoldGlowFrame: React.FC<GoldGlowFrameProps> = ({
  id,
  children,
  className = "",
}) => {
  return (
    <div id={id} className={`relative ${className}`}>
      {/* Outer atmospheric bloom — soft crimson/gold aura spilling onto the
          florals so the glass separates from the background without a hard
          rectangle edge */}
      <div
        aria-hidden="true"
        className="gold-glow-bloom absolute -inset-[12px] rounded-[30px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 78% 68% at 50% 38%, rgba(122,20,38,0.20) 0%, rgba(196,150,84,0.10) 48%, transparent 76%)",
        }}
      />

      {/* THE GLASS: dark translucent burgundy, strong blur, champagne rim */}
      <div
        className="gold-glow-glass relative rounded-[20px] overflow-hidden h-full"
        style={{
          background:
            "linear-gradient(165deg, rgba(46,9,16,0.62) 0%, rgba(28,5,11,0.74) 45%, rgba(16,3,7,0.80) 100%)",
          border: "1px solid rgba(220,178,98,0.42)",
          boxShadow:
            "inset 0 1px 0 rgba(255,240,199,0.30), inset 0 -1px 0 rgba(90,12,24,0.35), inset 0 0 40px rgba(150,24,44,0.10), 0 30px 70px rgba(0,0,0,0.72)",
        }}
      >
        {/* Curved corner light — polished glass catching light top-left */}
        <div
          aria-hidden="true"
          className="gold-glow-reflection absolute -top-12 -left-12 w-52 h-52 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,224,158,0.22) 0%, rgba(214,171,92,0.09) 45%, transparent 70%)",
          }}
        />
        {/* Bottom-right counter-reflection */}
        <div
          aria-hidden="true"
          className="gold-glow-reflection absolute -bottom-14 -right-14 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(200,60,80,0.14) 0%, rgba(120,70,30,0.06) 50%, transparent 72%)",
          }}
        />

        {/* DRIFTING SHEEN — a slow band of light sweeping across the glass,
            the signature 'liquid' movement of the reference panels */}
        <div
          aria-hidden="true"
          className="liquid-glass-sheen absolute top-0 bottom-0 left-[-100%] w-[200%] pointer-events-none will-change-transform"
          style={{
            background:
              "linear-gradient(115deg, transparent 0%, transparent 34%, rgba(255,236,200,0.045) 44%, rgba(255,214,150,0.075) 50%, rgba(255,236,200,0.045) 56%, transparent 66%, transparent 100%)",
            mixBlendMode: "screen",
            animation: "liquidGlassSheen 16s ease-in-out infinite alternate",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">{children}</div>

        {/* Luminous corner lights — bright points tracing the rounded
            corners where the two rim curves meet */}
        {(
          [
            { top: -3, left: -3 },
            { top: -3, right: -3 },
            { bottom: -3, left: -3 },
            { bottom: -3, right: -3 },
          ] as const
        ).map((pos, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute w-[7px] h-[7px] rounded-full pointer-events-none"
            style={{
              ...pos,
              background:
                "radial-gradient(circle, #ffe9b8 0%, #d9b46a 45%, transparent 75%)",
              boxShadow: "0 0 10px 2px rgba(233,196,124,0.55)",
            }}
          />
        ))}
      </div>

      {/* Rim light curves — brighter arcs along the two top corners */}
      <span
        aria-hidden="true"
        className="absolute -top-[1px] -left-[1px] w-24 h-24 rounded-tl-[20px] pointer-events-none"
        style={{
          borderTop: "1px solid rgba(255,240,199,0.55)",
          borderLeft: "1px solid rgba(255,240,199,0.35)",
          filter: "blur(0.4px)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute -top-[1px] -right-[1px] w-24 h-24 rounded-tr-[20px] pointer-events-none"
        style={{
          borderTop: "1px solid rgba(255,240,199,0.55)",
          borderRight: "1px solid rgba(255,240,199,0.35)",
          filter: "blur(0.4px)",
        }}
      />

      <style>{`
        .gold-glow-glass {
          backdrop-filter: blur(26px) saturate(1.15) brightness(0.96);
          -webkit-backdrop-filter: blur(26px) saturate(1.15) brightness(0.96);
        }
        .gold-glow-bloom { filter: blur(18px); }
        .gold-glow-reflection { filter: blur(24px); }
        @media (max-width: 767px) {
          .gold-glow-glass {
            backdrop-filter: blur(12px) saturate(1.08) brightness(0.98);
            -webkit-backdrop-filter: blur(12px) saturate(1.08) brightness(0.98);
          }
          /* Remove expensive decorative blurs on mobile, use opacity tint instead */
          .gold-glow-bloom { filter: none; opacity: 0.6; }
          .gold-glow-reflection { filter: none; opacity: 0.7; }
        }
        @keyframes liquidGlassSheen {
          0%   { transform: translate3d(0, 0, 0); opacity: 0.55; }
          50%  { transform: translate3d(25%, 0, 0); opacity: 0.9; }
          100% { transform: translate3d(50%, 0, 0); opacity: 0.6; }
        }
        @media (prefers-reduced-motion: reduce) {
          .liquid-glass-sheen { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
