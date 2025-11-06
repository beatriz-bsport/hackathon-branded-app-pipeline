import React, { createContext, useContext, useState } from "react";

type FormStepContextType = {
  currentStep: number;
  setCurrentStep: (newStep: number) => void;
  setStepValid: (step: number, isValid: boolean) => void;
  checkIfCurrentStepValid: () => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
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

  const value = {
    currentStep,
    setCurrentStep,
    setStepValid,
    checkIfCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
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
