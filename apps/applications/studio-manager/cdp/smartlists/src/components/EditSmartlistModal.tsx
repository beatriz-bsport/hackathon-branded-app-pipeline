import React, { useState } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { useTranslation } from "#src/utils/i18n";

import { EditForm, type SmartlistFormData } from "./EditForm";

type SmartlistFormField = keyof SmartlistFormData;

type EditSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: { id: number; name: string; description: string }) => void;
  smartlist: Smartlist;
  isEditing?: boolean;
};

const MAX_NAME_LENGTH = 200;

export const EditSmartlistModal: React.FC<EditSmartlistModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  smartlist,
  isEditing,
}) => {
  const { t } = useTranslation("list");

  const [formData, setFormData] = useState<SmartlistFormData>({
    name: smartlist?.name || "",
    description: smartlist?.description || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<SmartlistFormField, string>>
  >({});

  const handleChange = (field: SmartlistFormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        newErrors[field] = undefined;

        return newErrors;
      });
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

  const hasNoChanges = (): boolean => {
    return (
      formData.name === smartlist.name &&
      formData.description === smartlist.description
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (hasNoChanges()) {
      /**
       * Why?
       * Modal component doesn't support disabling the buttons
       * and as the smartlists order is affected after saving
       * for now we decided to close the modal when there are no changes
       * and the user saves the form
       * TODO: handling this case in a better way by disabling the buttons
       */
      onClose();
      return;
    }

    onEdit({
      id: smartlist.id,
      name: formData.name,
      description: formData.description,
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onClickOutside={onClose}
      title={t("editForm.title.edit")}
      size="md"
      confirmLabel={t("editForm.actions.save")}
      confirmColor="main"
      onConfirmClick={handleSubmit}
      cancelLabel={t("editForm.actions.cancel")}
      onCancelClick={onClose}
    >
      <EditForm
        data={formData}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        isSubmitting={isEditing}
      />
    </Modal>
  );
};
