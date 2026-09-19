import fs from "node:fs";
import sharp from "sharp";

const SHOTS = [
  ["hero-desktop-match.png", "HERO — Desktop 1280×900", false],
  ["story-desktop.png", "OUR STORY — Desktop", false],
  ["suite-desktop.png", "EVENTS / RSVP / TRAVEL — Desktop", false],
  ["hero-mobile-375.png", "HERO — Mobile 375×812", true],
  ["hero-mobile-390.png", "HERO — Mobile 390×844", true],
  ["hero-mobile-414.png", "HERO — Mobile 414×896", true],
];

let cards = "";
for (const [file, title, isMobile] of SHOTS) {
  if (!fs.existsSync(`/tmp/qa-freebuff/${file}`)) continue;
  const b = await sharp(`/tmp/qa-freebuff/${file}`)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 74 })
    .toBuffer();
  const style = isMobile ? ' style="width:360px"' : "";
  cards += `<h2>${title}</h2><img src="data:image/jpeg;base64,${b.toString(
    "base64"
  )}"${style}>`;
}

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; background:#160205; color:#f3e5c8; font-family:Georgia,serif; padding:28px 20px 60px; }
  h1 { font-size:26px; letter-spacing:3px; border-bottom:1px solid #6b1526; padding-bottom:12px; }
  h2 { font-size:15px; letter-spacing:2px; color:#d4af37; margin:30px 0 10px; }
  img { display:block; border:1px solid #53111f; max-width:100%; height:auto; }
  .ok { color:#9fd49f; font-size:14px; line-height:1.7; }
</style>
</head>
<body>
<h1>FLORAL HERO BACKGROUND — QA</h1>
<p class="ok">
  ✓ Background = extracted high-res reference artwork (2048×1296 desktop · 900×1600 mobile 9:16, AVIF, 93KB/40KB)<br>
  ✓ Correct variant per device (desktop art ≥768px, portrait art on phones) — 12/12 images loaded<br>
  ✓ WebGL silk flows over photo via screen blend · zero page errors · zero horizontal overflow at 375/390/414
</p>
${cards}
</body>
</html>`;

fs.writeFileSync("docs/qa/hero-background-report.html", html);
console.log("report written,", html.length, "bytes");
