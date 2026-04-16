import type { FC } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useDeleteCollection } from "./use-delete-collection";

type CollectionDeleteModalProps = {
  collectionId: number;
  isOpen: boolean;
  closeModal: () => void;
};

export const CollectionDeleteModal: FC<CollectionDeleteModalProps> = ({
  collectionId,
  isOpen,
  closeModal,
}) => {
  const { t } = useTranslation("collections-list");

  const { deleteCollection, isLoading } = useDeleteCollection({
    onSuccess: closeModal,
  });

  const handleDelete = () => {
    deleteCollection({ id: collectionId });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("deleteModal.buttons.delete"),
        color: "critical",
        onClick: handleDelete,
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("deleteModal.buttons.cancel"),
        onClick: closeModal,
        disabled: isLoading,
      }}
      onCloseButtonClick={isLoading ? undefined : closeModal}
      title={t("deleteModal.title")}
      size="md"
      onClickOutside={isLoading ? undefined : closeModal}
    >
      <Body htmlVariant="p">{t("deleteModal.description")}</Body>
    </Modal>
  );
};
