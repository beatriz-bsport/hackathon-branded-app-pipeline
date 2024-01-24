const SubscriptionTabTypes = ['active', 'future', 'expired'] as const;

export type SubscriptionTab = (typeof SubscriptionTabTypes)[number];
