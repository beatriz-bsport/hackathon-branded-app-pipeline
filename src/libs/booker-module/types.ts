import { ConsumerPaymentPack } from '../consumer-payment-pack/types';
import type { Offer_FULL } from '../offer/types';
import { PaymentCombo } from '../payment-combo/types';
import { PaymentPack, MaxoutData } from '../payment-packs/types';

export type OfferData = {
  offer: Offer_FULL;
  extra_data: any;
};

export type SelectedPack = {
  consumerPaymentPack?: (ConsumerPaymentPack<PaymentPack> & MaxoutData) | null;
  paymentPackCombo?: (PaymentCombo & MaxoutData) | null;
  paymentPack?: (PaymentPack & MaxoutData) | null;
};

export type OfferConstraint = {
  credit: number;
  minDate?: string;
  maxDate?: string;
};

export type AdditionalGuest = {
  first_name: string;
  last_name: string;
  email: string;
};

export type ExtraDataFromQueryParams = Array<{
  offer_id: number;
  spot_id?: number;
}>;
