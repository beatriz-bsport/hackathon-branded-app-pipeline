import { useMemo } from "react";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { itemTypeEndpointConfig } from "./endpoints";
import { getPriceFromItem } from "./price";
import type { ItemTypeConfig, RawGiftcardResponse } from "./types";

/** Separator used when joining multiple description parts into a single string */
export const DESCRIPTION_PARTS_SEPARATOR = " • ";

/** Giftcard card_type values from the API */
export const GIFT_CARD_TYPE = {
  FREE_AMOUNT: "Free Amount",
  FIXED: "Fixed",
} as const;

export type GiftCardType = (typeof GIFT_CARD_TYPE)[keyof typeof GIFT_CARD_TYPE];

export const useGiftcardConfig = (): ItemTypeConfig<RawGiftcardResponse> => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  return useMemo(
    (): ItemTypeConfig<RawGiftcardResponse> => ({
      ...itemTypeEndpointConfig.giftcard,
      getListItemConfiguration: (item: RawGiftcardResponse) => {
        const { priceLabel, price } = getPriceFromItem(item);

        const descriptionParts: string[] = [];
        if (item.expiration_days != null) {
          descriptionParts.push(
            String(
              t("itemAutocomplete.days", {
                count: item.expiration_days,
              }),
            ),
          );
        }

        return {
          id: String(item.id),
          title: item.name,
          priceLabel: price == null ? t("itemAutocomplete.custom") : priceLabel,
          taxPercent: 0,
          description:
            descriptionParts.length > 0
              ? descriptionParts.join(DESCRIPTION_PARTS_SEPARATOR)
              : t("itemAutocomplete.unlimited"),
          imageUrl:
            item.cover &&
            typeof item.cover === "string" &&
            item.cover.trim() !== ""
              ? item.cover
              : undefined,
          hiddenFromMemberArea: item.manager_only ?? false,
        };
      },
    }),
    [t],
  );
};
