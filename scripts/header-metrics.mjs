import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(500);

const metrics = await page.evaluate(() => {
  const header = document.querySelector("header");
  const nav = document.querySelector('nav[aria-label="Main"]');
  const brand = header?.querySelector("a");
  const login = header?.querySelector('a[href="/login"], a[href="/studio"]');
  const items = [...(nav?.children ?? [])].map((el) => {
    const s = getComputedStyle(el);
    return {
      text: el.textContent?.trim().slice(0, 40),
      tag: el.tagName,
      font: s.fontFamily,
      size: s.fontSize,
      weight: s.fontWeight,
      h: el.getBoundingClientRect().height,
      w: el.getBoundingClientRect().width,
      y: el.getBoundingClientRect().y,
    };
  });
  const hs = header ? getComputedStyle(header) : null;
  const ns = nav ? getComputedStyle(nav) : null;
  return {
    headerH: header?.getBoundingClientRect().height,
    headerOverflow: hs && { x: hs.overflowX, y: hs.overflowY, pos: hs.position, z: hs.zIndex },
    navH: nav?.getBoundingClientRect().height,
    navFlex: ns && { wrap: ns.flexWrap, display: ns.display, overflow: ns.overflow, h: ns.height, font: ns.fontFamily, size: ns.fontSize },
    brand: brand && { text: brand.textContent?.trim(), size: getComputedStyle(brand).fontSize, font: getComputedStyle(brand).fontFamily },
    login: login && { text: login.textContent?.trim(), size: getComputedStyle(login).fontSize, h: login.getBoundingClientRect().height, w: login.getBoundingClientRect().width },
    items,
  };
});
console.log("CLOSED", JSON.stringify(metrics, null, 2));

await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Home" }).click();
await page.waitForTimeout(400);
const open = await page.evaluate(() => {
  const header = document.querySelector("header");
  const panel = [...header.querySelectorAll("div")].find((d) => d.querySelector('a[href^="/world/"]'));
  const s = panel ? getComputedStyle(panel) : null;
  const r = panel?.getBoundingClientRect();
  const firstCountry = panel?.querySelector('a[href^="/world/"]');
  const globe = [...(panel?.querySelectorAll("a") ?? [])].find((a) => a.getAttribute("href") === "/");
  return {
    headerH: header.getBoundingClientRect().height,
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    panel: r && { x: r.x, y: r.y, w: r.width, h: r.height, pos: s.position, bg: s.backgroundColor, z: s.zIndex, opacity: s.opacity },
    globe: globe && globe.getBoundingClientRect().toJSON(),
    firstCountry: firstCountry && { href: firstCountry.getAttribute("href"), box: firstCountry.getBoundingClientRect().toJSON(), text: firstCountry.textContent?.trim() },
  };
});
console.log("OPEN", JSON.stringify(open, null, 2));

const page2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page2.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
await page2.waitForTimeout(400);
await page2.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Home" }).click();
await page2.waitForTimeout(400);
const phone = await page2.evaluate(() => ({
  headerH: document.querySelector("header")?.getBoundingClientRect().height,
  scrollW: document.documentElement.scrollWidth,
  innerW: window.innerWidth,
  navH: document.querySelector('nav[aria-label="Main"]')?.getBoundingClientRect().height,
}));
console.log("PHONE OPEN", JSON.stringify(phone, null, 2));
await page2.screenshot({ path: "/workspace/screenshots/hdr-phone-open-clip.png", clip: { x: 0, y: 0, width: 390, height: 600 } });

await browser.close();
