import { useMemo } from "react";

import { itemTypeEndpointConfig } from "./endpoints";
import { getPriceFromItem } from "./price";
import type { ItemTypeConfig, RawWebshopItemResponse } from "./types";
import { parseTaxPercent } from "./utils";

export const useProductConfig = (): ItemTypeConfig<RawWebshopItemResponse> =>
  useMemo(
    (): ItemTypeConfig<RawWebshopItemResponse> => ({
      ...itemTypeEndpointConfig.product,
      getListItemConfiguration: (item: RawWebshopItemResponse) => {
        const { priceLabel } = getPriceFromItem(item);

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          taxPercent: parseTaxPercent(item.tva),
          imageUrl:
            item.cover &&
            typeof item.cover === "string" &&
            item.cover.trim() !== ""
              ? item.cover
              : undefined,
        };
      },
    }),
    [],
  );
