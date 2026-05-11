import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { PassSubFilterSectionProps } from "../pass-sub-filter-section-props";

/**
 * Renders the pass expiration date primitive inside a nested card with remove.
 */
export const ExpirationDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: PassSubFilterSectionProps) => {
  const { t } = useTranslation("campaign-filters");

  return (
    <Card className="w-full">
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
            absoluteFromDate: errors.expirationDate?.absolute?.fromDate?.message
              ? String(errors.expirationDate.absolute.fromDate.message)
              : undefined,
            absoluteToDate: errors.expirationDate?.absolute?.toDate?.message
              ? String(errors.expirationDate.absolute.toDate.message)
              : undefined,
            relativeFirstDays: errors.expirationDate?.relative?.firstDays
              ?.message
              ? String(errors.expirationDate.relative.firstDays.message)
              : undefined,
            relativeSecondDays: errors.expirationDate?.relative?.secondDays
              ?.message
              ? String(errors.expirationDate.relative.secondDays.message)
              : undefined,
          }}
        />
      </div>
    </Card>
  );
};
