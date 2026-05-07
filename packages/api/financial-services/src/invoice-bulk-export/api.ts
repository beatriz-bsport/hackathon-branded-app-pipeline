import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT, QUERY_KEY_MAIN } from "../constants";
import type {
  DownloadInvoiceBulkExportRequest,
  DownloadInvoiceBulkExportResponse,
} from "./types";

export const invoiceBulkExportKeys = {
  all: [QUERY_KEY_MAIN, "invoice-bulk-export"] as const,
  detail: (payload: DownloadInvoiceBulkExportRequest) =>
    [
      ...invoiceBulkExportKeys.all,
      "detail",
      payload.year,
      payload.month,
    ] as const,
} as const;

const downloadInvoiceBulkExportAPIConfig = (
  payload: DownloadInvoiceBulkExportRequest,
): ApiConfig => {
  const params = new URLSearchParams({
    year: String(payload.year),
    month: String(payload.month),
  });
  return [
    `${API_URL_PAYMENT}/invoice-pdf-bulk-export/download-month/?${params.toString()}`,
    { method: "GET" },
  ];
};

export const downloadInvoiceBulkExportAPI = async (
  fetch: Fetch<DownloadInvoiceBulkExportResponse>,
  payload: DownloadInvoiceBulkExportRequest,
): Promise<DownloadInvoiceBulkExportResponse> => {
  const [uri, init] = downloadInvoiceBulkExportAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};
