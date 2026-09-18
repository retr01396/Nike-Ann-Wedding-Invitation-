import puppeteer from "puppeteer-core";
import fs from "fs";

const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const REF_IMAGE_PATH = "/Users/ret_ice0/.gemini/antigravity/brain/b5bb09f6-b28a-45e0-a21b-4841e8143df3/.user_uploaded/media_1789668277783.jpg";

async function cleanHeroRight() {
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    userDataDir: "/tmp/brave_clean_hero_right",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
    ],
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

  const dataUrl = await page.evaluate(
    ({ src }) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.getElementById("c");
          canvas.width = 185;
          canvas.height = 320;
          const ctx = canvas.getContext("2d");
          
          ctx.drawImage(img, 497, 0, 185, 320, 0, 0, 185, 320);
          
          const grad = ctx.createLinearGradient(0, 0, 0, 48);
          grad.addColorStop(0, "#0d0205");
          grad.addColorStop(0.7, "#120307");
          grad.addColorStop(1, "rgba(18, 3, 7, 0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 185, 48);
          
          resolve(canvas.toDataURL("image/jpeg", 0.95));
        };
        img.src = src;
      });
    },
    { src: imgSrc }
  );

  const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
  const outPath = "/Users/ret_ice0/Documents/Nike-Ann Wedding/public/images/wedding/hero/hero-bg-right.jpg";
  fs.writeFileSync(outPath, Buffer.from(base64Data, "base64"));
  console.log("hero-bg-right.jpg cleaned successfully without baked-in lock/text!");

  await browser.close();
}

cleanHeroRight().catch(console.error);
