"use client";

import { useEffect, useRef } from "react";

export type DeliveryMapMarkerData = {
  id: string;
  lat: number;
  lng: number;
  tone: "green" | "amber" | "red";
  destination?: string;
  eta?: string;
  status?: string;
};

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

function popupToneLabel(tone: DeliveryMapMarkerData["tone"]) {
  if (tone === "green") return "En route";
  if (tone === "amber") return "Attention";
  return "Incident";
}

function markerColors(tone: DeliveryMapMarkerData["tone"]) {
  if (tone === "green") {
    return {
      fill: "#24a148",
      border: "#ffffff",
      soft: "#d7f6df",
      text: "#166534",
    };
  }

  if (tone === "amber") {
    return {
      fill: "#f59e0b",
      border: "#ffffff",
      soft: "#fff1cf",
      text: "#9a5b00",
    };
  }

  return {
    fill: "#ef4444",
    border: "#ffffff",
    soft: "#ffe0e0",
    text: "#b42318",
  };
}

function buildPopupContent(marker: DeliveryMapMarkerData) {
  const status = marker.status ?? popupToneLabel(marker.tone);
  const destination = marker.destination ?? "Point de livraison";
  const eta = marker.eta ? `<div class="gomile-map-popup__eta">${escapeHtml(marker.eta)}</div>` : "";
  const colors = markerColors(marker.tone);

  return `
    <div class="gomile-map-popup">
      <div class="gomile-map-popup__top">
        <div class="gomile-map-popup__id">${escapeHtml(marker.id)}</div>
        <span class="gomile-map-popup__pill" style="background:${colors.soft}; color:${colors.text};">
          ${escapeHtml(status)}
        </span>
      </div>
      <div class="gomile-map-popup__destination">${escapeHtml(destination)}</div>
      <div class="gomile-map-popup__caption">Heure prevue</div>
      ${eta}
    </div>
  `;
}

export default function GrenobleDeliveryMap({
  markers,
}: {
  markers: DeliveryMapMarkerData[];
}) {
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
        map.invalidateSize();
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
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!L || !map || !markerLayer) {
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

    if (markers.length > 0) {
      map.fitBounds(bounds, {
        padding: [36, 36],
        maxZoom: 14,
      });
    } else {
      map.setView(GRENOBLE_CENTER, 13);
    }
  }, [markers]);

  return <div ref={containerRef} className="gomile-leaflet-map h-full w-full" />;
}
