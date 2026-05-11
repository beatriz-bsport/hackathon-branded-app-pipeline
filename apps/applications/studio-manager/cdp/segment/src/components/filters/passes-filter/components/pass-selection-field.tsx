import { useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { PassOption } from "../types";

type PassSelectionFieldProps = {
  id: string;
  value: number[];
  passOptions: PassOption[];
  disabled?: boolean;
  errorText?: string;
  onChange: (nextSelectedIds: number[]) => void;
};

/**
 * Returns a localized price string for a pass option.
 */
const getPassPrice = (passOption: PassOption): string => {
  const price = !passOption.price
    ? 0
    : typeof passOption.price === "number"
      ? passOption.price
      : passOption.price.parsedValue;
  return getCurrencyDisplayWithPrice(price);
};

/**
 * Stateless multi-select for picking pass ids.
 *
 * Wraps the generic `ItemsSearchFilter` primitive and only translates a list
 * of `PassOption` into searchable rows with a credits + price description.
 */
export const PassSelectionField = ({
  id,
  value,
  passOptions,
  disabled = false,
  errorText,
  onChange,
}: PassSelectionFieldProps) => {
  const { t } = useTranslation("filters");

  const items = useMemo(
    () =>
      passOptions.map((passOption) => ({
        id: passOption.id,
        name: passOption.name,
        description:
          passOption.credits === null
            ? t("filters.19.fields.unlimitedCredits")
            : `${passOption.credits} ${t("filters.19.fields.creditsSuffix")} - ${getPassPrice(passOption)}`,
      })),
    [passOptions, t],
  );

  return (
    <ItemsSearchFilter
      id={id}
      options={items}
      value={value}
      disabled={disabled}
      onChange={onChange}
      searchPlaceholder={t("filters.19.fields.searchPlaceholder")}
      emptySelectionLabel={t("filters.19.fields.emptySelection")}
      errorText={errorText}
    />
  );
};
