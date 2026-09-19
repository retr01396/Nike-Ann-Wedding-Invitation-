/**
 * build-hero-background.mjs  (v4 — near-black burgundy cinematic grade)
 *
 * Rebuilds ALL background assets from scripts/reference-hero.png:
 *   1. Crops the baked-in nav strip
 *   2. TRUE-INPAINTS the envelope zone with real texture from both sides
 *      (no letter / rectangle can ever exist in the asset)
 *   3. Feather-patches the tiny baked-in UI chips
 *   4. Grades everything NEAR-BLACK BURGUNDY: shadows crushed toward
 *      #080204/#0D0306, saturation moderated so blooms read as deep wine
 *      emerging from darkness — never bright red
 *   5. Emits HIGH-RESOLUTION variants:
 *        floral-hero-desktop  2560×1620  (landscape screens)
 *        floral-hero-mobile   1200×2133  (9:16 portrait phones)
 *        floral-band          1200×2800  (pure blooms, both side columns)
 *        floral-hero-tiny     48px LQIP
 *
 * Run: node scripts/build-hero-background.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const SRC = "scripts/reference-hero.png";
const OUT_DIR = "public/images/wedding/hero";
const NAV_H = 52;

// ── Envelope zone in ORIGINAL coords (incl. wireframe triangle) ──
const ENV = { x: 470, y: 150, w: 595, h: 630 };
// Small baked-in UI chips (original coords) — tiny, feather-blur is fine
const PATCHES = [
  { id: "text-left", x: 190, y: 665, w: 115, h: 70 },
  { id: "bar-left", x: 234, y: 757, w: 10, h: 29 },
  { id: "text-right", x: 1280, y: 320, w: 125, h: 162 },
  { id: "bar-right", x: 1337, y: 482, w: 10, h: 24 },
  { id: "scroll-cue", x: 690, y: 838, w: 156, h: 74 },
  { id: "replay", x: 14, y: 66, w: 104, h: 34 },
];

/** Feathered rounded-rect mask (blurred SVG alpha) */
async function featherMask(w, h, feather = 24) {
  const svg = Buffer.from(
    `<svg width="${w}" height="${h}">
       <defs><filter id="f" x="-30%" y="-30%" width="160%" height="160%">
         <feGaussianBlur stdDeviation="${feather}"/></filter></defs>
       <rect x="${feather}" y="${feather}" width="${w - feather * 2}" height="${
      h - feather * 2
    }" rx="30" ry="30" fill="#fff" filter="url(#f)"/>
     </svg>`
  );
  return sharp(svg).ensureAlpha().extractChannel("alpha").toBuffer();
}

/**
 * TRUE INPAINT: fill `rect` with mirrored texture pulled in from the left
 * and right of the region, cross-blended — never uses the region's own
 * pixels, so the envelope silhouette cannot survive.
 */
async function inpaintFromSides(baseBuf, rect, meta) {
  const { x, y, w, h } = rect;

  // Left source: the strip immediately left of the rect (as wide as exists)
  const leftAvail = x;
  const L = await sharp(baseBuf)
    .extract({ left: 0, top: y, width: leftAvail, height: h })
    .resize(w, h, { fit: "fill", kernel: "lanczos3" })
    .flop()
    .blur(2)
    .toBuffer();

  // Right source: the strip immediately right of the rect
  const rightStart = x + w;
  const rightAvail = meta.width - rightStart;
  const R = await sharp(baseBuf)
    .extract({ left: rightStart, top: y, width: rightAvail, height: h })
    .resize(w, h, { fit: "fill", kernel: "lanczos3" })
    .flop()
    .blur(2)
    .toBuffer();

  // Cross-blend: R over L with a soft horizontal alpha ramp
  const ramp = Buffer.from(
    `<svg width="${w}" height="${h}">
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0.42" stop-color="#000" stop-opacity="0"/>
         <stop offset="0.58" stop-color="#fff" stop-opacity="1"/>
       </linearGradient></defs>
       <rect width="${w}" height="${h}" fill="url(#g)"/>
     </svg>`
  );
  const RMasked = await sharp(R)
    .composite([{ input: await sharp(ramp).ensureAlpha().extractChannel("alpha").toBuffer(), blend: "dest-in" }])
    .png()
    .toBuffer();
  const filler = await sharp(L).composite([{ input: RMasked, blend: "over" }]).png().toBuffer();

  // Feathered composite of the filler into the base
  const mask = await featherMask(w, h, 26);
  const fillerMasked = await sharp(filler)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(baseBuf).composite([{ input: fillerMasked, left: x, top: y }]).png().toBuffer();
}

/** Small feather self-blur patch (for tiny UI chips on plain silk) */
async function featherPatch(baseBuf, rect, meta) {
  const pad = 18;
  const px = Math.max(0, rect.x - pad);
  const py = Math.max(0, rect.y - pad);
  const pw = Math.min(meta.width - px, rect.w + pad * 2);
  const ph = Math.min(meta.height - py, rect.h + pad * 2);

  const region = await sharp(baseBuf)
    .extract({ left: px, top: py, width: pw, height: ph })
    .toBuffer();
  const blurred = await sharp(region)
    .resize(Math.max(8, Math.round(pw / 10)), Math.max(8, Math.round(ph / 10)), { fit: "fill" })
    .resize(pw, ph, { fit: "fill" })
    .blur(6)
    .toBuffer();
  const mask = await featherMask(pw, ph, 14);
  const masked = await sharp(blurred)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  return { input: masked, left: px, top: py };
}

/** Fine gaussian grain to keep upscaled canvases crisp & filmic */
async function grainLayer() {
  return sharp({
    create: { width: 512, height: 512, channels: 3, noise: { type: "gaussian", mean: 128, sigma: 16 } },
  })
    .png()
    .toBuffer();
}

/**
 * NEAR-BLACK BURGUNDY GRADE — the requested mood:
 *  • shadows crushed toward #080204 / #0D0306 (gain < 1, negative bias)
 *  • saturation moderated — deep wine petals, muted crimson, no bright red
 *  • highlights compressed so only the palest blooms/cream flowers catch light
 *  • whisper of grain for a filmic finish
 */
async function gradeBurgundy(buf) {
  const grain = await grainLayer();
  return sharp(buf)
    .modulate({ saturation: 1.08, brightness: 0.62 })
    .linear([0.74, 0.72, 0.72], [-3, -1, -2])
    .gamma(1.18)
    .composite([{ input: grain, blend: "soft-light", tile: true }])
    .sharpen({ sigma: 0.9, m1: 0.4, m2: 1.8 })
    .png()
    .toBuffer();
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const meta = await sharp(SRC).metadata();

  // 1. Crop nav
  let base = await sharp(SRC)
    .extract({ left: 0, top: NAV_H, width: meta.width, height: meta.height - NAV_H })
    .png()
    .toBuffer();
  let m = await sharp(base).metadata(); // 1536×972

  // 2. INPAINT the envelope zone (cropped coords: y-NAV_H)
  base = await inpaintFromSides(base, { x: ENV.x, y: ENV.y - NAV_H, w: ENV.w, h: ENV.h }, m);
  m = await sharp(base).metadata();

  // 3. Patch the small UI chips
  const chips = [];
  for (const p of PATCHES) {
    chips.push(await featherPatch(base, { x: p.x, y: p.y - NAV_H, w: p.w, h: p.h }, m));
  }
  base = await sharp(base).composite(chips).png().toBuffer();

  // 4. DESKTOP HERO 2560×1620 — high-res, burgundy-graded
  const desktop = await gradeBurgundy(
    await sharp(base).resize(2560, 1620, { fit: "fill", kernel: "lanczos3" }).png().toBuffer()
  );

  // 5. MOBILE HERO 1200×2133 — bloom-dense left slice at high res
  const mobile = await gradeBurgundy(
    await sharp(base)
      .extract({ left: 30, top: 0, width: 545, height: m.height })
      .resize(1200, 2133, { fit: "fill", kernel: "lanczos3" })
      .png()
      .toBuffer()
  );

  // 6. FLORAL BAND 1200×2800 — pure blooms from BOTH envelope-free side
  //    columns (left x0–460, right x1076–1536), cross-faded and mirror-
  //    stitched. Zero envelope pixels by construction; far richer & sharper
  //    than the old single-column band.
  const bandH = 1400;
  const colL = await sharp(base).extract({ left: 0, top: 0, width: 460, height: m.height }).toBuffer();
  const colR = await sharp(base).extract({ left: 1076, top: 0, width: 460, height: m.height }).toBuffer();
  const L = await sharp(colL).resize(1200, bandH, { fit: "fill", kernel: "lanczos3" }).toBuffer();
  const R = await sharp(colR).flop().resize(1200, bandH, { fit: "fill", kernel: "lanczos3" }).toBuffer();
  const ramp = Buffer.from(
    `<svg width="1200" height="${bandH}">
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0.38" stop-color="#000" stop-opacity="0"/>
         <stop offset="0.62" stop-color="#fff" stop-opacity="1"/>
       </linearGradient></defs>
       <rect width="1200" height="${bandH}" fill="url(#g)"/>
     </svg>`
  );
  const RMasked = await sharp(R)
    .composite([{ input: await sharp(ramp).ensureAlpha().extractChannel("alpha").toBuffer(), blend: "dest-in" }])
    .png()
    .toBuffer();
  const bandTop = await sharp(L).composite([{ input: RMasked, blend: "over" }]).png().toBuffer();
  const bandBottom = await sharp(bandTop).flip().toBuffer();
  const band = await gradeBurgundy(
    await sharp({ create: { width: 1200, height: bandH * 2, channels: 3, background: "#0d0306" } })
      .composite([
        { input: bandTop, left: 0, top: 0 },
        { input: bandBottom, left: 0, top: bandH },
      ])
      .png()
      .toBuffer()
  );

  // 7. Emit everything
  for (const [buf, name] of [
    [desktop, "floral-hero-desktop"],
    [mobile, "floral-hero-mobile"],
  ]) {
    const p = path.join(OUT_DIR, name);
    await sharp(buf).avif({ quality: 50, effort: 6 }).toFile(`${p}.avif`);
    await sharp(buf).webp({ quality: 72 }).toFile(`${p}.webp`);
    await sharp(buf).jpeg({ quality: 78, mozjpeg: true }).toFile(`${p}.jpg`);
    const im = await sharp(buf).metadata();
    console.log(`✓ ${name} ${im.width}×${im.height} (.avif/.webp/.jpg)`);
  }
  for (const [buf, name] of [[band, "floral-band"]]) {
    const p = path.join(OUT_DIR, name);
    await sharp(buf).webp({ quality: 72 }).toFile(`${p}.webp`);
    await sharp(buf).jpeg({ quality: 76, mozjpeg: true }).toFile(`${p}.jpg`);
    const im = await sharp(buf).metadata();
    console.log(`✓ ${name} ${im.width}×${im.height} (.webp/.jpg)`);
  }
  await sharp(desktop)
    .resize(48, null, { fit: "inside" })
    .jpeg({ quality: 40 })
    .toFile(path.join(OUT_DIR, "floral-hero-tiny.jpg"));
  console.log("✓ floral-hero-tiny.jpg (LQIP)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
