export const ROUTES = {
  ACTIVE: "..",
  ARCHIVED: "archived",
};

export const LEGACY_ROUTES = {
  INDEX: "/giftcard",
  CREATE: "/giftcard/?isCreateFormOpen=true",
  DETAILS: (giftcardId: number) => `/giftcard/${giftcardId}/`,
} as const;
