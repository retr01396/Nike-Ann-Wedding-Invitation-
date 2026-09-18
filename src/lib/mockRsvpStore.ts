import { RSVPRow, RSVPInsert, RSVPUpdate } from "@/types/database";

// In-memory store for local simulation mode
const mockRsvps: RSVPRow[] = [
  {
    id: "mock-1",
    name: "Dr. Matthew & Elizabeth Thomas",
    email: "m.thomas@example.com",
    attendance: "attending",
    guest_count: 2,
    dietary_preference: "vegetarian",
    dietary_other: null,
    accommodation_required: true,
    stay_guest_name: "Dr. Matthew Thomas",
    phone: "+91 98450 11223",
    people_staying: 2,
    arrival_date: "2026-11-14",
    departure_date: "2026-11-16",
    rooms_required: 1,
    transportation: "flight",
    transportation_other: "Kochi International Airport, AI 512",
    special_requirements: "Ground floor room preferred",
    message: "Cannot wait to celebrate with you both in Thrissur!",
    status: "confirmed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "mock-2",
    name: "Rachel Kurian & Family",
    email: "rachel.k@example.com",
    attendance: "attending",
    guest_count: 3,
    dietary_preference: "no-preference",
    dietary_other: null,
    accommodation_required: false,
    stay_guest_name: null,
    phone: null,
    people_staying: null,
    arrival_date: null,
    departure_date: null,
    rooms_required: null,
    transportation: "personal",
    transportation_other: null,
    special_requirements: null,
    message: "Hearty congratulations to the lovely couple!",
    status: "received",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function getMockRsvps(): RSVPRow[] {
  return [...mockRsvps];
}

export function getMockRsvpById(id: string): RSVPRow | null {
  return mockRsvps.find((r) => r.id === id) || null;
}

export function addMockRsvp(insertData: RSVPInsert): RSVPRow {
  const newRow: RSVPRow = {
    id: insertData.id || "local-" + Date.now(),
    name: insertData.name,
    email: insertData.email || null,
    attendance: insertData.attendance,
    guest_count: insertData.guest_count ?? 1,
    dietary_preference: insertData.dietary_preference ?? "no-preference",
    dietary_other: insertData.dietary_other || null,
    accommodation_required: insertData.accommodation_required ?? false,
    stay_guest_name: insertData.stay_guest_name || null,
    phone: insertData.phone || null,
    people_staying: insertData.people_staying ?? null,
    arrival_date: insertData.arrival_date || null,
    departure_date: insertData.departure_date || null,
    rooms_required: insertData.rooms_required ?? null,
    transportation: insertData.transportation || null,
    transportation_other: insertData.transportation_other || null,
    special_requirements: insertData.special_requirements || null,
    message: insertData.message || null,
    status: insertData.status || "received",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockRsvps.unshift(newRow);
  return newRow;
}

export function updateMockRsvp(id: string, updates: RSVPUpdate): RSVPRow | null {
  const index = mockRsvps.findIndex((r) => r.id === id);
  if (index === -1) return null;

  mockRsvps[index] = {
    ...mockRsvps[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return mockRsvps[index];
}

export function deleteMockRsvp(id: string): boolean {
  const index = mockRsvps.findIndex((r) => r.id === id);
  if (index === -1) return false;
  mockRsvps.splice(index, 1);
  return true;
}
