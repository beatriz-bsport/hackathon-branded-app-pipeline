import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { itemTypeEndpointConfig } from "./endpoints";
import type {
  ItemTypeConfig,
  RawGiftcardResponse,
  TranslationFunction,
} from "./types";

export const createGiftcardConfig = (
  t: TranslationFunction,
): ItemTypeConfig<RawGiftcardResponse> => ({
  ...itemTypeEndpointConfig.giftcard,
  getListItemConfiguration: (item: RawGiftcardResponse) => {
    // For FREE_AMOUNT giftcards, price is null until user selects an amount
    // For FIXED giftcards, price is always set
    const priceCts =
      item.price_cts ??
      (item.price ? Math.round(parseFloat(item.price) * 100) : 0);
    const price = priceCts / 100;
    const priceLabel = getCurrencyDisplayWithPrice(price);

    const descriptionParts: string[] = [];
    if (item.expiration_days != null) {
      descriptionParts.push(
        t("itemAutocomplete.validForDays", { count: item.expiration_days }),
      );
    }
    if (item.card_type === "Free Amount" && item.min_price && item.max_price) {
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
      taxPercent: 0,
      description:
        descriptionParts.length > 0 ? descriptionParts.join(" • ") : undefined,
      imageUrl:
        item.cover && typeof item.cover === "string" && item.cover.trim() !== ""
          ? item.cover
          : undefined,
    };
  },
});
