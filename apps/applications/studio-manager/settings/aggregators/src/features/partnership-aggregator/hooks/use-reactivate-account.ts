import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  activatePartnershipAccountAPI,
  partnershipKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { type TFunction, useTranslation } from "#src/utils/i18n";

import type { MutableNamespace } from "../types";

const activateAccount = activatePartnershipAccountAPI.bind(null, fetch);

const TOAST_KEYS = {
  myclubs: {
    success: "myclubs.toast.reactivate.success",
    error: "myclubs.toast.reactivate.error",
  },
  wellhub: {
    success: "wellhub.toast.reactivate.success",
    error: "wellhub.toast.reactivate.error",
  },
} as const satisfies Record<
  MutableNamespace,
  Record<string, Parameters<TFunction>[0]>
>;

type Variables = { accountId: string };

export const useReactivateAccount = (
  partnershipId: number,
  namespace: MutableNamespace,
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  const keys = TOAST_KEYS[namespace];

  return useMutation<PartnershipAccount, Error, Variables>({
    mutationFn: ({ accountId }) => activateAccount({ id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        icon: "refresh-cw-01",
        description: t(keys.success),
      });
    },
    onError: () => {
      toast({ status: "critical", description: t(keys.error) });
    },
  });
};
