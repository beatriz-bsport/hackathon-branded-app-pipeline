import type { ErrorAndLoading } from '#src/libs/types';
import { Member } from '#src/libs/member/types';

import type {
  Giftcard,
  ConsumerGiftcard,
  GiftcardBackgroundImage,
  GiftcardTemplate,
} from './models';

export type WithGiftcard<T> = T & { giftcard: Giftcard | null };
export type WithSender<T> = T & { src_member: Member | null };
export type WithReceiver<T> = T & { dst_member: Member | null };

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
    attributeByPrintableCode: {
      loading: boolean;
      error: Error | null;
    };
  };
  giftcardBackgroundImage: {
    byId: { [id: number]: GiftcardBackgroundImage };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
  };
  giftcardTemplate: {
    byId: { [id: number]: GiftcardTemplate };
    allIds: Array<number>;
    list: ErrorAndLoading;
    instances: ErrorAndLoading;
  } & ErrorAndLoading;
};
