import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const djangoCopySrc = readFileSync(new URL("../src/lib/django-copy.ts", import.meta.url), "utf8");
const historyCopySrc = readFileSync(new URL("../src/lib/history-copy.ts", import.meta.url), "utf8");
const djangoPage = readFileSync(new URL("../src/routes/django.tsx", import.meta.url), "utf8");
const historyPage = readFileSync(new URL("../src/routes/history.tsx", import.meta.url), "utf8");
const doors = readFileSync(new URL("../src/components/history-doors.tsx", import.meta.url), "utf8");

const LOCALES = [
  "en", "nl", "fr", "de", "es", "pt", "it", "hu", "pl", "cs", "ro",
  "sr", "hr", "ru", "ja", "ko", "zh", "zh-tw", "id", "th", "he",
];

function copiesBlock(src, marker) {
  const start = src.indexOf(marker);
  assert.ok(start >= 0, `missing ${marker}`);
  return src.slice(start);
}

test("django page follows the language switch", () => {
  assert.match(djangoPage, /djangoCopy\(locale\)/);
  assert.match(djangoPage, /copy\.bio\.map/);
  assert.match(djangoPage, /copy\.bioTitle/);
  assert.doesNotMatch(djangoPage, /Jean “Django” Reinhardt was born on 23 January/);
});

test("history page and Django door follow the language switch", () => {
  assert.match(historyPage, /historyCopy\(locale\)/);
  assert.match(historyPage, /copy\.sections\[section\.title\]/);
  assert.match(historyPage, /copy\.chapters\[chapter\.year\]/);
  assert.match(historyPage, /copy\.films\[film\.url\]/);
  assert.match(historyPage, /copy\.djangoBody/);
  assert.match(doors, /t\("nav\.hint\.django"\)/);
  assert.match(doors, /t\("nav\.django"\)/);
  assert.match(doors, /copy\.opensRomani/);
});

test("django-copy has every hub locale and Dutch is not English", () => {
  const table = copiesBlock(djangoCopySrc, "const COPIES");
  for (const locale of LOCALES) {
    const key = locale === "zh-tw" ? '"zh-tw"' : locale;
    assert.ok(table.includes(`${key}:`), `${locale} in django-copy COPIES`);
  }
  assert.match(djangoCopySrc, /woonwagen in Liberchies/);
  assert.match(djangoCopySrc, /bioTitle: "Leven"/);
  assert.match(djangoCopySrc, /roulotte à Liberchies/);
  assert.match(djangoCopySrc, /Wohnwagen in Liberchies/);
  assert.match(djangoCopySrc, /caravana en Liberchies/);
  assert.match(djangoCopySrc, /リベルシ/);
  assert.match(djangoCopySrc, /利贝尔希/);
  assert.match(djangoCopySrc, /export function djangoCopy/);
});

test("history-copy translates Django on Dutch/French/German", () => {
  assert.match(historyCopySrc, /Geschiedenis van gypsy jazz en de Sinti/);
  assert.match(historyCopySrc, /Django en de geboorte van een stijl/);
  assert.match(historyCopySrc, /title: "De brand"/);
  assert.match(historyCopySrc, /Het hele leven:/);
  assert.match(historyCopySrc, /Histoire du gypsy jazz et des Sinti/);
  assert.match(historyCopySrc, /Django et la naissance d’un style/);
  assert.match(historyCopySrc, /Geschichte des Gypsy Jazz und der Sinti/);
  assert.match(historyCopySrc, /Django und die Geburt eines Stils/);
  const table = copiesBlock(historyCopySrc, "const COPIES");
  for (const locale of LOCALES) {
    const key = locale === "zh-tw" ? '"zh-tw"' : locale;
    assert.ok(table.includes(`${key}:`), `${locale} in history-copy COPIES`);
  }
});

test("history story that was still English follows the language switch", () => {
  const extra = readFileSync(new URL("../src/lib/history-story-i18n.ts", import.meta.url), "utf8");
  const rest = readFileSync(new URL("../src/lib/history-story-rest.ts", import.meta.url), "utf8");
  assert.match(extra, /Oorsprong en de lange weg/);
  assert.match(extra, /De gitaar en de pompe/);
  assert.match(extra, /De oorlog tegen de Sinti/);
  assert.match(extra, /Origines et la longue route/);
  assert.match(extra, /Ursprung und der lange Weg/);
  assert.match(extra, /Lage Landen/);
  assert.match(rest, /Na Django/);
  assert.match(rest, /Een kring, geen museum/);
  assert.match(rest, /Après Django/);
  assert.match(rest, /Nach Django/);
  assert.match(historyPage, /copy\.archiveTitle/);
  assert.match(historyPage, /copy\.houses\[house\.id\]/);
  assert.match(historyCopySrc, /HISTORY_GAP_STORY/);
});
