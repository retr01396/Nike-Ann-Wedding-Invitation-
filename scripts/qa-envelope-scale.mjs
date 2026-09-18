import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=== Launching Comprehensive Envelope Scale & Emergence QA ===");
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    userDataDir: "/tmp/brave_test_profile_scale_qa",
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
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  // ==========================================
  // 1. DESKTOP VIEWPORT (1280x900)
  // ==========================================
  console.log("\n[TEST 1] Testing Desktop (1280x900)...");
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1000);
  await page.click("body"); // dismiss intro
  await sleep(1500);

  // Measure envelope in closed state
  const desktopClosedMetrics = await page.evaluate(() => {
    const env = document.querySelector(".preserve-3d, [class*='aspect-\\[460\\/310\\]']");
    const rect = env ? env.getBoundingClientRect() : null;
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      envWidth: rect ? rect.width : 0,
      envHeight: rect ? rect.height : 0,
      envVwRatio: rect ? (rect.width / window.innerWidth) * 100 : 0,
    };
  });
  console.log("Desktop Closed Envelope Metrics:", JSON.stringify(desktopClosedMetrics, null, 2));

  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_scale_01_desktop_closed.png` });
  console.log("Saved qa_scale_01_desktop_closed.png");

  // Click seal to open
  console.log("Triggering seal click...");
  const seal = await page.$("#seal-stamp");
  if (seal) {
    await seal.click();
  }

  // Mid-emergence capture (around 1.1s)
  await sleep(1100);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_scale_02_desktop_emerging.png` });
  console.log("Saved qa_scale_02_desktop_emerging.png (mid-emergence)");

  // Settled capture (wait for sequence to finish)
  await sleep(2500);
  const desktopOpenedMetrics = await page.evaluate(() => {
    const cardH1 = document.querySelector("h1");
    const cardEl = cardH1 ? cardH1.closest(".backface-hidden") : null;
    const cardRect = cardEl ? cardEl.getBoundingClientRect() : null;
    const h1Style = cardH1 ? window.getComputedStyle(cardH1) : null;
    return {
      cardWidth: cardRect ? cardRect.width : 0,
      cardHeight: cardRect ? cardRect.height : 0,
      cardVwRatio: cardRect ? (cardRect.width / window.innerWidth) * 100 : 0,
      nameFontSize: h1Style ? h1Style.fontSize : "",
    };
  });
  console.log("Desktop Opened Card Metrics:", JSON.stringify(desktopOpenedMetrics, null, 2));

  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_scale_03_desktop_opened.png` });
  console.log("Saved qa_scale_03_desktop_opened.png");

  // ==========================================
  // 2. MOBILE VIEWPORT (390x844)
  // ==========================================
  console.log("\n[TEST 2] Testing Mobile (390x844)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1000);
  await page.click("body");
  await sleep(1500);

  const mobileClosedMetrics = await page.evaluate(() => {
    const env = document.querySelector("[class*='aspect-\\[460\\/310\\]']");
    const rect = env ? env.getBoundingClientRect() : null;
    return {
      windowWidth: window.innerWidth,
      envWidth: rect ? rect.width : 0,
      envVwRatio: rect ? (rect.width / window.innerWidth) * 100 : 0,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile Closed Metrics:", JSON.stringify(mobileClosedMetrics, null, 2));

  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_scale_04_mobile_closed.png` });
  console.log("Saved qa_scale_04_mobile_closed.png");

  // Click seal on mobile
  const mobileSeal = await page.$("#seal-stamp");
  if (mobileSeal) {
    await mobileSeal.click();
    await sleep(3500);
  }

  const mobileOpenedMetrics = await page.evaluate(() => {
    const cardH1 = document.querySelector("h1");
    const cardEl = cardH1 ? cardH1.closest(".backface-hidden") : null;
    const cardRect = cardEl ? cardEl.getBoundingClientRect() : null;
    const h1Style = cardH1 ? window.getComputedStyle(cardH1) : null;
    return {
      cardWidth: cardRect ? cardRect.width : 0,
      cardHeight: cardRect ? cardRect.height : 0,
      cardVwRatio: cardRect ? (cardRect.width / window.innerWidth) * 100 : 0,
      nameFontSize: h1Style ? h1Style.fontSize : "",
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile Opened Metrics:", JSON.stringify(mobileOpenedMetrics, null, 2));

  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_scale_05_mobile_opened.png` });
  console.log("Saved qa_scale_05_mobile_opened.png");

  // ==========================================
  // 3. LARGE DESKTOP VIEWPORT (1440x900)
  // ==========================================
  console.log("\n[TEST 3] Testing Large Desktop (1440x900)...");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1000);
  await page.click("body");
  await sleep(1500);

  const largeSeal = await page.$("#seal-stamp");
  if (largeSeal) {
    await largeSeal.click();
    await sleep(3500);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_scale_06_desktop_1440_opened.png` });
  console.log("Saved qa_scale_06_desktop_1440_opened.png");

  console.log("\nConsole errors encountered:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((err) => console.error(" -", err));
  }

  await browser.close();
  console.log("\n=== Scale & Emergence QA Complete! ===");
}

run().catch((err) => {
  console.error("Scale QA Error:", err);
  process.exit(1);
});
