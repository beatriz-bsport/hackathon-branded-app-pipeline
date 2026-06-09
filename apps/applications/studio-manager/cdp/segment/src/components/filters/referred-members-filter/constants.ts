export const REFERRED_MEMBER_STATUS = {
  referred: "referred",
  notReferred: "notReferred",
} as const;

export type ReferredMemberStatusOption =
  (typeof REFERRED_MEMBER_STATUS)[keyof typeof REFERRED_MEMBER_STATUS];

/**
 * Maps the radio group value to the API `is_referred` boolean.
 */
export const isReferredStatusToApi = (
  status: ReferredMemberStatusOption,
): boolean => status === REFERRED_MEMBER_STATUS.referred;

/**
 * Maps API `is_referred` to the radio group value.
 */
export const isReferredStatusFromApi = (
  isReferred: boolean,
): ReferredMemberStatusOption =>
  isReferred
    ? REFERRED_MEMBER_STATUS.referred
    : REFERRED_MEMBER_STATUS.notReferred;
