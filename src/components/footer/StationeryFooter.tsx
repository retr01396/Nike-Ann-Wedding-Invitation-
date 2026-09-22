"use client";

import React from "react";
import { weddingConfig } from "@/config/wedding";
import { Instagram, Mail } from "lucide-react";

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2C6.518 2 2.037 6.477 2.037 12c0 1.942.553 3.759 1.517 5.297L2.008 22l4.832-1.509A9.957 9.957 0 0 0 12.04 22c5.523 0 10.003-4.477 10.003-10S17.563 2 12.04 2zm0 18.232c-1.624 0-3.137-.478-4.417-1.3l-.317-.202-2.868.895.912-2.775-.22-.338A8.214 8.214 0 0 1 3.825 12c0-4.53 3.686-8.216 8.215-8.216 4.53 0 8.216 3.686 8.216 8.216 0 4.53-3.686 8.232-8.216 8.232zm4.512-6.172c-.251-.126-1.482-.731-1.712-.815-.23-.084-.397-.126-.564.126-.167.251-.648.815-.795.982-.146.167-.293.188-.544.063s-1.06-.391-2.019-1.246c-.747-.666-1.251-1.489-1.397-1.74-.146-.251-.016-.387.11-.512.113-.113.251-.293.377-.44.125-.146.167-.251.251-.418.084-.167.042-.314-.021-.44-.063-.125-.564-1.36-.773-1.863-.204-.49-.411-.424-.564-.432l-.481-.008c-.167 0-.439.063-.669.314-.23.251-.878.858-.878 2.091s.899 2.425 1.024 2.593c.126.167 1.768 2.7 4.283 3.787.598.259 1.066.414 1.43.53.601.191 1.148.164 1.58.1s.878-.607 1.024-1.193c.146-.586.146-1.088.105-1.193-.042-.105-.188-.167-.439-.293z" />
  </svg>
);

/**
 * StationeryFooter — the closing band from the approved reference:
 * "NIKE & ANN 2026" | centered "A BRIGHTER CHAPTER TOGETHER" over the
 * N / A monogram | nav links on the right.
 */
export const StationeryFooter: React.FC = () => {
  const contact = weddingConfig.contact;

  const navLinks = [
    { label: "OUR STORY", href: "#our-story" },
    { label: "EVENTS", href: "#events" },
    { label: "DIRECTIONS", href: "#directions" },
    { label: "RSVP", href: "#rsvp" },
  ];

  return (
    <footer
      aria-label="Invitation Footer"
      className="relative w-full py-9 sm:py-11 px-4 sm:px-8 select-none z-20"
      style={{
        /* Dark translucent burgundy veil — the floral/liquid background
            continues into the footer (no giant solid block), while staying
            dark enough that the gold typography remains the focus */
        background:
          "linear-gradient(to bottom, rgba(35,3,8,0.66) 0%, rgba(23,2,5,0.82) 60%, rgba(16,1,3,0.92) 100%)",
        backdropFilter: "blur(14px) brightness(0.9)",
        WebkitBackdropFilter: "blur(14px) brightness(0.9)",
        borderTop: "1px solid rgba(202,162,77,0.35)",
      }}
    >
      {/* Warm gold seam glow along the top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,240,199,0.5), transparent)",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 items-center gap-6 sm:gap-4">
        {/* Left: NIKE & ANN / 2026 */}
        <div className="text-center sm:text-left order-2 sm:order-1">
          <p className="font-cinzel text-[10px] tracking-[0.3em] text-[#d8b257] uppercase">
            NIKE &amp; ANN
          </p>
          <p className="mt-1 font-sans text-[9px] tracking-[0.35em] text-[#caa24d]/60">
            2026
          </p>
        </div>

        {/* Center: A BRIGHTER CHAPTER TOGETHER + N / A monogram */}
        <div className="flex flex-col items-center order-1 sm:order-2">
          <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.4em] text-[#e5c57b]/85 uppercase text-center">
            A BRIGHTER CHAPTER TOGETHER
          </p>
          <span
            aria-hidden="true"
            className="block w-[1px] h-6 bg-gradient-to-b from-[#caa24d]/70 to-transparent mt-2"
          />
          <p className="mt-1 font-cinzel text-base sm:text-lg tracking-[0.35em] text-[#d8b257]">
            N <span className="font-serif italic text-xs text-[#d8b257]/70">/</span> A
          </p>
        </div>

        {/* Right: nav links */}
        <div className="flex flex-col items-center sm:items-end gap-2 order-3">
          <nav
            aria-label="Footer navigation"
            className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.22em] text-[#caa24d]/75 hover:text-[#fff0c7] transition-colors uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
