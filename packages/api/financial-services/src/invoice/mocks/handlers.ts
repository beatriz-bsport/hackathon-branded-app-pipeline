import { HttpResponse, delay, http } from "msw";

import { API_URL_PAYMENT_INVOICES } from "../../constants";

export const UNPAID_INVOICES_URL_PATTERN = `*/${API_URL_PAYMENT_INVOICES}*`;

type MakeUnpaidInvoiceHandlersOptions = {
  count?: number;
  delayMs?: number | "infinite";
  errorOnLoad?: boolean;
};

export const makeUnpaidInvoiceHandlers = ({
  count = 0,
  delayMs = 400,
  errorOnLoad = false,
}: MakeUnpaidInvoiceHandlersOptions = {}) => [
  http.get(UNPAID_INVOICES_URL_PATTERN, async () => {
    await delay(delayMs);

    if (errorOnLoad) {
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      count,
      results: [],
      next_page: null,
      page: 1,
      links: { next: null, previous: null },
    });
  }),
];
