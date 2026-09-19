import fs from "node:fs";
import sharp from "sharp";

const SHOTS = [
  [
    "/tmp/qa-freebuff/user-tint-report.png",
    "BEFORE — flat red tint over background (your screenshot)",
    false,
  ],
  [
    "/tmp/qa-freebuff/untinted-desktop.png",
    "AFTER — natural floral artwork, no tint (desktop 1440×900)",
    false,
  ],
  [
    "/tmp/qa-freebuff/untinted-mobile.png",
    "AFTER — mobile 390×844",
    true,
  ],
];

let cards = "";
for (const [file, title, isMobile] of SHOTS) {
  if (!fs.existsSync(file)) continue;
  const b = await sharp(file)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 76 })
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
<h1>RED TINT — REMOVED</h1>
<p class="ok">
  Removed the three stacked red glows that flattened the artwork:<br>
  1. FloralFraming "living sheen" radial — deleted<br>
  2. VelvetOverlay wine spotlight — 40% → 7% presence<br>
  3. Silk shader crimson fields — scaled to 22–30%, opacity 85% → 50% (highlights/gold glints only)<br><br>
  Result: background is now the pure photographic artwork — flat tint zone RGB(73,28,34) → textured (43,10,13) with sd 20.
</p>
${cards}
</body>
</html>`;

fs.writeFileSync("docs/qa/tint-fix-report.html", html);
console.log("report written,", html.length, "bytes");
