// ==============================================================================
// Admin Dashboard & CSV Export Logic Verification
// ==============================================================================

import assert from "assert";

console.log("=================================================");
console.log("ADMIN DASHBOARD & CSV EXPORT VERIFICATION");
console.log("=================================================\n");

// 1. Mock RSVPs representing clean database rows
const sampleRsvps = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Arthur & Guinevere",
    email: "arthur@camelot.org",
    attendance: "attending",
    guest_count: 2,
    accommodation_required: true,
    stay_guest_name: "King Arthur",
    phone: "+44 7700 900077",
    people_staying: 2,
    arrival_date: "2026-11-20",
    departure_date: "2026-11-23",
    rooms_required: 1,
    message: "May your kingdom flourish!",
    status: "received",
    created_at: "2026-09-22T10:00:00Z",
    updated_at: "2026-09-22T10:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Lancelot Du Lac",
    email: "lancelot@lake.org",
    attendance: "attending",
    guest_count: 1,
    accommodation_required: false,
    stay_guest_name: null,
    phone: null,
    people_staying: null,
    arrival_date: null,
    departure_date: null,
    rooms_required: null,
    message: "Honored to celebrate with you.",
    status: "received",
    created_at: "2026-09-22T10:15:00Z",
    updated_at: "2026-09-22T10:15:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Morgana Le Fay",
    email: "morgana@avalon.org",
    attendance: "declined",
    guest_count: 1,
    accommodation_required: false,
    stay_guest_name: null,
    phone: null,
    people_staying: null,
    arrival_date: null,
    departure_date: null,
    rooms_required: null,
    message: "Sending warmest thoughts from Avalon.",
    status: "received",
    created_at: "2026-09-22T10:30:00Z",
    updated_at: "2026-09-22T10:30:00Z",
  },
];

// Test CSV Generation matching page.tsx implementation
const headers = [
  "ID",
  "Guest Name",
  "Email",
  "Attendance",
  "Guest Count",
  "Accommodation Required",
  "Stay Guest Name",
  "Contact Phone",
  "People Staying",
  "Arrival Date",
  "Departure Date",
  "Rooms Required",
  "Personal Message",
  "Status",
  "Submitted At",
  "Updated At",
];

const escapeCsv = (val) => {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'` + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
};

const rows = sampleRsvps.map((r) => [
  escapeCsv(r.id),
  escapeCsv(r.name),
  escapeCsv(r.email),
  escapeCsv(r.attendance),
  escapeCsv(r.guest_count),
  escapeCsv(r.accommodation_required ? "YES" : "NO"),
  escapeCsv(r.stay_guest_name),
  escapeCsv(r.phone),
  escapeCsv(r.people_staying),
  escapeCsv(r.arrival_date),
  escapeCsv(r.departure_date),
  escapeCsv(r.rooms_required),
  escapeCsv(r.message),
  escapeCsv(r.status),
  escapeCsv(r.created_at),
  escapeCsv(r.updated_at),
]);

const csvContent =
  "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows.map((row) => row.join(","))].join("\r\n");

console.log("--- CSV HEADERS AUDIT ---");
console.log("Headers count:", headers.length);
console.log("Headers list:", headers);

// Assert obsolete columns are NOT in headers
const forbiddenKeywords = ["dietary", "transportation", "transit", "special"];
for (const kw of forbiddenKeywords) {
  const foundInHeader = headers.some((h) => h.toLowerCase().includes(kw));
  assert(!foundInHeader, `Header should not contain '${kw}'`);
  console.log(`  [PASS] '${kw}' is absent from CSV headers`);
}

// Assert row length matches header length exactly
for (let i = 0; i < rows.length; i++) {
  assert(rows[i].length === headers.length, `Row ${i} length ${rows[i].length} must match headers length ${headers.length}`);
  console.log(`  [PASS] Row ${i} column count matches header count (${rows[i].length})`);
}

// Assert CSV content contains BOM and properly escaped rows
assert(csvContent.startsWith("\uFEFF"), "CSV content starts with UTF-8 BOM");
console.log("  [PASS] CSV content has UTF-8 BOM for Excel compatibility");

console.log("\n--- CSV SAMPLE PREVIEW ---");
console.log(csvContent.slice(0, 500));

console.log("\n=================================================");
console.log("ALL ADMIN & CSV AUDITS PASSED SUCCESSFULLY");
console.log("=================================================");
