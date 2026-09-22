"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your administrative email and password.");
      return;
    }

    if (!isConfigured) {
      setErrorMessage(
        "Supabase credentials are not configured in environment variables. Please consult docs/SUPABASE_SETUP.md."
      );
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid administrative credentials.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Force full document navigation to bypass Next.js client router cache
        // and ensure the new session cookies are transmitted in HTTP headers
        window.location.href = "/admin";
        return;
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col justify-center items-center px-4 py-12 bg-[#0c0104] text-[#fff0c7]">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,#26040b_0%,#0c0104_85%)] -z-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#caa24d]/40 bg-[#1d040a] mb-2 shadow-[0_0_20px_rgba(202,162,77,0.2)]">
            <span className="font-serif text-lg tracking-widest text-[#fff0c7]">
              N<span className="text-[#caa24d] font-light text-sm">/</span>A
            </span>
          </div>

          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#caa24d]">
            Operations Console
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.15em] text-[#fff0c7] uppercase">
            Admin Sign In
          </h1>
          <div className="flex justify-center pt-1">
            <div className="w-12 h-[1px] bg-[#caa24d]/40" />
          </div>
        </div>

        {/* Environment Alert if unconfigured */}
        {!isConfigured && (
          <div className="p-4 border border-[#caa24d]/50 bg-[#25040c] text-left space-y-2">
            <p className="font-sans text-[11px] uppercase tracking-wider text-[#caa24d] font-medium">
              Setup Required
            </p>
            <p className="font-serif text-xs text-[#f3e5c8]/85 leading-relaxed">
              Supabase environment variables (<code className="text-[#fff0c7] bg-[#140206] px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-[#fff0c7] bg-[#140206] px-1 py-0.5">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>) have not yet been populated in your local environment.
            </p>
            <p className="font-serif text-xs text-[#caa24d]/90 italic">
              See <code className="text-[#fff0c7]">docs/SUPABASE_SETUP.md</code> for step-by-step setup instructions.
            </p>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="relative p-6 sm:p-8 border border-[#caa24d]/30 bg-[#140206]/95 shadow-2xl space-y-5 text-left"
        >
          {/* Gold Corner Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#caa24d]/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#caa24d]/60 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#caa24d]/60 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#caa24d]/60 pointer-events-none" />

          {/* Error Banner */}
          {errorMessage && (
            <div
              className="p-3 border border-[#caa24d]/60 bg-[#2c060f] text-[#fff0c7] font-serif text-xs italic text-center animate-fadeIn"
              role="alert"
            >
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-email"
              className="block font-sans text-[9.5px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium"
            >
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              className="w-full px-3.5 py-2.5 bg-[#190308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans placeholder-[#caa24d]/35 focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d]"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block font-sans text-[9.5px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 bg-[#190308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans placeholder-[#caa24d]/35 focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d]"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-[#caa24d] bg-gradient-to-r from-[#caa24d] via-[#fff0c7] to-[#e5c57b] text-[#120206] font-serif text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_15px_rgba(202,162,77,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{isLoading ? "Signing In..." : "Sign In to Dashboard"}</span>
            </button>
          </div>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="font-serif text-xs text-[#caa24d]/75 hover:text-[#fff0c7] tracking-wider transition-colors"
          >
            ← Return to Public Wedding Invitation
          </Link>
        </div>
      </div>
    </div>
  );
}
