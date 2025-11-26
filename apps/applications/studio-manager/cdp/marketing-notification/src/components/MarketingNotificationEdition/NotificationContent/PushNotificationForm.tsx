import { useEffect, useRef } from "react";

import { ControlledFormProps, FormField } from "@bsport/form";
import { TextArea, TextField } from "@bsport/kaizen-primitive-core";

import { NotificationContentFormData } from "#src/utils/schemas/types";

import { CommunicationVariableSelector } from "../CommunicationVariableSelector/CommunicationVariableSelector";

const PUSH_NOTIFICATION_TITLE_MAX_LENGTH = 25;
const PUSH_NOTIFICATION_CONTENT_MAX_LENGTH = 200;

type PushNotificationInputType =
  | "pushNotificationTitle"
  | "pushNotificationContent";

function isPushNotificationInputType(
  value: string,
): value is PushNotificationInputType {
  return value === "title" || value === "content";
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
    <div className="flex flex-col gap-md">
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
          onFocus={() => {
            currentInputRef.current = "pushNotificationTitle";
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
          onFocus={() => {
            currentInputRef.current = "pushNotificationContent";
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
      </div>
    </div>
  );
};
