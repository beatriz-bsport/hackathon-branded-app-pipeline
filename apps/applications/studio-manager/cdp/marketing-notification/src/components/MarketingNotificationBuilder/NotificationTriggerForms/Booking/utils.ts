import type {
  BookingTriggerCondition,
  TriggerConditionStepProps,
} from "#src/components/MarketingNotificationBuilder/Context/FormStepContext.context";
import { BOOKING_TYPE } from "#src/utils/types";

export const getBookingFormData = (
  formData?: TriggerConditionStepProps,
): BookingTriggerCondition | undefined => {
  return formData?.type === BOOKING_TYPE ? formData : undefined;
};
