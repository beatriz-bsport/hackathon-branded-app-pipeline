import { useMutation } from "@tanstack/react-query";

import {
  FetchReportParticipantsListParams,
  fetchReportParticipantsListAPI,
} from "@bsport/api-business-insights";
import { getIsoDateString } from "@bsport/datetime-manipulation";

import { fetch } from "#src/utils/fetch";

const fetchReportParticipantsList = fetchReportParticipantsListAPI.bind(
  null,
  fetch,
);

export const useExportParticipantsList = () => {
  return useMutation({
    mutationFn: (params: {
      date: Date;
      filters: Omit<FetchReportParticipantsListParams, "date">;
    }) => {
      const formattedDate = getIsoDateString(params.date);
      const formattedParams = { ...params.filters, date: formattedDate };
      return fetchReportParticipantsList(formattedParams);
    },
    onSuccess: (url: string) => {
      // simulating a link and a click to trigger the file download
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      link.click();

      // Clear url content to avoid memory leakage
      setTimeout(() => {
        (window.URL || window.webkitURL).revokeObjectURL(url);
      }, 0);
    },
  });
};
