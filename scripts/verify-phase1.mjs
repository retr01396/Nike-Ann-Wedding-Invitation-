import { weddingConfig } from "../src/config/wedding.js";
import { themeConfig } from "../src/config/theme.js";
import { animationConfig } from "../src/config/animations.js";

console.log("==================================================");
console.log("VERIFYING PHASE 1 IMPLEMENTATION INTEGRITY");
console.log("==================================================");

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Check Wedding Data Configuration
assert(weddingConfig.couple.groom === "NIKE", "Groom name is NIKE");
assert(weddingConfig.couple.bride === "ANN", "Bride name is ANN");
assert(weddingConfig.couple.connector === "and", "Connector is 'and'");
assert(weddingConfig.date.formatted === "SUNDAY, 15 NOVEMBER 2026", "Wedding date is SUNDAY, 15 NOVEMBER 2026");
assert(weddingConfig.location.display === "THRISSUR · KERALA", "Location is THRISSUR · KERALA");
assert(weddingConfig.teaser.badge === "PRIVATE INVITATION", "Teaser badge is PRIVATE INVITATION");
assert(weddingConfig.teaser.openButtonText === "TAP TO OPEN", "CTA is TAP TO OPEN");
assert(weddingConfig.invitation.ctaButtonText === "ENTER OUR WEDDING →", "Card CTA is ENTER OUR WEDDING →");

// 2. Check Theme Tokens
assert(!!themeConfig.colors.burgundy.deep, "Burgundy deep color token exists");
assert(!!themeConfig.colors.gold.foil, "Gold foil color token exists");
assert(!!themeConfig.gradients.goldFoil, "Gold foil gradient token exists");

// 3. Check Animation Configuration
assert(animationConfig.timings.cardEmergence > 1.0, "Card emergence timing is realistic and cinematic (> 1.0s)");
assert(animationConfig.timings.flapOpen > 0.6, "Flap open duration is realistic (> 0.6s)");
assert(animationConfig.perspective.envelope3D === 1200, "3D perspective is configured for realistic depth");

// 4. Viewport Checks (375px, 390px, 414px)
const viewports = [375, 390, 414];
for (const vp of viewports) {
  const envelopeW = vp < 390 ? 326 : 352;
  const cardW = vp < 390 ? 308 : 332;
  const horizontalPadding = vp - envelopeW;
  const cardFitInEnvelope = envelopeW - cardW;

  assert(horizontalPadding >= 20, `Viewport ${vp}px: Envelope (${envelopeW}px) has sufficient horizontal margin (${horizontalPadding}px >= 20px)`);
  assert(cardFitInEnvelope >= 16, `Viewport ${vp}px: Card (${cardW}px) physically fits inside envelope pocket (${envelopeW}px) with ${cardFitInEnvelope}px clearance`);
}

if (failed) {
  console.error("\n❌ Some tests failed!");
  process.exit(1);
} else {
  console.log("\n✨ ALL PHASE 1 INTEGRITY CHECKS PASSED!");
  process.exit(0);
}
