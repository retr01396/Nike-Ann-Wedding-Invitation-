// ==============================================================================
// Phase 6 API Security Negative & Positive Test Suite
// Executes locally against http://localhost:3000
// ==============================================================================

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function runTests() {
  console.log("=== Launching Phase 6 API Security Negative & Validation Tests ===");
  console.log(`Target: ${BASE_URL}\n`);

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

  // TEST 1: Public RSVP rejects empty body / non-object
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(["not", "an", "object"]),
    });
    const data = await res.json();
    assert(res.status === 400 && data.success === false, "POST /api/rsvp rejects array/malformed body with 400");
  } catch (err) {
    assert(false, `POST /api/rsvp malformed payload error: ${err.message}`);
  }

  // TEST 2: Public RSVP rejects missing name
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "   ",
        attendance: "yes",
      }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes("full name"), "POST /api/rsvp rejects blank name with 400");
  } catch (err) {
    assert(false, `POST /api/rsvp missing name error: ${err.message}`);
  }

  // TEST 3: Public RSVP rejects huge name string (> 100 chars)
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "A".repeat(150),
        attendance: "yes",
      }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes("100 characters"), "POST /api/rsvp rejects oversize name (>100 chars) with 400");
  } catch (err) {
    assert(false, `POST /api/rsvp oversize name error: ${err.message}`);
  }

  // TEST 4: Public RSVP rejects invalid attendance choice
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Valid Guest",
        attendance: "maybe",
      }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes("joining us"), "POST /api/rsvp rejects invalid attendance enum with 400");
  } catch (err) {
    assert(false, `POST /api/rsvp invalid attendance error: ${err.message}`);
  }

  // TEST 5: Public RSVP rejects invalid date sequence (departure before arrival)
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Valid Guest",
        attendance: "yes",
        accommodation: {
          staying: true,
          phone: "+91 98765 43210",
          arrivalDate: "2026-10-25",
          departureDate: "2026-10-23", // Precedes arrival
          roomsRequired: 1,
        },
      }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes("Departure date cannot precede"), "POST /api/rsvp rejects departure < arrival with 400");
  } catch (err) {
    assert(false, `POST /api/rsvp date sequence error: ${err.message}`);
  }

  // TEST 6: Public RSVP rejects accommodation without phone
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Valid Guest",
        attendance: "yes",
        accommodation: {
          staying: true,
          phone: "   ",
          arrivalDate: "2026-10-23",
          departureDate: "2026-10-25",
        },
      }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes("phone number"), "POST /api/rsvp rejects accommodation without phone with 400");
  } catch (err) {
    assert(false, `POST /api/rsvp missing phone error: ${err.message}`);
  }

  // TEST 7: Public RSVP accepts valid submission
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Security Audit Guest",
        attendance: "yes",
        guestCount: 2,
        dietaryPreference: "vegetarian",
        accommodation: {
          staying: false,
        },
        message: "Blessings to the wonderful couple!",
      }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, "POST /api/rsvp accepts valid submission");
  } catch (err) {
    assert(false, `POST /api/rsvp valid submission error: ${err.message}`);
  }

  // TEST 8: GET /api/rsvp does not expose records (method not allowed / 405)
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`, {
      method: "GET",
    });
    assert(res.status === 405, "GET /api/rsvp returns 405 Method Not Allowed (zero guest enumeration)");
  } catch (err) {
    assert(false, `GET /api/rsvp error: ${err.message}`);
  }

  // TEST 9: Admin single RSVP endpoint rejects unauthorized unauthenticated DELETE
  try {
    const res = await fetch(`${BASE_URL}/api/admin/rsvps/00000000-0000-0000-0000-000000000000`, {
      method: "DELETE",
    });
    const data = await res.json();
    assert(!res.ok || data.unconfigured || res.status === 401 || res.status === 503, "DELETE /api/admin/rsvps/[id] blocks unauthenticated deletion");
  } catch (err) {
    assert(false, `Admin DELETE error: ${err.message}`);
  }

  // TEST 10: Admin single RSVP PATCH rejects invalid date sequence
  try {
    const res = await fetch(`${BASE_URL}/api/admin/rsvps/00000000-0000-0000-0000-000000000000`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accommodation_required: true,
        arrival_date: "2026-10-25",
        departure_date: "2026-10-20",
      }),
    });
    // If not authenticated or unconfigured, it will return 401, 403, or 503; if processed, it rejects with 400
    assert(res.status === 400 || res.status === 401 || res.status === 403 || res.status === 503, "PATCH /api/admin/rsvps/[id] rejects unauthorized / invalid updates");
  } catch (err) {
    assert(false, `Admin PATCH error: ${err.message}`);
  }

  console.log(`\n=== API Security Verification Results: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
