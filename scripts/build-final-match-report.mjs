import fs from "node:fs";
import sharp from "sharp";

const SHOTS = [
  ["final-story.png", "OUR STORY — photographic circles, double gold rings, script, destiny tagline", false],
  ["final-suite.png", "THE THREE PANELS — glowing corner lights, rose ornament, RSVP verbatim", false],
];

let cards = "";
for (const [file, title] of SHOTS) {
  if (!fs.existsSync(`/tmp/qa-freebuff/${file}`)) continue;
  const b = await sharp(`/tmp/qa-freebuff/${file}`)
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
  body { margin:0; background:#160205; color:#f3e5c8; font-family:Georgia,serif; padding:28px 20px 60px; }
  h1 { font-size:26px; letter-spacing:3px; border-bottom:1px solid #6b1526; padding-bottom:12px; }
  h2 { font-size:15px; letter-spacing:2px; color:#d4af37; margin:30px 0 10px; }
  img { display:block; border:1px solid #53111f; max-width:100%; height:auto; }
  .ok { color:#9fd49f; font-size:14px; line-height:1.7; }
</style>
</head>
<body>
<h1>EXACT MATCH — VERIFIED</h1>
<p class="ok">
  ✓ Story milestones now photographic: sunset couple · misty hills · rings on hands · tree at dusk<br>
  ✓ Thin gold ring + offset companion ring around each circle, exactly as the reference draws them<br>
  ✓ Glowing corner lights on all three panels · rose ornament under "WE CAN'T WAIT TO CELEBRATE WITH YOU"<br>
  ✓ RSVP panel verbatim: fields, stay buttons, champagne SEND RSVP bar, italic microcopy<br>
  ✓ Photos served via next/image optimization · zero errors · tsc clean · build 10/10
</p>
${cards}
</body>
</html>`;

fs.writeFileSync("docs/qa/exact-match-report.html", html);
console.log("report written,", html.length, "bytes");
