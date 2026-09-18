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

export const StationeryFooter: React.FC = () => {
  const contact = weddingConfig.contact;

  return (
    <footer
      aria-label="Invitation Footer"
      className="relative w-full bg-[#0d0104] border-t border-[#caa24d]/30 py-6 sm:py-8 px-4 sm:px-8 select-none z-20"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        {/* Left: N / A Monogram */}
        <div className="font-cinzel text-sm sm:text-base tracking-[0.3em] text-[#d8b257]">
          N <span className="font-serif italic text-xs text-[#d8b257]/70">/</span> A
        </div>

        {/* Center: WITH LOVE, NIKE & ANN */}
        <div className="font-cinzel text-xs sm:text-[13px] tracking-[0.25em] text-[#fbf6ea] uppercase text-center font-normal">
          WITH LOVE, NIKE &amp; ANN
        </div>

        {/* Right: Contact Icons & Date */}
        <div className="flex items-center gap-4 sm:gap-6 text-[#caa24d]/80">
          <div className="flex items-center gap-3">
            <a
              href={contact?.whatsapp || "https://wa.me/919876543210"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fff0c7] transition-colors p-1"
              aria-label="Contact via WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#caa24d] hover:text-[#fff0c7]" />
            </a>
            <a
              href={contact?.instagram || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fff0c7] transition-colors p-1"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={contact?.email || "mailto:celebration@nikeannwedding.com"}
              className="hover:text-[#fff0c7] transition-colors p-1"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <span className="w-[1px] h-3.5 bg-[#caa24d]/30 hidden sm:block" />

          {/* Date: 15 · 11 · 2026 */}
          <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.25em] text-[#d8b257]">
            15 · 11 · 2026
          </span>
        </div>
      </div>
    </footer>
  );
};
