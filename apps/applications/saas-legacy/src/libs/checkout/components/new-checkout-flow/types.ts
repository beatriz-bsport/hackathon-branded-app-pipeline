import type React from 'react';

export interface CheckoutBasketOnlinePaymentRef {
  onPaymentConfirm?: (event: React.MouseEvent<HTMLElement>) => void;
  onPayLaterSubmit?: () => void;
  onPayPalCreateOrder?: () => void;
  onPayPalApprove?: () => void;
  onPayPalCancel?: () => void;
  onPayPalError?: () => void;
  paymentEngine?: string;
  isOnlinePaymentDisabled?: boolean;
}

export interface BasketDeliveryFormRef {
  onAddressSubmit: (options?: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => void;
}

export interface CheckoutStepsRef extends CheckoutBasketOnlinePaymentRef {
  updateMemberDefaultEstablishmentBillingGroup: () => void;
  onAddressSubmit: (options?: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => void;
}
