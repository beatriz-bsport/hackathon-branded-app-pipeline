import { useMutation, useQuery } from "@tanstack/react-query";

import {
  type PlatformInvoice,
  type SavedPaymentMethod,
  fetchCompanyPaymentMethodsQueryOptions,
  fetchPlatformInvoiceListQueryOptions,
  payPlatformInvoiceMutationOptions,
} from "@bsport/api-financial-services";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";
import { ACTIONABLE_STATUSES } from "#src/utils/platform-invoice-status";

type UseBillingDataResult = {
  paymentMethods: SavedPaymentMethod[];
  invoices: PlatformInvoice[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  hasLatestInvoiceFailed: boolean;
  payInvoice: (paymentBackendId: string) => void;
  isPayingInvoice: boolean;
};

/**
 * Fetches platform invoices and saved payment methods for the company in parallel.
 *
 * @returns
 * - `invoices` — sorted descending by year then month (most recent first)
 * - `hasLatestInvoiceFailed` — true when the first invoice matches an ACTIONABLE_STATUS (e.g. failed payment requiring user action)
 * - `payInvoice` — calls the pay mutation and automatically refetches invoices on success
 * - `refetch` — triggers a fresh fetch of both queries
 */
export const useBillingData = (): UseBillingDataResult => {
  const { t } = useTranslation("subscription");
  const invoicesQuery = useQuery(fetchPlatformInvoiceListQueryOptions(fetch));
  const paymentMethodsQuery = useQuery(
    fetchCompanyPaymentMethodsQueryOptions(fetch),
  );

  const invoices = [...(invoicesQuery.data ?? [])].sort(
    (a, b) => b.year - a.year || b.month - a.month,
  );
  const paymentMethods = paymentMethodsQuery.data ?? [];

  const latestInvoice = invoices[0];
  const hasLatestInvoiceFailed =
    latestInvoice !== undefined &&
    ACTIONABLE_STATUSES.includes(latestInvoice.status);

  const payInvoiceMutation = useMutation({
    ...payPlatformInvoiceMutationOptions(fetch),
    onSuccess: () => {
      void invoicesQuery.refetch();
    },
    onError: () => {
      toast({
        icon: "alert-circle",
        title: t("billing.invoice-history.pay-now-error"),
        status: "critical",
      });
    },
  });

  return {
    invoices,
    paymentMethods,
    isLoading: invoicesQuery.isLoading || paymentMethodsQuery.isLoading,
    isError: invoicesQuery.isError || paymentMethodsQuery.isError,
    refetch: () => {
      void invoicesQuery.refetch();
      void paymentMethodsQuery.refetch();
    },
    hasLatestInvoiceFailed,
    payInvoice: payInvoiceMutation.mutate,
    isPayingInvoice: payInvoiceMutation.isPending,
  };
};
