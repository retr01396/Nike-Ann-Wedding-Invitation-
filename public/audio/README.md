# Wedding Background Music Asset Guide

This folder holds the background music audio for the Nike & Ann wedding website.

---

## Current Track

- **File**: `background-music.mp3`
- **Location**: `public/audio/background-music.mp3`
- **Configuration**: Managed in `src/config/wedding.ts` (`weddingConfig.audio`)

---

## How to Replace the Music File from Finder

You can replace this audio track at any time without touching any code:

1. Open Finder on your Mac.
2. Navigate to this folder:
   `Nike-Ann Wedding/public/audio/`
3. Prepare your new audio track:
   - Format: **MP3** (recommended), **M4A / AAC**, or **OGG**
   - Bitrate: **128 kbps – 192 kbps** (ideal balance of acoustic fidelity and fast initial web streaming)
   - Sample Rate: **44.1 kHz** or **48 kHz** stereo
   - Target Size: **2 MB – 6 MB** for fast mobile loading
4. Rename your new audio file to:
   `background-music.mp3`
5. Replace/overwrite the existing `background-music.mp3` in this folder.
6. Refresh your browser (or rebuild the site) — the new track will automatically play!

---

## Configuration Settings

If you want to customize audio behavior (e.g., default volume or song title), you can edit `src/config/wedding.ts`:

```typescript
audio: {
  src: "/audio/background-music.mp3",
  title: "Nike & Ann Wedding Music",
  autoplayOnInteraction: true, // starts softly on guest's first click or tap
  defaultVolume: 0.45,         // comfortable background level (0.0 to 1.0)
  loop: true,                  // seamlessly loops track for continuous ambience
}
```

---

## Autoplay & Interaction Behavior

Modern browsers (Chrome, Safari, iOS Safari, Firefox) restrict playing unmuted audio automatically before the user has interacted with the document.

The website complies with modern browser audio policies:
1. **First Touch Autoplay**: As soon as the guest clicks or taps anywhere (e.g. dismissing the monogram intro or opening the wax seal), the audio begins with a gentle 1.2-second volume fade-in from 0 to 45%.
2. **Floating Controls**: A discreet smoked-burgundy and gold pill button in the bottom-right corner displays real-time equalizer bars and lets guests pause or resume audio at will.
3. **Tab Switch Pause**: If the guest switches browser tabs or minimizes the window, playback pauses automatically to save battery and resumes when they return.
