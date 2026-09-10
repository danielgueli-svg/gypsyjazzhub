import assert from "node:assert/strict";
import { test } from "node:test";

const PUBLIC_SITE_ORIGIN = "https://www.gypsyjazzhub.com";

function isAbsoluteHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function originFromHeaders(headers) {
  const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || headers.get("host")?.trim();
  if (!host || /[\s\0<>]/.test(host)) return PUBLIC_SITE_ORIGIN;
  const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : host.includes("localhost") || host.startsWith("127.") || host.startsWith("[::1]")
        ? "http"
        : "https";
  return `${proto}://${host}`;
}

function resolveRequestHref(rawUrl, headers) {
  if (isAbsoluteHttpUrl(rawUrl)) return rawUrl;
  const origin = headers ? originFromHeaders(headers) : PUBLIC_SITE_ORIGIN;
  const path = !rawUrl || rawUrl === "null" || rawUrl === "undefined" ? "/" : rawUrl;
  try {
    return new URL(path.startsWith("/") ? path : `/${path}`, origin).href;
  } catch {
    return `${PUBLIC_SITE_ORIGIN}/`;
  }
}

test("empty and relative request URLs become absolute", () => {
  const headers = new Headers({ host: "www.gypsyjazzhub.com" });
  assert.equal(resolveRequestHref("", headers), "https://www.gypsyjazzhub.com/");
  assert.equal(resolveRequestHref("/", headers), "https://www.gypsyjazzhub.com/");
  assert.equal(resolveRequestHref("/jams", headers), "https://www.gypsyjazzhub.com/jams");
  assert.equal(resolveRequestHref("concerts", headers), "https://www.gypsyjazzhub.com/concerts");
});

test("already-absolute URLs are kept", () => {
  assert.equal(
    resolveRequestHref("https://www.gypsyjazzhub.com/musicians"),
    "https://www.gypsyjazzhub.com/musicians",
  );
});

test("x-forwarded headers win for preview hosts", () => {
  const headers = new Headers({
    host: "localhost",
    "x-forwarded-host": "preview.example.com",
    "x-forwarded-proto": "https",
  });
  assert.equal(resolveRequestHref("/jams", headers), "https://preview.example.com/jams");
});

test("garbage host falls back to the public site", () => {
  const empty = new Headers();
  assert.equal(resolveRequestHref("/", empty), "https://www.gypsyjazzhub.com/");
  const fake = { get: (key) => (key === "host" ? "bad host\0" : null) };
  assert.equal(resolveRequestHref("/", fake), "https://www.gypsyjazzhub.com/");
});
