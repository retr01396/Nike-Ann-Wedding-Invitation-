"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";

/**
 * FloralFraming — High-Resolution Floral Canvas, Page-Long (per reference)
 *
 * Performance notes:
 * - The LQIP underlay (hero-lqip) has a filter:blur(20px) that creates an
 *   expensive GPU compositing layer. After the hero image loads, we fade it
 *   out so the blurred layer is removed from the compositor.
 * - Static band divs have contain:paint to isolate their paint area.
 */
export const FloralFraming: React.FC = () => {
  const { hero } = weddingConfig.images;
  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[1]"
      aria-hidden="true"
    >
      {/* ── 0. INSTANT-PAINT LQIP UNDERLAY ───────────────────────────────────
          A 486-byte 48px-wide blurred thumbnail painted on first frame so the
          canvas never flashes empty on slow connections.
          Fades out after the hero image loads to free the GPU blur layer. */}
      <div
        className="hero-lqip absolute inset-[-2%]"
        style={{
          backgroundImage: `url(${hero.backgroundTiny})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: heroLoaded ? 0 : 1,
          // Releasing the filter (not just fading opacity) is what actually
          // frees the full-screen GPU blur layer on Android once the real
          // artwork has loaded.
          filter: heroLoaded ? "none" : "blur(20px) saturate(1.2) brightness(1.05)",
          transition: "opacity 0.8s ease",
          pointerEvents: "none",
          visibility: heroLoaded ? "hidden" : "visible",
        }}
      />

      {/* ── 1. HERO BAND (first viewport) — the artwork exactly as approved ───
          Full-bleed cover of the first viewport, identical to the approved
          hero reference. Desktop art for landscape, 9:16 art for phones. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-0.75%",
          right: "-0.75%",
          height: "100vh",
        }}
      >
        {/* brightness(0.92) equivalent: a flat 8% black source-over tint.
            Identical result without a full-screen filter compositor layer,
            which destabilises Android compositing during the hero animation. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(5, 0, 2, 0.08)" }}
        />
        <Image
          src={hero.backgroundDesktop}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center max-md:hidden"
          priority
          onLoad={() => setHeroLoaded(true)}
        />
        <Image
          src={hero.backgroundMobile}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          className="object-cover md:hidden"
          priority
          onLoad={() => setHeroLoaded(true)}
          style={{
            objectPosition: "center 32%",
            // Zoom past the artwork's dark top strip so the fold opens on
            // blooms, not bare silk (mirrors the reference's rich hero)
            transform: "scale(1.18)",
            transformOrigin: "50% 30%",
          }}
        />
      </div>

      {/* ── 2. SECOND BAND — 100% pure-flower field below the fold ─────────
          floral-band is cropped strictly from the reference's bloom-dense
          column (envelope region excluded by construction), so NO letter or
          envelope can ever ghost through the background. */}
      <div
        className="absolute left-0 right-0 max-md:hidden"
        style={{
          top: "100vh",
          height: "100vh",
          contain: "paint",
          filter: "brightness(0.94) saturate(1.02)",
          backgroundImage: `url(${hero.backgroundBand})`,
          backgroundSize: "cover",
          backgroundPosition: "center 22%",
        }}
      />
      <div
        className="absolute left-0 right-0 md:hidden"
        style={{
          top: "100vh",
          height: "110vh",
          contain: "paint",
          filter: "brightness(0.9) saturate(1.02)",
          backgroundImage: `url(${hero.backgroundBand})`,
          backgroundSize: "cover",
          backgroundPosition: "center 18%",
        }}
      />

      {/* ── 3. REMAINDER BAND — pure deep-rose field to the page end ───────── */}
      <div
        className="absolute left-0 right-0 bottom-0 max-md:hidden"
        style={{
          top: "200vh",
          contain: "paint",
          filter: "blur(1.2px) brightness(0.86) saturate(1.02)",
          backgroundImage: `url(${hero.backgroundBand})`,
          backgroundSize: "cover",
          backgroundPosition: "center 68%",
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 md:hidden"
        style={{
          top: "210vh",
          contain: "paint",
          filter: "blur(1.2px) brightness(0.84) saturate(1.02)",
          backgroundImage: `url(${hero.backgroundBand})`,
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
        }}
      />

      {/* ── 3. SECTION CALMING GRADIENT ────────────────────────────────────────
          Deepens the zone where the gold-framed panels live so their glass
          stays readable over the blooms. Dark burgundy, never black. */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "118vh",
          height: "115vh",
          background:
            "linear-gradient(to bottom, rgba(10,2,5,0.00) 0%, rgba(10,2,5,0.30) 26%, rgba(10,2,5,0.38) 55%, rgba(10,2,5,0.16) 88%, rgba(10,2,5,0) 100%)",
        }}
      />

      {/* ── 4. CORNER ACCENTS — the artwork's own corners at low opacity for
          rim detail on large monitors (same cached file, no extra download). */}
      <div
        className="absolute -top-2 -left-2 w-56 h-64 opacity-25 hidden sm:block"
        style={{
          mixBlendMode: "screen",
          backgroundImage: `url(${hero.backgroundDesktop})`,
          backgroundSize: "1600px auto",
          backgroundPosition: "-40px -30px",
          WebkitMaskImage:
            "radial-gradient(ellipse at top left, black 30%, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse at top left, black 30%, transparent 72%)",
        }}
      />
      <div
        className="absolute -top-2 -right-2 w-56 h-64 opacity-25 hidden sm:block"
        style={{
          mixBlendMode: "screen",
          backgroundImage: `url(${hero.backgroundDesktop})`,
          backgroundSize: "1600px auto",
          backgroundPosition: "calc(100% + 40px) -30px",
          WebkitMaskImage:
            "radial-gradient(ellipse at top right, black 30%, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse at top right, black 30%, transparent 72%)",
        }}
      />

      {/* ── 6. VIGNETTE UNIFY — presses the whole canvas into near-black
          burgundy; edges and corners fall to black, centre stays dark but
          retains the faintest wine breath. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 88% 78% at 50% 44%, rgba(13,3,6,0.10) 0%, rgba(8,2,4,0.34) 62%, rgba(4,0,2,0.62) 100%)",
        }}
      />

      {/* ── 5. CINEMATIC FOCUS VIGNETTE (hero zone) ───────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-screen"
        style={{
          background:
            "radial-gradient(ellipse 92% 82% at 50% 44%, rgba(8,0,3,0) 55%, rgba(5,0,2,0.42) 100%)",
        }}
      />


    </div>
  );
};
