import { Body, Modal, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type UpsellInterestConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Shown after the user requested an upsell (e.g. "Get in touch"): confirms we've noted their interest.
 * Single OK button closes this modal and should trigger parent to close all modals and Intercom.
 */
export const UpsellInterestConfirmationModal = ({
  isOpen,
  onClose,
}: UpsellInterestConfirmationModalProps) => {
  const { t } = useTranslation("campaign");

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("upsellInterestConfirmationModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("upsellInterestConfirmationModal.okButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h4" weight="strong">
          {t("upsellInterestConfirmationModal.heading")}
        </Title>
        <Body htmlVariant="p" size="md" weight="weak">
          {t("upsellInterestConfirmationModal.description")}
        </Body>
      </div>
    </Modal>
  );
};
