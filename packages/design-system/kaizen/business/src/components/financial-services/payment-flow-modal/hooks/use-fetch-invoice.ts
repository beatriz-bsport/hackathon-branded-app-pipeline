import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  fetchInvoiceAPI,
  invoiceKeys,
} from "@bsport/api-financial-services/invoice";
import type { Fetch } from "@bsport/fetch";

const INVOICE_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchInvoiceQueryOptions = (fetch: Fetch, invoiceId: string) => {
  const fetchInvoice = fetchInvoiceAPI.bind(null, fetch);

  return queryOptions({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => fetchInvoice(invoiceId),
    staleTime: INVOICE_STALE_TIME,
    enabled: invoiceId.length > 0,
  });
};

export const useFetchInvoice = (fetch: Fetch, invoiceId: string) =>
  useQuery({
    ...fetchInvoiceQueryOptions(fetch, invoiceId),
  });
