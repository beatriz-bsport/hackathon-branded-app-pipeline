import { useFormStepContext } from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import { BookingEventForm } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingEventForm";
import { NOTIFICATION_TYPE_TO_REFINED_TYPE } from "#src/utils/types";

export const TriggerConditionStep = () => {
  const { formData } = useFormStepContext();
  const notificationType =
    formData.triggerType?.notificationType ?? "groupActivity";
  const itemIds = formData.triggerType?.itemIds ?? [];
  const notificationRefinedType =
    NOTIFICATION_TYPE_TO_REFINED_TYPE[notificationType];

  if (notificationRefinedType === "booking") {
    return (
      <BookingEventForm itemIds={itemIds} notificationType={notificationType} />
    );
  }
  return null;
};
