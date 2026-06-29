import { Body, Button, TimePicker } from "@bsport/kaizen-primitive-core";

import { normalizeBookingHourRangeFormValue } from "#src/components/filters/shared/booking-hour-range/normalize-booking-hour-range";
import { useTranslation } from "#src/utils/i18n";

import {
  BOOKING_HOUR_RANGE_DEFAULT_HOUR,
  BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../../constants";
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
  const normalizedBookingHourRange = normalizeBookingHourRangeFormValue(
    value.bookingHourRange,
    {
      hour: BOOKING_HOUR_RANGE_DEFAULT_HOUR,
      hourSecond: BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
    },
  );
  return (
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
          value={normalizedBookingHourRange.hour}
          onChange={(nextHour) =>
            setValue(
              "bookingHourRange",
              { ...value.bookingHourRange, hour: nextHour },
              { shouldDirty: true, shouldValidate: true },
            )
          }
          status={errors.bookingHourRange?.hour?.message ? "error" : undefined}
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
          value={normalizedBookingHourRange.hourSecond}
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
  );
};
