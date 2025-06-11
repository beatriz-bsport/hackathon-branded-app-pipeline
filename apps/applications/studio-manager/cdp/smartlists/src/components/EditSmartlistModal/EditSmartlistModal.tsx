import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { SmartlistForm, useSmartlistForm } from "#src/components/SmartlistForm";
import { useTranslation } from "#src/utils/i18n";

import { useEdit } from "./use-edit";

type EditSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onUndo?: () => void;
  smartlist: Smartlist;
};

export const EditSmartlistModal: React.FC<EditSmartlistModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onUndo,
  smartlist,
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

  const { editSmartlist, isEditing } = useEdit({
    onSuccess: () => {
      onClose();
      onEdit?.();
    },
    onFailure: () => {
      onClose();
    },
    onUndo: () => {
      onClose();
      onUndo?.();
    },
  });

  const handleCreate = async () => {
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

    editSmartlist(
      {
        id: smartlist.id,
        name: formData.name,
        description: formData.description,
      },
      smartlist,
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onClickOutside={onClose}
      title={t("editForm.title.edit")}
      size="md"
      confirmButton={{
        label: t("editForm.actions.save"),
        onClick: handleCreate,
      }}
      cancelButton={{
        label: t("editForm.actions.cancel"),
        onClick: onClose,
      }}
    >
      <SmartlistForm
        data={formData}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        isSubmitting={isEditing}
      />
    </Modal>
  );
};
