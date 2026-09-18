"use client";

import React from "react";
import { RSVPForm } from "./RSVPForm";

export const RSVPSection: React.FC = () => {
  return (
    <div
      id="rsvp"
      className="relative w-full p-6 sm:p-7 overflow-hidden flex flex-col justify-between"
    >
      <RSVPForm />
    </div>
  );
};
