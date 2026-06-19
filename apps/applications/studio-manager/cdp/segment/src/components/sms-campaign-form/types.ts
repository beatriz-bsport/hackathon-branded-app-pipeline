import type { DeliveryMode } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import type { SmsContentFormData } from "#src/components/sms-content-generic-field/types";

export type SmsCampaignFormData = SmsContentFormData & {
  campaignName?: string;
  deliveryMode: DeliveryMode;
  scheduledDate?: string;
  scheduledTime?: string;
};
