import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const logs = [];
page.on("console", (m) => logs.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => logs.push(`PAGEERROR: ${e.message}`));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const canvas = document.querySelector(".globe-ball canvas");
  const ball = document.querySelector(".globe-ball");
  if (!canvas || !ball) return { missing: true };
  const r = canvas.getBoundingClientRect();
  const br = ball.getBoundingClientRect();
  const ctx = canvas.getContext("2d");
  let sample = null;
  try {
    const img = ctx.getImageData(Math.floor(canvas.width/2), Math.floor(canvas.height/2), 1, 1).data;
    sample = [...img];
  } catch (e) {
    sample = String(e);
  }
  return {
    canvasW: canvas.width, canvasH: canvas.height,
    css: { w: r.width, h: r.height, x: r.x, y: r.y },
    ball: { w: br.width, h: br.height },
    sample,
    clicker: document.body.innerText.includes("Choose your country"),
  };
});
console.log(JSON.stringify(info, null, 2));
console.log("---LOGS---");
console.log(logs.slice(0, 40).join("\n"));
await page.screenshot({ path: "/workspace/screenshots/globe-now.png" });
// click canvas center
const box = await page.locator(".globe-ball canvas").boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.waitForTimeout(400);
  await page.screenshot({ path: "/workspace/screenshots/globe-hover.png" });
  await page.mouse.down();
  await page.mouse.move(box.x + box.width/2 + 80, box.y + box.height/2, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  await page.screenshot({ path: "/workspace/screenshots/globe-drag.png" });
}
await browser.close();
