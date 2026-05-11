import type { DeliveryMode } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import type { PushNotificationContentFormData } from "#src/components/push-notification-generic-field/types";

export type PushCampaignFormData = PushNotificationContentFormData & {
  campaignName: string;
  deliveryMode: DeliveryMode;
  scheduledDate?: string;
  scheduledTime?: string;
};
