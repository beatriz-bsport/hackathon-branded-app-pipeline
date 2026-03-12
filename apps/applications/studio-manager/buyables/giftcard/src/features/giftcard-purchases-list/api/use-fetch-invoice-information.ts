import { fetchInvoiceByInvoiceItemAction } from "@bsport/store-financial-services-invoice";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchInvoiceByInvoiceItemBound = fetchInvoiceByInvoiceItemAction.bind(
  null,
  fetch,
);

export const useFetchInvoiceInformation = () => {
  const [{ isLoading, data }, fetchInvoiceByInvoiceItem] = useAsync<
    typeof fetchInvoiceByInvoiceItemBound
  >({
    asyncFn: fetchInvoiceByInvoiceItemBound,
  });

  return {
    isLoading,
    data,
    fetchInvoiceByInvoiceItem,
  };
};
