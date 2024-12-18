import { TFunction } from 'i18next';
import { PaymentCombo } from './types';

export const getMarketplaceSearchItemIndicator = (
  paymentCombo: PaymentCombo,
  t: TFunction,
) => {
  return t('notificationRule:countElements', {
    nbr:
      paymentCombo.payment_packs?.length ??
      0 + paymentCombo.private_passes?.length ??
      0,
  });
};
