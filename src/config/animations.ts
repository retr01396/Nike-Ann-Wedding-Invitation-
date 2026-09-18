export const animationConfig = {
  timings: {
    // Intro Monogram
    introDelay: 0.2,
    introFadeIn: 0.9,
    introHold: 1.0,
    introFadeOut: 0.7,

    // Envelope Opening Sequence (Optimized for cinematic pacing ~3.2s total)
    sealReaction: 0.3,
    sealRelease: 0.35,
    flapOpen: 0.75,
    cardEmergence: 0.95,
    cardSettling: 0.6,
    textIllumination: 0.8,
    staggerTypography: 0.12,

    // Living background subtle cycles
    floralSwayDuration: 7.5,
    embersFloatDuration: 12.0,
    velvetBreatheDuration: 8.0,
  },
  easings: {
    luxury: "power3.inOut",
    smoothOut: "power2.out",
    cinematic: "power4.inOut",
    flapUnfold: "power2.inOut",
    cardExtract: "power3.out",
    cardSettle: "power2.out",
    goldShimmer: "sine.inOut",
  },
  perspective: {
    envelope3D: 1200,
    card3D: 1000,
  },
};
