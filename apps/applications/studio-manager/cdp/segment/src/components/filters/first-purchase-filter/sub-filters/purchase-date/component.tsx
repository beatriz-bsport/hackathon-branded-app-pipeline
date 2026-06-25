import { Body, Button } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { FirstPurchaseSubFilterSectionProps } from "../first-purchase-sub-filter-section-props";

/**
 * Renders the first purchase date range sub-filter using the shared date primitive.
 */
export const PurchaseDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: FirstPurchaseSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {t("filters.28.subFilters.purchaseDate")}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.28.actions.removeSubFilter", {
            subFilterLabel: t("filters.28.subFilters.purchaseDate"),
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>
      <DateFilter
        id={id}
        value={value.purchaseDate}
        onChange={(nextValue) =>
          setValue("purchaseDate", nextValue, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        errors={{
          absoluteFromDate:
            errors.purchaseDate?.absolute?.fromDate?.message?.toString(),
          absoluteToDate:
            errors.purchaseDate?.absolute?.toDate?.message?.toString(),
          relativeFirstDays:
            errors.purchaseDate?.relative?.firstDays?.message?.toString(),
          relativeSecondDays:
            errors.purchaseDate?.relative?.secondDays?.message?.toString(),
        }}
      />
    </div>
  );
};
