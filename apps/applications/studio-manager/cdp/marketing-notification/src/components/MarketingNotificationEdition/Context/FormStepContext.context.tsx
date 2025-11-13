import React, { createContext, useContext, useState } from "react";

import type { BookingTriggerConfigValidationFormData } from "#src/utils/schemas/types";
import type { SelectableNotificationType } from "#src/utils/types";

type TriggerTypeStep = {
  type: "triggerType";
  notificationType: SelectableNotificationType;
  itemIds: number[];
};

type BookingTriggerCondition = {
  type: "booking";
} & BookingTriggerConfigValidationFormData;

type AppointmentTriggerCondition = {
  type: "appointment";
};

type SubscriptionTriggerCondition = {
  type: "subscription";
};

type BirthdayTriggerCondition = {
  type: "birthday";
};

type PassesTriggerCondition = {
  type: "passes";
};

type TriggerConditionStep =
  | BookingTriggerCondition
  | AppointmentTriggerCondition
  | SubscriptionTriggerCondition
  | BirthdayTriggerCondition
  | PassesTriggerCondition;

type ContentStep = {
  type: "content";
};

type NotificationMultiStepFormState = {
  triggerType?: TriggerTypeStep;
  triggerCondition?: TriggerConditionStep;
  content?: ContentStep;
};

export type GetCurrentFormValues =
  | TriggerTypeStep
  | TriggerConditionStep
  | ContentStep;

type FormStepContextType = {
  currentStep: number;
  formData: NotificationMultiStepFormState;
  setCurrentStep: (newStep: number) => void;
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

  const [currentStep, setCurrentStep] = useState(
    NOTIFICATION_TYPE_STEP_IDENTIFIER,
  );
  const [stepValidations, setStepValidations] = useState<
    Record<number, boolean>
  >({
    [NOTIFICATION_TYPE_STEP_IDENTIFIER]: false,
    [NOTIFICATION_TRIGGER_STEP_IDENTIFIER]: true,
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
  const resetForm = () => setFormData({});

  const value = {
    currentStep,
    formData,
    setCurrentStep,
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
