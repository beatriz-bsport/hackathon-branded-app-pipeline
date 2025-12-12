export const URLS = {
  INDEX: "/",
  DETAILS: "/:id",
  PARAMETER: "/:id/parameter",
  AUTOMATION: "/:id/automation",
  CAMPAIGN: "/:id/campaign",
} as const;

export const LEGACY_URLS = {
  SMARTLIST_MEMBER: (smartlistId: number) =>
    `/smart-list/${smartlistId}/member`,
} as const;
