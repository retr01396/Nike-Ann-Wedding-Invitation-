export type EnvelopeAnimationState =
  | "CLOSED"
  | "OPENING"
  | "FLAP_OPEN"
  | "CARD_EMERGING"
  | "CARD_CLEARING"
  | "CARD_SETTLING"
  | "CARD_EXPANDING"
  | "OPENED";

export interface CoupleConfig {
  groom: string;
  bride: string;
  connector: string;
  monogram: string;
  monogramShort: string;
}

export interface WeddingDateConfig {
  dayOfWeek: string;
  day: number;
  month: string;
  year: number;
  formatted: string;
  iso: string;
}

export interface WeddingLocationConfig {
  city: string;
  state: string;
  country: string;
  venueName?: string;
  display: string;
}

export interface WeddingTeaserConfig {
  badge: string;
  supertitle: string[];
  subtitle: string;
  openButtonText: string;
  scrollHint?: string;
}

export interface WeddingInvitationConfig {
  headerTag: string;
  inviteLine1: string;
  inviteLine2: string;
  presenceNote: string[];
  ctaButtonText: string;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  dateTag?: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  imageAlt: string;
  location?: string;
  orientation?: "portrait" | "landscape";
}

export interface StoryIntroConfig {
  badge: string;
  headline: string[];
  subheading: string;
  quote: string;
  quoteAuthor?: string;
  portraitImage: string;
  portraitAlt: string;
  portraitCaption?: string;
}

export interface StoryTimelineConfig {
  badge: string;
  title: string;
  subtitle: string;
  milestones: TimelineMilestone[];
  closingQuote?: {
    line1: string;
    line2: string;
  };
}

export interface WeddingEventDetailItem {
  id: string;
  type: "wedding" | "church" | "grooms-house" | string;
  badge?: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description?: string;
  image: string;
  imageAlt: string;
  dressCode?: string;
  receptionVenue?: string;
  parkingNotes?: string;
  familyNotes?: string;
  additionalInstructions?: string;
  contactInfo?: string;
  specialNotes?: string;
  mapUrl?: string;
}

export interface EventsSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
  events: WeddingEventDetailItem[];
}

export interface TravelCoordinates {
  latitude: number;
  longitude: number;
}

export interface TravelDestinationItem {
  id: string;
  type: "venue" | "church" | "residence" | string;
  category: string;
  title: string;
  subtitle?: string;
  address: string;
  cityLabel: string;
  coordinates?: TravelCoordinates;
  mapUrl?: string;
  directionsButtonText?: string;
  description?: string;
  landmark?: string;
  distance?: string;
  estimatedTravelTime?: string;
  parkingInfo?: string;
  taxiNotes?: string;
  publicTransportNotes?: string;
  pickupInfo?: string;
  shuttleInfo?: string;
  specialInstructions?: string;
  travelNotes?: string;
  mapPreviewImage?: string;
  isConfirmed: boolean;
  placeholderNotice?: string;
}

export interface TravelSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
  destinations: TravelDestinationItem[];
}

export type AttendanceOptionValue = "yes" | "no";

export interface RSVPOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

export interface RSVPAccommodationConfig {
  question: string;
  phoneLabel: string;
  phonePlaceholder: string;
  peopleStayingLabel: string;
  minPeople: number;
  maxPeople: number;
  arrivalDateLabel: string;
  departureDateLabel: string;
  roomsRequiredLabel: string;
  minRooms: number;
  maxRooms: number;
  transportationLabel: string;
  transportationOptions: RSVPOption[];
  transportationOtherPlaceholder: string;
  specialRequirementsLabel: string;
  specialRequirementsPlaceholder: string;
}

export interface RSVPConfirmationConfig {
  badge: string;
  title: string;
  attendingMessage: string;
  declinedMessage: string;
  closingNote: string;
  editButtonText: string;
}

export interface RSVPSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
  deadlineNote?: string;
  footerQuote: string;
  nameLabel: string;
  namePlaceholder: string;
  attendanceQuestion: string;
  attendanceOptions: RSVPOption<AttendanceOptionValue>[];
  guestCountQuestion: string;
  minGuests: number;
  maxGuests: number;
  dietaryQuestion: string;
  dietaryOptions: RSVPOption[];
  dietaryOtherPlaceholder: string;
  accommodation: RSVPAccommodationConfig;
  messageLabel: string;
  messagePlaceholder: string;
  submitButtonText: string;
  submittingButtonText: string;
  confirmation: RSVPConfirmationConfig;
}

export interface RSVPSubmission {
  name: string;
  email?: string;
  attendance: AttendanceOptionValue;
  guestCount?: number;
  dietaryPreference?: string;
  dietaryOther?: string;
  accommodation?: {
    staying: boolean;
    stayGuestName?: string;
    phone?: string;
    peopleStaying?: number;
    arrivalDate?: string;
    departureDate?: string;
    roomsRequired?: number;
    transportation?: string;
    transportationOther?: string;
    specialRequirements?: string;
  };
  message?: string;
  submittedAt: string;
}

export interface ContactConfig {
  whatsapp: string;
  instagram: string;
  email: string;
  phone?: string;
}

export interface WeddingDataConfig {
  couple: CoupleConfig;
  date: WeddingDateConfig;
  location: WeddingLocationConfig;
  teaser: WeddingTeaserConfig;
  invitation: WeddingInvitationConfig;
  storyIntro: StoryIntroConfig;
  storyTimeline: StoryTimelineConfig;
  events: EventsSectionConfig;
  travel: TravelSectionConfig;
  rsvp: RSVPSectionConfig;
  contact?: ContactConfig;
}



