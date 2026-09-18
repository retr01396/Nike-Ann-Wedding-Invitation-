"use strict";
"use client";

import React from "react";

interface TimelineNodeProps {
  year: string;
  isActive?: boolean;
  className?: string;
}

export const TimelineNode: React.FC<TimelineNodeProps> = ({
  year,
  isActive = false,
  className = "",
}) => {
  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-700 ${className}`}
    >
      {/* Outer ambient glow when active */}
      <div
        className={`absolute -inset-4 rounded-full transition-opacity duration-700 pointer-events-none ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(202, 162, 77, 0.45) 0%, rgba(202, 162, 77, 0) 70%)",
        }}
      />

      {/* Pulsing ring when active */}
      {isActive && (
        <div className="absolute -inset-1 rounded-full border border-[#caa24d]/40 animate-ping pointer-events-none" />
      )}

      {/* Concentric gold ring */}
      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center p-[2px] transition-all duration-700 ${
          isActive
            ? "bg-gradient-to-tr from-[#caa24d] via-[#fff0c7] to-[#8c6b24] shadow-[0_0_20px_rgba(202,162,77,0.6)] scale-105"
            : "bg-gradient-to-tr from-[#5a3e14] via-[#caa24d]/40 to-[#2e1c07] shadow-lg scale-95"
        }`}
      >
        {/* Inner wax medallion seal */}
        <div
          className={`w-full h-full rounded-full flex flex-col items-center justify-center border transition-all duration-700 ${
            isActive
              ? "bg-[#25070d] border-[#caa24d]/60 text-[#fff0c7]"
              : "bg-[#140306] border-[#caa24d]/20 text-[#caa24d]/60"
          }`}
        >
          {/* Subtle spark / diamond top */}
          <div
            className={`w-1 h-1 rotate-45 transition-colors duration-500 mb-0.5 ${
              isActive ? "bg-[#fff0c7]" : "bg-[#caa24d]/40"
            }`}
          />
          <span className="font-serif text-[10px] sm:text-[11px] font-bold tracking-tighter leading-none">
            {year}
          </span>
        </div>
      </div>
    </div>
  );
};
