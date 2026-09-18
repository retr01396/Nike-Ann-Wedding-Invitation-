import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

async function runVisualQA() {
  console.log("Launching headless browser for Visual QA...");
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--font-render-hinting=none"],
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.toString());
  });

  // 1. TEST 390x844 (Primary Mobile Target)
  console.log("\nTesting 390x844 viewport...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // Monogram Intro
  console.log("Capturing 01_monogram_intro.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_01_monogram_intro.png") });

  // Skip Monogram Intro
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Closed Envelope
  console.log("Capturing 02_envelope_closed_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_02_envelope_closed_390.png") });

  // Trigger Tap to Open
  console.log("Triggering Tap To Open...");
  const openButton = await page.$('button[aria-label="Tap to open the wedding invitation"]');
  if (openButton) {
    await openButton.click();
  }

  // Flap opening
  await new Promise((r) => setTimeout(r, 450));
  console.log("Capturing 03_flap_opening.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_03_flap_opening.png") });

  // Card physically emerging upward out of pocket
  await new Promise((r) => setTimeout(r, 650));
  console.log("Capturing 04_card_emerging.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_04_card_emerging.png") });

  // Card settled & typography fully illuminated
  await new Promise((r) => setTimeout(r, 2600));
  console.log("Capturing 05_card_opened_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_05_card_opened_390.png") });

  // 2. TEST 375x812 Viewport
  console.log("\nTesting 375x812 viewport...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const openBtn375 = await page.$('button[aria-label="Tap to open the wedding invitation"]');
  if (openBtn375) await openBtn375.click();
  await new Promise((r) => setTimeout(r, 3800));
  console.log("Capturing 06_card_opened_375.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_06_card_opened_375.png") });

  // 3. TEST 414x896 Viewport
  console.log("\nTesting 414x896 viewport...");
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const openBtn414 = await page.$('button[aria-label="Tap to open the wedding invitation"]');
  if (openBtn414) await openBtn414.click();
  await new Promise((r) => setTimeout(r, 3800));
  console.log("Capturing 07_card_opened_414.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_07_card_opened_414.png") });

  // 4. TEST Desktop Viewport (1280x800)
  console.log("\nTesting Desktop viewport (1280x800)...");
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const openBtnDesk = await page.$('button[aria-label="Tap to open the wedding invitation"]');
  if (openBtnDesk) await openBtnDesk.click();
  await new Promise((r) => setTimeout(r, 3800));
  console.log("Capturing 08_card_opened_desktop.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_08_card_opened_desktop.png") });

  await browser.close();

  console.log("\nVisual QA finished successfully!");
  console.log("Console errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Errors:", consoleErrors);
  }
}

runVisualQA().catch((err) => {
  console.error("QA Run Error:", err);
  process.exit(1);
});
