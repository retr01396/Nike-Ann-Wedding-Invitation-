"use strict";

import React from "react";
import { RSVPRow } from "@/types/database";

interface DeleteConfirmModalProps {
  rsvp: RSVPRow | null;
  isOpen: boolean;
  isDeleting: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  rsvp,
  isOpen,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !rsvp) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md p-6 sm:p-8 border border-red-900/60 bg-[#160308] shadow-2xl text-left space-y-5">
        {/* Delicate Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-red-600/70 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-red-600/70 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-red-600/70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-red-600/70 pointer-events-none" />

        <div className="space-y-2">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-red-400 font-medium">
            Permanent Action
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#fff0c7] uppercase tracking-wide">
            Delete RSVP Response?
          </h3>
          <p className="font-serif text-xs text-[#f3e5c8]/80 leading-relaxed">
            Are you sure you want to permanently delete the response for{" "}
            <span className="text-[#fff0c7] font-semibold">{rsvp.name}</span>?
            This will remove all associated guest count, dietary, and lodging data from the database.
          </p>
        </div>

        {error && (
          <div
            className="p-3 border border-red-500/50 bg-red-950/70 text-red-200 text-xs font-serif leading-relaxed"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#caa24d]/15">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2 text-xs font-sans uppercase tracking-wider border border-[#caa24d]/30 text-[#fff0c7] hover:border-[#caa24d] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-sans uppercase tracking-wider border border-red-700 bg-red-950/80 text-red-200 hover:bg-red-900 hover:text-white transition-colors disabled:opacity-50 font-medium"
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};
