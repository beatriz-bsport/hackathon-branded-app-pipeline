import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const useAddProcessingToast = (): (() => string) => {
  const { t } = useTranslation("common");
  return () =>
    toast({
      status: "default",
      title: t("backgroundTask.processing"),
      duration: 0,
      icon: "loading",
      buttonIcon: "x-close",
    });
};
