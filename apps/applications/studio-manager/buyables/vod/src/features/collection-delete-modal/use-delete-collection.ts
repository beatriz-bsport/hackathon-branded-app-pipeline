import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

import {
  type Collection,
  collectionKeys,
  deleteCollectionAPI,
} from "@bsport/api-buyables/collection";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type CollectionPage = {
  count: number;
  results: Collection[];
  [key: string]: unknown;
};

type DeletedCollectionSnapshot = {
  collection: Collection;
  index: number;
  queryKey: readonly unknown[];
};

const DELETION_DELAY_MS = 5000;

export const useDeleteCollection = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const { t, i18n } = useTranslation("collections-list");
  const queryClient = useQueryClient();
  const pendingDeletions = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const deletedSnapshots = useRef<Map<number, DeletedCollectionSnapshot>>(
    new Map(),
  );

  const restoreCache = useCallback(
    (id: number) => {
      const snapshot = deletedSnapshots.current.get(id);

      if (snapshot) {
        queryClient.setQueryData<CollectionPage>(snapshot.queryKey, (old) => {
          if (!old) return old;
          if (old.results.some((c) => c.id === id)) return old;

          const insertIndex = Math.min(snapshot.index, old.results.length);

          return {
            ...old,
            results: [
              ...old.results.slice(0, insertIndex),
              snapshot.collection,
              ...old.results.slice(insertIndex),
            ],
            count: old.count + 1,
          };
        });
        deletedSnapshots.current.delete(id);
      } else {
        queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      }
    },
    [queryClient],
  );

  const removeFromCache = useCallback(
    (id: number) => {
      const allCaches = queryClient.getQueriesData<CollectionPage>({
        queryKey: collectionKeys.lists(),
      });

      for (const [queryKey, data] of allCaches) {
        if (!data) continue;
        const index = data.results.findIndex((c) => c.id === id);
        if (index >= 0) {
          deletedSnapshots.current.set(id, {
            collection: data.results[index],
            index,
            queryKey: queryKey as readonly unknown[],
          });

          queryClient.setQueryData<CollectionPage>(queryKey, (old) => {
            if (!old) return old;
            return {
              ...old,
              results: old.results.filter((c) => c.id !== id),
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
    mutationFn: (id: number) => deleteCollectionAPI(fetch, { id }),
    onSuccess: (_, deletedId) => {
      deletedSnapshots.current.delete(deletedId);
      queryClient.invalidateQueries({
        queryKey: collectionKeys.lists(),
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
    (collectionId: number) => {
      const timeout = pendingDeletions.current.get(collectionId);
      if (timeout) {
        clearTimeout(timeout);
        pendingDeletions.current.delete(collectionId);
      }

      restoreCache(collectionId);
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("deleteModal.undoResponse.success"),
        buttonIcon: "x-close",
      });
    },
    [restoreCache, i18n.language],
  );

  const deleteCollection = useCallback(
    ({ id }: { id: number }) => {
      const existingTimeout = pendingDeletions.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      removeFromCache(id);

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
      onSuccess();
    },
    [onSuccess, cancelDeletion, performDelete, removeFromCache, i18n.language],
  );

  return { deleteCollection, isLoading: isDeleting };
};
