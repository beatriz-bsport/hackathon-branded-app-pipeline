import type {
  SubscriptionTriggerCondition,
  TriggerConditionStepProps,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import {
  SUBSCRIPTION_STATUS_CREATION,
  SUBSCRIPTION_STATUS_END,
  SUBSCRIPTION_STATUS_FIRST_BILLING,
  SubscriptionStatus,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Subscription/types";

export function isValidSubscriptionStatus(
  status: string,
): status is SubscriptionStatus {
  return (
    status === SUBSCRIPTION_STATUS_CREATION ||
    status === SUBSCRIPTION_STATUS_FIRST_BILLING ||
    status === SUBSCRIPTION_STATUS_END
  );
}

export const getSubscriptionFormData = (
  formData?: TriggerConditionStepProps,
): SubscriptionTriggerCondition | undefined => {
  return formData?.type === "subscription" ? formData : undefined;
};
