import { Body, Modal } from "@bsport/kaizen-primitive-core";

import type { AutomatedCampaignWithAnalytics } from "#src/api/use-automated-campaign-analytics";
import { useTranslation } from "#src/utils/i18n";

import { useDeleteAutomation } from "./use-delete-automation";

type DeleteAutomationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  smartlistId: string;
  automation: AutomatedCampaignWithAnalytics;
};

export const DeleteAutomationModal: React.FC<DeleteAutomationModalProps> = ({
  isOpen,
  onClose,
  smartlistId,
  automation,
}: DeleteAutomationModalProps) => {
  const { t } = useTranslation("details");

  const { deleteAutomation, isDeleting } = useDeleteAutomation();

  const handleDelete = () => {
    deleteAutomation({ smartlistId, automationId: automation.id });
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
};
