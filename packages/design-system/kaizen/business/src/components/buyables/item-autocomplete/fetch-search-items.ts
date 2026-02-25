import type { Fetch } from "@bsport/fetch";
import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Giftcard } from "@bsport/store-buyables-giftcard";
import type { Pack } from "@bsport/store-buyables-pack";
import type { Pass } from "@bsport/store-buyables-pass";
import type { WebshopItem } from "@bsport/store-buyables-webshop";

import type { ItemAutocompleteItemKind } from "./item-autocomplete";
import { itemTypeEndpointConfig } from "./item-type-configs";

type BuyableSearchResponse<T> = {
  count: number;
  results: T[];
};

const ITEMS_SEARCH_COUNT = 20;

async function fetchSearchItems(
  fetch: Fetch,
  params: { itemType: "pass"; searchInput: string },
): Promise<Pass[]>;
async function fetchSearchItems(
  fetch: Fetch,
  params: { itemType: "appointment_pass"; searchInput: string },
): Promise<AppointmentPass[]>;
async function fetchSearchItems(
  fetch: Fetch,
  params: { itemType: "product"; searchInput: string },
): Promise<WebshopItem[]>;
async function fetchSearchItems(
  fetch: Fetch,
  params: { itemType: "pack"; searchInput: string },
): Promise<Pack[]>;
async function fetchSearchItems(
  fetch: Fetch,
  params: { itemType: "giftcard"; searchInput: string },
): Promise<Giftcard[]>;
async function fetchSearchItems(
  fetch: Fetch,
  params: { itemType: ItemAutocompleteItemKind; searchInput: string },
): Promise<Pass[] | AppointmentPass[] | WebshopItem[] | Pack[] | Giftcard[]>;
async function fetchSearchItems(
  fetch: Fetch,
  {
    itemType,
    searchInput,
  }: {
    itemType: ItemAutocompleteItemKind;
    searchInput: string;
  },
): Promise<Pass[] | AppointmentPass[] | WebshopItem[] | Pack[] | Giftcard[]> {
  const { endpoint, searchParam, supportsDisabledFilter } =
    itemTypeEndpointConfig[itemType];

  const queryParams = new URLSearchParams();

  // NOTE: Backend search for giftcard doesn't work - fetch all items without search filter
  // This is intentional: the giftcard endpoint doesn't support search parameters or pagination.
  // We fetch all giftcards and rely on client-side filtering in the autocomplete component.
  // Once backend search is implemented, remove this condition and use searchParam like other types.
  if (itemType === "giftcard") {
    // Fetch all giftcards without search and without page_size limit
    queryParams.set("disabled", "false");
  } else {
    queryParams.set(searchParam, searchInput || "");
    queryParams.set("page_size", String(ITEMS_SEARCH_COUNT));

    // Add disabled=false filter for types that support it
    if (supportsDisabledFilter) {
      queryParams.set("disabled", "false");
    }
  }

  const uri = `${endpoint}?${queryParams.toString()}`;

  const { data } = await fetch(uri, {
    method: "GET",
  });

  if (itemType === "pass") {
    const response = data as unknown as BuyableSearchResponse<Pass>;
    return (response.results || []) as Pass[];
  }
  if (itemType === "appointment_pass") {
    const response = data as unknown as BuyableSearchResponse<AppointmentPass>;
    return (response.results || []) as AppointmentPass[];
  }
  if (itemType === "product") {
    const response = data as unknown as BuyableSearchResponse<WebshopItem>;
    return (response.results || []) as WebshopItem[];
  }
  if (itemType === "pack") {
    const response = data as unknown as BuyableSearchResponse<Pack>;
    return (response.results || []) as Pack[];
  }
  if (itemType === "giftcard") {
    // NOTE: Giftcard endpoint returns a raw array, not a BuyableSearchResponse shape
    // This differs from other item types which return { count, results } objects
    return (data || []) as Giftcard[];
  }
  return [];
}

export { fetchSearchItems };
