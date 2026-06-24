import { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useToggleWaitingListFreeze } from "#src/hooks/session-api/session-actions/use-toggle-waiting-list-freeze.js";
import { useTranslation } from "#src/utils/i18n.js";

export const ReactivateWaitlistModal: FC<{
  sessionId: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({ sessionId, isOpen, onClose }) => {
  const { t } = useTranslation("sessionManagement");

  const { mutate: toggleWaitingListFreeze, isPending } =
    useToggleWaitingListFreeze();

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleReactivateWaitlist = () => {
    toggleWaitingListFreeze(
      { sessionId, freeze: false },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("modals.reactivateWaitlist.title")}
      onClose={handleClose}
      confirmButton={{
        label: t("modals.reactivateWaitlist.confirmButton"),
        onClick: handleReactivateWaitlist,
        color: "main",
        disabled: isPending,
      }}
      cancelButton={{
        label: t("modals.reactivateWaitlist.closeButton"),
        onClick: onClose,
        disabled: isPending,
      }}
    >
      <Body htmlVariant="p">{t("modals.reactivateWaitlist.body")}</Body>
    </Modal>
  );
};
