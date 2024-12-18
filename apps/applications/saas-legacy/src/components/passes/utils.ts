import { TFunction } from 'i18next';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import { PassPreviewData } from './types';

export const toPassPreviewData = (
  t: TFunction, // must contain the 'paymentPack' namespace
  pass: PaymentPack | PrivatePass,
): PassPreviewData => ({
  label: pass.name,
  value: pass.id,
  credits: pass.credits,
  price: pass.price,
  hasUnlimitedCredits: 'unlimited' in pass ? pass.unlimited : false,
});
