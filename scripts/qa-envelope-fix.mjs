import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("Launching Brave to verify envelope fix...");
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    userDataDir: "/tmp/brave_test_profile_envelope_fix",
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

  // 1. DESKTOP CLOSED
  console.log("\n[1/4] Capturing Desktop Closed State...");
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1000);
  await page.click("body"); // Dismiss MonogramIntro
  await sleep(1500);

  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fix_01_desktop_closed.png` });
  console.log("Captured qa_fix_01_desktop_closed.png");

  // 2. DESKTOP OPENED
  console.log("\n[2/4] Clicking Wax Seal to Open Envelope...");
  const seal = await page.$("#seal-stamp");
  if (seal) {
    await seal.click();
    await sleep(3500);
  } else {
    console.error("Wax seal button not found!");
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fix_02_desktop_opened.png` });
  console.log("Captured qa_fix_02_desktop_opened.png");

  // 3. MOBILE CLOSED
  console.log("\n[3/4] Capturing Mobile Closed State (390x844)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1000);
  await page.click("body");
  await sleep(1500);

  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fix_03_mobile_closed.png` });
  console.log("Captured qa_fix_03_mobile_closed.png");

  // 4. MOBILE OPENED
  console.log("\n[4/4] Clicking Seal on Mobile...");
  const mobileSeal = await page.$("#seal-stamp");
  if (mobileSeal) {
    await mobileSeal.click();
    await sleep(3500);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fix_04_mobile_opened.png` });
  console.log("Captured qa_fix_04_mobile_opened.png");

  console.log("\nConsole errors encountered:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((err) => console.error(" -", err));
  }

  await browser.close();
  console.log("QA verification completed successfully!");
}

run().catch((err) => {
  console.error("QA script error:", err);
  process.exit(1);
});
