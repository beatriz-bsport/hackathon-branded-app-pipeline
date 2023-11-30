import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

// ----- OFFER -----
import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import { withCoach, withMetaActivity } from '#libs/offer/selectors';
import {
  resetGroupOffer as resetGroupOfferAction,
  fetchGroupOffer as fetchGroupOfferAction,
} from '#libs/group-offer/actions';
import { retrieveGroupOffer } from '#libs/group-offer/selectors';
// ----- OFFER -----

// ----- LEVEL
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { withCustomLevel } from '#libs/level/selectors';
// ----- BOOKING -----
import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsAsConsumer as fetchBookingsAsConsumerAction,
  retrieveBooking,
  fetchSimilarFuturBookingInGroup as fetchSimilarFuturBookingInGroupAction,
} from '#libs/booking/actions';

import {
  getSimilarBookingList,
  getConsumerBookingListWithConsumerPack,
  withOfferFull as withOffer,
} from '#libs/booking/selectors';

// ----- BOOKING -----

// ----- PAYMENT-PACK AND CONSUMER-PAYMENT-PACK
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';
import { getConsumerPack } from '#libs/consumer-payment-pack/selectors';

// ----- PRIVATE-BOOKING
import { getPrivateBookingListBase } from '#libs/private-service/selectors/private-booking';
import { fetchPrivateBookings } from '#libs/private-service/actions';

// ---- COACH
import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';

// GENERAL AND UTILS
import { showVaccinationStatus } from '#libs/custom-form/selectors';
import { urlToMarketplace } from '#libs/marketplace/utils';
import {
  fromConfigToUrl,
  getMarketplaceRoute,
} from '#libs/marketplace/routing-utils';

// / ----- COMPONENTS
// @ts-expect-error
import ConsumerBookingPageReworked from '#libs/consumer-space/components/reworked/ConsumerBookingPageReworked.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
// / ----- COMPONENTS

// / ----- TYPES

import type { Membership } from '#libs/membership/types';
import type { Booking } from '#libs/booking/types';
import type { PrivateBooking } from '#libs/private-service/types';
import type { MarketplaceTabConfig } from '#libs/marketplace/types';
import type { OffersGroup } from '#libs/group-offer/types';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';

// ----- TYPES

type Props = {
  timezone: string;
  membership: Membership;
  bookings: Array<Booking>;
  bookingCount: number;
  bookingsLoading: boolean;
  bookingCurrentPage: number;
  fetchBookingList: (member: number, page: number, page_size: number) => void;
  cancelBooking: (id: number) => void;

  privateBookingsLoading: boolean;
  private_booking_list: Array<PrivateBooking>;
  fetchPrivateBookings: ({ member }: { member: number }) => void;
  goToCalendar: (companyName: string, companyId: number) => void;
  showVaccinationStatus: boolean;
  similarBookings: Booking[];
  fetchSimilarFuturBookingInGroup: (
    bookingId: number,
    options: OptionCallback,
  ) => void;
  fetchOfferBulk: (ids: number) => void;
  fetchCoachBulk: (ids: number) => void;
  companyId: number;
  fetchLevelList: ({ company }: { company: number }) => void;
  resetGroupOffer: () => void;
  fetchGroupOffer: (id: number) => void;
  fetchMetaActivityBulk: (ids: number[]) => void;
  group: OffersGroup;
  similarBookingsLoading: boolean;
};

export class ConsumerBooking extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateBookings({ member: this.props.membership.id });
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  }

  render() {
    if (this.props.bookingsLoading && this.props.privateBookingsLoading) {
      return <LinearProgress />;
    }

    return (
      <ConsumerBookingPageReworked
        bookingCount={this.props.bookingCount}
        bookingCurrentPage={this.props.bookingCurrentPage}
        bookings={this.props.bookings}
        bookingsLoading={this.props.bookingsLoading}
        cancelBooking={this.props.cancelBooking}
        fetchBookingList={this.props.fetchBookingList}
        fetchCoachBulk={this.props.fetchCoachBulk}
        fetchGroupOffer={this.props.fetchGroupOffer}
        fetchMetaActivityBulk={this.props.fetchMetaActivityBulk}
        fetchOfferBulk={this.props.fetchOfferBulk}
        fetchPrivateBookings={this.props.fetchPrivateBookings}
        fetchSimilarFuturBookingInGroup={
          this.props.fetchSimilarFuturBookingInGroup
        }
        goToCalendar={this.props.goToCalendar}
        group={this.props.group}
        membership={this.props.membership}
        private_booking_list={this.props.private_booking_list}
        privateBookingsLoading={this.props.privateBookingsLoading}
        resetGroupOffer={this.props.resetGroupOffer}
        showVaccinationStatus={this.props.showVaccinationStatus}
        similarBookings={this.props.similarBookings}
        similarBookingsLoading={this.props.similarBookingsLoading}
        timezone={this.props.timezone}
      />
    );
  }
}

export default compose(
  connect(
    (state: RootState) => ({
      bookings: withOffer(getConsumerBookingListWithConsumerPack)(state),
      bookingCurrentPage: state.booking.asConsumer.page,
      bookingsLoading: state.booking.asConsumer.loading,
      bookingCount: state.booking.asConsumer.count,
      consumerPackLoading: state.consumerPaymentPack.loading,
      getPass: (id_: number) => getConsumerPack(state, id_),
      timezone: state.theme.theme.timezone_name,
      companyId: state.theme.theme.company,

      private_booking_list: getPrivateBookingListBase(state),
      privateBookingsLoading: state.privateService.privateBooking.loading,
      marketplaceSettings: state.marketplace.settings,
      showVaccinationStatus: showVaccinationStatus(state),
      group: retrieveGroupOffer(state),
      similarBookings: withCustomLevel(
        withMetaActivity(withCoach(withOffer(getSimilarBookingList))),
      )(state),
      similarBookingsLoading: state.booking.similar.loading,
    }),
    {
      fetchBookingsAsConsumer: fetchBookingsAsConsumerAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      retrieveBooking,
      cancelBooking: cancelBookingAction,
      fetchPrivateBookings,

      deleteBooking: cancelBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      fetchOfferBulk: fetchOfferBulkAction,
      fetchSimilarFuturBookingInGroup: fetchSimilarFuturBookingInGroupAction,
      fetchLevelList: fetchLevelListAction,
      fetchCoachBulk: fetchCoachBulkAction,
      resetGroupOffer: resetGroupOfferAction,
      fetchGroupOffer: fetchGroupOfferAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      push,
    },
  ),
  withHandlers({
    fetchBookingList:
      ({
        // @ts-expect-error
        fetchBookingsAsConsumer,
        // @ts-expect-error

        retrieveConsumerPackBulk,
        // @ts-expect-error

        fetchPaymentPackBulk,
        fetchOfferBulk,
      }) =>
      // @ts-expect-error

      (member, page, page_size) =>
        fetchBookingsAsConsumer(member, page, page_size, {
          // @ts-expect-error

          onSuccess: (bookings) => {
            // @ts-expect-error

            fetchOfferBulk(bookings.map((b) => b.offer).filter((o) => !!o));
            retrieveConsumerPackBulk(
              // @ts-expect-error

              bookings.map((b) => b.consumer_payment_pack),
              {
                // @ts-expect-error

                onSuccess: (consumerPacks) =>
                  fetchPaymentPackBulk(
                    // @ts-expect-error

                    consumerPacks.map((cpp) => cpp.payment_pack),
                  ),
              },
            );
          },
        }),
    goToCalendar:
      (props: Props) => (companyName: string, companyId: string) => {
        const index =
          // @ts-expect-error

          props.marketplaceSettings && props.marketplaceSettings.config
            ? // @ts-expect-error

              props.marketplaceSettings.config.findIndex(
                // @ts-expect-error

                (tab) => tab.component_type === 'calendar',
              )
            : -1;
        if (index > -1) {
          const tabConfig: MarketplaceTabConfig =
            // @ts-expect-error

            props.marketplaceSettings.config[index];
          // @ts-expect-error

          const path = fromConfigToUrl(tabConfig, { tabSelected: index });
          // @ts-expect-error

          props.push(getMarketplaceRoute(companyName, props.companyId, path));
        } else {
          // @ts-expect-error

          props.push(urlToMarketplace(companyName, companyId));
        }
      },
  }),
)(ConsumerBooking);
