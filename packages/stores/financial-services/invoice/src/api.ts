import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchInvoiceByInvoiceItemParams } from "./types";

const BASE_URL = "financial-services/v1/payment/invoices";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export const fetchInvoicesAPI = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): ApiConfig => {
  const params = {
    page: page ?? DEFAULT_PAGE,
    page_size: pageSize ?? DEFAULT_PAGE_SIZE,
  };

  return [`${BASE_URL}/${buildUrlParams(params)}`];
};

export const finalizeInvoiceAPI = (invoiceUuid: string): ApiConfig => {
  return [
    `${BASE_URL}/${invoiceUuid}/finalize/`,
    {
      method: "PATCH",
      body: JSON.stringify({ is_finalized: true }),
    },
  ];
};

export const getReceiptUrlAPI = (invoiceUuid: string): ApiConfig => {
  return [
    `${BASE_URL}/${invoiceUuid}/generate_receipt/`,
    {
      method: "POST",
    },
  ];
};

export const fetchInvoiceByInvoiceItemAPI = ({
  buyableItemIdentifier,
  buyableItemId,
}: FetchInvoiceByInvoiceItemParams): ApiConfig => {
  const queryParams = buildUrlParams({
    buyable_item_identifier: buyableItemIdentifier,
    object_id: buyableItemId,
  });
  return [`${BASE_URL}/by_invoice_item/${queryParams}`];
};
