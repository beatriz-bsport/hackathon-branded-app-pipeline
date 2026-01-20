import { useEffect, useMemo, useState } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import {
  Checkbox,
  type CheckboxProps,
  Select,
  type SelectProps,
  Title,
} from "@bsport/kaizen-primitive-core";

import {
  NOTIFICATION_TYPE_STEP_IDENTIFIER,
  useFormStepContext,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import {
  TriggerTypeSelector,
  type TriggerTypeSelectorProps,
} from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/TriggerTypeSelector";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
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
  const [shouldRefreshItemSelector, setShouldRefreshItemSelector] =
    useState(false);
  const { formData, setStepValid, updateForm } = useFormStepContext();
  const { isBirthdayNotificationSet } =
    useGetMarketingNotificationDependenciesData();

  const notificationType =
    formData?.triggerType?.notificationType ??
    NOTIFICATION_ADVANCED_TYPE.groupActivity;

  const defaultItemIds = formData?.triggerType?.itemIds ?? [];

  const methods = useFormController({
    mode: "onBlur",
    schema: triggerTypeValidationFormSchema,
    values: {
      itemIds: defaultItemIds,
      notificationType,
      shouldContainAllPasses:
        formData?.triggerType?.shouldContainAllPasses ?? false,
    },
  });

  const {
    getValues: getFormValues,
    setValue: setFormValue,
    trigger: trigggerFormValidationCheck,
    formState: { isValid, errors },
  } = methods;

  const triggerList = isBirthdayNotificationSet
    ? TRIGGER_CONFIG.filter((trigger) => trigger.type !== "birthday")
    : TRIGGER_CONFIG;

  // Memoized computations
  const { selectOptions, translationToTypeMap, selectedConfig } =
    useMemo(() => {
      const options = triggerList.map((config) => ({
        id: config.type,
        label: String(
          t(
            //@ts-expect-error bad management of dynamic keys
            `steps.triggerType.notificationType.choices.${config.translationKey}`,
          ),
        ),
      }));

      const translationMap = triggerList.reduce(
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

      const currentConfig = triggerList.find(
        (config) => config.type === notificationType,
      );

      return {
        selectOptions: options,
        translationToTypeMap: translationMap,
        selectedConfig: currentConfig,
      };
    }, [notificationType, triggerList]);

  const handleSelectTriggerItems = ({ itemIds }: { itemIds: number[] }) => {
    setFormValue("itemIds", itemIds, {
      shouldValidate: true,
    });
    handleUpdateFormData();
  };

  const handleTriggerSelect = (translationLabel: string) => {
    const triggerType = translationToTypeMap[translationLabel];
    setFormValue("notificationType", triggerType, { shouldValidate: true });
    setFormValue("itemIds", [], { shouldValidate: true });
    handleUpdateFormData();
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
  }, [isValid]);

  const handleUpdateFormData = () => {
    const formValues = getFormValues();
    updateForm({
      ...formData,
      triggerType: {
        type: "triggerType",
        ...formValues,
      },
    });
  };

  return (
    <div className="flex flex-col gap-md w-full">
      <Title htmlVariant="h3">{t("steps.triggerType.title")}</Title>
      <ControlledForm
        id="trigger-type-validation-form"
        onSubmit={() => {}}
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
        > name="itemIds">
          <TriggerTypeSelector
            key={String(shouldRefreshItemSelector)}
            selectedConfig={selectedConfig}
            onSelectTriggerType={handleSelectTriggerItems}
            selectedValues={
              defaultItemIds?.length > 0 ? defaultItemIds : undefined
            }
            textfieldProps={{
              id: "item-ids-selector-textfield",
              status: errors.itemIds ? "error" : "default",
              helperText: errors.itemIds ? errors.itemIds.message : undefined,
              onBlur: () => trigggerFormValidationCheck("itemIds"),
            }}
          />
        </FormField>
        {notificationType === "privatePass" ||
        notificationType === "paymentPack" ? (
          <FormField<
            TriggerTypeValidationFormData,
            "shouldContainAllPasses",
            CheckboxProps
          >
            name="shouldContainAllPasses"
            mapProps={({ defaultProps, field, form }) => ({
              ...defaultProps,
              value: field.value ? "checked" : "unchecked",
              onChange: (isChecked: boolean) => {
                form.setValue("shouldContainAllPasses", isChecked, {
                  shouldValidate: true,
                });
                form.setValue("itemIds", [], { shouldValidate: true });
                setShouldRefreshItemSelector((prev) => !prev);
                form.trigger();
                handleUpdateFormData();
              },
            })}
          >
            <Checkbox
              id="checkbox-select-all-pass-notification"
              label={t("steps.triggerType.selectAllPasses.checkbox.label")}
              value={
                methods.getValues("shouldContainAllPasses")
                  ? "checked"
                  : "unchecked"
              }
            />
          </FormField>
        ) : null}
      </ControlledForm>
    </div>
  );
};
