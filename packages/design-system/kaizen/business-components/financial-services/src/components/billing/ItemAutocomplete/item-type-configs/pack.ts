import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { itemTypeEndpointConfig } from "./endpoints";
import type {
  ItemTypeConfig,
  RawPackResponse,
  TranslationFunction,
} from "./types";
import { parsePackTaxPercent } from "./utils";

export const createPackConfig = (
  t: TranslationFunction,
): ItemTypeConfig<RawPackResponse> => ({
  ...itemTypeEndpointConfig.pack,
  getListItemConfiguration: (item: RawPackResponse) => {
    const priceCts = item.price_cts ?? Math.round(parseFloat(item.price) * 100);
    const price = priceCts / 100;
    const priceLabel = getCurrencyDisplayWithPrice(price);
    const itemCount =
      (item.payment_packs?.length ?? 0) +
      (item.shop_items?.length ?? 0) +
      (item.private_passes?.length ?? 0);
    const taxPercent = parsePackTaxPercent(item);

    return {
      id: String(item.id),
      title: item.name,
      priceLabel,
      taxPercent,
      description:
        itemCount > 0
          ? t("itemAutocomplete.items", { count: itemCount })
          : undefined,
      imageUrl:
        item.image && typeof item.image === "string" && item.image.trim() !== ""
          ? item.image
          : undefined,
    };
  },
});
