import { DateTime } from 'luxon';

import type { AnalyticsBasket } from '#src/libs/checkout/types';
import type {
  AnalyticsInterractWithLoginPayload,
  AnalyticsLeadAcquisitionPayload,
  BookingSuccess,
  CartItem,
  GTMInteractWithBasketItemPayload,
  GTMPayload,
  MetaPixelInteractWithBasketItemPayload,
  MetaPixelPayload,
  SessionFullPayload,
  SessionItem,
  SessionPayload,
} from './types';
import type { Offer_FULL } from '#src/libs/offer/types';
import type { Contract } from '#src/libs/subscription/types';
import {
  getItemPrice,
  getCurrencyCode,
  itemTypeList,
  getItemType,
  getItemId,
  getSessionCoachId,
  getSessionMetaActivityId,
  getItemQuantity,
} from './utils';
import { getItemInStorage } from '#src/utils/storage';
import { META_PIXEL_ID_STORAGE_KEY } from './constants';

const analyticsUtils = {
  trackGTM: (eventName: string, payload?: GTMPayload) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        data: payload || {},
      });
    }
  },

  /**
   *
   * @param eventName The name of the event we want to send to Meta Pixel
   * @param payload The data bring by this event
   * This function is now using trackSingle because this is the only way we have to send events to precise studios
   * We are retrieveing the meta pixel id here as the analytics sender function are not in a react component
   * (cannot put this function in a hook as some component using it are still react classes)
   * so the meta pixel id is set in the session storage when building the Analytics component
   */
  trackMetaPixel: (eventName: string, payload?: MetaPixelPayload) => {
    const metaPixelId = getItemInStorage('session', META_PIXEL_ID_STORAGE_KEY);
    if (
      metaPixelId &&
      metaPixelId !== 'undefined' &&
      typeof window?.fbq === 'function'
    ) {
      window.fbq('trackSingle', metaPixelId, eventName, payload || {});
    }
  },

  // Ecommerce events

  viewBuyableItem: (item: CartItem) => {
    const itemPrice = getItemPrice(item);
    const itemType = getItemType(item);
    const itemId = getItemId(item).toString();

    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: itemId,
          item_name: item.name,
          price: itemPrice,
          item_category: itemType,
        },
      ],
      currency: getCurrencyCode(),
      value: itemPrice,
    };
    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: itemPrice,
      currency: getCurrencyCode(),
      contents: [
        {
          id: itemId,
          name: item.name,
          quantity: 1,
          price: itemPrice,
          category: itemType,
        },
      ],
    };
    analyticsUtils.trackGTM('view_item', gtmPayload);
    analyticsUtils.trackMetaPixel('ViewItem', metaPixelPayload);
  },

  addItemToCart: (item: CartItem) => {
    const itemPrice = getItemPrice(item);
    const itemType = getItemType(item);
    const itemId = getItemId(item).toString();

    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: itemId,
          item_name: item.name,
          price: itemPrice,
          item_category: itemType,
        },
      ],
      currency: getCurrencyCode(),
      value: itemPrice,
    };
    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: itemPrice,
      currency: getCurrencyCode(),
      contents: [
        {
          id: itemId,
          name: item.name,
          quantity: 1,
          price: itemPrice,
          category: itemType,
        },
      ],
    };
    analyticsUtils.trackGTM('add_to_cart', gtmPayload);
    analyticsUtils.trackMetaPixel('AddToCart', metaPixelPayload);
  },

  removeItemFromCart: (item: CartItem) => {
    const itemType = getItemType(item);
    const itemId = getItemId(item).toString();
    const itemQuantity = getItemQuantity(item);
    const itemPrice = getItemPrice(item) * itemQuantity;

    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: itemId,
          item_name: item.name,
          price: itemPrice,
          item_category: itemType,
          quantity: itemQuantity,
        },
      ],
      currency: getCurrencyCode(),
      value: itemPrice,
    };
    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: itemPrice,
      currency: getCurrencyCode(),
      contents: [
        {
          id: itemId,
          name: item.name,
          quantity: itemQuantity,
          category: itemType,
          price: itemPrice,
        },
      ],
    };
    analyticsUtils.trackGTM('remove_from_cart', gtmPayload);
    analyticsUtils.trackMetaPixel('RemoveFromCart', metaPixelPayload);
  },

  viewCart: (payload: AnalyticsBasket) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: payload.checkout_items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        item_category: itemTypeList[item.buyable_item_identifier],
      })),
      memberId: payload.member,
      currency: getCurrencyCode(),
      value: payload.total_price_cts / 100,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.total_price_cts / 100,
      currency: getCurrencyCode(),
      memberId: payload.member,
      contents: payload.checkout_items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        category: itemTypeList[item.buyable_item_identifier],
      })),
    };

    analyticsUtils.trackGTM('view_cart', gtmPayload);
    analyticsUtils.trackMetaPixel('ViewCart', metaPixelPayload);
  },

  beginCheckout: (payload: AnalyticsBasket) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: payload.checkout_items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        item_category: itemTypeList[item.buyable_item_identifier],
      })),
      memberId: payload.member,
      currency: getCurrencyCode(),
      value: payload.total_price_cts / 100,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.total_price_cts / 100,
      currency: getCurrencyCode(),
      memberId: payload.member,
      contents: payload.checkout_items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        category: itemTypeList[item.buyable_item_identifier],
      })),
    };

    analyticsUtils.trackGTM('begin_checkout', gtmPayload);
    analyticsUtils.trackMetaPixel('InitiateCheckout', metaPixelPayload);
  },

  onPaymentSuccess: (payload: AnalyticsBasket) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: payload.checkout_items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        item_category: itemTypeList[item.buyable_item_identifier],
      })),
      memberId: payload.member,
      basketId: payload.id,
      currency: getCurrencyCode(),
      value: payload.total_price_cts / 100,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.total_price_cts / 100,
      currency: getCurrencyCode(),
      memberId: payload.member,
      basketId: payload.id,
      contents: payload.checkout_items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        category: itemTypeList[item.buyable_item_identifier],
      })),
    };

    analyticsUtils.trackGTM('purchase', gtmPayload);
    analyticsUtils.trackMetaPixel('Purchase', metaPixelPayload);
  },

  // Workshop - Session events

  onSessionShow: (session: SessionItem) => {
    const coachId = getSessionCoachId(session);
    const metaActivityId = getSessionMetaActivityId(session);
    const establishmentId = getSessionMetaActivityId(session);

    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    analyticsUtils.trackGTM('bsport:calendar:session-show', gtmPayload);
    analyticsUtils.trackMetaPixel('BsportSessionShow', metaPixelPayload);
  },

  onGoToSessionBooking: (session: SessionItem) => {
    const coachId = getSessionCoachId(session);
    const metaActivityId = getSessionMetaActivityId(session);
    const establishmentId = getSessionMetaActivityId(session);

    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    analyticsUtils.trackGTM('bsport:session:go-to-booking', gtmPayload);
    analyticsUtils.trackMetaPixel('BsportGoToBooking', metaPixelPayload);
  },

  onShowWorkshopBooking: (session: SessionItem) => {
    if (!session) return;
    const coachId = getSessionCoachId(session);
    const metaActivityId = getSessionMetaActivityId(session);
    const establishmentId = getSessionMetaActivityId(session);

    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    analyticsUtils.trackGTM('bsport:workshop:show', gtmPayload);
    analyticsUtils.trackMetaPixel('BsportWorkshopShow', metaPixelPayload);
  },

  onGoToWorkshopBooking: (session: SessionItem) => {
    const coachId = getSessionCoachId(session);
    const metaActivityId = getSessionMetaActivityId(session);
    const establishmentId = getSessionMetaActivityId(session);

    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      metaActivityId: metaActivityId,
      sessionId: session.id,
    };

    analyticsUtils.trackGTM('bsport:workshop:go-to-booking', gtmPayload);
    analyticsUtils.trackMetaPixel(
      'BsportWorkshopGoToBooking',
      metaPixelPayload,
    );
  },

  onAddSessionToBookingList: (payload: Offer_FULL) => {
    const analyticsPayload: SessionFullPayload = {
      sessionId: payload.id,
      metaActivityName: payload.meta_activity.name,
      establishmentName: payload.establishment.title,
      coach: payload.coach.name,
      date: payload.date_start,
    };
    analyticsUtils.trackGTM('bsport:booking:add-session', analyticsPayload);
    analyticsUtils.trackMetaPixel('BsportBookingAddSession', analyticsPayload);
  },

  onRemoveSessionFromBookingList: (payload: Offer_FULL) => {
    const analyticsPayload: SessionFullPayload = {
      sessionId: payload.id,
      metaActivityName: payload.meta_activity.name,
      establishmentName: payload.establishment.title,
      coach: payload.coach.name,
      date: payload.date_start,
    };
    analyticsUtils.trackGTM('bsport:booking:remove-session', analyticsPayload);
    analyticsUtils.trackMetaPixel(
      'BsportBookingRemoveSession',
      analyticsPayload,
    );
  },

  onSessionBookingSuccess: (payload: BookingSuccess) => {
    analyticsUtils.trackGTM('bsport:booking:success', payload);
    analyticsUtils.trackMetaPixel('BsportBookingSuccess', payload);
  },

  // Contract events
  onBeginContractPayment: (payload: Contract) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          item_category: 'subscription',
          quantity: 1,
          price: parseInt(payload.recurrent_price),
        },
      ],
      currency: getCurrencyCode(),
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: parseInt(payload.recurrent_price),
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id.toString(),
          name: payload.name,
          quantity: 1,
          category: 'subscription',
          price: parseInt(payload.recurrent_price),
        },
      ],
    };

    analyticsUtils.trackGTM('begin_checkout', gtmPayload);
    analyticsUtils.trackMetaPixel('InitiateCheckout', metaPixelPayload);
  },

  onContractPaymentSuccess: (payload: Contract) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          item_category: 'subscription',
          quantity: 1,
          price: parseInt(payload.recurrent_price),
        },
      ],
      currency: getCurrencyCode(),
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: parseInt(payload.recurrent_price),
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id.toString(),
          name: payload.name,
          quantity: 1,
          category: 'subscription',
          price: parseInt(payload.recurrent_price),
        },
      ],
    };

    analyticsUtils.trackGTM('purchase', gtmPayload);
    analyticsUtils.trackMetaPixel('Purchase', metaPixelPayload);
  },

  // Lead acquisition events

  onLeadAcquisitionSuccess: (payload: AnalyticsLeadAcquisitionPayload) => {
    const gtmPayload: AnalyticsLeadAcquisitionPayload = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
    };

    const metaPixelPayload: AnalyticsLeadAcquisitionPayload = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
    };
    analyticsUtils.trackGTM('bsport:lead-acquisition:success', gtmPayload);
    analyticsUtils.trackMetaPixel('LeadAcquisitionSuccess', metaPixelPayload);
  },

  // Signup - Signin events

  onShowSignup: () => {
    analyticsUtils.trackGTM('bsport:signup:show');
    analyticsUtils.trackMetaPixel('BsportSignupShow');
  },

  onShowSignin: () => {
    analyticsUtils.trackGTM('bsport:signin:show');
    analyticsUtils.trackMetaPixel('BsportSigninShow');
  },

  onSigninSuccess: (payload: { email: string }) => {
    const gtmPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
      method: 'Authentication',
    };

    const metaPixelPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
      method: 'Authentication',
    };
    analyticsUtils.trackGTM('login', gtmPayload);
    analyticsUtils.trackMetaPixel('Login', metaPixelPayload);
  },

  onSignupSuccess: (payload: { email: string }) => {
    const gtmPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
      method: 'Form',
    };

    const metaPixelPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
      method: 'Form',
    };
    analyticsUtils.trackGTM('sign_up', gtmPayload);
    analyticsUtils.trackMetaPixel('SignUp', metaPixelPayload);
  },
};

export default analyticsUtils;
