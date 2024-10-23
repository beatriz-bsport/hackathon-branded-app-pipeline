import { DateTime } from 'luxon';

import type { Basket } from '#src/libs/checkout/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type {
  AnalyticsInterractWithLoginPayload,
  AnalyticsLeadAcquisitionPayload,
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
import type { Offer, OfferREST } from '#src/libs/offer/types';
import type { Contract } from '#src/libs/subscription/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import {
  getItemPrice,
  getCurrencyCode,
  itemTypeList,
  getItemType,
  getItemId,
  getSessionCoachId,
  getSessionMetaActivityId,
} from './utils';

const analyticsUtils = {
  trackGTM: (eventName: string, payload?: GTMPayload) => {
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

  showBasket: (payload: Basket) => {
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
    analyticsUtils.trackMetaPixel('showBasket', metaPixelPayload);
  },

  showPass: (payload: PaymentPack) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          price: payload.base_price,
          item_category: 'pass',
        },
      ],
      currency: getCurrencyCode(),
      value: payload.base_price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.base_price,
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id?.toString(),
          name: payload.name,
          quantity: 1,
          category: 'pass',
        },
      ],
    };

    analyticsUtils.trackGTM('bsport:pass:show', gtmPayload);
    analyticsUtils.trackMetaPixel('showPass', metaPixelPayload);
  },

  showPack: (payload: PaymentCombo) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          price: payload.price,
          item_category: 'pack',
        },
      ],
      currency: getCurrencyCode(),
      value: payload.price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.price,
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id?.toString(),
          name: payload.name,
          quantity: 1,
          category: 'pack',
        },
      ],
    };

    analyticsUtils.trackGTM('bsport:pack:show', gtmPayload);
    analyticsUtils.trackMetaPixel('showPack', metaPixelPayload);
  },

  showPrivatePass: (payload: PrivatePass) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          price: payload.price,
          item_category: 'appointment_pass',
        },
      ],
      currency: getCurrencyCode(),
      value: payload.price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.price,
      currency: getCurrencyCode(),
      contents: [
        {
          id: payload.id?.toString(),
          name: payload.name,
          quantity: 1,
          category: 'appointment_pass',
        },
      ],
    };

    analyticsUtils.trackGTM('bsport:appointment_pass:show', gtmPayload);
    analyticsUtils.trackMetaPixel('showAppointmentPass', metaPixelPayload);
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

  onWorkshopShow: (payload: Offer) => {
    const gtmPayload: SessionPayload = {
      date: DateTime.fromISO(payload.date_start).toISO(),
      coachId: payload.coach,
      establishmentId: payload.establishment,
      activityId: payload.meta_activity,
    };

    const metaPixelPayload: SessionPayload = {
      date: DateTime.fromISO(payload.date_start).toISO(),
      coachId: payload.coach,
      establishmentId: payload.establishment,
      activityId: payload.meta_activity,
    };

    analyticsUtils.trackGTM('bsport:workshop-click', gtmPayload);
    analyticsUtils.trackMetaPixel('workshopClick', metaPixelPayload);
  },

  onSessionBookingSuccess: (payload: OfferREST) => {
    const gtmPayload: SessionPayload = {
      sessionId: payload.id,
      date: DateTime.fromISO(payload.date_start).toISO(),
      coachId: payload.coach,
      establishmentId: payload.establishment,
      activityId: payload.meta_activity,
    };

    const metaPixelPayload: SessionPayload = {
      sessionId: payload.id,
      date: DateTime.fromISO(payload.date_start).toISO(),
      coachId: payload.coach,
      establishmentId: payload.establishment,
      activityId: payload.meta_activity,
    };

    analyticsUtils.trackGTM('bsport:booking:success', gtmPayload);
    analyticsUtils.trackMetaPixel('bookingSuccess', metaPixelPayload);
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
