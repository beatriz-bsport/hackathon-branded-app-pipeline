import { formatDate } from "#src/components/core/checkout-flow-modal/summary-section/utils";
import type { InvoiceItemFormData } from "#src/components/core/checkout-flow-modal/types";
import { i18nInstance, useTranslation } from "#src/i18n";

export const useItemDescriptions = (item: InvoiceItemFormData) => {
  const { t } = useTranslation(["buyables", "core"], { i18n: i18nInstance });

  const getValidityDescription = (): string | null => {
    // Giftcard validity: show expiration days
    if (item.type === "giftcard") {
      return item.expirationDays != null
        ? t("checkoutFlowModal.validity", {
            count: item.expirationDays,
            ns: "core",
          })
        : t("checkoutFlowModal.validity_unlimited", { ns: "core" });
    }

    // Pass validity: validityDateRange or duration parts
    // Note: validityDateRange is already parsed from JSON string in item-type-configs
    // (e.g., use-pass-config.ts). The backend returns validity_daterange as a JSON string,
    // but it's transformed to { lower: string, upper: string } during item configuration.
    // See: buyables/item-autocomplete/item-type-configs/use-pass-config.ts for the parsing logic.
    if (item.validityDateRange?.lower && item.validityDateRange?.upper) {
      return t("checkoutFlowModal.validityDateRange", {
        lower: formatDate(
          item.validityDateRange.lower,
          i18nInstance?.language ?? undefined,
        ),
        upper: formatDate(
          item.validityDateRange.upper,
          i18nInstance?.language ?? undefined,
        ),
        ns: "core",
      });
    }

    const parts: string[] = [];
    if (item.durationYears && item.durationYears > 0) {
      parts.push(
        t("checkoutFlowModal.validityPartYear", {
          count: item.durationYears,
          ns: "core",
        }),
      );
    }
    if (item.durationMonths && item.durationMonths > 0) {
      parts.push(
        t("checkoutFlowModal.validityPartMonth", {
          count: item.durationMonths,
          ns: "core",
        }),
      );
    }
    if (item.durationDays && item.durationDays > 0) {
      parts.push(
        t("checkoutFlowModal.validityPartDay", {
          count: item.durationDays,
          ns: "core",
        }),
      );
    }
    if (parts.length === 0) return null;

    // Join parts with separators: "part1, part2 and part3"
    // Comma separator is universal, "and" needs translation
    const andSeparator = t("checkoutFlowModal.validityAndSeparator", {
      ns: "core",
    });

    let result = parts[0];
    if (parts.length === 2) {
      result = `${parts[0]} ${andSeparator} ${parts[1]}`;
    } else if (parts.length > 2) {
      const allButLast = parts.slice(0, -1).join(", ");
      result = `${allButLast} ${andSeparator} ${parts[parts.length - 1]}`;
    }

    return `${t("checkoutFlowModal.validityPrefix", { ns: "core" })} ${result}`;
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
