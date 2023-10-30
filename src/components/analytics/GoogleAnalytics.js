import TagManager from 'react-gtm-module';
import moment from 'moment-timezone';
import { getCoachOrSubstitute } from '../../libs/offer/utils';

const storage = window.localStorage;
const currencyCode = (
  storage.getItem('bsport:payment:currency_code') || 'EUR'
).toUpperCase();

export default class GoogleAnalytics {
  static methods = [];

  // specs includes name of the variable and its description as a translation
  // example: [['name', gtm.func.name'], ['price', 'gtm.func.price']]
  static addMethod(name, key, func, specs) {
    this.methods.push({
      name,
      event: key,
      method: func,
      specs,
    });
  }

  static applyMethod(name, method_res) {
    (window.dataLayer || []).push(method_res);
  }

  static init(gtmId) {
    try {
      TagManager.initialize({
        gtmId,
      });
    } catch (err) {
      console.error(err);
    }
  }
}

GoogleAnalytics.addMethod(
  'showBasket',
  'bsport:basket:show',
  (basket) => ({
    event: 'bsport:basket:show',
    data: {
      totalPrice: basket.total_price,
      memberId: basket.member,
      basketId: basket.id,
      currency: basket.currency,
    },
  }),
  [
    ['totalPrice', 'gtm.showBasket.totalPrice'],
    ['memberId', 'gtm.showBasket.memberId'],
    ['basketId', 'gtm.showBasket.basketId'],
  ],
);

GoogleAnalytics.addMethod(
  'showPass',
  'bsport:pass:show',
  (pp) => ({
    event: 'bsport:pass:show',
    data: {
      id: pp.id,
      name: pp.name,
      price: pp.price,
      currency: currencyCode,
      type: 'payment_pack',
    },
  }),
  [
    ['id', 'gtm.showPass.id'],
    ['name', 'gtm.showPass.name'],
    ['price', 'gtm.showPass.price'],
    ['currency', 'currency'],
    ['type', 'gtm.showPass.type'],
  ],
);

GoogleAnalytics.addMethod(
  'addPassToCart',
  'bsport:basket:add-to-cart:pass',
  (pp, type) => ({
    event: 'bsport:basket:add-to-cart:pass',
    data: {
      id: pp.id,
      name: pp.name,
      price: pp.price,
      currency: currencyCode,
      type,
    },
  }),
  [
    ['id', 'gtm.addPass.id'],
    ['name', 'gtm.showPass.name'],
    ['price', 'gtm.showPass.price'],
    ['currency', 'currency'],
    ['type', 'gtm.showPass.type'],
  ],
);

GoogleAnalytics.addMethod(
  'addPackToCart',
  'bsport:basket:add-to-cart:pack',
  (pc) => ({
    event: 'bsport:basket:add-to-cart:pack',
    data: {
      id: pc.id,
      name: pc.name,
      price: pc.price,
      currency: currencyCode,
      type: 'payment_combo',
    },
  }),
  [
    ['id', 'gtm.addPack.id'],
    ['name', 'gtm.addPack.name'],
    ['price', 'gtm.addPack.price'],
    ['currency', 'currency'],
    ['type', 'gtm.addPack.type'],
  ],
);

GoogleAnalytics.addMethod(
  'addPrivatePassToCart',
  'bsport:basket:add-to-cart:private-pass',
  (pp) => ({
    event: 'bsport:basket:add-to-cart:private-pass',
    data: {
      id: pp.id,
      name: pp.name,
      price: pp.price,
      currency: currencyCode,
      type: 'private_pass',
    },
  }),
  [
    ['id', 'gtm.addPrivatePass.id'],
    ['name', 'gtm.addPrivatePass.name'],
    ['price', 'gtm.addPrivatePass.price'],
    ['currency', 'currency'],
    ['type', 'gtm.addPrivatePass.type'],
  ],
);

GoogleAnalytics.addMethod(
  'addShopItemToCart',
  'bsport:basket:add-to-cart:shop-item',
  (si) => ({
    event: 'bsport:basket:add-to-cart:shop-item',
    data: {
      id: si.id,
      name: si.name,
      price: si.price,
      currency: currencyCode,
      type: 'shop_item',
    },
  }),
  [
    ['id', 'gtm.addShopItem.id'],
    ['name', 'gtm.addShopItem.name'],
    ['price', 'gtm.addShopItem.price'],
    ['currency', 'currency'],
    ['type', 'gtm.addShopItem.type'],
  ],
);

GoogleAnalytics.addMethod(
  'paymentSuccess',
  'bsport:basket:payment-success',
  (basket) => ({
    event: 'bsport:basket:payment-success',
    data: {
      totalPrice: basket.total_price,
      memberId: basket.member,
      basketId: basket.id,
      checkout_items:
        basket.checkout_items?.map((ci) => ({
          buyable_item_id: ci.buyable_item_id,
          buyable_item_identifier: ci.buyable_item_identifier,
          name: ci.name,
          quantity: ci.quantity,
          unit_price: ci.unit_price,
        })) || [],
    },
  }),
  [
    ['totalPrice', 'gtm.paymentSuccess.totalPrice'],
    ['memberId', 'gtm.paymentSuccess.memberId'],
    ['basketId', 'gtm.paymentSuccess.basketId'],
    ['checkout_items.buyable_items_id', 'gtm.paymentSuccess.buyable_item_id'],
    [
      'checkout_items.buyable_item_identifier',
      'gtm.paymentSuccess.buyable_item_identifier',
    ],
    ['checkout_items.name', 'gtm.paymentSuccess.name'],
    ['checkout_items.quantity', 'gtm.paymentSuccess.quantity'],
    ['checkout_items.unit_price', 'gtm.paymentSuccess.unit_price'],
  ],
);

GoogleAnalytics.addMethod(
  'signupShow',
  'bsport:signup:show',
  () => ({
    event: 'bsport:signup:show',
  }),
  [],
);

GoogleAnalytics.addMethod(
  'signinShow',
  'bsport:signin:show',
  () => ({
    event: 'bsport:signin:show',
  }),
  [],
);

GoogleAnalytics.addMethod(
  'signupSuccess',
  'bsport:signup:success',
  (profile) => ({
    event: 'bsport:signup:success',
    data: {
      email: profile.email,
    },
  }),
  [['email', 'gtm.email']],
);

GoogleAnalytics.addMethod(
  'signinSuccess',
  'bsport:signin:success',
  (profile) => ({
    event: 'bsport:signin:success',
    data: {
      email: profile.email,
    },
  }),
  [['email', 'gtm.email']],
);

GoogleAnalytics.addMethod(
  'sessionShow',
  'bsport:calendar:session-show',
  (offer) => ({
    event: 'bsport:calendar:session-show',
    data: {
      name: offer.meta_activity.name,
      date: offer.date_start,
      coach: getCoachOrSubstitute(offer)?.name,
      establishment: offer.establishment.name,
      activity: offer.meta_activity.id,
    },
  }),
  [
    ['name', 'gtm.sessionShow.name'],
    ['date', 'gtm.paymentSuccess.date'],
    ['coach', 'gtm.paymentSuccess.coach'],
    ['establishment', 'gtm.paymentSuccess.establishment'],
    ['activity', 'gtm.paymentSuccess.activity'],
  ],
);

GoogleAnalytics.addMethod(
  'contractPaymentSuccess',
  'bsport:contract:payment-success',
  (contract) => ({
    event: 'bsport:contract:payment-success',
    data: {
      id: contract.id,
      name: contract.name,
      price: contract.recurrent_price,
      flatFee: contract.flat_fee,
      autoRenewal: contract.auto_renewal,
      duration: contract.nb_interval,
    },
  }),
  [
    ['id', 'gtm.contractPaymentSuccess.id'],
    ['name', 'gtm.contractPaymentSuccess.name'],
    ['price', 'gtm.contractPaymentSuccess.price'],
    ['currency', 'currency'],
    ['flatFee', 'gtm.contractPaymentSuccess.flatFee'],
    ['autoRenewal', 'gtm.contractPaymentSuccess.autoRenewal'],
    ['duration', 'gtm.contractPaymentSuccess.duration'],
  ],
);

GoogleAnalytics.addMethod(
  'contractShow',
  'bsport:contract:show',
  (c) => ({
    event: 'bsport:contract:show',
    data: {
      id: c.id,
      name: c.name,
      price: c.recurrent_price,
      flatFee: c.flat_fee,
      autoRenewal: c.auto_renewal,
      duration: c.nb_interval,
    },
  }),
  [
    ['id', 'gtm.contractShow.id'],
    ['name', 'gtm.contractShow.name'],
    ['price', 'gtm.contractShow.price'],
    ['currency', 'currency'],
    ['flatFee', 'gtm.contractShow.flatFee'],
    ['autoRenewal', 'gtm.contractShow.autoRenewal'],
    ['duration', 'gtm.contractShow.duration'],
  ],
);

GoogleAnalytics.addMethod(
  'contractPaymentShow',
  'bsport:contract:show-payment',
  (c) => ({
    event: 'bsport:contract:show-payment',
    data: {
      id: c.id,
      name: c.name,
      price: c.recurrent_price,
      flatFee: c.flat_fee,
      autoRenewal: c.auto_renewal,
      duration: c.nb_interval,
    },
  }),
  [
    ['id', 'gtm.contractPaymentShow.id'],
    ['name', 'gtm.contractPaymentShow.name'],
    ['price', 'gtm.contractPaymentShow.price'],
    ['currency', 'currency'],
    ['flatFee', 'gtm.contractPaymentShow.flatFee'],
    ['autoRenewal', 'gtm.contractPaymentShow.autoRenewal'],
    ['duration', 'gtm.contractPaymentShow.duration'],
  ],
);

GoogleAnalytics.addMethod(
  'workshopClick',
  'bsport:workshop-click',
  (offer) => ({
    event: 'bsport:workshop-click',
    data: {
      name: offer.meta_activity.name,
      date: offer.date_start,
      coach: offer.coach_override
        ? offer.coach_override.name
        : offer.coach.name,
      establishment: offer.establishment_override
        ? offer.establishment_override.title
        : offer.establishment.name,
      activity: offer.meta_activity.id,
    },
  }),
  [
    ['name', 'gtm.workshopClick.name'],
    ['date', 'gtm.workshopClick.date'],
    ['coach', 'gtm.workshopClick.coach'],
    ['establishment', 'gtm.workshopClick.establishment'],
    ['activity', 'gtm.workshopClick.activity'],
  ],
);

GoogleAnalytics.addMethod(
  'bookingSuccess',
  'bsport:booking:success',
  (offer) => ({
    event: 'bsport:booking:success',
    data: {
      sessionId: offer.id,
      activity: offer.meta_activity.name,
      sessionDate: moment(offer.date_start).format(),
      establishment: offer.establishment_override
        ? offer.establishment_override.title
        : offer.establishment.title,
      coach: offer.coach_override
        ? offer.coach_override.name
        : offer.coach.name,
    },
  }),
  [
    ['sessionId', 'gtm.bookingSuccess.sessionId'],
    ['activity', 'gtm.bookingSuccess.activity'],
    ['sessionDate', 'gtm.bookingSuccess.sessionDate'],
    ['establishment', 'gtm.bookingSuccess.establishment'],
    ['coach', 'gtm.bookingSuccess.coach'],
  ],
);
