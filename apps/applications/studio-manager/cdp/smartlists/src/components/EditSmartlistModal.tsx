import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { useTranslation } from "#src/utils/i18n";

import { EditForm, useSmartlistForm } from "./EditForm";

type EditSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: { id: number; name: string; description: string }) => void;
  smartlist: Smartlist;
  isEditing?: boolean;
};

export const EditSmartlistModal: React.FC<EditSmartlistModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  smartlist,
  isEditing,
}) => {
  const { t } = useTranslation("list");
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    hasNoChanges,
  } = useSmartlistForm({
    initialData: {
      name: smartlist?.name || "",
      description: smartlist?.description || "",
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (
      hasNoChanges({
        name: smartlist.name,
        description: smartlist.description,
      })
    ) {
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
