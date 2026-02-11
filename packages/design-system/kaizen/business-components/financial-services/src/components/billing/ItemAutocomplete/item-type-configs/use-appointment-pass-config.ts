import { useMemo } from "react";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { itemTypeEndpointConfig } from "./endpoints";
import { getPriceFromItem } from "./price";
import type { ItemTypeConfig, RawAppointmentPassResponse } from "./types";

export const useAppointmentPassConfig =
  (): ItemTypeConfig<RawAppointmentPassResponse> => {
    const i18nInstance = useKaizenI18nInstance();
    const { t } = useTranslation("default", { i18n: i18nInstance });

    return useMemo(
      (): ItemTypeConfig<RawAppointmentPassResponse> => ({
        ...itemTypeEndpointConfig.appointment_pass,
        getListItemConfiguration: (item: RawAppointmentPassResponse) => {
          const { priceLabel } = getPriceFromItem(item);

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
            validityDateRange: null,
          };
        },
      }),
      [t],
    );
  };
