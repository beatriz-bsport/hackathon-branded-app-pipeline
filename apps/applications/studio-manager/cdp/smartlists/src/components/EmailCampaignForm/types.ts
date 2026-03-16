import type { DeliveryMode, EmailType } from "./constants";

export type EmailCampaignFormData = {
  emailType: EmailType;
  campaignName: string;
  deliveryMode: DeliveryMode;
  scheduledDate?: string;
  scheduledTime?: string;
  isTextOnly: boolean;
  emailSubject?: string;
  emailBody?: string;
};
