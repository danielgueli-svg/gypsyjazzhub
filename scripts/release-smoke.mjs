import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8080";
const routes = [
  "/",
  "/jams",
  "/concerts",
  "/musicians",
  "/groups",
  "/festivals",
  "/history",
  "/news",
  "/learn",
  "/world",
  "/world/france",
  "/world/united-kingdom",
  "/musicians/gaga-weiss",
  "/musicians/adrien-moignard",
  "/news/shrewsbury-django-fest-2026",
  "/board",
  "/instruments",
];

function fail(msg, extra) {
  console.error("FAIL", msg, extra ?? "");
  process.exitCode = 1;
}

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];

async function newPage(viewport) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (e) => errors.push(`${page.url()} ${e.message}`));
  return page;
}

const desktop = await newPage({ width: 1280, height: 900 });
await desktop.goto(BASE + "/", { waitUntil: "networkidle", timeout: 45000 });
await desktop.waitForTimeout(1200);

const globe = await desktop.evaluate(() => {
  const canvas = document.querySelector(".globe-ball canvas");
  const ball = document.querySelector(".globe-ball");
  const select = document.querySelector("#globe-country-pick");
  if (!canvas || !ball) return { missing: true };
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const img = ctx.getImageData(0, 0, w, h).data;
  let gold = 0, wood = 0, blue = 0;
  for (let i = 0; i < img.length; i += 16) {
    const r = img[i], g = img[i + 1], b = img[i + 2];
    if (r > 180 && g > 140 && b < 120) gold++;
    else if (r > 70 && r < 160 && g > 40 && g < 110 && b < 80) wood++;
    else if (b > r && b > g) blue++;
  }
  const overlay = (() => {
    const r = canvas.getBoundingClientRect();
    const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return el ? { tag: el.tagName, cls: el.className?.toString?.().slice(0, 80) } : null;
  })();
  return {
    w, h,
    css: canvas.getBoundingClientRect(),
    ball: ball.getBoundingClientRect(),
    gold, wood, blue,
    select: select ? select.options.length : 0,
    overlay,
    title: document.title,
  };
});
console.log("GLOBE", JSON.stringify(globe, null, 2));
if (globe.missing) fail("globe canvas missing");
if (!globe.gold && !globe.wood) fail("globe has no land pixels");
if ((globe.select ?? 0) < 10) fail("country select too small", globe.select);
if (globe.overlay && globe.overlay.tag !== "CANVAS") fail("canvas covered", globe.overlay);

const sample1 = await desktop.evaluate(() => {
  const c = document.querySelector(".globe-ball canvas");
  const ctx = c.getContext("2d");
  return [...ctx.getImageData(Math.floor(c.width * 0.45), Math.floor(c.height * 0.45), 1, 1).data];
});
await desktop.waitForTimeout(1600);
const sample2 = await desktop.evaluate(() => {
  const c = document.querySelector(".globe-ball canvas");
  const ctx = c.getContext("2d");
  return [...ctx.getImageData(Math.floor(c.width * 0.45), Math.floor(c.height * 0.45), 1, 1).data];
});
const spun = sample1.some((v, i) => v !== sample2[i]);
console.log("SPIN", { sample1, sample2, spun });
if (!spun) fail("globe is not spinning");

await desktop.locator(".globe-ball canvas").scrollIntoViewIfNeeded();
const box = await desktop.locator(".globe-ball canvas").boundingBox();
await desktop.mouse.click(box.x + box.width * 0.52, box.y + box.height * 0.45);
await desktop.waitForTimeout(900);
console.log("CLICK_URL", desktop.url());
if (!desktop.url().includes("/world/")) fail("globe click did not open a country", desktop.url());

await desktop.goto(BASE + "/", { waitUntil: "networkidle", timeout: 45000 });
await desktop.waitForTimeout(400);
await desktop.selectOption("#globe-country-pick", "france");
await desktop.waitForTimeout(800);
console.log("SELECT_URL", desktop.url());
if (!desktop.url().includes("/world/france")) fail("country select did not open France", desktop.url());

const routeResults = [];
for (const path of routes) {
  const res = await desktop.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
  const status = res?.status() ?? 0;
  const body = await desktop.locator("body").innerText().catch(() => "");
  const bad = status >= 400 || /not on the setlist|something went wrong/i.test(body);
  routeResults.push({ path, status, bad, len: body.length });
  if (bad || status !== 200) fail(`route ${path}`, { status, snippet: body.slice(0, 120) });
}
console.log("ROUTES", routeResults.map((r) => `${r.path} ${r.status} ${r.len}`).join("\n"));

const mobile = await newPage({ width: 390, height: 844 });
await mobile.goto(BASE + "/", { waitUntil: "networkidle", timeout: 45000 });
await mobile.waitForTimeout(800);
await mobile.locator(".globe-ball").scrollIntoViewIfNeeded();
const mGlobe = await mobile.evaluate(() => {
  const c = document.querySelector(".globe-ball canvas");
  const s = document.querySelector("#globe-country-pick");
  if (!c) return { missing: true };
  const r = c.getBoundingClientRect();
  return { w: r.width, h: r.height, select: Boolean(s), options: s?.options.length ?? 0 };
});
console.log("MOBILE_GLOBE", mGlobe);
if (mGlobe.missing || mGlobe.w < 160) fail("mobile globe too small", mGlobe);
if (!mGlobe.select) fail("mobile country select missing");
await mobile.screenshot({ path: "/workspace/screenshots/release-mobile.png", fullPage: false });
await desktop.screenshot({ path: "/workspace/screenshots/release-desktop.png" });

console.log("PAGEERRORS", errors);
if (errors.length) fail("page errors", errors);

await browser.close();
if (process.exitCode) {
  console.log("RELEASE SMOKE FAILED");
} else {
  console.log("RELEASE SMOKE OK");
}
