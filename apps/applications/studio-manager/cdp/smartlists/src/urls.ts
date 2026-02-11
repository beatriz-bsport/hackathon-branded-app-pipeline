export const URLS = {
  INDEX: "/",
  DETAILS: "/:id",
  PARAMETER: "/:id/parameter",
  AUTOMATION: "/:id/automation",
  CAMPAIGN: "/:id/campaign",
  AUTOMATION_MESSAGE: "/:id/automation/message/:messageId",
} as const;

export const LEGACY_URLS = {
  SMARTLIST_MEMBER: (smartlistId: number) =>
    `/smart-list/${smartlistId}/member`,
} as const;
