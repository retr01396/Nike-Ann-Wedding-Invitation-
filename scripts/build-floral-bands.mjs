/**
 * build-floral-bands.mjs
 *
 * Emits 100% floral band textures for the below-the-fold background bands.
 * Cropped STRICTLY from the reference's bloom-dense LEFT column
 * (x 0–478 — the envelope occupies x 478–1058, so zero envelope pixels are
 * included by construction), with the small UI chips patched out.
 *
 * Result: floral-band.webp / .jpg — a tall pure-flower field for the
 * story / panels / footer bands. No letter, no envelope, only blooms.
 *
 * Run: node scripts/build-floral-bands.mjs
 */
import sharp from "sharp";
import path from "node:path";

const SRC = "scripts/reference-hero.png";
const OUT = "public/images/wedding/hero/floral-band";

const NAV_H = 52;

// Small baked-in UI in the left column to blend away (original coords)
const PATCHES = [
  { id: "replay", x: 14, y: 66, w: 104, h: 34 },
  { id: "text-left", x: 190, y: 665, w: 115, h: 70 },
  { id: "bar-left", x: 234, y: 757, w: 10, h: 29 },
];

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
    .resize(Math.max(8, Math.round(pw / 10)), Math.max(8, Math.round(ph / 10)), {
      fit: "fill",
    })
    .resize(pw, ph, { fit: "fill" })
    .blur(6)
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="${pw}" height="${ph}">
       <rect width="${pw}" height="${ph}" rx="14" ry="14" fill="#fff"/>
     </svg>`
  );
  const masked = await sharp(blurred)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return { input: masked, left: px, top: py };
}

async function main() {
  const meta = await sharp(SRC).metadata();
  const baseBuf = await sharp(SRC).toBuffer();

  // ── Bloom-dense left column only: x 0–478 (envelope starts at 478) ──
  const colW = 478;
  const colH = meta.height - NAV_H; // 972

  const raw = await sharp(baseBuf)
    .extract({ left: 0, top: NAV_H, width: colW, height: colH })
    .png()
    .toBuffer();

  // Patch UI chips (coords shifted by nav crop)
  const patches = [];
  for (const p of PATCHES) {
    patches.push(
      await featherPatch(
        raw,
        { x: p.x, y: p.y - NAV_H, w: p.w, h: p.h },
        { width: colW, height: colH }
      )
    );
  }
  const clean = await sharp(raw).composite(patches).png().toBuffer();

  // ── Tall band texture 1000×2200 (mirrored stitch for invisible seam) ──
  // Upper half: the column as-is. Lower half: the column flipped — the
  // mirror guarantees a seamless join and doubles the visible blooms.
  const halfW = 1000;
  const halfH = 1100;
  const upper = await sharp(clean)
    .resize(halfW, halfH, { fit: "fill", kernel: "lanczos3" })
    .toBuffer();
  const lower = await sharp(upper).flip().toBuffer();
  const band = await sharp({
    create: { width: halfW, height: halfH * 2, channels: 3, background: "#120205" },
  })
    .composite([
      { input: upper, left: 0, top: 0 },
      { input: lower, left: 0, top: halfH },
    ])
    .png()
    .toBuffer();

  await sharp(band).webp({ quality: 70 }).toFile(`${OUT}.webp`);
  await sharp(band).jpeg({ quality: 76, mozjpeg: true }).toFile(`${OUT}.jpg`);
  console.log(`✓ floral-band.webp/.jpg (${halfW}x${halfH * 2}) — 100% blooms, no envelope`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
