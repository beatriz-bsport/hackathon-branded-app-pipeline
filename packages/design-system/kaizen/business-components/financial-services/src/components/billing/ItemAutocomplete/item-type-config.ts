import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Giftcard } from "@bsport/store-buyables-giftcard";
import type { Pack } from "@bsport/store-buyables-pack";
import type { Pass } from "@bsport/store-buyables-pass";
import type { WebshopItem } from "@bsport/store-buyables-webshop";

import type {
  ItemAutocompleteItem,
  ItemAutocompleteItemKind,
} from "./ItemAutocomplete";

export type TranslationFunction = (
  key: string,
  options?: { count?: number; min?: string; max?: string },
) => string;

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

export const itemTypeEndpointConfig: Record<
  ItemAutocompleteItemKind,
  {
    endpoint: string;
    searchParam: "q" | "search";
    supportsDisabledFilter: boolean;
  }
> = {
  pass: {
    endpoint: "buyable/v1/payment-pack/payment-pack/search/",
    searchParam: "q",
    supportsDisabledFilter: true,
  },
  appointment_pass: {
    endpoint: "book/v1/private_service/private_pass/search/",
    searchParam: "q",
    supportsDisabledFilter: true,
  },
  product: {
    endpoint: "buyable/v1/shop/item/search/",
    searchParam: "q",
    supportsDisabledFilter: true,
  },
  pack: {
    endpoint: "buyable/v1/payment_combo/search/",
    searchParam: "q",
    supportsDisabledFilter: false,
  },
  giftcard: {
    endpoint: "buyable/v1/giftcard/giftcard/",
    searchParam: "search",
    supportsDisabledFilter: true,
  },
};

// TODO: Update endpoints to use constants from store packages once they're exported
// These endpoints should be linked to changes in:
// - @bsport/store-buyables-pass (pass) - packages/stores/buyables/pass/src/api/constants.ts
// - @bsport/store-buyables-appointment-pass (appointment_pass) - packages/stores/buyables/appointment-pass/src/api/constants.ts
// - @bsport/store-buyables-webshop (product) - packages/stores/buyables/webshop/src/api/constants.ts
// - @bsport/store-buyables-pack (pack) - packages/stores/buyables/pack/src/api.ts
// - @bsport/store-buyables-giftcard (giftcard) - packages/stores/buyables/giftcard/src/api.ts
// See !2016 when merged
export const createItemTypeConfig = (t: TranslationFunction) =>
  ({
    pass: {
      ...itemTypeEndpointConfig.pass,
      getListItemConfiguration: (
        item: RawPassResponse,
      ): ItemAutocompleteItem => {
        const priceCts =
          item.price_cts ??
          (typeof item.price === "number"
            ? Math.round(item.price * 100)
            : typeof item.price === "object" && item.price?.parsedValue
              ? Math.round(item.price.parsedValue * 100)
              : Math.round(parseFloat(item.base_price) * 100));
        const price = priceCts / 100;
        const priceLabel = getCurrencyDisplayWithPrice(price);

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          description: item.credits
            ? t(
                item.credits === 1
                  ? "itemAutocomplete.credits"
                  : "itemAutocomplete.credits_plural",
                { count: item.credits },
              )
            : undefined,
          imageUrl:
            item.image &&
            typeof item.image === "string" &&
            item.image.trim() !== ""
              ? item.image
              : undefined,
        };
      },
    },
    appointment_pass: {
      ...itemTypeEndpointConfig.appointment_pass,
      getListItemConfiguration: (
        item: RawAppointmentPassResponse,
      ): ItemAutocompleteItem => {
        const priceCts =
          item.price_cts ?? Math.round(parseFloat(item.price) * 100);
        const price = priceCts / 100;
        const priceLabel = getCurrencyDisplayWithPrice(price);

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          description: item.credits
            ? t(
                item.credits === 1
                  ? "itemAutocomplete.credits"
                  : "itemAutocomplete.credits_plural",
                { count: item.credits },
              )
            : undefined,
          imageUrl:
            item.image &&
            typeof item.image === "string" &&
            item.image.trim() !== ""
              ? item.image
              : undefined,
        };
      },
    },
    product: {
      ...itemTypeEndpointConfig.product,
      getListItemConfiguration: (
        item: RawWebshopItemResponse,
      ): ItemAutocompleteItem => {
        const priceCts =
          item.price_cts ?? Math.round(parseFloat(item.price) * 100);
        const price = priceCts / 100;
        const priceLabel = getCurrencyDisplayWithPrice(price);

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          imageUrl:
            item.cover &&
            typeof item.cover === "string" &&
            item.cover.trim() !== ""
              ? item.cover
              : undefined,
        };
      },
    },
    pack: {
      ...itemTypeEndpointConfig.pack,
      getListItemConfiguration: (
        item: RawPackResponse,
      ): ItemAutocompleteItem => {
        const priceCts =
          item.price_cts ?? Math.round(parseFloat(item.price) * 100);
        const price = priceCts / 100;
        const priceLabel = getCurrencyDisplayWithPrice(price);

        const itemCount =
          (item.payment_packs?.length ?? 0) +
          (item.shop_items?.length ?? 0) +
          (item.private_passes?.length ?? 0);

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          description:
            itemCount > 0
              ? t("itemAutocomplete.items", { count: itemCount })
              : undefined,
          imageUrl:
            item.image &&
            typeof item.image === "string" &&
            item.image.trim() !== ""
              ? item.image
              : undefined,
        };
      },
    },
    giftcard: {
      ...itemTypeEndpointConfig.giftcard,
      getListItemConfiguration: (
        item: RawGiftcardResponse,
      ): ItemAutocompleteItem => {
        const priceCts =
          item.price_cts ??
          (item.price
            ? Math.round(parseFloat(item.price) * 100)
            : item.min_price && item.max_price
              ? Math.round(((item.min_price + item.max_price) / 2) * 100)
              : 0);
        const price = priceCts / 100;
        const priceLabel = getCurrencyDisplayWithPrice(price);

        const descriptionParts: string[] = [];
        if (item.expiration_days != null) {
          descriptionParts.push(
            t(
              item.expiration_days === 1
                ? "itemAutocomplete.validForDays"
                : "itemAutocomplete.validForDays_plural",
              { count: item.expiration_days },
            ),
          );
        }
        if (
          item.card_type === "Free Amount" &&
          item.min_price &&
          item.max_price
        ) {
          const minFormatted = getCurrencyDisplayWithPrice(item.min_price);
          const maxFormatted = getCurrencyDisplayWithPrice(item.max_price);
          descriptionParts.push(
            t("itemAutocomplete.customAmountRange", {
              min: minFormatted,
              max: maxFormatted,
            }),
          );
        }

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          description:
            descriptionParts.length > 0
              ? descriptionParts.join(" • ")
              : undefined,
          imageUrl:
            item.cover &&
            typeof item.cover === "string" &&
            item.cover.trim() !== ""
              ? item.cover
              : undefined,
        };
      },
    },
  }) as {
    pass: ItemTypeConfig<RawPassResponse>;
    appointment_pass: ItemTypeConfig<RawAppointmentPassResponse>;
    product: ItemTypeConfig<RawWebshopItemResponse>;
    pack: ItemTypeConfig<RawPackResponse>;
    giftcard: ItemTypeConfig<RawGiftcardResponse>;
  };
