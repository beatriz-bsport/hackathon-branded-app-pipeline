import { createSelector } from 'reselect';

import type { RootState } from '#src/reducers';

import {
  getOfferDataList,
  withEstablishment,
  withMetaActivity,
  withCoach,
  getOfferById,
} from '#src/libs/offer/selectors';
import {
  getMetaActivity,
  getMetaActivityLoading,
} from '#src/libs/meta-activity/selectors';
import { getCoach } from '#src/libs/associated-coach/selectors';
import {
  getEstablishment,
  getEstablishmentBulkRetrieveState,
} from '#src/libs/establishment/selectors';
import { getLevel } from '#src/libs/level/selectors';
import {
  getPaymentPack,
  getPaymentPackLoading,
} from '#src/libs/payment-packs/selectors';
import { getConsumerPack } from '#src/libs/consumer-payment-pack/selectors';
import { getRoomBlueprint } from '#src/libs/spot-scheduling/selector';
import { getPrivateConsumerPass } from '#src/libs/private-service/selectors/private-consumer-pass';
import { getPrivateService } from '#src/libs/private-service/selectors/private-service';
import { getPrivateSlot } from '#src/libs/private-service/selectors/private-slot';
import { getSCTs, getSCTsLoading } from '#src/libs/category/selectors';
import {
  getConsumerPaymentPackLink,
  getConsumerPaymentPackLinkLoading,
  getPrivateConsumerPassLink,
  getPrivateConsumerPassLinkLoading,
} from '#src/libs/relationship/selectors';
import {
  getCompatibleServicePassLoading,
  getServiceCompatibilityPassesByPrivatePassAndPrivateService,
} from '#src/libs/private-service/selectors/private-pass';

import {
  BookingFilterTabEnum,
  BookingTabEnum,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/constants';

import type {
  Booking,
  BookingREST,
  ConsumerBooking,
  ConsumerBookingOption,
  ConsumerPrivateBooking,
} from '#src/libs/booking/types';
import type {
  PrivateBooking,
  PrivateConsumerPassREST,
  PrivateConsumerPassReworked,
} from '#src/libs/private-service/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type {
  ConsumerPaymentPack,
  ConsumerPaymentPackREST,
  ConsumerPaymentPackReworked,
} from '#src/libs/consumer-payment-pack/types';
import type {
  BookingFilterTab,
  BookingTab,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/types';

import type { WaitingListBookingOption } from '#src/libs/waiting-list/types';
import type {
  UniversalPassREST,
  UniversalPassReworked,
} from '#src/libs/universal-pass/types';
import type { ConsumerInvoiceREST } from '#src/libs/invoice/types';

export const getConsumerProfile = (state: RootState) => {
  return state.consumer.profile;
};

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
    const bookings = (bookingsList ?? []).map((booking) => {
      const bookingOffer = getOfferById(state, booking?.offer);
      const metaActivity = getMetaActivity(state, booking?.meta_activity);
      const coach = getCoach(state, bookingOffer?.coach);
      const coachOverride = getCoach(state, bookingOffer?.coach_override);
      const establishment = getEstablishment(
        state,
        bookingOffer?.establishment,
      );
      const level = getLevel(state, bookingOffer?.custom_level);
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

const _getConsumerPrivateBookingsList = createSelector(
  [
    (state: RootState) => state,
    (_, privateBookingsList: PrivateBooking[]) => privateBookingsList,
  ],
  (state, privateBookingsList) => {
    const privateBookings = (privateBookingsList ?? []).map(
      (privateBooking) => {
        const coach = getCoach(
          state,
          privateBooking?.coach || privateBooking?.associated_coach,
        );
        const establishment = getEstablishment(
          state,
          privateBooking?.establishment ||
            privateBooking?.associated_establishment,
        );
        const privateConsumerPass = getPrivateConsumerPass(
          state,
          privateBooking?.private_consumer_pass,
        );
        const privateService = getPrivateService(
          state,
          privateBooking?.private_service.toString(),
        );
        const privateSlot = getPrivateSlot(state, privateBooking?.private_slot);
        return {
          ...privateBooking,
          coach,
          establishment,
          private_consumer_pass: privateConsumerPass,
          private_service: privateService,
          private_slot: privateSlot,
        } as ConsumerPrivateBooking;
      },
    );

    return privateBookings;
  },
);

const _getConsumerBookingOptionsList = createSelector(
  [
    (state: RootState) => state,
    (_, bookingOptionsList: WaitingListBookingOption[]) => bookingOptionsList,
  ],
  (state, bookingOptionsList) => {
    const bookingOptions = (bookingOptionsList ?? []).map((bookingOption) => {
      const establishment = getEstablishment(
        state,
        bookingOption?.establishment,
      );
      const level = getLevel(state, bookingOption?.level);
      const coach = getCoach(state, bookingOption?.coach);
      const metaActivity = getMetaActivity(state, bookingOption?.meta_activity);
      return {
        ...bookingOption,
        establishment,
        level,
        booking: null,
        coach,
        meta_activity: metaActivity,
      } as ConsumerBookingOption;
    });

    return bookingOptions;
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
  (ids, data, state) =>
    _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    ),
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
  (ids, data, state) =>
    _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    ),
);

export const getMyWaitlistBookingsState = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.waitlist;

export const getMyWaitlistBookingsAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.waitlist.booking_options.allIds;

export const getMyWaitlistBookingsById = (state: RootState) =>
  state.consumerReworked.myBookings.bookings.waitlist.booking_options.byId;

export const getMyWaitlistBookingsList = createSelector(
  [
    getMyWaitlistBookingsAllIds,
    getMyWaitlistBookingsById,
    (state: RootState) => state,
  ],
  (ids, data, state) =>
    _getConsumerBookingOptionsList(
      state,
      ids.map((id) => data[id]),
    ),
);

export const getMyPastPrivateBookingsState = (state: RootState) =>
  state.consumerReworked.myBookings.privateBookings.past;

const getMyPastPrivateBookingsAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.privateBookings.past.private_services
    .allIds;

const getMyPastPrivateBookingsById = (state: RootState) =>
  state.consumerReworked.myBookings.privateBookings.past.private_services.byId;

export const getMyPastPrivateBookingsList = createSelector(
  [
    getMyPastPrivateBookingsAllIds,
    getMyPastPrivateBookingsById,
    (state: RootState) => state,
  ],
  (ids, data, state) =>
    _getConsumerPrivateBookingsList(
      state,
      ids.map((id) => data[id]),
    ),
);

export const getMyFuturePrivateBookingsState = (state: RootState) =>
  state.consumerReworked.myBookings.privateBookings.future;

const getMyFuturePrivateBookingsAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.privateBookings.future.private_services
    .allIds;

const getMyFuturePrivateBookingsById = (state: RootState) =>
  state.consumerReworked.myBookings.privateBookings.future.private_services
    .byId;

export const getMyFuturePrivateBookingsList = createSelector(
  [
    getMyFuturePrivateBookingsAllIds,
    getMyFuturePrivateBookingsById,
    (state: RootState) => state,
  ],
  (ids, data, state) =>
    _getConsumerPrivateBookingsList(
      state,
      ids.map((id) => data[id]),
    ),
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
  (ids, data, state) =>
    _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    ),
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
  (ids, data, state) =>
    _getConsumerBookingsList(
      state,
      ids.map((id) => data[id]),
    ),
);

export const getMyWaitlistBookingsWorkshopState = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.waitlist;

export const getMyWaitlistBookingsWorkshopAllIds = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.waitlist.booking_options
    .allIds;

export const getMyWaitlistBookingsWorkshopById = (state: RootState) =>
  state.consumerReworked.myBookings.bookingsWorkshop.waitlist.booking_options
    .byId;

export const getMyWaitlistBookingsWorkshopList = createSelector(
  [
    getMyWaitlistBookingsWorkshopAllIds,
    getMyWaitlistBookingsWorkshopById,
    (state: RootState) => state,
  ],
  (ids, data, state) =>
    _getConsumerBookingOptionsList(
      state,
      ids.map((id) => data[id]),
    ),
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
      [BookingFilterTabEnum.WAITLIST]: futureBookingsWorkshopList,
    };
    const bookings: ConsumerBooking[] = bookingsMap[filterTab];
    return bookings.filter((booking) => booking.offer?.group === groupId);
  },
);

export const getConsumerBookingsLoading = createSelector(
  [
    getMyPastBookingsState,
    getMyFutureBookingsState,
    getMyPastPrivateBookingsState,
    getMyFuturePrivateBookingsState,
    getMyPastBookingsWorkshopState,
    getMyFutureBookingsWorkshopState,
    (state: RootState) => state,
    (_: RootState, selectedTab: BookingTab) => selectedTab,
  ],
  (
    pastBookingsState,
    futureBookingsState,
    pastPrivateBookingsState,
    futurePrivateBookingsState,
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
        state.metaActivity.loading,
      [BookingTabEnum.APPOINTMENT]:
        pastPrivateBookingsState.loading ||
        futurePrivateBookingsState.loading ||
        state.privateService.privateConsumerPass.loading ||
        state.privateService.privateService.loading ||
        state.privateService.privateSlot.loading,
      [BookingTabEnum.WORKSHOP]:
        pastBookingsWorkshopState.loading ||
        futureBookingsWorkshopState.loading ||
        state.level.loading ||
        state.metaActivity.loading,
    };

    return (state.coach.loading ||
      state.establishment.loading ||
      bookingsLoadingMap[selectedTab]) as boolean; // Payment pack state not typed
  },
);

export const getMyActiveSubscriptionsState = (state: RootState) =>
  state.consumerReworked.mySubscriptions.active;

const getMyActiveSubscriptionsAllIds = (state: RootState) =>
  state.consumerReworked.mySubscriptions.active.subscriptions.allIds;

const getMyActiveSubscriptionsById = (state: RootState) =>
  state.consumerReworked.mySubscriptions.active.subscriptions.byId;

export const getMyActiveSubscriptionsList = createSelector(
  [getMyActiveSubscriptionsAllIds, getMyActiveSubscriptionsById],
  (ids, data) => {
    return ids.map((subscriptionId) => data[subscriptionId]);
  },
);

export const getMyFutureSubscriptionsState = (state: RootState) =>
  state.consumerReworked.mySubscriptions.future;

const getMyFutureSubscriptionssAllIds = (state: RootState) =>
  state.consumerReworked.mySubscriptions.future.subscriptions.allIds;

const getMyFutureSubscriptionsById = (state: RootState) =>
  state.consumerReworked.mySubscriptions.future.subscriptions.byId;

export const getMyFutureSubscriptionsList = createSelector(
  [getMyFutureSubscriptionssAllIds, getMyFutureSubscriptionsById],
  (ids, data) => {
    return ids.map((subscriptionId) => data[subscriptionId]);
  },
);

export const getMyExpiredSubscriptionsState = (state: RootState) =>
  state.consumerReworked.mySubscriptions.expired;

const getMyExpiredSubscriptionsAllIds = (state: RootState) =>
  state.consumerReworked.mySubscriptions.expired.subscriptions.allIds;

const getMyExpiredSubscriptionsById = (state: RootState) =>
  state.consumerReworked.mySubscriptions.expired.subscriptions.byId;

export const getMyExpiredSubscriptionsList = createSelector(
  [getMyExpiredSubscriptionsAllIds, getMyExpiredSubscriptionsById],
  (ids, data) => {
    return ids.map((subscriptionId) => data[subscriptionId]);
  },
);

export const getSubscriptionCancellationLoadingState = (state: RootState) =>
  state.consumerReworked.mySubscriptions.stop.loading;

/** Get full object for consumer payment packs */
const _getConsumerPaymentPack = createSelector(
  [
    (state: RootState) => state,
    (_, consumerPaymentPack: ConsumerPaymentPackREST) => consumerPaymentPack,
    getSCTs,
  ],
  (state, consumerPaymentPack, allSCTs) => {
    const payment_pack = getPaymentPack(
      state,
      parseInt(consumerPaymentPack.payment_pack_id),
    ) as PaymentPack;
    const establishments = payment_pack?.establishments?.map(
      (establishmentId) => getEstablishment(state, establishmentId),
    );
    const SCTs = allSCTs.filter((sct) => payment_pack?.SCTs?.includes(sct.id));
    const metaActivities = payment_pack?.metaActivities?.map((metaActivityId) =>
      getMetaActivity(state, metaActivityId),
    );
    const dst_consumer_payment_pack = getConsumerPaymentPackLink(
      state,
      consumerPaymentPack?.dst_consumer_payment_pack,
    );
    const src_consumer_payment_pack =
      consumerPaymentPack?.src_consumer_payment_pack?.map(
        (consumerPaymentPackLink) =>
          getConsumerPaymentPackLink(state, consumerPaymentPackLink),
      );
    return {
      ...consumerPaymentPack,
      linked_private_consumer_pass: null,
      payment_pack: {
        ...payment_pack,
        establishments,
        SCTs,
        metaActivities,
      },
      dst_consumer_payment_pack,
      src_consumer_payment_pack,
    } as ConsumerPaymentPackReworked;
  },
);

/** Get full object for consumer payment packs */
const _getConsumerPaymentPackList = createSelector(
  [
    (state: RootState) => state,
    (_, consumerPaymentPacks: ConsumerPaymentPackREST[]) =>
      consumerPaymentPacks,
  ],
  (state, consumerPaymentPacks) => {
    const consumerPaymentPackList = consumerPaymentPacks.map(
      (consumerPaymentPack) =>
        _getConsumerPaymentPack(state, consumerPaymentPack),
    );
    return consumerPaymentPackList;
  },
);

const _getPrivateConsumerPass = createSelector(
  [
    (state: RootState) => state,
    (_, privateConsumerPass: PrivateConsumerPassREST) => privateConsumerPass,
    getServiceCompatibilityPassesByPrivatePassAndPrivateService,
  ],
  (state, privateConsumerPass, privateServiceCompatibilityPassesData) => {
    const privateServiceCompatibilityPasses =
      privateConsumerPass?.private_pass?.private_services?.map(
        (privateServiceId) =>
          privateServiceCompatibilityPassesData?.[
            `${privateServiceId}-${privateConsumerPass.private_pass.id}`
          ],
      );

    const dst_private_consumer_pass = privateConsumerPass
      ?.dst_private_consumer_pass?.length
      ? getPrivateConsumerPassLink(
          state,
          privateConsumerPass.dst_private_consumer_pass[0],
        )
      : null;

    const src_private_consumer_pass =
      privateConsumerPass?.src_private_consumer_pass?.map(
        (consumerPaymentPackLink) =>
          getPrivateConsumerPassLink(state, consumerPaymentPackLink),
      );
    return {
      ...privateConsumerPass,
      private_pass: {
        ...privateConsumerPass.private_pass,
        private_services: privateServiceCompatibilityPasses,
      },
      dst_private_consumer_pass,
      src_private_consumer_pass,
      linked_consumer_payment_pack: null,
    } as PrivateConsumerPassReworked;
  },
);

/** Get full object for private pass */
const _getPrivateConsumerPassList = createSelector(
  [
    (state: RootState) => state,
    (_, privateConsumerPacks: PrivateConsumerPassREST[]) =>
      privateConsumerPacks,
  ],
  (state, privateConsumerPasses) => {
    const privateConsumerPassList = privateConsumerPasses.map(
      (privateConsumerPass) =>
        _getPrivateConsumerPass(state, privateConsumerPass),
    );
    return privateConsumerPassList;
  },
);

/** Get full object for universal pass */
const _getUniversalPassList = createSelector(
  [
    (state: RootState) => state,
    (_, universalPasses: UniversalPassREST[]) => universalPasses,
  ],
  (state, universalPasses) => {
    const consumerPaymentPacks: { [id: number]: ConsumerPaymentPackReworked } =
      universalPasses?.reduce(
        (acc, universalPass) => ({
          ...acc,
          [universalPass.id]: _getConsumerPaymentPack(
            state,
            universalPass.consumer_payment_pack,
          ),
        }),
        {},
      );
    const privateConsumerPasses: { [id: number]: PrivateConsumerPassReworked } =
      universalPasses?.reduce(
        (acc, universalPass) => ({
          ...acc,
          [universalPass.id]: _getPrivateConsumerPass(
            state,
            universalPass.private_consumer_pass,
          ),
        }),
        {},
      );
    return universalPasses?.map(
      (universalPass) =>
        ({
          ...universalPass,
          private_consumer_pass: privateConsumerPasses?.[universalPass.id],
          consumer_payment_pack: consumerPaymentPacks?.[universalPass.id],
        } as UniversalPassReworked),
    );
  },
);

export const getMyActiveConsumerPaymentPacksState = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.active;

const getMyActiveConsumerPaymentPacksAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.active.passes.allIds;

const getMyActiveConsumerPaymentPacksById = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.active.passes.byId;

export const getMyActiveConsumerPaymentPacksList = createSelector(
  [
    getMyActiveConsumerPaymentPacksAllIds,
    getMyActiveConsumerPaymentPacksById,
    (state) => state,
  ],
  (ids, data, state) => {
    const consumerPaymentPacks = ids.map((id) => data[id]);
    return _getConsumerPaymentPackList(state, consumerPaymentPacks);
  },
);

export const getMyFutureConsumerPaymentPacksState = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.future;

const getMyFutureConsumerPaymentPacksAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.future.passes.allIds;

const getMyFutureConsumerPaymentPacksById = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.future.passes.byId;

export const getMyFutureConsumerPaymentPacksList = createSelector(
  [
    getMyFutureConsumerPaymentPacksAllIds,
    getMyFutureConsumerPaymentPacksById,
    (state) => state,
  ],
  (ids, data, state) => {
    const consumerPaymentPacks = ids.map((id) => data[id]);
    return _getConsumerPaymentPackList(state, consumerPaymentPacks);
  },
);

export const getMyExpiredConsumerPaymentPacksState = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.expired;

const getMyExpiredConsumerPaymentPacksAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.expired.passes.allIds;

const getMyExpiredConsumerPaymentPacksById = (state: RootState) =>
  state.consumerReworked.myPasses.consumerPaymentPack.expired.passes.byId;

export const getMyExpiredConsumerPaymentPacksList = createSelector(
  [
    getMyExpiredConsumerPaymentPacksAllIds,
    getMyExpiredConsumerPaymentPacksById,
    (state) => state,
  ],
  (ids, data, state) => {
    const consumerPaymentPacks = ids.map((id) => data[id]);
    return _getConsumerPaymentPackList(state, consumerPaymentPacks);
  },
);

export const getMyActivePrivateConsumerPassesState = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.active;

const getMyActivePrivateConsumerPassesAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.active.passes.allIds;

const getMyActivePrivateConsumerPassesById = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.active.passes.byId;

export const getMyActivePrivateConsumerPassesList = createSelector(
  [
    getMyActivePrivateConsumerPassesAllIds,
    getMyActivePrivateConsumerPassesById,
    (state) => state,
  ],
  (ids, data, state) => {
    const privateConsumerPasses = ids.map((id) => data[id]);
    return _getPrivateConsumerPassList(state, privateConsumerPasses);
  },
);

export const getMyFuturePrivateConsumerPassesState = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.future;

const getMyFuturePrivateConsumerPassesAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.future.passes.allIds;

const getMyFuturePrivateConsumerPassesById = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.future.passes.byId;

export const getMyFuturePrivateConsumerPassesList = createSelector(
  [
    getMyFuturePrivateConsumerPassesAllIds,
    getMyFuturePrivateConsumerPassesById,
    (state) => state,
  ],
  (ids, data, state) => {
    const privateConsumerPasses = ids.map((id) => data[id]);
    return _getPrivateConsumerPassList(state, privateConsumerPasses);
  },
);

export const getMyExpiredPrivateConsumerPassesState = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.expired;

const getMyExpiredPrivateConsumerPassesAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.expired.passes.allIds;

const getMyExpiredPrivateConsumerPassesById = (state: RootState) =>
  state.consumerReworked.myPasses.privateConsumerPass.expired.passes.byId;

export const getMyExpiredPrivateConsumerPassesList = createSelector(
  [
    getMyExpiredPrivateConsumerPassesAllIds,
    getMyExpiredPrivateConsumerPassesById,
    (state) => state,
  ],
  (ids, data, state) => {
    const privateConsumerPasses = ids.map((id) => data[id]);
    return _getPrivateConsumerPassList(state, privateConsumerPasses);
  },
);

export const getMyActiveUniversalPassesState = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.active;

const getMyActiveUniversalPassesAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.active.passes.allIds;

const getMyActiveUniversalPassesById = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.active.passes.byId;

export const getMyActiveUniversalPassesList = createSelector(
  [
    getMyActiveUniversalPassesAllIds,
    getMyActiveUniversalPassesById,
    (state) => state,
  ],
  (ids, data, state) => {
    const universalPasses = ids.map((id) => data[id]);
    return _getUniversalPassList(state, universalPasses);
  },
);

export const getMyFutureUniversalPassesState = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.future;

const getMyFutureUniversalPassesAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.future.passes.allIds;

const getMyFutureUniversalPassesById = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.future.passes.byId;

export const getMyFutureUniversalPassesList = createSelector(
  [
    getMyFutureUniversalPassesAllIds,
    getMyFutureUniversalPassesById,
    (state) => state,
  ],
  (ids, data, state) => {
    const universalPasses = ids.map((id) => data[id]);
    return _getUniversalPassList(state, universalPasses);
  },
);

export const getMyExpiredUniversalPassesState = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.expired;

const getMyExpiredUniversalPassesAllIds = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.expired.passes.allIds;

const getMyExpiredUniversalPassesById = (state: RootState) =>
  state.consumerReworked.myPasses.universalPass.expired.passes.byId;

export const getMyExpiredUniversalPassesList = createSelector(
  [
    getMyExpiredUniversalPassesAllIds,
    getMyExpiredUniversalPassesById,
    (state) => state,
  ],
  (ids, data, state) => {
    const universalPasses = ids.map((id) => data[id]);
    return _getUniversalPassList(state, universalPasses);
  },
);

export const getConsumerPassesTabDisplay = (state: RootState) =>
  state.consumerReworked.myPasses.tabs.data;

export const getConsumerPassesTabDisplayLoading = (state: RootState) =>
  state.consumerReworked.myPasses.tabs.loading;

const getConsumerPaymentPackLoading = createSelector(
  [
    getMyActiveConsumerPaymentPacksState,
    getMyFutureConsumerPaymentPacksState,
    getMyExpiredConsumerPaymentPacksState,
    getPaymentPackLoading,
  ],
  (
    activeConsumerPaymentPacksState,
    futureConsumerPaymentPacksState,
    expiredConsumerPaymentPacksState,
    isPaymentPackLoading,
  ) =>
    activeConsumerPaymentPacksState.loading ||
    futureConsumerPaymentPacksState.loading ||
    expiredConsumerPaymentPacksState.loading ||
    isPaymentPackLoading,
);

const getPrivateConsumerPassLoading = createSelector(
  [
    getMyActivePrivateConsumerPassesState,
    getMyFuturePrivateConsumerPassesState,
    getMyExpiredPrivateConsumerPassesState,
  ],
  (
    activePrivateConsumerPassesState,
    futurePrivateConsumerPassesState,
    expiredPrivateConsumerPassesState,
  ) =>
    activePrivateConsumerPassesState.loading ||
    futurePrivateConsumerPassesState.loading ||
    expiredPrivateConsumerPassesState.loading,
);

const getUniversalPassLoading = createSelector(
  [
    getMyActiveUniversalPassesState,
    getMyFutureUniversalPassesState,
    getMyExpiredUniversalPassesState,
  ],
  (
    activeUniversalPassesState,
    futureUniversalPassesState,
    expiredUniversalPassesState,
  ) =>
    activeUniversalPassesState.loading ||
    futureUniversalPassesState.loading ||
    expiredUniversalPassesState.loading,
);

const getConsumerPaymentPackMetadataLoading = createSelector(
  [
    getEstablishmentBulkRetrieveState,
    getSCTsLoading,
    getMetaActivityLoading,
    getConsumerPaymentPackLinkLoading,
  ],
  (
    isEstablishmentBulkState,
    isSCTsLoading,
    isMetaActivityLoading,
    isConsumerPaymentPackLinkLoading,
  ) =>
    isEstablishmentBulkState.loading ||
    isSCTsLoading ||
    // Same state attribute for both fetch and bulk fetch
    isMetaActivityLoading ||
    isConsumerPaymentPackLinkLoading,
);

const getPrivateConsumerPassMetadataLoading = createSelector(
  [getPrivateConsumerPassLinkLoading, getCompatibleServicePassLoading],
  (isPrivateConsumerPassLinkLoading, isCompatibleServicePassLoading) =>
    isCompatibleServicePassLoading || isPrivateConsumerPassLinkLoading,
);

export const getConsumerPassesLoading = createSelector(
  [
    getConsumerPaymentPackLoading,
    getPrivateConsumerPassLoading,
    getUniversalPassLoading,
  ],
  (
    isConsumerPaymentPackLoading,
    isPrivateConsumerPassLoading,
    isUniversalPassLoading,
  ) =>
    isConsumerPaymentPackLoading ||
    isPrivateConsumerPassLoading ||
    isUniversalPassLoading,
);

export const getConsumerPassMetadataLoading = createSelector(
  [
    getConsumerPaymentPackMetadataLoading,
    getPrivateConsumerPassMetadataLoading,
  ],
  (consumerPaymentPackMetadataLoading, isPrivateConsumerPassMetadataLoading) =>
    consumerPaymentPackMetadataLoading || isPrivateConsumerPassMetadataLoading,
);

export const getMySubscriptionsInvoicesDetailsState = (state: RootState) =>
  state.consumerReworked.mySubscriptions.invoices;

// MY INVOICES
const _getUnpaidInvoicesAllUuids = (state: RootState) =>
  state.consumerReworked.myInvoices.unpaid.allUuids;
const _getPaidInvoicesAllUuids = (state: RootState) =>
  state.consumerReworked.myInvoices.paid.allUuids;
const _getRefundedInvoicesAllUuids = (state: RootState) =>
  state.consumerReworked.myInvoices.refunded.allUuids;
const _getInvoicesRESTByUuid = (state: RootState) =>
  state.consumerReworked.myInvoices.restByUuid;
const _getInvoicesComplementaryByUuid = (state: RootState) =>
  state.consumerReworked.myInvoices.complementary.byUuid;
export const getInvoicesComplementaryLoading = (state: RootState) =>
  state.consumerReworked.myInvoices.complementary.loading;

export const getUnpaidInvoices = createSelector(
  [_getInvoicesRESTByUuid, _getUnpaidInvoicesAllUuids],
  (restByUuid, allUuids): ConsumerInvoiceREST[] =>
    (allUuids ?? [])
      .map((uuid) => restByUuid[uuid])
      .filter((_invoice) => !!_invoice),
);
export const getPaidInvoices = createSelector(
  [_getInvoicesRESTByUuid, _getPaidInvoicesAllUuids],
  (restByUuid, allUuids): ConsumerInvoiceREST[] =>
    (allUuids ?? [])
      .map((uuid) => restByUuid[uuid])
      .filter((_invoice) => !!_invoice),
);
export const getRefundedInvoices = createSelector(
  [_getInvoicesRESTByUuid, _getRefundedInvoicesAllUuids],
  (restByUuid, allUuids): ConsumerInvoiceREST[] =>
    (allUuids ?? [])
      .map((uuid) => restByUuid[uuid])
      .filter((_invoice) => !!_invoice),
);

export const getInvoiceComplementaryInformation = createSelector(
  [_getInvoicesComplementaryByUuid, (state: RootState, uuid: string) => uuid],
  (invoideByUiid, invoiceUiid) => invoideByUiid[invoiceUiid],
);

export const getUnpaidInvoicesCount = (state: RootState) =>
  state.consumerReworked.myInvoices.unpaid.count;
export const getPaidInvoicesCount = (state: RootState) =>
  state.consumerReworked.myInvoices.paid.count;
export const getRefundedInvoicesCount = (state: RootState) =>
  state.consumerReworked.myInvoices.refunded.count;

export const getInvoicesLoading = (state: RootState) =>
  state.consumerReworked.myInvoices.loading;
export const getUnpaidInvoicesLoading = (state: RootState) =>
  state.consumerReworked.myInvoices.unpaid.loading;
export const getPaidInvoicesLoading = (state: RootState) =>
  state.consumerReworked.myInvoices.paid.loading;
export const getRefundedInvoicesLoading = (state: RootState) =>
  state.consumerReworked.myInvoices.refunded.loading;

export const getUnpaidInvoicesNextPage = (state: RootState) =>
  state.consumerReworked.myInvoices.unpaid.nextPage;
export const getPaidInvoicesNextPage = (state: RootState) =>
  state.consumerReworked.myInvoices.paid.nextPage;
export const getRefundedInvoicesNextPage = (state: RootState) =>
  state.consumerReworked.myInvoices.refunded.nextPage;

export const getUnpaidInvoicesPage = (state: RootState) =>
  state.consumerReworked.myInvoices.unpaid.page;
export const getPaidInvoicesPage = (state: RootState) =>
  state.consumerReworked.myInvoices.paid.page;
export const getRefundedInvoicesPage = (state: RootState) =>
  state.consumerReworked.myInvoices.refunded.page;

const _getConsumerElligibleGuestNumberByOfferState = (state: RootState) =>
  state.consumerReworked.myBookings.elligibleGuestNumberByOffer;

export const getConsumerOfferElligibleGuestNumber = createSelector(
  [
    _getConsumerElligibleGuestNumberByOfferState,
    (_: RootState, offerId: number) => offerId,
  ],
  (elligibleGuestNumberByOffer, offerId) =>
    elligibleGuestNumberByOffer.byOfferId[offerId] ?? 0,
);

const _getConsumerBookingOptionPositionState = (state: RootState) =>
  state.consumerReworked.myBookings.waitlistPositionByOffer;

export const getConsumerOfferBookingOptionPosition = createSelector(
  [
    _getConsumerBookingOptionPositionState,
    (_: RootState, offerId: number) => offerId,
  ],
  (consumerWaitingListPositionByOfferId, offerId) =>
    consumerWaitingListPositionByOfferId.byOfferId[offerId],
);

export const getFranchiseMarketingPreferencesEligiblity = (state: RootState) =>
  state.consumerReworked.myFranchiseMarketingPreferences.eligibility.eligible;

export const getFranchiseMarketingPreferences = (state: RootState) =>
  state.consumerReworked.myFranchiseMarketingPreferences.companyPreferences
    .preferences;

export const getFranchiseMarketingPreferencesUpdateState = (state: RootState) =>
  state.consumerReworked.myFranchiseMarketingPreferences.update;
