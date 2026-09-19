import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isCrawler,
  localeFromAccept,
  localeFromCookie,
  localeFromCountry,
  resolveLocale,
} from "./locale-detect.ts";

test("Netherlands and Germany map to their language", () => {
  assert.equal(localeFromCountry("NL"), "nl");
  assert.equal(localeFromCountry("DE"), "de");
  assert.equal(localeFromCountry("BR"), "pt");
  assert.equal(localeFromCountry("TW"), "zh-tw");
  assert.equal(localeFromCountry("SE"), null);
});

test("Belgium uses Accept-Language among nl/fr/de", () => {
  assert.equal(localeFromCountry("BE", "fr-BE,fr;q=0.9"), "fr");
  assert.equal(localeFromCountry("BE", "nl-BE,nl;q=0.9,en;q=0.8"), "nl");
  assert.equal(localeFromCountry("BE", "en-GB,en;q=0.9"), "nl");
});

test("Accept-Language prefers zh-TW over zh", () => {
  assert.equal(localeFromAccept("zh-TW,zh;q=0.8,en;q=0.7"), "zh-tw");
  assert.equal(localeFromAccept("pt-BR,pt;q=0.9"), "pt");
});

test("saved pick beats country", () => {
  assert.equal(resolveLocale({ chosen: "en", country: "NL" }), "en");
  assert.equal(resolveLocale({ country: "NL" }), "nl");
  assert.equal(resolveLocale({ country: "", acceptLanguage: "hu" }), "hu");
  assert.equal(resolveLocale({ crawler: true, country: "FR" }), "en");
});

test("cookie only counts after an explicit pick", () => {
  assert.equal(localeFromCookie("gjh-locale=nl"), null);
  assert.equal(localeFromCookie("gjh-locale=nl; gjh-locale-picked=1"), "nl");
  assert.equal(localeFromCookie("gjh-locale=xx; gjh-locale-picked=1"), null);
});

test("crawlers are English", () => {
  assert.equal(isCrawler("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
  assert.equal(isCrawler("Mozilla/5.0 Chrome/120"), false);
});
