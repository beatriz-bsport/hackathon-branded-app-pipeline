import { useCallback } from "react";

import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const useGenericToasts = () => {
  const { t } = useTranslation("insights");

  const handleActionFailed = useCallback(
    (errorKey: "errors.loadDashboard" | "errors.fetchFailed") => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t(errorKey),
        buttonIcon: "x-close",
      });
    },
    [t],
  );

  return {
    handleActionFailed,
  };
};
