export const EMAIL_TYPE_MARKETING = "marketing" as const;
export const EMAIL_TYPE_INFORMATIONAL = "informational" as const;

export const EMAIL_TYPE_VALUES = [
  EMAIL_TYPE_MARKETING,
  EMAIL_TYPE_INFORMATIONAL,
] as const;

export type EmailType = (typeof EMAIL_TYPE_VALUES)[number];

export const DELIVERY_MODE_SEND_NOW = "send_now" as const;
export const DELIVERY_MODE_SCHEDULE_LATER = "schedule_later" as const;

export const DELIVERY_MODE_VALUES = [
  DELIVERY_MODE_SEND_NOW,
  DELIVERY_MODE_SCHEDULE_LATER,
] as const;

export type DeliveryMode = (typeof DELIVERY_MODE_VALUES)[number];
