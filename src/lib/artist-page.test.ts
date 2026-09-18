import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mergePageLinks,
  parseArtistLinks,
  sanitizePageUrl,
  sanitizePhotoUrl,
} from "./artist-page.ts";

test("sanitizePageUrl allows http(s) and site paths, rejects scripts", () => {
  assert.equal(
    sanitizePageUrl("https://www.guitarworld.com/features/django-reinhardt-legacy"),
    "https://www.guitarworld.com/features/django-reinhardt-legacy",
  );
  assert.equal(
    sanitizePageUrl("/groups/yorkshire-gypsy-swing-collective"),
    "/groups/yorkshire-gypsy-swing-collective",
  );
  assert.equal(sanitizePageUrl("javascript:alert(1)"), "");
  assert.equal(sanitizePageUrl("//evil.example/x"), "");
  assert.equal(sanitizePageUrl("data:image/png;base64,xxxx"), "");
});

test("sanitizePhotoUrl does not invent a host", () => {
  assert.equal(
    sanitizePhotoUrl("/groups/yorkshire-gypsy-swing-collective.jpg"),
    "/groups/yorkshire-gypsy-swing-collective.jpg",
  );
  assert.equal(sanitizePhotoUrl("not a url"), "");
});

test("parseArtistLinks keeps labelled urls and drops junk", () => {
  const links = parseArtistLinks(
    JSON.stringify([
      { label: "YouTube", url: "https://www.youtube.com/watch?v=GgDYOZTgeYg" },
      { label: "  ", url: "https://example.com" },
      { label: "our site", url: "javascript:alert(1)" },
      { label: "Guitarist article", href: "https://www.guitarworld.com/features/django-reinhardt-legacy" },
    ]),
  );
  assert.deepEqual(links, [
    { label: "YouTube", url: "https://www.youtube.com/watch?v=GgDYOZTgeYg" },
    { label: "Guitarist article", url: "https://www.guitarworld.com/features/django-reinhardt-legacy" },
  ]);
});

test("mergePageLinks shows extra labels after catalog and skips duplicate urls", () => {
  const merged = mergePageLinks(
    [{ href: "https://martinchungmusic.wordpress.com/", label: "martinchungmusic.wordpress.com" }],
    [
      { label: "our site", url: "https://martinchungmusic.wordpress.com/" },
      { label: "YouTube", url: "https://www.youtube.com/watch?v=GgDYOZTgeYg" },
    ],
  );
  assert.deepEqual(merged, [
    { href: "https://martinchungmusic.wordpress.com/", label: "martinchungmusic.wordpress.com" },
    { href: "https://www.youtube.com/watch?v=GgDYOZTgeYg", label: "YouTube" },
  ]);
});
