import type { SessionCreationState } from "./store";

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
