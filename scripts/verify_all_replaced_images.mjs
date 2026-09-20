import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("FINAL FULL-SUITE IMAGE VERIFICATION PASS");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_profile_final_verify",
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
  console.log("Loading http://localhost:3000...");
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(800);

  // 1. Monogram Intro Dismiss
  console.log("Dismissing monogram intro...");
  const introBtn = await page.$('[aria-label="Skip opening monogram"]');
  if (introBtn) {
    await introBtn.click();
  } else {
    await page.evaluate(() => document.body.click());
  }
  await sleep(1500);

  // 2. Hero Closed Screenshot
  const heroClosedPath = `${ARTIFACT_DIR}/verify_final_01_hero_closed.png`;
  await page.screenshot({ path: heroClosedPath });
  console.log(`Saved screenshot: ${heroClosedPath}`);

  // 3. Open Envelope
  console.log("Opening hero envelope...");
  const seal = await page.$("#seal-stamp");
  if (seal) {
    await seal.click();
    await sleep(4000); // allow full opening, card emergence, settling & expansion
  }

  // 4. Hero Opened Screenshot
  const heroOpenedPath = `${ARTIFACT_DIR}/verify_final_02_hero_opened.png`;
  await page.screenshot({ path: heroOpenedPath });
  console.log(`Saved screenshot: ${heroOpenedPath}`);

  // 5. Scroll to Our Story Section
  console.log("Scrolling to Our Story section...");
  await page.evaluate(() => {
    document.getElementById("our-story")?.scrollIntoView({ behavior: "instant" });
  });
  await sleep(1800);

  const storyPath = `${ARTIFACT_DIR}/verify_final_03_our_story_images.png`;
  await page.screenshot({ path: storyPath });
  console.log(`Saved screenshot: ${storyPath}`);

  // 6. Scroll to Lower Suite (Events, RSVP, Directions)
  console.log("Scrolling to Lower Suite / Directions section...");
  await page.evaluate(() => {
    document.getElementById("events-rsvp-travel-suite")?.scrollIntoView({ behavior: "instant" });
  });
  await sleep(1800);

  const lowerSuitePath = `${ARTIFACT_DIR}/verify_final_04_directions_images.png`;
  await page.screenshot({ path: lowerSuitePath });
  console.log(`Saved screenshot: ${lowerSuitePath}`);

  // 7. Mobile Viewport (390x844)
  console.log("Testing Mobile Viewport (390x844)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    document.getElementById("our-story")?.scrollIntoView({ behavior: "instant" });
  });
  await sleep(1500);

  const mobileStoryPath = `${ARTIFACT_DIR}/verify_final_05_mobile_story_images.png`;
  await page.screenshot({ path: mobileStoryPath });
  console.log(`Saved screenshot: ${mobileStoryPath}`);

  await browser.close();
  console.log("\nAll screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
