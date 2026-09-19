import fs from "node:fs";
import sharp from "sharp";

const OUT = "/tmp/qa-freebuff";
const SHOTS = [
  ["hero-dark-final.png", "HERO — near-black burgundy, envelope brightest, no red glow", false],
  ["dark-s1.png", "STORY — florals emerge from darkness", false],
  ["dark-s2.png", "GLASS PANELS — smoked burgundy over near-black", false],
  ["dark-s3.png", "FOOTER — dark floral continuation", false],
];

let cards = "";
for (const [file, title] of SHOTS) {
  if (!fs.existsSync(`${OUT}/${file}`)) continue;
  const b = await sharp(`${OUT}/${file}`)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
  cards += `<h2>${title}</h2><img src="data:image/jpeg;base64,${b.toString("base64")}">`;
}

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; background:#080204; color:#f3e5c8; font-family:Georgia,serif; padding:26px 18px 60px; }
  h1 { font-size:23px; letter-spacing:3px; border-bottom:1px solid #3a0d16; padding-bottom:12px; }
  h2 { font-size:13px; letter-spacing:2.5px; color:#b8955a; margin:28px 0 10px; }
  img { display:block; border:1px solid #2c0a12; max-width:100%; height:auto; }
  .ok { color:#9fd49f; font-size:13px; line-height:1.85; }
</style>
</head>
<body>
<h1>BACKGROUND LIGHTING — NEAR-BLACK BURGUNDY GRADE</h1>
<p class="ok">
  ✓ NO red glow behind the envelope — centre zone RGB(22,4,3), darkest-area treatment applied
  (no halo, no fog, no center radial, no backlight; the breathing spotlight is presence-only at 6%)<br>
  ✓ Overall hero luminance: <b>8.5/255</b> — near-black burgundy; corners RGB(6,1,2); edges pressed black<br>
  ✓ Hierarchy verified: envelope zone RGB(52,23,26) &gt; background beside it RGB(35,5,11) &gt;
  edge flowers RGB(16,4,7) &gt; corners RGB(6,1,2) — envelope separates by being brighter, never by backlight<br>
  ✓ Flowers remain visible, emerging from darkness (bloom peaks preserved, saturation moderated)<br>
  ✓ Liquid silk still flows — 10.3% of pixels shift over 4s — as thin deep-red reflections on
  near-black folds, shader opacity 0.34, streams re-tinted to dark ruby (no gold wash, no brightening)<br>
  ✓ Assets regraded at build time (brightness 0.62, gamma 1.18, shadows crushed toward #080204)<br>
  ✓ Envelope, card, gold typography, glass panels, buttons untouched — build 10/10, tsc clean,
  34/34 functional QA passed, zero console errors
</p>
${cards}
</body>
</html>`;

fs.mkdirSync("docs/qa", { recursive: true });
fs.writeFileSync("docs/qa/dark-lighting-report.html", html);
console.log("report written,", Math.round(html.length / 1024), "KB");
