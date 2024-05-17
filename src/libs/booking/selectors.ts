import { createSelector } from 'reselect';
import memoize from 'memoize-one';
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
import { RootState } from '../../reducers';
import { getRoleStateById as getUsersById } from '../role/selectors';
import { StaffModificationHistory } from '#libs/role/types';

const _getData = (state: State) => state.booking.byId;

const _getMemberBookingId = (state: RootState) => state.booking.byMember.allIds;
const _getConsumerBookingIds = (state: RootState) =>
  state.booking.asConsumer.allIds;
const _getOfferBookingId = (state: RootState) => state.booking.byOffer.allIds;
const _getConsumerPackBookingId = (state: RootState) =>
  state.booking.byConsumerPack.allIds;

const getMemberBookingList = createSelector(
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
        // @ts-expect-error
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
        // @ts-expect-error
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
        // @ts-expect-error
        (cpp) => cpp.id === b.consumer_payment_pack,
      ),
    })),
);

// @ts-expect-error
export const getMemberBookingWithConsumerPack = (state, id) => ({
  ..._getData(state)[id],
  consumer_payment_pack: getConsumerPacksWithPaymentPack(state).find(
    (consumerPaymentPackItem) =>
      // @ts-expect-error
      consumerPaymentPackItem.id === _getData(state)[id]?.consumer_payment_pack,
  ),
});

export const withStaffModificationHistory = memoize((selector) =>
  createSelector([selector, getUsersById], (booking, staffDict) => {
    if (!booking) return booking;
    if (Array.isArray(booking)) {
      return booking.map((b) => ({
        ...b,
        staff_history: (b?.staff_history || []).map(
          (staffEvent: StaffModificationHistory) => ({
            ...staffEvent,
            staff: staffDict[staffEvent?.staff_id],
          }),
        ),
      }));
    }
    return {
      ...booking,
      staff_history: (booking.staff_history || []).map(
        (staffEvent: StaffModificationHistory) => ({
          ...staffEvent,
          staff: staffDict[staffEvent?.staff_id],
        }),
      ),
    };
  }),
);

export const getOfferBookingListWithConsumerPack = createSelector(
  [getOfferBookingList, getConsumerPacksWithPaymentPack],
  (bookings, consumerPackList) =>
    bookings.map((b) => ({
      ...b,
      consumer_payment_pack: consumerPackList.find(
        // @ts-expect-error
        (cpp) => cpp.id === b.consumer_payment_pack,
      ),
    })),
);

export const withOfferFull = memoize((selector) =>
  createSelector(
    [
      selector,
      withEstablishment(withMetaActivity(withCoach(getOfferDataList))),
    ],
    (bookingList, offerData) =>
      // @ts-expect-error
      bookingList.map((b) => ({
        ...b,
        // @ts-expect-error
        offer: offerData.find((o) => o.id === b.offer),
      })),
  ),
);

// @ts-expect-error
const _getRecurrenceRuleBookingData = (state) =>
  state.booking.recurrenceRule.byId;
// @ts-expect-error
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
      // @ts-expect-error
      .map((id) => data[id])
      // @ts-expect-error
      .map((rb) => ({
        ...rb,
        meta_activity: metaActivityData[rb.meta_activity],
        establishment: rb.establishment
          ? establishmentData[rb.establishment]
          : null,
        member: memberData[rb.member],
      })),
);

const _getIdsSimilar = (state: State) => state.booking.similar.allIds;

export const getSimilarBookingList = createSelector(
  [_getData, _getIdsSimilar],
  (data, ids) => ids.map((id) => data[id]),
);

export const getFutureBookingsByMemberCount = (
  state: State,
  memberId: number,
) => {
  // @ts-expect-error
  const futureBookingsByMember = state.booking.futureBookingsByMember.byId;
  return futureBookingsByMember[memberId]?.length ?? 0;
};

const __getOffersWithCancelledBookingsData = (state: State) =>
  // @ts-expect-error
  state.booking.recurrenceRule.offersWithCancelledBookings.byId;

export const getOffersIds = (state: State) =>
  // @ts-expect-error
  state.booking.recurrenceRule.offersWithCancelledBookings.allIds;

export const getOffersWithCancelledBookingsLoading = (state: State) =>
  // @ts-expect-error
  state.booking.recurrenceRule.offersWithCancelledBookings.loading;
export const getUpdateOffersToRetryLoading = (state: State) =>
  // @ts-expect-error
  state.booking.recurrenceRule.offersWithCancelledBookings.updateOffersToRetry
    .loading;
export const getOffersDataList = createSelector(
  [__getOffersWithCancelledBookingsData, getOffersIds],
  // @ts-expect-error
  (data, ids) => ids.map((id) => data[id]),
);
