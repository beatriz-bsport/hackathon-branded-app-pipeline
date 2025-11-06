import { useEffect, useMemo, useState } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { Select, type SelectProps, Title } from "@bsport/kaizen-primitive-core";

import {
  NOTIFICATION_TYPE_STEP_IDENTIFIER,
  useFormStepContext,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import {
  TriggerTypeSelector,
  type TriggerTypeSelectorProps,
} from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/TriggerTypeSelector";
import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { triggerTypeValidationFormSchema } from "#src/utils/schemas/triggerTypeValidation";
import type { TriggerTypeValidationFormData } from "#src/utils/schemas/types";
import type {
  SelectableNotificationType,
  TriggerTypeSelectorConfig,
} from "#src/utils/types";

// Centralized configuration
const TRIGGER_CONFIG: TriggerTypeSelectorConfig[] = [
  {
    type: NOTIFICATION_ADVANCED_TYPE.groupActivity,
    translationKey: "groupActivity",
    mode: "groupActivity" as const,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.workshop,
    translationKey: "workshop",
    mode: "workshop" as const,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.establishment,
    translationKey: "establishment",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.location,
    translationKey: "location",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.privateService,
    translationKey: "privateService",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.paymentPack,
    translationKey: "paymentPack",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.privatePass,
    translationKey: "privatePass",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.subscription,
    translationKey: "subscription",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.birthday,
    translationKey: "birthday",
  },
] as const;

export const TriggerTypeStep = () => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { formData, setStepValid, updateForm } = useFormStepContext();
  const [selectedTriggerType, setSelectedTriggerType] =
    useState<SelectableNotificationType>(
      formData.triggerType?.notificationType ??
        NOTIFICATION_ADVANCED_TYPE.groupActivity,
    );

  const defaultValues: TriggerTypeValidationFormData = {
    itemIds: formData.triggerType?.itemIds ?? [],
    notificationType:
      formData.triggerType?.notificationType ??
      NOTIFICATION_ADVANCED_TYPE.groupActivity,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: triggerTypeValidationFormSchema,
    defaultValues,
  });

  const {
    getValues: getFormValues,
    setValue: setFormValue,
    trigger: trigggerFormValidationCheck,
    formState: { isValid, errors },
  } = methods;

  // Memoized computations
  const { selectOptions, translationToTypeMap, selectedConfig } =
    useMemo(() => {
      const options = TRIGGER_CONFIG.map((config) => ({
        id: config.type,
        label: String(
          t(
            //@ts-expect-error bad management of dynamic keys
            `steps.triggerType.notificationType.choices.${config.translationKey}`,
          ),
        ),
      }));

      const translationMap = TRIGGER_CONFIG.reduce(
        (acc, config) => {
          const translation = String(
            t(
              //@ts-expect-error bad management of dynamic keys
              `steps.triggerType.notificationType.choices.${config.translationKey}`,
            ),
          );

          acc[translation] = config.type;
          return acc;
        },
        {} as Record<string, SelectableNotificationType>,
      );

      const currentConfig = TRIGGER_CONFIG.find(
        (config) => config.type === selectedTriggerType,
      );

      return {
        selectOptions: options,
        translationToTypeMap: translationMap,
        selectedConfig: currentConfig,
      };
    }, [selectedTriggerType]);

  const handleSelectTriggerItems = ({ itemIds }: { itemIds: number[] }) => {
    setFormValue("itemIds", itemIds, {
      shouldValidate: true,
    });
    setStepValid(NOTIFICATION_TYPE_STEP_IDENTIFIER, isValid);
  };

  const handleTriggerSelect = (translationLabel: string) => {
    const triggerType = translationToTypeMap[translationLabel];
    setSelectedTriggerType(triggerType);
    setStepValid(NOTIFICATION_TYPE_STEP_IDENTIFIER, isValid);
    setFormValue("notificationType", triggerType, { shouldValidate: true });
    trigggerFormValidationCheck("itemIds");
  };

  const currentLabel = selectedConfig
    ? String(
        t(
          //@ts-expect-error bad management of dynamic keys
          `steps.triggerType.notificationType.choices.${selectedConfig.translationKey}`,
          { returnObjects: false },
        ),
      )
    : "";

  useEffect(() => {
    setStepValid(NOTIFICATION_TYPE_STEP_IDENTIFIER, isValid);
  }, []);

  useEffect(() => {
    return () => {
      const formValues = getFormValues();
      updateForm({
        triggerType: {
          type: "triggerType",
          itemIds: formValues.itemIds ?? [],
          notificationType: formValues.notificationType,
        },
      });
    };
  }, []);

  return (
    <div className="flex flex-col gap-md w-full">
      <Title htmlVariant="h3">{t("steps.triggerType.title")}</Title>
      <ControlledForm
        id="trigger-type-validation-form"
        onSubmit={(data: TriggerTypeValidationFormData) => console.log(data)}
        {...methods}
      >
        <FormField<
          TriggerTypeValidationFormData,
          "notificationType",
          SelectProps
        >
          name="notificationType"
          mapProps={({ defaultProps, fieldState }) => ({
            ...defaultProps,
            value: currentLabel,
            errorText: fieldState.error?.message,
            status: fieldState.error?.message ? "critical" : "default",
          })}
        >
          <Select
            fullWidth
            label={t("steps.triggerType.notificationType.label")}
            id="notification-trigger-type-select"
            value={currentLabel}
            items={selectOptions}
            onSelect={handleTriggerSelect}
          />
        </FormField>
        <FormField<
          TriggerTypeValidationFormData,
          "itemIds",
          TriggerTypeSelectorProps
        >
          name="itemIds"
          mapProps={({ defaultProps, field }) => ({
            ...defaultProps,
            key:
              selectedConfig?.type === NOTIFICATION_ADVANCED_TYPE.paymentPack ||
              selectedConfig?.type === NOTIFICATION_ADVANCED_TYPE.privatePass
                ? undefined
                : field.value,
            selectedValues: field.value,
          })}
        >
          <TriggerTypeSelector
            selectedConfig={selectedConfig}
            onSelectTriggerType={handleSelectTriggerItems}
            textfieldProps={{
              id: "item-ids-selector-textfield",
              status: errors.itemIds ? "error" : "default",
              helperText: errors.itemIds ? errors.itemIds.message : undefined,
              onBlur: () => trigggerFormValidationCheck("itemIds"),
            }}
          />
        </FormField>
      </ControlledForm>
    </div>
  );
};
