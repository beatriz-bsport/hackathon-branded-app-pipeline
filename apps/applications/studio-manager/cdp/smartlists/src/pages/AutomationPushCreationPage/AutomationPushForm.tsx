import { useId } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import {
  Alert,
  Select,
  type SelectProps,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { ToggleButtonGroup } from "#src/components/ToggleButtonGroup/ToggleButtonGroup";
import { PushNotificationContent } from "#src/components/push-notification-generic-field/push-notification-content";
import { useTranslation } from "#src/utils/i18n";

import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type PushAutomationEventValue,
  type PushAutomationFormData,
  isPushAutomationEventValue,
} from "./types";

type AutomationPushFormProps = Omit<
  ControlledFormProps<PushAutomationFormData>,
  "children"
>;

export const AutomationPushForm: React.FC<AutomationPushFormProps> = ({
  id,
  onSubmit,
  ...methods
}: AutomationPushFormProps) => {
  const { t } = useTranslation("details");

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const formIdPrefix = useId();
  const ids = {
    fields: {
      condition: `${formIdPrefix}-field-condition`,
      limit: `${formIdPrefix}-field-limit`,
    },
  };

  const conditionOptions: Array<{
    value: PushAutomationEventValue;
    label: string;
    icon: "log-in-03" | "log-out-01";
  }> = [
    {
      value: PUSH_AUTOMATION_EVENT_VALUES.ENTRY,
      label: t("automation.push.form.condition.options.entry"),
      icon: "log-in-03",
    },
    {
      value: PUSH_AUTOMATION_EVENT_VALUES.EXIT,
      label: t("automation.push.form.condition.options.exit"),
      icon: "log-out-01",
    },
  ];

  const triggerLimitOptions: SelectProps["items"] = [
    {
      id: PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
      label: t("automation.push.form.triggerLimit.options.noLimit"),
    },
    {
      id: PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE,
      label: t("automation.push.form.triggerLimit.options.once"),
    },
    {
      id: PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE,
      label: t("automation.push.form.triggerLimit.options.twice"),
    },
    {
      id: PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES,
      label: t("automation.push.form.triggerLimit.options.threeTimes"),
    },
  ];

  return (
    <div className="flex flex-col gap-md p-0 md:p-md">
      <Alert status="default" type="weak">
        {t("automation.push.alert.onlyAppMembers")}
      </Alert>

      <ControlledForm
        id={id}
        className="flex flex-col gap-md"
        onSubmit={onSubmit}
        {...methods}
      >
        <div className="flex flex-col gap-sm">
          <Title htmlVariant="h2" weight="strong">
            {t("automation.push.sections.delivery")}
          </Title>
          <FormField<PushAutomationFormData, "eventKind">
            name="eventKind"
            mapProps={({ field, form }) => ({
              value: field.value,
              onChangeValue: (nextValue: PushAutomationEventValue) => {
                if (!isPushAutomationEventValue(nextValue)) return;

                form.setValue("eventKind", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            })}
          >
            <ToggleButtonGroup<PushAutomationEventValue>
              id={ids.fields.condition}
              label={t("automation.push.form.condition.label")}
              options={conditionOptions}
            />
          </FormField>

          <FormField<
            PushAutomationFormData,
            "triggerLimit",
            SelectProps
          > name="triggerLimit">
            <Select
              id={ids.fields.limit}
              label={t("automation.push.form.triggerLimit.label")}
              required
              fullWidth
              items={triggerLimitOptions}
            />
          </FormField>
        </div>

        <PushNotificationContent sender={companyTheme?.company_name ?? ""} />
      </ControlledForm>
    </div>
  );
};
