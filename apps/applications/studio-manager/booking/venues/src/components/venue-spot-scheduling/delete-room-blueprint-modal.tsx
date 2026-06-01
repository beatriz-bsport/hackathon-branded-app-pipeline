import { type FC } from "react";

import { type RoomBlueprint } from "@bsport/api-book";
import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useDeleteRoomBlueprint } from "#src/hooks/api/use-delete-room-blueprint";
import { useTranslation } from "#src/utils/i18n";

type DeleteRoomBlueprintModalProps = {
  blueprint: RoomBlueprint;
  onClose: () => void;
};

export const DeleteRoomBlueprintModal: FC<DeleteRoomBlueprintModalProps> = ({
  blueprint,
  onClose,
}) => {
  const { t } = useTranslation("venues-list");
  const { mutate: deleteRoomBlueprint, isPending } = useDeleteRoomBlueprint();

  const handleConfirm = () => {
    deleteRoomBlueprint(blueprint.id, { onSuccess: onClose });
  };

  return (
    <Modal
      open
      size="md"
      title={t("detail.spotScheduling.deleteModal.title")}
      onClose={onClose}
      onClickOutside={onClose}
      confirmButton={{
        color: "critical",
        label: t("detail.spotScheduling.deleteModal.confirm"),
        onClick: handleConfirm,
        loading: isPending,
      }}
      cancelButton={{
        label: t("detail.spotScheduling.deleteModal.cancel"),
        onClick: onClose,
      }}
    >
      <Body htmlVariant="p">
        {t("detail.spotScheduling.deleteModal.description")}
      </Body>
    </Modal>
  );
};
