import puppeteer from "puppeteer-core";
import path from "path";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPhase2VisualQA() {
  console.log("=== Launching Phase 2 Visual QA ===");
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
  await sleep(3600); // Wait for flap -> emergence -> typography illuminate

  // Click "ENTER OUR WEDDING →"
  console.log("Clicking 'ENTER OUR WEDDING →' button...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const enterBtn = buttons.find((b) => b.textContent?.includes("ENTER OUR WEDDING"));
    if (enterBtn) {
      enterBtn.click();
    } else {
      const storyIntro = document.getElementById("story-intro");
      if (storyIntro) storyIntro.scrollIntoView({ behavior: "smooth" });
    }
  });
  await sleep(1500);

  // QA Screen 1: Story Intro ("TWO SOULS, A SHARED JOURNEY")
  console.log("Capturing qa_p2_01_story_intro_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_01_story_intro_390.png") });

  // Scroll into Our Story Timeline start (Milestone 1)
  console.log("Scrolling into Timeline Start (Milestone 1)...");
  await page.evaluate(() => {
    const storyTimeline = document.getElementById("our-story");
    if (storyTimeline) {
      const top = storyTimeline.getBoundingClientRect().top + window.scrollY + 350;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
  await sleep(1200);

  console.log("Capturing qa_p2_02_timeline_milestone_1.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_02_timeline_milestone_1.png") });

  // Scroll into Milestones 2 & 3
  console.log("Scrolling into Milestones 2 & 3...");
  await page.evaluate(() => {
    window.scrollBy({ top: 750, behavior: "smooth" });
  });
  await sleep(1200);

  console.log("Capturing qa_p2_03_timeline_milestones_2_3.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_03_timeline_milestones_2_3.png") });

  // Scroll to End of Timeline & Closing Quote
  console.log("Scrolling to End of Timeline & Closing Quote...");
  await page.evaluate(() => {
    const closing = document.querySelector(".timeline-closing");
    if (closing) {
      closing.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollBy({ top: 1200, behavior: "smooth" });
    }
  });
  await sleep(1500);

  console.log("Capturing qa_p2_04_timeline_end_quote.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_04_timeline_end_quote.png") });

  // Test reverse scrolling
  console.log("Testing reverse scroll up...");
  await page.evaluate(() => {
    window.scrollBy({ top: -600, behavior: "smooth" });
  });
  await sleep(800);

  // Check horizontal overflow on mobile
  const hasHorizontalScrollMobile = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile 390px Horizontal Overflow:", hasHorizontalScrollMobile ? "FAIL (overflow detected)" : "PASS (no overflow)");

  // ========================================================
  // 2. DESKTOP ALTERNATING VIEWPORT (1280 x 800)
  // ========================================================
  console.log("\n[2/4] Testing Desktop Viewport (1280 x 800)...");
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.5 });
  await page.reload({ waitUntil: "networkidle0" });

  // Skip intro
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await sleep(500);

  // Open card
  const deskOpen = await page.$('button[aria-label="Tap to open the wedding invitation"]');
  if (deskOpen) await deskOpen.click();
  await sleep(3500);

  // Scroll into timeline on desktop
  await page.evaluate(() => {
    const story = document.getElementById("story-intro");
    if (story) story.scrollIntoView({ behavior: "smooth" });
  });
  await sleep(1200);

  console.log("Capturing qa_p2_07_desktop_story_intro.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_07_desktop_story_intro.png") });

  await page.evaluate(() => {
    const timeline = document.getElementById("our-story");
    if (timeline) {
      const top = timeline.getBoundingClientRect().top + window.scrollY + 250;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
  await sleep(1200);

  console.log("Capturing qa_p2_05_desktop_alternating.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_05_desktop_alternating.png") });

  await page.evaluate(() => {
    window.scrollBy({ top: 600, behavior: "smooth" });
  });
  await sleep(1200);

  console.log("Capturing qa_p2_08_desktop_milestone_2.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_08_desktop_milestone_2.png") });

  // ========================================================
  // 3. COMPACT MOBILE VIEWPORT (375 x 812)
  // ========================================================
  console.log("\n[3/4] Testing 375 x 812 Viewport...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const intro = document.querySelector('[role="button"][aria-label="Skip opening monogram"]');
    if (intro) intro.click();
  });
  await sleep(500);

  // Scroll to story intro & timeline
  await page.evaluate(() => {
    const story = document.getElementById("story-intro");
    if (story) story.scrollIntoView();
  });
  await sleep(800);

  console.log("Capturing qa_p2_06_mobile_375.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p2_06_mobile_375.png") });

  const hasHorizontalScroll375 = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log("Mobile 375px Horizontal Overflow:", hasHorizontalScroll375 ? "FAIL" : "PASS");

  await browser.close();

  console.log("\n=== Phase 2 Visual QA Finished ===");
  console.log("Console errors count:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Console Errors:", consoleErrors);
  }
}

runPhase2VisualQA().catch((err) => {
  console.error("QA Execution Failed:", err);
  process.exit(1);
});
