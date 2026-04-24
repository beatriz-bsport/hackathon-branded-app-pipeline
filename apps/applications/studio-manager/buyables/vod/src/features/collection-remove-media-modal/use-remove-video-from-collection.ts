import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

import {
  type Collection,
  type UpdateCollectionVideoItemParams,
  collectionKeys,
  removeVideoFromCollectionMutationOptions,
} from "@bsport/api-buyables/collection";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type UseRemoveVideoFromCollectionOptions = {
  collectionId: number;
  onSuccess?: () => void;
};

const REMOVAL_DELAY_MS = 5000;

export const useRemoveVideoFromCollection = (
  options: UseRemoveVideoFromCollectionOptions,
) => {
  const { collectionId, onSuccess } = options;
  const { t, i18n } = useTranslation("collection-details");
  const queryClient = useQueryClient();
  const pendingRemovals = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const removeFromCache = useCallback(
    (videoId: number) => {
      queryClient.setQueryData(
        collectionKeys.detail(collectionId),
        (old: Collection | undefined) => {
          if (!old?.videos) {
            return old;
          }

          return {
            ...old,
            videos: old.videos.filter(
              (currentVideoId) => currentVideoId !== videoId,
            ),
          };
        },
      );
    },
    [collectionId, queryClient],
  );

  const restoreCache = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: collectionKeys.detail(collectionId),
    });

    const pendingIds = Array.from(pendingRemovals.current.keys());
    pendingIds.forEach((videoId) => removeFromCache(videoId));
  }, [collectionId, queryClient, removeFromCache]);

  const { mutate: performRemove, isPending: isLoading } = useMutation({
    ...removeVideoFromCollectionMutationOptions(fetch),
    onSuccess: (_, variables: UpdateCollectionVideoItemParams) => {
      // Re-remove if undo restored the cache while the request was still in flight.
      removeFromCache(variables.video);
      onSuccess?.();
    },
    onError: () => {
      void restoreCache();
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("removeMediaModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  const cancelRemoval = useCallback(
    (videoId: number) => {
      const timeout = pendingRemovals.current.get(videoId);

      if (!timeout) {
        return;
      }

      clearTimeout(timeout);
      pendingRemovals.current.delete(videoId);

      void restoreCache();
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("removeMediaModal.undoResponse.success"),
        buttonIcon: "x-close",
      });
    },
    [restoreCache, i18n.language],
  );

  const removeVideoFromCollection = useCallback(
    ({ video }: Pick<UpdateCollectionVideoItemParams, "video">) => {
      void (async () => {
        await queryClient.cancelQueries({
          queryKey: collectionKeys.detail(collectionId),
        });
        removeFromCache(video);
      })();

      const existingTimeout = pendingRemovals.current.get(video);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      toast({
        status: "default",
        icon: "trash-01",
        title: t("removeMediaModal.submitResponse.success"),
        buttonLabel: t("removeMediaModal.undoAction.label"),
        onButtonClick: () => cancelRemoval(video),
        duration: REMOVAL_DELAY_MS,
      });

      const timeout = setTimeout(() => {
        pendingRemovals.current.delete(video);
        performRemove({ id: collectionId, video });
      }, REMOVAL_DELAY_MS);

      pendingRemovals.current.set(video, timeout);
    },
    [
      cancelRemoval,
      collectionId,
      performRemove,
      removeFromCache,
      i18n.language,
    ],
  );

  return { removeVideoFromCollection, isLoading };
};
