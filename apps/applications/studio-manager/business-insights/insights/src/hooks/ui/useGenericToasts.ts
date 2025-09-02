import { useCallback, useRef } from "react";

import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const useGenericToasts = () => {
  const { t } = useTranslation("insights");
  const tRef = useRef(t);

  // Update ref when translation function changes
  tRef.current = t;

  const handleActionFailed = useCallback(
    (errorKey: "errors.loadDashboard" | "errors.fetchFailed") => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: tRef.current(errorKey),
        buttonIcon: "x-close",
      });
    },
    [], // No dependencies - stable function
  );

  return {
    handleActionFailed,
  };
};
