import {
  CUSTOM_FORM_COMPLETION_CONDITION,
  type CustomFormCompletionCondition,
} from "@bsport/api-cdp/smartlist";

/**
 * Select option ids for the completion condition field (Kaizen `Select`).
 */
export const FORM_COMPLETION_CONDITION_SELECT = {
  noForm: String(CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM),
  allForms: String(CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS),
  atLeastOne: String(CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM),
} as const;

export type FormCompletionConditionSelectValue =
  (typeof FORM_COMPLETION_CONDITION_SELECT)[keyof typeof FORM_COMPLETION_CONDITION_SELECT];

export const isFormCompletionConditionSelectValue = (
  value: string,
): value is FormCompletionConditionSelectValue =>
  value === FORM_COMPLETION_CONDITION_SELECT.noForm ||
  value === FORM_COMPLETION_CONDITION_SELECT.allForms ||
  value === FORM_COMPLETION_CONDITION_SELECT.atLeastOne;

/**
 * Maps a select option id to the API completion condition enum.
 */
export const selectValueToCompletionCondition = (
  value: FormCompletionConditionSelectValue,
): CustomFormCompletionCondition =>
  Number(value) as CustomFormCompletionCondition;

/**
 * Maps an API completion condition to a select option id.
 */
export const completionConditionToSelectValue = (
  condition: CustomFormCompletionCondition,
): FormCompletionConditionSelectValue =>
  String(condition) as FormCompletionConditionSelectValue;
