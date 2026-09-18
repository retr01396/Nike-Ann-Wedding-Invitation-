"use client";

import React, { useState, useEffect } from "react";
import { Share, Check } from "lucide-react";

export const StationeryNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("our-story");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "our-story", el: document.getElementById("our-story") || document.getElementById("story") },
        { id: "events", el: document.getElementById("events") },
        { id: "directions", el: document.getElementById("directions") || document.getElementById("travel") },
        { id: "rsvp", el: document.getElementById("rsvp") },
      ];
      const scrollPos = window.scrollY + 180;

      for (const section of sections) {
        if (section.el) {
          const top = section.el.offsetTop;
          const height = section.el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el =
      id === "directions"
        ? document.getElementById("directions") || document.getElementById("travel")
        : id === "our-story"
        ? document.getElementById("our-story") || document.getElementById("story")
        : document.getElementById(id);

    if (el) {
      const navHeight = 56;
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(0, elementTop - navHeight),
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title: "Nike & Ann Wedding Invitation",
      text: "A Brighter Chapter Together — Join us on Sunday, 15 November 2026 in Thrissur, Kerala.",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable
      }
    }
  };

  return (
    <nav
      id="stationery-nav"
      aria-label="Invitation Navigation"
      className="sticky top-0 z-40 w-full bg-[#120306]/95 backdrop-blur-md border-y border-[#caa24d]/35 select-none transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between">
        {/* Left: N / A Monogram */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-cinzel text-sm sm:text-base tracking-[0.25em] text-[#d8b257] hover:text-[#fff0c7] transition-colors cursor-pointer"
          aria-label="Scroll to top"
        >
          N <span className="font-serif italic text-xs text-[#d8b257]/70">/</span> A
        </button>

        {/* Center: Navigation Links with Active Gold Underline */}
        <div className="flex items-center gap-3 sm:gap-6 md:gap-10">
          {[
            { id: "our-story", label: "OUR STORY" },
            { id: "events", label: "EVENTS" },
            { id: "directions", label: "DIRECTIONS" },
            { id: "rsvp", label: "RSVP" },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="relative py-1 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <span
                  className={`font-cinzel text-[9.5px] sm:text-[11.5px] tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors ${
                    isActive
                      ? "text-[#fff0c7] font-medium"
                      : "text-[#d8b257]/75 group-hover:text-[#f3e7c6]"
                  }`}
                >
                  {item.label}
                </span>
                {isActive ? (
                  <span className="w-5 sm:w-6 h-[1.5px] bg-[#caa24d] mt-0.5 rounded-full" />
                ) : (
                  <span className="w-0 group-hover:w-4 h-[1px] bg-[#caa24d]/40 mt-0.5 transition-all duration-300 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Divider and Share button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-[1px] h-4 bg-[#caa24d]/30" />
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-[#d8b257]/85 hover:text-[#fff0c7] transition-colors cursor-pointer text-[10px] sm:text-[11px] font-cinzel tracking-[0.2em] uppercase"
            aria-label="Share wedding invitation"
          >
            <span className="hidden sm:inline">SHARE</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#caa24d]" />
            ) : (
              <Share className="w-3.5 h-3.5 text-[#caa24d]" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
