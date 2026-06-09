import { useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import type { PassOption } from "#src/components/filters/passes-filter/types";
import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

type AppointmentPassSelectionFieldProps = {
  id: string;
  value: number[];
  passOptions: PassOption[];
  disabled?: boolean;
  errorText?: string;
  onChange: (nextSelectedIds: number[]) => void;
};

const getPassPrice = (passOption: PassOption): string => {
  const price = !passOption.price
    ? 0
    : typeof passOption.price === "number"
      ? passOption.price
      : passOption.price.parsedValue;
  return getCurrencyDisplayWithPrice(price);
};

/**
 * Multi-select for appointment pass (PrivatePass) template ids.
 */
export const AppointmentPassSelectionField = ({
  id,
  value,
  passOptions,
  disabled = false,
  errorText,
  onChange,
}: AppointmentPassSelectionFieldProps) => {
  const { t } = useTranslation("filters");

  const items = useMemo(
    () =>
      passOptions.map((passOption) => ({
        id: passOption.id,
        name: passOption.name,
        description:
          passOption.credits === null
            ? t("filters.25.fields.unlimitedCredits")
            : `${passOption.credits} ${t("filters.25.fields.creditsSuffix")} - ${getPassPrice(passOption)}`,
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
      searchPlaceholder={t("filters.25.fields.searchPlaceholder")}
      emptySelectionLabel={t("filters.25.fields.emptySelection")}
      errorText={errorText}
    />
  );
};
