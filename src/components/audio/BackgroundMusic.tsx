"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Music, Music2 } from "lucide-react";
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
 * 3. Discreet Control: A small circular floating button in the bottom-right
 *    corner — just a music-note icon, no text, no pill shape.
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

      {/* Small circular floating music toggle — no text, no pill */}
      <div
        className="fixed z-40 select-none print:hidden pointer-events-auto"
        style={{
          bottom: "max(20px, env(safe-area-inset-bottom, 20px) + 12px)",
          right: "16px",
        }}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Mute background wedding music" : "Play background wedding music"}
          aria-pressed={isPlaying}
          className={`
            relative flex items-center justify-center rounded-full
            w-11 h-11 sm:w-12 sm:h-12
            bg-[#160308]/80 hover:bg-[#20050c]/90
            backdrop-blur-md
            border transition-colors duration-300
            shadow-[0_6px_20px_rgba(0,0,0,0.75),0_0_10px_rgba(202,162,77,0.12)]
            active:scale-95 focus:outline-none focus:ring-1 focus:ring-[#caa24d]/50
            cursor-pointer
            ${isPlaying
              ? "border-[#caa24d]/50 hover:border-[#caa24d]/80"
              : "border-[#caa24d]/25 hover:border-[#caa24d]/50"
            }
          `}
        >
          {/* Music icon with slash overlay when muted */}
          <span className="relative flex items-center justify-center" aria-hidden="true">
            {isPlaying ? (
              <Music2
                className="w-4 h-4 sm:w-[17px] sm:h-[17px] text-[#caa24d]"
                strokeWidth={1.5}
              />
            ) : (
              <>
                <Music
                  className="w-4 h-4 sm:w-[17px] sm:h-[17px] text-[#caa24d]/45"
                  strokeWidth={1.5}
                />
                {/* Diagonal slash — muted state indicator */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="4"
                    y1="16"
                    x2="16"
                    y2="4"
                    stroke="#caa24d"
                    strokeOpacity="0.55"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </>
            )}
          </span>

          {/* Subtle pulsing ring when playing */}
          {isPlaying && (
            <span
              className="absolute inset-0 rounded-full border border-[#caa24d]/20 animate-music-pulse pointer-events-none"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Pulse animation — only for playing state ring */}
        <style>{`
          @keyframes musicPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0; transform: scale(1.35); }
          }
          .animate-music-pulse {
            animation: musicPulse 2.4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-music-pulse {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};
