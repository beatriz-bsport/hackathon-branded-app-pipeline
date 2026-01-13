import { FC } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useDeleteLevel } from "#src/hooks/level/useDeleteLevel";
import { useTranslation } from "#src/utils/i18n";

export const DeleteLevelModal: FC<{
  isOpen: boolean;
  levelId: number | null;
  onClose: () => void;
}> = ({ isOpen, levelId, onClose }) => {
  const { t } = useTranslation("sessionCreation");

  const { mutate } = useDeleteLevel();

  if (!levelId) {
    return null;
  }

  const handleDelete = () => {
    if (!levelId) return;

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
      title={t(
        "addSessionModal.steps.configureSession.settings.level.deleteTitle",
      )}
      onClose={onClose}
      confirmButton={{
        label: t(
          "addSessionModal.steps.configureSession.settings.level.delete",
        ),
        onClick: handleDelete,
        color: "critical",
      }}
      cancelButton={{
        label: t(
          "addSessionModal.steps.configureSession.settings.level.cancel",
        ),
        onClick: onClose,
      }}
    >
      {t("addSessionModal.steps.configureSession.settings.level.deleteMessage")}
    </Modal>
  );
};
