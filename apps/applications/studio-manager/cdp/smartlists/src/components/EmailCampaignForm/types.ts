import type { EmailType } from "./constants";

export type EmailCampaignFormData = {
  emailType: EmailType;
  campaignName: string;
};
