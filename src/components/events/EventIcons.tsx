"use strict";
import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Line-art interlocked wedding rings directly matching the reference image.
 */
export const WeddingRingsIcon: React.FC<IconProps> = ({
  className = "text-[#caa24d]",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left ring */}
    <ellipse
      cx="12"
      cy="17"
      rx="7"
      ry="7"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.85"
    />
    {/* Right ring interlocking */}
    <ellipse
      cx="20"
      cy="15"
      rx="7"
      ry="7"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.85"
    />
    {/* Small sparkling diamond facet on the top right ring */}
    <path
      d="M 20 6 L 22 8 L 20 10 L 18 8 Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="currentColor"
      fillOpacity="0.7"
    />
  </svg>
);

/**
 * Line-art coat hanger icon directly matching the reference image dress code icon.
 */
export const CoatHangerIcon: React.FC<IconProps> = ({
  className = "text-[#caa24d]",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Hook */}
    <path
      d="M 16 11 C 16 7, 20 7, 20 9.5 C 20 12, 16 12.5, 16 14"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
    {/* Triangular hanger body */}
    <path
      d="M 16 14 L 6 22 C 5.5 22.5, 6 23, 7 23 L 25 23 C 26 23, 26.5 22.5, 26 22 L 16 14 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
    {/* Bottom horizontal bar */}
    <line
      x1="8"
      y1="23"
      x2="24"
      y2="23"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.6"
    />
  </svg>
);

/**
 * Line-art location pin icon matching the reference image venue icon.
 */
export const VenuePinIcon: React.FC<IconProps> = ({
  className = "text-[#caa24d]",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M 16 5 C 11.5 5, 8 8.5, 8 13 C 8 19, 16 27, 16 27 C 16 27, 24 19, 24 13 C 24 8.5, 20.5 5, 16 5 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
    <circle
      cx="16"
      cy="13"
      r="3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.85"
    />
  </svg>
);

/**
 * Line-art Cathedral / Church Cross icon for Church Nuptials.
 */
export const ChurchCrossIcon: React.FC<IconProps> = ({
  className = "text-[#caa24d]",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Gothic arch framing */}
    <path
      d="M 8 26 L 8 16 C 8 11, 16 6, 16 6 C 16 6, 24 11, 24 16 L 24 26"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.4"
      strokeDasharray="2 3"
    />
    {/* Cross */}
    <line
      x1="16"
      y1="9"
      x2="16"
      y2="24"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />
    <line
      x1="11"
      y1="14"
      x2="21"
      y2="14"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Line-art Traditional Kerala Lamp / Tharavadu Icon for Groom's House.
 */
export const TharavaduIcon: React.FC<IconProps> = ({
  className = "text-[#caa24d]",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Hanging chain */}
    <line
      x1="16"
      y1="4"
      x2="16"
      y2="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.6"
      strokeDasharray="2 2"
    />
    {/* Lamp dish */}
    <ellipse
      cx="16"
      cy="18"
      rx="9"
      ry="3.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.85"
    />
    {/* Central flame */}
    <path
      d="M 16 10 C 14.5 13, 14.5 15, 16 17 C 17.5 15, 17.5 13, 16 10 Z"
      fill="currentColor"
      fillOpacity="0.75"
    />
    {/* Base rim */}
    <path
      d="M 11 18.5 L 13 24 L 19 24 L 21 18.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.6"
    />
  </svg>
);

/**
 * Line-art Suit / Tuxedo Icon for Men's Dress Code ("Suit Up").
 */
export const SuitTuxedoIcon: React.FC<IconProps> = ({
  className = "text-[#caa24d]",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Suit shoulders and jacket contour */}
    <path
      d="M7 27V12L12 6H20L25 12V27"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
    {/* Left lapel */}
    <path
      d="M12 6L16 17L11 11Z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
    {/* Right lapel */}
    <path
      d="M20 6L16 17L21 11Z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
    {/* Bowtie */}
    <path
      d="M14 9L18 11L18 9L14 11Z"
      fill="currentColor"
      fillOpacity="0.75"
      stroke="currentColor"
      strokeWidth="0.8"
    />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
    {/* Front closure line and buttons */}
    <line
      x1="16"
      y1="17"
      x2="16"
      y2="27"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeOpacity="0.6"
    />
    <circle cx="16" cy="20" r="0.8" fill="currentColor" fillOpacity="0.85" />
    <circle cx="16" cy="23.5" r="0.8" fill="currentColor" fillOpacity="0.85" />
  </svg>
);

/**
 * Line-art Elegant Evening Gown / Dress Icon for Ladies' Dress Code ("Elegant Evening Wear").
 */
export const EveningDressIcon: React.FC<IconProps> = ({
  className = "text-[#caa24d]",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Straps / Neckline */}
    <path
      d="M12 5L13.5 10M20 5L18.5 10"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    {/* Bodice sweetheart neckline */}
    <path
      d="M13.5 10C14.5 11 15.5 11 16 10.5C16.5 11 17.5 11 18.5 10"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
    {/* Bodice sides tapering to waist */}
    <path
      d="M13.5 10L14 15.5H18L18.5 10"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
    {/* Waistband cinch */}
    <line
      x1="13.5"
      y1="15.5"
      x2="18.5"
      y2="15.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />
    {/* Flared flowing evening gown skirt */}
    <path
      d="M14 15.5C13 20 8 25 7 27C11 27.5 21 27.5 25 27C24 25 19 20 18 15.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
    {/* Elegant drape / fold lines in skirt */}
    <path
      d="M15 16C14.5 19.5 13 23.5 12.5 27"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
    <path
      d="M17 16C17.5 19.5 19 23.5 19.5 27"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
    <path
      d="M16 16V27"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />
  </svg>
);

