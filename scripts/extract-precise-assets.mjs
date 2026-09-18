import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const REF_IMAGE_PATH = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3/.user_uploaded/media_1789668277783.jpg";

async function extract() {
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-web-security"],
  });

  const page = await browser.newPage();
  const imgBase64 = fs.readFileSync(REF_IMAGE_PATH).toString("base64");
  const imgSrc = `data:image/jpeg;base64,${imgBase64}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:black;">
        <canvas id="c"></canvas>
      </body>
    </html>
  `);

  const crops = [
    // Top hero left floral & velvet
    { name: "hero/hero-floral-left.jpg", x: 0, y: 0, w: 200, h: 320 },
    // Top hero right floral, plate & diamond
    { name: "hero/hero-floral-right.jpg", x: 480, y: 0, w: 202, h: 320 },
    // Full hero velvet backdrop (0 to 320)
    { name: "hero/hero-velvet-full.jpg", x: 0, y: 0, w: 682, h: 320 },
    // Wax seal
    { name: "envelope/wax-seal-crisp.jpg", x: 305, y: 165, w: 72, h: 72 },
    // Closed envelope body
    { name: "envelope/closed-envelope.jpg", x: 180, y: 75, w: 322, h: 225 },
    // Opened envelope card complete
    { name: "envelope/opened-card-complete.jpg", x: 206, y: 320, w: 270, h: 290 },
    // Opened envelope with back flap and card area
    { name: "envelope/opened-envelope-scene.jpg", x: 125, y: 310, w: 430, h: 305 },
    // Card corner floral top right
    { name: "envelope/card-floral-top-right.jpg", x: 355, y: 315, w: 121, h: 90 },
    // Card floral bottom left
    { name: "envelope/card-floral-bottom-left.jpg", x: 206, y: 480, w: 85, h: 130 },
    // Right quote panel
    { name: "envelope/quote-panel.jpg", x: 570, y: 440, w: 85, h: 125 },
    // Story hands ring
    { name: "story/hands-ring-crisp.jpg", x: 266, y: 652, w: 195, h: 148 },
    // Story right floral script
    { name: "story/story-right-floral-crisp.jpg", x: 462, y: 652, w: 220, h: 148 },
    // Story left floral edge
    { name: "story/story-left-floral.jpg", x: 0, y: 652, w: 100, h: 148 },
    // Travel map
    { name: "travel/editorial-map-crisp.jpg", x: 462, y: 835, w: 148, h: 76 },
    // Events left floral
    { name: "events/events-floral-left.jpg", x: 0, y: 800, w: 75, h: 165 },
    // Lower right crystal
    { name: "floral/crystal-gem.jpg", x: 620, y: 750, w: 62, h: 55 },
  ];

  for (const crop of crops) {
    const dataUrl = await page.evaluate(
      ({ src, x, y, w, h }) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.getElementById("c");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.95));
          };
          img.src = src;
        });
      },
      { src: imgSrc, ...crop }
    );

    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
    const outPath = path.join("/Users/ret_ice0/Documents/Nike-Ann Wedding/public/images/wedding", crop.name);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, Buffer.from(base64Data, "base64"));
    console.log(`Extracted: ${crop.name} (${crop.w}x${crop.h})`);
  }

  await browser.close();
  console.log("All assets extracted successfully!");
}

extract().catch(console.error);
