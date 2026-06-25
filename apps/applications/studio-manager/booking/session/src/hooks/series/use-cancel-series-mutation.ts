import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  bookingKeys,
  deleteGroupSessionMutationOptions,
  groupSessionKeys,
  sessionKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";
import { buildCancelGroupSessionPayload } from "#src/utils/series-cancel-payload";

type CancelSeriesParams = {
  notifyIfCancelled: boolean;
  seriesId: number;
};

export const useCancelSeriesMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("series");
  const { handleBackgroundTaskError, waitForBackgroundTask } =
    useWaitForBackgroundTask(fetch);
  const { mutateAsync: deleteGroupSession } = useMutation(
    deleteGroupSessionMutationOptions(fetch),
  );

  return useMutation<unknown | null, Error, CancelSeriesParams>({
    mutationFn: async ({ notifyIfCancelled, seriesId }) => {
      const backgroundTaskUuid = await deleteGroupSession({
        groupSessionId: seriesId,
        payload: buildCancelGroupSessionPayload({ notifyIfCancelled }),
      });

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
        queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
      ]);

      toast({
        status: "default",
        description: t("seriesCancelModal.toasts.success"),
        icon: "x-circle-solid",
        buttonIcon: "x-close",
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("seriesCancelModal.errors.cancel"));
    },
  });
};
