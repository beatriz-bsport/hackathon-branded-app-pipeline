import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteSessionParams, deleteSessionAPI } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";
import {
  useHandleBackgroundTaskError,
  useWaitForBackgroundTask,
} from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

const deleteSession = deleteSessionAPI.bind(null, fetch);

interface DeleteSessionVariables {
  id: number;
  params: DeleteSessionParams;
}

const getCountForTranslation = (params: DeleteSessionParams): number => {
  if (params.apply_to_all_similar_offers) {
    return 2;
  }
  if (params.selected_similar_offer_ids) {
    return params.selected_similar_offer_ids.length;
  }
  return 1; // Only the single session
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");
  const waitForBackgroundTask = useWaitForBackgroundTask(fetch);
  const handleBackgroundTaskError = useHandleBackgroundTaskError();

  return useMutation<string | null, Error, DeleteSessionVariables>({
    mutationFn: async ({ id, params }: DeleteSessionVariables) => {
      const backgroundTaskUuid = await deleteSession(id, params);

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      toast({
        status: "default",
        //@ts-expect-error Translations with variables are not yet typed
        description: t("deleteModal.successMessage", {
          count: getCountForTranslation(variables.params),
        }),
      });
    },
    onError: (error: Error) => {
      handleBackgroundTaskError(error, t("deleteModal.errorMessage"));
    },
  });
};
