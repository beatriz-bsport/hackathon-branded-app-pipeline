import React from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useArchiveGiftcard } from "#src/hooks/useArchiveGiftcard";
import { useTranslation } from "#src/utils/i18n";

type GiftcardArchiveModalProps = {
  giftcardId: number;
  giftcardName: string;
  isOpen: boolean;
  onClose: () => void;
  refreshPageList: () => void;
};

export const GiftcardArchiveModal: React.FC<GiftcardArchiveModalProps> = ({
  giftcardId,
  giftcardName,
  isOpen,
  onClose,
  refreshPageList,
}) => {
  const { t } = useTranslation("common");

  const { handleArchive, isLoading } = useArchiveGiftcard({
    fetchGiftcards: refreshPageList,
    handleCloseModal: onClose,
  });

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("listPage.archiveModal.buttons.archive"),
        color: "critical",
        onClick: () => handleArchive({ giftcardId }),
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("listPage.archiveModal.buttons.cancel"),
        onClick: onClose,
        disabled: isLoading,
      }}
      onCloseButtonClick={onClose}
      title={t("listPage.archiveModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <>
        <Body htmlVariant="p">
          {t("listPage.archiveModal.description.lineOne", {
            name: giftcardName,
          })}
        </Body>
        <Body htmlVariant="p" weight="strong">
          {t("listPage.archiveModal.description.lineTwo")}
        </Body>
      </>
    </Modal>
  );
};
