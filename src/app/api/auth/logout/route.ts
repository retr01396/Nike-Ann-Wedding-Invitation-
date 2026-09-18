import { NextResponse, type NextRequest } from "next/server";
import { createClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (isServerSupabaseConfigured()) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  const redirectUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
