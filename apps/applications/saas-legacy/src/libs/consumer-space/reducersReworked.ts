import Immutable from 'seamless-immutable';
import uniqBy from 'lodash/uniqBy';
import { handleActions } from 'redux-actions';

import {
  fetchMyPastBookingAsMemberActions,
  fetchMyFutureBookingAsMemberActions,
  fetchMyPastBookingWorkshopAsMemberActions,
  fetchMyFutureBookingWorkshopAsMemberActions,
  resetConsumerStateActions,
  fetchMyPastPrivateBookingAsMemberActions,
  fetchMyFuturePrivateBookingAsMemberActions,
  fetchMyBookingOptionAsMemberActions,
  fetchMyBookingOptionWorkshopAsMemberActions,
  fetchMyExpiredConsumerPaymentPacksAsMemberActions,
  fetchMyActiveConsumerPaymentPacksAsMemberActions,
  fetchMyFutureConsumerPaymentPacksAsMemberActions,
  fetchMyExpiredPrivateConsumerPassesAsMemberActions,
  fetchMyActivePrivateConsumerPassesAsMemberActions,
  fetchMyFuturePrivateConsumerPassesAsMemberActions,
  fetchMyExpiredUniversalPassesAsMemberActions,
  fetchMyActiveUniversalPassesAsMemberActions,
  fetchMyFutureUniversalPassesAsMemberActions,
  fetchConsumerPassesTabDisplayActions,
  fetchConsumerUnpaidInvoicesActions,
  fetchConsumerPaidInvoicesActions,
  fetchConsumerRefundedInvoicesActions,
  fetchConsumerInvoicesComplementaryActions,
  fetchConsumerInvoiceByUuidActions,
  fetchConsumerGuestNumberEligibleByOfferBulk,
  fetchMyBookingOptionsPositionAsMemberByOfferIdsActions,
} from '#src/libs/consumer-space/actions';
import {
  fetchActiveSubscriptionDetailAsMemberActions,
  fetchConsumerSubscriptionInvoicesDetailsActions,
  fetchExpiredSubscriptionDetailAsMemberActions,
  fetchFutureSubscriptionDetailAsMemberActions,
  fetchMyActiveSubscriptionsAsMemberActions,
  fetchMyExpiredSubscriptionsAsMemberActions,
  fetchMyFutureSubscriptionsAsMemberActions,
  stopConsumerSubscriptionActions,
} from '#src/libs/consumer-space/actions/subscription-actions';

import {
  fetchMyFranchiseMarketingPreferencesActions,
  updateMyFranchiseMarketingPreferencesActions,
  checkFranchiseMarketingPreferencesEligibilityActions,
} from '#src/libs/consumer-space/actions/marketing-preferences';
import type { MarketingPreferenceData } from '#src/libs/communication/types';

import type { PaginatedResponse } from '#src/state/types';
import type { BookingREST } from '#src/libs/booking/types';
import type { WaitingListBookingOption } from '#src/libs/waiting-list/types';
import type { ConsumerPaymentPackREST } from '#src/libs/consumer-payment-pack/types';
import type { UniversalPassREST } from '#src/libs/universal-pass/types';
import type {
  ConsumerPassesTabDisplay,
  ConsumerStateReworked,
} from '#src/libs/consumer-space/types';
import type {
  PrivateBooking,
  PrivateConsumerPassREST,
} from '#src/libs/private-service/types';
import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import {
  ConsumerInvoiceComplementary,
  ConsumerInvoiceREST,
} from '#src/libs/invoice/types';
import type { OfferStatusWaitingListPosition } from '#src/libs/offer/types';

type ConsumerInvoiceRESTByUuid = { [uuid: string]: ConsumerInvoiceREST };
type ConsumerInvoiceComplementaryByUuid = {
  [uuid: string]: ConsumerInvoiceComplementary;
};

type PayloadReduceType<T> = { [id: number]: T };
const initialState: Immutable.Immutable<ConsumerStateReworked> =
  Immutable<ConsumerStateReworked>({
    myBookings: {
      bookings: {
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: true,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
        past: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
        waitlist: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          booking_options: {
            allIds: [],
            byId: {},
          },
        },
      },
      privateBookings: {
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: true,
          error: null,
          private_services: {
            allIds: [],
            byId: {},
          },
        },
        past: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          private_services: {
            allIds: [],
            byId: {},
          },
        },
      },
      bookingsWorkshop: {
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: true,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
        past: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
        waitlist: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          booking_options: {
            allIds: [],
            byId: {},
          },
        },
      },
      elligibleGuestNumberByOffer: {
        byOfferId: {},
        loading: false,
        error: null,
      },
      waitlistPositionByOffer: {
        byOfferId: {},
        loading: false,
        error: null,
      },
    },
    mySubscriptions: {
      active: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        loading: false,
        error: null,
        subscriptions: {
          allIds: [],
          byId: {},
        },
      },
      future: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        loading: false,
        error: null,
        subscriptions: {
          allIds: [],
          byId: {},
        },
      },
      expired: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        loading: false,
        error: null,
        subscriptions: {
          allIds: [],
          byId: {},
        },
      },
      invoices: {
        loading: false,
        error: null,
        bySubscriptionId: {},
      },
      stop: {
        loading: false,
        error: null,
      },
    },
    myPasses: {
      tabs: {
        error: null,
        loading: false,
        data: {
          consumer_payment_pack: true,
          private_consumer_pass: true,
          universal_pass: true,
        },
      },
      consumerPaymentPack: {
        active: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
        expired: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
      },
      privateConsumerPass: {
        active: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
        expired: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
      },
      universalPass: {
        active: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
        expired: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          passes: {
            allIds: [],
            byId: {},
          },
        },
      },
    },
    myInvoices: {
      error: null,
      loading: false,
      restByUuid: {},
      complementary: {
        error: null,
        loading: false,
        byUuid: {},
      },
      byUuid: {
        error: null,
        loading: false,
      },
      unpaid: {
        error: null,
        loading: false,
        count: 0,
        page: 1,
        allUuids: [],
        nextPage: null,
      },
      paid: {
        error: null,
        loading: false,
        count: 0,
        page: 1,
        allUuids: [],
        nextPage: null,
      },
      refunded: {
        error: null,
        loading: false,
        count: 0,
        page: 1,
        allUuids: [],
        nextPage: null,
      },
    },
    myFranchiseMarketingPreferences: {
      eligibility: { eligible: false, error: null, loading: false },
      companyPreferences: { preferences: [], loading: false, error: null },
      update: { error: null, loading: false },
    },
  });

export default handleActions<Immutable.Immutable<ConsumerStateReworked>, any>(
  {
    /* MYBOOKINGS REDUCERS */
    [fetchMyPastBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'past', 'loading'],
        payload,
      );
    },
    [fetchMyPastBookingAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['myBookings', 'bookings', 'past', 'error'], payload);
    },
    [fetchMyPastBookingAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<BookingREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'bookings', 'past', 'page'], page)
        .setIn(['myBookings', 'bookings', 'past', 'next_page'], next_page)
        .setIn(['myBookings', 'bookings', 'past', 'count'], count)
        .setIn(
          ['myBookings', 'bookings', 'past', 'bookings', 'allIds'],
          (results ?? []).map((booking) => booking.id),
        )
        .merge(
          {
            myBookings: {
              bookings: {
                past: {
                  bookings: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<BookingREST>
                    >((acc, booking) => {
                      acc[booking.id] = booking;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFutureBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFutureBookingAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFutureBookingAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<BookingREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'bookings', 'future', 'page'], page)
        .setIn(['myBookings', 'bookings', 'future', 'next_page'], next_page)
        .setIn(['myBookings', 'bookings', 'future', 'count'], count)
        .setIn(
          ['myBookings', 'bookings', 'future', 'bookings', 'allIds'],
          (results ?? []).map((booking) => booking.id),
        )
        .merge(
          {
            myBookings: {
              bookings: {
                future: {
                  bookings: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<BookingREST>
                    >((acc, booking) => {
                      acc[booking.id] = booking;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyPastPrivateBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'past', 'loading'],
        payload,
      );
    },
    [fetchMyPastPrivateBookingAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'past', 'error'],
        payload,
      );
    },
    [fetchMyPastPrivateBookingAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PrivateBooking> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'privateBookings', 'past', 'page'], page)
        .setIn(
          ['myBookings', 'privateBookings', 'past', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'privateBookings', 'past', 'count'], count)
        .setIn(
          [
            'myBookings',
            'privateBookings',
            'past',
            'private_services',
            'allIds',
          ],
          (results ?? []).map((privateBooking) => privateBooking.id),
        )
        .merge(
          {
            myBookings: {
              privateBookings: {
                past: {
                  private_services: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<PrivateBooking>
                    >((acc, privateBooking) => {
                      acc[privateBooking.id] = privateBooking;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFuturePrivateBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFuturePrivateBookingAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFuturePrivateBookingAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PrivateBooking> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'privateBookings', 'future', 'page'], page)
        .setIn(
          ['myBookings', 'privateBookings', 'future', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'privateBookings', 'future', 'count'], count)
        .setIn(
          [
            'myBookings',
            'privateBookings',
            'future',
            'private_services',
            'allIds',
          ],
          (results ?? []).map((privateBooking) => privateBooking.id),
        )
        .merge(
          {
            myBookings: {
              privateBookings: {
                future: {
                  private_services: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<PrivateBooking>
                    >((acc, privateBooking) => {
                      acc[privateBooking.id] = privateBooking;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyPastBookingWorkshopAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'past', 'loading'],
        payload,
      );
    },
    [fetchMyPastBookingWorkshopAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'past', 'error'],
        payload,
      );
    },
    [fetchMyPastBookingWorkshopAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<BookingREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'bookingsWorkshop', 'past', 'page'], page)
        .setIn(
          ['myBookings', 'bookingsWorkshop', 'past', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'bookingsWorkshop', 'past', 'count'], count)
        .setIn(
          ['myBookings', 'bookingsWorkshop', 'past', 'bookings', 'allIds'],
          (results ?? []).map((booking) => booking.id),
        )
        .merge(
          {
            myBookings: {
              bookingsWorkshop: {
                past: {
                  bookings: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<BookingREST>
                    >((acc, booking) => {
                      acc[booking.id] = booking;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFutureBookingWorkshopAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFutureBookingWorkshopAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFutureBookingWorkshopAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<BookingREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'bookingsWorkshop', 'future', 'page'], page)
        .setIn(
          ['myBookings', 'bookingsWorkshop', 'future', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'bookingsWorkshop', 'future', 'count'], count)
        .setIn(
          ['myBookings', 'bookingsWorkshop', 'future', 'bookings', 'allIds'],
          (results ?? []).map((booking) => booking.id),
        )
        .merge(
          {
            myBookings: {
              bookingsWorkshop: {
                future: {
                  bookings: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<BookingREST>
                    >((acc, booking) => {
                      acc[booking.id] = booking;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyBookingOptionAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'waitlist', 'loading'],
        payload,
      );
    },
    [fetchMyBookingOptionAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'waitlist', 'error'],
        payload,
      );
    },
    [fetchMyBookingOptionAsMemberActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<WaitingListBookingOption>;
      },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'bookings', 'waitlist', 'page'], page)
        .setIn(['myBookings', 'bookings', 'waitlist', 'next_page'], next_page)
        .setIn(['myBookings', 'bookings', 'waitlist', 'count'], count)
        .setIn(
          ['myBookings', 'bookings', 'waitlist', 'booking_options', 'allIds'],
          (results ?? []).map((bookingOption) => bookingOption.id),
        )
        .merge(
          {
            myBookings: {
              bookings: {
                waitlist: {
                  booking_options: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<WaitingListBookingOption>
                    >((acc, bookingOption) => {
                      acc[bookingOption.id] = bookingOption;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyBookingOptionWorkshopAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'waitlist', 'loading'],
        payload,
      );
    },
    [fetchMyBookingOptionWorkshopAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'waitlist', 'error'],
        payload,
      );
    },
    [fetchMyBookingOptionWorkshopAsMemberActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<WaitingListBookingOption>;
      },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myBookings', 'bookingsWorkshop', 'waitlist', 'page'], page)
        .setIn(
          ['myBookings', 'bookingsWorkshop', 'waitlist', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'bookingsWorkshop', 'waitlist', 'count'], count)
        .setIn(
          [
            'myBookings',
            'bookingsWorkshop',
            'waitlist',
            'booking_options',
            'allIds',
          ],
          (results ?? []).map((bookingOption) => bookingOption.id),
        )
        .merge(
          {
            myBookings: {
              bookingsWorkshop: {
                waitlist: {
                  booking_options: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<WaitingListBookingOption>
                    >((acc, bookingOption) => {
                      acc[bookingOption.id] = bookingOption;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [resetConsumerStateActions.all.toString()]: (state) => {
      return initialState.setIn(
        ['myPasses', 'tabs', 'data'],
        // The action should reset the state, except the tabs data that is to be fetched only once.
        state.myPasses.tabs.data,
      );
    },
    /* MYSUBSCRIPTIONS REDUCERS */
    [fetchMyActiveSubscriptionsAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<SubscriptionREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['mySubscriptions', 'active', 'page'], page)
        .setIn(['mySubscriptions', 'active', 'next_page'], next_page)
        .setIn(['mySubscriptions', 'active', 'count'], count)
        .setIn(
          ['mySubscriptions', 'active', 'subscriptions', 'allIds'],
          (results ?? []).map((subscription) => subscription.id),
        )
        .merge(
          {
            mySubscriptions: {
              active: {
                subscriptions: {
                  byId: (results ?? []).reduce<
                    PayloadReduceType<SubscriptionREST>
                  >((acc, subscription) => {
                    acc[subscription.id] = subscription;
                    return acc;
                  }, {}),
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyActiveSubscriptionsAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'active', 'loading'], payload);
    },
    [fetchMyActiveSubscriptionsAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'active', 'error'], payload);
    },
    [fetchActiveSubscriptionDetailAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: SubscriptionREST },
    ) => {
      return state.setIn(
        ['mySubscriptions', 'active', 'subscriptions', 'byId', `${payload.id}`],
        payload,
      );
    },
    [fetchActiveSubscriptionDetailAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'active', 'loading'], payload);
    },
    [fetchActiveSubscriptionDetailAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'active', 'error'], payload);
    },
    [fetchMyFutureSubscriptionsAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'future', 'loading'], payload);
    },
    [fetchMyFutureSubscriptionsAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'future', 'error'], payload);
    },
    [fetchMyFutureSubscriptionsAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<SubscriptionREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['mySubscriptions', 'future', 'page'], page)
        .setIn(['mySubscriptions', 'future', 'next_page'], next_page)
        .setIn(['mySubscriptions', 'future', 'count'], count)
        .setIn(
          ['mySubscriptions', 'future', 'subscriptions', 'allIds'],
          (results ?? []).map((subscription) => subscription.id),
        )
        .merge(
          {
            mySubscriptions: {
              future: {
                subscriptions: {
                  byId: (results ?? []).reduce<
                    PayloadReduceType<SubscriptionREST>
                  >((acc, subscription) => {
                    acc[subscription.id] = subscription;
                    return acc;
                  }, {}),
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchFutureSubscriptionDetailAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'future', 'loading'], payload);
    },
    [fetchFutureSubscriptionDetailAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'future', 'error'], payload);
    },
    [fetchFutureSubscriptionDetailAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: SubscriptionREST },
    ) => {
      return state.setIn(
        ['mySubscriptions', 'future', 'subscriptions', 'byId', `${payload.id}`],
        payload,
      );
    },
    [fetchMyExpiredSubscriptionsAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'expired', 'loading'], payload);
    },
    [fetchMyExpiredSubscriptionsAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'expired', 'error'], payload);
    },
    [fetchMyExpiredSubscriptionsAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<SubscriptionREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['mySubscriptions', 'expired', 'page'], page)
        .setIn(['mySubscriptions', 'expired', 'next_page'], next_page)
        .setIn(['mySubscriptions', 'expired', 'count'], count)
        .setIn(
          ['mySubscriptions', 'expired', 'subscriptions', 'allIds'],
          (results ?? []).map((subscription) => subscription.id),
        )
        .merge(
          {
            mySubscriptions: {
              expired: {
                subscriptions: {
                  byId: (results ?? []).reduce<
                    PayloadReduceType<SubscriptionREST>
                  >((acc, subscription) => {
                    acc[subscription.id] = subscription;
                    return acc;
                  }, {}),
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchExpiredSubscriptionDetailAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'expired', 'loading'], payload);
    },
    [fetchExpiredSubscriptionDetailAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'expired', 'error'], payload);
    },
    [fetchExpiredSubscriptionDetailAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: SubscriptionREST },
    ) => {
      return state.setIn(
        [
          'mySubscriptions',
          'expired',
          'subscriptions',
          'byId',
          `${payload.id}`,
        ],
        payload,
      );
    },
    [fetchMyExpiredConsumerPaymentPacksAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'consumerPaymentPack', 'expired', 'loading'],
        payload,
      );
    },
    [fetchMyExpiredConsumerPaymentPacksAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myPasses', 'consumerPaymentPack', 'expired', 'error'],
        payload,
      );
    },
    [fetchMyExpiredConsumerPaymentPacksAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ConsumerPaymentPackREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'consumerPaymentPack', 'expired', 'page'], page)
        .setIn(
          ['myPasses', 'consumerPaymentPack', 'expired', 'next_page'],
          next_page,
        )
        .setIn(['myPasses', 'consumerPaymentPack', 'expired', 'count'], count)
        .setIn(
          ['myPasses', 'consumerPaymentPack', 'expired', 'passes', 'allIds'],
          (results ?? []).map((consumerPaymentPack) => consumerPaymentPack.id),
        )
        .merge(
          {
            myPasses: {
              consumerPaymentPack: {
                expired: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<ConsumerPaymentPackREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyActiveConsumerPaymentPacksAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'consumerPaymentPack', 'active', 'loading'],
        payload,
      );
    },
    [fetchMyActiveConsumerPaymentPacksAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myPasses', 'consumerPaymentPack', 'active', 'error'],
        payload,
      );
    },
    [fetchMyActiveConsumerPaymentPacksAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ConsumerPaymentPackREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'consumerPaymentPack', 'active', 'page'], page)
        .setIn(
          ['myPasses', 'consumerPaymentPack', 'active', 'next_page'],
          next_page,
        )
        .setIn(['myPasses', 'consumerPaymentPack', 'active', 'count'], count)
        .setIn(
          ['myPasses', 'consumerPaymentPack', 'active', 'passes', 'allIds'],
          (results ?? []).map((consumerPaymentPack) => consumerPaymentPack.id),
        )
        .merge(
          {
            myPasses: {
              consumerPaymentPack: {
                active: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<ConsumerPaymentPackREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFutureConsumerPaymentPacksAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'consumerPaymentPack', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFutureConsumerPaymentPacksAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myPasses', 'consumerPaymentPack', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFutureConsumerPaymentPacksAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ConsumerPaymentPackREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'consumerPaymentPack', 'future', 'page'], page)
        .setIn(
          ['myPasses', 'consumerPaymentPack', 'future', 'next_page'],
          next_page,
        )
        .setIn(['myPasses', 'consumerPaymentPack', 'future', 'count'], count)
        .setIn(
          ['myPasses', 'consumerPaymentPack', 'future', 'passes', 'allIds'],
          (results ?? []).map((consumerPaymentPack) => consumerPaymentPack.id),
        )
        .merge(
          {
            myPasses: {
              consumerPaymentPack: {
                future: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<ConsumerPaymentPackREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyExpiredPrivateConsumerPassesAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'privateConsumerPass', 'expired', 'loading'],
        payload,
      );
    },
    [fetchMyExpiredPrivateConsumerPassesAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myPasses', 'privateConsumerPass', 'expired', 'error'],
        payload,
      );
    },
    [fetchMyExpiredPrivateConsumerPassesAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PrivateConsumerPassREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'privateConsumerPass', 'expired', 'page'], page)
        .setIn(
          ['myPasses', 'privateConsumerPass', 'expired', 'next_page'],
          next_page,
        )
        .setIn(['myPasses', 'privateConsumerPass', 'expired', 'count'], count)
        .setIn(
          ['myPasses', 'privateConsumerPass', 'expired', 'passes', 'allIds'],
          (results ?? []).map((privateConsumerPass) => privateConsumerPass.id),
        )
        .merge(
          {
            myPasses: {
              privateConsumerPass: {
                expired: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<PrivateConsumerPassREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyActivePrivateConsumerPassesAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'privateConsumerPass', 'active', 'loading'],
        payload,
      );
    },
    [fetchMyActivePrivateConsumerPassesAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myPasses', 'privateConsumerPass', 'active', 'error'],
        payload,
      );
    },
    [fetchMyActivePrivateConsumerPassesAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PrivateConsumerPassREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'privateConsumerPass', 'active', 'page'], page)
        .setIn(
          ['myPasses', 'privateConsumerPass', 'active', 'next_page'],
          next_page,
        )
        .setIn(['myPasses', 'privateConsumerPass', 'active', 'count'], count)
        .setIn(
          ['myPasses', 'privateConsumerPass', 'active', 'passes', 'allIds'],
          (results ?? []).map((privateConsumerPass) => privateConsumerPass.id),
        )
        .merge(
          {
            myPasses: {
              privateConsumerPass: {
                active: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<PrivateConsumerPassREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFuturePrivateConsumerPassesAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'privateConsumerPass', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFuturePrivateConsumerPassesAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myPasses', 'privateConsumerPass', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFuturePrivateConsumerPassesAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PrivateConsumerPassREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'privateConsumerPass', 'future', 'page'], page)
        .setIn(
          ['myPasses', 'privateConsumerPass', 'future', 'next_page'],
          next_page,
        )
        .setIn(['myPasses', 'privateConsumerPass', 'future', 'count'], count)
        .setIn(
          ['myPasses', 'privateConsumerPass', 'future', 'passes', 'allIds'],
          (results ?? []).map((privateConsumerPass) => privateConsumerPass.id),
        )
        .merge(
          {
            myPasses: {
              privateConsumerPass: {
                future: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<PrivateConsumerPassREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyExpiredUniversalPassesAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'universalPass', 'expired', 'loading'],
        payload,
      );
    },
    [fetchMyExpiredUniversalPassesAsMemberActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['myPasses', 'universalPass', 'expired', 'error'],
        payload,
      );
    },
    [fetchMyExpiredUniversalPassesAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<UniversalPassREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'universalPass', 'expired', 'page'], page)
        .setIn(['myPasses', 'universalPass', 'expired', 'next_page'], next_page)
        .setIn(['myPasses', 'universalPass', 'expired', 'count'], count)
        .setIn(
          ['myPasses', 'universalPass', 'expired', 'passes', 'allIds'],
          (results ?? []).map((universalPass) => universalPass.id),
        )
        .merge(
          {
            myPasses: {
              universalPass: {
                expired: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<UniversalPassREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyActiveUniversalPassesAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'universalPass', 'active', 'loading'],
        payload,
      );
    },
    [fetchMyActiveUniversalPassesAsMemberActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['myPasses', 'universalPass', 'active', 'error'],
        payload,
      );
    },
    [fetchMyActiveUniversalPassesAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<UniversalPassREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'universalPass', 'active', 'page'], page)
        .setIn(['myPasses', 'universalPass', 'active', 'next_page'], next_page)
        .setIn(['myPasses', 'universalPass', 'active', 'count'], count)
        .setIn(
          ['myPasses', 'universalPass', 'active', 'passes', 'allIds'],
          (results ?? []).map((universalPass) => universalPass.id),
        )
        .merge(
          {
            myPasses: {
              universalPass: {
                active: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<UniversalPassREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFutureUniversalPassesAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myPasses', 'universalPass', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFutureUniversalPassesAsMemberActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['myPasses', 'universalPass', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFutureUniversalPassesAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<UniversalPassREST> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['myPasses', 'universalPass', 'future', 'page'], page)
        .setIn(['myPasses', 'universalPass', 'future', 'next_page'], next_page)
        .setIn(['myPasses', 'universalPass', 'future', 'count'], count)
        .setIn(
          ['myPasses', 'universalPass', 'future', 'passes', 'allIds'],
          (results ?? []).map((universalPass) => universalPass.id),
        )
        .merge(
          {
            myPasses: {
              universalPass: {
                future: {
                  passes: {
                    byId: (results ?? []).reduce<
                      PayloadReduceType<UniversalPassREST>
                    >((acc, ps) => {
                      acc[ps.id] = ps;
                      return acc;
                    }, {}),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchConsumerPassesTabDisplayActions.success.toString()]: (
      state,
      { payload }: { payload: ConsumerPassesTabDisplay },
    ) => {
      const { consumer_payment_pack, private_consumer_pass, universal_pass } =
        payload;
      return state.setIn(['myPasses', 'tabs', 'data'], {
        consumer_payment_pack,
        private_consumer_pass,
        universal_pass,
      });
    },
    [fetchConsumerPassesTabDisplayActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['myPasses', 'tabs', 'error'], payload);
    },
    [fetchConsumerPassesTabDisplayActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['myPasses', 'tabs', 'loading'], payload);
    },
    /* SUBSCRIPTIONS DETAILS REDUCER */
    [fetchConsumerSubscriptionInvoicesDetailsActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          billing_plan_id: number;
          data: PaginatedResponse<SubscriptionsInvoicesDetailsREST>;
        };
      },
    ) => {
      const { billing_plan_id, data } = payload;
      const { next_page, results, count, page } = data;

      if (results?.length === 0) {
        return state;
      }

      const newInvoices =
        results?.map((invoice) => ({
          date: invoice.date,
          uuid: invoice.uuid,
          amount_paid_cts: invoice.amount_paid_cts,
          stripe_invoice_pdf: invoice.stripe_invoice_pdf,
        })) ?? [];

      if (
        state.mySubscriptions.invoices.bySubscriptionId?.[billing_plan_id]
          ?.invoices
      ) {
        const mergedInvoices = uniqBy(
          [
            ...state.mySubscriptions.invoices.bySubscriptionId?.[
              billing_plan_id
            ]?.invoices,
            ...newInvoices,
          ],
          'uuid',
        );
        return state.merge(
          {
            mySubscriptions: {
              invoices: {
                bySubscriptionId: {
                  [payload.billing_plan_id]: {
                    invoices: mergedInvoices,
                    count,
                    next_page,
                    page,
                  },
                },
              },
            },
          },
          { deep: true },
        );
      }
      return state.merge(
        {
          mySubscriptions: {
            invoices: {
              bySubscriptionId: {
                [payload.billing_plan_id]: {
                  invoices: newInvoices,
                  count,
                  next_page,
                  page,
                },
              },
            },
          },
        },
        { deep: true },
      );
    },
    [fetchConsumerSubscriptionInvoicesDetailsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'invoices', 'loading'], payload);
    },
    [fetchConsumerSubscriptionInvoicesDetailsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'invoices', 'error'], payload);
    },
    [stopConsumerSubscriptionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['mySubscriptions', 'stop', 'loading'], payload);
    },
    [stopConsumerSubscriptionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['mySubscriptions', 'stop', 'error'], payload);
    },
    /* MY INVOICES REDUCER */
    [fetchConsumerUnpaidInvoicesActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['myInvoices', 'unpaid', 'loading'], payload);
    },
    [fetchConsumerUnpaidInvoicesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['myInvoices', 'unpaid', 'error'], payload);
    },
    [fetchConsumerUnpaidInvoicesActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ConsumerInvoiceREST> },
    ) => {
      return state
        .setIn(['myInvoices', 'unpaid', 'count'], payload.count)
        .setIn(['myInvoices', 'unpaid', 'page'], payload.page)
        .setIn(['myInvoices', 'unpaid', 'nextPage'], payload.next_page)
        .setIn(
          ['myInvoices', 'unpaid', 'allUuids'],
          (payload.results ?? []).map(
            (consumerInvoice) => consumerInvoice.uuid,
          ),
        )
        .merge(
          {
            myInvoices: {
              restByUuid: (
                payload.results || []
              ).reduce<ConsumerInvoiceRESTByUuid>(
                (accumulator, currentConsumerInvoice) => ({
                  ...accumulator,
                  [currentConsumerInvoice.uuid]: currentConsumerInvoice,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [fetchConsumerPaidInvoicesActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['myInvoices', 'paid', 'loading'], payload);
    },
    [fetchConsumerPaidInvoicesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['myInvoices', 'paid', 'error'], payload);
    },
    [fetchConsumerPaidInvoicesActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ConsumerInvoiceREST> },
    ) => {
      return state
        .setIn(['myInvoices', 'paid', 'count'], payload.count)
        .setIn(['myInvoices', 'paid', 'page'], payload.page)
        .setIn(['myInvoices', 'paid', 'nextPage'], payload.next_page)
        .setIn(
          ['myInvoices', 'paid', 'allUuids'],
          (payload.results ?? []).map(
            (consumerInvoice) => consumerInvoice.uuid,
          ),
        )
        .merge(
          {
            myInvoices: {
              restByUuid: (
                payload.results || []
              ).reduce<ConsumerInvoiceRESTByUuid>(
                (accumulator, currentConsumerInvoice) => ({
                  ...accumulator,
                  [currentConsumerInvoice.uuid]: currentConsumerInvoice,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [fetchConsumerRefundedInvoicesActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['myInvoices', 'refunded', 'loading'], payload);
    },
    [fetchConsumerRefundedInvoicesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['myInvoices', 'refunded', 'error'], payload);
    },
    [fetchConsumerRefundedInvoicesActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ConsumerInvoiceREST> },
    ) => {
      return state
        .setIn(['myInvoices', 'refunded', 'count'], payload.count)
        .setIn(['myInvoices', 'refunded', 'page'], payload.page)
        .setIn(['myInvoices', 'refunded', 'nextPage'], payload.next_page)
        .setIn(
          ['myInvoices', 'refunded', 'allUuids'],
          (payload.results ?? []).map(
            (consumerInvoice) => consumerInvoice.uuid,
          ),
        )
        .merge(
          {
            myInvoices: {
              restByUuid: (
                payload.results || []
              ).reduce<ConsumerInvoiceRESTByUuid>(
                (accumulator, currentConsumerInvoice) => ({
                  ...accumulator,
                  [currentConsumerInvoice.uuid]: currentConsumerInvoice,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [fetchConsumerInvoicesComplementaryActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['myInvoices', 'complementary', 'loading'], payload);
    },
    [fetchConsumerInvoicesComplementaryActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['myInvoices', 'complementary', 'error'], payload);
    },
    [fetchConsumerInvoicesComplementaryActions.success.toString()]: (
      state,
      { payload }: { payload: ConsumerInvoiceComplementary[] },
    ) => {
      return state.merge(
        {
          myInvoices: {
            complementary: {
              byUuid: (
                payload || []
              ).reduce<ConsumerInvoiceComplementaryByUuid>(
                (accumulator, currentConsumerInvoice) => ({
                  ...accumulator,
                  [currentConsumerInvoice.uuid]: currentConsumerInvoice,
                }),
                {},
              ),
            },
          },
        },
        { deep: true },
      );
    },
    [fetchConsumerInvoiceByUuidActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['myInvoices', 'byUuid', 'loading'], payload);
    },
    [fetchConsumerInvoiceByUuidActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['myInvoices', 'byUuid', 'error'], payload);
    },
    [fetchConsumerInvoiceByUuidActions.success.toString()]: (
      state,
      { payload }: { payload: ConsumerInvoiceREST },
    ) => {
      return state.merge(
        {
          myInvoices: {
            restByUuid: {
              [payload.uuid]: payload,
            },
          },
        },
        { deep: true },
      );
    },
    [fetchConsumerGuestNumberEligibleByOfferBulk.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'elligibleGuestNumberByOffer', 'loading'],
        payload,
      );
    },
    [fetchConsumerGuestNumberEligibleByOfferBulk.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'elligibleGuestNumberByOffer', 'error'],
        payload,
      );
    },
    [fetchConsumerGuestNumberEligibleByOfferBulk.success.toString()]: (
      state,
      { payload }: { payload: Record<number, number> },
    ) => {
      return state.setIn(
        ['myBookings', 'elligibleGuestNumberByOffer', 'byOfferId'],
        payload,
      );
    },
    [fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.isLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['myBookings', 'waitlistPositionByOffer', 'loading'],
          payload,
        );
      },
    [fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'waitlistPositionByOffer', 'error'],
        payload,
      );
    },
    [fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.success.toString()]:
      (state, { payload }: { payload: OfferStatusWaitingListPosition[] }) => {
        return state.merge(
          {
            myBookings: {
              waitlistPositionByOffer: {
                byOfferId: (payload ?? []).reduce(
                  (accumulator, currentPosition) => ({
                    ...accumulator,
                    [currentPosition.id]: currentPosition,
                  }),
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
      },

    //Marketing preferences
    [fetchMyFranchiseMarketingPreferencesActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myFranchiseMarketingPreferences', 'companyPreferences', 'loading'],
        payload,
      );
    },
    [fetchMyFranchiseMarketingPreferencesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myFranchiseMarketingPreferences', 'companyPreferences', 'error'],
        payload,
      );
    },
    [fetchMyFranchiseMarketingPreferencesActions.success.toString()]: (
      state,
      { payload }: { payload: MarketingPreferenceData[] },
    ) => {
      return state.setIn(
        [
          'myFranchiseMarketingPreferences',
          'companyPreferences',
          'preferences',
        ],
        payload,
      );
    },
    [updateMyFranchiseMarketingPreferencesActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myFranchiseMarketingPreferences', 'update', 'loading'],
        payload,
      );
    },
    [updateMyFranchiseMarketingPreferencesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myFranchiseMarketingPreferences', 'update', 'error'],
        payload,
      );
    },
    [checkFranchiseMarketingPreferencesEligibilityActions.isLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['myFranchiseMarketingPreferences', 'eligibility', 'loading'],
          payload,
        );
      },
    [checkFranchiseMarketingPreferencesEligibilityActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state
        .setIn(
          ['myFranchiseMarketingPreferences', 'eligibility', 'error'],
          payload,
        )
        .setIn(
          ['myFranchiseMarketingPreferences', 'eligibility', 'eligible'],
          false,
        );
    },
    [checkFranchiseMarketingPreferencesEligibilityActions.success.toString()]: (
      state,
    ) => {
      return state.setIn(
        ['myFranchiseMarketingPreferences', 'eligibility', 'eligible'],
        true,
      );
    },
  },
  initialState,
);
