// @flow
import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import { getConsumerPacksWithPaymentPack } from '../consumer-payment-pack/selectors';

const _getData = (state: State) => state.booking.byId;

const _getMemberBookingId = (state: State) => state.booking.byMember.allIds;
const _getOfferBookingId = (state: State) => state.booking.byOffer.allIds;
const _getConsumerPackBookingId = (state: State) =>
  state.booking.byConsumerPack.allIds;

export const getMemberBookingList = createSelector(
  [_getData, _getMemberBookingId],
  (data, ids) => ids.map((id) => data[id]),
);
export const getConsumerPackBookingList = createSelector(
  [_getData, _getConsumerPackBookingId],
  (data, ids) => ids.map((id) => data[id]),
);

export const getOfferBookingList = createSelector(
  [_getData, _getOfferBookingId],
  (data, ids) => ids.map((id) => data[id]),
);

export const getMemberBookingListWithConsumerPack = createSelector(
  [getMemberBookingList, getConsumerPacksWithPaymentPack],
  (bookings, consumerPackList) =>
    bookings.map((b) => ({
      ...b,
      consumer_payment_pack: consumerPackList.find(
        (cpp) => cpp.id === b.consumer_payment_pack,
      ),
    })),
);

export const getConsumerPackBookingListWithConsumerPack = createSelector(
  [getConsumerPackBookingList, getConsumerPacksWithPaymentPack],
  (bookings, consumerPackList) =>
    bookings.map((b) => ({
      ...b,
      consumer_payment_pack: consumerPackList.find(
        (cpp) => cpp.id === b.consumer_payment_pack,
      ),
    })),
);

export const getMemberBookingWithConsumerPack = (state, id) => ({
  ..._getData(state)[id],
  consumer_payment_pack: getConsumerPacksWithPaymentPack(state).find(
    (cpp) => cpp.id === _getData(state)[id].consumer_payment_pack,
  ),
});

export const getOfferBookingListWithConsumerPack = createSelector(
  [getOfferBookingList, getConsumerPacksWithPaymentPack],
  (bookings, consumerPackList) =>
    bookings.map((b) => ({
      ...b,
      consumer_payment_pack: consumerPackList.find(
        (cpp) => cpp.id === b.consumer_payment_pack,
      ),
    })),
);
