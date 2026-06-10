import type { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type DeleteNoteModalProps = {
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteNoteModal: FC<DeleteNoteModalProps> = ({
  isOpen,
  isPending = false,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation("sessionManagement");

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("sessionPanel.notes.deleteModal.title")}
      disableClose={isPending}
      onClose={onClose}
      confirmButton={{
        label: t("sessionPanel.notes.deleteModal.confirm"),
        onClick: onConfirm,
        color: "critical",
        loading: isPending,
        disabled: isPending,
      }}
      cancelButton={{
        label: t("sessionPanel.notes.deleteModal.cancel"),
        onClick: onClose,
        disabled: isPending,
      }}
    >
      <Body htmlVariant="p" size="md">
        {t("sessionPanel.notes.deleteModal.body")}
      </Body>
    </Modal>
  );
};
