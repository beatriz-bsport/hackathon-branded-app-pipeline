import { Body, Button } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalAppointmentsSubFilterSectionProps } from "../total-appointments-sub-filter-section-props";

/**
 * Appointment date scope for the total appointments count, using the shared
 * fixed-or-relative date primitive (mirrors total booking session dates).
 */
export const BookingDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalAppointmentsSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {t("filters.26.subFilters.appointmentDate")}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.26.actions.removeSubFilter", {
            subFilterLabel: t("filters.26.subFilters.appointmentDate"),
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
  );
};
