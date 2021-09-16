import type { MarkerType } from './types';

const MAXLAT = 180;
const MAXLONG = 360;

export const centerMarker = (markers: Array<MarkerType>) => {
  if (markers) {
    return markers.reduce(
      (acc, curr) => {
        acc[0] += curr.location.latitude / markers.length;
        acc[1] += curr.location.longitude / markers.length;
        return acc;
      },
      [0, 0],
    );
  }
  return null;
};

export const getDistance = (m1: MarkerType, m2: MarkerType) => {
  return {
    location: {
      latitude: Math.abs(m1.location.latitude - m2.location.latitude),
      longitude: Math.abs(m1.location.longitude - m2.location.longitude),
    },
  };
};

export const maxDistance = (markers: Array<MarkerType>) => {
  return (markers || []).reduce(
    (acc, marker) => {
      const distances = markers.map((m) => getDistance(marker, m));
      acc.maxLatitudeDistance = Math.max(
        acc.maxLatitudeDistance,
        Math.max(...distances.map((d: MarkerType) => d.location.latitude)),
      );
      acc.maxLongitudeDistance = Math.max(
        acc.maxLongitudeDistance,
        Math.max(...distances.map((d: MarkerType) => d.location.longitude)),
      );
      return acc;
    },
    { maxLatitudeDistance: 0, maxLongitudeDistance: 0 },
  );
};

export function setZoom(maxDist: {
  maxLatitudeDistance: number;
  maxLongitudeDistance: number;
}) {
  const latRef = maxDist.maxLatitudeDistance / MAXLAT;
  const longRef = maxDist.maxLongitudeDistance / MAXLONG;
  const maxDistWeighted = Math.max(latRef, longRef);
  let zoom = zoomRecu(1, 0, maxDistWeighted);
  zoom = Math.max(zoom, 2);
  return zoom;
}

function zoomRecu(ref: number, zoom: number, stopCritere: number): number {
  if (ref < stopCritere || zoom > 12) {
    return zoom;
  }
  return zoomRecu(ref / 2, zoom + 1, stopCritere);
}
