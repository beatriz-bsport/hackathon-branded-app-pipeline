/**
 * Radio `value` strings for acceptance status (Kaizen `FormRadioGroup`).
 */
export const TERMS_AND_CONDITIONS_OPTIONS = {
  accepted: "true",
  notAccepted: "false",
} as const;

export type TermsAndConditionsOption =
  (typeof TERMS_AND_CONDITIONS_OPTIONS)[keyof typeof TERMS_AND_CONDITIONS_OPTIONS];

/**
 * Narrows a string to {@link TermsAndConditionsOption} when it matches a known radio value.
 */
export function isTermsAndConditionsOption(
  value: string,
): value is TermsAndConditionsOption {
  return (
    value === TERMS_AND_CONDITIONS_OPTIONS.accepted ||
    value === TERMS_AND_CONDITIONS_OPTIONS.notAccepted
  );
}

/**
 * Maps acceptance radio values to API boolean flags.
 */
export const termsAndConditionsOptionToBooleanMap: Record<
  TermsAndConditionsOption,
  boolean
> = {
  [TERMS_AND_CONDITIONS_OPTIONS.accepted]: true,
  [TERMS_AND_CONDITIONS_OPTIONS.notAccepted]: false,
};

/**
 * Maps API boolean acceptance flags to radio values.
 */
export const booleanToTermsAndConditionsOptionMap = (
  value: boolean,
): TermsAndConditionsOption =>
  value
    ? TERMS_AND_CONDITIONS_OPTIONS.accepted
    : TERMS_AND_CONDITIONS_OPTIONS.notAccepted;
