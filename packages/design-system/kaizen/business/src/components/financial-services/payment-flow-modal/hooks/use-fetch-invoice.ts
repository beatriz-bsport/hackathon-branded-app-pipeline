import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchInvoiceAPI } from "@bsport/api-financial-services/invoice";
import type { Fetch } from "@bsport/fetch";

const INVOICE_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchInvoiceQueryOptions = (fetch: Fetch, invoiceId: string) => {
  const fetchInvoice = fetchInvoiceAPI.bind(null, fetch);
  const normalizedInvoiceId = invoiceId.trim();

  return queryOptions({
    queryKey: ["payment-flow-modal", "invoice", normalizedInvoiceId],
    queryFn: () => fetchInvoice(normalizedInvoiceId),
    staleTime: INVOICE_STALE_TIME,
    enabled: normalizedInvoiceId.length > 0,
  });
};

export const useFetchInvoice = (fetch: Fetch, invoiceId: string) =>
  useQuery({
    ...fetchInvoiceQueryOptions(fetch, invoiceId),
  });
