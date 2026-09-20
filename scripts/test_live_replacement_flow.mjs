import puppeteer from "puppeteer-core";
import fs from "fs";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("LIVE MANUAL IMAGE REPLACEMENT SIMULATION TEST");
  console.log("=================================================");

  const targetPath = "public/images/story/timeline/milestone-01/milestone-01.jpg";
  const backupPath = "public/images/story/timeline/milestone-01/milestone-01.jpg.bak";
  const alternateSource = "public/images/story/timeline/milestone-02/milestone-02.jpg";

  // Step 1: Backup original milestone-01.jpg
  fs.copyFileSync(targetPath, backupPath);
  const origSize = fs.statSync(targetPath).size;
  console.log(`\nOriginal milestone-01 size: ${origSize} bytes`);

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_profile_live_replacement",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // Load initial page
  console.log("Loading page initially...");
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(800);
  await page.click("body"); // dismiss intro
  await sleep(1000);

  // Scroll to Our Story
  await page.evaluate(() => {
    document.getElementById("our-story")?.scrollIntoView({ behavior: "instant" });
  });
  await sleep(1000);

  // Check initial rendered milestone-01
  const initialData = await page.evaluate(() => {
    const img = document.querySelector('img[src*="milestone-01"]');
    return img ? { src: img.src, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight } : null;
  });
  console.log("Initial Milestone-01 rendered:", initialData);

  // Step 2: SIMULATE USER REPLACING FILE IN FINDER
  console.log("\n[SIMULATION] Replacing milestone-01.jpg with alternate image in Finder...");
  fs.copyFileSync(alternateSource, targetPath);
  const newSize = fs.statSync(targetPath).size;
  console.log(`New milestone-01 file size on disk: ${newSize} bytes`);

  // Step 3: Simply REFRESH the page (as a user would in their browser)
  console.log("[SIMULATION] User simply refreshes the page (NO code edit, NO config edit)...");
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(1500);

  // Check rendered milestone-01 after refresh
  const afterRefreshData = await page.evaluate(() => {
    const img = document.querySelector('img[src*="milestone-01"]');
    return img ? { src: img.src, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight } : null;
  });
  console.log("After Refresh Milestone-01 rendered:", afterRefreshData);

  // Step 4: RESTORE original file
  console.log("\nRestoring original milestone-01.jpg from backup...");
  fs.copyFileSync(backupPath, targetPath);
  fs.unlinkSync(backupPath);
  console.log("Original file restored successfully.");

  await page.reload({ waitUntil: "networkidle2" });
  await sleep(1000);

  const finalData = await page.evaluate(() => {
    const img = document.querySelector('img[src*="milestone-01"]');
    return img ? { src: img.src, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight } : null;
  });
  console.log("Final Restored Milestone-01 rendered:", finalData);

  await browser.close();
  console.log("\nLive manual replacement test PASSED!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
