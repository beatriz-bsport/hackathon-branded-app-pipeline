import React, { useId, useState } from "react";

import { TextArea, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type SmartlistFormData = {
  name: string;
  description: string;
};

type SmartlistFormField = keyof SmartlistFormData;

const MAX_NAME_LENGTH = 200;

export type UseSmartlistFormParams = {
  initialData?: SmartlistFormData;
};

type EditFormProps = {
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
export const EditForm: React.FC<EditFormProps> = ({
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

export const useSmartlistForm = ({
  initialData = { name: "", description: "" },
}: UseSmartlistFormParams = {}) => {
  const { t } = useTranslation("list");

  const [formData, setFormData] = useState<SmartlistFormData>(initialData);

  const [errors, setErrors] = useState<
    Partial<Record<SmartlistFormField, string>>
  >({});

  const handleChange = (field: SmartlistFormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleBlur = (field: SmartlistFormField, value: string) => {
    validateField(field, value);
  };

  const getFieldError = (
    field: SmartlistFormField,
    value: string,
  ): string | null => {
    if (field === "name" && !value.trim()) {
      return t("editForm.fields.name.required");
    } else if (field === "name" && value.length > MAX_NAME_LENGTH) {
      return t("editForm.fields.name.maxLength");
    }

    return null;
  };

  const validateField = (field: SmartlistFormField, value: string): boolean => {
    const errorMessage = getFieldError(field, value);

    if (errorMessage) {
      setErrors((prev) => ({
        ...prev,
        [field]: errorMessage,
      }));

      return false;
    }

    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<SmartlistFormField, string>> = {};

    for (const [field, value] of Object.entries(formData)) {
      const errorMessage = getFieldError(field as SmartlistFormField, value);

      if (errorMessage) {
        newErrors[field as SmartlistFormField] = errorMessage;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const hasNoChanges = (originalData: SmartlistFormData): boolean => {
    return (
      formData.name === originalData.name &&
      formData.description === originalData.description
    );
  };

  return {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    hasNoChanges,
  };
};
