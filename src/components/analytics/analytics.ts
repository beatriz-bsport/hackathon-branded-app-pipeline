import { DateTime } from 'luxon';

import type { Basket } from '#src/libs/checkout/types';
import type {
  AnalyticsInterractWithLoginPayload,
  AnalyticsLeadAcquisitionPayload,
  BookingSuccess,
  CartItem,
  GTMInteractWithBasketItemPayload,
  GTMPayload,
  GTMSubscriptionPayload,
  MetaPixelInteractWithBasketItemPayload,
  MetaPixelPayload,
  MetaPixelSubscriptionPayload,
  SessionItem,
  SessionPayload,
} from './types';
import type { PrivatePass } from '#src/libs/private-service/types';
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

const analyticsUtils = {
  trackGTM: (eventName: string, payload?: GTMPayload) => {
    console.log('event name : ', eventName);
    console.log('payload: ', payload);
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...(payload || {}),
      });
    }
  },

  trackMetaPixel: (eventName: string, payload?: MetaPixelPayload) => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', eventName, payload || {});
    }
  },

  viewCart: (payload: Basket) => {
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
        category: itemTypeList[item.buyable_item_identifier],
      })),
    };

    analyticsUtils.trackGTM('view_cart', gtmPayload);
    analyticsUtils.trackMetaPixel('viewCart', metaPixelPayload);
  },

  beginCheckout: (payload: Basket) => {
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
        category: itemTypeList[item.buyable_item_identifier],
      })),
    };

    analyticsUtils.trackGTM('begin_checkout', gtmPayload);
    analyticsUtils.trackMetaPixel('beginCheckout', metaPixelPayload);
  },

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
          category: itemType,
        },
      ],
    };
    analyticsUtils.trackGTM('view_item', gtmPayload);
    analyticsUtils.trackMetaPixel('viewItem', metaPixelPayload);
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
          category: itemType,
        },
      ],
    };
    analyticsUtils.trackGTM('add_to_cart', gtmPayload);
    analyticsUtils.trackMetaPixel('addToCart', metaPixelPayload);
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
        },
      ],
    };
    analyticsUtils.trackGTM('remove_from_cart', gtmPayload);
    analyticsUtils.trackMetaPixel('removeFromCart', metaPixelPayload);
  },

  onPaymentSuccess: (payload: Basket) => {
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
        category: itemTypeList[item.buyable_item_identifier],
      })),
    };

    analyticsUtils.trackGTM('bsport:basket:payment-success', gtmPayload);
    analyticsUtils.trackMetaPixel('paymentSuccess', metaPixelPayload);
  },

  onShowSignup: () => {
    analyticsUtils.trackGTM('bsport:signup:show');
    analyticsUtils.trackMetaPixel('signupShow');
  },

  onShowSignin: () => {
    analyticsUtils.trackGTM('bsport:signin:show');
    analyticsUtils.trackMetaPixel('signinShow');
  },

  onSigninSuccess: (payload: { email: string }) => {
    const gtmPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
    };

    const metaPixelPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
    };
    analyticsUtils.trackGTM('bsport:signin:success', gtmPayload);
    analyticsUtils.trackMetaPixel('signinSuccess', metaPixelPayload);
  },

  onSignupSuccess: (payload: { email: string }) => {
    const gtmPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
    };

    const metaPixelPayload: AnalyticsInterractWithLoginPayload = {
      email: payload.email,
    };
    analyticsUtils.trackGTM('bsport:signup:success', gtmPayload);
    analyticsUtils.trackMetaPixel('signupSuccess', metaPixelPayload);
  },

  onSessionShow: (session: SessionItem) => {
    const coachId = getSessionCoachId(session);
    const metaActivityId = getSessionMetaActivityId(session);
    const establishmentId = getSessionMetaActivityId(session);

    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      activityId: metaActivityId,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      activityId: metaActivityId,
    };

    analyticsUtils.trackGTM('bsport:calendar:session-show', gtmPayload);
    analyticsUtils.trackMetaPixel('sessionShow', metaPixelPayload);
  },

  onGoToSessionBooking: (session: SessionItem) => {
    const coachId = getSessionCoachId(session);
    const metaActivityId = getSessionMetaActivityId(session);
    const establishmentId = getSessionMetaActivityId(session);

    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      activityId: metaActivityId,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      activityId: metaActivityId,
    };

    analyticsUtils.trackGTM('bsport:session:go-to-booking', gtmPayload);
    analyticsUtils.trackMetaPixel('sessionShow', metaPixelPayload);
  },

  onContractPaymentSuccess: (payload: Contract) => {
    const gtmPayload: GTMSubscriptionPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          item_category: 'subscription',
          quantity: 1,
          price: parseInt(payload.recurrent_price),
        },
      ],
      metadata: {
        flat_fee: parseInt(payload.flat_fee),
        auto_renewal: payload.auto_renewal,
        duration: payload.nb_interval,
      },
      currency: getCurrencyCode(),
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelSubscriptionPayload = {
      value: parseInt(payload.recurrent_price),
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id.toString(),
          name: payload.name,
          quantity: 1,
          category: 'subscription',
        },
      ],
      metadata: {
        flat_fee: parseInt(payload.flat_fee),
        auto_renewal: payload.auto_renewal,
        duration: payload.nb_interval,
      },
    };

    analyticsUtils.trackGTM('bsport:contract:payment-success', gtmPayload);
    analyticsUtils.trackMetaPixel('contractPaymentSuccess', metaPixelPayload);
  },

  onShowContract: (payload: Contract) => {
    const gtmPayload: GTMSubscriptionPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          item_category: 'subscription',
          quantity: 1,
          price: parseInt(payload.recurrent_price),
        },
      ],
      metadata: {
        flat_fee: parseInt(payload.flat_fee),
        auto_renewal: payload.auto_renewal,
        duration: payload.nb_interval,
      },
      currency: getCurrencyCode(),
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelSubscriptionPayload = {
      value: parseInt(payload.recurrent_price),
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id.toString(),
          name: payload.name,
          quantity: 1,
          category: 'subscription',
        },
      ],
      metadata: {
        flat_fee: parseInt(payload.flat_fee),
        auto_renewal: payload.auto_renewal,
        duration: payload.nb_interval,
      },
    };

    analyticsUtils.trackGTM('bsport:contract:show', gtmPayload);
    analyticsUtils.trackMetaPixel('contractShow', metaPixelPayload);
  },

  onShowContractPayment: (payload: Contract) => {
    const gtmPayload: GTMSubscriptionPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          item_category: 'subscription',
          quantity: 1,
          price: parseInt(payload.recurrent_price),
        },
      ],
      metadata: {
        flat_fee: parseInt(payload.flat_fee),
        auto_renewal: payload.auto_renewal,
        duration: payload.nb_interval,
      },
      currency: getCurrencyCode(),
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelSubscriptionPayload = {
      value: parseInt(payload.recurrent_price),
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id.toString(),
          name: payload.name,
          quantity: 1,
          category: 'subscription',
        },
      ],
      metadata: {
        flat_fee: parseInt(payload.flat_fee),
        auto_renewal: payload.auto_renewal,
        duration: payload.nb_interval,
      },
    };

    analyticsUtils.trackGTM('bsport:contract:show-payment', gtmPayload);
    analyticsUtils.trackMetaPixel('contractPaymentShow', metaPixelPayload);
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
      activityId: metaActivityId,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      activityId: metaActivityId,
    };

    analyticsUtils.trackGTM('bsport:workshop:show', gtmPayload);
    analyticsUtils.trackMetaPixel('workshopShow', metaPixelPayload);
  },

  onGoToWorkshopBooking: (session: SessionItem) => {
    const coachId = getSessionCoachId(session);
    const metaActivityId = getSessionMetaActivityId(session);
    const establishmentId = getSessionMetaActivityId(session);

    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      activityId: metaActivityId,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(session.date_start).toISO(),
      coachId: coachId,
      establishmentId: establishmentId,
      activityId: metaActivityId,
    };

    analyticsUtils.trackGTM('bsport:workshop:go-to-booking', gtmPayload);
    analyticsUtils.trackMetaPixel('workshopGoToBooking', metaPixelPayload);
  },

  onSessionBookingSuccess: (payload: BookingSuccess) => {
    analyticsUtils.trackGTM('bsport:booking:success', payload);
    analyticsUtils.trackMetaPixel('bookingSuccess', payload);
  },

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
    analyticsUtils.trackMetaPixel('leadAcquisitionSuccess', metaPixelPayload);
  },
};

export default analyticsUtils;
