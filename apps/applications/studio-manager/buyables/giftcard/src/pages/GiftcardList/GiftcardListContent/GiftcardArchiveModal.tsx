import React, { useCallback } from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";

import { archiveGiftcard, restoreGiftcard } from "#src/features/api";
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

  const handleRestore = useCallback(async () => {
    await restoreGiftcard({ giftcardId });
    await refreshPageList();
  }, [refreshPageList, restoreGiftcard, giftcardId]);

  const handleArchive = useCallback(async () => {
    // Archive the giftcard
    await archiveGiftcard({ giftcardId });

    // Refresh the list page once the request has finished
    refreshPageList();

    // Display a toast to "undo" the action
    toast({
      status: "default",
      icon: "unarchive",
      title: t("listPage.archiveModal.toasts.messageArchived", {
        name: giftcardName,
      }),
      buttonLabel: t("listPage.archiveModal.toasts.actionUndo"),
      onButtonClick: () => handleRestore(),
    });

    // Close the modal
    onClose();
  }, [archiveGiftcard, refreshPageList, handleRestore, giftcardId, toast]);

  return (
    <Modal
      open={isOpen}
      onConfirmClick={handleArchive}
      onCancelClick={onClose}
      confirmColor="critical"
      confirmLabel={t("listPage.archiveModal.buttons.archive")}
      cancelLabel={t("listPage.archiveModal.buttons.cancel")}
      title={t("listPage.archiveModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <>
        <Body htmlVariant="p">
          {t("listPage.archiveModal.description.action", {
            name: giftcardName,
          })}
        </Body>
        <Body htmlVariant="p">
          {t("listPage.archiveModal.description.effect")}
        </Body>
      </>
    </Modal>
  );
};
