import { useFormController } from "@bsport/form";

import { BookingEventForm } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingEventForm";
import { triggerConfigValidationSchema } from "#src/utils/schemas/triggerConfigValidation";
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

  const methods = useFormController({
    schema: triggerConfigValidationSchema,
    mode: "onBlur",
    defaultValues: {
      itemIds,
    },
  });

  if (notificationRefinedType === "booking") {
    return (
      <BookingEventForm
        itemIds={itemIds}
        {...methods}
        onSubmit={(data) => console.log("validate form : ", data)}
      />
    );
  }
  return null;
};
