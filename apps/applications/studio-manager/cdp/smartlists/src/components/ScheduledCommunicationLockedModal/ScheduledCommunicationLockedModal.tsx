import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type ScheduledCommunicationLockedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGoBack?: () => void;
};

export const ScheduledCommunicationLockedModal = ({
  isOpen,
  onClose,
  onGoBack,
}: ScheduledCommunicationLockedModalProps) => {
  const { t } = useTranslation("campaign");

  return (
    <Modal
      open={isOpen}
      title={t("table.campaignScheduled.lockedModal.title")}
      confirmButton={{
        label: onGoBack
          ? t("table.campaignScheduled.lockedModal.buttons.goBack")
          : t("table.campaignScheduled.lockedModal.buttons.close"),
        onClick: onGoBack ?? onClose,
      }}
      onClickOutside={onClose}
      onClose={onClose}
      size="md"
    >
      <Body htmlVariant="p" size="lg" color="default" weight="weak">
        {t("table.campaignScheduled.lockedModal.description")}
      </Body>
    </Modal>
  );
};
