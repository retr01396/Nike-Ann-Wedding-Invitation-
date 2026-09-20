"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

/**
 * BackgroundMusic — Luxury Atmospheric Audio Component
 *
 * Compliance & UX:
 * 1. Autoplay Policy: Modern browsers block sound before user interaction.
 *    This component attaches a one-time passive listener for the first user
 *    gesture (click, tap, keydown) anywhere on the page to unlock & start music.
 * 2. Gentle Fade-in: When playback begins, volume smoothly ramps from 0 to 0.45
 *    over 1.2 seconds to ensure a gracious, non-startling entrance.
 * 3. Discreet Control: A floating smoked-burgundy glass pill in the bottom-right
 *    allows guests to mute or play at will.
 * 4. Visibility Handling: Pauses when the browser tab is hidden to save battery
 *    and resumes smoothly when the guest returns.
 */
export const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const userMutedRef = useRef(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const audioConfig = weddingConfig.audio || {
    src: "/audio/background-music.mp3",
    title: "Nike & Ann Wedding Music",
    autoplayOnInteraction: true,
    defaultVolume: 0.45,
    loop: true,
  };

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  // Fade volume smoothly
  const fadeVolume = useCallback((targetVolume: number, durationMs = 1200, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = (targetVolume - startVolume) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const nextVol = Math.max(0, Math.min(1, startVolume + volumeStep * currentStep));
      if (audioRef.current) {
        audioRef.current.volume = nextVol;
      }

      if (currentStep >= steps) {
        clearFade();
        if (audioRef.current) {
          audioRef.current.volume = targetVolume;
        }
        if (onComplete) onComplete();
      }
    }, stepTime);
  }, []);

  // Play with smooth fade-in
  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return;

    audio.volume = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
          fadeVolume(audioConfig.defaultVolume ?? 0.45);
        })
        .catch(() => {
          // Autoplay blocked by browser policy prior to gesture
          setIsPlaying(false);
          isPlayingRef.current = false;
        });
    }
  }, [audioConfig.defaultVolume, fadeVolume]);

  // Pause with smooth fade-out
  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    fadeVolume(0, 400, () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    });
  }, [fadeVolume]);

  // Manual Toggle Button
  const togglePlay = () => {
    if (isPlaying) {
      userMutedRef.current = true;
      pauseAudio();
    } else {
      userMutedRef.current = false;
      playAudio();
    }
  };

  // Attach first-interaction listener
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!userMutedRef.current && audioConfig.autoplayOnInteraction && !isPlayingRef.current) {
        playAudio();
      }
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true, once: true });

    return () => {
      cleanupGestureListeners();
    };
  }, [audioConfig.autoplayOnInteraction, playAudio]);

  // Handle tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        if (isPlayingRef.current && !userMutedRef.current) {
          audio.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearFade();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={audioConfig.src}
        loop={audioConfig.loop ?? true}
        preload="auto"
        className="hidden"
        aria-hidden="true"
        onEnded={() => {
          if (audioConfig.loop) {
            playAudio();
          } else {
            setIsPlaying(false);
            isPlayingRef.current = false;
          }
        }}
      />
      <div
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none print:hidden pointer-events-auto"
        style={{ willChange: "transform" }}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Mute background wedding music" : "Play background wedding music"}
          aria-pressed={isPlaying}
          className="group relative flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#1b0409]/85 hover:bg-[#25060e]/95 backdrop-blur-md border border-[#caa24d]/40 hover:border-[#caa24d]/80 shadow-[0_12px_30px_rgba(0,0,0,0.85),0_0_15px_rgba(202,162,77,0.2)] text-[#fff0c7] transition-all duration-300 active:scale-95 focus:outline-none focus:ring-1 focus:ring-[#caa24d]/60 cursor-pointer"
        >
          {/* Animated Sound Wave Equalizer Bars */}
          <div className="flex items-center gap-[3px] h-3.5 w-3.5 justify-center" aria-hidden="true">
            <span
              className={`w-[2.5px] rounded-full bg-[#caa24d] transition-all duration-300 ${
                isPlaying ? "animate-sound-bar-1" : "h-1.5 opacity-50"
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full bg-[#fff0c7] transition-all duration-300 ${
                isPlaying ? "animate-sound-bar-2" : "h-3 opacity-60"
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full bg-[#caa24d] transition-all duration-300 ${
                isPlaying ? "animate-sound-bar-3" : "h-2 opacity-50"
              }`}
            />
          </div>

          {/* Volume Icon */}
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5c57b] transition-colors group-hover:text-[#fff0c7]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#caa24d]/60 transition-colors group-hover:text-[#e5c57b]" />
          )}

          {/* Text Label */}
          <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] font-medium text-[#fbf6ea] uppercase">
            {isPlaying ? "MUSIC ON" : "MUSIC OFF"}
          </span>

          {/* Gold Rim Glow */}
          <span
            className="absolute inset-0 rounded-full border border-[#fff0c7]/20 pointer-events-none group-hover:border-[#fff0c7]/40 transition-colors"
            aria-hidden="true"
          />
        </button>

        {/* Embedded CSS for equalizer animations */}
        <style>{`
          @keyframes soundBar1 {
            0%, 100% { height: 4px; }
            50% { height: 14px; }
          }
          @keyframes soundBar2 {
            0%, 100% { height: 14px; }
            50% { height: 6px; }
          }
          @keyframes soundBar3 {
            0%, 100% { height: 6px; }
            50% { height: 12px; }
          }
          .animate-sound-bar-1 {
            animation: soundBar1 1.1s ease-in-out infinite;
          }
          .animate-sound-bar-2 {
            animation: soundBar2 0.85s ease-in-out infinite 0.2s;
          }
          .animate-sound-bar-3 {
            animation: soundBar3 1.25s ease-in-out infinite 0.4s;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-sound-bar-1,
            .animate-sound-bar-2,
            .animate-sound-bar-3 {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};
