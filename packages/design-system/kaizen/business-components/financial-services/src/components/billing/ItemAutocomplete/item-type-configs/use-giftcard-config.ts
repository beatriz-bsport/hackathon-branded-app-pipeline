import { useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";

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
        const { priceLabel } = getPriceFromItem(item);

        const descriptionParts: string[] = [];
        if (item.expiration_days != null) {
          descriptionParts.push(
            String(
              t("itemAutocomplete.validForDays", {
                count: item.expiration_days,
              }),
            ),
          );
        }
        if (
          item.card_type === GIFT_CARD_TYPE.FREE_AMOUNT &&
          item.min_price &&
          item.max_price
        ) {
          const minFormatted = getCurrencyDisplayWithPrice(item.min_price);
          const maxFormatted = getCurrencyDisplayWithPrice(item.max_price);
          descriptionParts.push(
            String(
              t("itemAutocomplete.customAmountRange", {
                min: minFormatted,
                max: maxFormatted,
              }),
            ),
          );
        }

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          taxPercent: 0,
          description:
            descriptionParts.length > 0
              ? descriptionParts.join(DESCRIPTION_PARTS_SEPARATOR)
              : undefined,
          imageUrl:
            item.cover &&
            typeof item.cover === "string" &&
            item.cover.trim() !== ""
              ? item.cover
              : undefined,
        };
      },
    }),
    [t],
  );
};
