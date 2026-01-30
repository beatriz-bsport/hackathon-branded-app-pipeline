import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { itemTypeEndpointConfig } from "./endpoints";
import type { ItemTypeConfig, RawWebshopItemResponse } from "./types";
import { parseTaxPercent } from "./utils";

export const createProductConfig =
  (): ItemTypeConfig<RawWebshopItemResponse> => ({
    ...itemTypeEndpointConfig.product,
    getListItemConfiguration: (item: RawWebshopItemResponse) => {
      const priceCts =
        item.price_cts ?? Math.round(parseFloat(item.price) * 100);
      const price = priceCts / 100;
      const priceLabel = getCurrencyDisplayWithPrice(price);
      const taxPercent = parseTaxPercent(item.tva);

      return {
        id: String(item.id),
        title: item.name,
        priceLabel,
        taxPercent,
        imageUrl:
          item.cover &&
          typeof item.cover === "string" &&
          item.cover.trim() !== ""
            ? item.cover
            : undefined,
      };
    },
  });
