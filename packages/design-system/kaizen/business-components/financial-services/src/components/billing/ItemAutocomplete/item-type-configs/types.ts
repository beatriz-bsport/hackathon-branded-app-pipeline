import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Giftcard } from "@bsport/store-buyables-giftcard";
import type { Pack } from "@bsport/store-buyables-pack";
import type { Pass } from "@bsport/store-buyables-pass";
import type { WebshopItem } from "@bsport/store-buyables-webshop";

import type { ItemAutocompleteItem } from "../ItemAutocomplete";

// Raw API response types - these represent what comes from the API before transformation
// The API may return additional fields like price_cts, currency, image that aren't in the base types
export type RawPassResponse = Pass & {
  price_cts?: number;
  currency?: string;
  image?: string | null;
};

export type RawAppointmentPassResponse = AppointmentPass & {
  price_cts?: number;
  currency?: string;
  image?: string | null;
};

export type RawWebshopItemResponse = WebshopItem & {
  price_cts?: number;
  currency?: string;
};

export type RawPackResponse = Pack & {
  price_cts?: number;
  currency?: string;
  image?: string | null;
};

export type RawGiftcardResponse = Giftcard & {
  price_cts?: number;
  currency?: string;
};

export type ItemTypeConfig<T> = {
  endpoint: string;
  searchParam: "q" | "search";
  supportsDisabledFilter: boolean;
  getListItemConfiguration: (item: T) => ItemAutocompleteItem;
};
