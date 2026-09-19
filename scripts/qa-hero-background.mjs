import puppeteer from "puppeteer-core";
import sharp from "sharp";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-414", width: 414, height: 896 },
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader"],
  });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 800 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(2500);
    // Dismiss the monogram intro overlay so the hero is actually visible
    await page.click("body");
    await sleep(2000);

    const bg = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      const floral = imgs.filter((i) => i.src.includes("floral-hero"));
      const loaded = floral.filter((i) => i.complete && i.naturalWidth > 0);
      const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
      const canvas = document.querySelector("canvas");
      const canvasBlend = canvas ? getComputedStyle(canvas).mixBlendMode : "none";
      const visibleFloral = loaded.filter((i) => {
        const r = i.getBoundingClientRect();
        const cs = getComputedStyle(i);
        return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden";
      });
      return {
        floralCount: floral.length,
        loadedCount: loaded.length,
        visibleCount: visibleFloral.length,
        resolutions: loaded.map((i) => `${i.naturalWidth}x${i.naturalHeight}`),
        currentSrcs: loaded.map((i) => i.currentSrc.split("/url=")[1]?.slice(0, 80) || i.currentSrc),
        broken,
        totalImgs: imgs.length,
        allLoaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
        canvasBlend,
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
      };
    });

    const overflow = bg.scrollW > bg.innerW;
    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
    console.log(
      `floral imgs: ${bg.floralCount} | loaded: ${bg.loadedCount} | visible: ${bg.visibleCount}`
    );
    console.log(`resolutions: ${bg.resolutions.join(", ") || "n/a"}`);
    console.log(`srcs: ${bg.currentSrcs.join(" | ") || "n/a"}`);
    console.log(`silk blend: ${bg.canvasBlend} | all imgs: ${bg.allLoaded}/${bg.totalImgs}`);
    console.log(
      `overflow: ${overflow ? `FAIL (${bg.scrollW} > ${bg.innerW})` : "none"} | page errors: ${errors.length}`
    );
    if (bg.broken.length) console.log("BROKEN:", bg.broken);
    if (errors.length) console.log("ERRORS:", errors.slice(0, 3));

    await page.screenshot({ path: `/tmp/qa-freebuff/hero-${vp.name}.png` });
    await page.close();
  }
  await browser.close();

  // Screenshot richness: confirm the floral artwork renders (not flat black)
  console.log("\n=== screenshot image analysis ===");
  for (const vp of VIEWPORTS) {
    const buf = await sharp(`/tmp/qa-freebuff/hero-${vp.name}.png`).raw().toBuffer({ resolveWithObject: true });
    const { data } = buf;
    let sum = 0, sum2 = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
      sum2 += data[i] * data[i];
    }
    const mean = sum / data.length;
    const sd = Math.sqrt(sum2 / data.length - mean * mean);
    // Calibration: the reference artwork itself measures mean≈25, sd≈22 —
    // sd>14 with bright peaks means the floral art is rendering.
    console.log(
      `${vp.name}: mean ${mean.toFixed(1)} stddev ${sd.toFixed(1)} ${sd > 14 ? "RICH ✓" : "FLAT ✗"}`
    );
  }
  console.log("\nQA DONE");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
