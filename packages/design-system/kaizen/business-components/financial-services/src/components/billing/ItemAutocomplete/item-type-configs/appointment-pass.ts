import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { itemTypeEndpointConfig } from "./endpoints";
import type {
  ItemTypeConfig,
  RawAppointmentPassResponse,
  TranslationFunction,
} from "./types";
import { parseTaxPercent } from "./utils";

export const createAppointmentPassConfig = (
  t: TranslationFunction,
): ItemTypeConfig<RawAppointmentPassResponse> => ({
  ...itemTypeEndpointConfig.appointment_pass,
  getListItemConfiguration: (item: RawAppointmentPassResponse) => {
    const priceCts = item.price_cts ?? Math.round(parseFloat(item.price) * 100);
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
      validityDateRange: null, // AppointmentPass doesn't have validity_daterange
    };
  },
});
