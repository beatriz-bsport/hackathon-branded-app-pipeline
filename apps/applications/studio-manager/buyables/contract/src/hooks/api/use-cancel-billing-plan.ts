import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  BILLING_PLAN_STATUSES,
  type BillingPlan,
  queryKeys as billingPlanQueryKeys,
} from "@bsport/api-buyables/billing-plan";
import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { mockCancelBillingPlan } from "./billing-plan-cancel-mock";
import type { CancelBillingPlanParams } from "./billing-plan-cancel-types";

type UseCancelBillingPlanParams = {
  onSuccess?: () => void;
};

export const useCancelBillingPlan = ({
  onSuccess,
}: UseCancelBillingPlanParams = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("membership-plan");

  const { mutate: cancelBillingPlan, isPending } = useMutation({
    // TODO: replace mock with cancelBillingPlanMutationOptions(fetch) from
    // @bsport/api-buyables/billing-plan-cancel once that API module is introduced.
    mutationFn: mockCancelBillingPlan,
    onSuccess: (_data, params) => {
      const canceledAt = new Date().toISOString();

      queryClient.setQueryData<BillingPlan>(
        billingPlanQueryKeys.detail(params.billing_plan_id),
        (membershipPlan) => {
          if (!membershipPlan) {
            return membershipPlan;
          }

          return {
            ...membershipPlan,
            canceled_at: canceledAt,
            status: BILLING_PLAN_STATUSES.STOPPED,
            stop_note: params.reason,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: billingPlanQueryKeys.lists(),
      });

      toast({
        status: "default",
        icon: "x-circle",
        title: t("cancelModal.toasts.success"),
        buttonIcon: "x-close",
      });

      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("cancelModal.toasts.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return {
    cancelBillingPlan: (params: CancelBillingPlanParams) =>
      cancelBillingPlan(params),
    isCancelling: isPending,
  };
};
