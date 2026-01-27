import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CancelMultipleSessionsParams,
  cancelMultipleSessionsAPI,
} from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import {
  type DateTime,
  getIsoDate,
  isSameDay,
} from "@bsport/datetime-manipulation";
import { toast } from "@bsport/kaizen-primitive-core";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";

const cancelMultipleSessions = cancelMultipleSessionsAPI.bind(null, fetch);
interface CancelMultipleSessionsVariables {
  startDate: DateTime;
  endDate: DateTime;
  params: Omit<CancelMultipleSessionsParams, "start" | "end">;
  locale?: string;
}

export const useCancelMultipleSessions = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  const { handleBackgroundTaskError, waitForBackgroundTask } =
    useWaitForBackgroundTask(fetch);

  return useMutation<string | null, Error, CancelMultipleSessionsVariables>({
    mutationFn: async ({
      startDate,
      endDate,
      params,
    }: CancelMultipleSessionsVariables) => {
      const formattedStartDate = getIsoDate(startDate);
      const formattedEndDate = getIsoDate(endDate);
      const formattedParams = {
        ...params,
        start: formattedStartDate,
        end: formattedEndDate,
      };
      const backgroundTaskUuid = await cancelMultipleSessions(formattedParams);

      if (backgroundTaskUuid) {
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      toast({
        status: "default",
        // @ts-expect-error t function infers too narrow types
        description: t("cancelMultipleSessionsModal.successMessage", {
          startDate: formatDateTimeFromDate(
            variables.startDate,
            DATETIME_FORMATS.FULL_DATE,
            { locale: variables.locale },
          ),
          endDate: formatDateTimeFromDate(
            variables.endDate,
            DATETIME_FORMATS.FULL_DATE,
            { locale: variables.locale },
          ),
          count: isSameDay(variables.startDate, variables.endDate) ? 1 : 2,
        }),
      });
    },
    onError: (error: Error) => {
      handleBackgroundTaskError(
        error,
        t("cancelMultipleSessionsModal.errorMessage"),
      );
    },
  });
};
