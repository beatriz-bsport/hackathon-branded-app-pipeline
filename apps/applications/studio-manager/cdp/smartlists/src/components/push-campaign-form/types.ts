import type { DeliveryMode } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";

export type PushCampaignFormData = {
  campaignName: string;
  deliveryMode: DeliveryMode;
  scheduledDate?: string;
  scheduledTime?: string;
};
