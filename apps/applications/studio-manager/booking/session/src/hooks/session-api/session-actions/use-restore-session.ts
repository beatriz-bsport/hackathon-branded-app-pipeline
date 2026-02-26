import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restoreSessionAPI } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const restoreSession = restoreSessionAPI.bind(null, fetch);

export const useRestoreSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation({
    mutationFn: async (id: number) => {
      await restoreSession(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      toast({
        status: "default",
        description: t("restoreModal.successMessage"),
        icon: "flip-forward",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("restoreModal.errorMessage"),
      });
    },
  });
};
