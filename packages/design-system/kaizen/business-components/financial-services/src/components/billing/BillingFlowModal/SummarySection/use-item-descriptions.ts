import type { InvoiceItemFormData } from "#src/components/billing/BillingFlowModal/types";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { formatDate } from "./utils";

export const useItemDescriptions = (item: InvoiceItemFormData) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const getValidityDescription = (): string | null => {
    // Giftcard validity: show expiration days
    if (item.type === "giftcard") {
      return item.expirationDays != null
        ? t("billingFlowModal.validity", { count: item.expirationDays })
        : t("billingFlowModal.validity_unlimited");
    }

    // Pass validity: validityDateRange or duration parts
    // Note: validityDateRange is already parsed from JSON string in item-type-configs
    // (e.g., use-pass-config.ts). The backend returns validity_daterange as a JSON string,
    // but it's transformed to { lower: string, upper: string } during item configuration.
    // See: ItemAutocomplete/item-type-configs/use-pass-config.ts for the parsing logic.
    if (item.validityDateRange?.lower && item.validityDateRange?.upper) {
      return t("billingFlowModal.validityDateRange", {
        lower: formatDate(item.validityDateRange.lower, i18nInstance?.language),
        upper: formatDate(item.validityDateRange.upper, i18nInstance?.language),
      });
    }

    const parts: string[] = [];
    if (item.durationYears && item.durationYears > 0) {
      parts.push(
        t("billingFlowModal.validityPartYear", {
          count: item.durationYears,
        }),
      );
    }
    if (item.durationMonths && item.durationMonths > 0) {
      parts.push(
        t("billingFlowModal.validityPartMonth", {
          count: item.durationMonths,
        }),
      );
    }
    if (item.durationDays && item.durationDays > 0) {
      parts.push(
        t("billingFlowModal.validityPartDay", {
          count: item.durationDays,
        }),
      );
    }
    if (parts.length === 0) return null;

    // Join parts with separators: "part1, part2 and part3"
    // Comma separator is universal, "and" needs translation
    const andSeparator = t(
      "billingFlowModal.validityAndSeparator" as "billingFlowModal.validityPartDay",
    ) as string;

    let result = parts[0];
    if (parts.length === 2) {
      result = `${parts[0]} ${andSeparator} ${parts[1]}`;
    } else if (parts.length > 2) {
      const allButLast = parts.slice(0, -1).join(", ");
      result = `${allButLast} ${andSeparator} ${parts[parts.length - 1]}`;
    }

    return `Validity: ${result}`;
  };

  const getCreditsDescription = (): string | null => {
    if (item.credits == null) return null;
    return t("itemAutocomplete.credits", { count: item.credits });
  };

  return {
    validityDescription: getValidityDescription(),
    creditsDescription: getCreditsDescription(),
  };
};
