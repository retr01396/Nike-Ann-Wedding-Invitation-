import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(2500);
  await page.click("body");
  await sleep(1200);

  // 1. Background layer presence & opacity
  const bg = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    const loaded = imgs.filter((i) => i.complete && i.naturalWidth > 0).length;
    const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
    const wash = document.querySelector('img[src*="hero-backdrop-clean"]');
    const blend = wash ? getComputedStyle(wash.parentElement).mixBlendMode : "none";
    return { total: imgs.length, loaded, broken, washBlend: blend };
  });
  console.log("Images:", bg.total, "loaded:", bg.loaded, "wash blend:", bg.washBlend);
  if (bg.broken.length) console.log("BROKEN IMAGES:", bg.broken);

  // 2. Floral wash coverage (should span ~full viewport, not just edges)
  const washBox = await page.evaluate(() => {
    const el = document.querySelector('img[src*="hero-backdrop-clean"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  console.log("Floral wash element size:", washBox, "(expect ~viewport 1280x900+ w)");

  // 3. Story timeline structural checks
  await page.evaluate(() => {
    const el = document.getElementById("our-story");
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" });
  });
  await sleep(1200);
  const story = await page.evaluate(() => {
    const section = document.getElementById("our-story");
    const rows = section.querySelectorAll("li").length;
    const circles = section.querySelectorAll(".rounded-full img").length;
    const drawnLine = section.querySelector('div[style*="scaleY"]') !== null;
    const header = section.querySelector("h2")?.textContent || "";
    return { rows, circles, drawnLine, header };
  });
  console.log("Story:", JSON.stringify(story));

  // 4. RSVP glass panel checks
  await page.evaluate(() => {
    const el = document.getElementById("rsvp");
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "instant" });
  });
  await sleep(900);
  const glass = await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    const blur = rsvp.querySelector(".backdrop-blur-2xl") !== null;
    const computed = rsvp.querySelector(".backdrop-blur-2xl")
      ? getComputedStyle(rsvp.querySelector(".backdrop-blur-2xl")).backdropFilter
      : "none";
    const inputs = rsvp.querySelectorAll("input").length;
    const nameField = document.getElementById("rsvp-name");
    const nameStyle = nameField ? getComputedStyle(nameField) : null;
    return {
      blurLayer: blur,
      backdropFilter: computed,
      inputCount: inputs,
      nameBg: nameStyle ? nameStyle.backgroundColor : "n/a",
      nameRadius: nameStyle ? nameStyle.borderRadius : "n/a",
    };
  });
  console.log("RSVP glass:", JSON.stringify(glass));

  // 5. RSVP interaction sanity: fill & stepper
  await page.type("#rsvp-name", "QA Tester");
  await page.evaluate(() => {
    const rsvp = document.getElementById("rsvp");
    const btns = Array.from(rsvp.querySelectorAll("button"));
    const inc = btns.find((b) => b.querySelector("svg.lucide-plus"));
    if (inc) inc.click();
  });
  await sleep(300);
  const guestCount = await page.evaluate(() => {
    const span = Array.from(document.querySelectorAll("#rsvp span")).find((s) =>
      /^\d+$/.test(s.textContent.trim())
    );
    return span ? span.textContent.trim() : "n/a";
  });
  console.log("Guest stepper incremented to:", guestCount);

  console.log("\nConsole errors:", errors.length === 0 ? "NONE" : errors.slice(0, 5));
  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
