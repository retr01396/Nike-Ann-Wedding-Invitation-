import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=== Starting Fluid Silk & RSVP Accommodation QA ===");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_profile_fluid_rsvp",
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
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[Browser error] ${msg.text()}`);
  });

  // -------------------------------------------------------------
  // TEST 1: HERO FLUID ANIMATION IN MOTION (DESKTOP 1440x900)
  // -------------------------------------------------------------
  console.log("\n[Test 1] Testing Hero Fluid Silk Background Motion...");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(600);
  await page.click("body"); // dismiss intro audio dialog
  await sleep(1000);

  // Check canvas presence and WebGL support
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return { found: false };
    const rect = canvas.getBoundingClientRect();
    return {
      found: true,
      width: canvas.width,
      height: canvas.height,
      styleWidth: rect.width,
      styleHeight: rect.height,
      hasContext: !!(canvas.getContext("webgl") || canvas.getContext("2d")),
    };
  });
  console.log("Canvas diagnostics:", canvasInfo);

  // Take 3 sequential frames 1 second apart to prove motion
  console.log("Capturing sequential frames of fluid motion...");
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fluid_frame_0s.png` });
  await sleep(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fluid_frame_1s.png` });
  await sleep(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fluid_frame_2s.png` });

  // Measure pixel changes on canvas across 1.2 seconds to numerically prove live motion
  const pixelDiffRatio = await page.evaluate(async () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return { error: "No canvas found" };
    const sample1 = canvas.toDataURL("image/png");
    await new Promise((r) => setTimeout(r, 1200));
    const sample2 = canvas.toDataURL("image/png");
    return {
      sample1Length: sample1.length,
      sample2Length: sample2.length,
      isChanging: sample1 !== sample2,
    };
  });
  console.log("Fluid animation active & changing pixels:", pixelDiffRatio);

  // -------------------------------------------------------------
  // TEST 2: ENVELOPE OPENING & CARD EMERGENCE WITH FLUID BACKDROP
  // -------------------------------------------------------------
  console.log("\n[Test 2] Testing Envelope Opening with Fluid Backdrop...");
  const seal = await page.$("#seal-stamp, button[aria-label*='wax seal' i], button[aria-label*='Open' i]");
  if (seal) {
    await seal.click();
    console.log("Clicked wax seal...");
  }
  await sleep(1200);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fluid_envelope_opening.png` });
  await sleep(2000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fluid_envelope_opened.png` });

  // -------------------------------------------------------------
  // TEST 3: RSVP ACCOMMODATION INTERACTION
  // -------------------------------------------------------------
  console.log("\n[Test 3] Testing RSVP Accommodation Flow...");
  await page.evaluate(() => {
    const rsvpSec = document.getElementById("rsvp");
    if (rsvpSec) rsvpSec.scrollIntoView({ behavior: "instant" });
  });
  await sleep(800);

  // Fill in Name
  await page.waitForSelector("#rsvp-name");
  await page.type("#rsvp-name", "Lady Penelope Featherington");
  console.log("Typed name in #rsvp-name");

  // Open Attendance Dropdown and Select "Yes, I'll be attending"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const attendDropdown = buttons.find((b) => b.textContent?.includes("Will you be attending?") || b.textContent?.includes("attending"));
    if (attendDropdown) attendDropdown.click();
  });
  await sleep(400);

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const yesOption = buttons.find((b) => b.textContent?.includes("Yes, I'll be attending"));
    if (yesOption) yesOption.click();
  });
  await sleep(500);

  // Check if accommodation question is rendered
  const stayQuestionRendered = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return bodyText.includes("ARE YOU STAYING FOR THE WEDDING?");
  });
  console.log("Accommodation question visible:", stayQuestionRendered);

  // Click "NO, I WON'T BE STAYING"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const noStayBtn = buttons.find((b) => b.textContent?.includes("NO, I WON'T BE STAYING"));
    if (noStayBtn) noStayBtn.click();
  });
  await sleep(400);

  const fieldsHiddenWhenNo = await page.evaluate(() => {
    const stayNameInput = document.getElementById("rsvp-stay-guest-name");
    const container = stayNameInput ? stayNameInput.closest("[aria-hidden]") : null;
    return !stayNameInput || container?.getAttribute("aria-hidden") === "true";
  });
  console.log("Accommodation fields hidden when staying=NO:", fieldsHiddenWhenNo);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_rsvp_stay_no.png` });

  // Click "YES, I'LL BE STAYING"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const yesStayBtn = buttons.find((b) => b.textContent?.includes("YES, I'LL BE STAYING"));
    if (yesStayBtn) yesStayBtn.click();
  });
  await sleep(600);

  const fieldsVisibleWhenYes = await page.evaluate(() => {
    return {
      hasStayName: !!document.getElementById("rsvp-stay-guest-name"),
      hasPhone: !!document.getElementById("rsvp-phone"),
      hasArrivalDate: !!document.getElementById("rsvp-arrival-date"),
      hasDepartureDate: !!document.getElementById("rsvp-departure-date"),
    };
  });
  console.log("Accommodation fields when staying=YES:", fieldsVisibleWhenYes);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_rsvp_stay_yes_expanded.png` });

  // Correctly fill React controlled form fields
  console.log("Filling accommodation details via React input handlers...");
  await page.evaluate(() => {
    const setInputValue = (el, value) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      nativeInputValueSetter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const setTextareaValue = (el, value) => {
      const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      ).set;
      nativeTextareaValueSetter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const arrivalInput = document.getElementById("rsvp-arrival-date");
    if (arrivalInput) setInputValue(arrivalInput, "2026-11-20");

    const departureInput = document.getElementById("rsvp-departure-date");
    if (departureInput) setInputValue(departureInput, "2026-11-22");

    const phoneInput = document.getElementById("rsvp-phone");
    if (phoneInput) setInputValue(phoneInput, "+1 555-019-2834");

    const stayNameInput = document.getElementById("rsvp-stay-guest-name");
    if (stayNameInput) setInputValue(stayNameInput, "Lady Penelope Featherington");

    const messageInput = document.getElementById("rsvp-message");
    if (messageInput) setTextareaValue(messageInput, "Delighted to celebrate your sacred union!");
  });

  await sleep(500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_rsvp_form_filled.png` });

  // Submit RSVP Form
  console.log("Submitting RSVP form...");
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("SEND RSVP"));
    if (submitBtn) submitBtn.click();
  });

  await sleep(2500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/qa_rsvp_submitted.png` });

  const submissionState = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return {
      successMsg: bodyText.includes("THANK YOU") || bodyText.includes("CONFIRMED") || bodyText.includes("RECORDED") || bodyText.includes("CELEBRATING WITH US") || bodyText.includes("WE CAN'T WAIT"),
      hasConfirmationComponent: !!document.getElementById("rsvp-confirmation") || !!document.querySelector("[aria-label*='confirmation' i]"),
    };
  });
  console.log("RSVP Submission Result:", submissionState);

  // -------------------------------------------------------------
  // TEST 4: RESPONSIVE VIEWPORTS CHECK
  // -------------------------------------------------------------
  const VIEWPORTS = [
    { name: "mobile_390", width: 390, height: 844 },
    { name: "tablet_768", width: 768, height: 1024 },
    { name: "desktop_1280", width: 1280, height: 800 },
  ];

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name}...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });
    await sleep(600);
    await page.click("body");
    await sleep(1000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/qa_fluid_${vp.name}_hero.png` });
  }

  await browser.close();
  console.log("\n=== Fluid Silk & RSVP Accommodation QA Complete! ===");
}

run().catch((err) => {
  console.error("QA Error:", err);
  process.exit(1);
});
