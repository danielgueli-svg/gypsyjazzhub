import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

mkdirSync("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function run(name, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/workspace/screenshots/hdr-${name}-1-closed.png`, clip: { x: 0, y: 0, width: viewport.width, height: Math.min(220, viewport.height) } });

  const home = page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Home" });
  const homeCount = await home.count();
  let homeBox = null;
  if (homeCount) {
    homeBox = await home.boundingBox();
    await home.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `/workspace/screenshots/hdr-${name}-2-home-open.png` });
    const links = await page.locator('a[href^="/world/"]').count();
    const globe = await page.getByRole("link", { name: /Globe|Countries/i }).count();
    await home.click();
    await page.waitForTimeout(300);
    const linksAfterClose = await page.locator('header a[href^="/world/"]').count();
    await home.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `/workspace/screenshots/hdr-${name}-3-home-open-again.png` });
    const nl = page.locator('a[href="/world/netherlands"]');
    const nlCount = await nl.count();
    if (nlCount) await nl.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/workspace/screenshots/hdr-${name}-4-after-nl.png`, clip: { x: 0, y: 0, width: viewport.width, height: Math.min(280, viewport.height) } });
    console.log(JSON.stringify({ name, homeCount, homeBox, linksOpen: links, globe, linksAfterClose, nlCount, url: page.url(), errors }, null, 2));
  } else {
    // mobile hamburger
    const burger = page.getByRole("button", { name: /Menu|menu/i });
    const burgerCount = await burger.count();
    if (burgerCount) {
      await burger.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `/workspace/screenshots/hdr-${name}-2-sheet.png` });
    }
    const navHome = page.getByRole("navigation", { name: "Main" });
    console.log(JSON.stringify({ name, homeCount, burgerCount, navVisible: await navHome.count(), errors, url: page.url() }, null, 2));
    await page.screenshot({ path: `/workspace/screenshots/hdr-${name}-1b-full.png` });
  }
  await page.close();
}

await run("desk", { width: 1280, height: 800 });
await run("phone", { width: 390, height: 844 });
await browser.close();
