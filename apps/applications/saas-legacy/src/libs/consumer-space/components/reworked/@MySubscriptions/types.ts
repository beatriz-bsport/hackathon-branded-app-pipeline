const SubscriptionFilterTypes = ['active', 'future', 'expired'] as const;

export type SubscriptionFilter = (typeof SubscriptionFilterTypes)[number];
