import { Body, Button } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { BasketAbandonmentSubFilterSectionProps } from "../basket-abandonment-sub-filter-section-props";

/**
 * Renders the abandonment date sub-filter using the shared date primitive.
 */
export const AbandonmentDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: BasketAbandonmentSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {t("filters.20.subFilters.abandonmentDate")}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.20.actions.removeSubFilter", {
            subFilterLabel: t("filters.20.subFilters.abandonmentDate"),
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>
      <DateFilter
        id={id}
        value={value.abandonmentDate}
        onChange={(nextValue) =>
          setValue("abandonmentDate", nextValue, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        errors={{
          absoluteFromDate: errors.abandonmentDate?.absolute?.fromDate?.message
            ? String(errors.abandonmentDate.absolute.fromDate.message)
            : undefined,
          absoluteToDate: errors.abandonmentDate?.absolute?.toDate?.message
            ? String(errors.abandonmentDate.absolute.toDate.message)
            : undefined,
          relativeFirstDays: errors.abandonmentDate?.relative?.firstDays
            ?.message
            ? String(errors.abandonmentDate.relative.firstDays.message)
            : undefined,
          relativeSecondDays: errors.abandonmentDate?.relative?.secondDays
            ?.message
            ? String(errors.abandonmentDate.relative.secondDays.message)
            : undefined,
        }}
      />
    </div>
  );
};
