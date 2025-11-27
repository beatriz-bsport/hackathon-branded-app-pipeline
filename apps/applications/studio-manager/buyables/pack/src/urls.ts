const DETAILS_SLUG = ":id";
const OVERVIEW_URL = "overview";

export const URLS = {
  INDEX: "..",
  DETAILS_SLUG: DETAILS_SLUG,
  DETAILS: (id: number) => String(id),
  OVERVIEW: (id: number) => `${String(id)}/${OVERVIEW_URL}`,
  OVERVIEW_SLUG: `${DETAILS_SLUG}/${OVERVIEW_URL}`,
} as const;

export const LEGACY_URLS = {
  PACK_DETAILS: (packId: number) => `/combo/${packId}`,
  CREATE: "/combo?openForm=true",
  PAYMENT_LINK: ({ id, company }: { id: number; company: number }) =>
    `${window.location.origin}/customer/payment/combo/${id}/?membership=${company}`,
  MEMBER_DETAILS: (memberId: number) => `/member/${memberId}`,
  INVOICE_DETAILS: (invoiceId: string) => `/invoice/${invoiceId}`,
} as const;
