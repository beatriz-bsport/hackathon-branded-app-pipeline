import React from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useDuplicateGiftcard } from "#src/hooks/useDuplicateGiftcard";
import { useTranslation } from "#src/utils/i18n";

type GiftcardDuplicateModalProps = {
  giftcardId: number;
  giftcardName: string;
  isOpen: boolean;
  onClose: () => void;
  refreshPageList: () => void;
};

export const GiftcardDuplicateModal: React.FC<GiftcardDuplicateModalProps> = ({
  giftcardId,
  giftcardName,
  isOpen,
  onClose,
  refreshPageList,
}) => {
  const { t } = useTranslation("common");
  const { handleDuplicate, isLoading } = useDuplicateGiftcard({
    fetchGiftcards: refreshPageList,
    handleCloseModal: onClose,
  });

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("listPage.duplicateModal.buttons.duplicate"),
        onClick: () => handleDuplicate({ giftcardId }),
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("listPage.duplicateModal.buttons.cancel"),
        onClick: onClose,
        disabled: isLoading,
      }}
      onCloseButtonClick={onClose}
      title={t("listPage.duplicateModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <Body htmlVariant="p">
        {t("listPage.duplicateModal.description.action", {
          name: giftcardName,
        })}
      </Body>
    </Modal>
  );
};
