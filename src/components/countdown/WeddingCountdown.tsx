"use client";

import React, { useState, useEffect } from "react";
import { weddingConfig } from "@/config/wedding";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export const WeddingCountdown: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    setMounted(true);

    const targetDate = new Date(weddingConfig.date.iso || "2026-11-15T15:00:00+05:30").getTime();

    const calculateTimeLeft = (): TimeLeft => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isCompleted: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    // SSR placeholder with identical layout dimensions to prevent layout shifts
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center opacity-0 pointer-events-none h-16">
        <div className="h-8" />
      </div>
    );
  }

  if (timeLeft.isCompleted) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-2 animate-fadeIn">
        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#caa24d] to-transparent mb-2" />
        <p className="font-cinzel text-xs sm:text-sm tracking-[0.3em] text-[#fff0c7] uppercase">
          TODAY WE BEGIN
        </p>
        <p className="font-serif italic text-[11px] sm:text-xs text-[#e5c57b]/80 mt-0.5">
          The celebration has arrived
        </p>
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <div
      className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center select-none"
      role="timer"
      aria-label="Countdown to Nike and Ann's wedding ceremony"
    >
      {/* Decorative hairline & label */}
      <div className="flex items-center gap-2.5 mb-2.5 opacity-85">
        <span className="w-5 sm:w-8 h-[0.75px] bg-gradient-to-r from-transparent to-[#caa24d]/60" />
        <span className="font-cinzel text-[7.5px] sm:text-[9px] tracking-[0.3em] text-[#e5c57b] uppercase font-light">
          UNTIL WE SAY I DO
        </span>
        <span className="w-5 sm:w-8 h-[0.75px] bg-gradient-to-l from-transparent to-[#caa24d]/60" />
      </div>

      {/* Stationery Counter Grid */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 px-3 py-1.5 rounded-sm bg-[#120205]/40 backdrop-blur-sm border border-[#caa24d]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="flex flex-col items-center min-w-[42px] sm:min-w-[52px]">
              <span className="font-cinzel text-base sm:text-xl md:text-2xl font-normal text-[#fbf6ea] tracking-wider tabular-nums leading-none drop-shadow-[0_1px_6px_rgba(212,175,55,0.3)]">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="font-cinzel text-[6.5px] sm:text-[8px] tracking-[0.22em] text-[#caa24d]/80 uppercase mt-1">
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 && (
              <span
                className="w-[1px] h-5 sm:h-7 bg-gradient-to-b from-transparent via-[#caa24d]/40 to-transparent"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
