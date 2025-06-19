import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  ImportLeadsModalContent,
  useImportLeadsUtils,
} from "./ImportLeadsModalContent";
import { ImportLeadsModalDescription } from "./ImportLeadsModalDescription";

type ImportLeadsModalProps = {
  open: boolean;
  handleCloseModal: () => void;
  handleOpenModal: () => void;
  refreshMemberList: () => void;
};

export const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({
  open,
  handleCloseModal,
  handleOpenModal,
  refreshMemberList,
}) => {
  const { t } = useTranslation("common");

  const { status, handleResetStatus, backgroundTask, handleProcessTask } =
    useImportLeadsUtils({
      handleOpenModal,
      refreshMemberList,
    });

  const onClose = () => {
    handleResetStatus(status);
    handleCloseModal();
  };

  return (
    <Modal
      size="sm"
      title={t("importLeadsModal.title")}
      open={open}
      onClose={onClose}
      description={<ImportLeadsModalDescription />}
    >
      <ImportLeadsModalContent
        backgroundTask={backgroundTask}
        status={status}
        handleProcessTask={handleProcessTask}
      />
    </Modal>
  );
};
