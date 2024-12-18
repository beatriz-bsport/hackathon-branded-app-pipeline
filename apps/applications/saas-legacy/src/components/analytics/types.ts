import type { CheckoutItem } from '#src/libs/checkout/types';
import type { Offer, Offer_FULL, OfferREST } from '#src/libs/offer/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { Contract } from '#src/libs/subscription/types';

declare global {
  interface Window {
    dataLayer: Object[] | null;
    fbq: any;
    isLoadedAnalytics: boolean | null;
  }
}

export type GTMPayload =
  | GTMInteractWithBasketItemPayload
  | AnalyticsInterractWithLoginPayload
  | AnalyticsLeadAcquisitionPayload
  | SessionPayload
  | SessionFullPayload
  | BookingSuccess;

export type MetaPixelPayload =
  | (CommonBasketPayload & {
      content_ids?: string[];
      content_name?: string;
      content_type?: string;
      content_category?: string;
      contents?: MetaPixelBasketItem[];
    })
  | AnalyticsInterractWithLoginPayload
  | AnalyticsLeadAcquisitionPayload
  | SessionPayload
  | SessionFullPayload
  | BookingSuccess;

interface CommonBasketPayload {
  currency: string;
  value: number;
  memberId?: number;
  basketId?: string;
}

export type CartItem =
  | ShopItem
  | PaymentPack
  | PaymentCombo
  | PrivatePass
  | CheckoutItem
  | Contract;

// Common item structure for GTM
interface GoogleTagManagerBasketItem {
  item_id: string;
  item_name: string;
  coupon?: string;
  discount?: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  quantity?: number;
  price?: number;
}

// Common item structure for Meta Pixel
interface MetaPixelBasketItem {
  id: string;
  name: string;
  quantity?: number;
  category?: string;
  price?: number;
}

export type SessionPayload = {
  date: string;
  coachId: number;
  establishmentId: number;
  metaActivityId: number;
  sessionId?: number;
};

export type SessionFullPayload = {
  date: string;
  coach: string;
  establishmentName: string;
  metaActivityName: string;
  sessionId?: number;
};

export type SessionItem = OfferREST | Offer_FULL | Offer;

export type BookingSuccess = {
  offersBooked: OfferBookingValidation[];
};

export type OfferBookingValidation = {
  id: number;
  spotId?: number;
  spotName?: string;
  isNewPass: boolean;
} & Partial<SessionPayload>;

export type GTMInteractWithBasketItemPayload = CommonBasketPayload & {
  items: GoogleTagManagerBasketItem[];
};

export type MetaPixelInteractWithBasketItemPayload = CommonBasketPayload & {
  contents: MetaPixelBasketItem[];
};

export type AnalyticsInterractWithLoginPayload = {
  email?: string;
  method: string;
};

export type AnalyticsLeadAcquisitionPayload = {
  email: string;
  first_name: string;
  last_name: string;
};
