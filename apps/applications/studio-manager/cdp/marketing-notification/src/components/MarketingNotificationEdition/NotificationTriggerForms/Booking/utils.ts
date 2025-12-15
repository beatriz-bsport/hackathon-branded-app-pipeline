import type {
  BookingTriggerCondition,
  TriggerConditionStepProps,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";

export const getBookingFormData = (
  formData?: TriggerConditionStepProps,
): BookingTriggerCondition | undefined => {
  return formData?.type === "booking" ? formData : undefined;
};
