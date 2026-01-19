import type {
  BirthdayTriggerCondition,
  TriggerConditionStepProps,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";

export const getBirthdayFormData = (
  formData?: TriggerConditionStepProps,
): BirthdayTriggerCondition | undefined => {
  return formData?.type === "birthday" ? formData : undefined;
};
