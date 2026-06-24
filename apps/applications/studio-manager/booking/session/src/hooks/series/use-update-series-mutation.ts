import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type UpdateGroupSessionPayload,
  groupSessionKeys,
  sessionKeys,
  updateGroupSessionAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

const updateGroupSession = updateGroupSessionAPI.bind(null, fetch);

type UpdateSeriesParams = {
  payload: UpdateGroupSessionPayload;
  seriesId: number;
};

export const useUpdateSeriesMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("series");
  const { handleBackgroundTaskError, waitForBackgroundTask } =
    useWaitForBackgroundTask(fetch);

  return useMutation<unknown | null, Error, UpdateSeriesParams>({
    mutationFn: async ({ payload, seriesId }) => {
      const backgroundTaskUuid = await updateGroupSession(seriesId, payload);

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: async (_, { seriesId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupSessionKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: groupSessionKeys.detail(seriesId),
        }),
        queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
      ]);

      toast({
        status: "default",
        description: t("toasts.seriesUpdated"),
        icon: "check",
        buttonIcon: "x-close",
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("errors.update"));
    },
  });
};
