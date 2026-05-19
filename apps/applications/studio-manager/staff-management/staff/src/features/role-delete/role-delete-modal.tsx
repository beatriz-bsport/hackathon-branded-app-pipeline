import type { FC } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useDeleteRole } from "./use-delete-role";

export type RoleDeleteData = {
  id: number;
  name: string;
  staffAssignedCount: number;
};

type RoleDeleteModalProps = {
  role: RoleDeleteData | null;
  onClose: () => void;
  preservePendingDeletionOnUnmount?: boolean;
  onDeleteScheduled?: () => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const RoleDeleteModal: FC<RoleDeleteModalProps> = ({
  role,
  onClose,
  preservePendingDeletionOnUnmount = false,
  onDeleteScheduled,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation("role-list");
  const { deleteRole } = useDeleteRole({
    preservePendingDeletionOnUnmount,
    onSuccess,
    onError,
  });
  const hasAssignedStaff = (role?.staffAssignedCount ?? 0) > 0;

  if (!role) return null;

  if (hasAssignedStaff) {
    return (
      <Modal
        open
        size="sm"
        title={t("deleteModal.cannotDelete.title")}
        description={t("deleteModal.cannotDelete.description")}
        onClose={onClose}
        onClickOutside={onClose}
        confirmButton={{
          label: t("deleteModal.cannotDelete.close"),
          onClick: onClose,
        }}
      />
    );
  }

  const handleConfirm = () => {
    deleteRole({ id: role.id });
    onClose();
    onDeleteScheduled?.();
  };

  return (
    <Modal
      open
      size="sm"
      title={t("deleteModal.title")}
      description={t("deleteModal.description", {
        roleName: role.name,
      })}
      onClose={onClose}
      onClickOutside={onClose}
      confirmButton={{
        color: "critical",
        label: t("deleteModal.delete"),
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("deleteModal.keep"),
        onClick: onClose,
      }}
    />
  );
};
