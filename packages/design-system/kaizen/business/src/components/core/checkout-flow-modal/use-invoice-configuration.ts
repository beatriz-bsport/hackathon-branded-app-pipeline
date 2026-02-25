import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchInvoiceConfigurationAPI } from "@bsport/api-financial-services";
import type { Fetch } from "@bsport/fetch";

import { INVOICE_CONFIGURATION_QUERY_KEY } from "./constants";

const INVOICE_CONFIGURATION_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const invoiceConfigurationQueryOptions = (fetch: Fetch) => {
  const fetchInvoiceConfiguration = fetchInvoiceConfigurationAPI.bind(
    null,
    fetch,
  );
  return queryOptions({
    queryKey: [INVOICE_CONFIGURATION_QUERY_KEY],
    queryFn: () => fetchInvoiceConfiguration(),
    staleTime: INVOICE_CONFIGURATION_STALE_TIME,
  });
};

export const useInvoiceConfiguration = (fetch: Fetch) => {
  const result = useQuery({
    ...invoiceConfigurationQueryOptions(fetch),
  });
  return {
    ...result,
    isDiscountReasonRequired:
      result.data?.is_custom_discount_reason_required ?? false,
  };
};
