import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CancelMultipleSessionsParams,
  cancelMultipleSessionsAPI,
} from "@bsport/api-book";
import { type DateTime, getIsoDate } from "@bsport/datetime-manipulation";

import { fetch } from "#src/utils/fetch";

import { SESSIONS_QUERY_KEY } from "../constants";

const cancelMultipleSessions = cancelMultipleSessionsAPI.bind(null, fetch);

interface CancelMultipleSessionsVariables {
  startDate: DateTime;
  endDate: DateTime;
  params: Omit<CancelMultipleSessionsParams, "start" | "end">;
}

export const useCancelMultipleSessions = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CancelMultipleSessionsVariables>({
    mutationFn: ({
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
      return cancelMultipleSessions(formattedParams);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
};
