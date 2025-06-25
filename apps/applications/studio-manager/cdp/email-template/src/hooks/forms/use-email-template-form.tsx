import { useState } from "react";

import { useTranslation } from "#src/utils/i18n";

export type EmailTemplateFormData = {
  title: string;
  subject: string;
  category: string;
  stringifiedDesign: string | null;
};

type EmailTemplateFormField = keyof EmailTemplateFormData;

const MAX_TITLE_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 100;

export type UseEmailTemplateFormParams = {
  initialData?: EmailTemplateFormData;
};

export const useEmailTemplateForm = ({
  initialData,
}: UseEmailTemplateFormParams = {}) => {
  const { t } = useTranslation(["detail", "list"]);

  const fallbackData: EmailTemplateFormData = {
    title: "",
    subject: "",
    category: t("templateCategory.noCategory"),
    stringifiedDesign: null,
  };

  const [formData, setFormData] = useState<EmailTemplateFormData>(
    initialData ?? fallbackData,
  );

  const [errors, setErrors] = useState<
    Partial<Record<EmailTemplateFormField, string>>
  >({});

  const handleChange = (
    field: EmailTemplateFormField,
    value: string | null,
  ) => {
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

  const handleBlur = (field: EmailTemplateFormField, value: string | null) => {
    validateField(field, value);
  };

  const getFieldError = (
    field: EmailTemplateFormField,
    value: string | null,
  ): string | null => {
    if (field === "stringifiedDesign" && (!value || !value?.trim())) {
      return t("templateDesign.error.notProvided");
    }
    if (field === "title" && !value?.trim()) {
      return t("details.renameTemplateModal.errors.notProvided");
    } else if (field === "title" && (value?.length ?? 0) > MAX_TITLE_LENGTH) {
      return t("details.renameTemplateModal.errors.tooLong");
    } else if (field === "subject" && !value?.trim()) {
      return t("templateSubject.error.notProvided");
    } else if (
      field === "subject" &&
      (value?.length ?? 0) > MAX_SUBJECT_LENGTH
    ) {
      return t("templateSubject.error.tooLong");
    }

    return null;
  };

  const validateField = (
    field: EmailTemplateFormField,
    value: string | null,
  ): boolean => {
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
    const newErrors: Partial<Record<EmailTemplateFormField, string>> = {};

    for (const [field, value] of Object.entries(formData)) {
      const errorMessage = getFieldError(
        field as EmailTemplateFormField,
        value,
      );
      if (errorMessage) {
        newErrors[field as EmailTemplateFormField] = errorMessage;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (originalData: EmailTemplateFormData): boolean => {
    return (
      formData.title !== originalData.title ||
      formData.subject !== originalData.subject ||
      formData.category !== originalData.category ||
      formData.stringifiedDesign !== originalData.stringifiedDesign
    );
  };

  const resetForm = () => {
    setFormData(initialData ?? fallbackData);
  };

  return {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    hasChanges,
    resetForm,
  };
};
