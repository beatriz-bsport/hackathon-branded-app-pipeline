// Uses native globalThis.fetch — NOT @bsport/store-base Fetch — because this calls a third-party Google endpoint that must not receive bsport auth headers.
//
// FUTURE IMPROVEMENT — Switch to Places Autocomplete + Place Details APIs
//
// Current: Geocoding API (/geocode/json)
//   - Designed for full address resolution, not partial-query suggestions
//   - Returns 1 result for unambiguous queries, a few for ambiguous ones — no hard cap, no way to request more
//   - Pricing: free up to 10k req/month, then $5.00/1k (10k–100k), $4.00/1k (100k–500k)
//
// Better: Places Autocomplete (/place/autocomplete/json) + Place Details (/place/details/json)
//   - Autocomplete: built for search-as-you-type, always returns up to 5 predictions for partial input
//   - Place Details: second call on selection to resolve address_components + geometry → AddressSuggestion
//   - Session tokens (UUID): pass same token across all autocomplete keystrokes + terminating Place Details call
//     → first 12 autocomplete requests in session billed per-request, then free; session terminated by Place Details call
//   - Pricing (Autocomplete): free up to 10k req/month, then $2.83/1k (10k–100k), $2.27/1k (100k–500k) — cheaper than Geocoding
//   - Pricing (Place Details): separate SKU, billed per terminating call
//   - Same API key works (Google Maps Platform), but Places API must be enabled in the Cloud Console
//   - AddressSuggestion shape stays identical — parsePlaceDetailsResult mirrors parseGeocodingResult (same address_components structure)
//   - address-autocomplete-raw.tsx: selection becomes async (useMutation for Place Details); spinner shown during resolution
import { queryOptions } from "@tanstack/react-query";

import { QUERY_KEY_MAIN } from "../constants";
import type {
  AddressSuggestion,
  GoogleGeocodingResponse,
  GoogleGeocodingResult,
} from "./types";

const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

const MIN_QUERY_LENGTH = 3;
const SUGGESTIONS_STALE_TIME = 60 * 1000; // 1 minute

export const geocodingKeys = {
  all: [QUERY_KEY_MAIN, "geocoding"] as const,
  searches: () => [...geocodingKeys.all, "search"] as const,
  search: (searchText: string) =>
    [...geocodingKeys.searches(), searchText] as const,
};

export function parseGeocodingResult(
  result: GoogleGeocodingResult,
): AddressSuggestion {
  const getShort = (type: string) =>
    result.address_components.find((c) => c.types.includes(type))?.short_name ??
    "";
  const getLong = (type: string) =>
    result.address_components.find((c) => c.types.includes(type))?.long_name ??
    "";

  return {
    place_id: result.place_id,
    generated_address: result.formatted_address,
    address_line_1: `${getShort("street_number")} ${getShort("route")}`.trim(),
    address_line_2: "",
    city: getShort("locality"),
    state: getLong("administrative_area_level_1"),
    zipcode: getShort("postal_code"),
    country: getLong("country"),
    country_code: getShort("country"),
    geometry: {
      x: result.geometry.location.lat,
      y: result.geometry.location.lng,
    },
  };
}

export async function fetchAddressSuggestions(params: {
  searchText: string;
  apiKey: string;
}): Promise<AddressSuggestion[]> {
  const { searchText: rawSearchText, apiKey } = params;
  const searchText = rawSearchText.replace(/\s+/g, " ").trim();
  const query = new URLSearchParams({
    address: searchText,
    key: apiKey,
  });

  const response = await globalThis.fetch(
    `${GEOCODING_API_URL}?${query.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`);
  }

  const json = (await response.json()) as GoogleGeocodingResponse;

  if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
    throw new Error(`Geocoding API error: ${json.status}`);
  }

  return (json.results ?? []).map(parseGeocodingResult);
}

export const fetchAddressSuggestionsQueryOptions = (params: {
  searchText: string;
  apiKey: string;
}) =>
  queryOptions({
    queryKey: geocodingKeys.search(
      params.searchText.replace(/\s+/g, " ").trim(),
    ),
    queryFn: () => fetchAddressSuggestions(params),
    enabled:
      params.apiKey.length > 0 &&
      params.searchText.trim().length >= MIN_QUERY_LENGTH,
    staleTime: SUGGESTIONS_STALE_TIME,
  });
