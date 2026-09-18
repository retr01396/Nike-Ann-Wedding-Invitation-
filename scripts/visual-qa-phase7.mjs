import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";
const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runPhase7VisualQA() {
  console.log("=== Launching Phase 7B Interaction & Bug Fix Visual QA ===");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    userDataDir: "/tmp/brave_test_profile_p7b",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  // Desktop Viewport
  console.log("\n[1/7] Auditing Desktop (1280x900)...");
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1500);

  // Dismiss MonogramIntro if active by clicking body
  await page.click("body");
  await sleep(1000);

  // Open Envelope
  const seal = await page.$("#seal-stamp");
  if (seal) {
    await seal.click();
    await sleep(3500);
  }

  // Check Stationery Nav items
  const navText = await page.$eval("#stationery-nav", (el) => el.innerText);
  console.log("Navigation text observed:", navText.replace(/\n+/g, " | "));

  // TEST 1: Click OUR STORY in nav
  console.log("\n[TEST 1] Clicking OUR STORY in nav...");
  const storyBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll("#stationery-nav button"));
    return buttons.find((b) => b.textContent.includes("OUR STORY"));
  });
  if (storyBtn) {
    await storyBtn.click();
    await sleep(1200);
  }

  // Verify NO dialog/modal is open
  const openModalsOnStory = await page.$$eval("[role='dialog']", (els) => els.length);
  console.log(`Open modals on Our Story navigation: ${openModalsOnStory} (Expected: 0) -> ${openModalsOnStory === 0 ? "PASS" : "FAIL"}`);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "qa_p7b_01_nav_our_story.png"),
  });
  console.log("Captured: qa_p7b_01_nav_our_story.png");

  // TEST 2: In-flow chapter expansion
  console.log("\n[TEST 2] Testing in-flow milestone expansion...");
  const chapterBtn = await page.$("#our-story button[aria-expanded]");
  if (chapterBtn) {
    await chapterBtn.click();
    await sleep(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "qa_p7b_02_story_chapters_inflow.png"),
    });
    console.log("Captured: qa_p7b_02_story_chapters_inflow.png");
    // Collapse back
    await chapterBtn.click();
    await sleep(400);
  }

  // TEST 3: Click EVENTS in nav
  console.log("\n[TEST 3] Clicking EVENTS in nav...");
  const eventsBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll("#stationery-nav button"));
    return buttons.find((b) => b.textContent.includes("EVENTS"));
  });
  if (eventsBtn) {
    await eventsBtn.click();
    await sleep(1200);
  }
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "qa_p7b_03_nav_events.png"),
  });
  console.log("Captured: qa_p7b_03_nav_events.png");

  // TEST 4: Open Celebration Dossier modal
  console.log("\n[TEST 4] Testing Celebration Dossier...");
  const dossierBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll("#events button"));
    return buttons.find((b) => b.textContent.includes("VIEW CELEBRATION DOSSIER"));
  });
  if (dossierBtn) {
    await dossierBtn.click();
    await sleep(800);

    const dossierModalOpen = await page.$$eval("[role='dialog']", (els) => els.length);
    console.log(`Celebration Dossier open count: ${dossierModalOpen} (Expected: 1) -> ${dossierModalOpen === 1 ? "PASS" : "FAIL"}`);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "qa_p7b_04_events_dossier_modal.png"),
    });
    console.log("Captured: qa_p7b_04_events_dossier_modal.png");

    // Close dossier via Escape key
    await page.keyboard.press("Escape");
    await sleep(600);
    const dossierModalAfterEsc = await page.$$eval("[role='dialog']", (els) => els.length);
    console.log(`Celebration Dossier after Escape: ${dossierModalAfterEsc} (Expected: 0) -> ${dossierModalAfterEsc === 0 ? "PASS" : "FAIL"}`);
  }

  // TEST 5: Click DIRECTIONS in nav
  console.log("\n[TEST 5] Clicking DIRECTIONS in nav...");
  const directionsBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll("#stationery-nav button"));
    return buttons.find((b) => b.textContent.includes("DIRECTIONS"));
  });
  if (directionsBtn) {
    await directionsBtn.click();
    await sleep(1200);
  }

  const openModalsOnDirections = await page.$$eval("[role='dialog']", (els) => els.length);
  console.log(`Open modals on Directions navigation: ${openModalsOnDirections} (Expected: 0) -> ${openModalsOnDirections === 0 ? "PASS" : "FAIL"}`);

  // Test 3 tabs in Directions
  const tabCategories = await page.$$eval("#directions .grid-cols-3 button", (btns) =>
    btns.map((b) => b.textContent.trim())
  );
  console.log("Directions location tabs observed:", tabCategories);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "qa_p7b_05_nav_directions_active.png"),
  });
  console.log("Captured: qa_p7b_05_nav_directions_active.png");

  // TEST 6: In-flow 3 locations expansion in Directions
  console.log("\n[TEST 6] Testing Directions 3 locations in-flow view...");
  const viewAllDestBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll("#directions button"));
    return buttons.find((b) => b.textContent.includes("VIEW ALL 3 LOCATIONS"));
  });
  if (viewAllDestBtn) {
    await viewAllDestBtn.click();
    await sleep(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "qa_p7b_06_directions_all_inflow.png"),
    });
    console.log("Captured: qa_p7b_06_directions_all_inflow.png");
  }

  // TEST 7: Click RSVP in nav
  console.log("\n[TEST 7] Clicking RSVP in nav...");
  const rsvpBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll("#stationery-nav button"));
    return buttons.find((b) => b.textContent.includes("RSVP"));
  });
  if (rsvpBtn) {
    await rsvpBtn.click();
    await sleep(1200);
  }
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "qa_p7b_07_nav_rsvp.png"),
  });
  console.log("Captured: qa_p7b_07_nav_rsvp.png");

  // TEST 8: Footer & WhatsApp Icon
  console.log("\n[TEST 8] Inspecting Footer & WhatsApp Icon...");
  const footerEl = await page.$("footer");
  if (footerEl) {
    await footerEl.scrollIntoView();
    await sleep(600);
  }
  const whatsappHref = await page.$eval("a[aria-label='Contact via WhatsApp']", (el) => el.href);
  console.log("WhatsApp link verified:", whatsappHref);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "qa_p7b_08_footer_whatsapp.png"),
  });
  console.log("Captured: qa_p7b_08_footer_whatsapp.png");

  // TEST 9: Mobile Responsiveness Check (375px, 390px, 414px)
  console.log("\n[TEST 9] Mobile Responsiveness (375px, 390px, 414px)...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo({ top: 0 }));
  await sleep(1000);

  const overflow375 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 375px Horizontal Overflow: ${overflow375 ? "FAIL" : "PASS (0px overflow)"}`);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "qa_p7b_09_mobile_375.png"),
  });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await sleep(800);
  const overflow390 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 390px Horizontal Overflow: ${overflow390 ? "FAIL" : "PASS (0px overflow)"}`);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "qa_p7b_10_mobile_390.png"),
    fullPage: true,
  });

  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2 });
  await sleep(800);
  const overflow414 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 414px Horizontal Overflow: ${overflow414 ? "FAIL" : "PASS (0px overflow)"}`);

  console.log("\n=== Console Errors ===");
  if (consoleErrors.length === 0) {
    console.log("✓ Zero console errors detected!");
  } else {
    console.log("Console errors:", consoleErrors);
  }

  await browser.close();
  console.log("\n=== Phase 7B Visual QA Complete ===");
}

runPhase7VisualQA().catch(console.error);
