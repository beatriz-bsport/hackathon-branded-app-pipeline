/**
 * THE COMPLETE LIST OF SELECTORS FOR THE CONSUMER SPACE WIDGET
 * ONE SET OF SELECTORS PER PAGE/WIDGET
 */
import { getMembershipByCompanyId } from '../selectors';
import { adaptSelector } from '../../../utils/reduxHelpers';

/* MY BOOKINGS */
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
import { getWaitingListConfigurationData } from 'bsport-saas/src/libs/waiting-list/selectors';

/* MY PASSES */
import {
  getConsumerPassesLoading,
  getConsumerPassesTabDisplay,
  getConsumerPassesTabDisplayLoading,
  getConsumerPassMetadataLoading,
  getMyActiveConsumerPaymentPacksList,
  getMyActiveConsumerPaymentPacksState,
  getMyActivePrivateConsumerPassesList,
  getMyActivePrivateConsumerPassesState,
  getMyActiveUniversalPassesList,
  getMyActiveUniversalPassesState,
  getMyExpiredConsumerPaymentPacksList,
  getMyExpiredConsumerPaymentPacksState,
  getMyExpiredPrivateConsumerPassesList,
  getMyExpiredPrivateConsumerPassesState,
  getMyExpiredUniversalPassesList,
  getMyExpiredUniversalPassesState,
  getMyFutureConsumerPaymentPacksList,
  getMyFutureConsumerPaymentPacksState,
  getMyFuturePrivateConsumerPassesList,
  getMyFuturePrivateConsumerPassesState,
  getMyFutureUniversalPassesList,
  getMyFutureUniversalPassesState,
} from 'bsport-saas/src/libs/consumer-space/selectors';

import {
  getAssetByBlueprintByIdentifier,
  getAssetByIdentifier,
  getSpotTypesOfCompany,
} from 'bsport-saas/src/libs/spot-scheduling/selector';

import type { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
import type { RootState } from '../../../reducers';
// @ts-expect-error
import type { BookingTab } from 'bsport-saas/src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
// @ts-expect-error
import type { BookingFilterTab } from 'bsport-saas/src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';

type ConsumerSpaceWidgetProps = { companyId: number, theme: CompanyTheme };

/* COMMON */
const consumerSpaceCommonBridgeSelectors = (
  state: RootState,
  { companyId }: ConsumerSpaceWidgetProps,
) => ({
  authenticated: state.bridge.authentication.authenticated,
  authenticationReceived: state.bridge.authentication.hasBeenReceived,
  membership: getMembershipByCompanyId(state, companyId),
});

/* MY BOOKINGS */
const consumerBookingBridgeSelectors = (
  state: RootState,
  { theme }: ConsumerSpaceWidgetProps,
) => ({
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
    adaptSelector(getRelatedConsumerBookingsInGroup)(state, groupId, filterTab),
  myPastBookingsState: adaptSelector(getMyPastBookingsState)(state),
  myPastBookingsList: adaptSelector(getMyPastBookingsList)(state),
  myFutureBookingsState: adaptSelector(getMyFutureBookingsState)(state),
  myFutureBookingsList: adaptSelector(getMyFutureBookingsList)(state),
  myBookingOptionsState: adaptSelector(getMyWaitlistBookingsState)(state),
  myBookingOptionsList: adaptSelector(getMyWaitlistBookingsList)(state),
  myPastPrivateBookingsState: adaptSelector(getMyPastPrivateBookingsState)(
    state,
  ),
  myPastPrivateBookingsList: adaptSelector(getMyPastPrivateBookingsList)(state),
  myFuturePrivateBookingsState: adaptSelector(getMyFuturePrivateBookingsState)(
    state,
  ),
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
  myFutureBookingsWorkshopList: adaptSelector(getMyFutureBookingsWorkshopList)(
    state,
  ),
  myBookingOptionsWorkshopState: adaptSelector(
    getMyWaitlistBookingsWorkshopState,
  )(state),
  myBookingOptionsWorkshopList: adaptSelector(
    getMyWaitlistBookingsWorkshopList,
  )(state),
  waitingListConfiguration: adaptSelector(getWaitingListConfigurationData)(
    state,
  ),
  getOfferElligibleGuestNumber: (offerId: number) =>
    adaptSelector(getConsumerOfferElligibleGuestNumber)(state, offerId),
  getOfferWaitingListPosition: (offerId: number) =>
    adaptSelector(getConsumerOfferBookingOptionPosition)(state, offerId),
});

/* MY PASSES */
const consumerPassBridgeSelectors = (state: RootState) => ({
  consumerPassesTabDisplayLoading: adaptSelector(
    getConsumerPassesTabDisplayLoading,
  )(state),
  consumerPassesLoading: adaptSelector(getConsumerPassesLoading)(state),
  consumerPassesMetadataLoading: adaptSelector(getConsumerPassMetadataLoading)(
    state,
  ),
  consumerPassesTabDisplay: adaptSelector(getConsumerPassesTabDisplay)(state),
  myActiveConsumerPaymentPacksList: adaptSelector(
    getMyActiveConsumerPaymentPacksList,
  )(state),
  myFutureConsumerPaymentPacksList: adaptSelector(
    getMyFutureConsumerPaymentPacksList,
  )(state),
  myExpiredConsumerPaymentPacksList: adaptSelector(
    getMyExpiredConsumerPaymentPacksList,
  )(state),
  myActivePrivateConsumerPassesList: adaptSelector(
    getMyActivePrivateConsumerPassesList,
  )(state),
  myFuturePrivateConsumerPassesList: adaptSelector(
    getMyFuturePrivateConsumerPassesList,
  )(state),
  myExpiredPrivateConsumerPassesList: adaptSelector(
    getMyExpiredPrivateConsumerPassesList,
  )(state),
  myActiveUniversalPassesList: adaptSelector(getMyActiveUniversalPassesList)(
    state,
  ),
  myFutureUniversalPassesList: adaptSelector(getMyFutureUniversalPassesList)(
    state,
  ),
  myExpiredUniversalPassesList: adaptSelector(getMyExpiredUniversalPassesList)(
    state,
  ),
  myActiveConsumerPaymentPacksState: adaptSelector(
    getMyActiveConsumerPaymentPacksState,
  )(state),
  myFutureConsumerPaymentPacksState: adaptSelector(
    getMyFutureConsumerPaymentPacksState,
  )(state),
  myExpiredConsumerPaymentPacksState: adaptSelector(
    getMyExpiredConsumerPaymentPacksState,
  )(state),
  myActivePrivateConsumerPassesState: adaptSelector(
    getMyActivePrivateConsumerPassesState,
  )(state),
  myFuturePrivateConsumerPassesState: adaptSelector(
    getMyFuturePrivateConsumerPassesState,
  )(state),
  myExpiredPrivateConsumerPassesState: adaptSelector(
    getMyExpiredPrivateConsumerPassesState,
  )(state),
  myActiveUniversalPassesState: adaptSelector(getMyActiveUniversalPassesState)(
    state,
  ),
  myFutureUniversalPassesState: adaptSelector(getMyFutureUniversalPassesState)(
    state,
  ),
  myExpiredUniversalPassesState: adaptSelector(
    getMyExpiredUniversalPassesState,
  )(state),
});

const consumerSubscriptionBridgeSelectors = (state: RootState) => ({});

const consumerProfileBridgeSelectors = (state: RootState) => ({});

const consumerInvoiceBridgeSelectors = (state: RootState) => ({});

// TODO performance - isolate selectors per page
export const consumerSpaceMapStateToWidgetProps = (
  state: RootState,
  props: ConsumerSpaceWidgetProps,
) => ({
  ...consumerSpaceCommonBridgeSelectors(state, props),
  ...consumerBookingBridgeSelectors(state, props),
  ...consumerPassBridgeSelectors(state),
  ...consumerSubscriptionBridgeSelectors(state),
  ...consumerProfileBridgeSelectors(state),
  ...consumerInvoiceBridgeSelectors(state),
});
