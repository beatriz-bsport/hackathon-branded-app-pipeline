import React, { createContext, useContext, useState } from "react";

import type {
  BookingTriggerConfigValidationFormData,
  CommonTriggerConfigValidationFormData,
  NotificationContentFormData,
  PassTriggerConfigValidationFormData,
  PassesType,
  SubscriptionTriggerConfigValidationFormData,
  TriggerTypeValidationFormData,
} from "#src/utils/schemas/types";

type TriggerTypeStep = {
  type: "triggerType";
} & TriggerTypeValidationFormData;

export type BookingTriggerCondition = {
  type: "booking";
} & BookingTriggerConfigValidationFormData;

export type AppointmentTriggerCondition = {
  type: "appointment";
} & BookingTriggerConfigValidationFormData;

export type SubscriptionTriggerCondition = {
  type: "subscription";
} & SubscriptionTriggerConfigValidationFormData;

export type PassTriggerCondition = {
  type: PassesType;
} & PassTriggerConfigValidationFormData;

export type BirthdayTriggerCondition = {
  type: "birthday";
} & CommonTriggerConfigValidationFormData;

export type TriggerConditionStepProps =
  | BookingTriggerCondition
  | AppointmentTriggerCondition
  | SubscriptionTriggerCondition
  | PassTriggerCondition
  | BirthdayTriggerCondition;

type ContentStep = {
  type: "content";
} & NotificationContentFormData;

export type NotificationMultiStepFormState = {
  triggerType?: TriggerTypeStep;
  triggerCondition?: TriggerConditionStepProps;
  content?: ContentStep;
};

export type GetCurrentFormValues =
  | TriggerTypeStep
  | TriggerConditionStepProps
  | ContentStep;

type FormStepContextType = {
  buildMarketingNotificationAction: "create" | "edit" | undefined;
  currentStep: number;
  formData: NotificationMultiStepFormState;
  setCurrentStep: (newStep: number) => void;
  setBuildMarketingNotificationAction: (
    newBuildMarketingNotificationAction: "create" | "edit" | undefined,
  ) => void;
  setStepValid: (step: number, isValid: boolean) => void;
  checkIfCurrentStepValid: () => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateForm: (values: Partial<NotificationMultiStepFormState>) => void;
  resetForm: () => void;
};

export const NOTIFICATION_TYPE_STEP_IDENTIFIER = 0;
export const NOTIFICATION_TRIGGER_STEP_IDENTIFIER = 1;
export const NOTIFICATION_CONTENT_STEP_IDENTIFIER = 2;
const MAX_STEP = 2;

const FormStepContext = createContext<FormStepContextType | undefined>(
  undefined,
);

export const FormStepContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = React.useState<
    Partial<NotificationMultiStepFormState>
  >({});

  const [
    buildMarketingNotificationAction,
    setBuildMarketingNotificationAction,
  ] = useState<"create" | "edit" | undefined>(undefined);

  const [currentStep, setCurrentStep] = useState(
    NOTIFICATION_TYPE_STEP_IDENTIFIER,
  );
  const [stepValidations, setStepValidations] = useState<
    Record<number, boolean>
  >({
    [NOTIFICATION_TYPE_STEP_IDENTIFIER]: false,
    [NOTIFICATION_TRIGGER_STEP_IDENTIFIER]: false,
    [NOTIFICATION_CONTENT_STEP_IDENTIFIER]: false,
  });

  const setStepValid = (step: number, isValid: boolean) => {
    setStepValidations((prev) => ({ ...prev, [step]: isValid }));
  };

  const checkIfCurrentStepValid = () => stepValidations[currentStep] ?? false;

  const goToNextStep = () => {
    if (currentStep < MAX_STEP) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateForm = (values: Partial<NotificationMultiStepFormState>) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };
  const resetForm = () => {
    setFormData({});
    setBuildMarketingNotificationAction(undefined);
    setCurrentStep(NOTIFICATION_TYPE_STEP_IDENTIFIER);
    setStepValidations({
      [NOTIFICATION_TYPE_STEP_IDENTIFIER]: false,
      [NOTIFICATION_TRIGGER_STEP_IDENTIFIER]: false,
      [NOTIFICATION_CONTENT_STEP_IDENTIFIER]: false,
    });
  };

  const value = {
    buildMarketingNotificationAction,
    currentStep,
    formData,
    setCurrentStep,
    setBuildMarketingNotificationAction,
    setStepValid,
    checkIfCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
    updateForm,
    resetForm,
  };

  return (
    <FormStepContext.Provider value={value}>
      {children}
    </FormStepContext.Provider>
  );
};

export const useFormStepContext = () => {
  const context = useContext(FormStepContext);
  if (context === undefined) {
    throw new Error(
      "useFormStepContext must be used within a FormStepContextProvider",
    );
  }
  return context;
};
