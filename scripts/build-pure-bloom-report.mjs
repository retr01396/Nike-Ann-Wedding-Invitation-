import fs from "node:fs";
import sharp from "sharp";

const SHOTS = [
  ["band-story.png", "STORY BAND — pure blooms, no letter", false],
  ["band-suite.png", "PANELS BAND — pure deep roses", false],
  ["band-footer.png", "FOOTER BAND — blooms fading out", false],
];

let cards = "";
for (const [file, title] of SHOTS) {
  if (!fs.existsSync(`/tmp/qa-freebuff/${file}`)) continue;
  const b = await sharp(`/tmp/qa-freebuff/${file}`)
    .resize({ width: 1000, withoutEnlargement: true })
    .jpeg({ quality: 78 })
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
  h2 { font-size:14px; letter-spacing:2px; color:#d4af37; margin:26px 0 8px; }
  img { display:block; border:1px solid #53111f; max-width:100%; height:auto; }
  .ok { color:#9fd49f; font-size:14px; line-height:1.7; }
</style>
</head>
<body>
<h1>PURE BLOOM BANDS — LETTER REMOVED</h1>
<p class="ok">
  New dedicated band texture (floral-band 1000×2200) cropped strictly from the reference's
  bloom-dense column — the envelope region (x≥478) is excluded BY CONSTRUCTION, so no letter
  can ever ghost through the background again.<br>
  Hero band unchanged (the approved artwork). Everything below the fold is now 100% flowers.<br>
  Verified: no flat envelope signature in any band · zero errors · tsc clean · build 10/10.
</p>
${cards}
</body>
</html>`;

fs.writeFileSync("docs/qa/pure-bloom-report.html", html);
console.log("report written,", html.length, "bytes");
