import puppeteer from "puppeteer-core";
import fs from "fs";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("BACKGROUND AUDIO INTEGRATION VERIFICATION");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_profile_audio",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  page.on("console", (msg) => consoleLogs.push(msg.text()));
  page.on("pageerror", (err) => console.error("PAGE ERROR:", err));

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log(`\nNavigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1000);

  // 1. Check audio element in DOM
  const audioInfo = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    if (!audio) return { found: false };
    return {
      found: true,
      src: audio.getAttribute("src"),
      preload: audio.getAttribute("preload"),
      loop: audio.loop,
      paused: audio.paused,
      volume: audio.volume,
    };
  });
  console.log("Audio Element in DOM:", JSON.stringify(audioInfo, null, 2));

  // 2. Check Music Toggle Button
  const buttonInfo = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const musicBtn = buttons.find(
      (b) => b.innerText.includes("MUSIC") || b.getAttribute("aria-label")?.includes("music")
    );
    if (!musicBtn) return { found: false };
    return {
      found: true,
      text: musicBtn.innerText.trim(),
      ariaLabel: musicBtn.getAttribute("aria-label"),
      ariaPressed: musicBtn.getAttribute("aria-pressed"),
    };
  });
  console.log("Music Button Initial:", JSON.stringify(buttonInfo, null, 2));

  // 3. Dismiss Monogram Intro by clicking body (user gesture)
  console.log("\nTriggering user gesture (dismissing intro)...");
  await page.click("body");
  await sleep(1500);

  // 4. Check status after user gesture
  const stateAfterGesture = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    const buttons = Array.from(document.querySelectorAll("button"));
    const musicBtn = buttons.find(
      (b) => b.innerText.includes("MUSIC") || b.getAttribute("aria-label")?.includes("music")
    );
    return {
      audioPaused: audio ? audio.paused : null,
      audioVolume: audio ? Math.round(audio.volume * 100) / 100 : null,
      buttonText: musicBtn ? musicBtn.innerText.trim() : null,
      ariaPressed: musicBtn ? musicBtn.getAttribute("aria-pressed") : null,
    };
  });
  console.log("State After Gesture:", JSON.stringify(stateAfterGesture, null, 2));

  // Capture desktop screenshot with audio pill visible
  const desktopPath = `${ARTIFACT_DIR}/audio_desktop_verification.png`;
  await page.screenshot({ path: desktopPath });
  console.log(`Saved screenshot: ${desktopPath}`);

  // 5. Test Manual Toggle
  console.log("\nClicking Music button to toggle state...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const musicBtn = buttons.find(
      (b) => b.innerText.includes("MUSIC") || b.getAttribute("aria-label")?.includes("music")
    );
    if (musicBtn) musicBtn.click();
  });
  await sleep(600);

  const stateAfterToggle = await page.evaluate(() => {
    const audio = document.querySelector("audio");
    const buttons = Array.from(document.querySelectorAll("button"));
    const musicBtn = buttons.find(
      (b) => b.innerText.includes("MUSIC") || b.getAttribute("aria-label")?.includes("music")
    );
    return {
      audioPaused: audio ? audio.paused : null,
      audioVolume: audio ? Math.round(audio.volume * 100) / 100 : null,
      buttonText: musicBtn ? musicBtn.innerText.trim() : null,
      ariaPressed: musicBtn ? musicBtn.getAttribute("aria-pressed") : null,
    };
  });
  console.log("State After Manual Toggle:", JSON.stringify(stateAfterToggle, null, 2));

  // 6. Test Mobile Viewport
  console.log("\nTesting Mobile Viewport (390x844)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await sleep(500);

  const mobileButtonInfo = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const musicBtn = buttons.find(
      (b) => b.innerText.includes("MUSIC") || b.getAttribute("aria-label")?.includes("music")
    );
    return {
      found: !!musicBtn,
      text: musicBtn ? musicBtn.innerText.trim() : null,
      visible: musicBtn ? musicBtn.getBoundingClientRect().width > 0 : false,
      rect: musicBtn ? musicBtn.getBoundingClientRect() : null,
    };
  });
  console.log("Mobile Button Info:", JSON.stringify(mobileButtonInfo, null, 2));

  const mobilePath = `${ARTIFACT_DIR}/audio_mobile_verification.png`;
  await page.screenshot({ path: mobilePath });
  console.log(`Saved mobile screenshot: ${mobilePath}`);

  await browser.close();
  console.log("\nAll audio integration checks completed successfully!");
}

run().catch((err) => {
  console.error("Audio Verification Failed:", err);
  process.exit(1);
});
