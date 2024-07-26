import React from 'react';
import { compose } from 'recompose';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import {
  getConsumerBookingsLoading,
  getRelatedConsumerBookingsInGroup,
  getMyPastBookingsState,
  getMyPastBookingsList,
  getMyFutureBookingsState,
  getMyFutureBookingsList,
  getMyWaitlistBookingsState,
  getMyWaitlistBookingsList,
  getMyPastPrivateBookingsState,
  getMyPastPrivateBookingsList,
  getMyFuturePrivateBookingsState,
  getMyFuturePrivateBookingsList,
  getMyPastBookingsWorkshopState,
  getMyPastBookingsWorkshopList,
  getMyFutureBookingsWorkshopState,
  getMyFutureBookingsWorkshopList,
  getMyWaitlistBookingsWorkshopState,
  getMyWaitlistBookingsWorkshopList,
  getConsumerOfferElligibleGuestNumber,
  getConsumerOfferBookingOptionPosition,
} from 'bsport-saas/src/libs/consumer-space/selectors';

import {
  getWaitingListConfigurationData
} from 'bsport-saas/src/libs/waiting-list/selectors';

import {
  getAssetByBlueprintByIdentifier,
  getAssetByIdentifier,
  getSpotTypesOfCompany,
} from 'bsport-saas/src/libs/spot-scheduling/selector';

import {
  withStyles,
  createStyles,
} from 'bsport-saas/node_modules/@material-ui/core/styles';
import { connect } from 'react-redux';
import { ConsumerBookingWidget } from 'bsport-saas/src/pages/consumer/ConsumerBookingReworked.page';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { BookingTab } from 'bsport-saas/src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from 'bsport-saas/src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
import { resetConsumerState } from 'bsport-saas/src/libs/consumer-space/actions';
import {
  bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction,
  createAuthenticatedBridgeAction,
} from '../libs/bridge/actions';
import { RootState } from '../reducers/index';
import { getMembershipByCompanyId } from '../libs/bridge/selectors';
import { adaptSelector } from '../utils/reduxHelpers';
import withLoginDisconnectedStatus from '../hocs/withLoginDisconnectedStatus.hoc';

type OwnProps = {
  companyId: number,
  theme: CompanyTheme,
  authenticated: boolean,
  authenticationReceived: boolean,
  timezone: string,
};

const ConsumerBookingWidgetStyled = themify(ConsumerBookingWidget);

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  ReturnType<typeof mapStateToWidgetProps> &
  typeof mapDispatchToWidgetProps;

class ConsumerBooking extends React.Component<Props> {
  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchMembershipByCompany(this.props.companyId);
      this.props.bridgeRequestAuthenticationStatus();
    }
  }

  render() {
    return <ConsumerBookingWidgetStyled {...this.props} />;
  }
}

const styles = () =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
  });

const mapStateToWidgetProps = (
  state: RootState,
  { companyId, theme }: { companyId: number, theme: CompanyTheme },
) => {
  return {
    authenticated: state.bridge.authentication.authenticated,
    authenticationReceived: state.bridge.authentication.hasBeenReceived,
    membership: getMembershipByCompanyId(state, companyId),
    spotTypes: adaptSelector(getSpotTypesOfCompany)(state),
    timezone: theme.timezone_name,
    sessionTimeDisplay: theme.session_time_display,
    assetByIdBlueprintByIdentifier: adaptSelector(
      getAssetByBlueprintByIdentifier,
    )(state),
    roomBlueprintsById: state.spotScheduling.roomBlueprint.byId,
    getBlueprintAssetByIdentifier: (blueprintId: number) =>
      adaptSelector(getAssetByIdentifier)(state, blueprintId),
    getIsBookingsLoading: (selectedTab: BookingTab) =>
      adaptSelector(getConsumerBookingsLoading)(state, selectedTab),
    getRelatedConsumerBookingsInGroup: (
      groupId: number,
      filterTab: BookingFilterTab,
    ) =>
      adaptSelector(getRelatedConsumerBookingsInGroup)(
        state,
        groupId,
        filterTab,
      ),
    myPastBookingsState: adaptSelector(getMyPastBookingsState)(state),
    myPastBookingsList: adaptSelector(getMyPastBookingsList)(state),
    myFutureBookingsState: adaptSelector(getMyFutureBookingsState)(state),
    myFutureBookingsList: adaptSelector(getMyFutureBookingsList)(state),
    myBookingOptionsState: adaptSelector(getMyWaitlistBookingsState)(
      state,
    ),
    myBookingOptionsList: adaptSelector(getMyWaitlistBookingsList)(
      state,
    ),
    myPastPrivateBookingsState: adaptSelector(getMyPastPrivateBookingsState)(
      state,
    ),
    myPastPrivateBookingsList: adaptSelector(getMyPastPrivateBookingsList)(
      state,
    ),
    myFuturePrivateBookingsState: adaptSelector(
      getMyFuturePrivateBookingsState,
    )(state),
    myFuturePrivateBookingsList: adaptSelector(getMyFuturePrivateBookingsList)(
      state,
    ),
    myPastBookingsWorkshopState: adaptSelector(getMyPastBookingsWorkshopState)(
      state,
    ),
    myPastBookingsWorkshopList: adaptSelector(getMyPastBookingsWorkshopList)(
      state,
    ),
    myFutureBookingsWorkshopState: adaptSelector(
      getMyFutureBookingsWorkshopState,
    )(state),
    myFutureBookingsWorkshopList: adaptSelector(
      getMyFutureBookingsWorkshopList,
    )(state),
    myBookingOptionsWorkshopState: adaptSelector(
      getMyWaitlistBookingsWorkshopState,
    )(state),
    myBookingOptionsWorkshopList: adaptSelector(
      getMyWaitlistBookingsWorkshopList,
    )(state),
    waitingListConfiguration: adaptSelector(
      getWaitingListConfigurationData,
    )(state),
    getOfferElligibleGuestNumber: (
      offerId: number,
    ) =>
      adaptSelector(
        getConsumerOfferElligibleGuestNumber)(
        state,
        offerId,
      ),
    getOfferWaitingListPosition: (
      offerId: number,
    ) =>
      adaptSelector(
        getConsumerOfferBookingOptionPosition)(
          state,
          offerId
        ),
    };
};

const mapDispatchToWidgetProps = {
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,

  fetchMembershipByCompany: createAuthenticatedBridgeAction(
    'MEMBERSHIP_BY_COMPANY',
  ),
  fetchMyPastBookingAsMember: createAuthenticatedBridgeAction(
    'FETCH_PAST_BOOKING_AS_MEMBER',
  ),
  fetchMyFutureBookingAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_BOOKING_AS_MEMBER',
  ),
  fetchMyBookingOptionAsMember: createAuthenticatedBridgeAction(
    'FETCH_BOOKING_OPTION_AS_MEMBER',
  ),
  fetchMyBookingOptionWorkshopAsMember: createAuthenticatedBridgeAction(
    'FETCH_BOOKING_OPTION_WORKSHOP_AS_MEMBER',
  ),
  fetchMyPastPrivateBookingAsMember: createAuthenticatedBridgeAction(
    'FETCH_PAST_PRIVATE_BOOKING_AS_MEMBER',
  ),
  fetchMyFuturePrivateBookingAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_PRIVATE_BOOKING_AS_MEMBER',
  ),
  fetchMyPastBookingWorkshopAsMember: createAuthenticatedBridgeAction(
    'FETCH_PAST_BOOKING_WORKSHOP_AS_MEMBER',
  ),
  fetchMyFutureBookingWorkshopAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_BOOKING_WORKSHOP_AS_MEMBER',
  ),
  resetConsumerState,
  fetchCoachBulk: createAuthenticatedBridgeAction('FETCH_COACH_BULK'),
  fetchGroupOffer: createAuthenticatedBridgeAction('FETCH_GROUP_OFFER'),
  fetchLevelList: createAuthenticatedBridgeAction('FETCH_LEVEL_LIST'),
  fetchMetaActivityBulk: createAuthenticatedBridgeAction(
    'FETCH_META_ACTIVITY_BULK',
  ),
  fetchOfferBulk: createAuthenticatedBridgeAction('FETCH_OFFER_BULK'),
  fetchEstablishmentBulk: createAuthenticatedBridgeAction(
    'FETCH_ESTABLISHMENT_BULK',
  ),
  retrieveConsumerPackBulk: createAuthenticatedBridgeAction(
    'FETCH_CONSUMER_PACK_BULK',
  ),
  fetchPaymentPackBulk: createAuthenticatedBridgeAction(
    'FETCH_PAYMENT_PACK_BULK',
  ),
  fetchRoomBlueprints: createAuthenticatedBridgeAction('FETCH_ROOM_BLUE_PRINT'),
  fetchSpotForBlueprint: createAuthenticatedBridgeAction(
    'FETCH_SPOT_FOR_BLUEPRINT',
  ),
  fetchAssetForBlueprint: createAuthenticatedBridgeAction(
    'ASSETS_FOR_BLUE_PRINT',
  ),
  fetchPrivateConsumerPassBulk: createAuthenticatedBridgeAction(
    'PRIVATE_CONSUMER_PASS_BULK',
  ),
  fetchPrivateSlotBulk: createAuthenticatedBridgeAction('PRIVATE_SLOT_BULK'),
  fetchPrivateServiceBulk: createAuthenticatedBridgeAction(
    'PRIVATE_SERVICE_BULK',
  ),

  cancelBookingAsMember: createAuthenticatedBridgeAction(
    'CANCEL_BOOKING_AS_MEMBER',
  ),
  cancelPrivateBookingAsMember: createAuthenticatedBridgeAction(
    'CANCEL_PRIVATE_BOOKING_AS_MEMBER',
  ),
  cancelBookingOptionAsMember: createAuthenticatedBridgeAction(
    'CANCEL_BOOKING_OPTION_AS_MEMBER',
  ),
  fetchCompanyWaitlistConfiguration: createAuthenticatedBridgeAction(
    'FETCH_COMPANY_WAITLIST_CONFIGURATION'
  ),
  fetchConsumerGuestNumberEligibleLeftByOfferBulk: createAuthenticatedBridgeAction(
    'FETCH_CONSUMER_GUEST_NUMBER_ELIGIBLE_LEFT_BY_OFFER_BULK'
  ),
  fetchMyBookingOptionsPositionAsMemberByOfferIds: createAuthenticatedBridgeAction(
    'FETCH_BOOKING_POSITION_AS_MEMBER_BY_OFFER_IDS'
  ),  
};

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(mapStateToWidgetProps, mapDispatchToWidgetProps),
  withLoginDisconnectedStatus,
)(ConsumerBooking);
