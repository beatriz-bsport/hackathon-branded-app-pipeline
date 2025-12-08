import { MetaActivity } from "@bsport/api-book";

import {
  MAX_STEP,
  SESSION_CREATION_STEPS,
  getInitialState,
  sessionCreationStore,
} from "#src/stores/session-creation/store";
import type { SessionCreate } from "#src/stores/session-creation/types";

/**
 * Sets the current step in the session creation flow.
 */
export const setCurrentStep = (step: number) => {
  sessionCreationStore.setState({ currentStep: step });
};

/**
 * Sets the validation status for a specific step.
 */
export const setStepValid = (step: number, isValid: boolean) => {
  sessionCreationStore.setState((state) => ({
    stepValidations: { ...state.stepValidations, [step]: isValid },
  }));
};

/**
 * Advances to the next step if not already at the last step.
 */
export const goToNextStep = () => {
  sessionCreationStore.setState((state) => ({
    currentStep:
      state.currentStep < MAX_STEP ? state.currentStep + 1 : state.currentStep,
  }));
};

/**
 * Goes back to the previous step if not already at the first step.
 */
export const goToPreviousStep = () => {
  sessionCreationStore.setState((state) => ({
    currentStep:
      state.currentStep > SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY
        ? state.currentStep - 1
        : state.currentStep,
  }));
};

/**
 * Resets the form to the initial step.
 */
export const resetForm = () => {
  sessionCreationStore.setState(getInitialState(), true);
};

/**
 * Sets the selected activity in the session creation state.
 */
export const setSelectedGroupActivity = (activity: MetaActivity | null) => {
  sessionCreationStore.setState({ selectedGroupActivity: activity });
};

export const saveStepFormData = ({
  step,
  data,
}: {
  step: SESSION_CREATION_STEPS;
  data: Partial<SessionCreate>;
}) => {
  sessionCreationStore.setState((state) => ({
    formData: {
      ...state.formData,
      [step]: data,
    },
  }));
};
