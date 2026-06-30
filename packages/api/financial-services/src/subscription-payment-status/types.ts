export const SUBSCRIPTION_PAYMENT_ACTION = {
  DO_NOTHING: 1,
  WARN: 2,
  BLOCK_BACKOFFICE: 3,
} as const;

export const SUBSCRIPTION_PAYMENT_BLOCKING = {
  FAILED_PAYMENT: 0,
  DISPUTED_PAYMENT: 1,
} as const;

export type SubscriptionPaymentStatus = {
  failed: Array<{ payment_backend_id: number; date: string }>;
  disputed: Array<{ date: string }>;
  action: (typeof SUBSCRIPTION_PAYMENT_ACTION)[keyof typeof SUBSCRIPTION_PAYMENT_ACTION];
  blocking: (typeof SUBSCRIPTION_PAYMENT_BLOCKING)[keyof typeof SUBSCRIPTION_PAYMENT_BLOCKING];
};
