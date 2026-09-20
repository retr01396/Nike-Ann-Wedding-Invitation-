import puppeteer from "puppeteer-core";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const BASE_URL = "http://localhost:3000";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function profileScenario(page, scenarioName, actionFn, durationMs = 3000) {
  console.log(`\n--- Profiling: ${scenarioName} ---`);

  // Start FPS sampler in browser context
  await page.evaluate(() => {
    window.__frameTimes = [];
    let lastTime = performance.now();
    window.__fpsRecording = true;
    function record(now) {
      if (!window.__fpsRecording) return;
      const delta = now - lastTime;
      lastTime = now;
      window.__frameTimes.push(delta);
      requestAnimationFrame(record);
    }
    requestAnimationFrame(record);
  });

  const startTime = Date.now();
  if (actionFn) {
    await actionFn();
  }

  const remaining = durationMs - (Date.now() - startTime);
  if (remaining > 0) {
    await sleep(remaining);
  }

  // Stop FPS sampler and calculate metrics
  const results = await page.evaluate(() => {
    window.__fpsRecording = false;
    const times = window.__frameTimes.slice(1); // skip first delta
    if (times.length === 0) return { count: 0 };

    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgFrameTime = totalTime / times.length;
    const avgFps = 1000 / avgFrameTime;
    
    // Sort for percentiles
    const sorted = [...times].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const max = sorted[sorted.length - 1];

    // Frame budget calculations
    // 120Hz budget = 8.33ms
    // 60Hz budget = 16.67ms
    const over8ms = times.filter((t) => t > 8.33).length;
    const over16ms = times.filter((t) => t > 16.67).length;
    const over33ms = times.filter((t) => t > 33.33).length; // jank (>30fps drop)

    return {
      frames: times.length,
      avgFps: Math.round(avgFps * 10) / 10,
      avgFrameTime: Math.round(avgFrameTime * 100) / 100,
      p50: Math.round(p50 * 100) / 100,
      p95: Math.round(p95 * 100) / 100,
      max: Math.round(max * 100) / 100,
      pctOver8ms: Math.round((over8ms / times.length) * 1000) / 10,
      pctOver16ms: Math.round((over16ms / times.length) * 1000) / 10,
      jankCountOver33ms: over33ms,
    };
  });

  const cdpMetrics = await page.metrics();

  console.log(`Results for ${scenarioName}:`);
  console.log(`  Frames sampled: ${results.frames}`);
  console.log(`  Average FPS: ${results.avgFps}`);
  console.log(`  Average Frame Time: ${results.avgFrameTime} ms`);
  console.log(`  p50 Frame Time: ${results.p50} ms | p95: ${results.p95} ms | Max: ${results.max} ms`);
  console.log(`  Frames > 8.33ms (exceeding 120Hz): ${results.pctOver8ms}%`);
  console.log(`  Frames > 16.67ms (exceeding 60Hz): ${results.pctOver16ms}%`);
  console.log(`  Jank frames (>33.33ms): ${results.jankCountOver33ms}`);
  console.log(`  JS Heap Used: ${Math.round((cdpMetrics.JSHeapUsedSize / (1024 * 1024)) * 10) / 10} MB`);

  return { scenario: scenarioName, ...results, cdpMetrics };
}

async function run() {
  console.log("=================================================");
  console.log("PERFORMANCE PROFILER: 120Hz / 60Hz AUDIT");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: "new",
    userDataDir: "/tmp/brave_perf_profile",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--enable-gpu-rasterization",
      "--enable-zero-copy",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });
  await sleep(600);
  await page.click("body"); // dismiss monogram intro
  await sleep(1000);

  // DOM & CSS audits
  const domAudit = await page.evaluate(() => {
    const totalElements = document.querySelectorAll("*").length;
    let backdropFilterCount = 0;
    let filterBlurCount = 0;
    let willChangeCount = 0;

    document.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.backdropFilter && style.backdropFilter !== "none") backdropFilterCount++;
      if (style.filter && style.filter.includes("blur")) filterBlurCount++;
      if (style.willChange && style.willChange !== "auto") willChangeCount++;
    });

    return { totalElements, backdropFilterCount, filterBlurCount, willChangeCount };
  });

  console.log("\nDOM & CSS Analysis:");
  console.log(`  Total DOM Nodes: ${domAudit.totalElements}`);
  console.log(`  Backdrop-filter elements: ${domAudit.backdropFilterCount}`);
  console.log(`  Blur filter elements: ${domAudit.filterBlurCount}`);
  console.log(`  will-change elements: ${domAudit.willChangeCount}`);

  // Scenario 1: Hero Idle (WebGL running, background loops)
  const heroIdle = await profileScenario(page, "Hero Idle (Initial WebGL + Background)", null, 3000);

  // Scenario 2: Envelope Opening & Emergence
  const envelopeOpen = await profileScenario(
    page,
    "Envelope Opening & Physical Card Emergence",
    async () => {
      const seal = await page.$("#seal-stamp");
      if (seal) await seal.click();
    },
    4500
  );

  // Scenario 3: Smooth Scrolling through Our Story
  const storyScroll = await profileScenario(
    page,
    "Scrolling Through Our Story Section",
    async () => {
      await page.evaluate(async () => {
        const distance = 1200;
        const steps = 60;
        const stepDist = distance / steps;
        for (let i = 0; i < steps; i++) {
          window.scrollBy(0, stepDist);
          await new Promise((r) => setTimeout(r, 16));
        }
      });
    },
    2000
  );

  // Scenario 4: Smooth Scrolling through Glass Panels (Events, RSVP, Directions)
  const panelsScroll = await profileScenario(
    page,
    "Scrolling Through Glass Panels (Events, RSVP, Directions)",
    async () => {
      await page.evaluate(async () => {
        const distance = 1400;
        const steps = 70;
        const stepDist = distance / steps;
        for (let i = 0; i < steps; i++) {
          window.scrollBy(0, stepDist);
          await new Promise((r) => setTimeout(r, 16));
        }
      });
    },
    2500
  );

  await browser.close();

  console.log("\n=================================================");
  console.log("PROFILING AUDIT COMPLETE");
  console.log("=================================================");
}

run().catch((err) => {
  console.error("Profiler Error:", err);
  process.exit(1);
});
