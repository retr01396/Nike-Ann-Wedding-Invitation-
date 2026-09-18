"use strict";
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { RSVPRow } from "@/types/database";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { FilterBar, FilterState } from "@/components/admin/FilterBar";
import { RSVPTable } from "@/components/admin/RSVPTable";
import { RSVPDetailModal } from "@/components/admin/RSVPDetailModal";
import { EditRSVPModal } from "@/components/admin/EditRSVPModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function AdminDashboardPage() {
  const [rsvps, setRsvps] = useState<RSVPRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isUnconfigured, setIsUnconfigured] = useState(false);

  // Active Modals
  const [viewingRsvp, setViewingRsvp] = useState<RSVPRow | null>(null);
  const [editingRsvp, setEditingRsvp] = useState<RSVPRow | null>(null);
  const [deletingRsvp, setDeletingRsvp] = useState<RSVPRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    attendance: "all",
    accommodation: "all",
    dietary: "all",
    transportation: "all",
    sortBy: "newest",
  });

  // Fetch RSVPs from API
  const fetchRsvps = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const res = await fetch("/api/admin/rsvps");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoadError(data?.error || "Failed to load RSVP records.");
        setIsLoading(false);
        return;
      }

      if (data.unconfigured) {
        setIsUnconfigured(true);
      }

      setRsvps(data.rsvps || []);
    } catch {
      setLoadError("Unable to communicate with the administrative service.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, []);

  // Filter & Sort Logic
  const filteredRsvps = useMemo(() => {
    return rsvps
      .filter((item) => {
        // Search by guest name
        if (filters.search) {
          const q = filters.search.toLowerCase().trim();
          if (!item.name.toLowerCase().includes(q)) return false;
        }

        // Attendance Filter
        if (filters.attendance !== "all" && item.attendance !== filters.attendance) {
          return false;
        }

        // Accommodation Filter
        if (filters.accommodation === "staying" && !item.accommodation_required) {
          return false;
        }
        if (filters.accommodation === "not-staying" && item.accommodation_required) {
          return false;
        }

        // Dietary Filter
        if (filters.dietary !== "all" && item.dietary_preference !== filters.dietary) {
          return false;
        }

        // Transportation Filter
        if (filters.transportation === "required") {
          if (!item.transportation || item.transportation === "none") return false;
        }
        if (filters.transportation === "none") {
          if (item.transportation && item.transportation !== "none") return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "oldest":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "arrival-asc":
            if (!a.arrival_date) return 1;
            if (!b.arrival_date) return -1;
            return a.arrival_date.localeCompare(b.arrival_date);
          case "departure-asc":
            if (!a.departure_date) return 1;
            if (!b.departure_date) return -1;
            return a.departure_date.localeCompare(b.departure_date);
          default:
            return 0;
        }
      });
  }, [rsvps, filters]);

  // CSV Export with RFC-4180 Escaping
  const handleExportCsv = () => {
    if (filteredRsvps.length === 0) return;

    const headers = [
      "ID",
      "Guest Name",
      "Email",
      "Attendance",
      "Guest Count",
      "Dietary Preference",
      "Dietary Notes",
      "Accommodation Required",
      "Stay Guest Name",
      "Contact Phone",
      "People Staying",
      "Arrival Date",
      "Departure Date",
      "Rooms Required",
      "Transportation",
      "Transportation Notes",
      "Special Requirements",
      "Personal Message",
      "Status",
      "Submitted At",
      "Updated At",
    ];

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      // Neutralize spreadsheet formula injection characters (=, +, -, @, tab, cr)
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'` + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredRsvps.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.name),
      escapeCsv(r.email),
      escapeCsv(r.attendance),
      escapeCsv(r.guest_count),
      escapeCsv(r.dietary_preference),
      escapeCsv(r.dietary_other),
      escapeCsv(r.accommodation_required ? "YES" : "NO"),
      escapeCsv(r.stay_guest_name),
      escapeCsv(r.phone),
      escapeCsv(r.people_staying),
      escapeCsv(r.arrival_date),
      escapeCsv(r.departure_date),
      escapeCsv(r.rooms_required),
      escapeCsv(r.transportation),
      escapeCsv(r.transportation_other),
      escapeCsv(r.special_requirements),
      escapeCsv(r.message),
      escapeCsv(r.status),
      escapeCsv(r.created_at),
      escapeCsv(r.updated_at),
    ]);

    const csvContent =
      "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows.map((row) => row.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().split("T")[0];

    link.setAttribute("href", url);
    link.setAttribute("download", `nike-ann-rsvps-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Edit Update Handler
  const handleSaveEdit = (updated: RSVPRow) => {
    setRsvps((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    if (viewingRsvp?.id === updated.id) {
      setViewingRsvp(updated);
    }
  };

  // Delete Confirm Handler
  const handleConfirmDelete = async () => {
    if (!deletingRsvp) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/rsvps/${deletingRsvp.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setDeleteError(data?.error || "Failed to delete response.");
        setIsDeleting(false);
        return;
      }

      setRsvps((prev) => prev.filter((item) => item.id !== deletingRsvp.id));
      if (viewingRsvp?.id === deletingRsvp.id) {
        setViewingRsvp(null);
      }
      setDeletingRsvp(null);
      setDeleteError(null);
    } catch {
      setDeleteError("Network error while attempting deletion. Please check your connection.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dashboard Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#caa24d]/25 pb-4 gap-3">
        <div>
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#caa24d] font-medium block">
            Executive Summary
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-widest text-[#fff0c7] mt-0.5">
            RSVP Operations
          </h1>
          <p className="font-serif text-xs text-[#caa24d]/70 italic mt-0.5">
            Guest coordination, attendance tally, and stay logistics.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={fetchRsvps}
            disabled={isLoading}
            className="px-3.5 py-1.5 border border-[#caa24d]/30 text-xs font-sans uppercase tracking-wider text-[#caa24d] hover:border-[#caa24d] hover:text-[#fff0c7] transition-all disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Unconfigured Alert Banner */}
      {isUnconfigured && (
        <div className="p-4 border border-[#caa24d]/50 bg-[#25050d] text-left space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#caa24d] animate-ping" />
            <p className="font-sans text-[10.5px] uppercase tracking-wider text-[#caa24d] font-medium">
              Database Connectivity Notice
            </p>
          </div>
          <p className="font-serif text-xs text-[#f3e5c8]/85 leading-relaxed">
            Live Supabase credentials (<code className="text-[#fff0c7] bg-[#140206] px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-[#fff0c7] bg-[#140206] px-1 py-0.5">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>) have not been populated. Submissions made via the public site are handled in local simulation mode.
          </p>
          <p className="font-serif text-xs text-[#caa24d] italic">
            See <code className="text-[#fff0c7]">docs/SUPABASE_SETUP.md</code> to connect your live Supabase database and run migrations.
          </p>
        </div>
      )}

      {/* Error Notice */}
      {loadError && (
        <div
          className="p-4 border border-red-800/60 bg-red-950/40 text-red-200 font-serif text-xs text-center italic"
          role="alert"
        >
          {loadError}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-12 border border-[#caa24d]/20 bg-[#140206] text-center space-y-2 animate-pulse">
          <p className="font-serif text-lg text-[#caa24d] italic">
            Loading RSVP data...
          </p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#caa24d]/60">
            Synchronizing records with database
          </p>
        </div>
      )}

      {/* 1. KPI Statistics Overview */}
      {!isLoading && <StatsOverview rsvps={rsvps} />}

      {/* 2. Interactive Search & Filters */}
      {!isLoading && (
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onExportCsv={handleExportCsv}
          filteredCount={filteredRsvps.length}
          totalCount={rsvps.length}
        />
      )}

      {/* 3. Responsive Data Table & Mobile Cards */}
      {!isLoading && (
        <RSVPTable
          rsvps={filteredRsvps}
          onView={(rsvp) => setViewingRsvp(rsvp)}
          onEdit={(rsvp) => setEditingRsvp(rsvp)}
          onDelete={(rsvp) => setDeletingRsvp(rsvp)}
        />
      )}

      {/* Detail Modal */}
      <RSVPDetailModal
        rsvp={viewingRsvp}
        isOpen={!!viewingRsvp}
        onClose={() => setViewingRsvp(null)}
        onEdit={(rsvp) => {
          setViewingRsvp(null);
          setEditingRsvp(rsvp);
        }}
        onDelete={(rsvp) => {
          setViewingRsvp(null);
          setDeleteError(null);
          setDeletingRsvp(rsvp);
        }}
      />

      {/* Edit Modal */}
      <EditRSVPModal
        rsvp={editingRsvp}
        isOpen={!!editingRsvp}
        onClose={() => setEditingRsvp(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        rsvp={deletingRsvp}
        isOpen={!!deletingRsvp}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeletingRsvp(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
