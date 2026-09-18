"use strict";

import React from "react";
import { RSVPOption } from "@/types/wedding";
import { CheckSealIcon } from "./RSVPIcons";

interface RSVPChoiceProps<T extends string = string> {
  name: string;
  label?: string;
  options: RSVPOption<T>[];
  value: T | null;
  onChange: (val: T) => void;
  layout?: "grid" | "stack";
  error?: string;
}

export function RSVPChoice<T extends string = string>({
  name,
  label,
  options,
  value,
  onChange,
  layout = "grid",
  error,
}: RSVPChoiceProps<T>) {
  return (
    <div className="space-y-2 w-full text-left">
      {label && (
        <label
          id={`${name}-label`}
          className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium"
        >
          {label}
        </label>
      )}

      <div
        role="radiogroup"
        aria-labelledby={label ? `${name}-label` : undefined}
        className={`grid gap-2.5 ${
          layout === "grid" && options.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onChange(option.value);
                }
              }}
              className={`relative px-3.5 py-3 rounded-none border text-left flex items-center justify-between transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#caa24d] ${
                isSelected
                  ? "border-[#caa24d] bg-[#2a0710] text-[#fff0c7] shadow-[0_0_18px_rgba(202,162,77,0.22)]"
                  : "border-[#caa24d]/25 bg-[#180308]/90 text-[#f3e5c8]/75 hover:border-[#caa24d]/50 hover:text-[#fff0c7]"
              }`}
            >
              <div className="space-y-0.5 pr-2">
                <span className="block font-serif text-xs sm:text-[13px] tracking-[0.1em] uppercase font-normal">
                  {option.label}
                </span>
                {option.description && (
                  <span className="block font-serif text-[10.5px] sm:text-[11px] italic text-[#caa24d]/70 font-light">
                    {option.description}
                  </span>
                )}
              </div>

              {/* Selection Seal / Indicator */}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isSelected
                    ? "border-[#caa24d] bg-[#caa24d] text-[#140206]"
                    : "border-[#caa24d]/40 bg-transparent"
                }`}
              >
                {isSelected && <CheckSealIcon className="w-3 h-3 stroke-[2.5]" />}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
