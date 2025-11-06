import { BookingEventForm } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingEventForm";
import {
  NOTIFICATION_TYPE_TO_REFINED_TYPE,
  type SelectableNotificationType,
} from "#src/utils/types";

type TriggerConditionStepProps = {
  notificationType: SelectableNotificationType;
  itemIds: number[];
};

export const TriggerConditionStep = ({
  notificationType,
  itemIds,
}: TriggerConditionStepProps) => {
  const notificationRefinedType =
    NOTIFICATION_TYPE_TO_REFINED_TYPE[notificationType];

  if (notificationRefinedType === "booking") {
    return (
      <BookingEventForm itemIds={itemIds} notificationType={notificationType} />
    );
  }
  return null;
};
