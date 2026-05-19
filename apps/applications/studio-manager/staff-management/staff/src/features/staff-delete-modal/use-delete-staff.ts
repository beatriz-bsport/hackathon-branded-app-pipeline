import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

import {
  type UserRole,
  deleteUserRoleAPI,
  staffRoleKeys,
} from "@bsport/api-staff-management/role";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const DELETION_DELAY_MS = 5000;

type StaffPage = { count: number; results: UserRole[]; [key: string]: unknown };

type DeletedStaffSnapshot = {
  staff: UserRole;
  index: number;
  queryKey: readonly unknown[];
};

const STAFF_PAGINATED_LISTS_KEY = [
  ...staffRoleKeys.lists(),
  "paginated",
] as const;

export const useDeleteStaff = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const { t } = useTranslation("staff-list");
  const queryClient = useQueryClient();
  const pendingDeletions = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const deletedSnapshots = useRef<Map<number, DeletedStaffSnapshot>>(new Map());

  const restoreCache = useCallback(
    (id: number) => {
      const snapshot = deletedSnapshots.current.get(id);

      if (snapshot) {
        queryClient.setQueryData<StaffPage>(snapshot.queryKey, (old) => {
          if (!old) return old;
          if (old.results.some((s) => s.id === id)) return old;

          const insertIndex = Math.min(snapshot.index, old.results.length);

          return {
            ...old,
            results: [
              ...old.results.slice(0, insertIndex),
              snapshot.staff,
              ...old.results.slice(insertIndex),
            ],
            count: old.count + 1,
          };
        });
        deletedSnapshots.current.delete(id);
      } else {
        queryClient.invalidateQueries({ queryKey: STAFF_PAGINATED_LISTS_KEY });
      }
    },
    [queryClient],
  );

  const removeFromCache = useCallback(
    (id: number, sourceQueryKey?: readonly unknown[]) => {
      if (sourceQueryKey) {
        const sourceData = queryClient.getQueryData<StaffPage>(sourceQueryKey);
        const sourceIndex =
          sourceData?.results.findIndex((staff) => staff.id === id) ?? -1;

        if (sourceData && sourceIndex >= 0) {
          deletedSnapshots.current.set(id, {
            staff: sourceData.results[sourceIndex],
            index: sourceIndex,
            queryKey: sourceQueryKey,
          });

          queryClient.setQueryData<StaffPage>(sourceQueryKey, (old) => {
            if (!old) return old;
            return {
              ...old,
              results: old.results.filter((staff) => staff.id !== id),
              count: old.count - 1,
            };
          });
          return;
        }
      }

      const allCaches = queryClient.getQueriesData<StaffPage>({
        queryKey: STAFF_PAGINATED_LISTS_KEY,
      });

      for (const [queryKey, data] of allCaches) {
        if (!data) continue;
        const index = data.results.findIndex((s) => s.id === id);
        if (index >= 0) {
          deletedSnapshots.current.set(id, {
            staff: data.results[index],
            index,
            queryKey: queryKey as readonly unknown[],
          });

          queryClient.setQueryData<StaffPage>(queryKey, (old) => {
            if (!old) return old;
            return {
              ...old,
              results: old.results.filter((staff) => staff.id !== id),
              count: old.count - 1,
            };
          });
          break;
        }
      }
    },
    [queryClient],
  );

  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteUserRoleAPI(fetch, { id }),
    onSuccess: (_, deletedId) => {
      deletedSnapshots.current.delete(deletedId);
      queryClient.invalidateQueries({
        queryKey: STAFF_PAGINATED_LISTS_KEY,
        refetchType: "none",
      });
    },
    onError: (_, deletedId) => {
      restoreCache(deletedId);
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("deleteModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  const cancelDeletion = useCallback(
    (staffId: number) => {
      const timeout = pendingDeletions.current.get(staffId);
      if (!timeout) return;

      clearTimeout(timeout);
      pendingDeletions.current.delete(staffId);

      restoreCache(staffId);
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("deleteModal.undoResponse.success"),
        buttonIcon: "x-close",
      });
    },
    [restoreCache, t],
  );

  const deleteStaff = useCallback(
    ({ id, queryKey }: { id: number; queryKey?: readonly unknown[] }) => {
      const existingTimeout = pendingDeletions.current.get(id);

      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      removeFromCache(id, queryKey);

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
      onSuccess?.();
    },
    [onSuccess, cancelDeletion, performDelete, removeFromCache, t],
  );

  return { deleteStaff, isLoading: isDeleting };
};
