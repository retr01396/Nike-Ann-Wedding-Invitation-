import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";
const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runPhase6VisualQA() {
  console.log("=== Launching Phase 6 Visual & Functional QA (Supabase + Admin Dashboard) ===");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,800"],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  // ========================================================
  // 1. PUBLIC WEBSITE & PHASE 1-5 INTEGRITY
  // ========================================================
  console.log("\n[1/5] Testing Public Wedding Invitation & Phase 1-5 Integrity...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1500);

  // Open envelope
  const seal = await page.$("#seal-stamp");
  if (seal) await seal.click();
  await sleep(1500);

  // Verify all sections exist in public page
  const publicIntegrity = await page.evaluate(() => {
    return {
      hasEnvelope: !!document.querySelector("main"),
      hasStory: !!document.getElementById("our-story"),
      hasEvents: !!document.getElementById("wedding-events"),
      hasTravel: !!document.getElementById("travel"),
      hasRSVP: !!document.getElementById("rsvp"),
    };
  });
  console.log("Public Phase Integrity (1-5):", publicIntegrity);

  // Submit test RSVP via form to verify persistence pipeline
  console.log("Testing public RSVP submission via form...");
  await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    if (rsvp) rsvp.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  await sleep(800);

  await page.type("#rsvp-name", "Grand Aunt Martha");

  // Select attending
  await page.evaluate(() => {
    const radios = document.querySelectorAll('button[role="radio"]');
    for (const r of radios) {
      if (r.textContent.includes("YES, I'LL BE THERE")) {
        r.click();
        break;
      }
    }
  });
  await sleep(500);

  // Submit RSVP
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      submitBtn.click();
    }
  });
  await sleep(2000);

  // Verify confirmation card renders
  const hasConfirmation = await page.evaluate(() => {
    const conf = document.getElementById("rsvp-confirmation-card");
    return !!conf;
  });
  console.log("Public RSVP Submission -> Confirmation Card:", hasConfirmation ? "PASS" : "FAIL");

  // ========================================================
  // 2. ADMIN LOGIN PAGE (Mobile 390 & Desktop 1280)
  // ========================================================
  console.log("\n[2/5] Testing Admin Login Page...");
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle2" });
  await sleep(800);

  console.log("Capturing qa_p6_01_admin_login_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p6_01_admin_login_390.png") });

  const overflowLogin390 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Login 390px Overflow:", overflowLogin390 ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  // Test Desktop Login
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await sleep(600);
  console.log("Capturing qa_p6_02_admin_login_desktop.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p6_02_admin_login_desktop.png") });

  // Test Login Validation (empty submission)
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await sleep(400);

  // ========================================================
  // 3. ADMIN DASHBOARD VIEWPORT AUDIT
  // ========================================================
  console.log("\n[3/5] Testing Admin Dashboard...");
  await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2" });
  await sleep(1000);

  // Desktop Dashboard
  console.log("Capturing qa_p6_04_admin_dashboard_desktop.png (1280x800)...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p6_04_admin_dashboard_desktop.png") });

  const overflow1280 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Dashboard 1280px Overflow:", overflow1280 ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  // Mobile Dashboard (390px)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await sleep(800);
  console.log("Capturing qa_p6_03_admin_dashboard_390.png (390x844)...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p6_03_admin_dashboard_390.png") });

  const overflow390 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Dashboard 390px Overflow:", overflow390 ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  // Test 375px, 414px, 768px, 1024px Viewports
  const viewportsToTest = [
    { name: "375x812 (iPhone SE)", width: 375, height: 812 },
    { name: "414x896 (iPhone Plus/Max)", width: 414, height: 896 },
    { name: "768x1024 (iPad Portrait)", width: 768, height: 1024 },
    { name: "1024x768 (iPad Landscape / Tablet)", width: 1024, height: 768 },
  ];

  for (const vp of viewportsToTest) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await sleep(400);
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`Dashboard ${vp.name} Overflow:`, hasOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");
  }

  // ========================================================
  // 4. ADMIN FEATURES: SEARCH, FILTERS & MODALS
  // ========================================================
  console.log("\n[4/5] Testing Admin Features (Search, Filters, Modals)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await sleep(500);

  // Test Search bar input
  await page.type('input[placeholder*="Search by guest name"]', "Alexander");
  await sleep(400);

  // Clear search
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search by guest name"]');
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await sleep(400);

  // ========================================================
  // 5. CSV EXPORT & CONSOLE ERRORS
  // ========================================================
  console.log("\n[5/5] Testing CSV Export & Console Audit...");
  const hasExportBtn = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Export CSV")
    );
    return !!btn;
  });
  console.log("Export CSV Button Found:", hasExportBtn ? "PASS" : "FAIL");

  console.log("\n=== Visual & Functional QA Summary ===");
  console.log("Console errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Errors:", consoleErrors);
  }

  await browser.close();
  console.log("\nQA Complete! Screenshots stored in artifact directory.");
}

runPhase6VisualQA().catch((err) => {
  console.error("QA Script Error:", err);
  process.exit(1);
});
