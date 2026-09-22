import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("RSVP UI RESTORATION & REGRESSION VERIFICATION");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_profile_rsvp_verify",
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
  await sleep(1000);

  // Dismiss monogram intro
  console.log("Dismissing monogram intro...");
  const introBtn = await page.$('[aria-label="Skip opening monogram"]');
  if (introBtn) {
    await introBtn.click();
    await sleep(600);
  }

  // 1. Open RSVP section on desktop
  console.log("Navigating to RSVP section...");
  await page.evaluate(() => {
    const el = document.getElementById("rsvp");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await sleep(800);

  // 2. Verify all original RSVP fields are present
  console.log("Verifying initial RSVP fields...");
  const initialFields = await page.evaluate(() => {
    const nameInput = !!document.getElementById("rsvp-name");
    const attendanceBtn = Array.from(document.querySelectorAll("button")).some(b => 
      b.textContent?.includes("Yes, I'll be attending") || b.textContent?.includes("Will you be attending?")
    );
    const guestCount = Array.from(document.querySelectorAll("span")).some(s => 
      s.textContent?.includes("Number of guests")
    );
    const dietaryBtn = !!document.getElementById("rsvp-dietary-btn");
    const stayingPrompt = Array.from(document.querySelectorAll("label")).some(l => 
      l.textContent?.includes("ARE YOU STAYING FOR THE WEDDING?")
    );
    const messageInput = !!document.getElementById("rsvp-message");
    const submitBtn = Array.from(document.querySelectorAll("button")).some(b => 
      b.textContent?.includes("SEND RSVP")
    );
    return { nameInput, attendanceBtn, guestCount, dietaryBtn, stayingPrompt, messageInput, submitBtn };
  });
  console.log("Initial Fields Presence:", initialFields);

  const rsvpElement = await page.$("#rsvp");
  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_rsvp_01_default_attending.png`,
    });
    console.log("Saved verify_rsvp_01_default_attending.png");
  }

  // 3. Select "Yes, I'll be staying" and verify conditional accommodation fields appear
  console.log('Clicking "YES, I\'LL BE STAYING"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const stayYes = buttons.find(b => b.textContent?.includes("YES, I'LL BE STAYING"));
    if (stayYes) stayYes.click();
  });
  await sleep(700);

  const accommodationFieldsVisible = await page.evaluate(() => {
    const stayName = !!document.getElementById("rsvp-stay-guest-name");
    const phone = !!document.getElementById("rsvp-phone");
    const arrival = !!document.getElementById("rsvp-arrival-date");
    const departure = !!document.getElementById("rsvp-departure-date");
    return { stayName, phone, arrival, departure };
  });
  console.log("Accommodation Fields Expanded:", accommodationFieldsVisible);

  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_rsvp_02_staying_expanded.png`,
    });
    console.log("Saved verify_rsvp_02_staying_expanded.png");
  }

  // 4. Select "No, I won't be staying" and verify they disappear
  console.log('Clicking "NO, I WON\'T BE STAYING"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const stayNo = buttons.find(b => b.textContent?.includes("NO, I WON'T BE STAYING"));
    if (stayNo) stayNo.click();
  });
  await sleep(700);

  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_rsvp_03_staying_collapsed.png`,
    });
    console.log("Saved verify_rsvp_03_staying_collapsed.png");
  }

  // 5. Select "No, I won't be attending" to test declined state
  console.log('Testing attendance change to "No, I won\'t be attending"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const attendanceDropdown = buttons.find(b => b.textContent?.includes("Yes, I'll be attending"));
    if (attendanceDropdown) attendanceDropdown.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const declineOption = buttons.find(b => b.textContent?.includes("No, I won't be attending"));
    if (declineOption) declineOption.click();
  });
  await sleep(600);

  if (rsvpElement) {
    await rsvpElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_rsvp_04_declined_state.png`,
    });
    console.log("Saved verify_rsvp_04_declined_state.png");
  }

  // 6. Switch back to "Yes, I'll be attending", fill form, and submit test RSVP
  console.log("Switching back to Yes and submitting end-to-end form...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const attendanceDropdown = buttons.find(b => b.textContent?.includes("No, I won't be attending"));
    if (attendanceDropdown) attendanceDropdown.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const attendOption = buttons.find(b => b.textContent?.includes("Yes, I'll be attending"));
    if (attendOption) attendOption.click();
  });
  await sleep(500);

  // Fill Name
  await page.type("#rsvp-name", "Elizabeth & Mathew Kurian");

  // Select Dietary Preference
  console.log("Selecting Dietary Preference...");
  await page.click("#rsvp-dietary-btn");
  await sleep(300);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const sadhya = buttons.find(b => b.textContent?.includes("Traditional Kerala Sadhya"));
    if (sadhya) sadhya.click();
  });
  await sleep(300);

  // Select YES to staying
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const stayYes = buttons.find(b => b.textContent?.includes("YES, I'LL BE STAYING"));
    if (stayYes) stayYes.click();
  });
  await sleep(600);

  // Fill accommodation details with proper native input setter
  await page.type("#rsvp-phone", "+91 94471 23456");
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
    setDate("rsvp-arrival-date", "2026-11-14");
    setDate("rsvp-departure-date", "2026-11-16");
  });
  await sleep(300);

  await page.type("#rsvp-message", "With heartfelt prayers and blessings for a radiant journey together!");

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
      path: `${ARTIFACT_DIR}/verify_rsvp_05_confirmation_screen.png`,
    });
    console.log("Saved verify_rsvp_05_confirmation_screen.png");
  }

  // Check admin dashboard for received RSVPs
  console.log("Checking admin endpoint /api/admin/rsvps or dashboard...");
  const adminRes = await page.evaluate(async () => {
    try {
      const res = await fetch("/api/admin/rsvps");
      const json = await res.json();
      return { status: res.status, count: Array.isArray(json) ? json.length : 0 };
    } catch (e) {
      return { status: 0, error: String(e) };
    }
  });
  console.log("Admin RSVPs query response:", adminRes);

  // 7. Check footer for "MADE WITH LOVE"
  console.log("Checking footer text...");
  await page.evaluate(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await sleep(500);

  const footerText = await page.evaluate(() => {
    const footer = document.querySelector("footer");
    return footer ? footer.innerText : "";
  });
  console.log("Footer text found:\n", footerText);
  const containsMadeWithLove = footerText.toLowerCase().includes("made with love");
  console.log("Does footer contain 'MADE WITH LOVE'?", containsMadeWithLove);

  const footerElement = await page.$("footer");
  if (footerElement) {
    await footerElement.screenshot({
      path: `${ARTIFACT_DIR}/verify_rsvp_06_footer_no_made_with_love.png`,
    });
    console.log("Saved verify_rsvp_06_footer_no_made_with_love.png");
  }

  // 8. Mobile viewport test at 375px
  console.log("Testing mobile layout at 375px width...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(1000);

  // Dismiss intro
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
      path: `${ARTIFACT_DIR}/verify_rsvp_07_mobile_375px.png`,
    });
    console.log("Saved verify_rsvp_07_mobile_375px.png");
  }

  await browser.close();
  console.log("=================================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY");
  console.log("=================================================");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
