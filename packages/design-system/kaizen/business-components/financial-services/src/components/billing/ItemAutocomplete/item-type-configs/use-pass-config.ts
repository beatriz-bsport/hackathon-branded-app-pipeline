import { useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { itemTypeEndpointConfig } from "./endpoints";
import type { ItemTypeConfig, RawPassResponse } from "./types";
import { parseTaxPercent } from "./utils";

const getPriceCts = (item: RawPassResponse): number => {
  if (item.price_cts != null) return item.price_cts;
  if (typeof item.price === "number") return Math.round(item.price * 100);
  if (typeof item.price === "string") {
    const parsed = parseFloat(item.price);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
  }
  if (typeof item.price === "object" && item.price?.parsedValue != null) {
    const parsed = Number(item.price.parsedValue);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
  }
  const parsed = parseFloat(item.base_price ?? "");
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
};

const parseValidityDateRange = (
  validityDaterange: string | null | undefined,
): { lower: string; upper: string } | null => {
  if (validityDaterange == null || validityDaterange === "") return null;
  try {
    const parsed = JSON.parse(validityDaterange) as {
      lower?: string;
      upper?: string;
    };
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.lower === "string" &&
      typeof parsed.upper === "string"
    ) {
      return { lower: parsed.lower, upper: parsed.upper };
    }
  } catch {
    console.error("Invalid JSON for validity_daterange", validityDaterange);
  }
  return null;
};

export const usePassConfig = (): ItemTypeConfig<RawPassResponse> => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  return useMemo(
    (): ItemTypeConfig<RawPassResponse> => ({
      ...itemTypeEndpointConfig.pass,
      getListItemConfiguration: (item: RawPassResponse) => {
        const priceCts = getPriceCts(item);
        const price = priceCts / 100;
        const priceLabel = getCurrencyDisplayWithPrice(price);

        return {
          id: String(item.id),
          title: item.name,
          priceLabel,
          description: item.credits
            ? t("itemAutocomplete.credits", { count: item.credits })
            : undefined,
          imageUrl:
            item.image &&
            typeof item.image === "string" &&
            item.image.trim() !== ""
              ? item.image
              : undefined,
          credits: item.credits ?? null,
          durationDays: item.duration_days ?? null,
          durationMonths: item.duration_months ?? null,
          durationYears: item.duration_years ?? null,
          validityDateRange: parseValidityDateRange(item.validity_daterange),
          taxPercent: parseTaxPercent(item.tax),
          startDateMethod: item.start_date_method,
        };
      },
    }),
    [t],
  );
};
