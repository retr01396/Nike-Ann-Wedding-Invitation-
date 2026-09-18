import { NextResponse, type NextRequest } from "next/server";
import { createClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      rsvps: [],
      unconfigured: true,
    });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  // Check admin_users
  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRecord) {
    return NextResponse.json(
      { success: false, error: "Forbidden. Admin authorization required." },
      { status: 403 }
    );
  }

  const { data: rsvps, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Admin RSVPs API Error]", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch RSVP records." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, rsvps: rsvps || [] });
}
