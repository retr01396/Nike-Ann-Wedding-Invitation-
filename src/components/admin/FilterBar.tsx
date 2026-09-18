"use strict";

import React from "react";
import { weddingConfig } from "@/config/wedding";

export interface FilterState {
  search: string;
  attendance: "all" | "attending" | "declined";
  accommodation: "all" | "staying" | "not-staying";
  dietary: string;
  transportation: "all" | "required" | "none";
  sortBy: "newest" | "oldest" | "name-asc" | "arrival-asc" | "departure-asc";
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onExportCsv: () => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onExportCsv,
  filteredCount,
  totalCount,
}) => {
  const { rsvp } = weddingConfig;

  const update = (key: keyof FilterState, val: string) => {
    onFilterChange({ ...filters, [key]: val });
  };

  const isFiltered =
    filters.search ||
    filters.attendance !== "all" ||
    filters.accommodation !== "all" ||
    filters.dietary !== "all" ||
    filters.transportation !== "all" ||
    filters.sortBy !== "newest";

  const resetFilters = () => {
    onFilterChange({
      search: "",
      attendance: "all",
      accommodation: "all",
      dietary: "all",
      transportation: "all",
      sortBy: "newest",
    });
  };

  return (
    <div className="p-4 sm:p-5 border border-[#caa24d]/25 bg-[#140206] space-y-4 text-left">
      {/* Search and Primary Export Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search by guest name..."
            className="w-full pl-3.5 pr-8 py-2.5 bg-[#1a0308] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans placeholder-[#caa24d]/40 focus:outline-none focus:border-[#caa24d]"
          />
          {filters.search && (
            <button
              onClick={() => update("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#caa24d]/60 hover:text-[#fff0c7]"
            >
              ✕
            </button>
          )}
        </div>

        {/* CSV Export Action */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onExportCsv}
            disabled={filteredCount === 0}
            className="px-4 py-2.5 border border-[#caa24d] bg-[#22050b] text-[#caa24d] hover:bg-[#caa24d] hover:text-[#100104] transition-all duration-300 font-sans text-xs uppercase tracking-wider font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
          >
            <span>Export CSV</span>
            <span className="text-[11px]">↓</span>
          </button>
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        {/* Attendance Filter */}
        <div className="space-y-1">
          <label className="block font-sans text-[8.5px] uppercase tracking-[0.2em] text-[#caa24d]/80">
            Attendance
          </label>
          <select
            value={filters.attendance}
            onChange={(e) => update("attendance", e.target.value)}
            className="w-full px-2.5 py-2 bg-[#190308] border border-[#caa24d]/25 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
          >
            <option value="all">All Responses</option>
            <option value="attending">Attending</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {/* Accommodation Filter */}
        <div className="space-y-1">
          <label className="block font-sans text-[8.5px] uppercase tracking-[0.2em] text-[#caa24d]/80">
            Accommodation
          </label>
          <select
            value={filters.accommodation}
            onChange={(e) => update("accommodation", e.target.value)}
            className="w-full px-2.5 py-2 bg-[#190308] border border-[#caa24d]/25 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
          >
            <option value="all">All Lodging</option>
            <option value="staying">Staying with us</option>
            <option value="not-staying">Arranging own stay</option>
          </select>
        </div>

        {/* Dietary Filter */}
        <div className="space-y-1">
          <label className="block font-sans text-[8.5px] uppercase tracking-[0.2em] text-[#caa24d]/80">
            Dietary
          </label>
          <select
            value={filters.dietary}
            onChange={(e) => update("dietary", e.target.value)}
            className="w-full px-2.5 py-2 bg-[#190308] border border-[#caa24d]/25 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
          >
            <option value="all">All Dietary</option>
            {rsvp.dietaryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transportation Filter */}
        <div className="space-y-1">
          <label className="block font-sans text-[8.5px] uppercase tracking-[0.2em] text-[#caa24d]/80">
            Transit
          </label>
          <select
            value={filters.transportation}
            onChange={(e) => update("transportation", e.target.value)}
            className="w-full px-2.5 py-2 bg-[#190308] border border-[#caa24d]/25 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
          >
            <option value="all">All Transit</option>
            <option value="required">Transit Required</option>
            <option value="none">No Transit</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="space-y-1 col-span-2 sm:col-span-1 lg:col-span-1">
          <label className="block font-sans text-[8.5px] uppercase tracking-[0.2em] text-[#caa24d]/80">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value)}
            className="w-full px-2.5 py-2 bg-[#190308] border border-[#caa24d]/25 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Guest Name (A-Z)</option>
            <option value="arrival-asc">Arrival Date</option>
            <option value="departure-asc">Departure Date</option>
          </select>
        </div>
      </div>

      {/* Filter Status Summary & Reset */}
      <div className="flex items-center justify-between pt-1 border-t border-[#caa24d]/15 text-[11px] text-[#caa24d]/70 font-serif italic">
        <span>
          Showing {filteredCount} of {totalCount} total {totalCount === 1 ? "response" : "responses"}
        </span>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="text-xs not-italic font-sans text-[#caa24d] hover:text-[#fff0c7] underline decoration-[#caa24d]/40"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
