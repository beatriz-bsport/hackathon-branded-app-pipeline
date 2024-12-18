import { ContractWithPaymentPack } from '#src/libs/subscription/types';
import type {
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  MIXED_ITEMS_BOOKING_FUNNEL_IDENTIFIER,
} from '#src/libs/marketplace/constants';
import type { ConsumerPaymentPack } from '../consumer-payment-pack/types';
import type { Offer_FULL, OfferREST } from '#src/libs/offer/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { PaymentPack, MaxoutData } from '#src/libs/payment-packs/types';

export type OfferData = {
  offer: Offer_FULL;
  extra_data: any;
};

export type MultipleOfferSelectedData = {
  offer: OfferREST | Offer_FULL;
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
  /**
   * When booking for a member, additional_guest_info is `{}`
   *
   * When booking for a guest, additional_guest_info is `AdditionalGuest[]`
   */
  additional_guest_info: AdditionalGuest[] | {};
  booking_for_invitee_only: boolean;
  booking_for_member: boolean;
}>;

export type BuyableItemIdentifier =
  | typeof PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER
  | typeof PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
  | typeof CONTRACT_BOOKING_FUNNEL_IDENTIFIER;

export type BuyableItemCategory = {
  index: number;
  id: string;
  identifier:
    | BuyableItemIdentifier
    | typeof MIXED_ITEMS_BOOKING_FUNNEL_IDENTIFIER;
  name: string;
  values:
    | Array<PaymentPack>
    | Array<PaymentCombo>
    | Array<ContractWithPaymentPack>
    | Array<RecommendedBuyableItem>;
};

export type BookerModuleBuyableItem =
  | PaymentPack
  | PaymentCombo
  | ContractWithPaymentPack;

export type BookerModuleBuyableItemWithMaxout = BookerModuleBuyableItem &
  MaxoutData;

export type BookerItem = {
  data:
    | ConsumerPaymentPack<PaymentPack>
    | PaymentPack
    | PaymentCombo
    | ContractWithPaymentPack;
  itemIdentifier:
    | BuyableItemIdentifier
    | typeof CONSUMER_PAYMENT_PACK_IDENTIFIER;
};

export type RecommendedBuyableItem = {
  identifier: BuyableItemIdentifier;
  value: BookerModuleBuyableItem;
};
