#!/bin/bash
# Build a self-contained HTML QA report with base64-embedded JPEG screenshots.
set -e
OUT="docs/qa/redesign-report.html"
IMG_DIR="/tmp/qa-jpg"

b64() { base64 -i "$IMG_DIR/$1" | tr -d '\n'; }

cat > "$OUT" <<'HEAD'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nike &amp; Ann — Redesign QA Report</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; background: #0d0104; color: #f3e5c8; padding: 2.5rem 1.5rem 4rem; }
  .wrap { max-width: 1180px; margin: 0 auto; }
  h1 { font-variant: small-caps; letter-spacing: 0.18em; color: #fff0c7; text-align: center; font-weight: normal; font-size: 1.7rem; }
  .sub { text-align: center; color: #caa24d; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; margin: 0.6rem 0 0.4rem; }
  .rule { width: 90px; height: 1px; background: linear-gradient(to right, transparent, #caa24d, transparent); margin: 1rem auto 2.2rem; }
  h2 { color: #e5c57b; font-variant: small-caps; letter-spacing: 0.14em; font-weight: normal; font-size: 1.15rem; margin: 2.6rem 0 1rem; border-bottom: 1px solid rgba(202,162,77,0.25); padding-bottom: 0.45rem; }
  .grid { display: grid; gap: 1.1rem; }
  .cols-2 { grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); }
  .cols-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
  figure { background: #150206; border: 1px solid rgba(202,162,77,0.28); padding: 0.55rem; }
  figcaption { font-size: 0.72rem; color: #caa24d; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.5rem 0.25rem 0.15rem; }
  img { width: 100%; height: auto; display: block; }
  ul.checks { list-style: none; margin: 0.8rem 0 0; }
  ul.checks li { padding: 0.32rem 0; font-size: 0.88rem; color: #e8d5bc; }
  ul.checks li::before { content: '\2713  '; color: #9ee493; }
  code { background: rgba(202,162,77,0.12); padding: 0.1rem 0.35rem; font-size: 0.8em; color: #f7e6b5; }
  footer { margin-top: 3rem; text-align: center; color: #caa24d; font-size: 0.75rem; letter-spacing: 0.2em; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Nike &amp; Ann — Redesign QA Report</h1>
  <p class="sub">Floral Immersion · Vertical Timeline · Liquid Glass RSVP · Mobile Navigation</p>
  <div class="rule"></div>
HEAD

emit_fig () {
  local file="$1" caption="$2"
  echo "  <figure><img src=\"data:image/jpeg;base64,$(b64 "$file")\" alt=\"$caption\" /><figcaption>$caption</figcaption></figure>" >> "$OUT"
}

section () {
  echo "" >> "$OUT"
  echo "  <h2>$1</h2>" >> "$OUT"
  echo "  <div class=\"grid $2\">" >> "$OUT"
}

section "1 · Desktop — Hero &amp; Envelope (1280 × 900)" "cols-2"
emit_fig "01-desktop-hero.jpg" "Closed envelope · full-bleed floral wash over liquid silk"
emit_fig "02-desktop-envelope-open.jpg" "Opened envelope · invitation card emerged"
echo "  </div>" >> "$OUT"

section "2 · Desktop — Our Story Vertical Timeline" "cols-2"
emit_fig "03-desktop-story-top.jpg" "Timeline header · circular milestone medallions"
emit_fig "04-desktop-story-mid.jpg" "Scroll-drawn gold connecting line mid-animation"
echo "  </div>" >> "$OUT"

section "3 · Desktop — Celebration · RSVP Glass · Directions" "cols-2"
emit_fig "05-desktop-suite.jpg" "Three glass panels floating over the living floral-silk environment"
echo "  </div>" >> "$OUT"

section "4 · Mobile — 375 × 812 (iPhone SE / 13 mini class)" "cols-3"
emit_fig "m-375-hero.jpg" "Hero"
emit_fig "m-375-menu.jpg" "Hamburger drawer open"
emit_fig "m-375-story.jpg" "Story timeline"
echo "  </div>" >> "$OUT"

section "5 · Mobile — 390 × 844 (iPhone 14 / 15 class)" "cols-3"
emit_fig "m-390-hero.jpg" "Hero"
emit_fig "m-390-menu.jpg" "Hamburger drawer"
emit_fig "m-390-story.jpg" "Story timeline"
echo "  </div>" >> "$OUT"

section "6 · Mobile — 414 × 896 (iPhone Plus class)" "cols-3"
emit_fig "m-414-hero.jpg" "Hero"
emit_fig "m-414-menu.jpg" "Hamburger drawer"
emit_fig "m-414-story.jpg" "Story timeline"
echo "  </div>" >> "$OUT"

cat >> "$OUT" <<'FOOT'

  <h2>7 · Automated Checks</h2>
  <ul class="checks">
    <li>TypeScript <code>tsc --noEmit</code> — 0 errors</li>
    <li>Production build <code>next build</code> — 10/10 routes compiled</li>
    <li>Images loaded — 15/15, zero broken sources</li>
    <li>Floral wash spans full viewport (1441 × 1013 @ 1280 × 900) with <code>mix-blend-mode: screen</code></li>
    <li>Story timeline — 4 milestones, 4 circular medallions, scroll-drawn line active</li>
    <li>RSVP liquid glass — <code>backdrop-filter: blur(40px)</code> substrate + translucent gold borders</li>
    <li>Mobile 375 / 390 / 414 — 0 px horizontal overflow</li>
    <li>Hamburger drawer opens &amp; navigates to RSVP — all 3 viewports</li>
    <li>Browser console — zero errors across desktop &amp; mobile sessions</li>
  </ul>

  <footer>NIKE &amp; ANN · 2026 · MAKE IT FEEL ROYAL</footer>
</div>
</body>
</html>
FOOT

echo "Report written: $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes)"
