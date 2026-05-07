import { useMutation } from "@tanstack/react-query";

import { updateCompanyThemeMutationOptions } from "@bsport/api-core";
import { toast } from "@bsport/kaizen-primitive-core";
import { setCompanyTheme } from "@bsport/store-core-data-company-theme";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useUpdateCompanyTheme = () => {
  const { t } = useTranslation("common");

  return useMutation({
    ...updateCompanyThemeMutationOptions(fetch),
    onSuccess: (theme) => {
      setCompanyTheme(theme);
      toast({
        status: "positive",
        title: t("teacherViewSettings.toasts.success"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("teacherViewSettings.toasts.error"),
        buttonIcon: "x-close",
      });
    },
  });
};
