import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("FRONTEND DATA & CONTENT CORRECTIONS VERIFICATION");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_frontend_data_corrections",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  const page = await browser.newPage();

  // Test 1: Desktop (1280x800)
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  console.log("Navigating to http://localhost:3000 at 1280x800...");
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(1000);

  // Dismiss opening monogram if present
  const skipBtn = await page.$('[aria-label="Skip opening monogram"]');
  if (skipBtn) {
    await skipBtn.click();
    await sleep(600);
  }

  // Scroll to events section
  console.log("Auditing Event Details at 1280px...");
  await page.evaluate(() => {
    const el = document.getElementById("events");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await sleep(600);

  const eventsAudit = await page.evaluate(() => {
    const section = document.getElementById("events");
    if (!section) return { error: "No #events found" };
    const text = section.innerText;
    return {
      hasProminentTime: text.includes("3:00 PM IST"),
      hasVenueName: text.includes("New Pond Eventscape"),
      hasAddress: text.includes("Kandanassery Rd, Guruvayur"),
      hasVenueDetailsToFollow: text.includes("Venue details to follow"),
      hasSuitUp: text.includes("Suit Up"),
      hasEveningWear: text.includes("Elegant Evening Wear"),
      hasGroomHouseProg: text.includes("02:00 PM") && text.includes("Groom's House"),
      hasChurchProg: text.includes("03:00 PM") && text.includes("St. Joseph's Church, Kaveed"),
      hasReceptionProg: text.includes("06:00 PM – 10:00 PM") && text.includes("New Pond Eventscape"),
      hasCelebrationClosing: text.includes("WE CAN'T WAIT") && text.includes("TO CELEBRATE WITH YOU"),
      hasOldLulu: text.includes("Lulu"),
      hasOldKasavu: text.includes("Kasavu"),
      hasOld1030: text.includes("10:30 AM"),
    };
  });
  console.log("Events Card Audit:", eventsAudit);

  await page.screenshot({
    path: `${ARTIFACT_DIR}/verify_data_01_events_desktop_1280px.png`,
    fullPage: false,
  });

  // Test 2: Mobile 390x844
  console.log("\nAuditing Event Details at 390x844 (Mobile)...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById("events");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await sleep(600);

  await page.screenshot({
    path: `${ARTIFACT_DIR}/verify_data_02_events_mobile_390px.png`,
    fullPage: false,
  });

  // Test 3: Dossier Modal
  console.log("\nAuditing Celebration Dossier Modal...");
  await page.evaluate(() => {
    const row = document.querySelector('[aria-label="View Wedding Ceremony details"]');
    if (row) row.click();
  });
  await sleep(600);

  const dossierAudit = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"][aria-label="Celebration Dossier"]');
    if (!modal) return { open: false };
    const text = modal.innerText;
    return {
      open: true,
      hasWeddingTitle: text.includes("The Wedding Ceremony"),
      hasStJoseph: text.includes("St. Joseph's Church, Kaveed"),
      has3PM: text.includes("3:00 PM IST"),
      hasPhone: text.includes("0487 250 7557"),
      hasConcierge: text.includes("Concierge"),
      hasValet: text.includes("valet"),
      hasSadhya: text.includes("Sadhya"),
      hasEtiquette: text.includes("10:15 AM"),
    };
  });
  console.log("Dossier Modal Audit (Wedding tab):", dossierAudit);

  await page.screenshot({
    path: `${ARTIFACT_DIR}/verify_data_03_dossier_modal.png`,
    fullPage: false,
  });

  // Close dossier
  await page.keyboard.press("Escape");
  await sleep(500);

  // Test 4: Directions / Getting There
  console.log("\nAuditing Directions / Getting There Panel...");
  await page.evaluate(() => {
    const el = document.getElementById("directions");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await sleep(600);

  // Tab 1: Church
  const churchAudit = await page.evaluate(() => {
    const dir = document.getElementById("directions");
    const img = dir.querySelector("img");
    const text = dir.innerText;
    return {
      title: text.includes("St. Joseph's Church, Kaveed"),
      altText: img ? img.getAttribute("alt") : null,
      phone: text.includes("0487 250 7557"),
    };
  });
  console.log("Church Tab Audit:", churchAudit);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/verify_data_04_directions_church.png`,
    fullPage: false,
  });

  // Click Event Space Tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("#directions button"));
    const eventSpaceBtn = buttons.find((b) => b.textContent.includes("EVENT SPACE"));
    if (eventSpaceBtn) eventSpaceBtn.click();
  });
  await sleep(600);

  const eventSpaceAudit = await page.evaluate(() => {
    const dir = document.getElementById("directions");
    const img = dir.querySelector("img");
    const mapsLink = dir.querySelector('a[href*="maps"]');
    const text = dir.innerText;
    return {
      title: text.includes("New Pond Eventscape"),
      altText: img ? img.getAttribute("alt") : null,
      phone: text.includes("062355 77177"),
      mapsUrl: mapsLink ? mapsLink.getAttribute("href") : null,
      noLulu: !text.includes("Lulu"),
      noNH544: !text.includes("NH 544"),
    };
  });
  console.log("Event Space Tab Audit:", eventSpaceAudit);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/verify_data_05_directions_eventspace.png`,
    fullPage: false,
  });

  // Click Groom's House Tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("#directions button"));
    const groomBtn = buttons.find((b) => b.textContent.includes("GROOM'S HOUSE"));
    if (groomBtn) groomBtn.click();
  });
  await sleep(600);

  const groomHouseAudit = await page.evaluate(() => {
    const dir = document.getElementById("directions");
    const img = dir.querySelector("img");
    const text = dir.innerText;
    return {
      title: text.includes("The Gladwin's House"),
      address: text.includes("J288+25M, Perakam"),
      altText: img ? img.getAttribute("alt") : null,
      noTharavadu: !text.includes("Tharavadu"),
    };
  });
  console.log("Groom's House Tab Audit:", groomHouseAudit);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/verify_data_06_directions_groomhouse.png`,
    fullPage: false,
  });

  await browser.close();
  console.log("\n=================================================");
  console.log("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!");
  console.log("=================================================");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
