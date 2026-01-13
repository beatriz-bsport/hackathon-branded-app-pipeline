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
import {
  SmartlistsFormField,
  type SmartlistsSelectorType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/SmartlistsFormField";
import { TimingField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/TimingField";
import {
  DEFAULT_TIMING_VALUE,
  TEMPORALITY_BEFORE,
  TIME_UNIT_HOUR,
  type TemporalityType,
  type TimeUnitType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/types";
import { SubscriptionNotificationStatusField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Subscription/SubscriptionNotificationStatusField";
import {
  DEFAULT_SUBSCRIPTION_EVENT_KIND,
  SUBSCRIPTIONS_EVENT_KIND_MAP_TO_SUBSCRIPTION_STATUS,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Subscription/types";
import { getSubscriptionFormData } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Subscription/utils";
import { useTranslation } from "#src/utils/i18n";
import { subscriptionTriggerConfigValidationSchema } from "#src/utils/schemas/subscriptionTriggerConfigValidation";

type SubscriptionEventFormProps = {
  itemIds: number[];
};

export const SubscriptionEventForm = ({
  itemIds,
}: SubscriptionEventFormProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { setStepValid, updateForm, formData } = useFormStepContext();
  const subscriptionsFormData = getSubscriptionFormData(
    formData?.triggerCondition,
  );
  const methods = useFormController({
    schema: subscriptionTriggerConfigValidationSchema,
    mode: "onBlur",
    defaultValues: {
      contractId: itemIds[0],
      subscriptionEventKind:
        subscriptionsFormData?.subscriptionEventKind ||
        DEFAULT_SUBSCRIPTION_EVENT_KIND,
      timingUnit: subscriptionsFormData?.timingUnit || TIME_UNIT_HOUR,
      timingValue: subscriptionsFormData?.timingValue || DEFAULT_TIMING_VALUE,
      timingTemporality:
        subscriptionsFormData?.timingTemporality || TEMPORALITY_BEFORE,
      toggleIncludedSmartlists:
        subscriptionsFormData?.toggleIncludedSmartlists || false,
      includedSmartlists: subscriptionsFormData?.includedSmartlists || [],
      toggleExcludedSmartlists:
        subscriptionsFormData?.toggleExcludedSmartlists || false,
      excludedSmartlists: subscriptionsFormData?.excludedSmartlists || [],
    },
  });

  const {
    getValues: getFormValues,
    setValue: setFormValue,
    trigger: triggerFormValidationCheck,
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
        onBlur: () => triggerFormValidationCheck("includedSmartlists"),
      };
    }
    return {
      id: "marketing-notification-excluded-smartlists-selector-input",
      statusText: errors.excludedSmartlists?.message,
      status: errors.excludedSmartlists?.message ? "error" : "default",
      onBlur: () => triggerFormValidationCheck("excludedSmartlists"),
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
        type: "subscription",
        ...formValues,
      },
    });
  }, [
    formValues?.subscriptionEventKind,
    formValues?.excludedSmartlists,
    formValues?.includedSmartlists,
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
        <SubscriptionNotificationStatusField
          setFormValue={setFormValue}
          selectedSubscriptionStatus={formValues?.subscriptionEventKind}
        />
        <Divider orientation="horizontal" weight="thin" />
        <TimingField
          notificationType={
            SUBSCRIPTIONS_EVENT_KIND_MAP_TO_SUBSCRIPTION_STATUS[
              formValues?.subscriptionEventKind
            ]
          }
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
