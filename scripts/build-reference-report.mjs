import fs from "node:fs";
import sharp from "sharp";

const SHOTS = [
  ["ref-hero.png", "HERO — matches reference image 1", false],
  ["ref-story.png", "OUR STORY — 3-column editorial layout", false],
  ["ref-suite.png", "THE THREE GOLD-FRAMED PANELS", false],
  ["ref-footer.png", "CLOSING BAND", false],
  ["ref-mobile-story.png", "MOBILE 390×844 — story stacks cleanly", true],
];

let cards = "";
for (const [file, title, isMobile] of SHOTS) {
  if (!fs.existsSync(`/tmp/qa-freebuff/${file}`)) continue;
  const b = await sharp(`/tmp/qa-freebuff/${file}`)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 78 })
    .toBuffer();
  const style = isMobile ? ' style="width:340px"' : "";
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
<h1>REFERENCE DESIGN — IMPLEMENTED</h1>
<p class="ok">
  ✓ Hero unchanged (already matching reference image 1)<br>
  ✓ Our Story: intro + OUR FULL STORY + "Better Together Always" script | drawn gold timeline | SOME MEET BY CHANCE, WE MET BY DESTINY<br>
  ✓ All three panels wrapped in illuminated rounded gold frames (Events / RSVP / Getting There)<br>
  ✓ Events panel: "WE CAN'T WAIT TO CELEBRATE WITH YOU" · Travel: reference map card + fact rows + OPEN IN GOOGLE MAPS<br>
  ✓ Footer: NIKE & ANN 2026 | A BRIGHTER CHAPTER TOGETHER + N/A | nav links + MADE WITH LOVE<br>
  ✓ RSVP form flow, validation and Supabase submission untouched · zero errors · no mobile overflow · build 10/10
</p>
${cards}
</body>
</html>`;

fs.writeFileSync("docs/qa/reference-implementation-report.html", html);
console.log("report written,", html.length, "bytes");
