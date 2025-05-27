import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import { EditForm, useSmartlistForm } from "./EditForm";

type CreateSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    company?: number;
  }) => void;
  isCreating?: boolean;
};

export const CreateSmartlistModal: React.FC<CreateSmartlistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}) => {
  const { t } = useTranslation("list");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const { formData, errors, handleChange, handleBlur, validateForm } =
    useSmartlistForm();

  const handleSubmit = async () => {
    if (!validateForm() || !companyTheme?.id) {
      return;
    }

    onCreate({
      name: formData.name,
      description: formData.description,
      company: companyTheme.id,
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onClickOutside={onClose}
      title={t("createForm.title")}
      description={t("createForm.subtitle")}
      size="md"
      confirmLabel={t("createForm.actions.create")}
      confirmColor="main"
      onConfirmClick={handleSubmit}
      cancelLabel={t("createForm.actions.cancel")}
      onCancelClick={onClose}
    >
      <EditForm
        data={formData}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        isSubmitting={isCreating}
      />
    </Modal>
  );
};
