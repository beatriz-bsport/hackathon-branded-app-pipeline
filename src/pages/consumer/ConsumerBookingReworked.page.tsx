import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import uniq from 'lodash/uniq';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import WidgetUtils from '#libs/widget/WidgetUtils';
import { urlToMarketplaceSessionTab } from '#libs/marketplace/utils/navigation';

import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#libs/group-offer/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#libs/consumer-payment-pack/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import {
  fetchMyPastBookingAsMember as fetchMyPastBookingAsMemberAction,
  fetchMyFutureBookingAsMember as fetchMyFutureBookingAsMemberAction,
  fetchMyPastBookingWorkshopAsMember as fetchMyPastBookingWorkshopAsMemberAction,
  fetchMyFutureBookingWorkshopAsMember as fetchMyFutureBookingWorkshopAsMemberAction,
  cancelBookingAsMember as cancelBookingAsMemberAction,
} from '#libs/consumer-space/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import { fetchRoomBlueprints as fetchRoomBlueprintsAction } from '#libs/spot-scheduling/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';

import { getTheme } from '#libs/theme/selectors';
import { getMembership } from '#libs/membership/selectors';
import {
  getMyPastBookingsState,
  getMyFutureBookingsState,
  getMyPastBookingsList,
  getMyFutureBookingsList,
  getMyPastBookingsWorkshopState,
  getMyPastBookingsWorkshopList,
  getMyFutureBookingsWorkshopState,
  getMyFutureBookingsWorkshopList,
  getConsumerBookingsLoading,
  getRelatedConsumerBookingsInGroup,
} from '#libs/consumer-space/selectors';

import ConsumerBookingPageReworked from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingPageReworked';

import type { BookingREST } from '#libs/booking/types';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';
import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';

type OwnProps = {};
type ParamsProps = {
  companyId: number;
};

type OwnAndConnectedProps = OwnProps &
  ParamsProps &
  ConnectedProps<typeof connector>;

type Props = {
  // Keeping for typing only
  bookings: BookingREST[];
  fetchBookingList: (member: number, page: number, page_size: number) => void;
  goToCalendar: (companyName: string, companyId: number) => void;
} & WithHandlerType<typeof mapWithHandlers> &
  OwnAndConnectedProps;

export class ConsumerBooking extends React.Component<Props> {
  componentDidMount() {
    this.fetchPastBookings();
    this.fetchFutureBookings();
  }

  fetchAssociatedBookingsObjects = (bookings: BookingREST[]) => {
    const bookingsOfferList = uniq(bookings.map((booking) => booking.offer));
    const bookingsCoachList = uniq(bookings.map((booking) => booking.coach));
    const bookingsCoachOverrideList = uniq(
      bookings.map((booking) => booking.coach_override),
    );
    const bookingsLevelList = uniq(bookings.map((booking) => booking.level));
    const bookingsMetaActivityList = uniq(
      bookings.map((booking) => booking.meta_activity),
    );
    const bookingsEstablishmentList = uniq(
      bookings.map((booking) => booking.establishment),
    );
    const bookingsConsumerPackList = uniq(
      bookings.map((booking) => booking.consumer_payment_pack),
    );
    this.props.fetchOfferBulk(bookingsOfferList, {
      onSuccess: () => {
        this.props.fetchRoomBlueprints({
          establishment__in: bookingsEstablishmentList,
        });
      },
    });
    this.props.fetchCoachBulk([
      ...bookingsCoachList,
      ...bookingsCoachOverrideList,
    ]);
    // @ts-expect-error
    this.props.fetchLevelList(bookingsLevelList);
    this.props.fetchMetaActivityBulk(bookingsMetaActivityList);
    this.props.fetchEstablishmentBulk(bookingsEstablishmentList);
    this.props.retrieveConsumerPackBulk(bookingsConsumerPackList, {
      onSuccess: (consumerPackList) =>
        this.props.fetchPaymentPackBulk(
          uniq(
            consumerPackList.map((consumerPack) => consumerPack.payment_pack),
          ),
        ),
    });
  };

  handleBookASessionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSessionTab(
      this.props.marketplaceSettings?.config,
      this.props.theme.company_name,
      this.props.theme.company.toString(),
    );
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      this.props.push(marketplaceTabPath);
    }
  };

  fetchPastBookings = () => {
    !!this.props.membership?.id &&
      this.props.fetchMyPastBookingAsMember(
        { member: this.props.membership.id },
        {
          onSuccess: this.fetchAssociatedBookingsObjects,
        },
      );
  };

  fetchFutureBookings = () => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureBookingAsMember(
        {
          member: this.props.membership.id,
        },
        {
          onSuccess: this.fetchAssociatedBookingsObjects,
        },
      );
  };

  fetchPastBookingsWorkshop = () => {
    !!this.props.membership?.id &&
      this.props.fetchMyPastBookingWorkshopAsMember(
        { member: this.props.membership.id },
        {
          onSuccess: this.fetchAssociatedBookingsObjects,
        },
      );
  };

  fetchFutureBookingsWorkshop = () => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureBookingWorkshopAsMember(
        {
          member: this.props.membership.id,
        },
        {
          onSuccess: this.fetchAssociatedBookingsObjects,
        },
      );
  };

  render() {
    return (
      <ConsumerBookingPageReworked
        cancelBooking={this.props.cancelBookingAsMember}
        fetchFutureBookings={this.fetchFutureBookings}
        fetchFutureBookingsWorkshop={this.fetchFutureBookingsWorkshop}
        fetchPastBookings={this.fetchPastBookings}
        fetchPastBookingsWorkshop={this.fetchPastBookingsWorkshop}
        futureBookingsList={this.props.myFutureBookingsList}
        futureBookingsState={this.props.myFutureBookingsState}
        futureBookingsWorkshopList={this.props.myFutureBookingsWorkshopList}
        futureBookingsWorkshopState={this.props.myFutureBookingsWorkshopState}
        getIsBookingsLoading={this.props.getIsBookingsLoading}
        getRelatedConsumerBookingsInGroup={
          this.props.getRelatedConsumerBookingsInGroup
        }
        handleBookASessionClick={this.handleBookASessionClick}
        pastBookingsList={this.props.myPastBookingsList}
        pastBookingsState={this.props.myPastBookingsState}
        pastBookingsWorkshopList={this.props.myPastBookingsWorkshopList}
        pastBookingsWorkshopState={this.props.myPastBookingsWorkshopState}
        sessionTimeDisplay={this.props.sessionTimeDisplay}
        timezone={this.props.timezone}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { companyId }: OwnProps & ParamsProps) => ({
    companyId: state.theme.theme.company,
    membership: getMembership(state, companyId),
    timezone: state.theme.theme.timezone_name,
    theme: getTheme(state),
    marketplaceSettings: state.marketplace.settings,
    sessionTimeDisplay: state.theme.theme.session_time_display,
    // REWORKED
    myPastBookingsState: getMyPastBookingsState(state),
    myPastBookingsList: getMyPastBookingsList(state),
    myFutureBookingsState: getMyFutureBookingsState(state),
    myFutureBookingsList: getMyFutureBookingsList(state),
    myPastBookingsWorkshopState: getMyPastBookingsWorkshopState(state),
    myPastBookingsWorkshopList: getMyPastBookingsWorkshopList(state),
    myFutureBookingsWorkshopState: getMyFutureBookingsWorkshopState(state),
    myFutureBookingsWorkshopList: getMyFutureBookingsWorkshopList(state),
    getIsBookingsLoading: (selectedTab: BookingTab) =>
      getConsumerBookingsLoading(state, selectedTab),
    getRelatedConsumerBookingsInGroup: (
      groupId: number,
      filterTab: BookingFilterTab,
    ) => getRelatedConsumerBookingsInGroup(state, groupId, filterTab),
  }),
  {
    fetchCoachBulk: fetchCoachBulkAction,
    fetchGroupOffer: fetchGroupOfferAction,
    fetchLevelList: fetchLevelListAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    fetchOfferBulk: fetchOfferBulkAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    push,
    retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    fetchRoomBlueprints: fetchRoomBlueprintsAction,
    // REWORKED
    fetchMyPastBookingAsMember: fetchMyPastBookingAsMemberAction,
    fetchMyFutureBookingAsMember: fetchMyFutureBookingAsMemberAction,
    fetchMyPastBookingWorkshopAsMember:
      fetchMyPastBookingWorkshopAsMemberAction,
    fetchMyFutureBookingWorkshopAsMember:
      fetchMyFutureBookingWorkshopAsMemberAction,
    cancelBookingAsMember: cancelBookingAsMemberAction,
  },
);

const mapWithHandlers = {};
export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connector,
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
)(ConsumerBooking);
