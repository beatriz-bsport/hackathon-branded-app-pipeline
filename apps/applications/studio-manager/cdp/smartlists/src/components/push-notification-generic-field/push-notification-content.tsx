import { useId, useRef } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Body,
  TextArea,
  TextField,
  Title,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { PushNotificationPreview } from "#src/components/BusinessComponents/PushNotificationPreview";
import { CommunicationVariableSelector } from "#src/components/communication-variable-selector/communication-variable-selector";
import { useTranslation } from "#src/utils/i18n";

import {
  PUSH_NOTIFICATION_MAX_MESSAGE_LENGTH,
  PUSH_NOTIFICATION_MAX_TITLE_LENGTH,
} from "./constants";
import type { PushNotificationContentFormData } from "./types";
import {
  focusEditableTextElementAtCursor,
  getEditableTextElement,
  insertValueAtCursor,
} from "./variable-interpolation";

/**
 * Push notification content section:
 * title + message fields, variable selector and live preview.
 */
export const PushNotificationContent = ({ sender }: { sender: string }) => {
  const isMobile = !useMatchMedia("md");
  const { t } = useTranslation("details");
  const formIdPrefix = useId();
  const ids = {
    fields: {
      title: `${formIdPrefix}-field-title`,
      message: `${formIdPrefix}-field-message`,
    },
  };
  const { watch, getValues, setValue } =
    useFormContext<PushNotificationContentFormData>();
  const watchedTitle = watch("title");
  const watchedMessage = watch("message");

  type PushAutomationInputType = "title" | "message";
  const currentInputRef = useRef<PushAutomationInputType | null>(null);

  const handleCommunicationVariableSelect = (selectedVariable: string) => {
    const currentInputName = currentInputRef.current;
    if (!currentInputName) return;

    const inputFieldName = currentInputName === "title" ? "title" : "message";
    const currentInput = getValues(inputFieldName) ?? "";
    const elementId =
      currentInputName === "title" ? ids.fields.title : ids.fields.message;
    const element = getEditableTextElement(elementId);

    if (!element) return;

    const currentCursorPos = element.selectionStart ?? currentInput.length;
    const interpolationResult = insertValueAtCursor({
      currentValue: currentInput,
      cursorPosition: currentCursorPos,
      valueToInsert: selectedVariable,
    });

    if (!interpolationResult) return;

    setValue(inputFieldName, interpolationResult.value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    focusEditableTextElementAtCursor(
      element,
      interpolationResult.cursorPosition,
    );
  };

  return (
    <div className="flex flex-col gap-sm">
      <Title htmlVariant="h2" weight="strong">
        {t("generic.pushNotification.sections.message")}
      </Title>

      <div
        className={isMobile ? "flex flex-col gap-lg" : "flex flex-row gap-lg"}
      >
        <div className="flex flex-1 flex-col gap-sm">
          <div className="flex flex-col gap-xs">
            <FormField<PushNotificationContentFormData, "title">
              name="title"
              mapProps={({ defaultProps, form, field }) => ({
                ...defaultProps,
                onClear: () => {
                  form.setValue("title", "", {
                    shouldDirty: true,
                  });
                  field.onBlur();
                },
                helperText: `${field.value?.length || 0}/${PUSH_NOTIFICATION_MAX_TITLE_LENGTH}`,
              })}
            >
              <TextField
                id={ids.fields.title}
                label={t("generic.pushNotification.form.title.label")}
                placeholder={t(
                  "generic.pushNotification.form.title.placeholder",
                )}
                required
                fullWidth
                maxLength={PUSH_NOTIFICATION_MAX_TITLE_LENGTH}
                onFocus={() => {
                  currentInputRef.current = "title";
                }}
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-xs">
            <FormField<PushNotificationContentFormData, "message">
              name="message"
              mapProps={({ defaultProps, field }) => ({
                ...defaultProps,
                helperText: `${field.value?.length || 0}/${PUSH_NOTIFICATION_MAX_MESSAGE_LENGTH}`,
              })}
            >
              <TextArea
                id={ids.fields.message}
                label={t("generic.pushNotification.form.message.label")}
                placeholder={t(
                  "generic.pushNotification.form.message.placeholder",
                )}
                required
                maxLength={PUSH_NOTIFICATION_MAX_MESSAGE_LENGTH}
                onFocus={() => {
                  currentInputRef.current = "message";
                }}
              />
            </FormField>
            <div className="w-full">
              <div className="w-80 flex place-self-end">
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

        <div className="flex flex-1 max-w-sm flex-col gap-2xs">
          <div className="flex items-center justify-center">
            <Body htmlVariant="p" weight="stronger" size="md">
              {t("generic.pushNotification.sections.preview")}
            </Body>
          </div>
          <PushNotificationPreview
            sender={sender}
            title={watchedTitle}
            content={watchedMessage}
            noContentMessage={t(
              "generic.pushNotification.preview.noContentMessage",
            )}
          />
        </div>
      </div>
    </div>
  );
};
