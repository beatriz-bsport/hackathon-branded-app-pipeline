import { useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Alert, TextArea, Title } from "@bsport/kaizen-primitive-core";

import { CommunicationVariableSelector } from "#src/components/communication-variable-selector/communication-variable-selector";
import {
  focusEditableTextElementAtCursor,
  getEditableTextElement,
  insertValueAtCursor,
} from "#src/components/push-notification-generic-field/variable-interpolation";
import { useTranslation } from "#src/utils/i18n";

import { SMS_CONTENT_SEGMENT_LENGTH } from "./constants";
import type { SmsContentFormData } from "./types";

export const SmsContent = () => {
  const { t } = useTranslation("details");
  const formIdPrefix = useId();
  const fieldId = `${formIdPrefix}-field-message`;
  const { watch, getValues, setValue } = useFormContext<SmsContentFormData>();
  const watchedMessage = watch("message") ?? "";

  const segmentCount =
    watchedMessage.length === 0
      ? 1
      : Math.ceil(watchedMessage.length / SMS_CONTENT_SEGMENT_LENGTH);

  const handleCommunicationVariableSelect = (selectedVariable: string) => {
    const currentInput = getValues("message") ?? "";
    const element = getEditableTextElement(fieldId);

    if (!element) return;

    const currentCursorPos = element.selectionStart ?? currentInput.length;
    const interpolationResult = insertValueAtCursor({
      currentValue: currentInput,
      cursorPosition: currentCursorPos,
      valueToInsert: selectedVariable,
    });

    if (!interpolationResult) return;

    setValue("message", interpolationResult.value, {
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
        {t("generic.smsContent.sections.message")}
      </Title>
      {segmentCount > 1 && (
        <Alert status="info">
          {t("generic.smsContent.form.message.moreThanOneSegment", {
            count: segmentCount,
          })}
        </Alert>
      )}

      <div className="flex flex-row gap-lg">
        <div className="flex flex-1 flex-col gap-sm">
          <div className="flex flex-col gap-xs">
            <FormField<SmsContentFormData, "message">
              name="message"
              mapProps={({ defaultProps, field }) => ({
                ...defaultProps,
                helperText: `${field.value?.length || 0}/${SMS_CONTENT_SEGMENT_LENGTH} - ${t(
                  "generic.smsContent.form.message.segmentCount",
                  {
                    count: Math.max(
                      1,
                      Math.ceil(
                        (field.value?.length || 0) / SMS_CONTENT_SEGMENT_LENGTH,
                      ),
                    ),
                  },
                )}`,
              })}
            >
              <TextArea
                id={fieldId}
                label={t("generic.smsContent.form.message.label")}
                placeholder={t("generic.smsContent.form.message.placeholder")}
                required
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
      </div>
    </div>
  );
};
