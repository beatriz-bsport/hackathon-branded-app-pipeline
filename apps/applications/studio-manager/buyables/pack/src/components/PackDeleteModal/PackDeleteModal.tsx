import React from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  archivePackAction,
  restorePackAction,
} from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type PackDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  packId: number;
  packName: string;
  onDeleteSuccess: () => void;
  onUndoSuccess: () => void;
};

export const PackDeleteModal: React.FC<PackDeleteModalProps> = ({
  isOpen,
  onClose,
  packId,
  packName,
  onDeleteSuccess,
  onUndoSuccess,
}) => {
  const { t } = useTranslation("list");

  if (!packId) {
    // Should never happen
    throw new Error("Pack Delete Modal could not find the pack Id");
  }

  const restorePack = restorePackAction.bind(null, fetch, { id: packId });

  const [, handleUndo] = useAsync<typeof restorePack>({
    asyncFn: restorePack,
    onSuccess: () => {
      // Display a toast to inform about the success
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("toasts.messageUndo.success"),
        buttonIcon: "x-close",
      });
      onUndoSuccess();
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("toasts.messageUndo.error"),
        buttonIcon: "x-close",
      });
    },
    dependencies: [onUndoSuccess],
  });

  const deletePack = archivePackAction.bind(null, fetch, { id: packId });

  const [{ isLoading }, handleDelete] = useAsync<typeof deletePack>({
    asyncFn: deletePack,
    onSuccess: () => {
      // Display a toast to "undo" the action
      toast({
        status: "default",
        icon: "archive",
        title: t("toasts.messageDelete.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: handleUndo,
      });

      onDeleteSuccess();

      // Close the modal
      onClose();
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "archive",
        title: t("toasts.messageDelete.error"),
        buttonIcon: "x-close",
      });

      // Close the modal
      onClose();
    },
    dependencies: [onDeleteSuccess, onClose],
  });

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("deleteModal.actions.delete"),
        color: "critical",
        disabled: isLoading,
        onClick: handleDelete,
      }}
      cancelButton={{
        label: t("deleteModal.actions.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("deleteModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <>
        <Body htmlVariant="p">
          {t("deleteModal.description.effect", { name: packName })}
        </Body>
        <Body htmlVariant="p" weight="stronger" className="mt-md">
          {t("deleteModal.description.canNotBeUndone")}
        </Body>
      </>
    </Modal>
  );
};
