import { NextResponse, type NextRequest } from "next/server";
import { createClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { RSVPSubmission } from "@/types/wedding";
import { RSVPInsert } from "@/types/database";

// Lightweight in-memory rate limiting bucket: max 10 requests per minute per client IP.
// NOTE: This provides lightweight single-node abuse mitigation and is not a globally distributed rate limiter.
const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW_MS = 60000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientBucket = rateLimitMap.get(ip);

  if (!clientBucket || now > clientBucket.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (clientBucket.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  clientBucket.count += 1;
  return true;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const d = new Date(dateStr + "T00:00:00Z");
  return !isNaN(d.getTime());
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed. Public RSVP endpoint accepts POST submissions only." },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    // 1. Basic Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submission attempts. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload Shape
    let payload: RSVPSubmission;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed request. Valid JSON is required." },
        { status: 400 }
      );
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json(
        { success: false, error: "Invalid submission payload structure." },
        { status: 400 }
      );
    }

    const { name, email, attendance, guestCount, dietaryPreference, dietaryOther, accommodation, message } = payload;

    // 3. Runtime Input Validations & Length Bounds
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: "Name cannot exceed 100 characters." },
        { status: 400 }
      );
    }

    let validatedEmail: string | null = null;
    if (typeof email === "string" && email.trim()) {
      const trimmedEmail = email.trim();
      if (trimmedEmail.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        validatedEmail = trimmedEmail;
      }
    }

    if (attendance !== "yes" && attendance !== "no") {
      return NextResponse.json(
        { success: false, error: "Please indicate whether you will be joining us." },
        { status: 400 }
      );
    }

    const isAttending = attendance === "yes";

    // Guest count validation
    let validatedGuestCount = 1;
    if (isAttending) {
      if (guestCount !== undefined) {
        if (typeof guestCount !== "number" || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
          return NextResponse.json(
            { success: false, error: "Guest count must be an integer between 1 and 10." },
            { status: 400 }
          );
        }
        validatedGuestCount = guestCount;
      }
    }

    // Dietary validations
    let validatedDietary = "no-preference";
    if (isAttending && dietaryPreference) {
      if (typeof dietaryPreference !== "string" || dietaryPreference.length > 50) {
        return NextResponse.json(
          { success: false, error: "Invalid dietary preference selection." },
          { status: 400 }
        );
      }
      validatedDietary = dietaryPreference;
    }

    let validatedDietaryOther: string | null = null;
    if (isAttending && dietaryOther) {
      if (typeof dietaryOther !== "string") {
        return NextResponse.json(
          { success: false, error: "Invalid dietary details." },
          { status: 400 }
        );
      }
      const trimmedDietaryOther = dietaryOther.trim();
      if (trimmedDietaryOther.length > 200) {
        return NextResponse.json(
          { success: false, error: "Dietary details cannot exceed 200 characters." },
          { status: 400 }
        );
      }
      if (trimmedDietaryOther) {
        validatedDietaryOther = trimmedDietaryOther;
      }
    }

    // Accommodation validations
    const isStaying = isAttending && typeof accommodation === "object" && accommodation !== null && !!accommodation.staying;

    let validatedStayGuestName: string | null = null;
    let validatedPhone: string | null = null;
    let validatedArrival: string | null = null;
    let validatedDeparture: string | null = null;
    let validatedRooms: number | null = null;
    let validatedPeopleStaying: number | null = null;
    let validatedTransportation: string | null = null;
    let validatedTransportationOther: string | null = null;
    let validatedSpecialReqs: string | null = null;

    if (isStaying) {
      // Guest Full Name for Stay
      if (typeof accommodation.stayGuestName === "string" && accommodation.stayGuestName.trim()) {
        validatedStayGuestName = accommodation.stayGuestName.trim().slice(0, 100);
      } else {
        validatedStayGuestName = trimmedName;
      }

      // Phone
      if (typeof accommodation.phone !== "string" || !accommodation.phone.trim()) {
        return NextResponse.json(
          { success: false, error: "Please provide a contact phone number for stay coordination." },
          { status: 400 }
        );
      }
      const trimmedPhone = accommodation.phone.trim();
      if (trimmedPhone.length < 5 || trimmedPhone.length > 30) {
        return NextResponse.json(
          { success: false, error: "Phone number must be between 5 and 30 characters." },
          { status: 400 }
        );
      }
      validatedPhone = trimmedPhone;

      // Dates
      if (
        typeof accommodation.arrivalDate !== "string" ||
        !isValidIsoDate(accommodation.arrivalDate) ||
        typeof accommodation.departureDate !== "string" ||
        !isValidIsoDate(accommodation.departureDate)
      ) {
        return NextResponse.json(
          { success: false, error: "Please provide valid arrival and departure dates (YYYY-MM-DD)." },
          { status: 400 }
        );
      }

      if (accommodation.departureDate < accommodation.arrivalDate) {
        return NextResponse.json(
          { success: false, error: "Departure date cannot precede arrival date." },
          { status: 400 }
        );
      }
      validatedArrival = accommodation.arrivalDate;
      validatedDeparture = accommodation.departureDate;

      // Rooms & People staying
      if (accommodation.roomsRequired !== undefined) {
        if (
          typeof accommodation.roomsRequired !== "number" ||
          !Number.isInteger(accommodation.roomsRequired) ||
          accommodation.roomsRequired < 1 ||
          accommodation.roomsRequired > 5
        ) {
          return NextResponse.json(
            { success: false, error: "Rooms requested must be between 1 and 5." },
            { status: 400 }
          );
        }
        validatedRooms = accommodation.roomsRequired;
      } else {
        validatedRooms = 1;
      }

      if (accommodation.peopleStaying !== undefined) {
        if (
          typeof accommodation.peopleStaying !== "number" ||
          !Number.isInteger(accommodation.peopleStaying) ||
          accommodation.peopleStaying < 1 ||
          accommodation.peopleStaying > 10
        ) {
          return NextResponse.json(
            { success: false, error: "Number of guests staying must be between 1 and 10." },
            { status: 400 }
          );
        }
        validatedPeopleStaying = accommodation.peopleStaying;
      } else {
        validatedPeopleStaying = validatedGuestCount;
      }

      // Transit & Special Reqs
      if (accommodation.transportation) {
        if (typeof accommodation.transportation !== "string" || accommodation.transportation.length > 50) {
          return NextResponse.json(
            { success: false, error: "Invalid transportation selection." },
            { status: 400 }
          );
        }
        validatedTransportation = accommodation.transportation;
      }

      if (accommodation.transportationOther) {
        if (typeof accommodation.transportationOther !== "string") {
          return NextResponse.json(
            { success: false, error: "Invalid transportation notes." },
            { status: 400 }
          );
        }
        const trimmedTransitOther = accommodation.transportationOther.trim();
        if (trimmedTransitOther.length > 200) {
          return NextResponse.json(
            { success: false, error: "Transportation notes cannot exceed 200 characters." },
            { status: 400 }
          );
        }
        if (trimmedTransitOther) validatedTransportationOther = trimmedTransitOther;
      }

      if (accommodation.specialRequirements) {
        if (typeof accommodation.specialRequirements !== "string") {
          return NextResponse.json(
            { success: false, error: "Invalid special requirements." },
            { status: 400 }
          );
        }
        const trimmedReqs = accommodation.specialRequirements.trim();
        if (trimmedReqs.length > 500) {
          return NextResponse.json(
            { success: false, error: "Special requirements cannot exceed 500 characters." },
            { status: 400 }
          );
        }
        if (trimmedReqs) validatedSpecialReqs = trimmedReqs;
      }
    }

    // Message validation
    let validatedMessage: string | null = null;
    if (message) {
      if (typeof message !== "string") {
        return NextResponse.json(
          { success: false, error: "Invalid personal message format." },
          { status: 400 }
        );
      }
      const trimmedMsg = message.trim();
      if (trimmedMsg.length > 1000) {
        return NextResponse.json(
          { success: false, error: "Personal message cannot exceed 1000 characters." },
          { status: 400 }
        );
      }
      if (trimmedMsg) validatedMessage = trimmedMsg;
    }

    // 4. Map to Normalized Database Row
    const rsvpRow: RSVPInsert = {
      name: trimmedName,
      email: validatedEmail,
      attendance: isAttending ? "attending" : "declined",
      guest_count: validatedGuestCount,
      dietary_preference: validatedDietary,
      dietary_other: validatedDietaryOther,
      accommodation_required: isStaying,
      stay_guest_name: validatedStayGuestName,
      phone: validatedPhone,
      people_staying: validatedPeopleStaying,
      arrival_date: validatedArrival,
      departure_date: validatedDeparture,
      rooms_required: validatedRooms,
      transportation: validatedTransportation,
      transportation_other: validatedTransportationOther,
      special_requirements: validatedSpecialReqs,
      message: validatedMessage,
      status: "received",
    };

    // 5. Persistence Execution
    if (isServerSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("rsvps").insert(rsvpRow).select("id").single();

      if (error) {
        // Privacy rule: Never log personal guest details or PII
        console.error("[RSVP API Insert Error] Code:", error.code);
        return NextResponse.json(
          {
            success: false,
            error: "Something went wrong while sending your RSVP. Please try again.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, id: data?.id });
    } else {
      // Local development fallback when Supabase credentials are not yet configured
      console.warn(
        "[RSVP API Notice] Supabase credentials not set in environment. Submission processed in local simulation mode."
      );
      return NextResponse.json({
        success: true,
        unconfiguredNotice: true,
        id: "local-simulation-" + Date.now(),
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[RSVP API Exception] Code:", error?.name || "UnhandledException");
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while sending your RSVP. Please try again.",
      },
      { status: 500 }
    );
  }
}
