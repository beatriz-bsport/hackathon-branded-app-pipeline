import { useState } from "react";

import { useTranslation } from "#src/utils/i18n";

import { SmartlistFormData } from "./shared-types";

type SmartlistFormField = keyof SmartlistFormData;

const MAX_NAME_LENGTH = 200;

export type UseSmartlistFormParams = {
  initialData?: SmartlistFormData;
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
