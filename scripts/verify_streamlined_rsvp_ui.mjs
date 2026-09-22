import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("STREAMLINED RSVP UI BROWSER VERIFICATION");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_streamlined_rsvp",
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
  await sleep(1200);

  // Dismiss monogram intro
  console.log("Dismissing monogram intro...");
  const introBtn = await page.$('[aria-label="Skip opening monogram"]');
  if (introBtn) {
    await introBtn.click();
    await sleep(600);
  }

  // Navigate to RSVP section
  console.log("Navigating to RSVP section...");
  await page.evaluate(() => {
    const el = document.getElementById("rsvp");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await sleep(800);

  // 1. Verify obsolete fields are ABSENT and core fields are PRESENT
  console.log("Checking field visibility in default state...");
  const fieldAudit = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasDietary = text.includes("Dietary Preference") || !!document.getElementById("rsvp-dietary-btn");
    const hasTransit = text.includes("Transportation Assistance") || text.includes("Airport Pickup");
    const hasSpecialReqs = text.includes("Special Requirements");
    const hasName = !!document.getElementById("rsvp-name");
    const hasAttendance = text.includes("attending") || text.includes("Will you be attending?");
    const hasGuestCount = text.includes("Number of guests");
    const hasStayingPrompt = text.includes("ARE YOU STAYING FOR THE WEDDING?");
    return { hasDietary, hasTransit, hasSpecialReqs, hasName, hasAttendance, hasGuestCount, hasStayingPrompt };
  });

  console.log("Field Audit Results:", fieldAudit);
  if (fieldAudit.hasDietary) throw new Error("REGRESSION: Dietary fields found in RSVP form!");
  if (fieldAudit.hasTransit) throw new Error("REGRESSION: Transportation fields found in RSVP form!");
  if (fieldAudit.hasSpecialReqs) throw new Error("REGRESSION: Special requirements found in RSVP form!");
  if (!fieldAudit.hasName || !fieldAudit.hasAttendance || !fieldAudit.hasStayingPrompt) {
    throw new Error("FAIL: Core RSVP elements are missing!");
  }

  const rsvpElement = await page.$("#rsvp");

  // 2. Expand staying fields
  console.log('Clicking "YES, I\'LL BE STAYING"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const stayYes = buttons.find((b) => b.textContent?.includes("YES, I'LL BE STAYING"));
    if (stayYes) stayYes.click();
  });
  await sleep(600);

  const stayFieldsExpanded = await page.evaluate(() => {
    const stayName = !!document.getElementById("rsvp-stay-guest-name");
    const phone = !!document.getElementById("rsvp-phone");
    const arrival = !!document.getElementById("rsvp-arrival-date");
    const departure = !!document.getElementById("rsvp-departure-date");
    return { stayName, phone, arrival, departure };
  });
  console.log("Stay Fields Expanded Check:", stayFieldsExpanded);
  if (!stayFieldsExpanded.stayName || !stayFieldsExpanded.phone || !stayFieldsExpanded.arrival || !stayFieldsExpanded.departure) {
    throw new Error("FAIL: Accommodation fields did not expand properly!");
  }

  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_streamlined_01_staying_expanded.png`,
    });
    console.log("Saved verify_streamlined_01_staying_expanded.png");
  }

  // 3. Collapse staying fields
  console.log('Clicking "NO, I WON\'T BE STAYING"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const stayNo = buttons.find((b) => b.textContent?.includes("NO") && b.textContent?.includes("STAYING"));
    if (stayNo) stayNo.click();
  });
  await sleep(800);

  const stayFieldsCollapsed = await page.evaluate(() => {
    const el = document.getElementById("rsvp-stay-guest-name");
    if (!el) return true;
    const container = el.closest('[aria-hidden="true"]');
    return !!container;
  });
  console.log("Stay Fields Collapsed Check (aria-hidden=true):", stayFieldsCollapsed);
  if (!stayFieldsCollapsed) throw new Error("FAIL: Accommodation fields did not collapse!");

  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_streamlined_02_staying_collapsed.png`,
    });
    console.log("Saved verify_streamlined_02_staying_collapsed.png");
  }

  // 4. Test Declined State
  console.log('Testing "No, I won\'t be attending"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const attendBtn = buttons.find((b) => b.textContent?.includes("Yes, I'll be attending"));
    if (attendBtn) attendBtn.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const declineBtn = buttons.find((b) => b.textContent?.includes("No, I won't be attending"));
    if (declineBtn) declineBtn.click();
  });
  await sleep(600);

  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_streamlined_03_declined.png`,
    });
    console.log("Saved verify_streamlined_03_declined.png");
  }

  // 5. Submit end-to-end Staying RSVP
  console.log("Switching back to Yes and submitting end-to-end form...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const declineDropdown = buttons.find((b) => b.textContent?.includes("No, I won't be attending"));
    if (declineDropdown) declineDropdown.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const attendOption = buttons.find((b) => b.textContent?.includes("Yes, I'll be attending"));
    if (attendOption) attendOption.click();
  });
  await sleep(500);

  // Fill Name
  await page.type("#rsvp-name", "Dr. Alexander & Sophia Wright");

  // Select Staying YES
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const stayYes = buttons.find((b) => b.textContent?.includes("YES, I'LL BE STAYING"));
    if (stayYes) stayYes.click();
  });
  await sleep(500);

  await page.type("#rsvp-stay-guest-name", "Dr. Alexander Wright");
  await page.type("#rsvp-phone", "+1 212 555 7890");

  await page.evaluate(() => {
    const setDate = (id, val) => {
      const input = document.getElementById(id);
      if (input) {
        const proto = Object.getPrototypeOf(input);
        const desc = Object.getOwnPropertyDescriptor(proto, "value");
        if (desc && desc.set) {
          desc.set.call(input, val);
        } else {
          input.value = val;
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    setDate("rsvp-arrival-date", "2026-11-20");
    setDate("rsvp-departure-date", "2026-11-23");
  });
  await sleep(300);

  await page.type("#rsvp-message", "Eagerly waiting to celebrate your blessed union!");

  // Submit RSVP
  console.log("Submitting RSVP form...");
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });

  // Wait for confirmation
  await sleep(3000);

  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_streamlined_04_confirmation.png`,
    });
    console.log("Saved verify_streamlined_04_confirmation.png");
  }

  // 6. Mobile Layout Test at 375px
  console.log("Testing mobile layout at 375px width...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(1000);

  const mobileIntroBtn = await page.$('[aria-label="Skip opening monogram"]');
  if (mobileIntroBtn) {
    await mobileIntroBtn.click();
    await sleep(600);
  }

  await page.evaluate(() => {
    const el = document.getElementById("rsvp");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await sleep(800);

  const mobileRsvp = await page.$("#rsvp");
  if (mobileRsvp) {
    await mobileRsvp.screenshot({
      path: `${ARTIFACT_DIR}/verify_streamlined_05_mobile_375px.png`,
    });
    console.log("Saved verify_streamlined_05_mobile_375px.png");
  }

  await browser.close();
  console.log("=================================================");
  console.log("BROWSER VERIFICATION COMPLETED SUCCESSFULLY");
  console.log("=================================================");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
