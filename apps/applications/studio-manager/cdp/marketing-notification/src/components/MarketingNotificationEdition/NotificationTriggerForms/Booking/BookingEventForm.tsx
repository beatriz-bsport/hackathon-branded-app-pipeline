import { ControlledForm, useFormController } from "@bsport/form";
import { Button, Divider, Title } from "@bsport/kaizen-primitive-core";

import { BookingNotificationTriggerField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingNotificationTriggerField";
import { useTranslation } from "#src/utils/i18n";
import { bookingTriggerConfigValidationSchema } from "#src/utils/schemas/bookingTriggerConfigValidation";
import type { SelectableNotificationType } from "#src/utils/types";

import { BookingTimingField } from "./BookingTimingField";
import {
  BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND,
  BOOKING_STATUS_PRESENT,
  BOOKING_TEMPORALITY_BEFORE,
  BOOKING_TIME_UNIT_HOUR,
} from "./types";

const DEFAULT_BOOKING_OCCURRENCE = 0;
const DEFAULT_TIMING_VALUE = 0;

type BookingEventFormProps = {
  itemIds: number[];
  notificationType: SelectableNotificationType;
};

export const BookingEventForm = ({
  itemIds,
  notificationType,
}: BookingEventFormProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const methods = useFormController({
    schema: bookingTriggerConfigValidationSchema,
    mode: "onBlur",
    defaultValues: {
      notificationType,
      bookingItemId: itemIds[0],
      bookingOccurrence: DEFAULT_BOOKING_OCCURRENCE,
      bookingEventKind:
        BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[BOOKING_STATUS_PRESENT],
      timingUnit: BOOKING_TIME_UNIT_HOUR,
      timingValue: DEFAULT_TIMING_VALUE,
      timingTemporality: BOOKING_TEMPORALITY_BEFORE,
    },
  });

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h3" weight="strong">
        {t("steps.notificationRules.title")}
      </Title>
      <ControlledForm
        {...methods}
        onSubmit={(data) => console.log("data for the booking form", data)}
        className="flex flex-col gap-sm"
      >
        <BookingNotificationTriggerField {...methods} />
        <Divider orientation="horizontal" weight="thin" />
        <BookingTimingField {...methods} />
        <Button
          intent="call-to-action"
          color="main"
          size="md"
          label="Check form"
          onClick={() => {
            console.log("form values : ", methods.getValues());
          }}
        />
      </ControlledForm>
    </div>
  );
};
