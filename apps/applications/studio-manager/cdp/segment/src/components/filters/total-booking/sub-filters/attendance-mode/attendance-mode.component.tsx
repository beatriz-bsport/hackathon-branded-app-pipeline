import { Body, Button, Card, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";
import { TOTAL_BOOKING_ATTENDANCE_MODE_RADIO } from "./constants";

/**
 * Narrows the booking count to reservations marked present or absent on the
 * reservation record, matching backend `attendance_filter_active` /
 * `attendance`.
 */
export const AttendanceModeSubFilterSection = ({
  id,
  value,
  setValue,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  const radioGroupId = `${id}-attendance-mode`;
  const selectedRadioValue = value.attendanceMode.attendance
    ? TOTAL_BOOKING_ATTENDANCE_MODE_RADIO.present
    : TOTAL_BOOKING_ATTENDANCE_MODE_RADIO.absent;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isPresentMode =
      event.target.value === TOTAL_BOOKING_ATTENDANCE_MODE_RADIO.present;
    setValue(
      "attendanceMode",
      { attendance: isPresentMode },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <Body size="lg" weight="strong">
            {t("filters.22.subFilters.attendanceMode")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="sm"
            label={t("filters.22.actions.removeSubFilter", {
              subFilterLabel: t("filters.22.subFilters.attendanceMode"),
            })}
            intent="flat"
            color="default"
            onClick={onRemove}
          />
        </div>

        <RadioGroup
          id={radioGroupId}
          label={t("filters.22.fields.attendanceMode.radioLabel")}
          options={[
            {
              value: TOTAL_BOOKING_ATTENDANCE_MODE_RADIO.present,
              label: t("filters.22.fields.attendanceMode.present"),
            },
            {
              value: TOTAL_BOOKING_ATTENDANCE_MODE_RADIO.absent,
              label: t("filters.22.fields.attendanceMode.absent"),
            },
          ]}
          value={selectedRadioValue}
          onChange={onChange}
        />
      </div>
    </Card>
  );
};
