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
import { useTranslation } from "#src/utils/i18n";
import { passTriggerConfigValidationSchema } from "#src/utils/schemas/passTriggerConfigValidation";
import { PassesType } from "#src/utils/schemas/types";

import { PassNotificationTriggerField } from "./PassNotificationTriggerField";
import {
  DEFAULT_PASS_EVENT_OCCURENCE,
  PASS_ACTION_CREDITS_LEFT,
  PASS_CREDITS_LEFT_BOOKING_COMPLETED,
} from "./types";
import { getPassFormData } from "./utils";

type PassEventFormProps = {
  passType: PassesType;
  itemIds: number[];
};

export const PassEventForm = ({ itemIds, passType }: PassEventFormProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { setStepValid, updateForm, formData } = useFormStepContext();
  const passFormData = getPassFormData(formData?.triggerCondition);
  const methods = useFormController({
    schema: passTriggerConfigValidationSchema,
    mode: "onBlur",
    defaultValues: {
      passIds: itemIds,
      name: passFormData?.name || undefined,
      passEventAction:
        passFormData?.passEventAction || PASS_ACTION_CREDITS_LEFT,
      shouldContainAllPasses:
        formData.triggerType?.shouldContainAllPasses || false,
      creditsLeft: passFormData?.creditsLeft || DEFAULT_PASS_EVENT_OCCURENCE,
      hours: passFormData?.hours || 0,
      creditsEventKind:
        passFormData?.creditsEventKind || PASS_CREDITS_LEFT_BOOKING_COMPLETED,
      daysLeft: passFormData?.daysLeft || DEFAULT_PASS_EVENT_OCCURENCE,
      disabledInContract: passFormData?.disabledInContract || false,
      isPassExpirationCheck: passFormData?.isPassExpirationCheck || false,
      toggleIncludedSmartlists: passFormData?.toggleIncludedSmartlists || false,
      includedSmartlists: passFormData?.includedSmartlists || [],
      toggleExcludedSmartlists: passFormData?.toggleExcludedSmartlists || false,
      excludedSmartlists: passFormData?.excludedSmartlists || [],
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

  const formValues = getFormValues();

  useEffect(() => {
    updateForm({
      triggerCondition: {
        type: passType,
        ...formValues,
      },
    });
  }, [
    formValues?.creditsLeft,
    formValues?.daysLeft,
    formValues?.disabledInContract,
    formValues?.isPassExpirationCheck,
    formValues?.excludedSmartlists,
    formValues?.includedSmartlists,
    formValues?.name,
    formValues?.creditsEventKind,
    formValues?.creditsEventKind,
    formValues?.passEventAction,
    formValues?.passIds,
    formValues?.passesType,
    formValues?.shouldContainAllPasses,
    formValues?.toggleExcludedSmartlists,
    formValues?.toggleIncludedSmartlists,
  ]);

  return (
    <div className="flex flex-col gap-md w-full">
      <Title htmlVariant="h3" weight="strong">
        {t("steps.notificationRules.title")}
      </Title>
      <ControlledForm
        {...methods}
        onSubmit={() => {}}
        className="flex flex-col gap-sm"
      >
        <PassNotificationTriggerField
          passType={passType}
          errors={errors}
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
          selectedExcludedSmartlists={formValues?.excludedSmartlists}
          selectedIncludedSmartlists={formValues?.includedSmartlists}
        />
      </ControlledForm>
    </div>
  );
};
