import { useEffect, useId } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import {
  Select,
  type SelectProps,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { ToggleButtonGroup } from "#src/components/ToggleButtonGroup/ToggleButtonGroup";
import { SmsContent } from "#src/components/sms-content-generic-field/sms-content";
import { useTranslation } from "#src/utils/i18n";

import {
  SMS_AUTOMATION_EVENT_VALUES,
  SMS_AUTOMATION_MAX_NAME_LENGTH,
  SMS_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type SmsAutomationEventValue,
  type SmsAutomationFormData,
} from "./types";

type AutomationSmsFormProps = Omit<
  ControlledFormProps<SmsAutomationFormData>,
  "children"
> & {
  disabledEventKinds?: ReadonlySet<SmsAutomationEventValue>;
};

export const AutomationSmsForm: React.FC<AutomationSmsFormProps> = ({
  id,
  onSubmit,
  disabledEventKinds = new Set(),
  ...methods
}: AutomationSmsFormProps) => {
  const { t } = useTranslation("details");
  const { setValue, watch } = methods;
  const formIdPrefix = useId();
  const watchedEventKind = watch("eventKind");
  const watchedAutomationName = watch("automationName");

  const ids = {
    fields: {
      automationName: `${formIdPrefix}-field-automation-name`,
      condition: `${formIdPrefix}-field-condition`,
      limit: `${formIdPrefix}-field-limit`,
    },
  };

  const conditionOptions: Array<{
    value: SmsAutomationEventValue;
    label: string;
    icon: "log-in-03" | "log-out-01";
    disabled?: boolean;
  }> = [
    {
      value: SMS_AUTOMATION_EVENT_VALUES.ENTRY,
      label: t("automation.sms.form.condition.options.entry"),
      icon: "log-in-03",
      disabled: disabledEventKinds.has(SMS_AUTOMATION_EVENT_VALUES.ENTRY),
    },
    {
      value: SMS_AUTOMATION_EVENT_VALUES.EXIT,
      label: t("automation.sms.form.condition.options.exit"),
      icon: "log-out-01",
      disabled: disabledEventKinds.has(SMS_AUTOMATION_EVENT_VALUES.EXIT),
    },
  ];

  useEffect(() => {
    if (!disabledEventKinds.has(watchedEventKind)) {
      return;
    }

    const nextAvailableEventKind = [
      SMS_AUTOMATION_EVENT_VALUES.ENTRY,
      SMS_AUTOMATION_EVENT_VALUES.EXIT,
    ].find((eventKind) => !disabledEventKinds.has(eventKind));

    if (!nextAvailableEventKind) {
      return;
    }

    setValue("eventKind", nextAvailableEventKind, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [disabledEventKinds, setValue, watchedEventKind]);

  const triggerLimitOptions: SelectProps["items"] = [
    {
      id: SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
      label: t("automation.sms.form.triggerLimit.options.noLimit"),
    },
    {
      id: SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE,
      label: t("automation.sms.form.triggerLimit.options.once"),
    },
    {
      id: SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE,
      label: t("automation.sms.form.triggerLimit.options.twice"),
    },
    {
      id: SMS_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES,
      label: t("automation.sms.form.triggerLimit.options.threeTimes"),
    },
  ];

  return (
    <div className="flex flex-col gap-md p-0 md:p-md">
      <ControlledForm
        id={id}
        className="flex flex-col gap-md"
        onSubmit={onSubmit}
        {...methods}
      >
        <div className="flex flex-col gap-xs">
          <FormField<
            SmsAutomationFormData,
            "automationName"
          > name="automationName">
            <TextField
              id={ids.fields.automationName}
              label={t("automation.sms.form.automationName.label")}
              placeholder={t("automation.sms.form.automationName.placeholder")}
              required
              fullWidth
              maxLength={SMS_AUTOMATION_MAX_NAME_LENGTH}
              helperText={`${watchedAutomationName.length}/${SMS_AUTOMATION_MAX_NAME_LENGTH}`}
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-sm">
          <Title htmlVariant="h2" weight="strong">
            {t("automation.sms.sections.delivery")}
          </Title>
          <FormField<SmsAutomationFormData, "eventKind">
            name="eventKind"
            mapProps={({ field, form }) => ({
              value: field.value,
              onChangeValue: (nextValue: SmsAutomationEventValue) => {
                form.setValue("eventKind", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            })}
          >
            <ToggleButtonGroup<SmsAutomationEventValue>
              id={ids.fields.condition}
              label={t("automation.sms.form.condition.label")}
              options={conditionOptions}
            />
          </FormField>

          <FormField<
            SmsAutomationFormData,
            "triggerLimit",
            SelectProps
          > name="triggerLimit">
            <Select
              id={ids.fields.limit}
              label={t("automation.sms.form.triggerLimit.label")}
              required
              fullWidth
              items={triggerLimitOptions}
            />
          </FormField>
        </div>

        <SmsContent />
      </ControlledForm>
    </div>
  );
};
