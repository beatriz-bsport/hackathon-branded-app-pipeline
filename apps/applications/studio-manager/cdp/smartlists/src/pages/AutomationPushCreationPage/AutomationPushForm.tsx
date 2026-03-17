import { useId, useRef } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import {
  Alert,
  Select,
  type SelectProps,
  TextArea,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { ToggleButtonGroup } from "#src/components/ToggleButtonGroup/ToggleButtonGroup";
import { useTranslation } from "#src/utils/i18n";

import { CommunicationVariableSelector } from "./CommunicationVariableSelector";
import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_MAX_AUTOMATION_NAME_LENGTH,
  PUSH_AUTOMATION_MAX_MESSAGE_LENGTH,
  PUSH_AUTOMATION_MAX_TITLE_LENGTH,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type PushAutomationEventValue,
  type PushAutomationFormData,
  isPushAutomationEventValue,
} from "./types";
import {
  focusEditableTextElementAtCursor,
  getEditableTextElement,
  insertValueAtCursor,
} from "./variable-interpolation";

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
      limit: `${formIdPrefix}-field-limit`,
      title: `${formIdPrefix}-field-title`,
      message: `${formIdPrefix}-field-message`,
    },
  };

  type PushAutomationInputType = "title" | "message";

  const currentInputRef = useRef<PushAutomationInputType | null>(null);

  const handleCommunicationVariableSelect = (selectedVariable: string) => {
    const currentInputName = currentInputRef.current;
    if (!currentInputName) {
      return;
    }

    const currentInput = methods.getValues(currentInputName) ?? "";
    const elementId =
      currentInputName === "title" ? ids.fields.title : ids.fields.message;
    const element = getEditableTextElement(elementId);

    if (!element) {
      return;
    }

    const currentCursorPos = element.selectionStart ?? currentInput.length;
    const interpolationResult = insertValueAtCursor({
      currentValue: currentInput,
      cursorPosition: currentCursorPos,
      valueToInsert: selectedVariable,
    });

    if (!interpolationResult) {
      return;
    }

    methods.setValue(currentInputName, interpolationResult.value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    focusEditableTextElementAtCursor(
      element,
      interpolationResult.cursorPosition,
    );
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
                onFocus={() => {
                  currentInputRef.current = "title";
                }}
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
                onFocus={() => {
                  currentInputRef.current = "message";
                }}
              />
            </FormField>
            <div className="w-full">
              <div className="w-[320px] flex place-self-end">
                <CommunicationVariableSelector
                  fullWidth
                  id={`${formIdPrefix}-communication-variable-selector`}
                  onSelectCommunicationVariable={
                    handleCommunicationVariableSelect
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </ControlledForm>
    </div>
  );
};
