import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchInvoiceConfigurationAPI } from "@bsport/api-financial-services";

import fetch from "#src/utils/fetch";

import { INVOICE_CONFIGURATION_QUERY_KEY } from "./constants";

const INVOICE_CONFIGURATION_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchInvoiceConfiguration = fetchInvoiceConfigurationAPI.bind(
  null,
  fetch,
);

export const invoiceConfigurationQueryOptions = () => {
  return queryOptions({
    queryKey: [INVOICE_CONFIGURATION_QUERY_KEY],
    queryFn: () => fetchInvoiceConfiguration(),
    staleTime: INVOICE_CONFIGURATION_STALE_TIME,
  });
};

export const useInvoiceConfiguration = () => {
  const result = useQuery({
    ...invoiceConfigurationQueryOptions(),
  });
  return {
    ...result,
    isDiscountReasonRequired:
      result.data?.is_custom_discount_reason_required ?? false,
  };
};
