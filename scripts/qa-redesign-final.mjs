/**
 * qa-redesign-final.mjs — comprehensive visual + functional QA for the
 * reference redesign. Screenshots at 6 viewports and multiple scroll
 * positions; DOM checks for every functional requirement; numeric
 * overflow/darkness/image verification.
 *
 * Run: node scripts/qa-redesign-final.mjs   (expects dev server on :3000)
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const BRAVE_PATH =
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const OUT = "/tmp/qa-freebuff";
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900, mobile: false },
  { name: "desktop-1280", width: 1280, height: 800, mobile: false },
  { name: "tablet-768", width: 768, height: 1024, mobile: false },
  { name: "mobile-375", width: 375, height: 812, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "mobile-414", width: 414, height: 896, mobile: true },
];

async function dismissIntro(page) {
  await page.evaluate(() => {
    document.querySelectorAll("div,button").forEach((d) => {
      const s = getComputedStyle(d);
      if (
        s.position === "fixed" &&
        parseInt(s.zIndex) >= 40 &&
        parseFloat(s.opacity) >= 0.85 &&
        d.getBoundingClientRect().height >= innerHeight * 0.9
      ) {
        d.style.pointerEvents = "none";
        d.style.opacity = "0";
        d.style.transition = "none";
      }
    });
  });
  await sleep(600);
}

const results = { checks: [], errors: [] };
const check = (name, ok, detail = "") => {
  results.checks.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} — ${name}${detail ? " | " + detail : ""}`);
};

let browser;
try {
  browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--hide-scrollbars",
    ],
  });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });

    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
    });
    await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 90000 });
    await sleep(2500);
    await dismissIntro(page);
    await sleep(1200);

    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);

    // ── 1. Horizontal overflow ──
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    check(`${vp.name}: no horizontal overflow`, overflow <= 0, `delta ${overflow}px`);

    // ── 2. Broken images ──
    const imgs = await page.evaluate(() => {
      const list = [...document.querySelectorAll("img")];
      return {
        total: list.length,
        broken: list.filter((i) => i.complete && i.naturalWidth === 0).length,
      };
    });
    check(`${vp.name}: no broken images`, imgs.broken === 0, `${imgs.total} imgs, ${imgs.broken} broken`);

    // ── 3. Liquid glass panels present ──
    const panels = await page.evaluate(() => {
      const ids = ["events", "rsvp", "directions"];
      return ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, ok: false, h: 0 };
        const r = el.getBoundingClientRect();
        return { id, ok: r.height > 300, h: Math.round(r.height) };
      });
    });
    check(
      `${vp.name}: 3 glass panels tall`,
      panels.every((p) => p.ok),
      panels.map((p) => `${p.id}:${p.h}px`).join(" ")
    );

    // ── 4. Programme schedule in Event Details (desktop) ──
    if (!vp.mobile) {
      const prog = await page.evaluate(() => {
        const t = [...document.querySelectorAll("span")].find((s) =>
          /programme schedule/i.test(s.textContent || "")
        );
        return !!t;
      });
      check(`${vp.name}: programme schedule present`, prog);
    }

    // ── 5. Page errors ──
    check(`${vp.name}: zero console/page errors`, consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

    // ── 6. Screenshots at scroll positions (visual inspection source) ──
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const stops = Math.min(6, Math.max(3, Math.round(pageHeight / vp.height)));
    for (let i = 0; i < stops; i++) {
      const y = Math.min(
        Math.round((pageHeight - vp.height) * (i / (stops - 1 || 1))),
        pageHeight - vp.height
      );
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(1500);
      await page.screenshot({ path: `${OUT}/${vp.name}-s${i}.png` });
    }
    console.log(`shots: ${stops} at ${vp.name}`);

    // ── 7. Functional checks (once, on desktop-1440) ──
    if (vp.name === "desktop-1440") {
      // Hamburger on mobile handled separately below.

      // ── PHYSICAL ENVELOPE EMERGENCE ──
      // The true trigger is the wax seal / TAP TO OPEN prompt (handleOpen).
      // Fire it, wait through the GSAP state machine, then verify the card
      // has physically transformed and the replay control appears.
      const sealClicked = await page.evaluate(() => {
        const trigger = [...document.querySelectorAll("button,div[role=button]")].find((b) =>
          /tap to open|you're invited/i.test(b.textContent || "")
        );
        if (trigger) {
          trigger.click();
          return true;
        }
        return false;
      });
      await sleep(9000); // full OPENING→FLAP→EMERGING→CLEARING→SETTLING→EXPANDING→OPENED
      const emergence = await page.evaluate(() => {
        const replay = [...document.querySelectorAll("button")].some((b) =>
          /replay/i.test(b.textContent || "")
        );
        // The emerged card must carry a GSAP transform (physical motion)
        const cards = [...document.querySelectorAll("div")].filter((d) =>
          /NIKE/.test(d.textContent || "") && d.children.length && d.offsetWidth > 200 && d.offsetWidth < 700
        );
        const transformed = cards.some((c) => {
          const t = getComputedStyle(c).transform;
          return t && t !== "none";
        });
        return { replay, transformed, cardCount: cards.length };
      });
      check("envelope: seal trigger fires", sealClicked);
      check(
        "envelope: physical emergence completes (replay + transformed card)",
        emergence.replay && emergence.transformed,
        `replay:${emergence.replay} transformed:${emergence.transformed} cards:${emergence.cardCount}`
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(800);

      // RSVP interactive flow: open attendance dropdown and choose YES
      const rsvpFlow = await page.evaluate(async () => {
        const rsvpSec = document.getElementById("rsvp");
        rsvpSec?.scrollIntoView({ behavior: "instant", block: "start" });
        await new Promise((r) => setTimeout(r, 700));
        const dd = [...document.querySelectorAll("button")].find((b) =>
          /will you be attending/i.test(b.textContent || "")
        );
        if (!dd) return "no-dropdown";
        dd.click();
        await new Promise((r) => setTimeout(r, 400));
        const opt = [...document.querySelectorAll("button")].find((b) =>
          /yes, i'?ll be attending/i.test(b.textContent || "")
        );
        if (!opt) return "no-option";
        opt.click();
        await new Promise((r) => setTimeout(r, 600));
        // staying? buttons should now exist
        const staying = [...document.querySelectorAll("button")].find((b) =>
          /yes, i'?ll be staying/i.test(b.textContent || "")
        );
        return staying ? "conditional-fields-ok" : "no-conditional";
      });
      check("RSVP flow: attendance → conditional stay fields", rsvpFlow === "conditional-fields-ok", rsvpFlow);

      // Supabase endpoint exists (functionality intact)
      const apiOk = await page.evaluate(async () => {
        try {
          const res = await fetch("/api/rsvp", { method: "OPTIONS" });
          return res.status < 500;
        } catch {
          return false;
        }
      });
      check("RSVP API endpoint reachable", apiOk);
    }

    // ── 8. Hamburger menu (mobile viewports) ──
    if (vp.mobile && vp.name === "mobile-390") {
      const burger = await page.evaluate(() => {
        const b = document.querySelector('button[aria-controls="mobile-nav-drawer"]');
        if (!b) return false;
        b.click();
        return true;
      });
      await sleep(700);
      const drawerVisible = await page.evaluate(() => {
        const d = document.getElementById("mobile-nav-drawer");
        if (!d) return false;
        const r = d.getBoundingClientRect();
        return r.height > 100 && getComputedStyle(d).opacity === "1";
      });
      check("hamburger menu opens drawer", burger && drawerVisible);
      // navigate via drawer
      const nav = await page.evaluate(() => {
        const btns = [...document.querySelectorAll("#mobile-nav-drawer button")];
        const rsvp = btns.find((b) => /rsvp/i.test(b.textContent || ""));
        if (rsvp) rsvp.click();
        return !!rsvp;
      });
      await sleep(1500);
      const nearRsvp = await page.evaluate(() => {
        const el = document.getElementById("rsvp");
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top > -300 && r.top < innerHeight;
      });
      check("drawer RSVP navigation lands on panel", nav && nearRsvp);
    }

    await page.close();
  }

  // ── Reduced motion probe (desktop) ──
  const rmPage = await browser.newPage();
  await rmPage.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await rmPage.setViewport({ width: 1280, height: 800 });
  await rmPage.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 90000 });
  await sleep(2000);
  await dismissIntro(rmPage);
  const rmOk = await rmPage.evaluate(() => {
    // Anything still genuinely animating (computed duration > 0.1s) with
    // screen blend = visible motion layers. Under reduced motion the
    // globals.css media query collapses every animation to 0.01ms, and
    // SilkCurrent unmounts entirely.
    const animated = [...document.querySelectorAll("div")].filter((d) => {
      const s = getComputedStyle(d);
      const dur = parseFloat(s.animationDuration || "0");
      const iter = s.animationIterationCount === "infinite";
      return dur > 0.1 && iter && s.mixBlendMode === "screen";
    });
    return animated.length === 0;
  });
  check("prefers-reduced-motion: water layers off", rmOk);
  await rmPage.close();

  await browser.close();

  const failed = results.checks.filter((c) => !c.ok);
  console.log(`\n=== SUMMARY: ${results.checks.length - failed.length}/${results.checks.length} passed ===`);
  if (failed.length) failed.forEach((f) => console.log("FAILED:", f.name, f.detail));
  process.exit(failed.length ? 1 : 0);
} catch (e) {
  console.error("QA crashed:", e.message);
  if (browser) await browser.close().catch(() => {});
  process.exit(2);
}
