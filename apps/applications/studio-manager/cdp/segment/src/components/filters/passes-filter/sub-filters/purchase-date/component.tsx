import { Body, Button } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { PassSubFilterSectionProps } from "../pass-sub-filter-section-props";

/**
 * Renders the purchase date primitive with a remove action wired by the parent
 * list orchestrator.
 */
export const PurchaseDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: PassSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {t("filters.19.subFilters.purchaseDate")}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.19.actions.removeSubFilter", {
            subFilterLabel: t("filters.19.subFilters.purchaseDate"),
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
          setValue("purchaseDate", nextValue, { shouldDirty: true })
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
