"use client";

import React, { useState, useEffect } from "react";
import { Share, Check, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "our-story", label: "OUR STORY" },
  { id: "events", label: "EVENTS" },
  { id: "directions", label: "DIRECTIONS" },
  { id: "rsvp", label: "RSVP" },
] as const;

export const StationeryNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("our-story");
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let scrollFrame = 0;
    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
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
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);

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
      className="sticky top-0 z-40 w-full bg-[#120306]/90 backdrop-blur-xl border-b border-[#caa24d]/30 select-none transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between">
        {/* Left: N / A Monogram */}
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-cinzel text-sm sm:text-base tracking-[0.25em] text-[#d8b257] hover:text-[#fff0c7] transition-colors cursor-pointer"
          aria-label="Scroll to top"
        >
          N <span className="font-serif italic text-xs text-[#d8b257]/70">/</span> A
        </button>

        {/* Center: Navigation Links (desktop & tablet) */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-6 md:gap-10">
          {NAV_ITEMS.map((item) => {
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

        {/* Right: Share + Mobile Hamburger */}
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
              <Check className="w-4 h-4 text-[#caa24d]" />
            ) : (
              <Share className="w-4 h-4 text-[#caa24d]" />
            )}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden flex items-center justify-center w-9 h-9 -mr-1.5 text-[#e5c57b] hover:text-[#fff0c7] transition-colors cursor-pointer"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE SLIDE-DOWN GLASS DRAWER ─────────────────────────────────── */}
      <div
        id="mobile-nav-drawer"
        className={`sm:hidden absolute top-full left-0 right-0 overflow-hidden transition-[max-height,opacity] duration-400 ease-out ${
          menuOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="mx-3 mt-1 mb-3 rounded-xl border border-[#caa24d]/30 bg-[#1a040c]/95 backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Drawer header flourish */}
          <div className="px-5 pt-3.5 pb-2 flex items-center justify-center">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#caa24d]/60 to-transparent" />
            <span className="mx-3 font-sans text-[8.5px] tracking-[0.35em] text-[#caa24d]/70 uppercase">
              MENU
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#caa24d]/60 to-transparent" />
          </div>

          <ul className="pb-2">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#caa24d]/[0.12] text-[#fff0c7]"
                        : "text-[#e5c57b]/85 hover:bg-[#caa24d]/[0.08] hover:text-[#fff0c7]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-serif italic text-[10px] text-[#caa24d]/60 w-4">
                        0{idx + 1}
                      </span>
                      <span className="font-cinzel text-[11.5px] tracking-[0.28em] uppercase">
                        {item.label}
                      </span>
                    </span>
                    {isActive && (
                      <span className="w-4 h-[1.5px] bg-[#e5c57b] rounded-full" aria-hidden="true" />
                    )}
                  </button>
                  {idx < NAV_ITEMS.length - 1 && (
                    <div className="mx-5 h-[1px] bg-[#caa24d]/10" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
