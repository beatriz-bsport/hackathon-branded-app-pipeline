import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@bsport/api-buyables/billing-plan-planned-invoice";

import { getMockUpcomingBillingPlanInvoices } from "./billing-plan-invoices-mock";

export const useBillingPlanUpcomingInvoicesQuery = (
  billingPlanId: number,
  enabled: boolean,
) =>
  useQuery({
    // TODO: replace mock queryFn with fetchPlannedInvoicesQueryOptions once the
    // real upcoming-invoice endpoint is wired.
    queryKey: queryKeys.upcomingList(billingPlanId),
    queryFn: () =>
      Promise.resolve(getMockUpcomingBillingPlanInvoices(billingPlanId)),
    enabled,
    staleTime: 5 * 60_000,
  });
