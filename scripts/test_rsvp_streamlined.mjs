// ==============================================================================
// Comprehensive E2E Verification for Streamlined RSVP Flow
// ==============================================================================

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("STREAMLINED RSVP END-TO-END TEST SUITE");
  console.log(`Target: ${BASE_URL}`);
  console.log("=================================================\n");

  // TEST 1: Attending, Not Staying
  console.log("--- TEST 1: Attending, Not Staying ---");
  try {
    const payload = {
      name: "Arthur Pendelton",
      email: "arthur@example.com",
      attendance: "yes",
      guestCount: 2,
      accommodation: {
        staying: false,
      },
      message: "Looking forward to celebrating with you both!",
    };
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.1",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("Status:", res.status, "Response:", data);
    assert(res.status === 200 && data.success === true, "POST /api/rsvp succeeds with 200 for attending, not staying");
    assert(typeof data.id === "string" && data.id.length > 20, "Returned response includes generated UUID");
  } catch (err) {
    assert(false, `Test 1 failed with error: ${err.message}`);
  }

  // TEST 2: Attending, Staying with Full Details
  console.log("\n--- TEST 2: Attending, Staying with Hospitality Details ---");
  try {
    const payload = {
      name: "Eleanor & James Vance",
      email: "eleanor.vance@example.com",
      attendance: "yes",
      guestCount: 2,
      accommodation: {
        staying: true,
        stayGuestName: "Eleanor Vance",
        phone: "+1 415 555 2671",
        peopleStaying: 2,
        arrivalDate: "2026-11-20",
        departureDate: "2026-11-23",
        roomsRequired: 1,
      },
      message: "Thrilled to share this wonderful weekend!",
    };
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.2",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("Status:", res.status, "Response:", data);
    assert(res.status === 200 && data.success === true, "POST /api/rsvp succeeds with 200 for staying guest");
    assert(typeof data.id === "string" && data.id.length > 20, "Returned response includes generated UUID for stay record");
  } catch (err) {
    assert(false, `Test 2 failed with error: ${err.message}`);
  }

  // TEST 3: Respectfully Declined
  console.log("\n--- TEST 3: Respectfully Declined ---");
  try {
    const payload = {
      name: "Marcus Aurelius",
      email: "marcus@example.com",
      attendance: "no",
      guestCount: 1,
      accommodation: {
        staying: false,
      },
      message: "Wishing you a lifetime of happiness together!",
    };
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.3",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("Status:", res.status, "Response:", data);
    assert(res.status === 200 && data.success === true, "POST /api/rsvp succeeds with 200 for declined response");
    assert(typeof data.id === "string" && data.id.length > 20, "Returned response includes generated UUID for declined record");
  } catch (err) {
    assert(false, `Test 3 failed with error: ${err.message}`);
  }

  // TEST 4: Validation Negative Cases
  console.log("\n--- TEST 4: Validation Negative Checks ---");
  try {
    // 4a. Missing stay fields when staying = true
    const res1 = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.4",
      },
      body: JSON.stringify({
        name: "Test Incomplete Stay",
        attendance: "yes",
        guestCount: 2,
        accommodation: {
          staying: true,
          // Missing phone, arrivalDate, departureDate
        },
      }),
    });
    const data1 = await res1.json();
    assert(res1.status === 400 && data1.success === false, "Rejects staying=true with missing phone / dates");

    // 4b. Invalid date order (departure before arrival)
    const res2 = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.5",
      },
      body: JSON.stringify({
        name: "Test Inverted Dates",
        attendance: "yes",
        guestCount: 2,
        accommodation: {
          staying: true,
          phone: "1234567890",
          arrivalDate: "2026-11-25",
          departureDate: "2026-11-20",
        },
      }),
    });
    const data2 = await res2.json();
    assert(res2.status === 400 && data2.error && data2.error.includes("Departure"), "Rejects departure date before arrival date");

    // 4c. Name empty
    const res3 = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.6",
      },
      body: JSON.stringify({
        name: "   ",
        attendance: "yes",
      }),
    });
    const data3 = await res3.json();
    assert(res3.status === 400 && data3.error && data3.error.includes("full name"), "Rejects empty or whitespace-only name");

    // 4d. Negative guest count
    const res4 = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.7",
      },
      body: JSON.stringify({
        name: "Test Bad Guests",
        attendance: "yes",
        guestCount: -5,
      }),
    });
    const data4 = await res4.json();
    assert(res4.status === 400 && data4.error && data4.error.includes("Guest count"), "Rejects negative guest count");

    // 4e. Excessively long phone
    const res5 = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.8",
      },
      body: JSON.stringify({
        name: "Test Long Phone",
        attendance: "yes",
        guestCount: 1,
        accommodation: {
          staying: true,
          phone: "1".repeat(50),
          arrivalDate: "2026-11-20",
          departureDate: "2026-11-23",
        },
      }),
    });
    const data5 = await res5.json();
    assert(res5.status === 400 && data5.error && data5.error.includes("Phone number"), "Rejects phone number > 30 chars");
  } catch (err) {
    assert(false, `Test 4 failed with error: ${err.message}`);
  }

  // TEST 5: Method Not Allowed for GET /api/rsvp (Guest enumeration prevention)
  console.log("\n--- TEST 5: Guest Enumeration Prevention ---");
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, { method: "GET" });
    assert(res.status === 405, "GET /api/rsvp returns 405 Method Not Allowed");
  } catch (err) {
    assert(false, `Test 5 failed with error: ${err.message}`);
  }

  // TEST 6: Admin Security - Unauthenticated Access Protection
  console.log("\n--- TEST 6: Admin Security Access Protection ---");
  try {
    const res1 = await fetch(`${BASE_URL}/api/admin/rsvps`);
    assert(res1.status === 401, "GET /api/admin/rsvps blocks unauthenticated access with 401");

    const res2 = await fetch(`${BASE_URL}/api/admin/rsvps/00000000-0000-0000-0000-000000000000`, {
      method: "DELETE",
    });
    assert(res2.status === 401, "DELETE /api/admin/rsvps/[id] blocks unauthenticated deletion with 401");

    const res3 = await fetch(`${BASE_URL}/api/admin/rsvps/00000000-0000-0000-0000-000000000000`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacker" }),
    });
    assert(res3.status === 401, "PATCH /api/admin/rsvps/[id] blocks unauthenticated updates with 401");
  } catch (err) {
    assert(false, `Test 6 failed with error: ${err.message}`);
  }

  console.log("\n=================================================");
  console.log(`E2E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
