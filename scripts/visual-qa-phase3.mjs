import puppeteer from "puppeteer-core";
import path from "path";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPhase3VisualQA() {
  console.log("=== Launching Phase 3 Visual QA ===");
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

  // Scroll to Events Section Intro
  console.log("Scrolling to Events Section...");
  await page.evaluate(() => {
    const events = document.getElementById("wedding-events");
    if (events) events.scrollIntoView({ behavior: "smooth" });
  });
  await sleep(1500);

  console.log("Capturing qa_p3_01_events_intro_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_01_events_intro_390.png") });

  // Scroll to Wedding Event Card
  console.log("Scrolling to Wedding Event Card...");
  await page.evaluate(() => {
    const weddingCard = document.querySelector('[data-event-id="wedding"]');
    if (weddingCard) weddingCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  await sleep(1000);

  console.log("Capturing qa_p3_02_wedding_card_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_02_wedding_card_390.png") });

  // Expand Wedding Event Details
  console.log("Expanding Wedding Event Details...");
  await page.evaluate(() => {
    const weddingCard = document.querySelector('[data-event-id="wedding"]');
    if (weddingCard) {
      const btn = weddingCard.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1000);

  console.log("Capturing qa_p3_03_wedding_expanded_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_03_wedding_expanded_390.png") });

  // Test Closing Wedding Event Details
  console.log("Testing closing Wedding Details...");
  await page.evaluate(() => {
    const weddingCard = document.querySelector('[data-event-id="wedding"]');
    if (weddingCard) {
      const btn = weddingCard.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(800);

  // Scroll to Church Event Card & Expand
  console.log("Scrolling to Church Event Card...");
  await page.evaluate(() => {
    const churchCard = document.querySelector('[data-event-id="church"]');
    if (churchCard) {
      churchCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const btn = churchCard.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1200);

  console.log("Capturing qa_p3_04_church_expanded_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_04_church_expanded_390.png") });

  // Scroll to Groom's House Event Card & Expand
  console.log("Scrolling to Groom's House Event Card...");
  await page.evaluate(() => {
    const groomsCard = document.querySelector('[data-event-id="grooms-house"]');
    if (groomsCard) {
      groomsCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const btn = groomsCard.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1200);

  console.log("Capturing qa_p3_05_grooms_house_expanded_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_05_grooms_house_expanded_390.png") });

  // Test reverse scrolling back up to Our Story
  console.log("Testing reverse scrolling back to Our Story...");
  await page.evaluate(() => {
    const timeline = document.getElementById("our-story");
    if (timeline) timeline.scrollIntoView({ behavior: "smooth" });
  });
  await sleep(1000);

  // Check horizontal overflow on 390px
  const hasOverflow390 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile 390px Horizontal Overflow:", hasOverflow390 ? "FAIL" : "PASS");

  // ========================================================
  // 2. COMPACT MOBILE VIEWPORT (375 x 812)
  // ========================================================
  console.log("\n[2/4] Testing Compact Mobile (375 x 812)...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await sleep(500);

  await page.evaluate(() => {
    const weddingCard = document.querySelector('[data-event-id="wedding"]');
    if (weddingCard) {
      weddingCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const btn = weddingCard.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1200);

  console.log("Capturing qa_p3_06_mobile_375.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_06_mobile_375.png") });

  const hasOverflow375 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile 375px Horizontal Overflow:", hasOverflow375 ? "FAIL" : "PASS");

  // ========================================================
  // 3. LARGE MOBILE VIEWPORT (414 x 896)
  // ========================================================
  console.log("\n[3/4] Testing Large Mobile (414 x 896)...");
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await sleep(500);

  await page.evaluate(() => {
    const churchCard = document.querySelector('[data-event-id="church"]');
    if (churchCard) {
      churchCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const btn = churchCard.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1200);

  console.log("Capturing qa_p3_07_mobile_414.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_07_mobile_414.png") });

  const hasOverflow414 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile 414px Horizontal Overflow:", hasOverflow414 ? "FAIL" : "PASS");

  // ========================================================
  // 4. DESKTOP VIEWPORT (1280 x 800)
  // ========================================================
  console.log("\n[4/4] Testing Desktop Viewport (1280 x 800)...");
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.5 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await sleep(500);

  // Desktop Events Intro
  await page.evaluate(() => {
    const events = document.getElementById("wedding-events");
    if (events) events.scrollIntoView({ behavior: "smooth" });
  });
  await sleep(1200);

  console.log("Capturing qa_p3_08_desktop_events_intro.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_08_desktop_events_intro.png") });

  // Desktop Wedding Card Expanded
  await page.evaluate(() => {
    const weddingCard = document.querySelector('[data-event-id="wedding"]');
    if (weddingCard) {
      weddingCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const btn = weddingCard.querySelector("button");
      if (btn) btn.click();
    }
  });
  await sleep(1200);

  console.log("Capturing qa_p3_09_desktop_wedding_expanded.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p3_09_desktop_wedding_expanded.png") });

  await browser.close();

  console.log("\n=== Phase 3 Visual QA Finished ===");
  console.log("Console errors count:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Errors:", consoleErrors);
  }
}

runPhase3VisualQA().catch((err) => {
  console.error("Phase 3 QA Execution Failed:", err);
  process.exit(1);
});
