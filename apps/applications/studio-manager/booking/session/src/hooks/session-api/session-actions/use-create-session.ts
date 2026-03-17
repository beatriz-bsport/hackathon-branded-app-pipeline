import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Session,
  type SessionCreationPayload,
  createSessionAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";
import { BackgroundTask } from "@bsport/store-shared-background-task";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { useUrls } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

type CreateSessionOptions = {
  payload: SessionCreationPayload;
  onEarlySuccess?: () => void;
};

const createSession = createSessionAPI.bind(null, fetch);

const isSessionCreationResult = (
  result: unknown,
): result is BackgroundTask<Session> => {
  return typeof result === "object" && result !== null && "id" in result;
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionCreation");
  const { navigateToBookingsManagement } = useUrls();
  const { waitForBackgroundTask, handleBackgroundTaskError } =
    useWaitForBackgroundTask(fetch);

  return useMutation<
    BackgroundTask<Session> | null,
    Error,
    CreateSessionOptions
  >({
    mutationFn: async ({ payload, onEarlySuccess }) => {
      const backgroundTaskUuid = await createSession(payload);

      onEarlySuccess?.();

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      const buttonConfiguration = isSessionCreationResult(result)
        ? {
            buttonLabel: t("addSessionModal.buttons.open", {
              ns: "sessionCreation",
            }),
            onButtonClick: () => {
              navigateToBookingsManagement(result.return_value.id);
            },
          }
        : {};

      toast({
        status: "default",
        description: t("addSessionModal.toasts.sessionCreated_one", {
          ns: "sessionCreation",
          count: variables.payload.dates.length,
        }),
        icon: "check",
        ...buttonConfiguration,
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("addSessionModal.errors.create"));
    },
  });
};
