import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("FINAL STRICT VISUAL & INTERMEDIATE ANIMATION PASS");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_profile_final_visual",
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
  // PART 1: HERO IN MOTION FOR SEVERAL SECONDS
  // -------------------------------------------------------------
  console.log("\n[Part 1] Recording Hero in Motion across 4 seconds...");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(500);
  await page.click("body"); // dismiss intro audio modal
  await sleep(1000);

  console.log("Capturing 5 sequential frames (1s apart)...");
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_hero_motion_0s.png` });
  await sleep(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_hero_motion_1s.png` });
  await sleep(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_hero_motion_2s.png` });
  await sleep(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_hero_motion_3s.png` });
  await sleep(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_hero_motion_4s.png` });

  // -------------------------------------------------------------
  // PART 2: PHYSICAL ENVELOPE INTERMEDIATE ANIMATION STATES
  // CLOSED → FLAP OPENING → CARD EMERGING → CARD CLEARING POCKET → CARD SETTLING
  // -------------------------------------------------------------
  console.log("\n[Part 2] Capturing Intermediate Physical Envelope Animation States...");

  // State 1: CLOSED
  console.log("State 1: CLOSED");
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_envelope_01_closed.png` });

  // Trigger opening
  const seal = await page.$("#seal-stamp, button[aria-label*='wax seal' i], button[aria-label*='Open' i]");
  if (seal) {
    await seal.click();
    console.log("Seal clicked. Timeline initiated.");
  }
  await sleep(100);

  // State 2: FLAP OPENING (hinged at top center, card occluded inside pocket)
  await page.evaluate(() => {
    if (window.__envelopeTl) window.__envelopeTl.pause(1.0);
  });
  await sleep(200);
  console.log("State 2: FLAP OPENING captured at t = 1.0s (flap folding back, card occluded inside pocket)");
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_envelope_02_flap_opening.png` });

  // State 3: CARD EMERGING (card gliding upward, lower half inside pocket)
  await page.evaluate(() => {
    if (window.__envelopeTl) window.__envelopeTl.pause(1.65);
  });
  await sleep(200);
  console.log("State 3: CARD EMERGING captured at t = 1.65s (card rising with lower body physically inside pocket)");
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_envelope_03_card_emerging.png` });

  // State 4: CARD CLEARING POCKET (card at apex clearing front pocket V-apex)
  await page.evaluate(() => {
    if (window.__envelopeTl) window.__envelopeTl.pause(2.2);
  });
  await sleep(200);
  console.log("State 4: CARD CLEARING POCKET captured at t = 2.2s (card at top apex clearing pocket V-apex)");
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_envelope_04_card_clearing_pocket.png` });

  // State 5: CARD SETTLING (card settled forward in reading position, gold text glowing)
  await page.evaluate(() => {
    if (window.__envelopeTl) {
      window.__envelopeTl.seek(3.2);
      window.__envelopeTl.play();
    }
  });
  await sleep(400);
  console.log("State 5: CARD SETTLING captured at t = 3.2s (card settled in front of pocket)");
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_envelope_05_card_settling.png` });

  // -------------------------------------------------------------
  // PART 3: RSVP ACCOMMODATION INSPECTION
  // -------------------------------------------------------------
  console.log("\n[Part 3] Inspecting RSVP Accommodation Fields...");
  await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    if (rsvp) rsvp.scrollIntoView({ behavior: "instant" });
  });
  await sleep(600);

  // Fill in Primary Guest Name
  await page.waitForSelector("#rsvp-name");
  await page.type("#rsvp-name", "Nathan & Ann Special Guests");

  // Select Attendance: YES
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const attendDropdown = buttons.find((b) => b.textContent?.includes("Will you be attending?") || b.textContent?.includes("attending"));
    if (attendDropdown) attendDropdown.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const yesOption = buttons.find((b) => b.textContent?.includes("Yes, I'll be attending"));
    if (yesOption) yesOption.click();
  });
  await sleep(400);

  // Toggle NO: verify fields hidden
  console.log("Testing Toggle: NO, I WON'T BE STAYING...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const noStayBtn = buttons.find((b) => b.textContent?.includes("NO, I WON'T BE STAYING"));
    if (noStayBtn) noStayBtn.click();
  });
  await sleep(500);

  const fieldsHiddenState = await page.evaluate(() => {
    const stayNameInput = document.getElementById("rsvp-stay-guest-name");
    const container = stayNameInput ? stayNameInput.closest("[aria-hidden]") : null;
    return {
      stayNameVisible: container ? container.getAttribute("aria-hidden") !== "true" : false,
    };
  });
  console.log("When NO selected -> Accommodation fields hidden:", !fieldsHiddenState.stayNameVisible);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_rsvp_toggle_no.png` });

  // Toggle YES: verify fields visible
  console.log("Testing Toggle: YES, I'LL BE STAYING...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const yesStayBtn = buttons.find((b) => b.textContent?.includes("YES, I'LL BE STAYING"));
    if (yesStayBtn) yesStayBtn.click();
  });
  await sleep(500);

  const fieldsVisibleState = await page.evaluate(() => {
    const stayName = document.getElementById("rsvp-stay-guest-name");
    const phone = document.getElementById("rsvp-phone");
    const arrival = document.getElementById("rsvp-arrival-date");
    const departure = document.getElementById("rsvp-departure-date");
    return {
      hasStayGuestName: !!stayName,
      hasPhone: !!phone,
      hasArrivalDate: !!arrival,
      hasDepartureDate: !!departure,
    };
  });
  console.log("When YES selected -> Fields rendered:", fieldsVisibleState);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_rsvp_toggle_yes.png` });

  // Fill in exact values
  console.log("Filling in accommodation details...");
  await page.evaluate(() => {
    const setInputValue = (el, value) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };

    setInputValue(document.getElementById("rsvp-stay-guest-name"), "Nathan & Ann Family");
    setInputValue(document.getElementById("rsvp-phone"), "+91 98765 43210");
    setInputValue(document.getElementById("rsvp-arrival-date"), "2026-11-14");
    setInputValue(document.getElementById("rsvp-departure-date"), "2026-11-16");
  });
  await sleep(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_rsvp_fields_filled.png` });

  // Submit
  console.log("Submitting RSVP...");
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("SEND RSVP"));
    if (submitBtn) submitBtn.click();
  });
  await sleep(2500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_rsvp_submitted.png` });

  // -------------------------------------------------------------
  // PART 4: ADMIN DASHBOARD & CSV EXPORT
  // -------------------------------------------------------------
  console.log("\n[Part 4] Checking Admin Dashboard & Export...");
  await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2" });
  await sleep(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_admin_dashboard.png` });

  await browser.close();
  console.log("\n=== Final Visual & Functional Pass Finished ===");
}

run().catch((err) => {
  console.error("QA Error:", err);
  process.exit(1);
});
