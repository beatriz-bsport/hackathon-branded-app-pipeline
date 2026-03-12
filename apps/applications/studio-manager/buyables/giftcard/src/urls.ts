const EDITOR_SLUG = ":id";
const PURCHASES_URL = "purchases";

export const URLS = {
  INDEX: "..",
  ARCHIVED: "archived",
  EDITOR_SLUG: EDITOR_SLUG,
  EDITOR: (id: number) => String(id),
  PURCHASES_SLUG: `${EDITOR_SLUG}/${PURCHASES_URL}`,
  PURCHASES: (id: number) => `${String(id)}/${PURCHASES_URL}`,
} as const;

export const LEGACY_URLS = {
  INDEX: "/giftcard",
  CREATE: "/giftcard/?isCreateFormOpen=true",
  DETAILS: (giftcardId: number) => `/giftcard/${giftcardId}/`,
  PAYMENT_LINK: ({
    companyId,
    giftcardId,
  }: {
    companyId: number;
    giftcardId: number | string;
  }) =>
    `${window?.location?.origin ?? ""}/checkout/${companyId}/giftcard/${giftcardId}/?force=true`,
  ACTIVATION_LINK: ({
    companyId,
    activationCode,
  }: {
    companyId: number;
    activationCode: string;
  }) =>
    `${window?.location?.origin ?? ""}/checkout/${companyId}/giftcard/activation/${activationCode}`,
  INVOICE_LINK: (uuid: string) => `/invoice/${uuid}`,
} as const;
