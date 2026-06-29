import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  queryKeys as billingPlanQueryKeys,
  setBillingPlanPaymentMethodMutationOptions,
} from "@bsport/api-buyables/billing-plan";
import { paymentMethodKeys } from "@bsport/api-financial-services";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type UseSetBillingPlanPaymentMethodParams = {
  member: number;
};

export const useSetBillingPlanPaymentMethod = ({
  member,
}: UseSetBillingPlanPaymentMethodParams) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("membership-plan");

  const { mutateAsync, isPending } = useMutation({
    ...setBillingPlanPaymentMethodMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billingPlanQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: paymentMethodKeys.saved(member),
      });

      toast({
        status: "default",
        icon: "credit-card-02",
        title: t("panel.paymentMethod.toasts.success"),
        buttonIcon: "x-close",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("panel.paymentMethod.toasts.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return {
    isSettingBillingPlanPaymentMethod: isPending,
    // Errors are surfaced inline by the editor, so the promise is allowed to
    // reject; consumers should await and handle rejection.
    setBillingPlanPaymentMethod: mutateAsync,
  };
};
