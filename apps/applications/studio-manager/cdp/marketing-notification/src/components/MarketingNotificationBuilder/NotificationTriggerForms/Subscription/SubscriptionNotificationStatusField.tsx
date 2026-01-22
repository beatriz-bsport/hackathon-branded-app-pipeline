import { useState } from "react";

import type { ControlledFormProps } from "@bsport/form";
import { RadioGroup } from "@bsport/kaizen-primitive-core";

import {
  SUBSCRIPTIONS_EVENT_KIND_MAP_TO_SUBSCRIPTION_STATUS,
  SUBSCRIPTION_STATUS_CREATION,
  SUBSCRIPTION_STATUS_END,
  SUBSCRIPTION_STATUS_FIRST_BILLING,
  SUBSCRIPTION_STATUS_MAP_TO_SUBSCRIPTION_EVENT_KIND,
  type SubscriptionStatus,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Subscription/types";
import { isValidSubscriptionStatus } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Subscription/utils";
import { useTranslation } from "#src/utils/i18n";
import type { SubscriptionTriggerConfigValidationFormData } from "#src/utils/schemas/types";

type SubscriptionNotificationTriggerFieldProps = {
  setFormValue: ControlledFormProps<SubscriptionTriggerConfigValidationFormData>["setValue"];
  selectedSubscriptionStatus: number;
};

export const SubscriptionNotificationStatusField = ({
  setFormValue,
  selectedSubscriptionStatus,
}: SubscriptionNotificationTriggerFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>(
      SUBSCRIPTIONS_EVENT_KIND_MAP_TO_SUBSCRIPTION_STATUS[
        selectedSubscriptionStatus
      ] ?? SUBSCRIPTION_STATUS_CREATION,
    );

  const handleSubscriptionStatusUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newStatus = event.target.value;
    if (!isValidSubscriptionStatus(newStatus)) {
      console.warn(
        "[Marketing Notification Modal] - Subscription status do not have a valid value",
      );
      return;
    }
    setSubscriptionStatus(newStatus);
    const subscriptionEventKind =
      SUBSCRIPTION_STATUS_MAP_TO_SUBSCRIPTION_EVENT_KIND[newStatus];
    setFormValue("subscriptionEventKind", subscriptionEventKind, {
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-col gap-sm">
      <RadioGroup
        required
        id="subscription-notification-statuses-field"
        label={t("steps.notificationRules.booking.actionLabel")}
        options={[
          {
            value: SUBSCRIPTION_STATUS_CREATION,
            label: t(
              "steps.notificationRules.subscription.statuses.subscriptionCreation",
            ),
          },
          {
            value: SUBSCRIPTION_STATUS_FIRST_BILLING,
            label: t(
              "steps.notificationRules.subscription.statuses.subscriptionFirstBilling",
            ),
          },
          {
            value: SUBSCRIPTION_STATUS_END,
            label: t(
              "steps.notificationRules.subscription.statuses.subscriptionEnd",
            ),
          },
        ]}
        value={subscriptionStatus}
        onChange={handleSubscriptionStatusUpdate}
      />
    </div>
  );
};
