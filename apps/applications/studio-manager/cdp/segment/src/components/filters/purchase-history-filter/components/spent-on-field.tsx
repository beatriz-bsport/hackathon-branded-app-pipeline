import {
  EXPENSES_COMPLETE_BUYABLE,
  EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER,
} from "@bsport/api-cdp/smartlist";
import { Body } from "@bsport/kaizen-primitive-core";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import type { ItemsSearchFilterOption } from "#src/components/primitive-filters/items-search-filter/types";
import { useTranslation } from "#src/utils/i18n";

type SpentOnFieldProps = {
  id: string;
  value: number[];
  disabled?: boolean;
  errorText?: string;
  onChange: (nextValue: number[]) => void;
};

const PRODUCT_LABEL_KEYS = {
  [EXPENSES_COMPLETE_BUYABLE.PAYMENT_PACK]: "filters.24.products.pass",
  [EXPENSES_COMPLETE_BUYABLE.PRIVATE_PASS]:
    "filters.24.products.appointmentPass",
  [EXPENSES_COMPLETE_BUYABLE.SHOP_ITEM]: "filters.24.products.shopItem",
  [EXPENSES_COMPLETE_BUYABLE.PAYMENT_COMBO]: "filters.24.products.pack",
  [EXPENSES_COMPLETE_BUYABLE.WORKSHOP]: "filters.24.products.workshopPass",
} as const;

/**
 * Multi-select for product types included in total spend.
 */
export const SpentOnField = ({
  id,
  value,
  disabled = false,
  errorText,
  onChange,
}: SpentOnFieldProps) => {
  const { t } = useTranslation("filters");

  const options: ItemsSearchFilterOption[] =
    EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER.map((buyableId) => ({
      id: buyableId,
      name: t(PRODUCT_LABEL_KEYS[buyableId]),
    }));

  return (
    <div className="flex flex-col gap-xs">
      <Body size="md" weight="strong">
        {t("filters.24.fields.spentOn")}
      </Body>
      <ItemsSearchFilter
        id={id}
        options={options}
        value={value}
        disabled={disabled}
        searchPlaceholder={t("filters.24.fields.spentOnSearchPlaceholder")}
        errorText={errorText}
        onChange={onChange}
      />
    </div>
  );
};
