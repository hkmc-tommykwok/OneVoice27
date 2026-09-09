import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  config,
  type StyleSpecification,
  type SourceSpecification,
  type LayerSpecification,
  type CircleLayerSpecification,
  type SymbolLayerSpecification,
  type ExpressionSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection } from "geojson";
import { content } from "@/content";
import { useInView } from "@/hooks/useInView";
import countriesData from "@/map/countries.json";
import lightsData from "@/map/lights.json";
import citiesData from "@/map/cities.json";
import { CITY_NAMES_ZH } from "@/map/cityNames";
import { COUNTRY_NAMES_ZH } from "@/map/countryNames";

type CountryFeature = {
  properties: { name: string; area: number; cx: number; cy: number };
};

const COUNTRIES = { type: "FeatureCollection", features: countriesData } as FeatureCollection;
const LIGHTS = { type: "FeatureCollection", features: lightsData } as FeatureCollection;
const CITIES = { type: "FeatureCollection", features: citiesData } as FeatureCollection;

/** 依對照表把地名換成中文的 match 表達式 */
function localizedName(names: Record<string, string>): ExpressionSpecification {
  const expr: unknown[] = ["match", ["get", "name"]];
  for (const [en, zh] of Object.entries(names)) expr.push(en, zh);
  expr.push(["get", "name"]);
  return expr as ExpressionSpecification;
}

function buildMapStyle(): StyleSpecification {
  return {
    version: 8,
    glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
    sources: {
      countries: { type: "geojson", data: COUNTRIES },
      lights: { type: "geojson", data: LIGHTS },
      cities: { type: "geojson", data: CITIES },
    },
    layers: [
      {
        id: "bg",
        type: "background",
        paint: { "background-color": "#07051a" },
      },
      {
        id: "countries-fill",
        type: "fill",
        source: "countries",
        paint: { "fill-color": "#2D1D69", "fill-opacity": 0.96 },
      },
      {
        id: "countries-line",
        type: "line",
        source: "countries",
        paint: {
          "line-color": "rgba(117, 109, 181, 0.55)",
          "line-width": ["interpolate", ["linear"], ["zoom"], 1, 0.4, 6, 1.2],
        },
      },
      {
        id: "lights-dim",
        type: "circle",
        source: "lights",
        filter: ["==", ["get", "c"], 0],
        paint: {
          "circle-color": "rgba(150, 128, 200, 0.28)",
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 0.6, 6, 1.6],
        },
      },
      ...[false, true].map(
        (big) =>
          ({
            id: big ? "lights-glow-big" : "lights-glow",
            type: "circle",
            source: "lights",
            filter: [
              "all",
              [">", ["get", "c"], 0],
              big ? [">", ["get", "s"], 1] : ["<=", ["get", "s"], 1],
            ],
            paint: {
              "circle-color": [
                "match",
                ["get", "c"],
                1,
                "rgba(226, 84, 158, 0.55)",
                2,
                "rgba(67, 198, 216, 0.55)",
                "rgba(226, 84, 158, 0.55)",
              ],
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                1,
                big ? 4.6 : 3,
                6,
                big ? 13.5 : 9,
              ],
              "circle-blur": 1,
              "circle-opacity": 0.55,
            },
          }) as CircleLayerSpecification
      ),
      ...[false, true].map(
        (big) =>
          ({
            id: big ? "lights-core-big" : "lights-core",
            type: "circle",
            source: "lights",
            filter: [
              "all",
              [">", ["get", "c"], 0],
              big ? [">", ["get", "s"], 1] : ["<=", ["get", "s"], 1],
            ],
            paint: {
              "circle-color": ["match", ["get", "c"], 1, "#ff9ed2", 2, "#a9eef7", "#ff9ed2"],
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                1,
                big ? 1.7 : 1.1,
                6,
                big ? 4 : 2.6,
              ],
              "circle-opacity": 0.95,
              "circle-stroke-width": 0,
            },
          }) as CircleLayerSpecification
      ),
      ...[
        { id: "city-label-xl", pop: 2e6, minzoom: 2.4, fadeTo: 3 },
        { id: "city-label-lg", pop: 9e5, minzoom: 3.8, fadeTo: 4.4 },
        { id: "city-label-md", pop: 4e5, minzoom: 5.4, fadeTo: 6 },
      ].map(
        (cfg) =>
          ({
            id: cfg.id,
            type: "symbol",
            source: "cities",
            minzoom: cfg.minzoom,
            filter:
              cfg.id === "city-label-xl"
                ? [">=", ["get", "pop"], cfg.pop]
                : [
                    "all",
                    [">=", ["get", "pop"], cfg.pop],
                    ["<", ["get", "pop"], cfg.pop === 9e5 ? 2e6 : 9e5],
                  ],
            layout: {
              "text-field": localizedName(CITY_NAMES_ZH),
              "text-font": ["Noto Sans Regular"],
              "text-size": ["interpolate", ["linear"], ["zoom"], cfg.minzoom, 9, 8, 14],
              "text-offset": [0, -0.6],
            },
            paint: {
              "text-color": "#e6e0fa",
              "text-halo-color": "rgba(11, 7, 22, 0.9)",
              "text-halo-width": 1.4,
              "text-opacity": ["interpolate", ["linear"], ["zoom"], cfg.minzoom, 0, cfg.fadeTo, 0.95],
            },
          }) as SymbolLayerSpecification
      ),
      {
        id: "country-label-small",
        type: "symbol",
        source: "countries",
        minzoom: 2.6,
        filter: ["<=", ["get", "area"], 2e3],
        layout: {
          "text-field": localizedName(COUNTRY_NAMES_ZH),
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 2.6, 9, 8, 18],
        },
        paint: {
          "text-color": "#d8d0f5",
          "text-halo-color": "rgba(11, 7, 22, 0.9)",
          "text-halo-width": 1.4,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 2.6, 0, 3.2, 0.92],
        },
      },
      {
        id: "country-label-big",
        type: "symbol",
        source: "countries",
        minzoom: 1.4,
        filter: [">", ["get", "area"], 2e3],
        layout: {
          "text-field": localizedName(COUNTRY_NAMES_ZH),
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 1.4, 10, 8, 24],
        },
        paint: {
          "text-color": "#d8d0f5",
          "text-halo-color": "rgba(11, 7, 22, 0.9)",
          "text-halo-width": 1.5,
          "text-opacity": ["interpolate", ["linear"], ["zoom"], 1.4, 0, 2, 0.92],
        },
      },
    ],
  };
}

function CountUp({ target, active }: { target: number; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const start = performance.now();
    const duration = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("zh-TW");
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return <span ref={ref}>0</span>;
}

export default function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, inView } = useInView();
  const c = content.map;

  useEffect(() => {
    if (!containerRef.current) return;

    // 以各國質心作為標籤定位點
    const countryPoints: FeatureCollection = {
      type: "FeatureCollection",
      features: (COUNTRIES.features as unknown as CountryFeature[]).map((f) => ({
        type: "Feature",
        properties: { name: f.properties.name, area: f.properties.area },
        geometry: { type: "Point", coordinates: [f.properties.cx, f.properties.cy] },
      })),
    };

    config.WORKER_URL = "./maplibre-gl-worker.mjs";

    const style = buildMapStyle();
    (style.sources as Record<string, SourceSpecification>)["country-points"] = {
      type: "geojson",
      data: countryPoints,
    };
    for (const layer of style.layers) {
      if (layer.id.startsWith("country-label")) {
        (layer as LayerSpecification & { source: string }).source = "country-points";
      }
    }

    const map = new MapLibreMap({
      container: containerRef.current,
      style,
      center: [10, 18],
      zoom: 1.35,
      minZoom: 0.9,
      maxZoom: 12,
      renderWorldCopies: true,
      attributionControl: false,
      cooperativeGestures: true,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      keyboard: false,
    });

    const fit = () => {
      map.fitBounds(
        [
          [-168, -58],
          [192, 80],
        ],
        { padding: 6, animate: false }
      );
      map.setZoom(map.getZoom() + 0.3);
    };
    map.on("load", fit);
    return () => map.remove();
  }, []);

  return (
    <section id="map" className="section-glow py-24">
      <div className="max-w-6xl mx-auto text-center mb-10 px-5">
        <p className="eyebrow mb-4">{c.eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-extrabold">{c.title}</h2>
      </div>

      <div ref={statsRef} className="relative w-full h-[62vh] md:h-[78vh] overflow-hidden">
        <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
        <div className="pointer-events-none absolute inset-x-0 top-6 z-10 flex flex-wrap justify-center gap-4 px-4">
          <div className="relative flex w-[240px] sm:w-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#b8c0e6]/[0.22] bg-white/[0.02] p-5 md:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-md">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -left-10 -z-10 h-28 w-28 rounded-full bg-[#D28EBE] opacity-5 blur-xl"
            />
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#D28EBE] shadow-[0_0_8px_#D28EBE]" />
              {c.people}
            </p>
            <p className="mt-2 leading-none font-black tracking-tight text-[clamp(48px,6vw,72px)] text-[#D28EBE] [text-shadow:0_1px_1px_rgba(18,12,52,0.8),0_0_8px_rgba(210,142,190,0.34),0_0_24px_rgba(210,142,190,0.25)]">
              <CountUp target={c.peopleCount} active={inView} />
            </p>
          </div>
          <div className="relative flex w-[240px] sm:w-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#b8c0e6]/[0.22] bg-white/[0.02] p-5 md:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-md">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -left-10 -z-10 h-28 w-28 rounded-full bg-[#8FE0D4] opacity-5 blur-xl"
            />
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#8FE0D4] shadow-[0_0_8px_#8FE0D4]" />
              {c.groups}
            </p>
            <p className="mt-2 leading-none font-black tracking-tight text-[clamp(48px,6vw,72px)] text-[#8FE0D4] [text-shadow:0_1px_1px_rgba(18,12,52,0.8),0_0_8px_rgba(143,224,212,0.34),0_0_24px_rgba(143,224,212,0.25)]">
              <CountUp target={c.groupsCount} active={inView} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
