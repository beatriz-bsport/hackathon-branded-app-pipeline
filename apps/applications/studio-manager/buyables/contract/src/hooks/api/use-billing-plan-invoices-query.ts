import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchPlannedInvoicesParams,
  fetchPlannedInvoicesQueryOptions,
} from "@bsport/api-buyables/billing-plan-planned-invoice";

import { fetch } from "#src/utils/fetch";

import { getMockBillingPlanInvoicesPage } from "./billing-plan-invoices-mock";

export const useBillingPlanInvoicesPaginatedSuspenseQuery = (
  params: FetchPlannedInvoicesParams,
) =>
  useSuspenseQuery({
    ...fetchPlannedInvoicesQueryOptions(fetch, params),
    // TODO: remove mock once GET /subscription/planned-invoice/?billing_plan= is wired.
    queryFn: () => Promise.resolve(getMockBillingPlanInvoicesPage(params)),
    staleTime: 5 * 60_000,
  });
