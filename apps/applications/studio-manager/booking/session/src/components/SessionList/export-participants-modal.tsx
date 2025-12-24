import { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const ExportParticipantsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("sessionList");

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("exportParticipantsModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("exportParticipantsModal.confirmButton"),
        // type: "submit",
        // form: formId,
      }}
      cancelButton={{
        label: t("exportParticipantsModal.cancelButton"),
        onClick: onClose,
      }}
    >
      {/* {errorMessage && <Alert status="critical">{errorMessage}</Alert>} */}
      <Body htmlVariant="p" size="lg">
        {t("exportParticipantsModal.description")}
      </Body>
    </Modal>
  );
};
