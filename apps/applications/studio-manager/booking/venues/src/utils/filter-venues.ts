import type { Establishment, EstablishmentGroup } from "@bsport/api-book";

export type VenuesActiveFilters = {
  cities: string[];
  groupIds: number[];
  includeNoLocation: boolean;
};

// Client-side filtering: the venues list is fully loaded in one request (page_size).
// If a studio's venue count outgrows this, move city/group filtering to backend
// search params (city__in / establishment_group__in) instead.
// TODO: will be soon handled by the backend team (Sentinel May 25th?)

export const getUniqueCities = (venues: Establishment[]): string[] => {
  const cities = new Set<string>();

  for (const venue of venues) {
    const city = venue.location.city;
    if (city) cities.add(city);
  }

  return Array.from(cities).sort((a, b) => a.localeCompare(b));
};

export const filterVenues = (
  venues: Establishment[],
  filters: VenuesActiveFilters,
  groupMap: Map<number, EstablishmentGroup>,
): Establishment[] => {
  return venues.filter((venue) => {
    const matchesCity =
      filters.cities.length === 0 ||
      filters.cities.includes(venue.location.city);

    const group = groupMap.get(venue.id);
    const matchesLocation =
      (filters.groupIds.length === 0 && !filters.includeNoLocation) ||
      (group ? filters.groupIds.includes(group.id) : filters.includeNoLocation);

    return matchesCity && matchesLocation;
  });
};
