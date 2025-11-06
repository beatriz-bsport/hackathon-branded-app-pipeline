import { useEffect } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Divider, TextFieldProps, Title } from "@bsport/kaizen-primitive-core";

import {
  NOTIFICATION_TRIGGER_STEP_IDENTIFIER,
  useFormStepContext,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import { BookingNotificationTriggerField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingNotificationTriggerField";
import { BookingTimingField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingTimingField";
import {
  BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND,
  BOOKING_STATUS_PRESENT,
  BOOKING_TEMPORALITY_BEFORE,
  BOOKING_TIME_UNIT_HOUR,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import {
  SmartlistsFormField,
  type SmartlistsSelectorType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/SmartlistsFormField";
import { useTranslation } from "#src/utils/i18n";
import { bookingTriggerConfigValidationSchema } from "#src/utils/schemas/bookingTriggerConfigValidation";
import type { SelectableNotificationType } from "#src/utils/types";

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
  const { setStepValid, updateForm } = useFormStepContext();
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

  const {
    getValues: getFormValues,
    setValue: setFormValue,
    trigger: trigggerFormValidationCheck,
    watch: watchFormValue,
    formState: { isValid, errors },
  } = methods;

  const toggleIncludedSmartlistsSelector = watchFormValue(
    "toggleIncludedSmartlists",
  );
  const toggleExcludedSmartlistsSelector = watchFormValue(
    "toggleExcludedSmartlists",
  );

  const handleSmartlistsUpdate = ({
    type,
    smartlistIds,
  }: {
    type: SmartlistsSelectorType;
    smartlistIds: number[];
  }) => {
    if (type === "included") {
      setFormValue("includedSmartlists", smartlistIds, {
        shouldValidate: true,
      });
    } else if (type === "excluded") {
      setFormValue("excludedSmartlists", smartlistIds, {
        shouldValidate: true,
      });
    }
  };

  const handleToggleSmartlistSelector = ({
    type,
    checked,
  }: {
    type: SmartlistsSelectorType;
    checked: boolean;
  }) => {
    if (type === "included") {
      setFormValue("toggleIncludedSmartlists", checked);
      if (!checked) {
        setFormValue("includedSmartlists", [], {
          shouldValidate: true,
        });
      }
    } else if (type === "excluded") {
      setFormValue("toggleExcludedSmartlists", checked);
      if (!checked) {
        setFormValue("excludedSmartlists", [], {
          shouldValidate: true,
        });
      }
    }
  };

  const getSmartlistSelectorTextfieldProps = (
    smartlistType: SmartlistsSelectorType,
  ): TextFieldProps => {
    if (smartlistType === "included") {
      return {
        id: "marketing-notification-included-smartlists-selector-input",
        statusText: errors.includedSmartlists?.message,
        status: errors.includedSmartlists?.message ? "error" : "default",
        onBlur: () => trigggerFormValidationCheck("includedSmartlists"),
      };
    }
    return {
      id: "marketing-notification-excluded-smartlists-selector-input",
      statusText: errors.excludedSmartlists?.message,
      status: errors.excludedSmartlists?.message ? "error" : "default",
      onBlur: () => trigggerFormValidationCheck("excludedSmartlists"),
    };
  };

  useEffect(() => {
    setStepValid(NOTIFICATION_TRIGGER_STEP_IDENTIFIER, isValid);
  }, [isValid]);

  useEffect(() => {
    return () => {
      const formValues = getFormValues();
      updateForm({
        triggerCondition: {
          type: "booking",
          ...formValues,
        },
      });
    };
  }, []);

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
        <BookingNotificationTriggerField setFormValue={setFormValue} />
        <Divider orientation="horizontal" weight="thin" />
        <BookingTimingField
          setFormValue={setFormValue}
          watchFormValue={watchFormValue}
        />
        <Divider orientation="horizontal" weight="thin" />
        <SmartlistsFormField
          onSmartlistsChange={handleSmartlistsUpdate}
          onToggleField={handleToggleSmartlistSelector}
          excludedSmartlistsTextfieldProps={getSmartlistSelectorTextfieldProps(
            "excluded",
          )}
          includedSmartlistsTextfieldProps={getSmartlistSelectorTextfieldProps(
            "included",
          )}
          isIncludedSmartlistsEnabled={toggleIncludedSmartlistsSelector}
          isExcludedSmartlistsEnabled={toggleExcludedSmartlistsSelector}
        />
      </ControlledForm>
    </div>
  );
};
