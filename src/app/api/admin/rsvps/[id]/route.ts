import { NextResponse, type NextRequest } from "next/server";
import { createClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { RSVPUpdate } from "@/types/database";
import { getMockRsvpById, updateMockRsvp, deleteMockRsvp } from "@/lib/mockRsvpStore";

interface RouteParams {
  params: { id: string };
}

async function verifyAdminAuth() {
  if (!isServerSupabaseConfigured()) {
    return { authorized: true, isSimulation: true, supabase: null, user: null };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, isSimulation: false, status: 401, error: "Unauthorized" };
  }

  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRecord) {
    return { authorized: false, isSimulation: false, status: 403, error: "Forbidden: Admin required" };
  }

  return { authorized: true, isSimulation: false, supabase, user };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!isServerSupabaseConfigured()) {
    const rsvp = getMockRsvpById(params.id);
    if (!rsvp) {
      return NextResponse.json(
        { success: false, error: "RSVP record not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, rsvp });
  }

  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { data: rsvp, error } = await auth.supabase!
    .from("rsvps")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !rsvp) {
    return NextResponse.json(
      { success: false, error: "RSVP record not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, rsvp });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const body: RSVPUpdate = await request.json();

    // Strict field & constraint validation
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 100) {
        return NextResponse.json({ success: false, error: "Name must be between 1 and 100 characters." }, { status: 400 });
      }
      body.name = body.name.trim();
    }

    if (body.attendance !== undefined && !["attending", "declined"].includes(body.attendance)) {
      return NextResponse.json({ success: false, error: "Attendance must be 'attending' or 'declined'." }, { status: 400 });
    }

    if (body.guest_count !== undefined) {
      if (typeof body.guest_count !== "number" || !Number.isInteger(body.guest_count) || body.guest_count < 1 || body.guest_count > 10) {
        return NextResponse.json({ success: false, error: "Guest count must be an integer between 1 and 10." }, { status: 400 });
      }
    }

    if (body.attendance === "declined") {
      body.guest_count = 1;
      body.accommodation_required = false;
      body.stay_guest_name = null;
      body.phone = null;
      body.people_staying = null;
      body.arrival_date = null;
      body.departure_date = null;
      body.rooms_required = null;
    }

    if (body.accommodation_required === false) {
      body.stay_guest_name = null;
      body.phone = null;
      body.people_staying = null;
      body.arrival_date = null;
      body.departure_date = null;
      body.rooms_required = null;
    }

    if (body.accommodation_required === true) {
      if (body.stay_guest_name !== undefined && body.stay_guest_name !== null) {
        if (typeof body.stay_guest_name !== "string" || !body.stay_guest_name.trim() || body.stay_guest_name.trim().length > 100) {
          return NextResponse.json({ success: false, error: "Stay guest name must be between 1 and 100 characters." }, { status: 400 });
        }
        body.stay_guest_name = body.stay_guest_name.trim();
      }
      if (body.phone !== undefined && (typeof body.phone !== "string" || !body.phone.trim() || body.phone.trim().length < 5 || body.phone.trim().length > 30)) {
        return NextResponse.json({ success: false, error: "Phone number must be between 5 and 30 characters." }, { status: 400 });
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (body.arrival_date && !dateRegex.test(body.arrival_date)) {
        return NextResponse.json({ success: false, error: "Arrival date must follow YYYY-MM-DD format." }, { status: 400 });
      }
      if (body.departure_date && !dateRegex.test(body.departure_date)) {
        return NextResponse.json({ success: false, error: "Departure date must follow YYYY-MM-DD format." }, { status: 400 });
      }
      if (body.arrival_date && body.departure_date && body.departure_date < body.arrival_date) {
        return NextResponse.json(
          { success: false, error: "Departure date cannot precede arrival date." },
          { status: 400 }
        );
      }
      if (body.rooms_required !== undefined && body.rooms_required !== null) {
        if (typeof body.rooms_required !== "number" || !Number.isInteger(body.rooms_required) || body.rooms_required < 1 || body.rooms_required > 5) {
          return NextResponse.json({ success: false, error: "Rooms required must be between 1 and 5." }, { status: 400 });
        }
      }
      if (body.people_staying !== undefined && body.people_staying !== null) {
        if (typeof body.people_staying !== "number" || !Number.isInteger(body.people_staying) || body.people_staying < 1 || body.people_staying > 10) {
          return NextResponse.json({ success: false, error: "People staying must be between 1 and 10." }, { status: 400 });
        }
      }
    }

    if (body.message && body.message.length > 1000) {
      return NextResponse.json({ success: false, error: "Message cannot exceed 1000 characters." }, { status: 400 });
    }

    if (!isServerSupabaseConfigured()) {
      const updated = updateMockRsvp(params.id, body);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "RSVP record not found." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, rsvp: updated });
    }

    const { data: updated, error } = await auth.supabase!
      .from("rsvps")
      .update(body)
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) {
      console.error("[Admin Update Error]", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to update RSVP record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, rsvp: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid update request body." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  if (!isServerSupabaseConfigured()) {
    deleteMockRsvp(params.id);
    return NextResponse.json({ success: true, message: "RSVP deleted successfully." });
  }

  const { error } = await auth.supabase!.from("rsvps").delete().eq("id", params.id);

  if (error) {
    console.error("[Admin Delete Error]", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to delete RSVP record." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "RSVP deleted successfully." });
}
