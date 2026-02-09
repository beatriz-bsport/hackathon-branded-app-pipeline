import { useMemo } from "react";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { itemTypeEndpointConfig } from "./endpoints";
import { getPriceFromItem } from "./price";
import type { ItemTypeConfig, RawPackResponse } from "./types";
import { parsePackTaxPercent } from "./utils";

export const usePackConfig = (): ItemTypeConfig<RawPackResponse> => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  return useMemo(
    (): ItemTypeConfig<RawPackResponse> => ({
      ...itemTypeEndpointConfig.pack,
      getListItemConfiguration: (item: RawPackResponse) => {
        const { priceLabel } = getPriceFromItem(item);

        const itemCount =
          (item.payment_packs?.length ?? 0) +
          (item.shop_items?.length ?? 0) +
          (item.private_passes?.length ?? 0);

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          taxPercent: parsePackTaxPercent(item),
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
    }),
    [t],
  );
};
