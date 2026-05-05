import { type FC, useState } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type MediaDeleteModalProps = {
  videoName: string;
  closeModal: () => void;
  onConfirm: () => void | Promise<void>;
};

export const MediaDeleteModal: FC<MediaDeleteModalProps> = ({
  videoName,
  closeModal,
  onConfirm,
}) => {
  const { t } = useTranslation("media-list");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleClose = isSubmitting ? () => {} : closeModal;

  return (
    <Modal
      open={true}
      confirmButton={{
        label: t("deleteModal.buttons.delete"),
        color: "critical",
        onClick: handleDelete,
        disabled: isSubmitting,
      }}
      cancelButton={{
        label: t("deleteModal.buttons.cancel"),
        onClick: closeModal,
        disabled: isSubmitting,
      }}
      onCloseButtonClick={handleClose}
      title={t("deleteModal.title")}
      size="md"
      onClickOutside={handleClose}
    >
      <Body htmlVariant="p">
        {t("deleteModal.description", { mediaName: videoName })}
      </Body>
      <Body htmlVariant="p" className="font-bold">
        {t("deleteModal.descriptionWarning")}
      </Body>
    </Modal>
  );
};
