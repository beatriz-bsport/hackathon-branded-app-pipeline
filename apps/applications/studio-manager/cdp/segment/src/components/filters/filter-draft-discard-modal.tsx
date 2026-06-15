import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type FilterDraftDiscardModalProps = {
  isOpen: boolean;
  onConfirmDiscard: () => void;
  onCancel: () => void;
};

export const FilterDraftDiscardModal = ({
  isOpen,
  onConfirmDiscard,
  onCancel,
}: FilterDraftDiscardModalProps) => {
  const { t } = useTranslation("details");

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("filterDraftDiscardModal.title")}
      description={
        <Body size="md" weight="weak">
          {t("filterDraftDiscardModal.description")}
        </Body>
      }
      onClose={onCancel}
      confirmButton={{
        label: t("filterDraftDiscardModal.confirm"),
        onClick: onConfirmDiscard,
        color: "critical",
      }}
      cancelButton={{
        label: t("filterDraftDiscardModal.cancel"),
        onClick: onCancel,
      }}
    />
  );
};
