import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { urlToMarketplace } from '#libs/marketplace/utils';
import {
  fromConfigToUrl,
  getMarketplaceRoute,
} from '#libs/marketplace/routing-utils';

import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import {
  resetGroupOffer as resetGroupOfferAction,
  fetchGroupOffer as fetchGroupOfferAction,
} from '#libs/group-offer/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsAsConsumer as fetchBookingsAsConsumerAction,
  retrieveBooking,
  fetchSimilarFuturBookingInGroup as fetchSimilarFuturBookingInGroupAction,
} from '#libs/booking/actions';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';
import { fetchPrivateBookings } from '#libs/private-service/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';

import { withCoach, withMetaActivity } from '#libs/offer/selectors';
import { retrieveGroupOffer } from '#libs/group-offer/selectors';
import { withCustomLevel } from '#libs/level/selectors';
import { getConsumerPack } from '#libs/consumer-payment-pack/selectors';
import { getPrivateBookingListBase } from '#libs/private-service/selectors/private-booking';
import { getMembership } from '#libs/membership/selectors';
import {
  getSimilarBookingList,
  getConsumerBookingListWithConsumerPack,
  withOfferFull as withOffer,
} from '#libs/booking/selectors';
import { showVaccinationStatus } from '#libs/custom-form/selectors';

// @ts-expect-error
import ConsumerBookingPageReworked from '#libs/consumer-space/components/reworked/ConsumerBookingPageReworked.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import type { Booking } from '#libs/booking/types';
import type { MarketplaceTabConfig } from '#libs/marketplace/types';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';

type OwnProps = {};
type ParamsProps = {
  companyId: number;
};

type OwnAndConnectedProps = OwnProps &
  ParamsProps &
  ConnectedProps<typeof connector>;

type Props = {
  // Keeping for typing only
  bookings: Array<Booking>;
  fetchBookingList: (member: number, page: number, page_size: number) => void;
  goToCalendar: (companyName: string, companyId: number) => void;
} & WithHandlerType<typeof mapWithHandlers> &
  OwnAndConnectedProps;

export class ConsumerBooking extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateBookings({
      member: this.props.membership.id,
      page: 1,
    });
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

const connector = connect(
  (state: RootState, { companyId }: OwnProps & ParamsProps) => ({
    bookingCount: state.booking.asConsumer.count,
    bookingCurrentPage: state.booking.asConsumer.page,
    bookings: withOffer(getConsumerBookingListWithConsumerPack)(state),
    bookingsLoading: state.booking.asConsumer.loading,
    companyId: state.theme.theme.company,
    consumerPackLoading: state.consumerPaymentPack.loading,
    getPass: (id_: number) => getConsumerPack(state, id_),
    group: retrieveGroupOffer(state),
    marketplaceSettings: state.marketplace.settings,
    membership: getMembership(state, companyId),
    private_booking_list: getPrivateBookingListBase(state),
    privateBookingsLoading: state.privateService.privateBooking.loading,
    showVaccinationStatus: showVaccinationStatus(state),
    similarBookings: withCustomLevel(
      withMetaActivity(withCoach(withOffer(getSimilarBookingList))),
    )(state),
    similarBookingsLoading: state.booking.similar.loading,
    timezone: state.theme.theme.timezone_name,
  }),
  {
    cancelBooking: cancelBookingAction,
    confirmBookingAttendance: confirmBookingAttendanceAction,
    deleteBooking: cancelBookingAction,
    discardBookingAttendance: discardBookingAttendanceAction,
    fetchBookingsAsConsumer: fetchBookingsAsConsumerAction,
    fetchCoachBulk: fetchCoachBulkAction,
    fetchGroupOffer: fetchGroupOfferAction,
    fetchLevelList: fetchLevelListAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    fetchOfferBulk: fetchOfferBulkAction,
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    fetchPrivateBookings,
    fetchSimilarFuturBookingInGroup: fetchSimilarFuturBookingInGroupAction,
    push,
    resetGroupOffer: resetGroupOfferAction,
    retrieveBooking,
    retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
  },
);

const mapWithHandlers = {
  fetchBookingList:
    ({
      fetchBookingsAsConsumer,
      retrieveConsumerPackBulk,
      fetchPaymentPackBulk,
      fetchOfferBulk,
    }: OwnAndConnectedProps) =>
    (member: number, page: number, page_size: number) =>
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
    ({ push: pushAction, marketplaceSettings }: OwnAndConnectedProps) =>
    (companyName: string, companyId: number) => {
      const index =
        marketplaceSettings && marketplaceSettings.config
          ? marketplaceSettings.config.findIndex(
              (tab) => tab.component_type === 'calendar',
            )
          : -1;
      if (index > -1) {
        const tabConfig: MarketplaceTabConfig =
          marketplaceSettings.config[index];
        // @ts-expect-error
        const path = fromConfigToUrl(tabConfig, { tabSelected: index });

        pushAction(getMarketplaceRoute(companyName, companyId, path));
      } else {
        pushAction(urlToMarketplace(companyName, `${companyId}`));
      }
    },
};
export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connector,
  withHandlers(mapWithHandlers),
)(ConsumerBooking);
