import type { FC } from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteContractPauseMutation } from "#src/hooks/api/use-contract-pause-mutations";
import { useTranslation } from "#src/utils/i18n";

type CancelContractPauseModalProps = {
  contractId: number;
  contractPauseId: number | null;
  isOpen: boolean;
  closeModal: () => void;
};

export const CancelContractPauseModal: FC<CancelContractPauseModalProps> = ({
  contractId,
  contractPauseId,
  isOpen,
  closeModal,
}) => {
  const { t } = useTranslation("contract-features");

  const { mutate: cancelPause, isPending } = useDeleteContractPauseMutation({
    onSuccess: () => {
      toast({
        status: "default",
        icon: "alarm-clock-off",
        title: t("pauseList.cancelPauseModal.toast.success"),
        buttonIcon: "x-close",
      });
      closeModal();
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("pauseList.cancelPauseModal.toast.error"),
        buttonIcon: "x-close",
      });
      closeModal();
    },
    contractId,
  });

  const safeCloseModal = () => {
    if (!isPending) {
      closeModal();
    }
  };

  const onCancelClick = () => {
    if (!contractPauseId) {
      return;
    }
    cancelPause({ contract_pause_id: contractPauseId });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("pauseList.cancelPauseModal.actions.cancel"),
        color: "critical",
        onClick: onCancelClick,
        disabled: isPending,
      }}
      cancelButton={{
        label: t("pauseList.cancelPauseModal.actions.keep"),
        onClick: safeCloseModal,
        disabled: isPending,
      }}
      onCloseButtonClick={safeCloseModal}
      title={t("pauseList.cancelPauseModal.title")}
      size="md"
      onClickOutside={safeCloseModal}
    >
      <Body htmlVariant="p">{t("pauseList.cancelPauseModal.description")}</Body>
    </Modal>
  );
};
