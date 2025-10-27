import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import uniq from 'lodash/uniq';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import { fetchOfferBulk as fetchOfferBulkAction } from '#src/libs/offer/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#src/libs/group-offer/actions';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#src/libs/consumer-payment-pack/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#src/libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import {
  fetchMyPastBookingAsMember as fetchMyPastBookingAsMemberAction,
  fetchMyFutureBookingAsMember as fetchMyFutureBookingAsMemberAction,
  fetchMyBookingOptionAsMember as fetchMyBookingOptionAsMemberAction,
  fetchMyBookingOptionWorkshopAsMember as fetchMyBookingOptionWorkshopAsMemberAction,
  fetchMyPastPrivateBookingAsMember as fetchMyPastPrivateBookingAsMemberAction,
  fetchMyFuturePrivateBookingAsMember as fetchMyFuturePrivateBookingAsMemberAction,
  fetchMyPastBookingWorkshopAsMember as fetchMyPastBookingWorkshopAsMemberAction,
  fetchMyFutureBookingWorkshopAsMember as fetchMyFutureBookingWorkshopAsMemberAction,
  resetConsumerState as resetConsumerStateAction,
  cancelBookingAsMember as cancelBookingAsMemberAction,
  cancelPrivateBookingAsMember as cancelPrivateBookingAsMemberAction,
  cancelBookingOptionAsMember as cancelBookingOptionAsMemberAction,
  fetchConsumerGuestNumberEligibleLeftByOfferBulk as fetchConsumerGuestNumberEligibleLeftByOfferBulkAction,
  fetchMyBookingOptionsPositionAsMemberByOfferIds as fetchMyBookingOptionsPositionAsMemberByOfferIdsAction,
} from '#src/libs/consumer-space/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#src/libs/establishment/actions';
import {
  fetchRoomBlueprints as fetchRoomBlueprintsAction,
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchSpotForBlueprint as fetchSpotForBlueprintAction,
} from '#src/libs/spot-scheduling/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import {
  fetchPrivateConsumerPassBulk as fetchPrivateConsumerPassBulkAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
} from '#src/libs/private-service/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';

import { getTheme } from '#src/libs/theme/selectors';
import { getMembership } from '#src/libs/membership/selectors';
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
  getMyWaitlistBookingsState,
  getMyWaitlistBookingsList,
  getMyWaitlistBookingsWorkshopState,
  getMyWaitlistBookingsWorkshopList,
  getConsumerOfferElligibleGuestNumber,
  getConsumerOfferBookingOptionPosition,
} from '#src/libs/consumer-space/selectors';
import {
  getAssetByBlueprintByIdentifier,
  getAssetByIdentifier,
  getSpotTypesOfCompany,
} from '#src/libs/spot-scheduling/selector';

import ConsumerBookingPageReworked from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingPageReworked';

import type { BookingREST } from '#src/libs/booking/types';
import type {
  BookingFilterTab,
  BookingTab,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/types';
import type { PrivateBooking } from '#src/libs/private-service/types';
import type { WaitingListBookingOption } from '#src/libs/waiting-list/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import type { RootState } from '../../reducers';
import type { AddGuestFormValues } from '#src/libs/marketplace/components/@Booking/MarketplaceBookingAddGuestModal';
import { getOfferBookerUrl } from '#src/libs/marketplace/routing-utils';
import { buildUrlParams } from '#src/http';
import Config from '#src/config';
import { fetchCompanyConfiguration as fetchCompanyWaitlistConfigurationAction } from '#src/libs/waiting-list/actions';
import { getWaitingListConfigurationData } from '#src/libs/waiting-list/selectors';
import { getMarketplaceSettingsConfig } from '#src/libs/marketplace/selectors';

import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import { trackMemberProfileViewedEvent } from '#src/events/member-profile/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

type OwnProps = {};
type ParamsProps = {
  companyId: number;
};
type State = {
  isConsumerPacksLoading: boolean;
};

type OwnAndConnectedProps = OwnProps &
  ParamsProps &
  ConnectedProps<typeof connector>;

type Props = OwnAndConnectedProps;

export class ConsumerBooking extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isConsumerPacksLoading: false,
    };
  }

  componentDidMount() {
    this.fetchSoonestBookings();
    this.fetchSoonestPrivateBookings();
    this.fetchSoonestWorkshopBookings();
    this.props.fetchCompanyWaitlistConfiguration(this.props.companyId);
    analyticsClientB2C.track(
      trackMemberProfileViewedEvent({ page_type: 'booking' }),
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps?.membership?.id && !!this.props?.membership?.id) {
      this.fetchSoonestBookings();
      this.fetchSoonestPrivateBookings();
      this.fetchSoonestWorkshopBookings();
    }
  }

  fetchAssociatedBlueprintObjects = (blueprintId: number) => {
    this.props.fetchAssetForBlueprint({ blueprint: blueprintId });
    this.props.fetchSpotForBlueprint({
      company: this.props.companyId,
    });
  };

  /**
   * There's a slight delay between the triggering of onSuccess in retrieveConsumerPackBulk
   * and the setting of the consumer_payment_pack and payment_pack loading states.
   * This leads to a flicker of the skeleton interface. Hence, we require a local state to ensure
   * a more precise representation of the loading process.
   */
  fetchConsumerPacksAndPaymentPacks = (bookingsConsumerPackList: number[]) => {
    this.setState({ isConsumerPacksLoading: true });
    this.props.retrieveConsumerPackBulk(bookingsConsumerPackList, {
      onSuccess: (consumerPackList) =>
        this.props.fetchPaymentPackBulk(
          uniq(
            consumerPackList.map((consumerPack) => consumerPack.payment_pack),
          ),
          {
            onSuccess: () => this.setState({ isConsumerPacksLoading: false }),
          },
        ),
    });
  };

  fetchAssociatedBookingsObjects = (bookings: BookingREST[]) => {
    const bookingsOfferList = uniq(bookings.map((booking) => booking.offer));
    const bookingsCoachList = uniq(bookings.map((booking) => booking.coach));
    const bookingsCoachOverrideList = uniq(
      bookings.map((booking) => booking.coach_override),
    );
    const bookingsLevelList = uniq(
      bookings.map((booking) => booking.custom_level),
    );
    const bookingsMetaActivityList = uniq(
      bookings.map((booking) => booking.meta_activity),
    );
    const bookingsEstablishmentList = uniq(
      bookings.map((booking) => booking.establishment),
    );
    const bookingsConsumerPackList = uniq(
      bookings.map((booking) => booking.consumer_payment_pack),
    );
    this.props.fetchOfferBulk(
      bookingsOfferList,
      {
        onSuccess: () => {
          this.props.fetchRoomBlueprints({
            establishment__in: bookingsEstablishmentList,
          });
        },
      },
      false,
      true,
    );
    this.props.fetchCoachBulk([
      ...bookingsCoachList,
      ...bookingsCoachOverrideList,
    ]);
    bookingsLevelList.length !== 0 &&
      this.props.fetchLevelList({ id__in: bookingsLevelList });
    this.props.fetchMetaActivityBulk(bookingsMetaActivityList);
    this.props.fetchEstablishmentBulk(bookingsEstablishmentList);
    this.fetchConsumerPacksAndPaymentPacks(bookingsConsumerPackList);
  };

  fetchAssociatedBookingOptionsObjects = (
    waitlist: PaginatedResponse<WaitingListBookingOption>,
  ) => {
    const bookingOptionsEstablishmentList = uniq(
      waitlist.results.map((bookingOption) => bookingOption.establishment),
    );
    const bookingOptionsLevelList = uniq(
      waitlist.results.map((bookingOption) => bookingOption.level),
    );
    const bookingOptionsCoachList = uniq(
      waitlist.results.map((bookingOption) => bookingOption.coach),
    );
    const bookingOptionsMetaActivityList = uniq(
      waitlist.results.map((bookingOption) => bookingOption.meta_activity),
    );

    const offerIds = uniq(
      waitlist.results.map((bookingOption) => bookingOption.offer.id),
    );

    this.props.fetchEstablishmentBulk(bookingOptionsEstablishmentList);
    bookingOptionsLevelList.length !== 0 &&
      this.props.fetchLevelList({
        id__in: bookingOptionsLevelList,
      });
    this.props.fetchCoachBulk(bookingOptionsCoachList);
    this.props.fetchMetaActivityBulk(bookingOptionsMetaActivityList);
    offerIds.length !== 0 &&
      this.props.fetchMyBookingOptionsPositionAsMemberByOfferIds(offerIds);
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

  fetchPastBookings = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyPastBookingAsMember(
        { page, member: this.props.membership.id },
        {
          onSuccess: (data) => {
            this.fetchAssociatedBookingsObjects(data.results);
          },
        },
      );
  };

  fetchFutureBookings = (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureBookingAsMember(
        { page, member: this.props.membership.id },
        {
          onSuccess: (data) => {
            this.fetchAssociatedBookingsObjects(data.results);
            this.props.fetchConsumerGuestNumberEligibleLeftByOfferBulk(
              data.results.map((booking) => booking.offer),
            );
            options?.onSuccess && options.onSuccess(data);
          },
          onError: (error) => options?.onError && options.onError(error),
        },
      );
  };

  fetchSoonestBookings = (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureBookingAsMember(
        { page, member: this.props.membership.id },
        {
          onSuccess: (data) => options?.onSuccess?.(data),
          onError: (error) => options?.onError?.(error),
        },
      );
  };

  fetchBookingOptions = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyBookingOptionAsMember(
        {
          page,
          member: this.props.membership.id,
          company: this.props.companyId,
          consumer: this.props.membership.consumer,
        },
        {
          onSuccess: this.fetchAssociatedBookingOptionsObjects,
        },
      );
  };

  fetchBookingOptionsWorkshop = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyBookingOptionWorkshopAsMember(
        {
          page,
          member: this.props.membership.id,
          company: this.props.companyId,
          consumer: this.props.membership.consumer,
        },
        {
          onSuccess: this.fetchAssociatedBookingOptionsObjects,
        },
      );
  };

  fetchPastPrivateBookings = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyPastPrivateBookingAsMember(
        {
          page,
          member: this.props.membership.id,
          company: this.props.companyId,
        },
        {
          onSuccess: (data) =>
            this.fetchAssociatedPrivateBookingsObjects(data.results),
        },
      );
  };

  fetchFuturePrivateBookings = (
    page?: number,
    options?: OptionCallback<PaginatedResponse<PrivateBooking>>,
  ) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFuturePrivateBookingAsMember(
        {
          page,
          member: this.props.membership.id,
          company: this.props.companyId,
        },
        {
          onSuccess: (data) => {
            this.fetchAssociatedPrivateBookingsObjects(data.results);
            options?.onSuccess && options.onSuccess(data);
          },
          onError: (error) => options?.onError && options.onError(error),
        },
      );
  };

  fetchSoonestPrivateBookings = (
    page?: number,
    options?: OptionCallback<PaginatedResponse<PrivateBooking>>,
  ) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFuturePrivateBookingAsMember(
        {
          page,
          member: this.props.membership.id,
          company: this.props.companyId,
        },
        {
          onSuccess: (data) => options?.onSuccess?.(data),
          onError: (error) => options?.onError?.(error),
        },
      );
  };

  fetchPastBookingsWorkshop = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyPastBookingWorkshopAsMember(
        { page, member: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedBookingsObjects(data.results),
        },
      );
  };

  fetchFutureBookingsWorkshop = (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureBookingWorkshopAsMember(
        { page, member: this.props.membership.id },
        {
          onSuccess: (data) => {
            this.fetchAssociatedBookingsObjects(data.results);
            this.props.fetchConsumerGuestNumberEligibleLeftByOfferBulk(
              data.results.map((booking) => booking.offer),
            );
            options?.onSuccess && options.onSuccess(data);
          },
          onError: (error) => options?.onError && options.onError(error),
        },
      );
  };

  fetchSoonestWorkshopBookings = (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureBookingWorkshopAsMember(
        { page, member: this.props.membership.id },
        {
          onSuccess: (data) => options?.onSuccess?.(data),
          onError: (error) => options?.onError?.(error),
        },
      );
  };

  handleBookingForAGuestSubmit = ({
    guestFormValues,
    offerBookedId,
  }: {
    guestFormValues: AddGuestFormValues;
    offerBookedId: number;
  }) => {
    const URL =
      getOfferBookerUrl(this.props.companyId, offerBookedId) +
      buildUrlParams({
        guest_first_name: encodeURIComponent(guestFormValues.firstName),
        ...(guestFormValues.lastName && {
          guest_last_name: encodeURIComponent(guestFormValues.lastName),
        }),
        ...(guestFormValues.email && {
          guest_email: encodeURIComponent(guestFormValues.email),
        }),
        guest_booking: 'true',
      });
    if (
      ![ConsumerSpaceContextEnum.WEB, null].includes(
        WidgetUtils.getConsumerSpaceContext(),
      )
    ) {
      return window.open(`${Config.PUBLIC_URL}${URL}`, '_blank');
    }
    this.props.push(URL);
  };

  render() {
    return (
      <ConsumerBookingPageReworked
        bookingGuestFrequency={this.props.bookingGuestFrequency}
        bookingOptionsList={this.props.myBookingOptionsList}
        bookingOptionsState={this.props.myBookingOptionsState}
        bookingOptionsWorkshopList={this.props.myBookingOptionsWorkshopList}
        bookingOptionsWorkshopState={this.props.myBookingOptionsWorkshopState}
        cancelBooking={this.props.cancelBookingAsMember}
        cancelBookingOption={this.props.cancelBookingOptionAsMember}
        cancelPrivateBooking={this.props.cancelPrivateBookingAsMember}
        companyTheme={this.props.theme}
        fetchAssociatedBlueprintObjects={this.fetchAssociatedBlueprintObjects}
        fetchBookingOptions={this.fetchBookingOptions}
        fetchBookingOptionsWorkshop={this.fetchBookingOptionsWorkshop}
        fetchFutureBookings={this.fetchFutureBookings}
        fetchFutureBookingsWorkshop={this.fetchFutureBookingsWorkshop}
        fetchFuturePrivateBookings={this.fetchFuturePrivateBookings}
        fetchPastBookings={this.fetchPastBookings}
        fetchPastBookingsWorkshop={this.fetchPastBookingsWorkshop}
        fetchPastPrivateBookings={this.fetchPastPrivateBookings}
        fetchSoonestBooking={this.fetchSoonestBookings}
        fetchSoonestPrivateBooking={this.fetchSoonestPrivateBookings}
        fetchSoonestWorkshopBooking={this.fetchSoonestWorkshopBookings}
        futureBookingsList={this.props.myFutureBookingsList}
        futureBookingsState={this.props.myFutureBookingsState}
        futureBookingsWorkshopList={this.props.myFutureBookingsWorkshopList}
        futureBookingsWorkshopState={this.props.myFutureBookingsWorkshopState}
        futurePrivateBookingsList={this.props.myFuturePrivateBookingsList}
        futurePrivateBookingsState={this.props.myFuturePrivateBookingsState}
        getIsBookingsLoading={this.props.getIsBookingsLoading}
        getOfferElligibleGuestNumber={this.props.getOfferElligibleGuestNumber}
        getOfferWaitingListPosition={this.props.getOfferWaitingListPosition}
        getRelatedConsumerBookingsInGroup={
          this.props.getRelatedConsumerBookingsInGroup
        }
        isConsumerPacksLoading={this.state.isConsumerPacksLoading}
        onBookingForAGuestSubmit={this.handleBookingForAGuestSubmit}
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
        waitingListConfiguration={this.props.waitingListConfiguration}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { companyId }: OwnProps & ParamsProps) => ({
    authenticated: state.auth.authenticated,
    companyId: state.theme.theme.company,
    membership: getMembership(state, companyId),
    timezone: state.theme.theme.timezone_name,
    theme: getTheme(state),
    marketplaceSettingsConfig: getMarketplaceSettingsConfig(state),
    sessionTimeDisplay: state.theme.theme.session_time_display,
    bookingGuestFrequency: state.theme.theme.allow_guest_frequency,
    spotTypes: getSpotTypesOfCompany(state),
    assetByIdBlueprintByIdentifier: getAssetByBlueprintByIdentifier(state),
    roomBlueprintsById: state.spotScheduling.roomBlueprint.byId,
    // REWORKED
    myPastBookingsState: getMyPastBookingsState(state),
    myPastBookingsList: getMyPastBookingsList(state),
    myFutureBookingsState: getMyFutureBookingsState(state),
    myFutureBookingsList: getMyFutureBookingsList(state),
    myBookingOptionsState: getMyWaitlistBookingsState(state),
    myBookingOptionsList: getMyWaitlistBookingsList(state),
    myPastPrivateBookingsState: getMyPastPrivateBookingsState(state),
    myPastPrivateBookingsList: getMyPastPrivateBookingsList(state),
    myFuturePrivateBookingsState: getMyFuturePrivateBookingsState(state),
    myFuturePrivateBookingsList: getMyFuturePrivateBookingsList(state),
    myPastBookingsWorkshopState: getMyPastBookingsWorkshopState(state),
    myPastBookingsWorkshopList: getMyPastBookingsWorkshopList(state),
    myFutureBookingsWorkshopState: getMyFutureBookingsWorkshopState(state),
    myFutureBookingsWorkshopList: getMyFutureBookingsWorkshopList(state),
    myBookingOptionsWorkshopState: getMyWaitlistBookingsWorkshopState(state),
    myBookingOptionsWorkshopList: getMyWaitlistBookingsWorkshopList(state),
    getIsBookingsLoading: (selectedTab: BookingTab) =>
      getConsumerBookingsLoading(state, selectedTab),
    getRelatedConsumerBookingsInGroup: (
      groupId: number,
      filterTab: BookingFilterTab,
    ) => getRelatedConsumerBookingsInGroup(state, groupId, filterTab),
    getBlueprintAssetByIdentifier: (blueprintId: number) =>
      getAssetByIdentifier(state, blueprintId),
    getOfferElligibleGuestNumber: (offerId: number) =>
      getConsumerOfferElligibleGuestNumber(state, offerId),
    waitingListConfiguration: getWaitingListConfigurationData(state),
    getOfferWaitingListPosition: (offerId: number) =>
      getConsumerOfferBookingOptionPosition(state, offerId),
  }),
  {
    fetchCoachBulk: fetchCoachBulkAction,
    fetchGroupOffer: fetchGroupOfferAction,
    fetchLevelList: fetchLevelListAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    fetchOfferBulk: fetchOfferBulkAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    push: pushRouter,
    retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    fetchRoomBlueprints: fetchRoomBlueprintsAction,
    fetchSpotForBlueprint: fetchSpotForBlueprintAction,
    fetchAssetForBlueprint: fetchAssetForBlueprintAction,
    fetchPrivateConsumerPassBulk: fetchPrivateConsumerPassBulkAction,
    fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
    fetchPrivateServiceBulk: fetchPrivateServiceBulkAction,
    // GROUP ACTIVITIES BOOKINGS
    fetchMyPastBookingAsMember: fetchMyPastBookingAsMemberAction,
    fetchMyFutureBookingAsMember: fetchMyFutureBookingAsMemberAction,
    fetchMyBookingOptionAsMember: fetchMyBookingOptionAsMemberAction,
    // WORSHOP BOOKINGS
    fetchMyPastBookingWorkshopAsMember:
      fetchMyPastBookingWorkshopAsMemberAction,
    fetchMyFutureBookingWorkshopAsMember:
      fetchMyFutureBookingWorkshopAsMemberAction,
    fetchMyBookingOptionWorkshopAsMember:
      fetchMyBookingOptionWorkshopAsMemberAction,
    // PRIVATE BOOKINGS
    fetchMyPastPrivateBookingAsMember: fetchMyPastPrivateBookingAsMemberAction,
    fetchMyFuturePrivateBookingAsMember:
      fetchMyFuturePrivateBookingAsMemberAction,

    resetConsumerState: resetConsumerStateAction,
    cancelBookingAsMember: cancelBookingAsMemberAction,
    cancelPrivateBookingAsMember: cancelPrivateBookingAsMemberAction,
    cancelBookingOptionAsMember: cancelBookingOptionAsMemberAction,
    fetchConsumerGuestNumberEligibleLeftByOfferBulk:
      fetchConsumerGuestNumberEligibleLeftByOfferBulkAction,
    fetchMyBookingOptionsPositionAsMemberByOfferIds:
      fetchMyBookingOptionsPositionAsMemberByOfferIdsAction,
    fetchCompanyWaitlistConfiguration: fetchCompanyWaitlistConfigurationAction,
  },
);

export const UnconnectedConsumerBookingPage = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerBooking);

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connector,
)(UnconnectedConsumerBookingPage);
