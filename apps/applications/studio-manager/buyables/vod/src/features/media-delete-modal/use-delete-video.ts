import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import {
  type Video,
  deleteVideoAPI,
  fetchVideosAPI,
  videoKeys,
} from "@bsport/api-buyables/video";
import { toast } from "@bsport/kaizen-primitive-core";

import {
  addPendingDeletion,
  removePendingDeletion,
} from "#src/hooks/use-pending-video-deletions";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type VideoListData = Awaited<ReturnType<typeof fetchVideosAPI>>;

const DELETION_DELAY_MS = 5000;

export const useDeleteVideo = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t, i18n } = useTranslation("media-list");
  const queryClient = useQueryClient();
  const pendingDeletions = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      pendingDeletions.current.forEach((timeout, id) => {
        removePendingDeletion(id);
        clearTimeout(timeout);
      });
    };
  }, []);

  const removeFromCache = useCallback(
    (id: number) => {
      queryClient.setQueriesData(
        { queryKey: videoKeys.lists() },
        (old: VideoListData | undefined) => {
          if (!old?.results) return old;

          const filteredResults = old.results.filter(
            (video: Video) => video.id !== id,
          );
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
    queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
  }, [queryClient]);

  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteVideoAPI(fetch, { id }),
    onSuccess: (_, deletedId) => {
      removeFromCache(deletedId);
      removePendingDeletion(deletedId);
    },
    onError: (_, deletedId) => {
      removePendingDeletion(deletedId);
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
    (videoId: number) => {
      const timeout = pendingDeletions.current.get(videoId);
      if (timeout) {
        clearTimeout(timeout);
        pendingDeletions.current.delete(videoId);
      }

      removePendingDeletion(videoId);
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

  const deleteVideo = useCallback(
    ({ id }: { id: number }) => {
      addPendingDeletion(id);

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
    [onSuccess, cancelDeletion, performDelete, i18n.language],
  );

  return { deleteVideo, isLoading: isDeleting };
};
