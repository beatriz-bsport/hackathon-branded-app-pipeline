// @flow
import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import type { State } from '../../state/types';
import { getConsumerPacksWithPaymentPack } from '../consumer-payment-pack/selectors';
import {
  getOfferDataList,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../offer/selectors';
import { getMemberListData } from '../member/selectors';
import { getMetaActivityAbstractDict as getMetaActivityData } from '../meta-activity/selectors';
import { getAllEstablishmentsDict as getEstablishmentData } from '../establishment/selectors';

const _getData = (state: State) => state.booking.byId;

const _getMemberBookingId = (state: State) => state.booking.byMember.allIds;
const _getConsumerBookingIds = (state: State) =>
  state.booking.asConsumer.allIds;
const _getOfferBookingId = (state: State) => state.booking.byOffer.allIds;
const _getConsumerPackBookingId = (state: State) =>
  state.booking.byConsumerPack.allIds;
const _getConsumerDashboardId = (state: State) =>
  state.booking.consumerDashboard.allIds;
const _getNotificationsIds = (state: State) =>
  state.booking.notification.allIds;
const _getNotifications = (state: State) =>
  state.booking.notification.itemsById;

export const getMemberBookingList = createSelector(
  [_getData, _getMemberBookingId],
  (data, ids) => ids.map((id) => data[id]),
);
export const getConsumerBookingList = createSelector(
  [_getData, _getConsumerBookingIds],
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

export const getConsumerBookingListWithConsumerPack = createSelector(
  [getConsumerBookingList, getConsumerPacksWithPaymentPack],
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

export const getConsumerDasboardBookingList = createSelector(
  [_getData, _getConsumerDashboardId],
  (data, ids) =>
    ids
      .map((id) => data[id])
      .filter((b) => b.booking_status_code === BOOKING_STATUS_OK.id),
);

export const withOfferFull = memoize((selector) =>
  createSelector(
    [
      selector,
      withEstablishment(withMetaActivity(withCoach(getOfferDataList))),
    ],
    (bookingList, offerData) =>
      bookingList.map((b) => ({
        ...b,
        offer: offerData.find((o) => o.id === b.offer),
      })),
  ),
);

export const getFirstTimeNotifications = createSelector(
  [_getNotifications, _getNotificationsIds],
  (data, ids) => ids.map((id) => data[id]).filter((n) => !!n),
);

export const withBookingNotifications = memoize((selector) =>
  createSelector([selector, _getNotifications], (data, notificationList) =>
    data
      .filter((d) => !!d)
      .map((d) => ({
        ...d,
        on_booking_notification: (d.on_booking_notification || []).map(
          (notifId) => notificationList[notifId],
        ),
      })),
  ),
);

const _getRecurrenceRuleBookingData = (state) =>
  state.booking.recurrenceRule.byId;
const _getRecurrenceRuleBookingListIds = (state) =>
  state.booking.recurrenceRule.allIds;

export const getRecurrenceRuleBookingList = createSelector(
  [
    _getRecurrenceRuleBookingListIds,
    _getRecurrenceRuleBookingData,
    getMemberListData,
    getMetaActivityData,
    getEstablishmentData,
  ],
  (ids, data, memberData, metaActivityData, establishmentData) =>
    ids
      .map((id) => data[id])
      .map((rb) => ({
        ...rb,
        meta_activity: metaActivityData[rb.meta_activity],
        establishment: rb.establishment
          ? establishmentData[rb.establishment]
          : null,
        member: memberData[rb.member],
      })),
);
