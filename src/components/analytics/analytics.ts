import { DateTime } from 'luxon';
import { getItemInStorage } from '#src/utils/storage';

import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_GIFTCARD,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE } from '#src/libs/theme/constants';

import type { Basket } from '#src/libs/checkout/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type {
  AnalyticsInterractWithLoginPayload,
  AnalyticsLeadAcquisitionPayload,
  GTMInteractWithBasketItemPayload,
  GTMPayload,
  GTMSubscriptionPayload,
  MetaPixelInteractWithBasketItemPayload,
  MetaPixelPayload,
  MetaPixelSubscriptionPayload,
  SessionPayload,
} from './types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { Offer, OfferREST } from '#src/libs/offer/types';
import type { Contract } from '#src/libs/subscription/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';

const itemType = {
  [BUYABLE_ITEM_PASS.toString()]: 'pass',
  [BUYABLE_ITEM_SHOP_ITEM.toString()]: 'webshop_item',
  [BUYABLE_ITEM_PRIVATE_PASS.toString()]: 'appointment_pass',
  [BUYABLE_ITEM_FEE.toString()]: 'delivery_fee',
  [BUYABLE_ITEM_COMBO_ITEM.toString()]: 'pack',
  [BUYABLE_ITEM_GIFTCARD.toString()]: 'gift_card',
  [BUYABLE_ITEM_COUPON.toString()]: 'discount',
};

const currencyCode = (
  getItemInStorage('local', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE) || 'EUR'
).toUpperCase();

const analyticsUtils = {
  trackGTM: (eventName: string, payload?: GTMPayload) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        data: payload || {},
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
        item_category: itemType[item.buyable_item_identifier],
      })),
      memberId: payload.member,
      currency: currencyCode,
      value: payload.total_price_cts / 100,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.total_price_cts / 100,
      currency: currencyCode,
      memberId: payload.member,
      contents: payload.checkout_items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        category: itemType[item.buyable_item_identifier],
      })),
    };

    analyticsUtils.trackGTM('bsport:basket:show', gtmPayload);
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
      currency: currencyCode,
      value: payload.base_price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.base_price,
      currency: currencyCode,
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
      currency: currencyCode,
      value: payload.price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.price,
      currency: currencyCode,
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
      currency: currencyCode,
      value: payload.price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.price,
      currency: currencyCode,
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

  addPassToCart: (payload: PaymentPack) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          price: payload.base_price,
          item_category: 'pass',
        },
      ],
      currency: currencyCode,
      value: payload.base_price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.base_price,
      currency: currencyCode,
      contents: [
        {
          id: payload.id?.toString(),
          name: payload.name,
          quantity: 1,
          category: 'pass',
        },
      ],
    };

    analyticsUtils.trackGTM('bsport:basket:add-to-cart:pass', gtmPayload);
    analyticsUtils.trackMetaPixel('addPassToCart', metaPixelPayload);
  },

  addPackToCart: (payload: PaymentCombo) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          price: payload.price,
          item_category: 'pack',
        },
      ],
      currency: currencyCode,
      value: payload.price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.price,
      currency: currencyCode,
      contents: [
        {
          id: payload.id?.toString(),
          name: payload.name,
          quantity: 1,
          category: 'pack',
        },
      ],
    };

    analyticsUtils.trackGTM('bsport:basket:add-to-cart:pack', gtmPayload);
    analyticsUtils.trackMetaPixel('addPackToCart', metaPixelPayload);
  },

  addAppointmentPassToCart: (payload: PrivatePass) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          price: payload.price,
          item_category: 'appointment_pass',
        },
      ],
      currency: currencyCode,
      value: payload.price,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.price,
      currency: currencyCode,
      contents: [
        {
          id: payload.id?.toString(),
          name: payload.name,
          quantity: 1,
          category: 'appointment_pass',
        },
      ],
    };

    analyticsUtils.trackGTM(
      'bsport:basket:add-to-cart:private-pass',
      gtmPayload,
    );
    analyticsUtils.trackMetaPixel('addAppointmentPassToCart', metaPixelPayload);
  },

  addShopItemToCart: (payload: ShopItem) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: [
        {
          item_id: payload.id.toString(),
          item_name: payload.name,
          price: parseInt(payload.price),
          item_category: 'shop_item',
        },
      ],
      currency: currencyCode,
      value: parseInt(payload.price),
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: parseInt(payload.price),
      currency: currencyCode,
      contents: [
        {
          id: payload.id?.toString(),
          name: payload.name,
          quantity: 1,
          category: 'shop_item',
        },
      ],
    };

    analyticsUtils.trackGTM('bsport:basket:add-to-cart:shop-item', gtmPayload);
    analyticsUtils.trackMetaPixel('addShopItemToCart', metaPixelPayload);
  },

  onPaymentSuccess: (payload: Basket) => {
    const gtmPayload: GTMInteractWithBasketItemPayload = {
      items: payload.checkout_items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        item_category: itemType[item.buyable_item_identifier],
      })),
      memberId: payload.member,
      basketId: payload.id,
      currency: currencyCode,
      value: payload.total_price_cts / 100,
    };

    const metaPixelPayload: MetaPixelInteractWithBasketItemPayload = {
      value: payload.total_price_cts / 100,
      currency: currencyCode,
      memberId: payload.member,
      basketId: payload.id,
      contents: payload.checkout_items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        category: itemType[item.buyable_item_identifier],
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

  onSessionShow: (payload: OfferREST) => {
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

    analyticsUtils.trackGTM('bsport:calendar:session-show', gtmPayload);
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
      currency: currencyCode,
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelSubscriptionPayload = {
      value: parseInt(payload.recurrent_price),
      currency: currencyCode,
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
      currency: currencyCode,
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelSubscriptionPayload = {
      value: parseInt(payload.recurrent_price),
      currency: currencyCode,
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
      currency: currencyCode,
      value: parseInt(payload.recurrent_price),
    };

    const metaPixelPayload: MetaPixelSubscriptionPayload = {
      value: parseInt(payload.recurrent_price),
      currency: currencyCode,
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
