import { useCallback } from "react";

import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const useGenericToasts = () => {
  const { t } = useTranslation("common");

  const handleActionFailed = useCallback((errorMessage: string) => {
    toast({
      status: "critical",
      icon: "alert-circle",
      title: errorMessage,
      buttonIcon: "x-close",
    });
  }, []);

  const handleActionUndone = useCallback(() => {
    toast({
      status: "default",
      icon: "reverse-left",
      title: t("toasts.messageUndone.success"),
      buttonIcon: "x-close",
    });
  }, [t]);

  return {
    handleActionFailed,
    handleActionUndone,
  };
};
