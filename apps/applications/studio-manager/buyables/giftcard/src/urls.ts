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
} as const;
