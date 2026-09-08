import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function pass(label, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(600);
  const home = page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Home" });
  await page.screenshot({
    path: `/workspace/screenshots/hdr2-${label}-a-closed.png`,
    clip: { x: 0, y: 0, width: viewport.width, height: 160 },
  });

  await home.click();
  await page.waitForTimeout(500);
  const open1 = await page.evaluate(() => {
    const panel = document.querySelector('[class*="z-[200]"], .fixed.inset-x-0');
    const r = panel?.getBoundingClientRect();
    const first = document.querySelector('a[href^="/world/"]');
    const globeCanvas = document.querySelector(".globe-ball canvas");
    const g = globeCanvas?.getBoundingClientRect();
    return {
      panel: r && { y: r.y, h: r.h ?? r.height, w: r.width, top: r.top },
      first: first && { text: first.textContent.trim(), y: first.getBoundingClientRect().y },
      globeY: g && { y: g.y, z: getComputedStyle(globeCanvas).zIndex },
      headerH: document.querySelector("header")?.getBoundingClientRect().height,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      countryCount: document.querySelectorAll('a[href^="/world/"]').length,
    };
  });
  await page.screenshot({ path: `/workspace/screenshots/hdr2-${label}-b-home1.png` });

  await home.click();
  await page.waitForTimeout(300);
  const closed = await page.locator('a[href^="/world/"]').count();

  await home.click();
  await page.waitForTimeout(500);
  const open2count = await page.locator('a[href^="/world/"]').count();
  await page.screenshot({ path: `/workspace/screenshots/hdr2-${label}-c-home2.png` });

  const community = page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Community" });
  await community.click();
  await page.waitForTimeout(400);
  const jamLink = await page.getByRole("link", { name: /jams/i }).count();
  await page.screenshot({
    path: `/workspace/screenshots/hdr2-${label}-d-community.png`,
    clip: { x: 0, y: 0, width: viewport.width, height: 280 },
  });

  console.log(JSON.stringify({ label, open1, closed, open2count, jamLink, errors }, null, 2));
  await page.close();
}

await pass("desk", { width: 1280, height: 800 });
await pass("phone", { width: 390, height: 844 });
await browser.close();
