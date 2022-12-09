// @flow
import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsAsConsumer as fetchBookingsAsConsumerAction,
  retrieveBooking,
  fetchSimilarFuturBookingInGroup as fetchSimilarFuturBookingInGroupAction,
} from '../../libs/booking/actions';

import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';

import { getConsumerPack } from '../../libs/consumer-payment-pack/selectors';
import { getPrivateBookingListBase } from '../../libs/private-service/selectors/private-booking';
import { fetchPrivateBookings } from '../../libs/private-service/actions';

import { fetchOfferBulk as fetchOfferBulkAction } from '../../libs/offer/actions';
import { withCoach, withMetaActivity } from '../../libs/offer/selectors';
import { fetchLevelList as fetchLevelListAction } from '../../libs/level/actions';
import { withCustomLevel } from '../../libs/level/selectors';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import {
  resetGroupOffer as resetGroupOfferAction,
  fetchGroupOffer as fetchGroupOfferAction,
} from '../../libs/group-offer/actions';
import { retrieveGroupOffer } from '../../libs/group-offer/selectors';
import {
  getSimilarBookingList,
  getConsumerBookingListWithConsumerPack,
  withOfferFull as withOffer,
} from '../../libs/booking/selectors';
import ConsumerBookingPage from '../../libs/consumer-space/components/ConsumerBookingPage.component';

import type { Membership } from '../membership/types';
import type { Booking } from '../booking/types';
import type { PrivateBooking } from '../private-service/types';
import { urlToMarketplace } from '../../libs/marketplace/utils';
import { RootState } from '../../reducers';
import type { MarketplaceTabConfig } from '../../libs/marketplace/types';
import {
  fromConfigToUrl,
  getMarketplaceRoute,
} from '../../libs/marketplace/routing-utils';
import { showVaccinationStatus } from '../../libs/custom-form/selectors';

type Props = {
  timezone: string,
  membership: Membership,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingsLoading: boolean,
  bookingCurrentPage: number,
  fetchBookingList: (member: number, page: number, page_size: number) => void,
  cancelBooking: (number) => void,

  privateBookingsLoading: boolean,
  private_booking_list: Array<PrivateBooking>,
  fetchPrivateBookings: ({ member: number }) => void,
  goToCalendar: (string, number) => void,
  showVaccinationStatus: boolean,

  similarBookings: Booking[],
  fetchSimilarFuturBookingInGroup: (groupId: number, member: id) => void,
  fetchOfferBulk: (ids: number) => void,
  fetchCoachBulk: (ids: number) => void,
  companyId: number,
  fetchLevelList: ({
    company: number,
  }) => void,
  resetGroupOffer: () => void,
  fetchGroupOffer: (id: number) => void,
  fetchMetaActivityBulk: (ids: number[]) => void,
  group: OffersGroup,
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
      <ConsumerBookingPage
        membership={this.props.membership}
        bookings={this.props.bookings}
        bookingCount={this.props.bookingCount}
        bookingsLoading={this.props.bookingsLoading}
        bookingCurrentPage={this.props.bookingCurrentPage}
        fetchBookingList={this.props.fetchBookingList}
        cancelBooking={this.props.cancelBooking}
        privateBookingsLoading={this.props.privateBookingsLoading}
        private_booking_list={this.props.private_booking_list}
        fetchPrivateBookings={this.props.fetchPrivateBookings}
        goToCalendar={this.props.goToCalendar}
        timezone={this.props.timezone}
        showVaccinationStatus={this.props.showVaccinationStatus}
        similarBookings={this.props.similarBookings}
        fetchSimilarFuturBookingInGroup={
          this.props.fetchSimilarFuturBookingInGroup
        }
        fetchOfferBulk={this.props.fetchOfferBulk}
        fetchCoachBulk={this.props.fetchCoachBulk}
        resetGroupOffer={this.props.resetGroupOffer}
        fetchGroupOffer={this.props.fetchGroupOffer}
        fetchMetaActivityBulk={this.props.fetchMetaActivityBulk}
        group={this.props.group}
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
        fetchBookingsAsConsumer,
        retrieveConsumerPackBulk,
        fetchPaymentPackBulk,
        fetchOfferBulk,
      }) =>
      (member, page, page_size) =>
        fetchBookingsAsConsumer(member, page, page_size, {
          onSuccess: (bookings) => {
            fetchOfferBulk(bookings.map((b) => b.offer).filter((o) => !!o));
            retrieveConsumerPackBulk(
              bookings.map((b) => b.consumer_payment_pack),
              {
                onSuccess: (consumerPacks) =>
                  fetchPaymentPackBulk(
                    consumerPacks.map((cpp) => cpp.payment_pack),
                  ),
              },
            );
          },
        }),
    goToCalendar:
      (props: Props) => (companyName: string, companyId: string) => {
        const index =
          props.marketplaceSettings && props.marketplaceSettings.config
            ? props.marketplaceSettings.config.findIndex(
                (tab) => tab.component_type === 'calendar',
              )
            : -1;
        if (index > -1) {
          const tabConfig: MarketplaceTabConfig =
            props.marketplaceSettings.config[index];
          const path = fromConfigToUrl(tabConfig, { tabSelected: index });

          props.push(getMarketplaceRoute(companyName, props.companyId, path));
        } else {
          props.push(urlToMarketplace(companyName, companyId));
        }
      },
  }),
)(ConsumerBooking);
