import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  partnershipKeys,
  updatePartnershipAccountAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { type TFunction, useTranslation } from "#src/utils/i18n";

import type { MutableNamespace } from "../types";

const updateAccount = updatePartnershipAccountAPI.bind(null, fetch);

const TOAST_KEYS = {
  myclubs: {
    success: "myclubs.toast.update.success",
    error: "myclubs.toast.update.error",
  },
  wellhub: {
    success: "wellhub.toast.update.success",
    error: "wellhub.toast.update.error",
  },
  wellpass: {
    success: "wellpass.toast.update.success",
    error: "wellpass.toast.update.error",
  },
} as const satisfies Record<
  MutableNamespace,
  Record<string, Parameters<TFunction>[0]>
>;

type Variables = { accountId: string; establishmentIds: number[] };

export const useUpdateAccount = (
  partnershipId: number,
  namespace: MutableNamespace,
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  const keys = TOAST_KEYS[namespace];

  return useMutation<PartnershipAccount, Error, Variables>({
    mutationFn: ({ accountId, establishmentIds }) =>
      updateAccount({
        id: accountId,
        partnership: partnershipId,
        establishment_group: establishmentIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        icon: "check",
        description: t(keys.success),
      });
    },
    onError: () => {
      toast({ status: "critical", description: t(keys.error) });
    },
  });
};
