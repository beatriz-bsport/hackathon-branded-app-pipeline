import { useEffect, useRef } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { Button, TextArea, TextField } from "@bsport/kaizen-primitive-core";

import { CommunicationVariableSelector } from "#src/components/CommunicationVariableSelector/CommunicationVariableSelector";
import { useTranslation } from "#src/utils/i18n";
import {
  PUSH_NOTIFICATION_CONTENT_MAX_LENGTH,
  PUSH_NOTIFICATION_TITLE_MAX_LENGTH,
  pushNotificationFormSchema,
} from "#src/utils/schema";
import type { PushNotificationFormData } from "#src/utils/types";

type PushNotificationInputType = "title" | "content";

function isPushNotificationInputType(
  value: string,
): value is PushNotificationInputType {
  return value === "title" || value === "content";
}

type NotificationRulePushNotificationFormProps = {
  pushNotificationTitle: string;
  pushNotificationContent: string;
  updatePushNotificationContentInNotification: (params: {
    title: string;
    content: string;
  }) => void;
};

export const NotificationRulePushNotificationForm: React.FC<
  NotificationRulePushNotificationFormProps
> = ({
  pushNotificationTitle,
  pushNotificationContent,
  updatePushNotificationContentInNotification,
}: NotificationRulePushNotificationFormProps) => {
  const { t } = useTranslation("transactionalNotification");
  const currentInputRef = useRef<string | null>(null);
  const methods = useFormController({
    mode: "onBlur",
    schema: pushNotificationFormSchema,
    defaultValues: {
      title: pushNotificationTitle || "",
      content: pushNotificationContent || "",
    },
  });

  // This function handles the insertion of a selected communication variable
  // into the currently focused input field (title or content) at the cursor position.
  // It uses the currentInputRef to determine which input is focused and manipulates
  // the form state accordingly.
  // It also ensures that the cursor is repositioned correctly after insertion.
  // The function checks for the validity of the current input type and the presence
  const handleCommunicationVariableSelect = (selectedVariable: string) => {
    // Validate current input type
    if (
      !currentInputRef.current ||
      !isPushNotificationInputType(currentInputRef.current)
    )
      return;

    // Get current form value
    const currentInput = methods.getValues(currentInputRef.current) || "";
    if (currentInput === null || currentInput === undefined) return;

    // Get DOM element reference
    const elementId = `push-notification-${currentInputRef.current}`;
    const element = document.getElementById(elementId) as
      | HTMLTextAreaElement
      | HTMLInputElement;

    if (!element) return;

    // Get current cursor position
    const currentCursorPos = element.selectionStart ?? currentInput.length;

    // Validate cursor position bounds
    if (currentCursorPos < 0 || currentCursorPos > currentInput.length) return;

    // Construct new value with variable inserted at cursor position
    const newValue = [
      currentInput.slice(0, currentCursorPos),
      selectedVariable,
      currentInput.slice(currentCursorPos),
    ].join("");

    // Update form value
    methods.setValue(currentInputRef.current, newValue);

    // Optional: Set focus back to the input and position cursor after the inserted variable
    const newCursorPos = currentCursorPos + selectedVariable.length;
    setTimeout(() => {
      element.focus();
      element.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  useEffect(() => {
    const newValues = {
      title: pushNotificationTitle || "",
      content: pushNotificationContent || "",
    };
    methods.reset(newValues);
  }, [pushNotificationTitle, pushNotificationContent]);

  return (
    <ControlledForm<PushNotificationFormData>
      id="referral-program-form"
      onSubmit={(data: PushNotificationFormData) => {
        updatePushNotificationContentInNotification({
          title: data.title,
          content: data.content,
        });
      }}
      className="flex flex-col gap-md"
      {...methods}
    >
      <FormField<PushNotificationFormData, "title">
        name="title"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          helperText: `${field.value.length || 0}/${PUSH_NOTIFICATION_TITLE_MAX_LENGTH}`,
          onClear: () => {
            methods.setValue("title", "");
          },
        })}
      >
        <TextField
          fullWidth
          id="push-notification-title"
          label={t(
            "notificationRuleEventDetails.details.pushNotification.title.label",
          )}
          onFocus={() => {
            currentInputRef.current = "title";
          }}
        />
      </FormField>
      <FormField<PushNotificationFormData, "content">
        name="content"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          helperText: `${field.value.length || 0}/${PUSH_NOTIFICATION_CONTENT_MAX_LENGTH}`,
        })}
      >
        <TextArea
          id="push-notification-content"
          label={t(
            "notificationRuleEventDetails.details.pushNotification.content.label",
          )}
          onFocus={() => {
            currentInputRef.current = "content";
          }}
        />
      </FormField>
      <div className="w-full">
        <div className="w-[320px] flex place-self-end">
          <CommunicationVariableSelector
            fullWidth
            id="push-notification-variables"
            onSelectCommunicationVariable={handleCommunicationVariableSelect}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="md"
            color="main"
            intent="call-to-action"
            label={t(
              "notificationRuleEventDetails.details.pushNotification.actions.save",
            )}
          />
        </div>
      </div>
    </ControlledForm>
  );
};
