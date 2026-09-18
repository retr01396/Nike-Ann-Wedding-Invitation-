import puppeteer from "puppeteer-core";
import path from "path";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPhase4VisualQA() {
  console.log("=== Launching Phase 4 Visual QA (Travel & Getting There) ===");
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.toString());
  });

  // ========================================================
  // 1. PRIMARY MOBILE VIEWPORT (390 x 844)
  // ========================================================
  console.log("\n[1/4] Testing Primary Mobile Viewport (390 x 844)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // Skip Monogram Intro
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await sleep(600);

  // Open Envelope
  console.log("Opening envelope...");
  const openBtn = await page.$('button[aria-label="Tap to open the wedding invitation"]');
  if (openBtn) await openBtn.click();
  await sleep(3500);

  // Scroll to Travel Section Intro
  console.log("Scrolling to Travel Section...");
  await page.evaluate(() => {
    const travel = document.getElementById("travel");
    if (travel) travel.scrollIntoView({ behavior: "smooth" });
  });
  await sleep(1500);

  console.log("Capturing qa_p4_01_travel_intro_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_01_travel_intro_390.png") });

  // Scroll to Destination 1: Event Space
  console.log("Scrolling to Event Space Destination...");
  await page.evaluate(() => {
    const card = document.getElementById("travel-card-event-space");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  await sleep(1000);

  console.log("Capturing qa_p4_02_event_space_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_02_event_space_390.png") });

  // Expand Event Space Travel Details
  console.log("Expanding Event Space Travel Details...");
  await page.evaluate(() => {
    const card = document.getElementById("travel-card-event-space");
    if (card) {
      const btn = card.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1000);

  console.log("Capturing qa_p4_03_event_space_expanded_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_03_event_space_expanded_390.png") });

  // Verify Directions Link
  const directionsLink = await page.evaluate(() => {
    const card = document.getElementById("travel-card-event-space");
    if (!card) return null;
    const a = card.querySelector('a[aria-label*="Google Maps"]');
    return a ? { href: a.href, target: a.target, rel: a.rel } : null;
  });
  console.log("Event Space Directions Link:", directionsLink);

  // Scroll to Destination 2: Church & Expand
  console.log("Scrolling to Church Destination...");
  await page.evaluate(() => {
    const card = document.getElementById("travel-card-church");
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      const btn = card.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1000);

  console.log("Capturing qa_p4_04_church_expanded_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_04_church_expanded_390.png") });

  // Scroll to Destination 3: Groom's House & Expand
  console.log("Scrolling to Groom's House Destination...");
  await page.evaluate(() => {
    const card = document.getElementById("travel-card-grooms-house");
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      const btn = card.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1000);

  console.log("Capturing qa_p4_05_grooms_house_expanded_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_05_grooms_house_expanded_390.png") });

  // Check 390px Overflow
  const overflow390 = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile 390px Overflow Status:", overflow390.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  // ========================================================
  // 2. MOBILE VIEWPORT (375 x 812 - iPhone SE)
  // ========================================================
  console.log("\n[2/4] Testing Mobile Viewport (375 x 812)...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await sleep(600);

  const overflow375 = await page.evaluate(() => {
    const travel = document.getElementById("travel");
    if (travel) travel.scrollIntoView({ behavior: "smooth", block: "start" });
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  await sleep(800);
  console.log("Mobile 375px Overflow Status:", overflow375.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  console.log("Capturing qa_p4_06_mobile_375.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_06_mobile_375.png") });

  // ========================================================
  // 3. MOBILE VIEWPORT (414 x 896 - iPhone Plus/Max)
  // ========================================================
  console.log("\n[3/4] Testing Mobile Viewport (414 x 896)...");
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2 });
  await sleep(600);

  const overflow414 = await page.evaluate(() => {
    const travel = document.getElementById("travel");
    if (travel) travel.scrollIntoView({ behavior: "smooth", block: "start" });
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  await sleep(800);
  console.log("Mobile 414px Overflow Status:", overflow414.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  console.log("Capturing qa_p4_07_mobile_414.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_07_mobile_414.png") });

  // ========================================================
  // 4. DESKTOP VIEWPORT (1280 x 800 - Editorial 3-Column)
  // ========================================================
  console.log("\n[4/4] Testing Desktop Viewport (1280 x 800)...");
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await sleep(800);

  await page.evaluate(() => {
    const travel = document.getElementById("travel");
    if (travel) travel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  await sleep(1200);

  console.log("Capturing qa_p4_08_desktop_travel_3col.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_08_desktop_travel_3col.png") });

  // Expand center card on desktop
  console.log("Expanding Church card on desktop...");
  await page.evaluate(() => {
    const card = document.getElementById("travel-card-church");
    if (card) {
      const btn = card.querySelector("button");
      if (btn) btn.click();
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  await sleep(1000);

  console.log("Capturing qa_p4_09_desktop_travel_expanded.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p4_09_desktop_travel_expanded.png") });

  const overflow1280 = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Desktop 1280px Overflow Status:", overflow1280.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  // ========================================================
  // VERIFY PRIOR PHASES INTEGRITY
  // ========================================================
  console.log("\nVerifying integrity of prior phases...");
  const phaseIntegrity = await page.evaluate(() => {
    const envelope = document.querySelector("main") || document.querySelector('[role="article"]');
    const story = document.getElementById("our-story");
    const events = document.getElementById("wedding-events");
    const travel = document.getElementById("travel");
    return {
      hasEnvelope: !!envelope,
      hasStory: !!story,
      hasEvents: !!events,
      hasTravel: !!travel,
    };
  });
  console.log("Phase Integrity Check:", phaseIntegrity);

  console.log("\n=== Visual QA Summary ===");
  console.log("Console errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Console error details:", consoleErrors);
  }

  await browser.close();
  console.log("\nVisual QA complete! All screenshots saved to artifact directory.");
}

runPhase4VisualQA().catch((err) => {
  console.error("Visual QA script failed:", err);
  process.exit(1);
});
