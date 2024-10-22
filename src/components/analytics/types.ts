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
  | SessionPayload;

export type MetaPixelPayload =
  | (CommonBasketPayload & {
      content_ids?: string[];
      content_name?: string;
      content_type?: string;
      content_category?: string;
      contents?: MetaPixelBasketItem[];
    })
  | AnalyticsInterractWithLoginPayload
  | SessionPayload;

interface CommonBasketPayload {
  currency?: string;
  value?: number;
  memberId?: number;
  basketId?: string;
}

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
}

export type SessionPayload = {
  date: string;
  coachId: number;
  establishmentId: number;
  activityId: number;
  sessionId?: number;
};

type SubscriptionMetadata = {
  flat_fee: number;
  duration: number;
  auto_renewal: boolean;
};

export type GTMSubscriptionPayload = GTMInteractWithBasketItemPayload & {
  metadata: SubscriptionMetadata;
};

export type GTMInteractWithBasketItemPayload = CommonBasketPayload & {
  items: GoogleTagManagerBasketItem[];
};

export type MetaPixelInteractWithBasketItemPayload = CommonBasketPayload & {
  contents: MetaPixelBasketItem[];
};

export type MetaPixelSubscriptionPayload =
  MetaPixelInteractWithBasketItemPayload & {
    metadata: SubscriptionMetadata;
  };

export type AnalyticsInterractWithLoginPayload = {
  email: string;
};

export type AnalyticsLeadAcquisitionPayload = {
  email: string;
  first_name: string;
  last_name: string;
};
