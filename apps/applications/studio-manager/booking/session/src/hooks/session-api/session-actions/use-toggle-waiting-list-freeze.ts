import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Session,
  sessionKeys,
  toggleWaitingListFreezeAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const toggleWaitingListFreeze = toggleWaitingListFreezeAPI.bind(null, fetch);

interface ToggleWaitingListFreezeVariables {
  sessionId: number;
  freeze: boolean;
}

export const useToggleWaitingListFreeze = () => {
  const { t } = useTranslation("sessionManagement");

  const queryClient = useQueryClient();

  return useMutation<Session, Error, ToggleWaitingListFreezeVariables>({
    mutationFn: ({ sessionId, freeze }) =>
      toggleWaitingListFreeze(sessionId, freeze),
    onSuccess: ({ id: sessionId }, { freeze }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
      toast({
        status: "default",
        icon: freeze ? "pause-square" : "play",
        description: freeze
          ? t("modals.pauseWaitlist.confirmation")
          : t("modals.reactivateWaitlist.confirmation"),
        duration: 2000,
      });
    },
  });
};
