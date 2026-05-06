import { type FC } from "react";

import { MediaFormModal } from "#src/features/media-form-modal";
import { MEDIA_FORM_DATA_DEFAULT } from "#src/features/media-form/constants";
import { transformFormStateIntoCreateAPIData } from "#src/features/media-form/utils";
import { useTranslation } from "#src/utils/i18n";

import { useCreateMedia } from "./use-create-media";

type MediaCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MediaCreateModal: FC<MediaCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("media-form");
  const { createMedia, isLoading } = useCreateMedia();

  return (
    <MediaFormModal
      defaultValues={MEDIA_FORM_DATA_DEFAULT}
      formIdPrefix="media-form-create"
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(data, { closeModal }) => {
        createMedia(transformFormStateIntoCreateAPIData(data), {
          onSuccess: () => {
            closeModal();
          },
        });
      }}
      translations={{
        title: t("createModal.title"),
        confirmButtonLabel: t("createModal.buttons.create"),
        cancelButtonLabel: t("createModal.buttons.cancel"),
      }}
    />
  );
};
