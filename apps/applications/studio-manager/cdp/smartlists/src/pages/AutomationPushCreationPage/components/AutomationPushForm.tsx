import { useId } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import {
  Alert,
  TextArea,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { ToggleButtonGroup } from "#src/components/ToggleButtonGroup/ToggleButtonGroup";
import { useTranslation } from "#src/utils/i18n";

import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_MAX_AUTOMATION_NAME_LENGTH,
  PUSH_AUTOMATION_MAX_MESSAGE_LENGTH,
  PUSH_AUTOMATION_MAX_TITLE_LENGTH,
  type PushAutomationEventValue,
  type PushAutomationFormData,
  isPushAutomationEventValue,
} from "../types";

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

  const formIdPrefix = useId();
  const ids = {
    fields: {
      automationName: `${formIdPrefix}-field-automation-name`,
      condition: `${formIdPrefix}-field-condition`,
      title: `${formIdPrefix}-field-title`,
      message: `${formIdPrefix}-field-message`,
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

  return (
    <div className="flex flex-col gap-md p-0 md:p-md max-w-[720px]">
      <Alert status="default" type="weak">
        {t("automation.push.alert.onlyAppMembers")}
      </Alert>

      <ControlledForm
        id={id}
        className="flex flex-col gap-md"
        onSubmit={onSubmit}
        {...methods}
      >
        <div className="flex flex-col gap-xs">
          <FormField<PushAutomationFormData, "automationName">
            name="automationName"
            mapProps={({ defaultProps, form, field }) => ({
              ...defaultProps,
              onClear: () => {
                form.setValue("automationName", "", { shouldDirty: true });
                field.onBlur();
              },
            })}
          >
            <TextField
              id={ids.fields.automationName}
              label={t("automation.push.form.automationName.label")}
              placeholder={t("automation.push.form.automationName.placeholder")}
              required
              fullWidth
              maxLength={PUSH_AUTOMATION_MAX_AUTOMATION_NAME_LENGTH}
            />
          </FormField>
        </div>

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
        </div>

        <div className="flex flex-col gap-sm">
          <Title htmlVariant="h2" weight="strong">
            {t("automation.push.sections.message")}
          </Title>

          <div className="flex flex-col gap-xs">
            <FormField<PushAutomationFormData, "title">
              name="title"
              mapProps={({ defaultProps, form, field }) => ({
                ...defaultProps,
                onClear: () => {
                  form.setValue("title", "", { shouldDirty: true });
                  field.onBlur();
                },
              })}
            >
              <TextField
                id={ids.fields.title}
                label={t("automation.push.form.title.label")}
                placeholder={t("automation.push.form.title.placeholder")}
                required
                fullWidth
                maxLength={PUSH_AUTOMATION_MAX_TITLE_LENGTH}
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-xs">
            <FormField<PushAutomationFormData, "message"> name="message">
              <TextArea
                id={ids.fields.message}
                label={t("automation.push.form.message.label")}
                placeholder={t("automation.push.form.message.placeholder")}
                required
                maxLength={PUSH_AUTOMATION_MAX_MESSAGE_LENGTH}
              />
            </FormField>
          </div>
        </div>
      </ControlledForm>
    </div>
  );
};
