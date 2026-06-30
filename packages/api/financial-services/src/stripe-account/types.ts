export const STRIPE_ACCOUNT_ACTION = {
  DO_NOTHING: 1,
  WARN: 2,
  BLOCK_BACKOFFICE: 3,
} as const;

export type StripeAccountStatus = {
  action: (typeof STRIPE_ACCOUNT_ACTION)[keyof typeof STRIPE_ACCOUNT_ACTION];
  reason: string;
  date_account_blocked: string | null;
};
