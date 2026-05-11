import type { FC } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useDeleteLevel } from "#src/hooks/api/level/use-delete-level";
import { useTranslation } from "#src/utils/i18n";

export const DeleteLevelModal: FC<{
  isOpen: boolean;
  levelId: number | null;
  onClose: () => void;
}> = ({ isOpen, levelId, onClose }) => {
  const { t } = useTranslation("media-form");
  const { mutate } = useDeleteLevel();

  if (!levelId) {
    return null;
  }

  const handleDelete = () => {
    mutate(
      { id: levelId },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("formFields.level.deleteTitle")}
      onClose={onClose}
      confirmButton={{
        label: t("formFields.level.delete"),
        onClick: handleDelete,
        color: "critical",
      }}
      cancelButton={{
        label: t("formFields.level.cancel"),
        onClick: onClose,
      }}
    >
      {t("formFields.level.deleteMessage")}
    </Modal>
  );
};
