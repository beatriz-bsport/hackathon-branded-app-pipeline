import { buildUrlParams } from "@bsport/fetch";
import { ApiConfig } from "@bsport/store-base";

import { BASE_URL, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "#src/constants";
import { FetchInvoicesParams } from "#src/types";

export const fetchInvoices = ({
  page,
  pageSize,
}: FetchInvoicesParams): ApiConfig => {
  const params = {
    page: page || DEFAULT_PAGE,
    page_size: pageSize || DEFAULT_PAGE_SIZE,
  };

  return [`${BASE_URL}/${buildUrlParams(params)}`];
};

export const finalizeInvoice = (invoiceUuid: string): ApiConfig => {
  return [
    `${BASE_URL}/${invoiceUuid}/finalize/`,
    {
      method: "PATCH",
      body: JSON.stringify({ is_finalized: true }),
    },
  ];
};

export const getReceiptUrl = (invoiceUuid: string): ApiConfig => {
  return [
    `${BASE_URL}/${invoiceUuid}/generate_receipt/`,
    {
      method: "POST",
    },
  ];
};
