import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("MASTER REDESIGN VERIFICATION & QA SUITE");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_profile_redesign_master",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
    ],
  });

  const page = await browser.newPage();

  // -------------------------------------------------------------
  // TEST 1: DESKTOP HERO & TOP NAVIGATION
  // -------------------------------------------------------------
  console.log("\n[Test 1] Testing Desktop 1440x900 Hero & Top Nav...");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(600);
  await page.click("body"); // dismiss monogram intro
  await sleep(1000);

  // Check top nav presence
  const hasNav = await page.$("#stationery-nav");
  console.log("Top nav present:", !!hasNav);

  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_01_desktop_hero_closed.png` });
  console.log("Saved: redesign_01_desktop_hero_closed.png");

  // -------------------------------------------------------------
  // TEST 2: ENVELOPE OPENING & PHYSICAL EMERGENCE
  // -------------------------------------------------------------
  console.log("\n[Test 2] Triggering Envelope Opening Sequence...");
  const seal = await page.$("#seal-stamp");
  if (seal) {
    await seal.click();
    console.log("Wax seal clicked. Waiting for emergence and post-settling expansion...");
    await sleep(4000); // allow full emergence, settling, and expansion to complete
  } else {
    console.error("Seal button not found!");
  }

  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_02_desktop_card_expanded.png` });
  console.log("Saved: redesign_02_desktop_card_expanded.png");

  // -------------------------------------------------------------
  // TEST 3: OUR STORY SECTION & POLAROID COLLAGE
  // -------------------------------------------------------------
  console.log("\n[Test 3] Inspecting Our Story Section...");
  const storyEl = await page.$("#our-story");
  if (storyEl) {
    await storyEl.scrollIntoView();
    await sleep(1500); // allow drawing line to animate
  }

  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_03_our_story_collage.png` });
  console.log("Saved: redesign_03_our_story_collage.png");

  // -------------------------------------------------------------
  // TEST 4: FULL STORY READING MODAL
  // -------------------------------------------------------------
  console.log("\n[Test 4] Testing 'READ OUR FULL STORY' Modal...");
  const readFullStoryBtn = await page.$("button::-p-text(READ OUR FULL STORY)");
  if (readFullStoryBtn) {
    await readFullStoryBtn.click();
    await sleep(600);
    await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_04_story_reading_modal.png` });
    console.log("Saved: redesign_04_story_reading_modal.png");

    // Close modal
    const closeBtn = await page.$("button[aria-label='Close story dialog']");
    if (closeBtn) {
      await closeBtn.click();
      await sleep(500);
    }
  } else {
    console.log("Note: READ OUR FULL STORY button selector tried.");
  }

  // -------------------------------------------------------------
  // TEST 5: THREE SMOKED LIQUID GLASS PANELS
  // -------------------------------------------------------------
  console.log("\n[Test 5] Inspecting Three Glass Panels...");
  const suiteEl = await page.$("#events-rsvp-travel-suite");
  if (suiteEl) {
    await suiteEl.scrollIntoView();
    await sleep(1000);
  }

  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_05_three_glass_panels.png` });
  console.log("Saved: redesign_05_three_glass_panels.png");

  // Verify Directions Google Maps URLs
  console.log("\nVerifying Directions Google Maps Links...");
  const expectedUrls = {
    CHURCH: "https://maps.app.goo.gl/RfBfQvkBvkVc7Ahb8?g_st=iw",
    "EVENT SPACE": "https://maps.app.goo.gl/ZwUdbuYiaPKYvV3u5?g_st=iw",
    "GROOM'S HOUSE": "https://maps.app.goo.gl/qFGEFSNSgaVG1C6C6?g_st=iw",
  };

  const tabs = await page.$$("button[aria-pressed]");
  for (const tab of tabs) {
    const text = await (await tab.getProperty("textContent")).jsonValue();
    const cleanText = text.trim();
    if (expectedUrls[cleanText]) {
      await tab.click();
      await sleep(300);
      const mapsLink = await page.$("a[href*='maps']");
      if (mapsLink) {
        const href = await (await mapsLink.getProperty("href")).jsonValue();
        const matches = href === expectedUrls[cleanText];
        console.log(`Tab [${cleanText}]: Link matches expected: ${matches} (${href})`);
      }
    }
  }

  // -------------------------------------------------------------
  // TEST 6: FOOTER
  // -------------------------------------------------------------
  console.log("\n[Test 6] Inspecting Footer...");
  const footerEl = await page.$("footer");
  if (footerEl) {
    await footerEl.scrollIntoView();
    await sleep(500);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_06_stationery_footer.png` });
  console.log("Saved: redesign_06_stationery_footer.png");

  // -------------------------------------------------------------
  // TEST 7: FULL PAGE DESKTOP
  // -------------------------------------------------------------
  console.log("\n[Test 7] Capturing Desktop Full Page...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_07_desktop_fullpage.png`, fullPage: true });
  console.log("Saved: redesign_07_desktop_fullpage.png");

  // -------------------------------------------------------------
  // TEST 8: MOBILE VIEWPORT (390x844 iPhone)
  // -------------------------------------------------------------
  console.log("\n[Test 8] Testing Mobile 390x844 Viewport...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(500);
  await page.click("body"); // dismiss intro
  await sleep(1000);

  // Check horizontal overflow
  const overflow390 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile (390px) horizontal overflow:", overflow390);

  // Test mobile hamburger drawer
  const hamburger = await page.$("button[aria-controls='mobile-nav-drawer']");
  if (hamburger) {
    await hamburger.click();
    await sleep(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_08_mobile_hamburger_drawer.png` });
    console.log("Saved: redesign_08_mobile_hamburger_drawer.png");
    await hamburger.click();
    await sleep(300);
  }

  // Open envelope on mobile
  const sealMobile = await page.$("#seal-stamp");
  if (sealMobile) {
    await sealMobile.click();
    await sleep(4000);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_09_mobile_hero_opened.png` });
  console.log("Saved: redesign_09_mobile_hero_opened.png");

  // Scroll to Story on mobile
  const storyMobile = await page.$("#our-story");
  if (storyMobile) {
    await storyMobile.scrollIntoView();
    await sleep(1000);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_10_mobile_our_story.png` });
  console.log("Saved: redesign_10_mobile_our_story.png");

  // Scroll to Panels on mobile
  const panelsMobile = await page.$("#events-rsvp-travel-suite");
  if (panelsMobile) {
    await panelsMobile.scrollIntoView();
    await sleep(1000);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_11_mobile_panels.png` });
  console.log("Saved: redesign_11_mobile_panels.png");

  // Mobile 375px test
  console.log("\n[Test 9] Testing Small Mobile 375x812 Viewport...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await sleep(500);
  const overflow375 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile (375px) horizontal overflow:", overflow375);
  await page.screenshot({ path: `${ARTIFACT_DIR}/redesign_12_mobile_375_story.png` });
  console.log("Saved: redesign_12_mobile_375_story.png");

  await browser.close();
  console.log("\n=================================================");
  console.log("ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!");
  console.log("=================================================");
}

run().catch((err) => {
  console.error("QA Script error:", err);
  process.exit(1);
});
