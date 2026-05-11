export const DELIVERY_MODE_SEND_NOW = "send_now" as const;
export const DELIVERY_MODE_SCHEDULE_LATER = "schedule_later" as const;

export const DELIVERY_MODE_VALUES = [
  DELIVERY_MODE_SEND_NOW,
  DELIVERY_MODE_SCHEDULE_LATER,
] as const;

export type DeliveryMode = (typeof DELIVERY_MODE_VALUES)[number];

export const MIN_SCHEDULE_MINUTES_FROM_NOW = 5;
