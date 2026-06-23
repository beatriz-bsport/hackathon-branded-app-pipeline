import { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useToggleWaitingListFreeze } from "#src/hooks/session-api/session-actions/use-toggle-waiting-list-freeze";
import { useTranslation } from "#src/utils/i18n";

export const PauseWaitlistModal: FC<{
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

  const handlePauseWaitlist = () => {
    toggleWaitingListFreeze(
      { sessionId, freeze: true },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("modals.pauseWaitlist.title")}
      onClose={handleClose}
      confirmButton={{
        label: t("modals.pauseWaitlist.confirmButton"),
        onClick: handlePauseWaitlist,
        color: "critical",
        disabled: isPending,
      }}
      cancelButton={{
        label: t("modals.pauseWaitlist.closeButton"),
        onClick: onClose,
        disabled: isPending,
      }}
    >
      <Body htmlVariant="p">{t("modals.pauseWaitlist.body")}</Body>
    </Modal>
  );
};
