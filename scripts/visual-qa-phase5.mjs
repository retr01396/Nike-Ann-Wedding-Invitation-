import puppeteer from "puppeteer-core";
import path from "path";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPhase5VisualQA() {
  console.log("=== Launching Phase 5 Visual QA (RSVP + Accommodation / Stay Flow) ===");
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
  await sleep(3500);

  // Scroll to RSVP Section
  console.log("Scrolling to RSVP Section...");
  await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    if (rsvp) rsvp.scrollIntoView({ behavior: "smooth" });
  });
  await sleep(1500);

  console.log("Capturing qa_p5_01_rsvp_intro_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_01_rsvp_intro_390.png") });

  // Center on RSVP Form
  console.log("Centering RSVP Form...");
  await page.evaluate(() => {
    const form = document.getElementById("rsvp-form");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  await sleep(1000);

  console.log("Capturing qa_p5_02_rsvp_form_initial_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_02_rsvp_form_initial_390.png") });

  // ========================================================
  // TEST FLOW A: DECLINE FLOW
  // ========================================================
  console.log("\nTesting Flow A: Decline Flow...");
  await page.type("#rsvp-name", "Thomas Matthew");

  // Select "NO, I'M SORRY I CAN'T"
  await page.evaluate(() => {
    const radios = document.querySelectorAll('button[role="radio"]');
    for (const r of radios) {
      if (r.textContent.includes("SORRY I CAN'T")) {
        r.click();
        break;
      }
    }
  });
  await sleep(600);

  // Enter note
  await page.type("#rsvp-message", "Wishing you both a lifetime of happiness! Sending all our love and blessings.");
  await sleep(500);

  console.log("Capturing qa_p5_03_rsvp_decline_flow_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_03_rsvp_decline_flow_390.png") });

  // Submit Decline
  console.log("Submitting decline response...");
  await page.click('button[type="submit"]');
  await sleep(1500);

  console.log("Capturing qa_p5_04_rsvp_declined_confirmed_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_04_rsvp_declined_confirmed_390.png") });

  // Test Re-edit Button
  console.log("Testing Edit Response button...");
  await page.evaluate(() => {
    const editBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Edit Your Response")
    );
    if (editBtn) editBtn.click();
  });
  await sleep(800);

  // ========================================================
  // TEST FLOW B: ACCEPT FLOW WITH ACCOMMODATION
  // ========================================================
  console.log("\nTesting Flow B: Accept Flow with Accommodation...");
  // Clear and update name
  await page.evaluate(() => {
    const nameInput = document.getElementById("rsvp-name");
    if (nameInput) {
      nameInput.value = "";
      nameInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await sleep(200);
  await page.type("#rsvp-name", "David & Rebecca Varghese");

  // Select "YES, I'LL BE THERE"
  await page.evaluate(() => {
    const radios = document.querySelectorAll('button[role="radio"]');
    for (const r of radios) {
      if (r.textContent.includes("YES, I'LL BE THERE")) {
        r.click();
        break;
      }
    }
  });
  await sleep(600);

  // Increase guest count to 2
  await page.evaluate(() => {
    const incBtn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label") === "Increase guest count"
    );
    if (incBtn) incBtn.click();
  });
  await sleep(400);

  // Select Dietary: Kerala Sadhya
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const sadhyaBtn = buttons.find((b) => b.textContent.includes("Traditional Kerala Sadhya"));
    if (sadhyaBtn) sadhyaBtn.click();
  });
  await sleep(400);

  // Select Accommodation: YES
  await page.evaluate(() => {
    const radios = document.querySelectorAll('button[role="radio"]');
    for (const r of radios) {
      if (r.textContent.includes("ACCOMMODATION NEEDED")) {
        r.click();
        break;
      }
    }
  });
  await sleep(800);

  // Fill Accommodation Fields
  console.log("Filling phone and accommodation details...");
  await page.evaluate(() => {
    function setReactInput(input, value) {
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      const lastValue = input.value;
      if (setter) {
        setter.call(input, value);
      } else {
        input.value = value;
      }
      const tracker = input._valueTracker;
      if (tracker) tracker.setValue(lastValue);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const phoneInput = document.getElementById("rsvp-phone");
    setReactInput(phoneInput, "+91 98450 12345");
  });
  await sleep(400);

  console.log("Testing Date Validation Error (Departure earlier than arrival)...");
  // Set invalid dates: Arrival 2026-11-16, Departure 2026-11-14
  await page.evaluate(() => {
    function setReactInput(input, value) {
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      const lastValue = input.value;
      if (setter) {
        setter.call(input, value);
      } else {
        input.value = value;
      }
      const tracker = input._valueTracker;
      if (tracker) tracker.setValue(lastValue);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const arrival = document.getElementById("rsvp-arrival-date");
    const departure = document.getElementById("rsvp-departure-date");
    setReactInput(arrival, "2026-11-16");
    setReactInput(departure, "2026-11-14");
  });
  await sleep(400);

  // Attempt submit to trigger date validation error
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await sleep(600);

  // Scroll to date fields to clearly capture the error
  await page.evaluate(() => {
    const arrival = document.getElementById("rsvp-arrival-date");
    if (arrival) arrival.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  await sleep(600);

  console.log("Capturing qa_p5_06_rsvp_date_validation_error_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_06_rsvp_date_validation_error_390.png") });

  // Fix dates: Arrival 2026-11-14, Departure 2026-11-16
  console.log("Fixing dates to valid sequence...");
  await page.evaluate(() => {
    function setReactInput(input, value) {
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      const lastValue = input.value;
      if (setter) {
        setter.call(input, value);
      } else {
        input.value = value;
      }
      const tracker = input._valueTracker;
      if (tracker) tracker.setValue(lastValue);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const arrival = document.getElementById("rsvp-arrival-date");
    const departure = document.getElementById("rsvp-departure-date");
    setReactInput(arrival, "2026-11-14");
    setReactInput(departure, "2026-11-16");
  });
  await sleep(400);

  // Select Transportation: Airport pickup
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const airportBtn = buttons.find((b) => b.textContent.includes("Airport pickup"));
    if (airportBtn) airportBtn.click();
  });
  await sleep(400);

  console.log("Capturing qa_p5_05_rsvp_accommodation_expanded_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_05_rsvp_accommodation_expanded_390.png") });

  // Submit valid RSVP
  console.log("Submitting valid attending + accommodation RSVP...");
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      submitBtn.click();
    }
  });
  await sleep(2000);

  // Scroll to top of confirmation card
  await page.evaluate(() => {
    const confCard = document.getElementById("rsvp-confirmation-card") || document.getElementById("rsvp");
    if (confCard) confCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  await sleep(800);

  console.log("Capturing qa_p5_07_rsvp_accepted_confirmed_390.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_07_rsvp_accepted_confirmed_390.png") });

  // Check 390px Overflow
  const overflow390 = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile 390px Overflow Status:", overflow390.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  // ========================================================
  // 2. MOBILE VIEWPORT (375 x 812 - iPhone SE)
  // ========================================================
  console.log("\n[2/4] Testing Mobile Viewport (375 x 812)...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await sleep(600);

  const overflow375 = await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    if (rsvp) rsvp.scrollIntoView({ behavior: "smooth", block: "start" });
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  await sleep(800);
  console.log("Mobile 375px Overflow Status:", overflow375.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  console.log("Capturing qa_p5_08_mobile_375.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_08_mobile_375.png") });

  // ========================================================
  // 3. MOBILE VIEWPORT (414 x 896 - iPhone Plus/Max)
  // ========================================================
  console.log("\n[3/4] Testing Mobile Viewport (414 x 896)...");
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2 });
  await sleep(600);

  const overflow414 = await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    if (rsvp) rsvp.scrollIntoView({ behavior: "smooth", block: "start" });
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  await sleep(800);
  console.log("Mobile 414px Overflow Status:", overflow414.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  console.log("Capturing qa_p5_09_mobile_414.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_09_mobile_414.png") });

  // ========================================================
  // 4. DESKTOP VIEWPORT (1280 x 800)
  // ========================================================
  console.log("\n[4/4] Testing Desktop Viewport (1280 x 800)...");
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await sleep(800);

  await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    if (rsvp) rsvp.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  await sleep(1000);

  console.log("Capturing qa_p5_10_desktop_rsvp.png...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "qa_p5_10_desktop_rsvp.png") });

  const overflow1280 = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Desktop 1280px Overflow Status:", overflow1280.hasHorizontalOverflow ? "FAIL (OVERFLOW)" : "PASS (NO OVERFLOW)");

  // ========================================================
  // VERIFY ALL 5 PHASES INTEGRITY
  // ========================================================
  console.log("\nVerifying integrity of all phases...");
  const phaseIntegrity = await page.evaluate(() => {
    const envelope = document.querySelector("main");
    const story = document.getElementById("our-story");
    const events = document.getElementById("wedding-events");
    const travel = document.getElementById("travel");
    const rsvp = document.getElementById("rsvp");
    return {
      hasEnvelope: !!envelope,
      hasStory: !!story,
      hasEvents: !!events,
      hasTravel: !!travel,
      hasRSVP: !!rsvp,
    };
  });
  console.log("Phase Integrity Check (Phases 1-5):", phaseIntegrity);

  console.log("\n=== Visual QA Summary ===");
  console.log("Console errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Console error details:", consoleErrors);
  }

  await browser.close();
  console.log("\nVisual QA complete! All Phase 5 screenshots saved to artifact directory.");
}

runPhase5VisualQA().catch((err) => {
  console.error("Visual QA script failed:", err);
  process.exit(1);
});
