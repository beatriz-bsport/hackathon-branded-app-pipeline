import type { Basket } from '#src/libs/checkout/types';
import type { OfferREST } from '#src/libs/offer/types';
import type { CartItem, OfferBookingValidation, SessionItem } from './types';
import { STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE } from '#src/libs/theme/constants';
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

export const itemTypeList = {
  [BUYABLE_ITEM_PASS.toString()]: 'pass',
  [BUYABLE_ITEM_SHOP_ITEM.toString()]: 'webshop_item',
  [BUYABLE_ITEM_PRIVATE_PASS.toString()]: 'appointment_pass',
  [BUYABLE_ITEM_FEE.toString()]: 'delivery_fee',
  [BUYABLE_ITEM_COMBO_ITEM.toString()]: 'pack',
  [BUYABLE_ITEM_GIFTCARD.toString()]: 'gift_card',
  [BUYABLE_ITEM_COUPON.toString()]: 'discount',
};

export const getCurrencyCode = () => {
  return (
    getItemInStorage('local', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE) || 'EUR'
  ).toUpperCase();
};

export const getSessionCoachId = (session: SessionItem) => {
  if (!session.coach) return 0;
  return typeof session.coach === 'number' ? session.coach : session.coach.id;
};

export const getSessionMetaActivityId = (session: SessionItem) => {
  if (!session.meta_activity) return 0;
  return typeof session.meta_activity === 'number'
    ? session.meta_activity
    : session.meta_activity.id;
};

export const getSessionEstablishmentId = (session: SessionItem) => {
  if (!session.establishment) return 0;
  return typeof session.establishment === 'number'
    ? session.establishment
    : session.establishment.id;
};

export const getItemPrice = (item: CartItem) => {
  if ('recurrent_price' in item)
    return typeof item.recurrent_price === 'string'
      ? parseFloat(item.recurrent_price)
      : item.recurrent_price;
  if ('unit_price' in item) return item.unit_price;
  if ('price' in item)
    return typeof item.price === 'number' ? item.price : parseFloat(item.price);
  return 0;
};

export const getItemId = (item: CartItem) => {
  if ('id' in item) return item.id;
  if ('buyable_item_id' in item) return item['buyable_item_id'];
  return 0;
};

export const getItemQuantity = (item: CartItem) => {
  if ('quantity' in item) return item.quantity;
  return 1;
};

const isPrivatePass = (item: CartItem) => {
  return 'private_services' in item;
};

const isPack = (item: CartItem) => {
  return 'payment_packs' in item && 'shop_items' in item;
};

const isPass = (item: CartItem) => {
  return 'linked_private_pass' in item;
};

const isShopItem = (item: CartItem) => {
  return 'is_standalone_item' in item;
};

const isContract = (item: CartItem) => {
  return 'auto_renewal' in item;
};

export const getItemType = (item: CartItem) => {
  /*
    check if it is of type CheckoutItem,
    I wanted to do a type guarding function like the one above
    but tsc was not happy with that so I did it this way
  */
  if ('buyable_item_identifier' in item)
    return itemTypeList[item.buyable_item_identifier];
  if (isContract(item)) return 'subscription';
  if (isPrivatePass(item)) return 'appointment_pass';
  if (isPack(item)) return 'pack';
  if (isPass(item)) return 'pass';
  if (isShopItem(item)) return 'shop_item';
  return 'none';
};

/**
 * This function is made to retrieve all the sessions that are linked to the items bought
 * during a purchase event on bsport It take the basket checkout items and also the basketOffers
 * and will check for each of them if they have any session data linked to them so that
 * we can know how many sessions have been booked during a single purchase process
 *
 * @param basket - The basket that was purcahsed during the checkout flow
 * @param basketOffers - An OfferREST array with the data of all the sessions booked linked
 *                       to passes bought during a checkout flow .
 * @returns - A OfferBookingValidation array containing the analytics data to send to Analytics
 *            integration when there is a new booking success with an Item bought
 */
export const getBookedSessionListDataFromBasket = (
  basket: Basket,
  basketOffers: OfferREST[],
): OfferBookingValidation[] => {
  const bookingSuccessData: OfferBookingValidation[] = [];

  basket.checkout_items.forEach((item) => {
    if (item.extra_data && Array.isArray(item.extra_data.offers_data)) {
      const offers = item.extra_data.offers_data;

      offers.forEach((offer) => {
        const offerData = basketOffers.find(
          (basketOffer) => basketOffer.id === offer.offer_id,
        );
        const mappedOffer: OfferBookingValidation = {
          id: offer.offer_id,
          isNewPass: true,
        };
        if (offerData) {
          mappedOffer.metaActivityId = getSessionMetaActivityId(offerData);
          mappedOffer.coachId = getSessionCoachId(offerData);
          mappedOffer.establishmentId = getSessionEstablishmentId(offerData);
          if (offerData.date_start) mappedOffer.date = offerData.date_start;
        }
        if (offer.extra_data?.spot_id)
          mappedOffer.spotId = offer.extra_data.spot_id;
        if (offer.extra_data?.spot_name)
          mappedOffer.spotName = offer.extra_data.spot_name;
        bookingSuccessData.push(mappedOffer);
      });
    }
  });
  return bookingSuccessData;
};
