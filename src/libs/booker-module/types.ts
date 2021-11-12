import { ConsumerPaymentPack } from '../consumer-payment-pack/types';
import type { Offer_FULL } from '../offer/types';
import { PaymentCombo } from '../payment-combo/types';
import { PaymentPack } from '../payment-packs/types';

export type OfferData = {
  offer: Offer_FULL;
  extra_data: any;
};

export type SelectedPack = {
  consumerPaymentPack?: ConsumerPaymentPack<PaymentPack> | null;
  paymentPackCombo?: PaymentCombo | null;
  paymentPack?: PaymentPack | null;
};

export type OfferConstraint = {
  credit: number;
  minDate?: string;
  maxDate?: string;
};
