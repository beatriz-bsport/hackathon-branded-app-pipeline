import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import { getCurrencyCodeSuffix } from "#src/utils/format-price-with-currency-code";
import { useTranslation } from "#src/utils/i18n";

import type { FirstPurchaseSubFilterSectionProps } from "../first-purchase-sub-filter-section-props";

/**
 * Renders the first purchase amount sub-filter using the shared numeric comparator primitive.
 */
export const PurchaseAmountSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: FirstPurchaseSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <Body size="lg" weight="strong">
            {t("filters.28.subFilters.purchaseAmount")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="sm"
            label={t("filters.28.actions.removeSubFilter", {
              subFilterLabel: t("filters.28.subFilters.purchaseAmount"),
            })}
            intent="flat"
            color="default"
            onClick={onRemove}
          />
        </div>
        <NumericComparatorFilter
          id={id}
          value={value.purchaseAmount}
          onChange={(nextValue) =>
            setValue("purchaseAmount", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          suffix={getCurrencyCodeSuffix()}
          errors={{
            firstValue: errors.purchaseAmount?.firstValue?.message
              ? String(errors.purchaseAmount.firstValue.message)
              : undefined,
            secondValue: errors.purchaseAmount?.secondValue?.message
              ? String(errors.purchaseAmount.secondValue.message)
              : undefined,
          }}
        />
      </div>
    </Card>
  );
};
