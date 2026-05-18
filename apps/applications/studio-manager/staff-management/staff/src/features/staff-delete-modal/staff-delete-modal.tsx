import type { FC } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useDeleteStaff } from "./use-delete-staff";

type StaffDeleteModalProps = {
  staff: { id: number } | null;
  queryKey?: readonly unknown[];
  onClose: () => void;
  onSuccess?: () => void;
};

export const StaffDeleteModal: FC<StaffDeleteModalProps> = ({
  staff,
  queryKey,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation("staff-list");
  const { deleteStaff } = useDeleteStaff({ onSuccess });

  if (!staff) return null;

  const handleConfirm = () => {
    deleteStaff({ id: staff.id, queryKey });
    onClose();
  };

  return (
    <Modal
      open
      size="sm"
      title={t("deleteModal.title")}
      description={t("deleteModal.description")}
      onClose={onClose}
      onClickOutside={onClose}
      confirmButton={{
        color: "critical",
        label: t("deleteModal.buttons.delete"),
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("deleteModal.buttons.cancel"),
        onClick: onClose,
      }}
    />
  );
};
