import { useFormStepContext } from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import { AppointmentEventForm } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Appointment/AppointmentEventForm";
import { BookingEventForm } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingEventForm";
import { SubscriptionEventForm } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Subscription/SubscriptionEventForm";
import { NOTIFICATION_TYPE_TO_REFINED_TYPE } from "#src/utils/types";

export const TriggerConditionStep = () => {
  const { formData } = useFormStepContext();
  const notificationType =
    formData.triggerType?.notificationType ?? "groupActivity";
  const itemIds = formData.triggerType?.itemIds ?? [];
  const notificationRefinedType =
    NOTIFICATION_TYPE_TO_REFINED_TYPE[notificationType];

  if (notificationType === "subscription") {
    return <SubscriptionEventForm itemIds={itemIds} />;
  }
  if (notificationType === "privateService") {
    return <AppointmentEventForm itemIds={itemIds} />;
  }
  if (notificationRefinedType === "booking") {
    return (
      <BookingEventForm itemIds={itemIds} notificationType={notificationType} />
    );
  }

  return null;
};
