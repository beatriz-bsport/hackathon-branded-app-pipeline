export const URLS = {
  INDEX: "/",
  DETAILS: "/:id",
  PARAMETER: "/:id/parameter",
  AUTOMATION: "/:id/automation",
  CAMPAIGN: "/:id/campaign",
  CAMPAIGN_SCHEDULED_DETAILS: "/:id/campaign/scheduled/:uuid",
  CAMPAIGN_SENT_DETAILS: "/:id/campaign/sent/:uuid",
  AUTOMATION_MESSAGE: "/:id/automation/message/:messageId",
  AUTOMATION_TAG_RULE: "/:id/automation/tag-rule/:tagRuleId",
  POPUP_CREATION: "/:id/popups/new",
  POPUP_EDIT: "/:id/popups/:popupId/edit",
  CAMPAIGN_CREATION: "/:id/campaign/create",
} as const;

export const LEGACY_URLS = {
  AUDIENCE: "/audience",
  SMARTLIST_MEMBER: (smartlistId: number) =>
    `/smart-list/${smartlistId}/member`,
} as const;

export const CAMPAIGN_SENT_DETAILS_URL = ({
  campaignUuid,
  smartlistId,
}: {
  campaignUuid: string;
  smartlistId: string;
}) => `/${smartlistId}/campaign/sent/${campaignUuid}`;

export const CAMPAIGN_SCHEDULED_DETAILS_URL = ({
  campaignId,
  smartlistId,
}: {
  campaignId: number;
  smartlistId: string;
}) => `/${smartlistId}/campaign/scheduled/${campaignId}`;

export const EMAIL_CAMPAIGN_CREATION_URL = ({
  smartlistId,
}: {
  smartlistId: string;
}) => `/${smartlistId}/campaign/create/email`;
