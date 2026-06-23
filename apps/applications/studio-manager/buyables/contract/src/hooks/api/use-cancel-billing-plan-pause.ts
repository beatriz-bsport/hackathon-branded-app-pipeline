import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type BillingPlan,
  queryKeys as billingPlanQueryKeys,
} from "@bsport/api-buyables/billing-plan";
import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { mockCancelBillingPlanPause } from "./billing-plan-pause-mock";
import type { CancelBillingPlanPauseParams } from "./billing-plan-pause-types";

type UseCancelBillingPlanPauseParams = {
  onSuccess?: () => void;
};

export const useCancelBillingPlanPause = ({
  onSuccess,
}: UseCancelBillingPlanPauseParams = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("membership-plan");

  const { mutate: cancelBillingPlanPause, isPending } = useMutation({
    // TODO: replace mock with cancelBillingPlanPauseMutationOptions(fetch) from
    // @bsport/api-buyables/billing-plan-pause once that API module is re-introduced.
    mutationFn: mockCancelBillingPlanPause,
    onSuccess: (_data, params) => {
      queryClient.setQueryData<BillingPlan>(
        billingPlanQueryKeys.detail(params.billing_plan_id),
        (membershipPlan) => {
          if (!membershipPlan) {
            return membershipPlan;
          }

          return {
            ...membershipPlan,
            pauses: membershipPlan.pauses.filter(
              ({ id }) => id !== params.pause_id,
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: billingPlanQueryKeys.lists(),
      });

      toast({
        status: "default",
        icon: "pause-square",
        title: t("pauseModal.toasts.cancelSuccess"),
        buttonIcon: "x-close",
      });

      onSuccess?.();
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("pauseModal.toasts.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return {
    cancelBillingPlanPause: (params: CancelBillingPlanPauseParams) =>
      cancelBillingPlanPause(params),
    isCancelling: isPending,
  };
};
