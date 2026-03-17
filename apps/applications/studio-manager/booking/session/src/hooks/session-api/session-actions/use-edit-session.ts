import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type SessionEditPayload, editSessionAPI } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

type EditSessionOptions = {
  sessionId: number;
  payload: SessionEditPayload;
  onEarlySuccess?: () => void;
};

const editSession = editSessionAPI.bind(null, fetch);

const useEditSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionEdit");

  const { waitForBackgroundTask, handleBackgroundTaskError } =
    useWaitForBackgroundTask(fetch);

  return useMutation<string | null, Error, EditSessionOptions>({
    mutationFn: async ({ sessionId, payload, onEarlySuccess }) => {
      const backgroundTaskUuid = await editSession(sessionId, payload);

      onEarlySuccess?.();

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: async (_, { sessionId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [SESSIONS_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [`${SESSIONS_QUERY_KEY}_similar`, sessionId],
        }),
        queryClient.invalidateQueries({
          queryKey: [`${SESSIONS_QUERY_KEY}_in_group`],
        }),
      ]);
      toast({
        status: "default",
        description: t("editSessionForm.toasts.sessionEdited"),
        icon: "check",
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("editSessionForm.errors.edit"));
    },
  });
};

export default useEditSession;
