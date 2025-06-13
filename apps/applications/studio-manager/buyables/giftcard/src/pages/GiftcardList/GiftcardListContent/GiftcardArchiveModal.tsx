import React from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  archiveGiftcardAction,
  restoreGiftcardAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
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

  const [, handleRestore] = useAsync({
    asyncFn: async () => {
      return restoreGiftcardAction(fetch, { id: giftcardId });
    },
    onSuccess: () => {
      refreshPageList();
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.errorMessages.unarchive", {
          name: giftcardName,
        }),
        buttonLabel: t("toasts.actions.close"),
      });
    },
    dependencies: [refreshPageList, giftcardName, giftcardId],
  });

  const [, handleArchive] = useAsync({
    asyncFn: async () => {
      return archiveGiftcardAction(fetch, { id: giftcardId });
    },
    onSuccess: () => {
      // Refresh the list page once the request has finished
      refreshPageList();

      // Display a toast to "undo" the action
      toast({
        status: "default",
        icon: "unarchive",
        title: t("toasts.successMessages.archive", {
          name: giftcardName,
        }),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => handleRestore(),
      });

      // Close the modal
      onClose();
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.errorMessages.archive", {
          name: giftcardName,
        }),
        buttonLabel: t("toasts.actions.close"),
      });

      // Close the modal
      onClose();
    },
    dependencies: [giftcardName, giftcardId, refreshPageList, handleRestore],
  });

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("listPage.archiveModal.buttons.archive"),
        color: "critical",
        onClick: handleArchive,
      }}
      cancelButton={{
        label: t("listPage.archiveModal.buttons.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
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
