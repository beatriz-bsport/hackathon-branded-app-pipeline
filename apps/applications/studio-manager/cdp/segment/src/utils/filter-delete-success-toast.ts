import { toast } from "@bsport/kaizen-primitive-core";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

/**
 * Shows the shared success toast after a smartlist filter is deleted.
 */
export const showFilterDeleteSuccessToast = () => {
  toast({
    status: "default",
    icon: "check",
    title: i18nInstance.t("toasts.deleteSuccess", {
      ns: I18N_SEGMENT_NAMESPACES.FILTERS,
    }),
    buttonIcon: "x-close",
  });
};
