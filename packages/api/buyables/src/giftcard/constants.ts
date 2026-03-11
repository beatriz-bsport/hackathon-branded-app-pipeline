export const CONSUMER_GIFTCARD_KIND = {
  DIGITAL: 1,
  PRINTABLE: 2,
} as const;

export const GIFTCARD_TYPES = {
  CUSTOM: "Free Amount", // Backend constraint
  FIXED: "Fixed",
} as const;
