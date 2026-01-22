import { useFormStepContext } from "#src/components/MarketingNotificationBuilder/Context/FormStepContext.context";
import { AppointmentEventForm } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Appointment/AppointmentEventForm";
import { BirthdayEventForm } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Birthday/BirthdayEventForm";
import { BookingEventForm } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/BookingEventForm";
import { PassEventForm } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Pass/PassEventForm";
import { SubscriptionEventForm } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Subscription/SubscriptionEventForm";
import {
  APPOINTMENT_PASS_TYPE,
  APPOINTMENT_TYPE,
  BIRTHDAY_TYPE,
  BOOKING_TYPE,
  NOTIFICATION_TYPE_TO_REFINED_TYPE,
  PASS_TYPE,
  SUBSCRIPTION_TYPE,
} from "#src/utils/types";

export const TriggerConditionStep = () => {
  const { formData } = useFormStepContext();
  const notificationType = formData.triggerType?.notificationType;
  const itemIds = formData.triggerType?.itemIds ?? [];
  const notificationRefinedType = notificationType
    ? NOTIFICATION_TYPE_TO_REFINED_TYPE[notificationType]
    : "";

  if (
    notificationType === APPOINTMENT_PASS_TYPE ||
    notificationType === PASS_TYPE
  ) {
    return <PassEventForm itemIds={itemIds} passType={notificationType} />;
  }

  if (notificationType === BIRTHDAY_TYPE) {
    return <BirthdayEventForm />;
  }

  if (notificationType === SUBSCRIPTION_TYPE) {
    return <SubscriptionEventForm itemIds={itemIds} />;
  }

  if (notificationType === APPOINTMENT_TYPE) {
    return <AppointmentEventForm itemIds={itemIds} />;
  }

  if (notificationRefinedType === BOOKING_TYPE && notificationType) {
    return (
      <BookingEventForm itemIds={itemIds} notificationType={notificationType} />
    );
  }

  return null;
};
