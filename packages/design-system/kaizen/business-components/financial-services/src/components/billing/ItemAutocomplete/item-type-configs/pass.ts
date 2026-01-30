import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { itemTypeEndpointConfig } from "./endpoints";
import type {
  ItemTypeConfig,
  RawPassResponse,
  TranslationFunction,
} from "./types";
import { parseTaxPercent } from "./utils";

export const createPassConfig = (
  t: TranslationFunction,
): ItemTypeConfig<RawPassResponse> => ({
  ...itemTypeEndpointConfig.pass,
  getListItemConfiguration: (item: RawPassResponse) => {
    const priceCts = (() => {
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
    })();
    const price = priceCts / 100;
    const priceLabel = getCurrencyDisplayWithPrice(price);
    const taxPercent = parseTaxPercent(item.tax);

    return {
      id: String(item.id),
      title: item.name,
      priceLabel,
      taxPercent,
      description: item.credits
        ? t("itemAutocomplete.credits", { count: item.credits })
        : undefined,
      imageUrl:
        item.image && typeof item.image === "string" && item.image.trim() !== ""
          ? item.image
          : undefined,
      credits: item.credits ?? null,
      durationDays: item.duration_days ?? null,
      durationMonths: item.duration_months ?? null,
      durationYears: item.duration_years ?? null,
      validityDateRange: (() => {
        if (!item.validity_daterange) return null;

        try {
          const parsed = JSON.parse(item.validity_daterange) as {
            lower: string;
            upper: string;
          };

          if (
            parsed &&
            typeof parsed === "object" &&
            typeof parsed.lower === "string" &&
            typeof parsed.upper === "string"
          ) {
            return {
              lower: parsed.lower,
              upper: parsed.upper,
            };
          }
        } catch {
          // Invalid JSON, return null
        }

        return null;
      })(),
    };
  },
});
