export const CUSTOM_FORM_FILTER_IDENTIFIER = "102";

/**
 * Completion condition values for {@link CustomFormFilter}.
 */
export const CUSTOM_FORM_COMPLETION_CONDITION = {
  NO_FORM: 0,
  ALL_FORMS: 1,
  AT_LEAST_ONE_FORM: 2,
} as const;

export type CustomFormCompletionCondition =
  (typeof CUSTOM_FORM_COMPLETION_CONDITION)[keyof typeof CUSTOM_FORM_COMPLETION_CONDITION];
