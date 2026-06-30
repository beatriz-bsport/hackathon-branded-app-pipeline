import { Body, Button } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { PassSubFilterSectionProps } from "../pass-sub-filter-section-props";

/**
 * Renders the pass expiration date primitive with remove action.
 */
export const ExpirationDateSubFilterSection = ({
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
          {t("filters.19.subFilters.expirationDate")}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.19.actions.removeSubFilter", {
            subFilterLabel: t("filters.19.subFilters.expirationDate"),
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>
      <DateFilter
        id={id}
        value={value.expirationDate}
        onChange={(nextValue) =>
          setValue("expirationDate", nextValue, { shouldDirty: true })
        }
        errors={{
          absoluteFromDate:
            errors.expirationDate?.absolute?.fromDate?.message?.toString(),
          absoluteToDate:
            errors.expirationDate?.absolute?.toDate?.message?.toString(),
          relativeFirstDays:
            errors.expirationDate?.relative?.firstDays?.message?.toString(),
          relativeSecondDays:
            errors.expirationDate?.relative?.secondDays?.message?.toString(),
        }}
      />
    </div>
  );
};
