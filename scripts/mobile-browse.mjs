import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

mkdirSync("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
page.on("pageerror", (err) => console.log("PAGEERROR", String(err)));

const paths = [
  ["home", "/"],
  ["stochelo", "/musicians/stochelo-rosenberg"],
  ["mozes", "/musicians/mozes-rosenberg"],
  ["concerts", "/concerts"],
  ["nl", "/world/netherlands"],
];

for (const [name, path] of paths) {
  await page.goto(`http://127.0.0.1:8080${path}`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(600);
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    watch: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()).filter((t) => /watch/i.test(t)),
    embeds: document.querySelectorAll("iframe").length,
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 80),
  }));
  await page.screenshot({ path: `/workspace/screenshots/m390-${name}-top.png` });
  await page.evaluate(() => window.scrollTo(0, Math.min(900, document.body.scrollHeight)));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `/workspace/screenshots/m390-${name}-mid.png` });
  console.log(JSON.stringify({ name, path, ...overflow }));
}

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
await page.getByRole("button", { name: /Menu|menu/i }).click().catch(() => {});
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/m390-menu.png" });

await browser.close();
