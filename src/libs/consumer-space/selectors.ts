import { createSelector } from 'reselect';

import { RootState } from '../../reducers';

import { filterBookingListByOfferDate } from '#libs/booking/utils';

import {
  getOfferDataList,
  withEstablishment,
  withMetaActivity,
  withCoach,
  getOfferById,
} from '#libs/offer/selectors';
import { getMetaActivity } from '#libs/meta-activity/selectors';
import { getCoach } from '#libs/associated-coach/selectors';
import { getEstablishment } from '#libs/establishment/selectors';
import { getLevel } from '#libs/level/selectors';
import { getPaymentPack } from '#libs/payment-packs/selectors';
import { getConsumerPack } from '#libs/consumer-payment-pack/selectors';
import { getRoomBlueprint } from '#libs/spot-scheduling/selector';

import type {
  Booking,
  BookingREST,
  ConsumerBooking,
} from '#libs/booking/types';
import type { PrivateBooking } from '#libs/private-service/types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';

import { BookingFilterTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/constants';
import { BookingTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';

const getAllBookingAndPrivateBookingWithIds = (state: RootState) => {
  return state.consumer.bookingAndPrivateBooking.allObj;
};

export const getAllBookingAndPrivateBooking = (state: RootState) => {
  const bookingsAndPrivateBookings =
    getAllBookingAndPrivateBookingWithIds(state);

  const bookingById = state.consumer.bookingAndPrivateBooking.booking.byId;
  const privateBookingById =
    state.consumer.bookingAndPrivateBooking.privateBooking.byId;

  const offerData = withEstablishment(
    withMetaActivity(withCoach(getOfferDataList)),
  )(state);

  const all: {
    type: 'booking' | 'privateBooking';
    booking?: Booking;
    privateBooking?: PrivateBooking;
  }[] = [];

  bookingsAndPrivateBookings.forEach((item) => {
    if (item.type === 'booking' && item.booking) {
      if (bookingById[item.booking]) {
        all.push({
          type: 'booking',
          booking: {
            ...bookingById[item.booking],
            offer: offerData.find(
              (o: any) => o.id === bookingById[item.booking].offer,
            ),
          },
        });
      }
    }

    if (item.type === 'privateBooking' && item.privateBooking) {
      if (privateBookingById[item.privateBooking]) {
        all.push({
          type: 'privateBooking',
          privateBooking: privateBookingById[item.privateBooking],
        });
      }
    }
  });

  return all;
};

/*  REWORKED CONSUMER SPACE */

const _getConsumerBookingsList = createSelector(
  [
    (state: RootState) => state,
    (_, bookingsList: BookingREST[]) => bookingsList,
  ],
  (state, bookingsList) => {
    const bookings = (bookingsList || []).map((booking) => {
      const bookingOffer = getOfferById(state, booking?.offer);
      const metaActivity = getMetaActivity(state, booking?.meta_activity);
      const coach = getCoach(state, bookingOffer?.coach);
      const coachOverride = getCoach(state, bookingOffer?.coach_override);
      const establishment = getEstablishment(
        state,
        bookingOffer?.establishment,
      );
      const level = getLevel(state, bookingOffer?.level);
      const consumerPaymentPack: ConsumerPaymentPack = getConsumerPack(
        state,
        booking?.consumer_payment_pack,
      );
      const paymentPack: PaymentPack = getPaymentPack(
        state,
        consumerPaymentPack?.payment_pack,
      );
      return {
        ...booking,
        coach,
        coach_override: coachOverride,
        establishment,
        meta_activity: metaActivity,
        level,
        offer: bookingOffer,
        consumer_payment_pack: {
          ...consumerPaymentPack,
          payment_pack: paymentPack,
        },
        ...(bookingOffer?.room_blueprint && {
          room_blueprint: getRoomBlueprint(state, bookingOffer.room_blueprint),
        }),
      } as ConsumerBooking;
    });

    return bookings;
  },
);

export const getMyPastBookingsState = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.past;

const getMyPastBookingsAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.past.bookings.allIds;

const getMyPastBookingsById = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.past.bookings.byId;

export const getMyPastBookingsList = createSelector(
  [getMyPastBookingsAllIds, getMyPastBookingsById, (state: RootState) => state],
  (ids, data, state) => {
    const bookings = _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    );
    return filterBookingListByOfferDate(bookings, 'desc');
  },
);

export const getMyFutureBookingsState = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.future;

const getMyFutureBookingsAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.future.bookings.allIds;

const getMyFutureBookingsById = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.future.bookings.byId;

export const getMyFutureBookingsList = createSelector(
  [
    getMyFutureBookingsAllIds,
    getMyFutureBookingsById,
    (state: RootState) => state,
  ],
  (ids, data, state) => {
    const bookings = _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    );
    return filterBookingListByOfferDate(bookings, 'asc');
  },
);

export const getMyPastBookingsWorkshopState = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.past;

export const getMyPastBookingsWorkshopAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.past.bookings.allIds;

export const getMyPastBookingsWorkshopById = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.past.bookings.byId;

export const getMyPastBookingsWorkshopList = createSelector(
  [
    getMyPastBookingsWorkshopAllIds,
    getMyPastBookingsWorkshopById,
    (state: RootState) => state,
  ],
  (ids, data, state) => {
    const bookings = _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    );
    return filterBookingListByOfferDate(bookings, 'desc');
  },
);

export const getMyFutureBookingsWorkshopState = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.future;

export const getMyFutureBookingsWorkshopAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.future.bookings.allIds;

export const getMyFutureBookingsWorkshopById = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.future.bookings.byId;

export const getMyFutureBookingsWorkshopList = createSelector(
  [
    getMyFutureBookingsWorkshopAllIds,
    getMyFutureBookingsWorkshopById,
    (state: RootState) => state,
  ],
  (ids, data, state) => {
    const bookings = _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    );
    return filterBookingListByOfferDate(bookings, 'asc');
  },
);

export const getRelatedConsumerBookingsInGroup = createSelector(
  [
    getMyPastBookingsWorkshopList,
    getMyFutureBookingsWorkshopList,
    (_, groupId: number) => groupId,
    (_, __, filterTab: BookingFilterTab) => filterTab,
  ],
  (
    pastBookingsWorkshopList,
    futureBookingsWorkshopList,
    groupId,
    filterTab,
  ) => {
    if (!groupId || !filterTab) return null;
    const bookingsMap = {
      [BookingFilterTabEnum.PAST]: pastBookingsWorkshopList,
      [BookingFilterTabEnum.FUTURE]: futureBookingsWorkshopList,
    };
    const bookings = bookingsMap[filterTab];
    return bookings.filter((booking) => booking.offer?.group === groupId);
  },
);

export const getConsumerBookingsLoading = createSelector(
  [
    getMyPastBookingsState,
    getMyFutureBookingsState,
    getMyPastBookingsWorkshopState,
    getMyFutureBookingsWorkshopState,
    (state: RootState) => state,
    (_: RootState, selectedTab: BookingTab) => selectedTab,
  ],
  (
    pastBookingsState,
    futureBookingsState,
    pastBookingsWorkshopState,
    futureBookingsWorkshopState,
    state,
    selectedTab,
  ) => {
    const bookingsLoadingMap = {
      [BookingTabEnum.ACTIVITY]:
        pastBookingsState.loading ||
        futureBookingsState.loading ||
        state.level.loading ||
        state.metaActivity.loading ||
        state.consumerPaymentPack.loading ||
        state.paymentPack.loading,
      [BookingTabEnum.WORKSHOP]:
        pastBookingsWorkshopState.loading ||
        futureBookingsWorkshopState.loading ||
        state.level.loading ||
        state.metaActivity.loading ||
        state.consumerPaymentPack.loading ||
        state.paymentPack.loading,
    };

    return (state.coach.loading ||
      state.establishment.loading ||
      bookingsLoadingMap[selectedTab]) as boolean; // Payment pack state not typed
  },
);
