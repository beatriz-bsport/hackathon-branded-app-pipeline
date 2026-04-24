import type { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useRemoveVideoFromCollection } from "./use-remove-video-from-collection";

type CollectionRemoveMediaModalProps = {
  collectionId: number;
  videoId: number;
  videoName: string;
  isOpen: boolean;
  closeModal: () => void;
};

export const CollectionRemoveMediaModal: FC<
  CollectionRemoveMediaModalProps
> = ({ collectionId, videoId, videoName, isOpen, closeModal }) => {
  const { t } = useTranslation("collection-details");
  const { removeVideoFromCollection } = useRemoveVideoFromCollection({
    collectionId,
    onSuccess: closeModal,
  });

  const handleRemove = () => {
    removeVideoFromCollection({ video: videoId });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("removeMediaModal.buttons.remove"),
        color: "critical",
        onClick: handleRemove,
      }}
      cancelButton={{
        label: t("removeMediaModal.buttons.cancel"),
        onClick: closeModal,
      }}
      onCloseButtonClick={closeModal}
      title={t("removeMediaModal.title")}
      size="md"
      onClickOutside={closeModal}
    >
      <Body htmlVariant="p">
        {t("removeMediaModal.description", { videoName })}
      </Body>
    </Modal>
  );
};
