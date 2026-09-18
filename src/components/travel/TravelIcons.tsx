"use strict";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Elegant Golden Location Pin Icon matching the reference image centered pin
 */
export const MapPinIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d="M12 21c4-5 8-8.5 8-13A8 8 0 0 0 4 8c0 4.5 4 8 8 13z" fill="currentColor" fillOpacity="0.15" />
    <circle cx="12" cy="8" r="3" strokeWidth="1.75" />
  </svg>
);

/**
 * Directional Arrow for GET DIRECTIONS →
 */
export const DirectionsArrowIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/**
 * Parking & Valet Line-Art Icon
 */
export const CarParkingIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 16V8h4.5a2.5 2.5 0 0 1 0 5H9" />
  </svg>
);

/**
 * Transit, Shuttles & Buses Line-Art Icon
 */
export const TransitBusIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <rect x="4" y="3" width="16" height="15" rx="2.5" />
    <path d="M4 10h16" />
    <path d="M8 18v3" />
    <path d="M16 18v3" />
    <circle cx="8" cy="14" r="1.5" fill="currentColor" fillOpacity="0.4" />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

/**
 * Clock & Distance Line-Art Icon
 */
export const ClockDistanceIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

/**
 * Landmark / Waypoint Line-Art Icon
 */
export const LandmarkIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d="M3 21h18" />
    <path d="M5 21V10l7-5 7 5v11" />
    <path d="M9 21v-4h6v4" />
    <circle cx="12" cy="9" r="1.5" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

/**
 * Compass Rose Line-Art Icon
 */
export const CompassRoseIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <polygon points="12,4 14.5,10 20,12 14.5,14 12,20 9.5,14 4,12 9.5,10" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

/**
 * Subtle Information / Tentative Placeholder Badge Icon
 */
export const InfoNoticeIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="8.01" strokeWidth="2" />
    <line x1="12" y1="11" x2="12" y2="16" />
  </svg>
);
