import puppeteer from "puppeteer-core";
import fs from "fs";

const ARTIFACT_DIR = "/tmp/qa-freebuff";
const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function run() {
  console.log("=== Visual QA: Floral Immersion + Timeline + Glass RSVP ===");
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
      "--use-angle=swiftshader",
    ],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + e.message));

  // ---------- DESKTOP ----------
  console.log("\n[1] Desktop 1280x900");
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(2500);
  await page.click("body"); // dismiss monogram intro
  await sleep(1500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/01-desktop-hero.png` });

  // Open envelope
  const seal = await page.$("#seal-stamp");
  if (seal) {
    await seal.click();
    await sleep(4200);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/02-desktop-envelope-open.png` });

  // Scroll to story
  await page.evaluate(() => {
    const el = document.getElementById("our-story");
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "instant" });
  });
  await sleep(1400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/03-desktop-story-top.png` });

  // Scroll through the timeline to trigger animations
  await page.evaluate(async () => {
    const el = document.getElementById("our-story");
    if (!el) return;
    const start = el.offsetTop;
    const step = (el.offsetHeight) / 10;
    for (let i = 1; i <= 10; i++) {
      window.scrollTo(0, start + step * i);
      await new Promise((r) => setTimeout(r, 220));
    }
  });
  await sleep(900);
  await page.screenshot({ path: `${ARTIFACT_DIR}/04-desktop-story-mid.png` });

  // Lower suite
  await page.evaluate(() => {
    const el = document.getElementById("events-rsvp-travel-suite");
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "instant" });
  });
  await sleep(1200);
  await page.screenshot({ path: `${ARTIFACT_DIR}/05-desktop-suite.png` });

  // ---------- MOBILE ----------
  for (const [w, h, name] of [[375, 812, "375x812"], [390, 844, "390x844"], [414, 896, "414x896"]]) {
    console.log(`\n[M] Mobile ${name}`);
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(2200);
    await page.click("body");
    await sleep(1200);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`  Horizontal overflow: ${overflow}px ${overflow <= 0 ? "PASS" : "FAIL"}`);
    await page.screenshot({ path: `${ARTIFACT_DIR}/m-${w}-hero.png` });

    // hamburger menu test
    const burger = await page.$('button[aria-controls="mobile-nav-drawer"]');
    if (burger) {
      await burger.click();
      await sleep(700);
      await page.screenshot({ path: `${ARTIFACT_DIR}/m-${w}-menu.png` });
      const drawerVisible = await page.evaluate(() => {
        const d = document.getElementById("mobile-nav-drawer");
        return d && d.offsetHeight > 100;
      });
      console.log(`  Hamburger drawer opens: ${drawerVisible ? "PASS" : "FAIL"}`);
      // tap RSVP in drawer
      const rsvpBtn = await page.evaluateHandle(() => {
        const drawer = document.getElementById("mobile-nav-drawer");
        if (!drawer) return null;
        return Array.from(drawer.querySelectorAll("button")).find((b) => b.textContent.includes("RSVP"));
      });
      if (rsvpBtn) {
        await rsvpBtn.click();
        await sleep(1500);
        const rsvpInView = await page.evaluate(() => {
          const el = document.getElementById("rsvp");
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.top < window.innerHeight && r.bottom > 0;
        });
        console.log(`  Drawer RSVP navigation: ${rsvpInView ? "PASS" : "FAIL"}`);
      }
      await page.screenshot({ path: `${ARTIFACT_DIR}/m-${w}-rsvp.png` });
    }

    // story section on mobile
    await page.evaluate(() => {
      const el = document.getElementById("our-story");
      if (el) window.scrollTo({ top: el.offsetTop - 30, behavior: "instant" });
    });
    await sleep(1300);
    const storyOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`  Story overflow: ${storyOverflow}px ${storyOverflow <= 0 ? "PASS" : "FAIL"}`);
    await page.screenshot({ path: `${ARTIFACT_DIR}/m-${w}-story.png` });
  }

  console.log("\n=== Console Errors ===");
  console.log(consoleErrors.length === 0 ? "✓ Zero console errors" : consoleErrors.slice(0, 10));

  await browser.close();
  console.log("=== QA Complete — artifacts in", ARTIFACT_DIR, "===");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
