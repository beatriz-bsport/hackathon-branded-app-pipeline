import type {
  AppointmentTriggerCondition,
  TriggerConditionStepProps,
} from "#src/components/MarketingNotificationBuilder/Context/FormStepContext.context";
import {
  APPOINTMENT_ACTION_ATTEND,
  APPOINTMENT_ACTION_CANCEL_ON_TIME,
  APPOINTMENT_ACTION_MAKES_CANCEL_TOO_LATE,
  type AppointmentAction,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Appointment/types";

export function isValidAppointmentAction(
  action: string,
): action is AppointmentAction {
  return (
    action === APPOINTMENT_ACTION_ATTEND ||
    action === APPOINTMENT_ACTION_CANCEL_ON_TIME ||
    action === APPOINTMENT_ACTION_MAKES_CANCEL_TOO_LATE
  );
}

export const getAppointmentFormData = (
  formData?: TriggerConditionStepProps,
): AppointmentTriggerCondition | undefined => {
  return formData?.type === "appointment" ? formData : undefined;
};
