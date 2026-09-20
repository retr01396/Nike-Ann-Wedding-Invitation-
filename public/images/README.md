# Wedding Website Image Replacement Guide

This guide explains how to replace any photograph, illustration, or map on the Nike & Ann wedding website directly from **macOS Finder** (or Windows File Explorer) with **zero code changes**.

---

## Quick Start: How to Swap Any Photo

1. Open this repository in Finder.
2. Navigate to `public/images/` and locate the specific folder for the photo you wish to change.
3. Prepare your new photograph:
   - Ensure the filename **matches the existing filename exactly** (e.g., `milestone-01.jpg`).
   - We recommend standard **JPG** or **WebP** formats. Next.js will automatically optimize, scale, and deliver it in modern responsive formats (AVIF/WebP) to visitors.
4. Replace the old file by dragging and dropping your new file into the folder.
5. Rebuild or refresh your local preview (`npm run build` or `npm run dev`) to see your new photo live.

---

## Directory & Image Inventory

### 1. Hero & Background (`public/images/hero/`)

| Folder | Filename | Where It Appears | Recommended Aspect Ratio | Recommended Resolution | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `hero/hero-background/desktop/` | `hero-background-desktop.jpg` | First viewport background (laptops & desktops) | ~16:10 | 2560 × 1620 px | Deep burgundy dark floral background artwork for desktop displays. |
| `hero/hero-background/mobile/` | `hero-background-mobile.jpg` | First viewport background (phones & portrait tablets) | 9:16 | 1200 × 2133 px | Vertical orientation floral artwork framing the mobile envelope. |
| `hero/hero-background/band/` | `hero-background-band.jpg` | Below-the-fold floral background (Story & Panels) | ~3:7 | 1200 × 2800 px | Page-long pure floral background texture displayed beneath the first viewport. |
| `hero/hero-background/thumbnail/` | `hero-background-tiny.jpg` | Instant LQIP blur background underlay | 16:10 | 48 × 30 px (tiny) | Low-quality image placeholder that renders instantly before high-res assets load. |
| `hero/hero-floral-left/` | `hero-floral-left.jpg` | Left edge of hero viewport (desktop) | ~1:2 | 360 × 750 px | Left floral vignette framing (Dahlia, Baby's Breath). |
| `hero/hero-floral-right/` | `hero-floral-right.jpg` | Right edge of hero viewport (desktop) | ~1:2 | 360 × 750 px | Right floral vignette framing (Plate, Crystal, Baby's Breath). |
| `hero/envelope-wax-seal/` | `wax-seal.jpg` | Wax seal button on envelope flap | 1:1 (Square/Circle) | 300 × 300 px | Burgundy monogram seal with gold rim that triggers the opening animation. |
| `hero/invitation-card/` | `card-floral.jpg` | Invitation card top-right & bottom-left corners | 1:1 (Square) | 400 × 400 px | Crimson floral accent framing the typography on the emerged invitation card. |

---

### 2. "Our Story" Section (`public/images/story/`)

The Story section contains both the vintage polaroid collage on the left and the vertical milestone timeline in the center.

#### A. Editorial Polaroids (`public/images/story/editorial/`)

| Folder | Filename | Where It Appears | Recommended Aspect Ratio | Recommended Resolution | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `story/editorial/polaroid-01/` | `polaroid-01.jpg` | Top Polaroid with "First steps" washi tape | 4:5 (Portrait) | 768 × 960 px | Candid portrait of the couple (shown tilted -3° with shadow). |
| `story/editorial/polaroid-02/` | `polaroid-02.jpg` | Bottom Polaroid with "Forever feels right" tape | 4:5 or 3:2 (Portrait) | 800 × 1000 px | Evening / festive wear portrait overlapping beneath the top polaroid (+4° tilt). |

#### B. Milestone Timeline Nodes (`public/images/story/timeline/`)

These photographs are displayed inside illuminated circular gold-rimmed nodes along the central gold drawing timeline.

| Folder | Filename | Milestone / Chapter | Recommended Aspect Ratio | Recommended Resolution | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `story/timeline/milestone-01/` | `milestone-01.jpg` | October 2025 · *A Little Faith* | 1:1 (Square) | 500 × 500 px | First photo of the couple together (casual meeting). |
| `story/timeline/milestone-02/` | `milestone-02.jpg` | December 2025 · *The First Meet* | 1:1 (Square) | 500 × 500 px | Photo of the couple in traditional/contemporary attire. |
| `story/timeline/milestone-03/` | `milestone-03.jpg` | April 2026 · *Our Engagement* | 1:1 (Square) | 500 × 500 px | Close-up of intertwined hands and engagement rings. |
| `story/timeline/milestone-04/` | `milestone-04.jpg` | November 2026 · *A Lifetime Ahead* | 1:1 (Square) | 500 × 500 px | Elegant couple portrait stepping into the wedding chapter. |

> **Tip for Circular Milestone Photos**: The website automatically crops and frames milestone photos into a circle. Keep the subjects' faces centered in the image for the best appearance.

---

### 3. Events & Ceremonies (`public/images/events/`)

| Folder | Filename | Where It Appears | Format | Description |
| :--- | :--- | :--- | :--- | :--- |
| `events/wedding/` | `wedding.svg` | The Holy Matrimony & Reception dossier | SVG or PNG | Ceremonial golden wedding bow and floral spray icon. |
| `events/church/` | `church.svg` | The Church Nuptials dossier | SVG or PNG | Gothic cathedral arches with amber stained-glass glow icon. |
| `events/groom-house/` | `groom-house.svg` | The Groom's House Gathering dossier | SVG or PNG | Traditional Kerala Tharavadu residence icon with brass lamps. |

---

### 4. Directions & Cartography (`public/images/directions/`)

These images appear inside the "GETTING THERE" smoked liquid glass panel when guests toggle between destinations.

| Folder | Filename | Where It Appears | Recommended Aspect Ratio | Recommended Resolution | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `directions/church/` | `church-map.jpg` | Directions panel under "CHURCH" tab | 16:10 | 800 × 500 px | Dark cartography map preview or venue photo for St. Thomas Church. |
| `directions/event-space/` | `event-space-map.jpg` | Directions panel under "EVENT SPACE" tab | 16:10 | 800 × 500 px | Dark cartography map preview or venue photo for Lulu Convention Center. |
| `directions/groom-house/` | `groom-house-map.jpg` | Directions panel under "GROOM'S HOUSE" tab | 16:10 | 800 × 500 px | Dark cartography map preview or residence photo for Groom's Ancestral House. |

---

## Centralized Code Reference

All filenames and paths are registered centrally in:
```typescript
src/config/wedding.ts -> export const weddingImages
```

If you ever wish to point a slot to a different file format (for example, switching from `.jpg` to `.webp` or `.png`), simply update that single line in `src/config/wedding.ts`. No components need to be modified.
