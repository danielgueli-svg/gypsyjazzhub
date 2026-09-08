import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:8080/?v=footer2", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);
await page.evaluate(() => document.querySelector("footer")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(300);
const info = await page.evaluate(() => {
  const footer = document.querySelector("footer");
  const input = footer?.querySelector("input[type=search]");
  const buttons = [...(footer?.querySelectorAll("a,button") ?? [])].slice(0, 8).map((el) => el.textContent?.trim().slice(0, 40));
  const cs = input ? getComputedStyle(input) : null;
  return {
    inputBg: cs?.backgroundColor,
    inputColor: cs?.color,
    buttons,
    footerH: footer?.getBoundingClientRect().height,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "/workspace/screenshots/footer-mobile-start.png" });
await page.evaluate(() => document.querySelector("footer")?.scrollIntoView({ block: "end" }));
await page.waitForTimeout(200);
await page.screenshot({ path: "/workspace/screenshots/footer-mobile-end.png" });
await browser.close();
