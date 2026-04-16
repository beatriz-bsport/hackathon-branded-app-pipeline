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

interface CollectionListData {
  results: Collection[];
  count: number;
}

const DELETION_DELAY_MS = 5000;

/**
 * Handles collection deletion with an optimistic "undo" functionality.
 * Flow: remove the item from React Query cache immediately, show a toast with Undo,
 * and schedule the real API deletion after `DELETION_DELAY_MS`.
 * If Undo is clicked, the timeout is canceled and list queries are invalidated to restore data.
 * If Undo is not clicked, the item is deleted from the cache and the API call is made.
 */
export const useDeleteCollection = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const { t, i18n } = useTranslation("collections-list");
  const queryClient = useQueryClient();
  const pendingDeletions = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const removeFromCache = useCallback(
    (id: number) => {
      queryClient.setQueriesData(
        { queryKey: collectionKeys.lists() },
        (old: CollectionListData | undefined) => {
          if (!old?.results) return old;

          const filteredResults = old.results.filter(
            (collection: Collection) => collection.id !== id,
          );

          // Only decrement count if a collection was actually removed
          const wasRemoved = filteredResults.length < old.results.length;

          return {
            ...old,
            results: filteredResults,
            count: wasRemoved ? Math.max(0, (old.count || 0) - 1) : old.count,
          };
        },
      );
    },
    [queryClient],
  );

  const restoreCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });

    // After cache refresh, remove any collections that are still pending deletion
    setTimeout(() => {
      const pendingIds = Array.from(pendingDeletions.current.keys());
      if (pendingIds.length > 0) {
        pendingIds.forEach((id) => removeFromCache(id));
      }
    }, 0);
  }, [queryClient, removeFromCache]);

  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteCollectionAPI(fetch, { id }),
    onSuccess: (_, deletedId) => {
      // Ensure the deleted collection is removed from cache
      // This handles cases where the cache was restored but the deletion succeeded
      removeFromCache(deletedId);
    },
    onError: () => {
      restoreCache();
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
      restoreCache();
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
      removeFromCache(id);

      // Clear existing timeout if the same id is scheduled again
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
      onSuccess();
    },
    [onSuccess, removeFromCache, cancelDeletion, performDelete, i18n.language],
  );

  return { deleteCollection, isLoading: isDeleting };
};
