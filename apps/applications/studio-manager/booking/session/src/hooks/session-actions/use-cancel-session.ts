import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CancelSessionParams, cancelSessionAPI } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import {
  BACKGROUND_TASK_ERRORS,
  useWaitForBackgroundTask,
} from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

import { SESSIONS_QUERY_KEY } from "../constants";

const cancelSession = cancelSessionAPI.bind(null, fetch);

interface CancelSessionVariables {
  id: number;
  params: CancelSessionParams;
}

const getCountForTranslation = (params: CancelSessionParams): number => {
  if (params.apply_to_all_similar_offers) {
    return 2;
  }
  if (params.selected_similar_offer_ids) {
    return params.selected_similar_offer_ids.length;
  }
  return 1; // Only the single session
};

export const useCancelSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");
  const waitForBackgroundTask = useWaitForBackgroundTask(fetch);

  return useMutation<string | null, Error, CancelSessionVariables>({
    mutationFn: async ({ id, params }: CancelSessionVariables) => {
      const backgroundTaskUuid = await cancelSession(id, params);

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
        description: t("cancelModal.successMessage", {
          count: getCountForTranslation(variables.params),
        }),
      });
    },
    onError: (error: Error) => {
      if (error.message === BACKGROUND_TASK_ERRORS.TASK_FAILURE) {
        toast({
          status: "critical",
          description: t("cancelModal.errorMessage"),
        });
        return;
      }
      if (error.message === BACKGROUND_TASK_ERRORS.ENDPOINT_FAILURE) {
        toast({
          status: "critical",
          description: t("backgroundTask.genericError"),
        });
        return;
      }
      if (error.message === BACKGROUND_TASK_ERRORS.TIMEOUT) {
        toast({
          status: "critical",
          description: t("backgroundTask.timeoutError"),
        });
        return;
      }
    },
  });
};
