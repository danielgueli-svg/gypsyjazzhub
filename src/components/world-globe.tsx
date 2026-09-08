import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import {
  geoContains,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { displayCountry, globeCityForCountry, GLOBE_CITIES, isOnGlobe, resolveCountry } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

type CountryFeature = Feature<Geometry, { name: string }>;

const topology = world as unknown as Topology;
const collection = feature(
  topology,
  topology.objects.countries,
) as unknown as FeatureCollection<Geometry, { name: string }>;

const FEATURES = collection.features as CountryFeature[];
const GRATICULE = geoGraticule10();

const GOLD = "#e6c15a";
const GOLD_HOT = "#f3dc7a";
const GOLD_PICK = "#fff1b0";
const WOOD = "#6a3d22";
const WOOD_DARK = "#3d2314";
const WOOD_HOT = "#8a5230";

function nameOf(f: CountryFeature) {
  return f.properties?.name ?? "";
}

export function WorldGlobe({
  countries,
  selected,
  onSelect,
}: {
  countries: Record<string, unknown>;
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const rotation = useRef<[number, number]>([-8, -32]);
  const scaleAmt = useRef(0.5);
  const targetScale = useRef(0.5);
  const targetRot = useRef<[number, number]>([-8, -32]);
  const overEurope = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hover = useRef<string | null>(null);
  const zoomInBtn = useRef<HTMLButtonElement>(null);
  const zoomOutBtn = useRef<HTMLButtonElement>(null);
  const pinching = useRef(false);
  const pinchStart = useRef(0);
  const pinchScale = useRef(0.5);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const countriesRef = useRef(countries);
  countriesRef.current = countries;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const { locale } = useI18n();
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const canvasEl = canvasRef.current;
    const tipEl = tipRef.current;
    if (!wrapEl || !canvasEl) return;
    const ctxEl = canvasEl.getContext("2d", { alpha: false });
    if (!ctxEl) return;
    const box: HTMLDivElement = wrapEl;
    const view: HTMLCanvasElement = canvasEl;
    const brush: CanvasRenderingContext2D = ctxEl;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let alive = true;
    let steerX = 0;

    const projection = geoOrthographic();
    const path = geoPath(projection, brush);
    let cssEdge = 320;

    function size() {
      const rect = box.getBoundingClientRect();
      const raw = Math.floor(rect.width);
      if (raw < 8) return;
      cssEdge = raw;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      view.width = Math.floor(cssEdge * dpr);
      view.height = Math.floor(cssEdge * dpr);
      view.style.width = `${cssEdge}px`;
      view.style.height = `${cssEdge}px`;
      brush.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.translate([cssEdge / 2, cssEdge / 2]);
    }

    function draw() {
      const edge = cssEdge;
      const cx = edge / 2;
      const cy = edge / 2;
      const r = edge * 0.5;
      brush.fillStyle = "#0a4a86";
      brush.fillRect(0, 0, edge, edge);
      projection.rotate(rotation.current).clipAngle(90).scale(edge * scaleAmt.current).translate([cx, cy]);

      const ocean = brush.createRadialGradient(
        cx - r * 0.28,
        cy - r * 0.32,
        r * 0.1,
        cx,
        cy,
        r,
      );
      ocean.addColorStop(0, "#8fd4f8");
      ocean.addColorStop(0.38, "#2f8fd0");
      ocean.addColorStop(0.72, "#1567a8");
      ocean.addColorStop(1, "#0a3a6e");
      brush.fillStyle = ocean;
      brush.fillRect(0, 0, edge, edge);

      brush.beginPath();
      path(GRATICULE);
      brush.strokeStyle = "rgba(210, 236, 255, 0.2)";
      brush.lineWidth = 0.6;
      brush.stroke();

      const active = countriesRef.current;
      const picked = selectedRef.current;
      const hovered = hover.current;

      for (const country of FEATURES) {
        const n = nameOf(country);
        const isActive = isOnGlobe(active, n);
        const isSelected = picked === n;
        const isHover = hovered === n;
        brush.beginPath();
        path(country);
        if (isSelected) {
          brush.fillStyle = GOLD_PICK;
        } else if (isHover && isActive) {
          brush.fillStyle = GOLD_HOT;
        } else if (isActive) {
          brush.fillStyle = GOLD;
        } else if (isHover) {
          brush.fillStyle = WOOD_HOT;
        } else {
          brush.fillStyle = WOOD;
        }
        brush.fill();
        brush.strokeStyle = isActive ? "rgba(62, 40, 16, 0.45)" : "rgba(20, 10, 6, 0.45)";
        brush.lineWidth = isSelected ? 1.15 : 0.55;
        brush.stroke();
      }

      const shade = brush.createRadialGradient(
        cx - r * 0.32,
        cy - r * 0.38,
        r * 0.06,
        cx,
        cy,
        r,
      );
      shade.addColorStop(0, "rgba(255, 255, 255, 0.32)");
      shade.addColorStop(0.28, "rgba(255, 255, 255, 0)");
      shade.addColorStop(0.7, "rgba(0, 16, 40, 0.12)");
      shade.addColorStop(1, "rgba(0, 4, 16, 0.55)");
      brush.fillStyle = shade;
      brush.fillRect(0, 0, edge, edge);

      for (const city of GLOBE_CITIES) {
        if (!isOnGlobe(active, city.country)) continue;
        const pt = projection([city.lon, city.lat]);
        if (!pt) continue;
        const dx = pt[0] - cx;
        const dy = pt[1] - cy;
        if (dx * dx + dy * dy > r * r) continue;
        const hot = picked === city.country || hovered === city.country;
        brush.beginPath();
        brush.arc(pt[0], pt[1], hot ? 7 : 5.4, 0, Math.PI * 2);
        brush.fillStyle = GOLD_PICK;
        brush.fill();
        brush.strokeStyle = WOOD_DARK;
        brush.lineWidth = 1.1;
        brush.stroke();
      }

      if (hovered) {
        const hoverFeat = FEATURES.find((country) => nameOf(country) === hovered);
        if (hoverFeat) {
          const isActive = isOnGlobe(active, hovered);
          brush.beginPath();
          path(hoverFeat);
          brush.fillStyle = isActive ? GOLD_HOT : WOOD_HOT;
          brush.fill();
          brush.strokeStyle = GOLD_PICK;
          brush.lineWidth = 2.6;
          brush.stroke();
        }
      }
    }

    function placeTip(clientX: number, clientY: number, name: string | null) {
      if (!tipEl) return;
      if (!name) {
        tipEl.hidden = true;
        return;
      }
      const rect = box.getBoundingClientRect();
      tipEl.hidden = false;
      tipEl.textContent = `${displayCountry(name, localeRef.current)}${
        globeCityForCountry(name) ? ` · ${globeCityForCountry(name)!.city}` : ""
      }`.trim();
      tipEl.style.left = `${clientX - rect.left + 22}px`;
      tipEl.style.top = `${clientY - rect.top + 4}px`;
    }

    function inEurope(lon: number, lat: number) {
      return lon > -25 && lon < 32 && lat > 36 && lat < 72;
    }
    function inNordic(lon: number, lat: number) {
      return lon > -25 && lon < 32 && lat > 58 && lat < 72;
    }
    function inEastAsia(lon: number, lat: number) {
      return lon > 108 && lon < 148 && lat > 18 && lat < 46;
    }
    function inSouthAmerica(lon: number, lat: number) {
      return lon > -82 && lon < -34 && lat > -56 && lat < 13;
    }
    function inGulf(lon: number, lat: number) {
      return lon > 46 && lon < 60 && lat > 22 && lat < 32;
    }
    function regionScale(lon: number, lat: number, name: string | null) {
      if (name === "Iceland") return 2.35;
      if (name === "Taiwan") return 2.08;
      if (name === "United Arab Emirates" || name === "Kuwait") return 2.15;
      if (inNordic(lon, lat)) return 1.95;
      if (inGulf(lon, lat)) return 1.85;
      if (inEastAsia(lon, lat)) return 1.5;
      if (inEurope(lon, lat)) return 1.22;
      if (inSouthAmerica(lon, lat)) return 1.18;
      return 0.5;
    }
    function clampScale(n: number) {
      return Math.max(0.5, Math.min(2.45, n));
    }

    function lerpAngle(a: number, b: number, t: number) {
      let d = b - a;
      while (d > 180) d -= 360;
      while (d < -180) d += 360;
      return a + d * t;
    }

    function pointAt(clientX: number, clientY: number): [number, number] | null {
      const rect = view.getBoundingClientRect();
      return projection.invert?.([clientX - rect.left, clientY - rect.top]) ?? null;
    }

    function hit(clientX: number, clientY: number) {
      const rect = view.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const invert = projection.invert?.([x, y]);
      if (!invert) return null;
      return FEATURES.find((country) => geoContains(country, invert)) ?? null;
    }

    function hitCity(clientX: number, clientY: number) {
      const rect = view.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const reach = coarse ? 32 : 16;
      const reach2 = reach * reach;
      let best: (typeof GLOBE_CITIES)[number] | null = null;
      let bestD = reach2;
      for (const city of GLOBE_CITIES) {
        if (!isOnGlobe(countriesRef.current, city.country)) continue;
        const pt = projection([city.lon, city.lat]);
        if (!pt) continue;
        const dx = pt[0] - x;
        const dy = pt[1] - y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = city;
        }
      }
      return best;
    }

    size();
    draw();

    const onResize = () => {
      size();
      draw();
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(box);

    let picked = false;
    let downAt = 0;

    function xy(event: MouseEvent | TouchEvent | PointerEvent) {
      if ("changedTouches" in event && event.changedTouches[0]) {
        return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
      }
      if ("touches" in event && event.touches[0]) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
      const mouse = event as MouseEvent;
      return { x: mouse.clientX, y: mouse.clientY };
    }

    function touchDist(event: TouchEvent) {
      if (event.touches.length < 2) return 0;
      const a = event.touches[0];
      const b = event.touches[1];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }

    const bumpZoom = (dir: number) => {
      targetScale.current = clampScale(targetScale.current + dir);
      scaleAmt.current = targetScale.current;
      overEurope.current = false;
      draw();
    };

    const hoverAt = (x: number, y: number) => {
      const cityHit = hitCity(x, y);
      const country = cityHit ? null : hit(x, y);
      const next = cityHit?.country ?? (country ? nameOf(country) : null);
      if (next !== hover.current) {
        hover.current = next;
        draw();
      }
      placeTip(x, y, next);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button && event.button !== 0) return;
      if (event.pointerType !== "mouse" && event.cancelable) event.preventDefault();
      try {
        view.setPointerCapture(event.pointerId);
      } catch {
        /* capture optional in some iframes */
      }
      dragging.current = true;
      moved.current = false;
      picked = false;
      downAt = Date.now();
      last.current = { x: event.clientX, y: event.clientY };
      overEurope.current = false;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current || !last.current) {
        hoverAt(event.clientX, event.clientY);
        return;
      }
      if (tipEl) tipEl.hidden = true;
      const dx = event.clientX - last.current.x;
      const dy = event.clientY - last.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 10) moved.current = true;
      if (!moved.current) return;
      event.preventDefault();
      rotation.current = [
        rotation.current[0] + dx * 0.45,
        Math.max(-68, Math.min(68, rotation.current[1] - dy * 0.35)),
      ];
      last.current = { x: event.clientX, y: event.clientY };
      draw();
    };
    const pickAt = (clientX: number, clientY: number) => {
      if (picked) return;
      const city = hitCity(clientX, clientY);
      if (city) {
        picked = true;
        onSelectRef.current(city.country);
        return;
      }
      const country = hit(clientX, clientY);
      if (country) {
        picked = true;
        onSelectRef.current(resolveCountry(nameOf(country)) ?? nameOf(country));
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging.current) return;
      const tap =
        !moved.current || (Date.now() - downAt < 280 && !moved.current);
      if (tap || !moved.current) pickAt(event.clientX, event.clientY);
      dragging.current = false;
      last.current = null;
    };
    const onPointerCancel = () => {
      dragging.current = false;
      last.current = null;
    };

    const onLeave = () => {
      hover.current = null;
      steerX = 0;
      if (tipEl) tipEl.hidden = true;
      draw();
    };

    view.addEventListener("pointerdown", onPointerDown);
    view.addEventListener("pointermove", onPointerMove);
    view.addEventListener("pointerup", onPointerUp);
    view.addEventListener("pointercancel", onPointerCancel);
    view.addEventListener("pointerleave", onLeave);
    view.addEventListener("lostpointercapture", onPointerCancel);
    const onClick = (event: MouseEvent) => {
      if (moved.current) return;
      pickAt(event.clientX, event.clientY);
    };
    view.addEventListener("click", onClick);

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length >= 2) {
        pinching.current = true;
        dragging.current = false;
        moved.current = true;
        pinchStart.current = touchDist(event);
        pinchScale.current = scaleAmt.current;
        last.current = null;
        if (event.cancelable) event.preventDefault();
      }
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!pinching.current && event.touches.length < 2) return;
      if (event.touches.length >= 2) {
        pinching.current = true;
        const d = touchDist(event);
        if (pinchStart.current < 8) {
          pinchStart.current = d;
          pinchScale.current = scaleAmt.current;
        } else {
          targetScale.current = clampScale(pinchScale.current * (d / pinchStart.current));
          scaleAmt.current = targetScale.current;
          overEurope.current = false;
          moved.current = true;
          draw();
        }
        if (event.cancelable) event.preventDefault();
      }
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) pinching.current = false;
    };
    view.addEventListener("touchstart", onTouchStart, { passive: false });
    view.addEventListener("touchmove", onTouchMove, { passive: false });
    view.addEventListener("touchend", onTouchEnd);
    view.addEventListener("touchcancel", onTouchEnd);

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.9 : 1.12;
      targetScale.current = clampScale(targetScale.current * factor);
      scaleAmt.current = targetScale.current;
      overEurope.current = false;
      draw();
    };
    view.addEventListener("wheel", onWheel, { passive: false });

    const onZoomIn = () => bumpZoom(0.28);
    const onZoomOut = () => bumpZoom(-0.28);
    zoomInBtn.current?.addEventListener("click", onZoomIn);
    zoomOutBtn.current?.addEventListener("click", onZoomOut);

    const tick = () => {
      if (!alive) return;
      if (!dragging.current && !pinching.current) {
        const k = reduced ? 1 : 0.028;
        scaleAmt.current += (targetScale.current - scaleAmt.current) * k;
        if (!reduced) {
          const zoomT = Math.max(0, Math.min(1, (scaleAmt.current - 0.5) / (2.45 - 0.5)));
          const spin = 0.1 * (1 - zoomT) + 0.012 * zoomT;
          rotation.current = [rotation.current[0] + spin, rotation.current[1]];
        }
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      view.removeEventListener("pointerdown", onPointerDown);
      view.removeEventListener("pointermove", onPointerMove);
      view.removeEventListener("pointerup", onPointerUp);
      view.removeEventListener("pointercancel", onPointerCancel);
      view.removeEventListener("pointerleave", onLeave);
      view.removeEventListener("lostpointercapture", onPointerCancel);
      view.removeEventListener("click", onClick);
      view.removeEventListener("touchstart", onTouchStart);
      view.removeEventListener("touchmove", onTouchMove);
      view.removeEventListener("touchend", onTouchEnd);
      view.removeEventListener("touchcancel", onTouchEnd);
      view.removeEventListener("wheel", onWheel);
      zoomInBtn.current?.removeEventListener("click", onZoomIn);
      zoomOutBtn.current?.removeEventListener("click", onZoomOut);
    };
  }, []);

  return (
    <div className="relative z-0 mx-auto w-full max-w-[440px] py-3">
      <div
        ref={wrapRef}
        className="globe-ball mx-auto aspect-square w-[88%] overflow-hidden rounded-full"
      >
        <canvas
          ref={canvasRef}
          className="block touch-none select-none"
          style={{ touchAction: "none", WebkitUserSelect: "none" }}
          aria-label="Rotating world globe. Click a country to see artists and concerts."
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center gap-2 sm:bottom-3">
        <button
          ref={zoomOutBtn}
          type="button"
          aria-label="Zoom out"
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-black/55 font-display text-2xl leading-none text-white shadow-border hover:bg-black/70"
        >
          −
        </button>
        <button
          ref={zoomInBtn}
          type="button"
          aria-label="Zoom in"
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-black/55 font-display text-2xl leading-none text-white shadow-border hover:bg-black/70"
        >
          +
        </button>
      </div>
      <div
        ref={tipRef}
        hidden
        className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-black px-2.5 py-1 font-display text-sm text-accent"
      />
    </div>
  );
}
