import { Body, Button, Card, TimePicker } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";

/**
 * Restricts counted bookings to reservations whose session start time falls
 * between two clock times (same pattern as backend `hour` / `hour_second`).
 */
export const BookingHourRangeSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  const startPickerId = `${id}-hour-start`;
  const endPickerId = `${id}-hour-end`;

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <Body size="lg" weight="strong">
            {t("filters.22.subFilters.bookingHourRange")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="sm"
            label={t("filters.22.actions.removeSubFilter", {
              subFilterLabel: t("filters.22.subFilters.bookingHourRange"),
            })}
            intent="flat"
            color="default"
            onClick={onRemove}
          />
        </div>

        <div className="flex flex-col items-start gap-sm">
          <Body htmlVariant="span" size="md" color="default">
            {t("filters.22.fields.bookingHourRangeStartingBetween")}
          </Body>
          <TimePicker
            id={startPickerId}
            value={value.bookingHourRange.hour}
            onChange={(nextHour) =>
              setValue(
                "bookingHourRange",
                { ...value.bookingHourRange, hour: nextHour },
                { shouldDirty: true, shouldValidate: true },
              )
            }
            status={
              errors.bookingHourRange?.hour?.message ? "error" : undefined
            }
            statusText={
              errors.bookingHourRange?.hour?.message
                ? String(errors.bookingHourRange.hour.message)
                : undefined
            }
          />
          <Body htmlVariant="span" size="md" color="default">
            {t("filters.22.fields.bookingHourRangeAnd")}
          </Body>
          <TimePicker
            id={endPickerId}
            value={value.bookingHourRange.hourSecond}
            onChange={(nextHourSecond) =>
              setValue(
                "bookingHourRange",
                { ...value.bookingHourRange, hourSecond: nextHourSecond },
                { shouldDirty: true, shouldValidate: true },
              )
            }
            status={
              errors.bookingHourRange?.hourSecond?.message ? "error" : undefined
            }
            statusText={
              errors.bookingHourRange?.hourSecond?.message
                ? String(errors.bookingHourRange.hourSecond.message)
                : undefined
            }
          />
        </div>
      </div>
    </Card>
  );
};
