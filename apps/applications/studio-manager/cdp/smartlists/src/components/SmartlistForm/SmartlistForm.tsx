import React, { useId } from "react";

import { TextArea, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SmartlistFormData } from "./shared-types";

type SmartlistFormProps = {
  data: SmartlistFormData;
  errors?: Partial<Record<keyof SmartlistFormData, string>>;
  onChange: (field: keyof SmartlistFormData, value: string) => void;
  onBlur?: (field: keyof SmartlistFormData, value: string) => void;
  isSubmitting?: boolean;
};

const createChangeHandler = <T extends HTMLInputElement | HTMLTextAreaElement>(
  field: keyof SmartlistFormData,
  onChange: (field: keyof SmartlistFormData, value: string) => void,
) => {
  return (event: React.ChangeEvent<T>) => {
    onChange(field, event.target.value);
  };
};

const createBlurHandler = <T extends HTMLInputElement | HTMLTextAreaElement>(
  field: keyof SmartlistFormData,
  onBlur?: (field: keyof SmartlistFormData, value: string) => void,
) => {
  return (event: React.FocusEvent<T>) => {
    onBlur?.(field, event.target.value);
  };
};

/**
 * Stateless EditForm component for creating or editing a smartlist
 *
 * @param data - Form data (name and description)
 * @param errors - Form validation errors
 * @param onChange - Function called when a field value changes
 * @param onBlur - Optional function called when a field loses focus (for validation)
 * @param isSubmitting - Whether the form is currently submitting
 */
export const SmartlistForm: React.FC<SmartlistFormProps> = ({
  data,
  errors = {},
  onChange,
  onBlur,
  isSubmitting = false,
}) => {
  const { t } = useTranslation("list");
  const formId = useId();

  const handleClearName = () => {
    onChange("name", "");
    onBlur?.("name", "");
  };

  return (
    <form className="flex flex-col gap-md">
      <TextField
        id={`${formId}-smartlist-name`}
        label={t("editForm.fields.name.label")}
        value={data.name}
        onChange={createChangeHandler<HTMLInputElement>("name", onChange)}
        onBlur={createBlurHandler<HTMLInputElement>("name", onBlur)}
        onClear={handleClearName}
        required
        status={errors.name ? "error" : "default"}
        statusText={errors.name}
        placeholder={t("editForm.fields.name.placeholder")}
        disabled={isSubmitting}
      />

      <TextArea
        id={`${formId}-smartlist-description`}
        label={t("editForm.fields.description.label")}
        value={data.description}
        onChange={createChangeHandler<HTMLTextAreaElement>(
          "description",
          onChange,
        )}
        onBlur={createBlurHandler<HTMLTextAreaElement>("description", onBlur)}
        status="default"
        placeholder={t("editForm.fields.description.placeholder")}
        disabled={isSubmitting}
      />
    </form>
  );
};
