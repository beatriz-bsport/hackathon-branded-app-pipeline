import type { DeliveryMode, EmailType } from "./constants";

export type EmailCampaignFormData = {
  emailType: EmailType;
  campaignName: string;
  deliveryMode: DeliveryMode;
  scheduledDate?: string;
  scheduledTime?: string;
};
