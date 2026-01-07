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
import { fetchBackgroundTaskAction } from "@bsport/store-shared-background-task";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { SESSIONS_QUERY_KEY } from "../constants";

const cancelMultipleSessions = cancelMultipleSessionsAPI.bind(null, fetch);
const fetchBackgroundTask = fetchBackgroundTaskAction.bind(null, fetch);

interface CancelMultipleSessionsVariables {
  startDate: DateTime;
  endDate: DateTime;
  params: Omit<CancelMultipleSessionsParams, "start" | "end">;
  locale?: string;
}

export const useCancelMultipleSessions = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

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
        return new Promise((resolve, reject) => {
          fetchBackgroundTask({
            uuid: backgroundTaskUuid,
            callbacks: {
              onSuccess: () => resolve(backgroundTaskUuid),
              onTaskFailure: () =>
                reject(new Error("Background task failed to complete")),
              onEndpointFailure: () =>
                reject(new Error("Failed to reach background task endpoint")),
              onTimeout: () => reject(new Error("Background task timed out")),
            },
          });
        });
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
    onError: () => {
      toast({
        status: "critical",
        description: t("cancelMultipleSessionsModal.errorMessage"),
      });
    },
  });
};
