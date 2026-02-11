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
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      toast({
        status: "default",
        description: t("editSessionForm.toasts.sessionEdited"),
        buttonLabel: t("editSessionForm.buttons.open"),
        onButtonClick: () => {
          // TODO: Open the created session details page
          // Intentionally left blank for now
        },
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("editSessionForm.errors.edit"));
    },
  });
};

export default useEditSession;
