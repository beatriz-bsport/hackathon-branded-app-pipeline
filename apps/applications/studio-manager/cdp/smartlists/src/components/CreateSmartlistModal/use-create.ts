import { toast } from "@bsport/kaizen-primitive-core";
import type { CreateSmartlistParams } from "@bsport/store-cdp-smartlist";

import { useCreateSmartlist } from "#src/api/use-create-smartlist";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useCreate = ({
  onSuccess,
  onFailure,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
}) => {
  const { t } = useTranslation("list");

  const { createSmartlist: createTrigger, isLoading: isCreating } =
    useCreateSmartlist({
      onSuccess: (smartlist) => {
        onSuccess?.();

        /**
         * After creating a smartlist we navigate to the legacy app
         * to show the smartlist details
         */
        window.location.assign(LEGACY_URLS.SMARTLIST_MEMBER(smartlist.id));
      },
      onFailure: () => {
        onFailure?.();

        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("toasts.error.createFailed"),
          buttonIcon: "x-close",
        });
      },
    });

  const createSmartlist = async (params: CreateSmartlistParams) => {
    if (!isCreating) {
      await createTrigger(params);
    }
  };

  return {
    createSmartlist,
    isCreating,
  } as const;
};
