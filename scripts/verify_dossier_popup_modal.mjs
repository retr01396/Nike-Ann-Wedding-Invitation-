import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const ARTIFACT_DIR = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("=================================================");
  console.log("CELEBRATION DOSSIER POP-UP MODAL VERIFICATION");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_test_dossier_popup",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------
    // Test 1: Desktop Viewport (1280x800)
    // -------------------------------------------------------------
    console.log("\n1. Testing Desktop (1280x800)...");
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });
    await sleep(1000);

    // Dismiss opening monogram if present
    const skipBtn = await page.$('[aria-label="Skip opening monogram"]');
    if (skipBtn) {
      await skipBtn.click();
      await sleep(600);
    }

    // Scroll to #events
    await page.evaluate(() => {
      const el = document.getElementById("events");
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    });
    await sleep(500);

    console.log("Page URL:", page.url());
    const bodyInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        hasEvents: !!document.getElementById("events"),
        allIds: Array.from(document.querySelectorAll("[id]")).map((el) => el.id),
        htmlLength: document.body.innerHTML.length,
      };
    });
    console.log("Body diagnostic:", bodyInfo);

    // Click on the wedding ceremony row to open dossier
    console.log("Clicking 'View Wedding Ceremony details'...");
    const clickResult = await page.evaluate(() => {
      const row = document.querySelector('[aria-label="View Wedding Ceremony details"]');
      if (!row) return "row not found";
      row.click();
      return "row clicked";
    });
    console.log("Click result:", clickResult);
    await sleep(1000);

    // Audit the modal placement in DOM
    const desktopModalAudit = await page.evaluate(() => {
      const allModals = Array.from(document.querySelectorAll('[role="dialog"]'));
      console.log("Found dialogs:", allModals.length);
      const modalOverlay = document.querySelector('[role="dialog"][aria-label="Celebration Dossier"]');
      if (!modalOverlay) {
        return {
          open: false,
          dialogCount: allModals.length,
          bodyChildren: Array.from(document.body.children).map(c => c.tagName + '.' + c.className.slice(0, 30)),
        };
      }

      const isDirectChildOfBody = modalOverlay.parentElement === document.body;
      const eventsCard = document.getElementById("events");
      const isInsideEventsCard = eventsCard ? eventsCard.contains(modalOverlay) : false;

      const rect = modalOverlay.getBoundingClientRect();
      const style = window.getComputedStyle(modalOverlay);

      const modalBox = modalOverlay.querySelector('.relative.w-full');
      const boxRect = modalBox ? modalBox.getBoundingClientRect() : null;

      return {
        open: true,
        isDirectChildOfBody,
        isInsideEventsCard,
        zIndex: style.zIndex,
        position: style.position,
        overlayWidth: rect.width,
        overlayHeight: rect.height,
        boxRect: boxRect ? {
          width: Math.round(boxRect.width),
          height: Math.round(boxRect.height),
          top: Math.round(boxRect.top),
          left: Math.round(boxRect.left),
        } : null,
        hasHeaderTitle: modalOverlay.innerText.includes("WEDDING DETAILS & PROTOCOLS"),
        hasCloseBtn: !!modalOverlay.querySelector('button[aria-label="Close celebration dossier"]'),
      };
    });

    console.log("Desktop Modal Placement Audit:", desktopModalAudit);

    if (!desktopModalAudit.isDirectChildOfBody || desktopModalAudit.isInsideEventsCard) {
      throw new Error("FAIL: Modal is not a direct child of document.body or is still inside #events!");
    }

    // Capture desktop modal screenshot
    await page.screenshot({
      path: `${ARTIFACT_DIR}/verify_dossier_popup_desktop.png`,
      fullPage: false,
    });
    console.log("Saved: verify_dossier_popup_desktop.png");

    // Click 'Dress Code' tab
    console.log("Testing tab switching to 'Dress Code'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('[role="dialog"] button'));
      const dressCodeBtn = buttons.find((b) => b.innerText.includes("DRESS CODE"));
      if (dressCodeBtn) dressCodeBtn.click();
    });
    await sleep(400);

    const tabAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return {
        hasAttireGuidelines: modal ? modal.innerText.includes("Attire Guidelines") : false,
        hasGents: modal ? modal.innerText.includes("GENTLEMEN") : false,
        hasLadies: modal ? modal.innerText.includes("LADIES") : false,
      };
    });
    console.log("Tab Audit (Dress Code):", tabAudit);

    await page.screenshot({
      path: `${ARTIFACT_DIR}/verify_dossier_popup_tabs.png`,
      fullPage: false,
    });
    console.log("Saved: verify_dossier_popup_tabs.png");

    // Test close button
    console.log("Testing close button...");
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close celebration dossier"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(400);

    const afterCloseAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-label="Celebration Dossier"]');
      return { isOpen: !!modal };
    });
    console.log("After close button clicked - Modal isOpen:", afterCloseAudit.isOpen);

    if (afterCloseAudit.isOpen) {
      throw new Error("FAIL: Modal did not close when close button was clicked!");
    }

    // -------------------------------------------------------------
    // Test 2: Mobile Viewport (390x844)
    // -------------------------------------------------------------
    console.log("\n2. Testing Mobile (390x844)...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await sleep(400);

    // Scroll to #events
    await page.evaluate(() => {
      const el = document.getElementById("events");
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    });
    await sleep(500);

    // Click 'View Venue details' row
    console.log("Clicking 'View Venue details' on mobile...");
    const mobileClickResult = await page.evaluate(() => {
      const row = document.querySelector('[aria-label="View Venue details"]');
      if (!row) return "row not found";
      row.click();
      return "row clicked";
    });
    console.log("Mobile click result:", mobileClickResult);
    await sleep(600);

    const mobileModalAudit = await page.evaluate(() => {
      const modalOverlay = document.querySelector('[role="dialog"][aria-label="Celebration Dossier"]');
      if (!modalOverlay) return { open: false };

      const isDirectChildOfBody = modalOverlay.parentElement === document.body;
      const modalBox = modalOverlay.querySelector('.relative.w-full');
      const boxRect = modalBox ? modalBox.getBoundingClientRect() : null;

      // Check for horizontal overflow
      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        open: true,
        isDirectChildOfBody,
        hasHorizontalOverflow,
        boxRect: boxRect ? {
          width: Math.round(boxRect.width),
          height: Math.round(boxRect.height),
          top: Math.round(boxRect.top),
          left: Math.round(boxRect.left),
        } : null,
        hasReceptionTitle: modalOverlay.innerText.includes("Reception & Dinner"),
        hasNewPondEventscape: modalOverlay.innerText.includes("New Pond Eventscape"),
      };
    });

    console.log("Mobile Modal Placement Audit:", mobileModalAudit);

    if (!mobileModalAudit.isDirectChildOfBody) {
      throw new Error("FAIL: Mobile modal is not a direct child of document.body!");
    }
    if (mobileModalAudit.hasHorizontalOverflow) {
      throw new Error("FAIL: Mobile view has horizontal page overflow when modal is open!");
    }

    // Capture mobile screenshot
    await page.screenshot({
      path: `${ARTIFACT_DIR}/verify_dossier_popup_mobile.png`,
      fullPage: false,
    });
    console.log("Saved: verify_dossier_popup_mobile.png");

    // Test Esc key to close
    console.log("Testing ESC key to dismiss modal...");
    await page.keyboard.press("Escape");
    await sleep(400);

    const afterEscAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-label="Celebration Dossier"]');
      return { isOpen: !!modal };
    });
    console.log("After Escape pressed - Modal isOpen:", afterEscAudit.isOpen);

    if (afterEscAudit.isOpen) {
      throw new Error("FAIL: Modal did not dismiss on Escape key!");
    }

    console.log("\n=================================================");
    console.log("ALL CELEBRATION DOSSIER TESTS PASSED SUCCESSFULLY");
    console.log("=================================================");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
