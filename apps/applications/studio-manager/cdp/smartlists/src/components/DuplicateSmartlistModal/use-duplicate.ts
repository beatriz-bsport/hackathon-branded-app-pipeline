import { toast } from "@bsport/kaizen-primitive-core";

import { useDuplicateSmartlist } from "#src/api/use-duplicate-smartlist";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useDuplicate = ({
  onSuccess,
  onFailure,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
}) => {
  const { t } = useTranslation("list");

  const { duplicateSmartlist: duplicateTrigger, isLoading: isDuplicating } =
    useDuplicateSmartlist({
      onSuccess: (smartlist) => {
        onSuccess?.();

        toast({
          status: "default",
          icon: "copy-03",
          title: t("toasts.success.duplicated"),
          buttonLabel: t("toasts.success.open"),
          onButtonClick: () => {
            /**
             * We don't have the detail view in the studio manager
             * so we navigate to the legacy app
             */
            window.location.assign(LEGACY_URLS.SMARTLIST_MEMBER(smartlist.id));
          },
        });
      },
      onFailure: () => {
        onFailure?.();

        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("toasts.error.duplicateFailed"),
        });
      },
    });

  const duplicateSmartlist = (
    params: Parameters<typeof duplicateTrigger>[0],
  ) => {
    /**
     * Why?
     * We don't have a way to add loading to the modal cta or avoid multiple clicks
     * so we prevent multiple calls here
     */
    if (!isDuplicating) {
      duplicateTrigger(params);
    }
  };

  return {
    duplicateSmartlist,
    isDuplicating,
  } as const;
};
