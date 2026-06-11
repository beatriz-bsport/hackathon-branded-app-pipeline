import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";

/**
 * Session / offer date scope for the total bookings count, using the shared
 * fixed-or-relative date primitive (mirrors pass purchase / expiration dates).
 */
export const BookingDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <Body size="lg" weight="strong">
            {t("filters.22.subFilters.bookingDate")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="sm"
            label={t("filters.22.actions.removeSubFilter", {
              subFilterLabel: t("filters.22.subFilters.bookingDate"),
            })}
            intent="flat"
            color="default"
            onClick={onRemove}
          />
        </div>
        <DateFilter
          id={id}
          value={value.bookingDate}
          onChange={(nextValue) =>
            setValue("bookingDate", nextValue, { shouldDirty: true })
          }
          errors={{
            absoluteFromDate:
              errors.bookingDate?.absolute?.fromDate?.message?.toString(),
            absoluteToDate:
              errors.bookingDate?.absolute?.toDate?.message?.toString(),
            relativeFirstDays:
              errors.bookingDate?.relative?.firstDays?.message?.toString(),
            relativeSecondDays:
              errors.bookingDate?.relative?.secondDays?.message?.toString(),
          }}
        />
      </div>
    </Card>
  );
};
