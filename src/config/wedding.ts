import type { WeddingDataConfig } from "../types/wedding";

export const weddingConfig: WeddingDataConfig = {
  couple: {
    groom: "NIKE",
    bride: "ANN",
    connector: "and",
    monogram: "N & A",
    monogramShort: "N/A",
  },
  date: {
    dayOfWeek: "SUNDAY",
    day: 15,
    month: "NOVEMBER",
    year: 2026,
    formatted: "SUNDAY, 15 NOVEMBER 2026",
    iso: "2026-11-15T10:00:00+05:30",
  },
  location: {
    city: "THRISSUR",
    state: "KERALA",
    country: "INDIA",
    venueName: "Lulu International Convention Center",
    display: "THRISSUR · KERALA",
  },
  teaser: {
    badge: "PRIVATE INVITATION",
    supertitle: ["A BRIGHTER", "CHAPTER", "TOGETHER"],
    subtitle: "YOU'RE INVITED",
    openButtonText: "TAP TO OPEN",
    scrollHint: "Tap the seal or button to open",
  },
  invitation: {
    headerTag: "A BRIGHTER CHAPTER TOGETHER",
    inviteLine1: "TOGETHER WITH OUR FAMILIES",
    inviteLine2: "WE INVITE YOU TO THE WEDDING OF",
    presenceNote: [
      "YOUR PRESENCE",
      "WILL MAKE OUR DAY",
      "EVEN MORE SPECIAL",
    ],
    ctaButtonText: "ENTER OUR WEDDING →",
  },
  storyIntro: {
    badge: "A BRIGHTER CHAPTER",
    headline: ["TWO SOULS,", "A SHARED JOURNEY"],
    subheading: "From a serendipitous conversation in Kochi to a lifetime promise in Thrissur",
    quote: "In every crowd and through every season, finding each other was our life's quietest miracle.",
    quoteAuthor: "Nike & Ann",
    portraitImage: "/images/story/portrait.svg",
    portraitAlt: "Nike and Ann in an embrace",
    portraitCaption: "Kochi, 2024",
  },
  storyTimeline: {
    badge: "OUR TIMELINE",
    title: "OUR STORY",
    subtitle: "The chapters that brought our hearts to forever",
    milestones: [
      {
        id: "first-hello",
        year: "2020",
        dateTag: "OCTOBER 2020",
        title: "The First Hello",
        subtitle: "A Serendipitous Connection",
        description:
          "What began as an unexpected conversation quickly turned into hours of shared laughter, quiet understanding, and the surreal feeling that we had known each other across lifetimes.",
        location: "Kochi · Kerala",
        image: "/images/story/milestone-1.svg",
        imageAlt: "The beginning of our conversation in Kochi",
        orientation: "portrait",
      },
      {
        id: "misty-hills",
        year: "2022",
        dateTag: "DECEMBER 2022",
        title: "Misty Hills & Roadtrips",
        subtitle: "Finding Home in Each Other",
        description:
          "Wandering together through the emerald tea gardens of Munnar wrapped in mountain mist, we learned that home was never a place or an address—it was simply wherever we stood together.",
        location: "Munnar · Kerala",
        image: "/images/story/milestone-2.svg",
        imageAlt: "Scenic misty tea hills of Munnar",
        orientation: "landscape",
      },
      {
        id: "the-promise",
        year: "2024",
        dateTag: "FEBRUARY 2024",
        title: "The Golden Promise",
        subtitle: "A Sunset by the Sea",
        description:
          "Against the red cliffs of Varkala as the Arabian Sea mirrored an amber sky, with tears and trembling certainty, we promised each other all of our tomorrows.",
        location: "Varkala Cliff · Kerala",
        image: "/images/story/milestone-3.svg",
        imageAlt: "Sunset promise by the Arabian Sea",
        orientation: "portrait",
      },
      {
        id: "the-wedding",
        year: "2026",
        dateTag: "NOVEMBER 2026",
        title: "The Beginning of Always",
        subtitle: "Two Families, One Heart",
        description:
          "Surrounded by the warmth of our families, blessed by our ancestors, and stepping hand in hand into the sacred celebration of our marriage.",
        location: "Thrissur · Kerala",
        image: "/images/story/milestone-4.svg",
        imageAlt: "Nike and Ann wedding celebration",
        orientation: "portrait",
      },
    ],
    closingQuote: {
      line1: "And so our greatest adventure begins...",
      line2: "Sunday, 15 November 2026 · Thrissur, Kerala",
    },
  },
  events: {
    badge: "THE CELEBRATION",
    title: "EVENT DETAILS",
    subtitle: "Join us in our sacred traditions and joyous moments",
    events: [
      {
        id: "wedding",
        type: "wedding",
        badge: "THE SACRED CEREMONY",
        title: "The Holy Matrimony",
        subtitle: "Exchange of Vows & Nuptial Blessing",
        date: "Sunday, 15 November 2026",
        time: "10:30 AM IST",
        venue: "Lulu International Convention Center",
        address: "NH 544, Puzhakkal, Thrissur, Kerala 680553",
        description:
          "With the blessings of our parents and surrounded by the warmth of family and friends, we will unite as one under God's grace.",
        image: "/images/events/wedding-bow.svg",
        imageAlt: "Ceremonial golden wedding bow and floral spray",
        dressCode: "Traditional Kerala Kasavu / Elegant Festive Formal",
        receptionVenue: "Grand Ballroom, Lulu Convention Center (12:30 PM IST onwards)",
        parkingNotes:
          "Complimentary valet and ample surface parking available within the convention grounds.",
        familyNotes:
          "A traditional grand Kerala Sadhya luncheon feast will immediately follow the ceremony.",
        additionalInstructions:
          "Guests are kindly requested to take their seats by 10:15 AM before the bridal procession begins.",
        contactInfo: "+91 98765 43210 (Event Concierge)",
        specialNotes:
          "Auspicious ceremony will take place between 10:30 AM and 11:30 AM.",
        mapUrl:
          "https://maps.google.com/?q=Lulu+International+Convention+Center+Thrissur+Kerala",
      },
      {
        id: "church",
        type: "church",
        badge: "THE BLESSING",
        title: "The Church Nuptials",
        subtitle: "Solemnization & Nuptial Crowning",
        date: "Sunday, 15 November 2026",
        time: "09:00 AM IST",
        venue: "St. Thomas Syro-Malabar Catholic Church",
        address: "Palayoor, Chavakkad, Thrissur District, Kerala 680506",
        description:
          "The solemn crowning liturgy and prayer service celebrated according to the time-honored traditional Syrian Christian rite.",
        image: "/images/events/church-arch.svg",
        imageAlt: "Gothic church arches with glowing amber stained glass light",
        dressCode: "Modest Elegant Church Attire",
        parkingNotes:
          "Parish church grounds provide designated guest parking adjacent to the cathedral courtyard.",
        familyNotes:
          "Family members and close witnesses are invited for the pre-ceremony prayer gathering at 08:30 AM.",
        additionalInstructions:
          "Please silence mobile phones inside the sacred sanctuary during the solemn crowning liturgy.",
        mapUrl:
          "https://maps.google.com/?q=St+Thomas+Church+Palayoor+Chavakkad+Thrissur",
      },
      {
        id: "grooms-house",
        type: "grooms-house",
        badge: "TRADITIONAL CELEBRATION",
        title: "The Groom's House Gathering",
        subtitle: "Auspicious Welcome & Family Eve",
        date: "Saturday, 14 November 2026",
        time: "06:00 PM IST",
        venue: "Tharavadu Ancestral Residence",
        address: "Thrissur Town, Kerala (Detailed private access provided upon arrival)",
        description:
          "An intimate festive evening of traditional Kerala songs, authentic feast, and blessings to celebrate the groom on the eve of the wedding.",
        image: "/images/events/grooms-house.svg",
        imageAlt: "Traditional Kerala Tharavadu gabled residence with hanging brass lamps",
        dressCode: "Comfortable Traditional / Ethnic Casual",
        parkingNotes:
          "Valet assistance available at the ancestral residence entry arch.",
        familyNotes:
          "Traditional evening Kerala delicacies and refreshments will be served continuously throughout the gathering.",
        specialNotes:
          "An evening dedicated to laughter, nostalgia, and welcoming traveling family and friends.",
        mapUrl: "https://maps.google.com/?q=Thrissur+Kerala",
      },
    ],
  },
  travel: {
    badge: "DIRECTIONS",
    title: "GETTING THERE",
    subtitle: "Essential directions, map links, and arrival notes for our celebration destinations",
    destinations: [
      {
        id: "church",
        type: "church",
        category: "CHURCH",
        title: "St. Thomas Syro-Malabar Catholic Church",
        subtitle: "The Sacred Marriage Ceremony & Vows",
        address: "Palayoor, Chavakkad, Thrissur District, Kerala 680506 [Tentative Placeholder]",
        cityLabel: "PALAYOOR, THRISSUR",
        isConfirmed: false,
        placeholderNotice:
          "Tentative church placeholder — final confirmed parish location and liturgy arrival times will be updated soon.",
        mapUrl: "https://maps.google.com/?q=St+Thomas+Church+Palayoor+Chavakkad+Thrissur",
        directionsButtonText: "GET DIRECTIONS →",
        description:
          "One of the seven historic churches traditionally attributed to the apostolic mission of St. Thomas in Kerala, renowned for its serene heritage.",
        landmark: "Palayoor Mahatheerthakendram Sanctuary",
        distance: "Approx. 25 km west of Thrissur City",
        estimatedTravelTime: "40–50 minutes by car / taxi",
        parkingInfo:
          "Designated parish guest parking adjacent to the cathedral courtyard.",
        taxiNotes:
          "Auto-rickshaws and local taxis operate from Chavakkad junction and Guruvayur Railway Station.",
        publicTransportNotes:
          "Direct buses depart regularly from Thrissur Shakthan Stand towards Chavakkad / Guruvayur.",
        travelNotes:
          "Please observe reverent silence within the church gates. Modest church attire requested.",
        mapPreviewImage: "/images/travel/map-church.svg",
      },
      {
        id: "event-space",
        type: "venue",
        category: "EVENT SPACE",
        title: "Lulu International Convention Center",
        subtitle: "The Evening Celebration & Reception",
        address: "NH 544, Puzhakkal, Thrissur, Kerala 680553 [Tentative Placeholder]",
        cityLabel: "THRISSUR, KERALA",
        isConfirmed: false,
        placeholderNotice:
          "Tentative venue placeholder — final confirmed location, parking zones, and exact navigational link will be updated upon venue confirmation.",
        mapUrl: "https://maps.google.com/?q=Lulu+International+Convention+Center+Thrissur+Kerala",
        directionsButtonText: "GET DIRECTIONS →",
        description:
          "Modern luxury convention facility featuring grand banquet halls, dedicated bridal amenities, and expansive parking.",
        landmark: "Near Sobha City Mall, NH 544 Expressway",
        distance: "Approx. 5.5 km from Thrissur Swaraj Round",
        estimatedTravelTime: "15–20 minutes by car",
        parkingInfo:
          "Complimentary multi-level guest parking and on-site valet staging area.",
        taxiNotes:
          "Pre-paid taxis and auto-rickshaws operate from Thrissur Railway Station directly to Puzhakkal.",
        publicTransportNotes:
          "Regular KSRTC and private suburban buses run along the Thrissur–Kunnamkulam corridor.",
        travelNotes:
          "Expressway traffic can build during morning peak hours. Please allow 15 minutes buffer time.",
        mapPreviewImage: "/images/travel/map-venue.svg",
      },
      {
        id: "grooms-house",
        type: "residence",
        category: "GROOM'S HOUSE",
        title: "Tharavadu Ancestral Residence",
        subtitle: "The Traditional Gathering & Family Residence",
        address: "Thrissur Town, Kerala [Private Residence — Coordinates to be Provided]",
        cityLabel: "THRISSUR, KERALA",
        isConfirmed: false,
        placeholderNotice:
          "Private family residence — exact navigational pin, gate access, and family contact details will be provided directly to invited guests.",
        mapUrl: "https://maps.google.com/?q=Thrissur+Kerala",
        directionsButtonText: "GET DIRECTIONS →",
        description:
          "Traditional Kerala heritage homestead opening its courtyard to receive dear family and friends for the eve festivities.",
        landmark: "Central Thrissur residential heritage area",
        distance: "Within Thrissur town center",
        estimatedTravelTime: "10–15 minutes from Swaraj Round",
        parkingInfo:
          "Curbside valet attendants will receive vehicles at the ancestral driveway arch.",
        taxiNotes:
          "Local town auto-rickshaws are familiar with the neighborhood landmark.",
        travelNotes:
          "Out-of-town guests may contact the family concierge for personalized pickup coordination.",
        mapPreviewImage: "/images/travel/map-residence.svg",
      },
    ],
  },
  rsvp: {
    badge: "KINDLY",
    title: "RSVP",
    subtitle: "Your presence would mean the world to us.",
    deadlineNote: "Kindly respond on or before 15 October 2026",
    footerQuote: "Your response means the world to us.",
    nameLabel: "YOUR NAME",
    namePlaceholder: "Full Name",
    attendanceQuestion: "WILL YOU BE JOINING US?",
    attendanceOptions: [
      {
        value: "yes",
        label: "YES, I'LL BE THERE",
        description: "Joyfully accepting with pleasure",
      },
      {
        value: "no",
        label: "NO, I'M SORRY I CAN'T",
        description: "Regretfully declining from afar",
      },
    ],
    guestCountQuestion: "HOW MANY GUESTS WILL BE ATTENDING?",
    minGuests: 1,
    maxGuests: 10,
    dietaryQuestion: "DIETARY PREFERENCES",
    dietaryOptions: [
      { value: "no-preference", label: "No preference" },
      { value: "kerala-sadhya", label: "Traditional Kerala Sadhya (Vegetarian)" },
      { value: "non-vegetarian", label: "Non-vegetarian" },
      { value: "vegan-jain", label: "Vegan / Jain" },
      { value: "other", label: "Other" },
    ],
    dietaryOtherPlaceholder: "Please specify allergies, dietary restrictions, or notes...",
    accommodation: {
      question: "WILL YOU BE STAYING WITH US?",
      phoneLabel: "PHONE NUMBER",
      phonePlaceholder: "+91 / Country Code & Mobile Number",
      peopleStayingLabel: "NUMBER OF PEOPLE STAYING",
      minPeople: 1,
      maxPeople: 10,
      arrivalDateLabel: "ARRIVAL DATE",
      departureDateLabel: "DEPARTURE DATE",
      roomsRequiredLabel: "ROOMS REQUIRED",
      minRooms: 1,
      maxRooms: 5,
      transportationLabel: "TRANSPORTATION REQUIREMENTS",
      transportationOptions: [
        { value: "none", label: "No transportation required" },
        {
          value: "airport-cochin",
          label: "Airport pickup (Cochin International Airport · COK)",
        },
        {
          value: "railway-thrissur",
          label: "Railway station pickup (Thrissur Station · TCR)",
        },
        {
          value: "local-shuttle",
          label: "Local venue shuttle & transit assistance",
        },
        { value: "other", label: "Other transportation assistance" },
      ],
      transportationOtherPlaceholder:
        "Please specify flight/train number, timing, or details...",
      specialRequirementsLabel: "SPECIAL REQUIREMENTS",
      specialRequirementsPlaceholder:
        "Please let us know if there is anything else we can arrange for your stay (e.g. accessibility, elder care, child amenities)...",
    },
    messageLabel: "LEAVE A NOTE FOR THE COUPLE",
    messagePlaceholder: "Share your blessings, prayers, or memories with Nike & Ann...",
    submitButtonText: "SEND RSVP →",
    submittingButtonText: "RECORDING YOUR RESPONSE...",
    confirmation: {
      badge: "RESPONSE RECEIVED",
      title: "THANK YOU",
      attendingMessage:
        "We are overjoyed to celebrate our sacred day with you and look forward to welcoming you to Thrissur.",
      declinedMessage:
        "You will be dearly missed, but your blessings and warm prayers will be held close in our hearts.",
      closingNote: "With love & gratitude,\nNike & Ann",
      editButtonText: "Edit Your Response",
    },
  },
  contact: {
    whatsapp: "https://wa.me/919876543210?text=Warmest%20wishes%20Nike%20%26%20Ann!",
    instagram: "https://instagram.com",
    email: "mailto:celebration@nikeannwedding.com",
    phone: "+91 98765 43210",
  },
};


