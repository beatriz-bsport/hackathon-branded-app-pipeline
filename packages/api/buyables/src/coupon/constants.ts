export const CouponErrorCodes = {
  COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS: 5000,
  UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT: 5001,
  UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT: 5003,
  COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS: 5004,
  UNIQUE_CODE_LOCKED: 5006,
  /** Provided error code for invalid (expired, not existing) giftcard codes */
  GIFTCARD_EXCEPTION: 45009,
  /** Attempting attaching a giftcard before allowed activation date */
  GIFTCARD_INVALID_ACTIVATION_DATE: 45010,
} as const;
