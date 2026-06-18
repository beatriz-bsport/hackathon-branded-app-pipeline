import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type BillingPlan,
  queryKeys as billingPlanQueryKeys,
} from "@bsport/api-buyables/billing-plan";
import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { mockPauseBillingPlan } from "./billing-plan-pause-mock";
import type { PauseBillingPlanParams } from "./billing-plan-pause-types";

type UsePauseBillingPlanParams = {
  onSuccess?: () => void;
};

export const usePauseBillingPlan = ({
  onSuccess,
}: UsePauseBillingPlanParams = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("membership-plan");

  const { mutate: pauseBillingPlan, isPending } = useMutation({
    // TODO: replace mock with pauseBillingPlanMutationOptions(fetch) from
    // @bsport/api-buyables/billing-plan-pause once that API module is re-introduced.
    mutationFn: mockPauseBillingPlan,
    onSuccess: (pause, params) => {
      queryClient.setQueryData<BillingPlan>(
        billingPlanQueryKeys.detail(params.billing_plan_id),
        (membershipPlan) => {
          if (!membershipPlan) {
            return membershipPlan;
          }

          const pauses = membershipPlan.pauses.some(({ id }) => id === pause.id)
            ? membershipPlan.pauses.map((item) =>
                item.id === pause.id ? pause : item,
              )
            : [...membershipPlan.pauses, pause];

          return {
            ...membershipPlan,
            pauses,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: billingPlanQueryKeys.lists(),
      });

      toast({
        status: "default",
        icon: "pause-square",
        title: t(
          params.pause_id
            ? "pauseModal.toasts.updateSuccess"
            : "pauseModal.toasts.createSuccess",
        ),
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
    isPausing: isPending,
    pauseBillingPlan: (params: PauseBillingPlanParams) =>
      pauseBillingPlan(params),
  };
};
