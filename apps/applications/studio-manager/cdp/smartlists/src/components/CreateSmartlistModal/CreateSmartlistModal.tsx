import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SmartlistForm, useSmartlistForm } from "#src/components/SmartlistForm";
import { useTranslation } from "#src/utils/i18n";

import { useCreate } from "./use-create";

type CreateSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: () => void;
};

export const CreateSmartlistModal: React.FC<CreateSmartlistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation("list");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const { formData, errors, handleChange, handleBlur, validateForm } =
    useSmartlistForm();

  const { createSmartlist, isCreating } = useCreate({
    onSuccess: () => {
      onCreate?.();
      onClose();
    },
    onFailure: () => {
      onClose();
    },
  });

  const handleCreate = () => {
    if (!validateForm() || !companyTheme?.id) {
      return;
    }

    createSmartlist({
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
      onConfirmClick={handleCreate}
      cancelLabel={t("createForm.actions.cancel")}
      onCancelClick={onClose}
    >
      <SmartlistForm
        data={formData}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        isSubmitting={isCreating}
      />
    </Modal>
  );
};
