/**
 * Select option ids for AND/OR combine mode (Kaizen `Select`).
 */
export const COMBINE_MODE_OPTIONS = {
  and: "and",
  or: "or",
} as const;

export type CombineModeOption =
  (typeof COMBINE_MODE_OPTIONS)[keyof typeof COMBINE_MODE_OPTIONS];

/**
 * Radio `value` strings for channel consent (Kaizen `FormRadioGroup`).
 */
export const CONSENT_OPTIONS = {
  accepted: "accepted",
  rejected: "rejected",
} as const;

export type ConsentOption =
  (typeof CONSENT_OPTIONS)[keyof typeof CONSENT_OPTIONS];

/**
 * Narrows a string to {@link ConsentOption} when it matches a known radio value.
 */
export function isConsentOption(value: string): value is ConsentOption {
  return (
    value === CONSENT_OPTIONS.accepted || value === CONSENT_OPTIONS.rejected
  );
}

/**
 * Maps consent radio values to API boolean flags.
 */
export const consentOptionToBooleanMap: Record<ConsentOption, boolean> = {
  [CONSENT_OPTIONS.accepted]: true,
  [CONSENT_OPTIONS.rejected]: false,
};

/**
 * Maps API boolean consent flags to radio values.
 */
export const booleanToConsentOptionMap = (value: boolean): ConsentOption =>
  value ? CONSENT_OPTIONS.accepted : CONSENT_OPTIONS.rejected;

/**
 * Maps combine Select option ids to API `is_condition_and`.
 */
export const combineModeOptionToBooleanMap: Record<CombineModeOption, boolean> =
  {
    [COMBINE_MODE_OPTIONS.and]: true,
    [COMBINE_MODE_OPTIONS.or]: false,
  };

/**
 * Maps API `is_condition_and` to combine Select option ids.
 */
export const booleanToCombineModeOptionMap = (
  value: boolean,
): CombineModeOption =>
  value ? COMBINE_MODE_OPTIONS.and : COMBINE_MODE_OPTIONS.or;
