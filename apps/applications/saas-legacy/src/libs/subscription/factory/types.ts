export type SubscriptionFactoryOptions = {
  isAutoRenewal?: boolean;
  isCanceled?: boolean;
  isEditable?: boolean;
  isSubscriptionEnded?: boolean;
  isV2?: boolean;
  isMemberArchived?: boolean;
  nextBillingDate?: string;
  hasPaymentCombo?: boolean;
  hasPaymentPack?: boolean;
  hasPrivatePass?: boolean;
  status?: number;
  hasDiscount?: boolean;
};
