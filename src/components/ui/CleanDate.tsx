"use client";

import React from "react";

interface CleanDateProps {
  value: string;
  className?: string;
  numeralClassName?: string;
}

/**
 * CleanDate — renders date/time text while guaranteeing numerals (e.g. 15, 2026, 3:00)
 * render as standard, readable, unswashed modern lining digits across all browsers.
 *
 * It splits the string into semantic spans so that digits are rendered using the project's
 * clean Playfair Display / Montserrat font with explicit lining-nums and all decorative
 * character variants (cv02, cv03, cv04, cv11, onum) turned OFF.
 */
export const CleanDate: React.FC<CleanDateProps> = ({
  value,
  className = "",
  numeralClassName = "",
}) => {
  if (!value) return null;

  // Split into tokens: digits and non-digits
  const parts = value.split(/(\d+)/);

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontVariantNumeric: "lining-nums tabular-nums",
        fontFeatureSettings: '"lnum" 1, "onum" 0, "cv02" 0, "cv03" 0, "cv04" 0, "cv11" 0',
      }}
    >
      {parts.map((part, index) => {
        if (/^\d+$/.test(part)) {
          return (
            <span
              key={index}
              className={`font-display font-medium tracking-normal inline-block text-inherit ${numeralClassName}`}
              style={{
                fontFamily: "var(--font-playfair), var(--font-montserrat), serif",
                fontVariantNumeric: "lining-nums tabular-nums",
                fontFeatureSettings: '"lnum" 1, "onum" 0, "cv02" 0, "cv03" 0, "cv04" 0, "cv11" 0',
                letterSpacing: "0.02em",
              }}
            >
              {part}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
