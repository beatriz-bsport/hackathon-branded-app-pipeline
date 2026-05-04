import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { SMARTFILL_CONFIG_STATUS_QUERY_KEY } from "./use-smartfill-config-status";

type SmartfillConfigAction = "activate" | "deactivate";

const endpoints: Record<SmartfillConfigAction, string> = {
  activate: "book/v1/smartfill/config/activate/",
  deactivate: "book/v1/smartfill/config/deactivate/",
};

export const useSmartfillConfigToggle = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("smartfill");

  return useMutation({
    mutationFn: async (action: SmartfillConfigAction) => {
      await fetch(endpoints[action], {
        method: "POST",
      });
      return action;
    },
    onSuccess: async (action) => {
      await queryClient.invalidateQueries({
        queryKey: SMARTFILL_CONFIG_STATUS_QUERY_KEY,
      });
      toast({
        status: action === "activate" ? "positive" : "default",
        icon: "check-circle",
        title:
          action === "activate" ? t("toast.activated") : t("toast.deactivated"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("error.title"),
        description: t("error.description"),
        buttonIcon: "x-close",
      });
    },
  });
};
