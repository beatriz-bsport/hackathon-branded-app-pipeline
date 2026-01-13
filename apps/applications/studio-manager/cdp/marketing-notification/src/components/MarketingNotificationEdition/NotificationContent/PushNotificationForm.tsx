import { useEffect, useRef } from "react";

import { ControlledFormProps, FormField } from "@bsport/form";
import { Alert, TextArea, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import {
  MAX_CONTENT_LENGTH,
  MAX_TITLE_LENGTH,
} from "#src/utils/schemas/notificationContentValidation";
import { NotificationContentFormData } from "#src/utils/schemas/types";

import { CommunicationVariableSelector } from "../CommunicationVariableSelector/CommunicationVariableSelector";

const PUSH_NOTIFICATION_TITLE_MAX_LENGTH = 25;
const PUSH_NOTIFICATION_CONTENT_MAX_LENGTH = 200;

const PUSH_NOTIFICATION_TITLE_INPUT_TYPE = "pushNotificationTitle";
const PUSH_NOTIFICATION_CONTENT_INPUT_TYPE = "pushNotificationContent";

type PushNotificationInputType =
  | typeof PUSH_NOTIFICATION_TITLE_INPUT_TYPE
  | typeof PUSH_NOTIFICATION_CONTENT_INPUT_TYPE;

function isPushNotificationInputType(
  value: string,
): value is PushNotificationInputType {
  return (
    value === PUSH_NOTIFICATION_TITLE_INPUT_TYPE ||
    value === PUSH_NOTIFICATION_CONTENT_INPUT_TYPE
  );
}

type PushNotificationFormProps = {
  pushNotificationTitle: string;
  pushNotificationContent: string;
  setFormValue: ControlledFormProps<NotificationContentFormData>["setValue"];
  getFormValues: ControlledFormProps<NotificationContentFormData>["getValues"];
};

export const PushNotificationForm: React.FC<PushNotificationFormProps> = ({
  pushNotificationTitle,
  pushNotificationContent,
  setFormValue,
  getFormValues,
}: PushNotificationFormProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const currentInputRef = useRef<PushNotificationInputType | null>(null);

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
    const currentInput = getFormValues(currentInputRef.current) ?? "";
    if (currentInput === null || currentInput === undefined) return;

    // Get DOM element reference
    const fieldName =
      currentInputRef.current === PUSH_NOTIFICATION_TITLE_INPUT_TYPE
        ? "title"
        : "content";
    const elementId = `push-notification-${fieldName}`;
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
    setFormValue(currentInputRef.current, newValue);

    // Optional: Set focus back to the input and position cursor after the inserted variable
    const newCursorPos = currentCursorPos + selectedVariable.length;
    setTimeout(() => {
      element.focus();
      element.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  useEffect(() => {
    const newValues = {
      pushNotificationTitle: pushNotificationTitle ?? "",
      pushNotificationContent: pushNotificationContent ?? "",
    };
    setFormValue("pushNotificationContent", newValues.pushNotificationContent, {
      shouldValidate: true,
    });
    setFormValue("pushNotificationTitle", newValues.pushNotificationTitle, {
      shouldValidate: true,
    });
  }, [pushNotificationTitle, pushNotificationContent, setFormValue]);

  return (
    <div className="flex flex-col gap-xs">
      <FormField<NotificationContentFormData, "pushNotificationTitle">
        name="pushNotificationTitle"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          helperText: `${field.value?.length || 0}/${PUSH_NOTIFICATION_TITLE_MAX_LENGTH}`,
          onClear: () => {
            setFormValue("pushNotificationTitle", "", { shouldValidate: true });
          },
        })}
      >
        <TextField
          fullWidth
          id="push-notification-title"
          label="Title"
          maxLength={MAX_TITLE_LENGTH}
          onFocus={() => {
            currentInputRef.current = PUSH_NOTIFICATION_TITLE_INPUT_TYPE;
          }}
        />
      </FormField>
      <FormField<NotificationContentFormData, "pushNotificationContent">
        name="pushNotificationContent"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          helperText: `${field.value?.length || 0}/${PUSH_NOTIFICATION_CONTENT_MAX_LENGTH}`,
        })}
      >
        <TextArea
          id="push-notification-content"
          label="Content"
          maxLength={MAX_CONTENT_LENGTH}
          onFocus={() => {
            currentInputRef.current = PUSH_NOTIFICATION_CONTENT_INPUT_TYPE;
          }}
        />
      </FormField>
      <Alert status="info">
        {t("steps.content.communicationVariableLengthAlert")}
      </Alert>
      <div className="w-full">
        <div className="w-[320px] flex place-self-end">
          <CommunicationVariableSelector
            fullWidth
            id="push-notification-variables"
            onSelectCommunicationVariable={handleCommunicationVariableSelect}
          />
        </div>
      </div>
    </div>
  );
};
