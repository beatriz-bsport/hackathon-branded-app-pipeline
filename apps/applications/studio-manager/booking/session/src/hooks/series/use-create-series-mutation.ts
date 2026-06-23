import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PrepareGroupSessionsCreationPayload,
  createGroupSessionsWithOffersMutationOptions,
  groupSessionKeys,
  prepareGroupSessionsCreationMutationOptions,
  sessionKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";
import { normalizePreparedGroupSessionsForCreation } from "#src/utils/series-group-session-creation-payload";

type CreateSeriesParams = {
  preparePayload: PrepareGroupSessionsCreationPayload;
};

export const useCreateSeriesMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("series");

  const { handleBackgroundTaskError, waitForBackgroundTask } =
    useWaitForBackgroundTask(fetch);

  const { mutateAsync: prepareGroupSessionsCreation } = useMutation(
    prepareGroupSessionsCreationMutationOptions(fetch),
  );

  const { mutateAsync: createGroupSessionsWithOffers } = useMutation(
    createGroupSessionsWithOffersMutationOptions(fetch),
  );

  return useMutation<unknown | null, Error, CreateSeriesParams>({
    mutationFn: async ({ preparePayload }) => {
      // Backend calls this preparation step "generate_preview". The add flow
      // uses the prepared response only to produce the final create payload.
      const preparedGroupSessions =
        await prepareGroupSessionsCreation(preparePayload);

      const createPayload = normalizePreparedGroupSessionsForCreation(
        preparedGroupSessions,
      );

      const backgroundTaskUuid =
        await createGroupSessionsWithOffers(createPayload);

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupSessionKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
      ]);

      toast({
        status: "default",
        description: t("seriesAddModal.toasts.success"),
        icon: "check",
        buttonIcon: "x-close",
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("seriesAddModal.errors.create"));
    },
  });
};
