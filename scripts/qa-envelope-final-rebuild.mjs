import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VIEWPORTS = [
  { name: "desktop_1280", width: 1280, height: 900 },
  { name: "desktop_1440", width: 1440, height: 900 },
  { name: "tablet_768", width: 768, height: 1024 },
  { name: "mobile_390", width: 390, height: 844 },
  { name: "mobile_375", width: 375, height: 812 },
  { name: "mobile_414", width: 414, height: 896 },
];

async function run() {
  console.log("=== Launching Final Hero Envelope Rebuild QA ===");
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    userDataDir: "/tmp/brave_test_profile_final_rebuild",
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

  const results = {};

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });
    await sleep(800);
    await page.click("body"); // Dismiss audio intro modal
    await sleep(1200);

    // 1. Measure CLOSED state
    const closedMetrics = await page.evaluate(() => {
      const env = document.querySelector("[class*='aspect-\\[460\\/310\\]']");
      const envRect = env ? env.getBoundingClientRect() : null;
      const body = document.body;
      const html = document.documentElement;
      return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        envWidth: envRect ? envRect.width : 0,
        envHeight: envRect ? envRect.height : 0,
        envVwRatio: envRect ? (envRect.width / window.innerWidth) * 100 : 0,
        hasOverflow: Math.max(body.scrollWidth, html.scrollWidth) > window.innerWidth,
      };
    });

    console.log(`[${vp.name}] Closed Metrics:`, JSON.stringify(closedMetrics, null, 2));
    await page.screenshot({ path: `${ARTIFACT_DIR}/qa_rebuild_${vp.name}_01_closed.png` });

    // 2. Trigger Opening
    const seal = await page.$("#seal-stamp, button[aria-label*='wax seal' i], button[aria-label*='Open' i]");
    if (seal) {
      await seal.click();
    } else {
      await page.click("[class*='aspect-\\[460\\/310\\]']");
    }

    // Capture MID-OPENING (approx 1100ms in - flap open, card rising)
    await sleep(1100);
    await page.screenshot({ path: `${ARTIFACT_DIR}/qa_rebuild_${vp.name}_02_mid.png` });

    // Wait for full OPENED settle & text illumination
    await sleep(2000);

    // 3. Measure OPENED state
    const openedMetrics = await page.evaluate(() => {
      const env = document.querySelector("[class*='aspect-\\[460\\/310\\]']");
      const envRect = env ? env.getBoundingClientRect() : null;
      const card = document.querySelector("[class*='aspect-\\[320\\/430\\]']");
      const cardRect = card ? card.getBoundingClientRect() : null;
      const nikeHeader = Array.from(document.querySelectorAll("h1")).find((h) => h.textContent?.includes("NIKE"));
      const body = document.body;
      const html = document.documentElement;

      return {
        envWidth: envRect ? envRect.width : 0,
        envHeight: envRect ? envRect.height : 0,
        cardWidth: cardRect ? cardRect.width : 0,
        cardHeight: cardRect ? cardRect.height : 0,
        cardToEnvRatio: envRect && cardRect ? (cardRect.width / envRect.width) * 100 : 0,
        nikeFontSize: nikeHeader ? window.getComputedStyle(nikeHeader).fontSize : "N/A",
        hasOverflow: Math.max(body.scrollWidth, html.scrollWidth) > window.innerWidth,
      };
    });

    console.log(`[${vp.name}] Opened Metrics:`, JSON.stringify(openedMetrics, null, 2));
    await page.screenshot({ path: `${ARTIFACT_DIR}/qa_rebuild_${vp.name}_03_opened.png` });

    results[vp.name] = { closed: closedMetrics, opened: openedMetrics };
  }

  await browser.close();
  console.log("\nConsole errors encountered:", consoleErrors.length);
  console.log("\n=== Final Rebuild QA Complete! ===");
}

run().catch((err) => {
  console.error("QA Script Error:", err);
  process.exit(1);
});
