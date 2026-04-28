import { type FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";

import { FormTimeInputRow } from "#src/components/class-form/shared/form-time-input-row";
import { type ClassFormValues, fieldIdPrefix } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

import { FormSection } from "../shared/form-section";
import { FormSectionHeader } from "../shared/form-section-header";

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;
const HIGH_LAST_BOOKING_THRESHOLD_MINUTES = 120;

const toTotalMinutes = (value: ClassFormValues["last_booking_minutes"]) =>
  (value.days ?? 0) * MINUTES_PER_DAY +
  (value.hours ?? 0) * MINUTES_PER_HOUR +
  (value.minutes ?? 0);

export const BookingWindowSection: FC = () => {
  const { t } = useTranslation("add-edit-form");
  const { watch } = useFormContext<ClassFormValues>();

  const lastBookingValue = watch("last_booking_minutes");
  const firstBookingUntilValue = watch("first_booking_minutes_until");

  const lastBookingTotalMinutes = toTotalMinutes(lastBookingValue);
  const firstBookingUntilTotalMinutes = toTotalMinutes(firstBookingUntilValue);

  return (
    <FormSection>
      <FormSectionHeader
        title={t("addEditForm.bookingWindow.title")}
        description={t("addEditForm.bookingWindow.description")}
      />
      <div className="flex flex-col gap-lg">
        <div className="flex flex-col gap-sm w-[360px]">
          <FormSectionHeader
            level="h5"
            title={t("addEditForm.bookingWindow.opening.title")}
            description={t("addEditForm.bookingWindow.opening.description")}
          />
          <FormTimeInputRow
            idPrefix={`${fieldIdPrefix}-booking-window-opening`}
            fieldName="first_booking_minutes_until"
          />
          {firstBookingUntilTotalMinutes === 0 && (
            <Alert status="warning" type="weak">
              {t("addEditForm.bookingWindow.warnings.nullFirstBookingUntil")}
            </Alert>
          )}
          {firstBookingUntilTotalMinutes > 0 &&
            firstBookingUntilTotalMinutes < MINUTES_PER_DAY && (
              <Alert status="warning" type="weak">
                {t("addEditForm.bookingWindow.warnings.lowFirstBookingUntil")}
              </Alert>
            )}
        </div>
        <div className="flex flex-col gap-sm w-[360px]">
          <FormSectionHeader
            level="h5"
            title={t("addEditForm.bookingWindow.closing.title")}
            description={t("addEditForm.bookingWindow.closing.description")}
          />
          <FormTimeInputRow
            idPrefix={`${fieldIdPrefix}-booking-window-closing`}
            fieldName="last_booking_minutes"
          />
          {lastBookingTotalMinutes > HIGH_LAST_BOOKING_THRESHOLD_MINUTES && (
            <Alert status="warning" type="weak">
              {t("addEditForm.bookingWindow.warnings.highLastBooking")}
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-sm w-[360px]">
          <FormSectionHeader
            level="h5"
            title={t("addEditForm.bookingWindow.cancellation.title")}
            description={t(
              "addEditForm.bookingWindow.cancellation.description",
            )}
          />
          <FormTimeInputRow
            idPrefix={`${fieldIdPrefix}-cancellation-policy`}
            fieldName="last_discard_minutes"
          />
        </div>
      </div>
    </FormSection>
  );
};
