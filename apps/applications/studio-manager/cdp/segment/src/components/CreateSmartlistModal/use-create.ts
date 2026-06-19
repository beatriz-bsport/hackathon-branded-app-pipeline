import { toast } from "@bsport/kaizen-primitive-core";
import type { CreateSmartlistParams } from "@bsport/store-cdp-smartlist";

import { useCreateSmartlist } from "#src/api/use-create-smartlist";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { SMARTLIST_LEGACY_URLS } from "#src/urls";
import { flags, useFlag } from "#src/utils/feature-flags";
import { useTranslation } from "#src/utils/i18n";

export const useCreate = ({
  onSuccess,
  onFailure,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
}) => {
  const isSmartlistEnabled = useFlag(flags.smartlist);
  const { t } = useTranslation("list");
  const { navigateToSmartlistParameters } = useSmartlistNavigation();

  const { createSmartlist: createTrigger, isLoading: isCreating } =
    useCreateSmartlist({
      onSuccess: (smartlist) => {
        onSuccess?.();

        if (isSmartlistEnabled) {
          navigateToSmartlistParameters(String(smartlist.id));
        } else {
          window.location.assign(
            SMARTLIST_LEGACY_URLS.smartlistMember(smartlist.id),
          );
        }
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
