"use client";

import { MapMarkerData, mapMarkers } from "@/dummiesData/mapMarkers";
import { useEffect, useRef, useState } from "react";

type LeafletModule = typeof import("leaflet");

const GRENOBLE_CENTER: [number, number] = [45.1885, 5.7245];
const GRENOBLE_BOUNDS = {
  southWest: [45.153, 5.673] as [number, number],
  northEast: [45.214, 5.781] as [number, number],
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getThemeColor(variableName: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  return value || fallback;
}

function popupToneLabel(tone: MapMarkerData["tone"]) {
  if (tone === "green") return "En route";
  if (tone === "amber") return "Attention";
  return "Incident";
}

function popupToneClass(tone: MapMarkerData["tone"]) {
  if (tone === "green") return "gomile-map-popup__pill--green";
  if (tone === "amber") return "gomile-map-popup__pill--amber";
  return "gomile-map-popup__pill--red";
}

function markerColors(tone: MapMarkerData["tone"]) {
  const border = getThemeColor("--color-bg-card", "#FFFFCC");

  if (tone === "green") {
    return {
      fill: getThemeColor("--color-primary", "#0FB12A"),
      border,
    };
  }

  if (tone === "amber") {
    return {
      fill: getThemeColor("--color-warning", "#f59e0b"),
      border,
    };
  }

  return {
    fill: getThemeColor("--color-danger", "#b91c1c"),
    border,
  };
}

function buildPopupContent(marker: MapMarkerData) {
  const status = marker.status ?? popupToneLabel(marker.tone);
  const destination = marker.destination ?? "Point de livraison";
  const eta = marker.eta
    ? `<div class="gomile-map-popup__eta">${escapeHtml(marker.eta)}</div>`
    : "";

  return `
    <div class="gomile-map-popup">
      <div class="gomile-map-popup__top">
        <div class="gomile-map-popup__id">${escapeHtml(marker.id)}</div>
        <span class="gomile-map-popup__pill ${popupToneClass(marker.tone)}">
          ${escapeHtml(status)}
        </span>
      </div>
      <div class="gomile-map-popup__destination">${escapeHtml(destination)}</div>
      <div class="gomile-map-popup__caption">Heure prévue</div>
      ${eta}
    </div>
  `;
}

export default function GrenobleDeliveryMap({
  markers = mapMarkers,
}: {
  markers?: MapMarkerData[];
}) {
  const [isMapReady, setIsMapReady] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) {
        return;
      }

      const L = await import("leaflet");

      if (cancelled || !containerRef.current) {
        return;
      }

      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: GRENOBLE_CENTER,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        minZoom: 12,
        maxZoom: 18,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      map.attributionControl.setPrefix(false);
      map.setMaxBounds([
        GRENOBLE_BOUNDS.southWest,
        GRENOBLE_BOUNDS.northEast,
      ]);
      map.options.maxBoundsViscosity = 0.8;

      const markerLayer = L.layerGroup().addTo(map);
      mapRef.current = map;
      markerLayerRef.current = markerLayer;

      window.requestAnimationFrame(() => {
        if (cancelled) return;

        map.invalidateSize();
        setIsMapReady(true);
      });
    }

    initMap();

    return () => {
      cancelled = true;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      markerLayerRef.current = null;
      leafletRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!isMapReady || !L || !map || !markerLayer) {
      return;
    }

    markerLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    markers.forEach((marker) => {
      const colors = markerColors(marker.tone);

      const leafletMarker = L.circleMarker([marker.lat, marker.lng], {
        radius: 10,
        fillColor: colors.fill,
        color: colors.border,
        weight: 3,
        fillOpacity: 0.95,
      });

      leafletMarker.bindPopup(buildPopupContent(marker), {
        closeButton: true,
        offset: [0, -8],
        className: "gomile-leaflet-popup",
        maxWidth: 280,
      });

      leafletMarker.addTo(markerLayer);
      bounds.extend([marker.lat, marker.lng]);
    });

    if (markers.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [36, 36],
        maxZoom: 14,
      });
    } else {
      map.setView(GRENOBLE_CENTER, 13);
    }
  }, [markers, isMapReady]);

  return <div ref={containerRef} className="gomile-leaflet-map h-full w-full" />;
}

export type { MapMarkerData };
