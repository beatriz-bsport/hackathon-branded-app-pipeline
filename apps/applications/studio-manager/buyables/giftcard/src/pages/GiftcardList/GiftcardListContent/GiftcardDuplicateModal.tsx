import React from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  type Giftcard,
  duplicateGiftcardAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { useGiftcardNavigation } from "#src/hooks/useGiftcardNavigation";
import { fetch } from "#src/utils/fetch";
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
  const { navigateToGiftcardDetail } = useGiftcardNavigation();

  const [, handleDuplicate] = useAsync({
    asyncFn: async () => {
      return duplicateGiftcardAction(fetch, { id: giftcardId });
    },
    onSuccess: (giftcardCopy: Giftcard) => {
      // Refresh the list page once the request has finished
      refreshPageList();

      // Display a toast to open the details page of the new giftcard
      toast({
        status: "default",
        icon: "copy-03",
        title: t("toasts.successMessages.duplicate", {
          name: giftcardName,
        }),
        buttonLabel: t("toasts.actions.open"),
        onButtonClick: () => {
          if (giftcardCopy && "id" in giftcardCopy) {
            navigateToGiftcardDetail(giftcardCopy.id);
          }
        },
      });

      // Close the modal
      onClose();
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.errorMessages.duplicate", {
          name: giftcardName,
        }),
        buttonLabel: t("toasts.actions.close"),
      });
    },
    dependencies: [
      navigateToGiftcardDetail,
      refreshPageList,
      giftcardName,
      giftcardId,
    ],
  });

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("listPage.duplicateModal.buttons.duplicate"),
        onClick: handleDuplicate,
      }}
      cancelButton={{
        label: t("listPage.duplicateModal.buttons.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
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
