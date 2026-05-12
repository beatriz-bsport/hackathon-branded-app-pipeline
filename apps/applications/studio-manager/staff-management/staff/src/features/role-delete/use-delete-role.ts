import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import {
  type Role,
  StaffRoleErrorCodes,
  deleteRoleDefinitionAPI,
  roleDefinitionKeys,
} from "@bsport/api-staff-management/role";
import { HTTPException } from "@bsport/fetch";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const DELETION_DELAY_MS = 5000;

type DeleteRoleParams = {
  id: number;
};

type DeletedRoleSnapshot = {
  role: Role;
  index: number;
};

type UseDeleteRoleOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const useDeleteRole = ({
  onSuccess,
  onError,
}: UseDeleteRoleOptions = {}) => {
  const { t } = useTranslation("role-list");
  const queryClient = useQueryClient();
  const pendingDeletions = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const deletedRoleSnapshots = useRef<Map<number, DeletedRoleSnapshot>>(
    new Map(),
  );

  const restoreRoleListCache = useCallback(
    (roleId: number) => {
      const deletedRoleSnapshot = deletedRoleSnapshots.current.get(roleId);

      if (deletedRoleSnapshot) {
        queryClient.setQueryData(
          roleDefinitionKeys.list(),
          (currentRoles: Role[] | undefined) => {
            if (!currentRoles) return [deletedRoleSnapshot.role];
            if (currentRoles.some((role) => role.id === roleId)) {
              return currentRoles;
            }

            const insertIndex = Math.min(
              deletedRoleSnapshot.index,
              currentRoles.length,
            );

            return [
              ...currentRoles.slice(0, insertIndex),
              deletedRoleSnapshot.role,
              ...currentRoles.slice(insertIndex),
            ];
          },
        );
      } else {
        queryClient.invalidateQueries({ queryKey: roleDefinitionKeys.lists() });
      }

      deletedRoleSnapshots.current.delete(roleId);
    },
    [queryClient],
  );

  useEffect(() => {
    const pendingDeletionsByRoleId = pendingDeletions.current;

    return () => {
      pendingDeletionsByRoleId.forEach((timeout, roleId) => {
        clearTimeout(timeout);
        restoreRoleListCache(roleId);
      });
      pendingDeletionsByRoleId.clear();
    };
  }, [restoreRoleListCache]);

  const removeFromCache = useCallback(
    (roleId: number) => {
      const currentRoles = queryClient.getQueryData<Role[]>(
        roleDefinitionKeys.list(),
      );
      const deletedRoleIndex =
        currentRoles?.findIndex((role) => role.id === roleId) ?? -1;
      const deletedRole =
        deletedRoleIndex >= 0 ? currentRoles?.[deletedRoleIndex] : undefined;

      if (deletedRole) {
        deletedRoleSnapshots.current.set(roleId, {
          role: deletedRole,
          index: deletedRoleIndex,
        });
      }

      queryClient.setQueryData(
        roleDefinitionKeys.list(),
        (oldRoles: Role[] | undefined) =>
          oldRoles?.filter((role) => role.id !== roleId),
      );
    },
    [queryClient],
  );

  const { mutate: performDelete } = useMutation({
    mutationFn: (roleId: number) =>
      deleteRoleDefinitionAPI(fetch, { id: roleId }),
    onSuccess: (_, deletedRoleId) => {
      deletedRoleSnapshots.current.delete(deletedRoleId);
      onSuccess?.();
    },
    onError: (error, deletedRoleId) => {
      restoreRoleListCache(deletedRoleId);
      onError?.(error);

      const isAssignedStaffError =
        error instanceof HTTPException &&
        error.customErrorCodes.includes(
          StaffRoleErrorCodes.STAFF_ROLE_CANNOT_BE_DELETED,
        );

      toast({
        status: "critical",
        icon: "alert-circle",
        title: isAssignedStaffError
          ? t("deleteModal.submitResponse.errorStaffAssigned")
          : t("deleteModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  const cancelDeletion = useCallback(
    (roleId: number) => {
      const timeout = pendingDeletions.current.get(roleId);
      if (!timeout) return;

      clearTimeout(timeout);
      pendingDeletions.current.delete(roleId);
      restoreRoleListCache(roleId);

      toast({
        status: "default",
        icon: "reverse-left",
        title: t("deleteModal.undoResponse.success"),
        buttonIcon: "x-close",
      });
    },
    [restoreRoleListCache, t],
  );

  const deleteRole = useCallback(
    ({ id }: DeleteRoleParams) => {
      removeFromCache(id);

      const existingTimeout = pendingDeletions.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      toast({
        status: "default",
        icon: "trash-01",
        title: t("deleteModal.submitResponse.success"),
        buttonLabel: t("deleteModal.undoAction.label"),
        onButtonClick: () => cancelDeletion(id),
        duration: DELETION_DELAY_MS,
      });

      const timeout = setTimeout(() => {
        pendingDeletions.current.delete(id);
        performDelete(id);
      }, DELETION_DELAY_MS);

      pendingDeletions.current.set(id, timeout);
    },
    [cancelDeletion, performDelete, removeFromCache, t],
  );

  return { deleteRole };
};
