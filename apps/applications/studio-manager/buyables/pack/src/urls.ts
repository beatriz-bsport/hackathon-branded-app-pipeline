export const URLS = {
  INDEX: "..",
  DETAILS_SLUG: ":id",
  DETAILS: (id: number) => String(id),
} as const;

export const LEGACY_URLS = {
  PACK_DETAILS: (packId: number) => `/combo/${packId}`,
  CREATE: "/combo?openForm=true",
  PAYMENT_LINK: ({ id, company }: { id: number; company: number }) =>
    `${window.location.origin}/customer/payment/combo/${id}/?membership=${company}`,
} as const;
