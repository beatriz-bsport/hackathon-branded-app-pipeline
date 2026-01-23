import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type SessionCreationPayload,
  createSessionAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

type CreateSessionOptions = {
  payload: SessionCreationPayload;
  onEarlySuccess?: () => void;
};

const createSession = createSessionAPI.bind(null, fetch);

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionCreation");

  const { waitForBackgroundTask, handleBackgroundTaskError } =
    useWaitForBackgroundTask(fetch);

  return useMutation<string | null, Error, CreateSessionOptions>({
    mutationFn: async ({ payload, onEarlySuccess }) => {
      const backgroundTaskUuid = await createSession(payload);

      onEarlySuccess?.();

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      toast({
        status: "default",
        description: t("addSessionModal.toasts.sessionCreated_one", {
          ns: "sessionCreation",
          count: variables.payload.dates.length,
        }),
        buttonLabel: t("addSessionModal.buttons.open", {
          ns: "sessionCreation",
        }),
        onButtonClick: () => {
          // TODO: Open the created session details page
          // Intentionally left blank for now
        },
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("addSessionModal.errors.create"));
    },
  });
};
