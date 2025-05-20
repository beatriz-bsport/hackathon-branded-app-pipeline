export const URLS = {
  INDEX: "/",
} as const;

export const LEGACY_URLS = {
  SMARTLIST_MEMBER: (smartlistId: number) =>
    `/smart-list/${smartlistId}/member`,
} as const;
