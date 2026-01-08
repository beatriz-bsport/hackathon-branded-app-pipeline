import { useEffect } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import {
  Divider,
  type TextFieldProps,
  Title,
} from "@bsport/kaizen-primitive-core";

import {
  NOTIFICATION_TRIGGER_STEP_IDENTIFIER,
  useFormStepContext,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import { BookingNotificationTriggerField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingNotificationTriggerField";
import {
  BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND,
  BOOKING_STATUS_PRESENT,
  BOOKING_TEMPORALITY_BEFORE,
  BOOKING_TIME_UNIT_HOUR,
  DEFAULT_BOOKING_OCCURRENCE,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { getBookingFormData } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/utils";
import {
  SmartlistsFormField,
  type SmartlistsSelectorType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/SmartlistsFormField";
import { TimingField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/TimingField";
import {
  DEFAULT_TIMING_VALUE,
  TemporalityType,
  TimeUnitType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/types";
import { useTranslation } from "#src/utils/i18n";
import { bookingTriggerConfigValidationSchema } from "#src/utils/schemas/bookingTriggerConfigValidation";
import type { SelectableNotificationType } from "#src/utils/types";

type BookingEventFormProps = {
  itemIds: number[];
  notificationType: SelectableNotificationType;
};

export const BookingEventForm = ({
  itemIds,
  notificationType,
}: BookingEventFormProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { formData, setStepValid, updateForm } = useFormStepContext();
  const bookingFormData = getBookingFormData(formData?.triggerCondition);
  const methods = useFormController({
    schema: bookingTriggerConfigValidationSchema,
    mode: "all",
    defaultValues: {
      notificationType,
      bookingItemId: itemIds[0],
      bookingOccurrence:
        bookingFormData?.bookingOccurrence || DEFAULT_BOOKING_OCCURRENCE,
      bookingEventKind:
        bookingFormData?.bookingEventKind ||
        BOOKING_STATUS_MAP_TO_BOOKING_EVENT_KIND[BOOKING_STATUS_PRESENT],
      timingUnit: bookingFormData?.timingUnit || BOOKING_TIME_UNIT_HOUR,
      timingValue: bookingFormData?.timingValue || DEFAULT_TIMING_VALUE,
      timingTemporality:
        bookingFormData?.timingTemporality || BOOKING_TEMPORALITY_BEFORE,
      toggleIncludedSmartlists:
        bookingFormData?.toggleIncludedSmartlists || false,
      includedSmartlists: bookingFormData?.includedSmartlists || [],
      toggleExcludedSmartlists:
        bookingFormData?.toggleExcludedSmartlists || false,
      excludedSmartlists: bookingFormData?.excludedSmartlists || [],
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

  const handleUpdateTimingValue = (updatedValue: number) => {
    setFormValue("timingValue", updatedValue, { shouldValidate: true });
  };

  const handleUpdateTimingTemporality = (
    updatedTemporality: TemporalityType,
  ) => {
    setFormValue("timingTemporality", updatedTemporality, {
      shouldValidate: true,
    });
  };

  const handleUpdateTimingUnit = (updatedUnit: TimeUnitType) => {
    setFormValue("timingUnit", updatedUnit, { shouldValidate: true });
  };

  useEffect(() => {
    setStepValid(NOTIFICATION_TRIGGER_STEP_IDENTIFIER, isValid);
  }, [isValid]);

  const formValues = getFormValues();

  useEffect(() => {
    updateForm({
      triggerCondition: {
        type: "booking",
        ...formValues,
      },
    });
  }, [
    formValues?.bookingEventKind,
    formValues?.bookingItemId,
    formValues?.bookingOccurrence,
    formValues?.excludedSmartlists,
    formValues?.includedSmartlists,
    formValues?.notificationType,
    formValues?.timingTemporality,
    formValues?.timingUnit,
    formValues?.timingValue,
    formValues?.toggleExcludedSmartlists,
    formValues?.toggleIncludedSmartlists,
  ]);

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h3" weight="strong">
        {t("steps.notificationRules.title")}
      </Title>
      <ControlledForm
        {...methods}
        onSubmit={() => {}}
        className="flex flex-col gap-sm"
      >
        <BookingNotificationTriggerField
          setFormValue={setFormValue}
          defaultBookingOccurence={formValues?.bookingOccurrence}
          defaultBookingStatus={formValues?.bookingEventKind}
        />
        <Divider orientation="horizontal" weight="thin" />
        <TimingField
          notificationType="booking"
          selectedTemporality={formValues?.timingTemporality}
          selectedTimeUnit={formValues?.timingUnit}
          selectedTimeValue={formValues?.timingValue}
          updateTimingTemporality={handleUpdateTimingTemporality}
          updateTimingUnit={handleUpdateTimingUnit}
          updateTimingValue={handleUpdateTimingValue}
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
          selectedExcludedSmartlists={formValues?.excludedSmartlists}
          selectedIncludedSmartlists={formValues?.includedSmartlists}
        />
      </ControlledForm>
    </div>
  );
};
