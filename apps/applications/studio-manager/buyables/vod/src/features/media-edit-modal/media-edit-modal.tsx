import { type FC } from "react";

import type { Video } from "@bsport/api-buyables/video";

import { MediaFormModal } from "#src/features/media-form-modal";
import {
  mapAssociatedCoachIdsToCoachIds,
  transformFormStateIntoAPIData,
  transformMediaIntoFormState,
} from "#src/features/media-form/utils";
import { useAllTeachersQuery } from "#src/hooks/api/use-all-teachers-query";
import { useEditMedia } from "#src/hooks/api/use-edit-media";
import { useTranslation } from "#src/utils/i18n";

type MediaEditModalProps = {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
};

export const MediaEditModal: FC<MediaEditModalProps> = ({
  video,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("media-form");
  const { editMedia, isLoading } = useEditMedia();
  const { data: teachersByCoachId } = useAllTeachersQuery();

  if (!isOpen || !teachersByCoachId) {
    return null;
  }

  const defaultValues = {
    ...transformMediaIntoFormState(video),
    coaches: mapAssociatedCoachIdsToCoachIds(
      video.coaches ?? [],
      teachersByCoachId,
    ),
  };

  return (
    <MediaFormModal
      defaultValues={defaultValues}
      formIdPrefix="media-form-edit"
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(data, { closeModal }) => {
        editMedia(
          {
            id: video.id,
            formData: transformFormStateIntoAPIData(data, video),
          },
          {
            onSuccess: () => {
              closeModal();
            },
          },
        );
      }}
      translations={{
        title: t("editModal.title"),
        confirmButtonLabel: t("editModal.buttons.save"),
        cancelButtonLabel: t("editModal.buttons.cancel"),
      }}
    />
  );
};
