import React, { useCallback } from "react";
import { useTranslation } from "#src/utils/i18n";
import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import { duplicateGiftcard } from "#src/features/api";

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

  const handleOpen = useCallback(
    async ({ giftcardCopyId }: { giftcardCopyId: number }) => {
      // TODO : Implement navigation to giftcard page
      console.log(`Should navigate to giftcard/${giftcardCopyId}`);
    },
    [],
  );

  const handleDuplicate = useCallback(async () => {
    // Duplicate the giftcard
    const giftcardCopy = await duplicateGiftcard({ giftcardId });

    // Refresh the list page once the request has finished
    refreshPageList();

    // Display a toast to open the details page of the new giftcard
    toast({
      status: "default",
      icon: "copy-03",
      title: t("listPage.duplicateModal.toasts.messageDuplicated", {
        name: giftcardName,
      }),
      buttonLabel: t("listPage.duplicateModal.toasts.actionOpen"),
      onButtonClick: () => {
        if (giftcardCopy && "id" in giftcardCopy) {
          handleOpen({ giftcardCopyId: giftcardCopy.id });
        }
      },
    });

    // Close the modal
    onClose();
  }, [duplicateGiftcard, refreshPageList, toast, handleOpen]);

  return (
    <Modal
      open={isOpen}
      onConfirmClick={handleDuplicate}
      onCancelClick={onClose}
      confirmColor="main"
      confirmLabel={t("listPage.duplicateModal.buttons.duplicate")}
      cancelLabel={t("listPage.duplicateModal.buttons.cancel")}
      title={t("listPage.duplicateModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <>
        <Body htmlVariant="p">
          {t("listPage.duplicateModal.description.action", {
            name: giftcardName,
          })}
        </Body>
        <Body htmlVariant="p">
          {t("listPage.duplicateModal.description.effect")}
        </Body>
      </>
    </Modal>
  );
};
