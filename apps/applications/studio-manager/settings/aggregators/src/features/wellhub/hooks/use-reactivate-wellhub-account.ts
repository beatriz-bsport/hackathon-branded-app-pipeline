import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  activatePartnershipAccountAPI,
  partnershipKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const activateAccount = activatePartnershipAccountAPI.bind(null, fetch);

type Variables = {
  accountId: string;
};

export const useReactivateWellhubAccount = (partnershipId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation<PartnershipAccount, Error, Variables>({
    mutationKey: ["reactivate-wellhub-account"],
    mutationFn: ({ accountId }) => activateAccount({ id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        icon: "check-circle",
        description: t("wellhub.toast.reactivate.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("wellhub.toast.reactivate.error"),
      });
    },
  });
};
