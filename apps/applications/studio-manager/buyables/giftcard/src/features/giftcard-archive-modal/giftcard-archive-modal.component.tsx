import type { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useFetchPaginatedList } from "#src/hooks/useFetchPaginatedList";
import { useTranslation } from "#src/utils/i18n";

import { useArchiveGiftcard } from "./use-archive-giftcard-api";

type GiftcardArchiveModalProps = {
  giftcardId: number;
  giftcardName: string;
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void;
  onError?: () => void;
};

export const GiftcardArchiveModal: FC<GiftcardArchiveModalProps> = ({
  giftcardId,
  giftcardName,
  isOpen,
  closeModal,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation("common");

  // On undo success, refresh the list with the current parameters
  const { fetchGiftcardsPage } = useFetchPaginatedList({
    archived: false,
  });

  const { handleArchive, isLoading } = useArchiveGiftcard({
    onError,
    onSuccess,
    onUndoSuccess: fetchGiftcardsPage,
    closeModal,
  });

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("listPage.archiveModal.buttons.archive"),
        color: "critical",
        onClick: () => handleArchive({ id: giftcardId }),
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("listPage.archiveModal.buttons.cancel"),
        onClick: closeModal,
        disabled: isLoading,
      }}
      onCloseButtonClick={closeModal}
      title={t("listPage.archiveModal.title")}
      size="md"
      onClickOutside={closeModal}
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
