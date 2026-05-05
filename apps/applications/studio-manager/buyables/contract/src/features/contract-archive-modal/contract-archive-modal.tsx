import type { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  type UseArchiveContractParams,
  useArchiveContract,
} from "./use-archive-contract";

type ContractArchiveModalProps = {
  contractId: number;
  contractName: string;
  isOpen: boolean;
  closeModal: () => void;
} & UseArchiveContractParams;

export const ContractArchiveModal: FC<ContractArchiveModalProps> = ({
  contractId,
  contractName,
  isOpen,
  closeModal,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation("contract-features");

  const { archiveContract, isLoading } = useArchiveContract({
    onError,
    onSuccess,
  });

  const safeCloseModal = () => {
    if (!isLoading) {
      closeModal();
    }
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("archiveModal.actions.archive"),
        color: "critical",
        onClick: () => archiveContract({ id: contractId }),
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("archiveModal.actions.keep"),
        onClick: safeCloseModal,
        disabled: isLoading,
      }}
      onCloseButtonClick={safeCloseModal}
      title={t("archiveModal.title")}
      size="md"
      onClickOutside={safeCloseModal}
    >
      <>
        <Body htmlVariant="p" className="mb-sm">
          {t("archiveModal.body.consequence", {
            name: contractName,
          })}
        </Body>
        <Body htmlVariant="p" weight="strong">
          {t("archiveModal.body.restore")}
        </Body>
      </>
    </Modal>
  );
};
