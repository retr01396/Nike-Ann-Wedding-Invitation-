import type { WeddingDataConfig, WeddingImagesConfig } from "../types/wedding";

export const weddingImages: WeddingImagesConfig = {
  hero: {
    backgroundDesktop: "/images/hero/hero-background/desktop/hero-background-desktop.jpg",
    backgroundMobile: "/images/hero/hero-background/mobile/hero-background-mobile.jpg",
    backgroundBand: "/images/hero/hero-background/band/hero-background-band.jpg",
    backgroundTiny: "/images/hero/hero-background/thumbnail/hero-background-tiny.jpg",
    floralLeft: "/images/hero/hero-floral-left/hero-floral-left.jpg",
    floralRight: "/images/hero/hero-floral-right/hero-floral-right.jpg",
    waxSeal: "/images/hero/envelope-wax-seal/wax-seal.jpg",
    cardFloral: "/images/hero/invitation-card/card-floral.jpg",
  },
  story: {
    editorial: {
      polaroid01: "/images/story/editorial/polaroid-01/polaroid-01.jpg",
      polaroid02: "/images/story/editorial/polaroid-02/polaroid-02.jpg",
    },
    timeline: {
      milestone01: "/images/story/timeline/milestone-01/milestone-01.jpg",
      milestone02: "/images/story/timeline/milestone-02/milestone-02.jpg",
      milestone03: "/images/story/timeline/milestone-03/milestone-03.jpg",
      milestone04: "/images/story/timeline/milestone-04/milestone-04.jpg",
    },
  },
  events: {
    wedding: "/images/events/wedding/wedding.svg",
    church: "/images/events/church/church.svg",
    groomHouse: "/images/events/groom-house/groom-house.svg",
  },
  directions: {
    churchMap: "/images/directions/church/church-map.jpg",
    eventSpaceMap: "/images/directions/event-space/event-space-map.jpg",
    groomHouseMap: "/images/directions/groom-house/groom-house-map.jpg",
  },
};

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
    badge: "OUR STORY",
    headline: ["TWO SOULS,", "A SHARED JOURNEY"],
    subheading: "Perhaps It Was Grace",
    fullStoryTitle: "Perhaps It Was Grace",
    quote: "Some people make your world brighter just by being in it.",
    quoteAuthor: "Nike & Ann",
    portraitImage: weddingImages.story.editorial.polaroid01,
    portraitAlt: "Nike and Ann together",
    portraitCaption: "Kochi, 2024",
    fullStory: [
      "Some stories begin with a chance encounter. Ours began with our families, a little faith, and a matrimonial site.",
      "In October 2025, Chavara (the matrimonial site) brought together a boy from Thrissur and a girl from Kannur. Though we grew up in different parts of Kerala, with our own customs, rhythms, and ways of doing things, we shared the same values. That familiarity made it easy for something meaningful to begin.",
      "What began as a simple introduction soon became a conversation we both looked forward to. We clicked almost instantly, finding comfort in our shared values, similar upbringings, and grounded Malayali Christian roots. And somewhere between her deep faith and my more relaxed approach, we found a balance that felt entirely natural.",
      "When we finally met in December, during those breezy days, the ease we had found in our conversations carried effortlessly into real life. We decided to date, spend more time together, and see where life would take us.",
      "Six months may seem short, but it was long enough to know that we wanted a lifetime. In April, with our families as witnesses, we got engaged — a promise to grow together, live together, and stand by each other through all that life brings.",
      "Looking back, it feels like something more than coincidence. Two people who may never have crossed paths on their own, brought together by the people who knew them best, and perhaps by a little grace from above.",
      "And now, here we are — ready to turn a beautiful beginning into a lifetime of togetherness."
    ],
    polaroids: {
      top: {
        image: weddingImages.story.editorial.polaroid01,
        caption: "First steps",
        alt: "Nike and Ann with the illuminated tree sculpture"
      },
      bottom: {
        image: weddingImages.story.editorial.polaroid02,
        caption: "Forever feels right",
        alt: "Nike and Ann in festive traditional wear surrounded by warm lights"
      }
    }
  },
  storyTimeline: {
    badge: "OUR TIMELINE",
    title: "OUR STORY",
    subtitle: "The chapters that brought our hearts to forever",
    milestones: [
      {
        id: "faith-oct-2025",
        year: "OCT 2025",
        dateTag: "OCTOBER 2025",
        title: "A Little Faith",
        subtitle: "When Chavara Connected Us",
        shortDescription: "Chavara brought together a boy from Thrissur and a girl from Kannur together.",
        description:
          "In October 2025, Chavara (the matrimonial site) brought together a boy from Thrissur and a girl from Kannur. Finding comfort in our shared values, similar upbringings, and grounded Malayali Christian roots, a meaningful conversation began.",
        location: "Thrissur & Kannur · Kerala",
        image: weddingImages.story.timeline.milestone01,
        imageAlt: "Nike and Ann smiling together",
        orientation: "portrait",
      },
      {
        id: "meet-dec-2025",
        year: "DEC 2025",
        dateTag: "DECEMBER 2025",
        title: "The First Meet",
        subtitle: "Conversations Turned Real",
        shortDescription: "Those breezy days turned conversations into something real.",
        description:
          "When we finally met in December, during those breezy days, the ease we had found in our conversations carried effortlessly into real life. We decided to date, spend more time together, and see where life would take us.",
        location: "Kerala",
        image: weddingImages.story.timeline.milestone02,
        imageAlt: "Nike and Ann together in traditional and contemporary attire",
        orientation: "portrait",
      },
      {
        id: "engagement-apr-2026",
        year: "APR 2026",
        dateTag: "APRIL 2026",
        title: "Our Engagement",
        subtitle: "A Promise to Grow Together",
        shortDescription: "With our families as witnesses, we said yes to forever.",
        description:
          "Six months may seem short, but it was long enough to know that we wanted a lifetime. In April, with our families as witnesses, we got engaged — a promise to grow together, live together, and stand by each other through all that life brings.",
        location: "Kerala",
        image: weddingImages.story.timeline.milestone03,
        imageAlt: "Hands intertwined with engagement rings",
        orientation: "portrait",
      },
      {
        id: "wedding-nov-2026",
        year: "NOV 2026",
        dateTag: "NOVEMBER 2026",
        title: "A Lifetime Ahead",
        subtitle: "Perhaps It Was Grace",
        shortDescription: "Two people, one journey, perhaps it was grace.",
        description:
          "Looking back, it feels like something more than coincidence. Two people brought together by the people who knew them best, and perhaps by a little grace from above. And now, here we are — ready for a lifetime of togetherness.",
        location: "Thrissur · Kerala",
        image: weddingImages.story.timeline.milestone04,
        imageAlt: "Nike and Ann walking forward into their lifetime together",
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
    // Day programme displayed inside the Event Details glass panel
    programmeSchedule: [
      { time: "08:30 AM", label: "Guest Arrival" },
      { time: "09:30 AM", label: "Muhurtam" },
      { time: "12:00 PM", label: "Lunch & Blessings" },
      { time: "04:00 PM", label: "Reception" },
    ],
    closingNote: ["WE CAN'T WAIT", "TO CELEBRATE WITH YOU"],
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
        image: weddingImages.events.wedding,
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
        mapUrl: "https://maps.app.goo.gl/ZwUdbuYiaPKYvV3u5?g_st=iw",
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
        image: weddingImages.events.church,
        imageAlt: "Gothic church arches with glowing amber stained glass light",
        dressCode: "Modest Elegant Church Attire",
        parkingNotes:
          "Parish church grounds provide designated guest parking adjacent to the cathedral courtyard.",
        familyNotes:
          "Family members and close witnesses are invited for the pre-ceremony prayer gathering at 08:30 AM.",
        additionalInstructions:
          "Please silence mobile phones inside the sacred sanctuary during the solemn crowning liturgy.",
        mapUrl: "https://maps.app.goo.gl/RfBfQvkBvkVc7Ahb8?g_st=iw",
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
        image: weddingImages.events.groomHouse,
        imageAlt: "Traditional Kerala Tharavadu gabled residence with hanging brass lamps",
        dressCode: "Comfortable Traditional / Ethnic Casual",
        parkingNotes:
          "Valet assistance available at the ancestral residence entry arch.",
        familyNotes:
          "Traditional evening Kerala delicacies and refreshments will be served continuously throughout the gathering.",
        specialNotes:
          "An evening dedicated to laughter, nostalgia, and welcoming traveling family and friends.",
        mapUrl: "https://maps.app.goo.gl/qFGEFSNSgaVG1C6C6?g_st=iw",
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
        mapUrl: "https://maps.app.goo.gl/RfBfQvkBvkVc7Ahb8?g_st=iw",
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
        mapPreviewImage: weddingImages.directions.churchMap,
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
        mapUrl: "https://maps.app.goo.gl/ZwUdbuYiaPKYvV3u5?g_st=iw",
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
        mapPreviewImage: weddingImages.directions.eventSpaceMap,
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
        mapUrl: "https://maps.app.goo.gl/qFGEFSNSgaVG1C6C6?g_st=iw",
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
        mapPreviewImage: weddingImages.directions.groomHouseMap,
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
  images: weddingImages,
  audio: {
    src: "/audio/background-music.mp3",
    title: "Nike & Ann Wedding Music",
    autoplayOnInteraction: true,
    defaultVolume: 0.45,
    loop: true,
  },
};


