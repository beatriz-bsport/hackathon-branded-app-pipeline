import type { EstablishmentGroup } from "@bsport/api-book";
import type { Establishment } from "@bsport/api-book";

export type VenueGroup = {
  address: string;
  venues: Establishment[];
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
