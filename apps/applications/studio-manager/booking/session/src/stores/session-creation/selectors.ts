import { SESSION_CREATION_STEPS, type SessionCreationState } from "./store";

/**
 * Selects the current step number.
 */
export const selectCurrentStep = (state: SessionCreationState) =>
  state.currentStep;

/**
 * Selects all step validations.
 */
export const selectStepValidations = (state: SessionCreationState) =>
  state.stepValidations;

/**
 * Selects whether a specific step is valid.
 */
export const selectIsStepValid = (state: SessionCreationState, step: number) =>
  state.stepValidations[step] ?? false;

/**
 * Selects whether the current step is valid.
 */
export const selectIsCurrentStepValid = (state: SessionCreationState) =>
  state.stepValidations[state.currentStep] ?? false;

/** Selects the selected activity.
 */
export const selectSelectedGroupActivity = (state: SessionCreationState) =>
  state.selectedGroupActivity;

/** Selects form data for a specific step.
 */
export const selectStepFormData =
  (
    step:
      | SESSION_CREATION_STEPS.ADVANCED_OPTIONS
      | SESSION_CREATION_STEPS.CONFIGURE_SESSION,
  ) =>
  (state: SessionCreationState) =>
    state.formData[step];

/** Selects merged form data.
 */
export const selectMergedFormData = (state: SessionCreationState) => ({
  ...state.formData[SESSION_CREATION_STEPS.CONFIGURE_SESSION],
  ...state.formData[SESSION_CREATION_STEPS.ADVANCED_OPTIONS],
});
