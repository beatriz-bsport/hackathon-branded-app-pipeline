import { useEffect, useMemo } from "react";

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
} from "#src/components/MarketingNotificationBuilder/Context/FormStepContext.context";
import {
  TriggerTypeSelector,
  type TriggerTypeSelectorProps,
} from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/TriggerTypeSelector";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { triggerTypeValidationFormSchema } from "#src/utils/schemas/triggerTypeValidation";
import { type TriggerTypeValidationFormData } from "#src/utils/schemas/types";
import {
  APPOINTMENT_PASS_TYPE,
  APPOINTMENT_TYPE,
  BIRTHDAY_TYPE,
  ESTABLISHMENT_TYPE,
  GROUP_ACTIVITY_TYPE,
  LOCATION_TYPE,
  type NotificationType,
  PASS_TYPE,
  SUBSCRIPTION_TYPE,
  type TriggerTypeSelectorConfig,
  WORKSHOP_TYPE,
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
    type: NOTIFICATION_ADVANCED_TYPE.appointment,
    translationKey: "appointment",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.pass,
    translationKey: "pass",
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.appointmentPass,
    translationKey: "appointmentPass",
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

function isValidSelectableNotificationType(
  notificationType: string,
): notificationType is NotificationType {
  return (
    notificationType === GROUP_ACTIVITY_TYPE ||
    notificationType === WORKSHOP_TYPE ||
    notificationType === ESTABLISHMENT_TYPE ||
    notificationType === LOCATION_TYPE ||
    notificationType === APPOINTMENT_PASS_TYPE ||
    notificationType === PASS_TYPE ||
    notificationType === APPOINTMENT_TYPE ||
    notificationType === SUBSCRIPTION_TYPE ||
    notificationType === BIRTHDAY_TYPE
  );
}

export const TriggerTypeStep = () => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { formData, setStepValid, updateForm } = useFormStepContext();
  const { isBirthdayNotificationSet } =
    useGetMarketingNotificationDependenciesData();

  const initialNotificationType =
    formData?.triggerType?.notificationType ??
    NOTIFICATION_ADVANCED_TYPE.groupActivity;

  const defaultItemIds = formData?.triggerType?.itemIds ?? [];

  const methods = useFormController({
    mode: "onBlur",
    schema: triggerTypeValidationFormSchema,
    values: {
      itemIds: defaultItemIds,
      notificationType: initialNotificationType,
      shouldContainAllPasses:
        formData?.triggerType?.shouldContainAllPasses ?? false,
    },
  });

  const {
    setValue: setFormValue,
    trigger: trigggerFormValidationCheck,
    watch: watchFormValues,
    formState: { isValid, errors },
  } = methods;

  // Watch notificationType from form to get reactive updates
  const watchedNotificationType =
    watchFormValues("notificationType") ?? initialNotificationType;
  // Watch notificationType from form to get reactive updates
  const watchedItemsIds = watchFormValues("itemIds") ?? defaultItemIds;
  const watchedShouldContainAllPasses = watchFormValues(
    "shouldContainAllPasses",
  );

  const triggerList = isBirthdayNotificationSet
    ? TRIGGER_CONFIG.filter((trigger) => trigger.type !== "birthday")
    : TRIGGER_CONFIG;

  // Memoized computations
  const { selectOptions, selectedConfig } = useMemo(() => {
    const options = triggerList.map((config) => ({
      id: config.type,
      label: String(
        t(
          //@ts-expect-error bad management of dynamic keys
          `steps.triggerType.notificationType.choices.${config.translationKey}`,
        ),
      ),
    }));
    const currentConfig = triggerList.find(
      (config) => config.type === watchedNotificationType,
    );

    return {
      selectOptions: options,
      selectedConfig: currentConfig,
    };
  }, [watchedNotificationType, triggerList]);

  const handleSelectTriggerItems = ({ itemIds }: { itemIds: number[] }) => {
    setFormValue("itemIds", itemIds, {
      shouldValidate: true,
    });
    if (
      watchedNotificationType === PASS_TYPE ||
      watchedNotificationType === APPOINTMENT_PASS_TYPE
    ) {
      setFormValue("shouldContainAllPasses", false, {
        shouldValidate: true,
      });
    }
    updateForm({
      ...formData,
      triggerType: {
        type: "triggerType",
        itemIds: itemIds,
        notificationType: watchedNotificationType,
        shouldContainAllPasses: false,
      },
    });
  };

  const handleTriggerSelect = (triggerType: string) => {
    setFormValue("itemIds", [], { shouldValidate: true });
    if (!isValidSelectableNotificationType(triggerType)) {
      console.warn(
        "[Marketing Notification Builder] Trigger type is not a valid selectable notification type",
      );
      return;
    }
    setFormValue("notificationType", triggerType, { shouldValidate: true });
    updateForm({
      ...formData,
      triggerType: {
        type: "triggerType",
        itemIds: [],
        shouldContainAllPasses: false,
        notificationType: triggerType,
      },
    });
  };

  useEffect(() => {
    setStepValid(NOTIFICATION_TYPE_STEP_IDENTIFIER, isValid);
  }, [isValid]);

  return (
    <div className="flex flex-col gap-md w-full">
      <Title htmlVariant="h3">{t("steps.triggerType.title")}</Title>
      <ControlledForm
        id="trigger-type-validation-form"
        onSubmit={() => {}}
        {...methods}
        className="flex flex-col gap-md w-full"
      >
        <FormField<
          TriggerTypeValidationFormData,
          "notificationType",
          SelectProps
        >
          name="notificationType"
          mapProps={({ defaultProps, fieldState }) => ({
            ...defaultProps,
            errorText: fieldState.error?.message,
            status: fieldState.error?.message ? "critical" : "default",
            onChange: (value) => {
              handleTriggerSelect(value);
            },
          })}
        >
          <Select
            fullWidth
            label={t("steps.triggerType.notificationType.label")}
            id="notification-trigger-type-select"
            value={selectedConfig?.type}
            items={selectOptions}
          />
        </FormField>
        <FormField<
          TriggerTypeValidationFormData,
          "itemIds",
          TriggerTypeSelectorProps
        > name="itemIds">
          <TriggerTypeSelector
            selectedConfig={selectedConfig}
            onSelectTriggerType={handleSelectTriggerItems}
            selectedValues={
              watchedItemsIds?.length > 0 ? watchedItemsIds : undefined
            }
            textfieldProps={{
              id: "item-ids-selector-textfield",
              status: errors.itemIds ? "error" : "default",
              helperText: errors.itemIds ? errors.itemIds.message : undefined,
              onBlur: () => trigggerFormValidationCheck("itemIds"),
              disabled: !!watchedShouldContainAllPasses,
            }}
          />
        </FormField>
        {watchedNotificationType === PASS_TYPE ||
        watchedNotificationType === APPOINTMENT_PASS_TYPE ? (
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
                updateForm({
                  ...formData,
                  triggerType: {
                    type: "triggerType",
                    itemIds: [],
                    notificationType: watchedNotificationType,
                    shouldContainAllPasses: isChecked,
                  },
                });
              },
            })}
          >
            <Checkbox
              className="w-fit"
              id="checkbox-select-all-pass-notification"
              label={t(
                `steps.triggerType.selectAllPasses.checkbox.label.${watchedNotificationType}`,
              )}
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
