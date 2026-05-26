import type { Establishment, EstablishmentGroup } from "@bsport/api-book";

export type VenueGroup = {
  address: string;
  venues: Establishment[];
};

export type VenueCoordinateGroup = {
  latitude: number;
  longitude: number;
  venues: Establishment[];
};

export const groupVenuesByCoordinates = (
  venues: Establishment[],
): VenueCoordinateGroup[] => {
  const map = new Map<string, VenueCoordinateGroup>();

  for (const venue of venues) {
    const { latitude, longitude } = venue.location;
    if (latitude == null || longitude == null) continue;
    if (latitude === 0 && longitude === 0) continue;
    const key = `${latitude},${longitude}`;
    const existing = map.get(key);
    if (existing) {
      existing.venues.push(venue);
    } else {
      map.set(key, { latitude, longitude, venues: [venue] });
    }
  }

  return [...map.values()];
};

export const groupVenuesByAddress = (venues: Establishment[]): VenueGroup[] => {
  const map = new Map<string, Establishment[]>();

  for (const venue of venues) {
    const key = venue.location.address.toUpperCase();
    const group = map.get(key);
    if (group) {
      group.push(venue);
    } else {
      map.set(key, [venue]);
    }
  }

  return Array.from(map.values()).map((venues) => ({
    address: venues[0].location.address,
    venues: venues,
  }));
};

export const buildVenueGroupMap = (
  groups: EstablishmentGroup[],
): Map<number, EstablishmentGroup> => {
  const map = new Map<number, EstablishmentGroup>();

  for (const group of groups) {
    for (const venueId of group.establishment) {
      map.set(venueId, group);
    }
  }

  return map;
};
