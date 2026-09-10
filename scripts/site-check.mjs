#!/usr/bin/env node
/**
 * Smoke the hub: pages return 200, catalogs are not empty, globe markup is there.
 *
 *   node scripts/site-check.mjs
 *   node scripts/site-check.mjs --base https://www.gypsyjazzhub.com
 *   node scripts/site-check.mjs --base http://127.0.0.1:8080 --globe
 *
 * Exit 1 on any failed check. Used after every push (npm run site-check)
 * and in GitHub Actions against live.
 */
const args = process.argv.slice(2);
const baseFlag = args.find((a) => a.startsWith("--base=")) ?? args[args.indexOf("--base") + 1];
const BASE = (typeof baseFlag === "string" && !baseFlag.startsWith("--")
  ? baseFlag
  : process.env.SITE_CHECK_BASE || "http://127.0.0.1:8080"
).replace(/\/$/, "");
const WANT_GLOBE = args.includes("--globe") || process.env.SITE_CHECK_GLOBE === "1";
const retries = Number(process.env.SITE_CHECK_RETRIES || (BASE.includes("gypsyjazzhub.com") ? 6 : 1));
const retryMs = Number(process.env.SITE_CHECK_RETRY_MS || 20000);

const MIN_MUSICIANS = 200;
const MIN_JAM_COUNTRIES = 5;
const MIN_CONCERT_NIGHTS = 20;

function fail(msg) {
  console.error("FAIL", msg);
  process.exitCode = 1;
}

function ok(msg) {
  console.log("OK  ", msg);
}

async function fetchText(path) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "gypsyjazzhub-site-check/1" },
  });
  const text = await res.text();
  return { url, status: res.status, text, final: res.url };
}

function countNeedle(html, needle) {
  return html.split(needle).length - 1;
}

function musicianCount(html) {
  const m =
    html.match(/>(\d+)<!-- --> <!-- -->musicians/) ||
    html.match(/>(\d+)\s+musicians</) ||
    html.match(/(\d+)\s+musicians/);
  return m ? Number(m[1]) : null;
}

function concertNights(html) {
  const m =
    html.match(/>(\d+)<!-- --> <!-- -->nights/) ||
    html.match(/>(\d+)\s+nights</) ||
    html.match(/(\d+)\s+nights/);
  return m ? Number(m[1]) : null;
}

async function checkOnce() {
  process.exitCode = 0;
  console.log(`SITE CHECK ${BASE}`);

  const home = await fetchText("/");
  if (home.status !== 200) fail(`home ${home.status}`);
  if (/DEPLOYMENT_NOT_FOUND|This page is not on the setlist/i.test(home.text)) {
    fail("home is an error / missing-deploy page");
  }
  if (!/Gypsy Jazz Hub/.test(home.text)) fail("home missing title");
  if (!/globe-ball/.test(home.text)) fail("home missing globe markup");
  if (!/globe-country-pick|Choose your country/.test(home.text)) {
    fail("home missing country picker");
  }
  if (/Spin the globe\. Click a country/.test(home.text)) {
    fail("hero still says Spin the globe");
  }
  ok("home 200 + globe markup");

  const favicon = await fetch(`${BASE}/favicon.ico`, {
    redirect: "follow",
    headers: { "user-agent": "gypsyjazzhub-site-check/1" },
  });
  if (favicon.status !== 200) fail(`favicon.ico ${favicon.status}`);
  else ok("favicon.ico 200");

  const musicians = await fetchText("/musicians");
  if (musicians.status !== 200) fail(`musicians ${musicians.status}`);
  if (/No musicians match those filters/.test(musicians.text)) {
    fail("musician directory empty state");
  }
  const nMus = musicianCount(musicians.text);
  if (nMus == null) fail("could not read musician count");
  else if (nMus < MIN_MUSICIANS) fail(`only ${nMus} musicians (need ≥ ${MIN_MUSICIANS})`);
  else ok(`${nMus} musicians`);
  if (!/Stochelo Rosenberg/.test(musicians.text)) fail("Stochelo missing from directory");
  else ok("Stochelo in directory");

  const stochelo = await fetchText("/musicians/stochelo-rosenberg");
  if (stochelo.status !== 200) fail(`stochelo ${stochelo.status}`);
  if (/not on the setlist/i.test(stochelo.text)) fail("stochelo 404 setlist page");
  if (!/Stochelo Rosenberg/.test(stochelo.text)) fail("stochelo profile has no name");
  else ok("stochelo profile 200");

  let playersOk = true;
  for (const slug of ["adrien-moignard", "bireli-lagrene", "nuno-marinho"]) {
    const page = await fetchText(`/musicians/${slug}`);
    if (page.status !== 200 || /not on the setlist/i.test(page.text)) {
      fail(`/musicians/${slug} ${page.status}`);
      playersOk = false;
    }
  }
  if (playersOk) ok("living-player URLs 200");

  const jams = await fetchText("/jams");
  if (jams.status !== 200) fail(`jams ${jams.status}`);
  const jamCountries = ["Netherlands", "France", "Germany", "United States", "Belgium"].filter((c) =>
    jams.text.includes(c),
  );
  if (jamCountries.length < MIN_JAM_COUNTRIES) {
    fail(`jams countries ${jamCountries.join(",") || "none"}`);
  } else ok(`jams countries ${jamCountries.join(", ")}`);

  const concerts = await fetchText("/concerts");
  if (concerts.status !== 200) fail(`concerts ${concerts.status}`);
  const nights = concertNights(concerts.text);
  if (nights != null && nights < MIN_CONCERT_NIGHTS) fail(`only ${nights} concert nights`);
  else if (nights != null) ok(`${nights} concert nights`);
  if (/No upcoming concerts/.test(concerts.text) && (nights == null || nights === 0)) {
    fail("concerts empty");
  }

  const nl = await fetchText("/world/netherlands");
  if (nl.status !== 200) fail(`netherlands ${nl.status}`);
  else if (/No players on file yet/.test(nl.text)) fail("Netherlands has no players");
  else if (!/Stochelo|Rosenberg|Schäfer|Schafer/.test(nl.text)) {
    fail("Netherlands players missing family names");
  } else ok("Netherlands country page has players");

  const history = await fetchText("/history");
  if (history.status !== 200) fail(`history ${history.status}`);
  if (!/Origins and the long road/.test(history.text)) fail("history missing Story essay");
  else ok("history Story present");

  const news = await fetchText("/news");
  if (news.status !== 200) fail(`news ${news.status}`);
  const newsHits = countNeedle(news.text, "news.item") + countNeedle(news.text, "Latest news");
  if (!/La Pompe|Shrewsbury|Moignard|Paris Guitar/.test(news.text)) {
    fail("news has none of the expected stories");
  } else ok("news stories present");
  if (newsHits < 0) fail("news empty");

  const learn = await fetchText("/learn");
  if (learn.status !== 200) fail(`learn ${learn.status}`);
  if (!/Van Hemert|Denis Chang|Rosenberg Academy/.test(learn.text)) {
    fail("learn missing schools");
  } else ok("learn schools present");

  const festivals = await fetchText("/festivals");
  if (festivals.status !== 200) fail(`festivals ${festivals.status}`);
  if (!/Django Reinhardt/.test(festivals.text)) fail("festivals missing Samois");
  else ok("festivals 200");

  const groups = await fetchText("/groups");
  if (groups.status !== 200) fail(`groups ${groups.status}`);
  if (!/Rosenberg Trio/.test(groups.text)) fail("groups missing Rosenberg Trio");
  else ok("groups 200");

  if (WANT_GLOBE) {
    try {
      const { chromium } = await import("playwright");
      const browser = await chromium.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(1200);
      const canvas = page.locator(".globe-ball canvas");
      if ((await canvas.count()) === 0) fail("globe canvas missing in browser");
      else {
        const sample1 = await page.evaluate(() => {
          const c = document.querySelector(".globe-ball canvas");
          const ctx = c.getContext("2d");
          return [...ctx.getImageData(Math.floor(c.width * 0.45), Math.floor(c.height * 0.45), 1, 1).data];
        });
        await page.waitForTimeout(1600);
        const sample2 = await page.evaluate(() => {
          const c = document.querySelector(".globe-ball canvas");
          const ctx = c.getContext("2d");
          return [...ctx.getImageData(Math.floor(c.width * 0.45), Math.floor(c.height * 0.45), 1, 1).data];
        });
        const spun = sample1.some((v, i) => v !== sample2[i]);
        if (!spun) fail("globe is not spinning");
        else ok("globe spinning");
      }
      await browser.close();
    } catch (err) {
      fail(`globe browser check: ${err.message}`);
    }
  }

  return process.exitCode === 0;
}

let passed = false;
for (let i = 1; i <= retries; i += 1) {
  if (i > 1) {
    console.log(`retry ${i}/${retries} in ${retryMs}ms…`);
    await new Promise((r) => setTimeout(r, retryMs));
  }
  passed = await checkOnce();
  if (passed) break;
  if (i < retries) process.exitCode = 0;
}

if (!passed) {
  console.error("SITE CHECK FAILED");
  if (BASE.includes("gypsyjazzhub.com")) {
    console.error("Live is still empty or stale. Publish / Redeploy Production, then re-run:");
    console.error("  npm run site-check:live");
  }
  process.exit(1);
}
console.log("SITE CHECK OK");
