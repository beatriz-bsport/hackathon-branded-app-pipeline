import { Member } from '../member/types';

export type Giftcard = {
  id: number;
  name: string;
  description: string;
  cover: string;
  cover_thumbnail: string;
  expiration_days: number | null;
  price: string; // sent as decimal from backend, thus as a string: "4.54" to avoid round error
  available_payment_method_identifiers: Array<number>; // check bsport-commons payment-methods.ts
  manager_only: boolean;
  disabled: boolean;
  company: number;
  amount_gifted: string; // decimal price
};

export type GiftcardRecipient = {
  date_created: string;
  email_sent_to: string;
  consumer_giftcard: number;
  id: number;
};

export type ConsumerGiftcardPersonnalizationElements = {
  name: string;
  message_is_from: string;
  message_is_for: string;
  message_content: string;
  background_image: string | null;
};

export type GiftcardBackgroundImage = {
  id: number;
  image: string; // url
};

export type ConsumerGiftcard = ConsumerGiftcardPersonnalizationElements & {
  id: number;
  src_member: number;
  dst_member: number | null;
  giftcard: number;
  date_created: string;
  date_activated: string | null;
  active: boolean;
  planned_date_send: string;
  invitation_sent: boolean;
  consumed_amount_gifted: string; // decimal price
  giftcard_recipients: Array<GiftcardRecipient>;
};

export type GiftcardState = {
  giftcard: {
    byId: { [id: number]: Giftcard };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
  };
  consumerGiftcard: {
    byId: { [id: number]: ConsumerGiftcard };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
    page: number;
    count: number;
    asReceiver: {
      allIds: Array<number>;
      loading: boolean;
      error: Error | null;
      page: number;
      count: number;
    };
    asSender: {
      allIds: Array<number>;
      loading: boolean;
      error: Error | null;
      page: number;
      count: number;
    };
  };
  giftcardBackgroundImage: {
    byId: { [id: number]: GiftcardBackgroundImage };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
  };
};

export type WithGiftcard<T> = T & { giftcard: Giftcard | null };
export type WithSender<T> = T & { src_member: Member | null };
export type WithReceiver<T> = T & { dst_member: Member | null };
