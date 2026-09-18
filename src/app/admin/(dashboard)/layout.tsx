import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isConfigured = isServerSupabaseConfigured();

  let user = null;
  let isAdmin = false;

  if (isConfigured) {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    user = authUser;

    if (!user) {
      redirect("/admin/login");
    }

    // Verify explicit authorization in public.admin_users table
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    isAdmin = !!adminRecord;

    // Deny access if authenticated user is not in admin_users
    if (!isAdmin) {
      return (
        <div className="min-h-[100svh] flex flex-col justify-center items-center px-4 bg-[#0c0104] text-[#fff0c7]">
          <div className="w-full max-w-md p-8 border border-[#caa24d]/30 bg-[#160308] text-center space-y-5">
            <div className="w-12 h-12 mx-auto rounded-full border border-red-500/40 bg-red-950/40 flex items-center justify-center text-red-300 font-serif text-xl">
              ✕
            </div>
            <h1 className="font-serif text-2xl uppercase tracking-widest text-[#fff0c7]">
              Access Denied
            </h1>
            <p className="font-serif text-sm text-[#f3e5c8]/80 leading-relaxed">
              Your account (<code className="text-[#caa24d]">{user.email}</code>) is authenticated, but is not provisioned as an authorized administrator in the <code className="text-[#caa24d]">admin_users</code> table.
            </p>
            <p className="font-serif text-xs text-[#caa24d]/75 italic">
              Please contact the couple or refer to <code className="text-[#fff0c7]">docs/SUPABASE_SETUP.md</code> to authorize this user UUID.
            </p>
            <div className="pt-2 flex justify-center space-x-4">
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 border border-[#caa24d]/40 text-xs font-sans uppercase tracking-wider text-[#fff0c7] hover:border-[#caa24d]"
                >
                  Sign Out
                </button>
              </form>
              <Link
                href="/"
                className="px-4 py-2 border border-[#caa24d]/20 text-xs font-sans uppercase tracking-wider text-[#caa24d] hover:text-[#fff0c7]"
              >
                Wedding Site
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#0c0104] text-[#fff0c7] flex flex-col antialiased">
      {/* Top Operations Header */}
      <header className="border-b border-[#caa24d]/25 bg-[#120205]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Monogram & Title */}
          <div className="flex items-center space-x-3">
            <Link href="/admin" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-full border border-[#caa24d]/50 bg-[#22040b] flex items-center justify-center group-hover:border-[#caa24d] transition-colors">
                <span className="font-serif text-xs tracking-wider text-[#fff0c7]">
                  N<span className="text-[#caa24d] text-[10px]">/</span>A
                </span>
              </div>
              <div>
                <span className="font-serif text-sm tracking-[0.15em] text-[#fff0c7] uppercase block leading-none">
                  Nike & Ann
                </span>
                <span className="font-sans text-[8.5px] tracking-[0.25em] text-[#caa24d]/80 uppercase block mt-1">
                  RSVP Operations
                </span>
              </div>
            </Link>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {user?.email && (
              <span className="hidden md:inline-block font-serif text-xs text-[#caa24d]/75 italic">
                {user.email}
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans uppercase tracking-wider text-[#caa24d]/80 hover:text-[#fff0c7] transition-colors flex items-center space-x-1"
            >
              <span>Public Site</span>
              <span className="text-[10px]">↗</span>
            </Link>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 border border-[#caa24d]/30 text-xs font-sans uppercase tracking-wider text-[#caa24d] hover:border-[#caa24d] hover:text-[#fff0c7] transition-all"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
