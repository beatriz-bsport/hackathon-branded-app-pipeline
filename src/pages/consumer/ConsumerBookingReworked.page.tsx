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
  fetchMyPastPrivateBookingAsMember as fetchMyPastPrivateBookingAsMemberAction,
  fetchMyFuturePrivateBookingAsMember as fetchMyFuturePrivateBookingAsMemberAction,
  fetchMyPastBookingWorkshopAsMember as fetchMyPastBookingWorkshopAsMemberAction,
  fetchMyFutureBookingWorkshopAsMember as fetchMyFutureBookingWorkshopAsMemberAction,
  resetConsumerState as resetConsumerStateAction,
  cancelBookingAsMember as cancelBookingAsMemberAction,
  cancelPrivateBookingAsMember as cancelPrivateBookingAsMemberAction,
} from '#libs/consumer-space/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import {
  fetchRoomBlueprints as fetchRoomBlueprintsAction,
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchSpotForBlueprint as fetchSpotForBlueprintAction,
} from '#libs/spot-scheduling/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';
import {
  fetchPrivateConsumerPassBulk as fetchPrivateConsumerPassBulkAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
} from '#libs/private-service/actions';

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
  getMyPastPrivateBookingsState,
  getMyPastPrivateBookingsList,
  getMyFuturePrivateBookingsState,
  getMyFuturePrivateBookingsList,
} from '#libs/consumer-space/selectors';
import {
  getAssetByBlueprintByIdentifier,
  getAssetByIdentifier,
  getSpotTypesOfCompany,
} from '#libs/spot-scheduling/selector';

import ConsumerBookingPageReworked from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingPageReworked';

import type { BookingREST } from '#libs/booking/types';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';
import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { PrivateBooking } from '#libs/private-service/types';

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

  fetchAssociatedBlueprintObjects = (blueprintId: number) => {
    this.props.fetchAssetForBlueprint({ blueprint: blueprintId });
    this.props.fetchSpotForBlueprint({
      company: this.props.companyId,
      blueprint: blueprintId,
    });
  };

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

  fetchAssociatedPrivateBookingsObjects = (
    privateBookings: PrivateBooking[],
  ) => {
    const privateBookingsCoachList = uniq(
      privateBookings.map(
        (privateBooking) =>
          privateBooking.coach || privateBooking.associated_coach,
      ),
    );
    const privateBookingsEstablishmentList = uniq(
      privateBookings.map(
        (privateBooking) =>
          privateBooking.establishment ||
          privateBooking.associated_establishment,
      ),
    );
    const privateBookingsConsumerPassList = uniq(
      privateBookings.map(
        (privateBooking) => privateBooking.private_consumer_pass,
      ),
    );
    const privateBookingsPrivateServiceList = uniq(
      privateBookings.map((privateBooking) => privateBooking.private_service),
    );
    const privateBookingsPrivateSlotList = uniq(
      privateBookings.map((privateBooking) => privateBooking.private_slot),
    );
    this.props.fetchCoachBulk(privateBookingsCoachList);
    this.props.fetchEstablishmentBulk(privateBookingsEstablishmentList);
    this.props.fetchPrivateConsumerPassBulk(privateBookingsConsumerPassList);
    this.props.fetchPrivateServiceBulk(privateBookingsPrivateServiceList);
    this.props.fetchPrivateSlotBulk(privateBookingsPrivateSlotList);
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

  fetchPastPrivateBookings = () => {
    this.props.fetchMyPastPrivateBookingAsMember(
      {
        member: this.props.membership.id,
        company: this.props.companyId,
      },
      { onSuccess: this.fetchAssociatedPrivateBookingsObjects },
    );
  };

  fetchFuturePrivateBookings = () => {
    this.props.fetchMyFuturePrivateBookingAsMember(
      {
        member: this.props.membership.id,
        company: this.props.companyId,
      },
      { onSuccess: this.fetchAssociatedPrivateBookingsObjects },
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
        cancelPrivateBooking={this.props.cancelPrivateBookingAsMember}
        companyTheme={this.props.theme}
        fetchAssociatedBlueprintObjects={this.fetchAssociatedBlueprintObjects}
        fetchFutureBookings={this.fetchFutureBookings}
        fetchFutureBookingsWorkshop={this.fetchFutureBookingsWorkshop}
        fetchFuturePrivateBookings={this.fetchFuturePrivateBookings}
        fetchPastBookings={this.fetchPastBookings}
        fetchPastBookingsWorkshop={this.fetchPastBookingsWorkshop}
        fetchPastPrivateBookings={this.fetchPastPrivateBookings}
        futureBookingsList={this.props.myFutureBookingsList}
        futureBookingsState={this.props.myFutureBookingsState}
        futureBookingsWorkshopList={this.props.myFutureBookingsWorkshopList}
        futureBookingsWorkshopState={this.props.myFutureBookingsWorkshopState}
        futurePrivateBookingsList={this.props.myFuturePrivateBookingsList}
        futurePrivateBookingsState={this.props.myFuturePrivateBookingsState}
        getIsBookingsLoading={this.props.getIsBookingsLoading}
        getRelatedConsumerBookingsInGroup={
          this.props.getRelatedConsumerBookingsInGroup
        }
        handleBookASessionClick={this.handleBookASessionClick}
        pastBookingsList={this.props.myPastBookingsList}
        pastBookingsState={this.props.myPastBookingsState}
        pastBookingsWorkshopList={this.props.myPastBookingsWorkshopList}
        pastBookingsWorkshopState={this.props.myPastBookingsWorkshopState}
        pastPrivateBookingsList={this.props.myPastPrivateBookingsList}
        pastPrivateBookingsState={this.props.myPastPrivateBookingsState}
        resetConsumerState={this.props.resetConsumerState}
        sessionTimeDisplay={this.props.sessionTimeDisplay}
        spotTypes={this.props.spotTypes}
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
    spotTypes: getSpotTypesOfCompany(state),
    assetByIdBlueprintByIdentifier: getAssetByBlueprintByIdentifier(state),
    roomBlueprintsById: state.spotScheduling.roomBlueprint.byId,
    // REWORKED
    myPastBookingsState: getMyPastBookingsState(state),
    myPastBookingsList: getMyPastBookingsList(state),
    myFutureBookingsState: getMyFutureBookingsState(state),
    myFutureBookingsList: getMyFutureBookingsList(state),
    myPastPrivateBookingsState: getMyPastPrivateBookingsState(state),
    myPastPrivateBookingsList: getMyPastPrivateBookingsList(state),
    myFuturePrivateBookingsState: getMyFuturePrivateBookingsState(state),
    myFuturePrivateBookingsList: getMyFuturePrivateBookingsList(state),
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
    getBlueprintAssetByIdentifier: (blueprintId: number) =>
      getAssetByIdentifier(state, blueprintId),
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
    fetchSpotForBlueprint: fetchSpotForBlueprintAction,
    fetchAssetForBlueprint: fetchAssetForBlueprintAction,
    fetchPrivateConsumerPassBulk: fetchPrivateConsumerPassBulkAction,
    fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
    fetchPrivateServiceBulk: fetchPrivateServiceBulkAction,
    // REWORKED
    fetchMyPastBookingAsMember: fetchMyPastBookingAsMemberAction,
    fetchMyFutureBookingAsMember: fetchMyFutureBookingAsMemberAction,
    resetConsumerState: resetConsumerStateAction,
    fetchMyPastPrivateBookingAsMember: fetchMyPastPrivateBookingAsMemberAction,
    fetchMyFuturePrivateBookingAsMember:
      fetchMyFuturePrivateBookingAsMemberAction,
    fetchMyPastBookingWorkshopAsMember:
      fetchMyPastBookingWorkshopAsMemberAction,
    fetchMyFutureBookingWorkshopAsMember:
      fetchMyFutureBookingWorkshopAsMemberAction,
    cancelBookingAsMember: cancelBookingAsMemberAction,
    cancelPrivateBookingAsMember: cancelPrivateBookingAsMemberAction,
  },
);

const mapWithHandlers = {};
export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connector,
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
)(ConsumerBooking);
