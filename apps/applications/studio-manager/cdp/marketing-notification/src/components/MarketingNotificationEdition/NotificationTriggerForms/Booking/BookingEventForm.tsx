import { useEffect } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Button, Divider, Title } from "@bsport/kaizen-primitive-core";

import { BookingNotificationTriggerField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingNotificationTriggerField";
import { useTranslation } from "#src/utils/i18n";
import { bookingTriggerConfigValidationSchema } from "#src/utils/schemas/bookingTriggerConfigValidation";
import type { SelectableNotificationType } from "#src/utils/types";

import {
  NOTIFICATION_TYPE_STEP_IDENTIFIER,
  useFormStepContext,
} from "../../Context/FormStepContext.context";
import { SmartlistsFormField } from "../Common/SmartlistsFormField";
import { BookingTimingField } from "./BookingTimingField";
import {
  BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND,
  BOOKING_STATUS_PRESENT,
  BOOKING_TEMPORALITY_BEFORE,
  BOOKING_TIME_UNIT_HOUR,
} from "./types";

const DEFAULT_BOOKING_OCCURRENCE = 0;
const DEFAULT_TIMING_VALUE = 1;

type BookingEventFormProps = {
  itemIds: number[];
  notificationType: SelectableNotificationType;
};

export const BookingEventForm = ({
  itemIds,
  notificationType,
}: BookingEventFormProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { setStepValid } = useFormStepContext();
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
      toggleIncludedSmartlists: false,
      includedSmartlists: [],
      toggleExcludedSmartlists: false,
      excludedSmartlists: [],
    },
  });

  const toggleIncludedSmartlistsSelector = methods.watch(
    "toggleIncludedSmartlists",
  );
  const toggleExcludedSmartlistsSelector = methods.watch(
    "toggleExcludedSmartlists",
  );

  useEffect(() => {
    setStepValid(NOTIFICATION_TYPE_STEP_IDENTIFIER, methods.formState.isValid);
  }, [methods.formState.isValid]);

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
        <Divider orientation="horizontal" weight="thin" />
        <SmartlistsFormField
          onSmartlistsChange={({ type, smartlists }) => {
            if (type === "included") {
              methods.setValue("includedSmartlists", smartlists, {
                shouldValidate: true,
              });
            } else if (type === "excluded") {
              methods.setValue("excludedSmartlists", smartlists, {
                shouldValidate: true,
              });
            }
          }}
          onToggleField={({ type, checked }) => {
            if (type === "included") {
              methods.setValue("toggleIncludedSmartlists", checked);
              if (!checked) {
                methods.setValue("includedSmartlists", [], {
                  shouldValidate: true,
                });
              }
            } else if (type === "excluded") {
              methods.setValue("toggleExcludedSmartlists", checked);
              if (!checked) {
                methods.setValue("excludedSmartlists", [], {
                  shouldValidate: true,
                });
              }
            }
          }}
          excludedSmartlistsSelectorTextfieldProps={{
            id: "marketing-notification-excluded-smartlists-selector-input",
            statusText: methods.formState.errors.excludedSmartlists?.message,
            status: methods.formState.errors.excludedSmartlists?.message
              ? "error"
              : "default",
            onBlur: () => methods.trigger("excludedSmartlists"),
          }}
          includedSmartlistsSelectorTextfieldProps={{
            id: "marketing-notification-included-smartlists-selector-input",
            statusText: methods.formState.errors.includedSmartlists?.message,
            status: methods.formState.errors.includedSmartlists?.message
              ? "error"
              : "default",
            onBlur: () => methods.trigger("includedSmartlists"),
          }}
          isIncludedSmartlistsSelectorToggle={toggleIncludedSmartlistsSelector}
          isExcludedSmartlistsSelectorToggle={toggleExcludedSmartlistsSelector}
        />
        <Button
          intent="call-to-action"
          color="main"
          size="md"
          label="Check form"
          onClick={() => {
            console.log("form values : ", methods.getValues());
            console.log("form values : ", methods.formState.isValid);
          }}
        />
      </ControlledForm>
    </div>
  );
};
