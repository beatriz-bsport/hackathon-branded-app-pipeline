import { useState } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { useDeleteAutomation } from "./use-delete-automation";

export function useDeleteAutomationModal() {
  const [automationId, setAutomationId] = useState<number | null>(null);

  const isOpen = automationId !== null;

  const requestDelete = (id: number) => {
    setAutomationId(id);
  };

  const cancelDelete = () => {
    setAutomationId(null);
  };

  return {
    isOpen,
    automationId,
    requestDelete,
    cancelDelete,
  };
}

type DeleteAutomationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  smartlistId: string;
  automationId: number | null;
};

export function DeleteAutomationModal({
  isOpen,
  onClose,
  smartlistId,
  automationId,
}: DeleteAutomationModalProps) {
  const { t } = useTranslation("details");

  const { deleteAutomation, isDeleting } = useDeleteAutomation();

  const handleDelete = () => {
    invariant(
      automationId !== null,
      "At this point automationId should have a value",
    );

    deleteAutomation({ smartlistId, automationId });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("automation.messages.deleteModal.buttons.delete"),
        color: "critical",
        onClick: handleDelete,
        disabled: isDeleting,
      }}
      cancelButton={{
        label: t("automation.messages.deleteModal.buttons.cancel"),
        onClick: onClose,
      }}
      title={t("automation.messages.deleteModal.title")}
      size="md"
      onClickOutside={onClose}
      onClose={onClose}
    >
      <Body htmlVariant="p" size="lg" color="default" weight="weak">
        {t("automation.messages.deleteModal.description")}
      </Body>
    </Modal>
  );
}
