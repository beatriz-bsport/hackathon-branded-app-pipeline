import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CancelSessionParams, cancelSessionAPI } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import {
  BACKGROUND_TASK_ERRORS,
  waitForBackgroundTask,
} from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

import { SESSIONS_QUERY_KEY } from "../constants";

const cancelSession = cancelSessionAPI.bind(null, fetch);

interface CancelSessionVariables {
  id: number;
  params: CancelSessionParams;
}

export const useCancelSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation<string | null, Error, CancelSessionVariables>({
    mutationFn: async ({ id, params }: CancelSessionVariables) => {
      const backgroundTaskUuid = await cancelSession(id, params);

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid, fetch);
      }

      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      toast({
        status: "default",
        description: t("cancelModal.successMessage"),
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
