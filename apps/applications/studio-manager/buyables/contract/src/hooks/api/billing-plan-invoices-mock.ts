import type {
  FetchPlannedInvoicesParams,
  PlannedInvoice,
  PlannedInvoiceStatus,
} from "@bsport/api-buyables/billing-plan-planned-invoice";

type MockPage = {
  count: number;
  links: { next: number | null; previous: number | null };
  next_page: number | null;
  page: number;
  results: PlannedInvoice[];
};

const MOCK_INVOICES_COUNT = 37;

const MOCK_STATUSES: PlannedInvoiceStatus[] = [
  "paid",
  "open",
  "draft",
  "voided",
  "refunded",
];

const getMockInvoice = (
  billingPlanId: number,
  index: number,
): PlannedInvoice => {
  const invoiceNumber = index + 1;
  const month = (index % 12) + 1;
  const year = 2026 + Math.floor(index / 12);

  return {
    id: billingPlanId * 1_000 + invoiceNumber,
    uuid: `00000000-0000-0000-0000-${String(billingPlanId * 1_000 + invoiceNumber).padStart(12, "0")}`,
    date: `${year}-${String(month).padStart(2, "0")}-15T00:00:00.000Z`,
    amount_due_cts: 2_000 + ((billingPlanId + index) % 8) * 500,
    status: MOCK_STATUSES[index % MOCK_STATUSES.length],
    billing_plan: billingPlanId,
    invoice_legal_identifier: `INV-${billingPlanId}-${String(invoiceNumber).padStart(3, "0")}`,
    reverted: false,
    is_first_invoice: index === 0,
  };
};

export const getMockBillingPlanInvoicesPage = ({
  billing_plan: billingPlanId,
  page = 1,
  page_size = 10,
}: FetchPlannedInvoicesParams): MockPage => {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(page_size, 1);
  const start = (safePage - 1) * safePageSize;
  const end = Math.min(start + safePageSize, MOCK_INVOICES_COUNT);

  const results =
    start >= MOCK_INVOICES_COUNT
      ? []
      : Array.from({ length: end - start }, (_, index) =>
          getMockInvoice(billingPlanId, start + index),
        );

  return {
    count: MOCK_INVOICES_COUNT,
    links: {
      next: end < MOCK_INVOICES_COUNT ? safePage + 1 : null,
      previous: safePage > 1 ? safePage - 1 : null,
    },
    next_page: end < MOCK_INVOICES_COUNT ? safePage + 1 : null,
    page: safePage,
    results,
  };
};

const UPCOMING_INVOICES_PAGE_SIZE = 12;

const isUpcomingInvoice = (invoice: PlannedInvoice) =>
  (invoice.status === "draft" || invoice.status === "open") &&
  new Date(invoice.date).getTime() >= Date.now();

export const getMockUpcomingBillingPlanInvoices = (
  billingPlanId: number,
): PlannedInvoice[] =>
  getMockBillingPlanInvoicesPage({
    billing_plan: billingPlanId,
    page: 1,
    page_size: UPCOMING_INVOICES_PAGE_SIZE,
  }).results.filter(isUpcomingInvoice);
