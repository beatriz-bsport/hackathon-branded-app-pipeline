import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

import {
  type Video,
  deleteVideoAPI,
  fetchVideosAPI,
  videoKeys,
} from "@bsport/api-buyables/video";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type VideoPage = Awaited<ReturnType<typeof fetchVideosAPI>>;

type DeletedVideoSnapshot = {
  video: Video;
  index: number;
  queryKey: readonly unknown[];
};

const DELETION_DELAY_MS = 5000;

export const useDeleteVideo = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t, i18n } = useTranslation("media-list");
  const queryClient = useQueryClient();
  const pendingDeletions = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const deletedSnapshots = useRef<Map<number, DeletedVideoSnapshot>>(new Map());

  const restoreCache = useCallback(
    (id: number) => {
      const snapshot = deletedSnapshots.current.get(id);

      if (snapshot) {
        queryClient.setQueryData<VideoPage>(snapshot.queryKey, (old) => {
          if (!old) return old;
          if (old.results.some((v) => v.id === id)) return old;

          const insertIndex = Math.min(snapshot.index, old.results.length);

          return {
            ...old,
            results: [
              ...old.results.slice(0, insertIndex),
              snapshot.video,
              ...old.results.slice(insertIndex),
            ],
            count: old.count + 1,
          };
        });
        deletedSnapshots.current.delete(id);
      } else {
        queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      }
    },
    [queryClient],
  );

  const removeFromCache = useCallback(
    (id: number) => {
      const allCaches = queryClient.getQueriesData<VideoPage>({
        queryKey: videoKeys.lists(),
      });

      for (const [queryKey, data] of allCaches) {
        if (!data) continue;
        const index = data.results.findIndex((v) => v.id === id);
        if (index >= 0) {
          deletedSnapshots.current.set(id, {
            video: data.results[index],
            index,
            queryKey: queryKey as readonly unknown[],
          });

          queryClient.setQueryData<VideoPage>(queryKey, (old) => {
            if (!old) return old;
            return {
              ...old,
              results: old.results.filter((v) => v.id !== id),
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
    mutationFn: (id: number) => deleteVideoAPI(fetch, { id }),
    onSuccess: (_, deletedId) => {
      deletedSnapshots.current.delete(deletedId);
      queryClient.invalidateQueries({
        queryKey: videoKeys.lists(),
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
    (videoId: number) => {
      const timeout = pendingDeletions.current.get(videoId);
      if (timeout) {
        clearTimeout(timeout);
        pendingDeletions.current.delete(videoId);
      }

      restoreCache(videoId);
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("deleteModal.undoResponse.success"),
        buttonIcon: "x-close",
      });
    },
    [restoreCache, i18n.language],
  );

  const deleteVideo = useCallback(
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

  return { deleteVideo, isLoading: isDeleting };
};
