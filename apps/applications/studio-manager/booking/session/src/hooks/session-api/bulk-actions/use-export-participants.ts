import { useMutation } from "@tanstack/react-query";

import {
  FetchReportParticipantsListParams,
  fetchReportParticipantsListAPI,
} from "@bsport/api-business-insights";
import { type DateTime, getIsoDate } from "@bsport/datetime-manipulation";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const fetchReportParticipantsList = fetchReportParticipantsListAPI.bind(
  null,
  fetch,
);

export const useExportParticipantsList = () => {
  const { t } = useTranslation("sessionList");
  return useMutation({
    mutationFn: (params: {
      date: DateTime;
      filters: Omit<FetchReportParticipantsListParams, "date">;
    }) => {
      const formattedDate = getIsoDate(params.date);
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
      toast({
        status: "default",
        title: t("exportParticipantsModal.successMessage"),
        icon: "check",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        title: t("exportParticipantsModal.errorMessage"),
      });
    },
  });
};
