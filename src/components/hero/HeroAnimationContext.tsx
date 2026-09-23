"use client";

import React, { createContext, useContext } from "react";

/**
 * HeroAnimationContext — a lightweight signal telling decorative background
 * layers to temporarily reduce or pause their work while the envelope
 * opening sequence runs (OPENING → CARD_EXPANDING).
 *
 * The flag changes only at the two transition points (start opening / reach
 * OPENED), never per frame, so React re-renders are limited to the layers
 * themselves flipping between active and paused.
 */
const HeroAnimationContext = createContext<boolean>(false);

export const HeroAnimationProvider = HeroAnimationContext.Provider;

/** True while the envelope opening sequence is in flight. */
export const useHeroAnimationActive = () => useContext(HeroAnimationContext);
