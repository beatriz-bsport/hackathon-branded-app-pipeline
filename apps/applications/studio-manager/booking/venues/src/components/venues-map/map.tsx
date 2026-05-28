import { latLngBounds } from "leaflet";
// leaflet.css — 14.8 KB uncompressed (~3-4 KB gzipped). Safe to inline.
import leafletCss from "leaflet/dist/leaflet.css?inline";
import { type FC, type ReactNode, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

// Leaflet CSS cannot go through the normal CSS pipeline: plain
// `import "leaflet/dist/leaflet.css"` emits a separate `dist/style.css`
// in this Vite library build that the federation host never loads
// (verified live 2026-05-21 — map renders unstyled). Injecting it once
// as an inline <style> at module load is the only reliable path here.
if (
  typeof document !== "undefined" &&
  !document.getElementById("leaflet-css")
) {
  const style = document.createElement("style");
  style.id = "leaflet-css";
  style.textContent = leafletCss;
  document.head.appendChild(style);
}

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const PARIS: LatLng = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;

export type LatLng = [number, number];

export type MapViewProps = {
  children?: ReactNode;
  /** Coordinates used to auto-fit the viewport. Pass a stable reference (e.g. via `useMemo`) — the map re-fits whenever this array's identity changes. */
  bounds?: LatLng[];
  fallbackCenter?: LatLng;
  height?: number;
  className?: string;
};

type ControllerProps = {
  bounds: LatLng[];
  fallbackCenter: LatLng;
};

const MapController: FC<ControllerProps> = ({ bounds, fallbackCenter }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const valid = bounds.filter(([lat, lng]) => lat !== 0 || lng !== 0);
    if (valid.length === 0) {
      map.setView(fallbackCenter, DEFAULT_ZOOM);
      return;
    }
    map.fitBounds(latLngBounds(valid), {
      maxZoom: DEFAULT_ZOOM,
      padding: [24, 24],
    });
  }, [map, bounds, fallbackCenter]);
  return null;
};

export const MapView: FC<MapViewProps> = ({
  children,
  bounds = [],
  fallbackCenter = PARIS,
  height = 360,
  className,
}) => {
  return (
    <MapContainer
      // `center` is required by react-leaflet but `MapController` overrides it
      // on mount via fitBounds / setView, so this is only an SSR-safe placeholder.
      center={fallbackCenter}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      className={className}
      style={{ height, width: "100%" }}
    >
      <MapController bounds={bounds} fallbackCenter={fallbackCenter} />
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {children}
    </MapContainer>
  );
};

MapView.displayName = "KaizenMapView";
