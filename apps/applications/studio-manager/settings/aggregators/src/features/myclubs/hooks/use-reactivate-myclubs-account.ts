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

export const useReactivateMyclubsAccount = (partnershipId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation<PartnershipAccount, Error, Variables>({
    mutationFn: ({ accountId }) => activateAccount({ id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        description: t("myclubs.toast.reactivate.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("myclubs.toast.reactivate.error"),
      });
    },
  });
};
