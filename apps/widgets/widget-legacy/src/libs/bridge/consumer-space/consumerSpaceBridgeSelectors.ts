/**
 * THE COMPLETE LIST OF SELECTORS FOR THE CONSUMER SPACE WIDGET
 * ONE SET OF SELECTORS PER PAGE/WIDGET
 */
import {
  getMemberById,
  getCompanyReferralProgram,
  getMembershipByCompanyId,
  getMemberUsingCompanyId,
  getReferralMemberStatusUsingCompanyId,
} from '../selectors';
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
  getMyActiveSubscriptionsState,
  getMyActiveSubscriptionsList,
  getMyFutureSubscriptionsState,
  getMyFutureSubscriptionsList,
  getMyExpiredSubscriptionsState,
  getMyExpiredSubscriptionsList,
  getMySubscriptionsInvoicesDetailsState,
  getInvoicesComplementaryLoading,
} from '@bsport/saas-legacy/src/libs/consumer-space/selectors';
import { getWaitingListConfigurationData } from '@bsport/saas-legacy/src/libs/waiting-list/selectors';

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
} from '@bsport/saas-legacy/src/libs/consumer-space/selectors';
import {
  getAssetByBlueprintByIdentifier,
  getAssetByIdentifier,
  getSpotTypesOfCompany,
} from '@bsport/saas-legacy/src/libs/spot-scheduling/selector';

/* MY INVOICES */
import {
  getInvoiceComplementaryInformation,
  getInvoicesLoading,
  getPaidInvoices,
  getPaidInvoicesLoading,
  getPaidInvoicesNextPage,
  getRefundedInvoices,
  getRefundedInvoicesLoading,
  getRefundedInvoicesNextPage,
  getUnpaidInvoices,
  getUnpaidInvoicesCount,
  getUnpaidInvoicesLoading,
  getUnpaidInvoicesNextPage,
  getUnpaidInvoicesPage,
} from '@bsport/saas-legacy/src/libs/consumer-space/selectors';
import { getInvoice } from '@bsport/saas-legacy/src/libs/invoice/selectors';

/* MY PROFILE */
import { getSavedPaymentMethodList } from '@bsport/saas-legacy/src/libs/payment/selectors';
import { getConsumerProfileCustomForm } from '@bsport/saas-legacy/src/libs/custom-form/selectors';

import type { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';
import type { RootState } from '../../../reducers';
// @ts-expect-error
import type { BookingTab } from '@bsport/saas-legacy/src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
// @ts-expect-error
import type { BookingFilterTab } from '@bsport/saas-legacy/src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { Membership } from '@bsport/saas-legacy/src/libs/membership/types';

export type ConsumerSpaceWidgetProps = {
  companyId: number,
  theme: CompanyTheme,
  membership: Membership,
};

/* COMMON */
export const consumerSpaceCommonBridgeSelectors = (
  state: RootState,
  { companyId }: ConsumerSpaceWidgetProps,
) => ({
  authenticated: state.bridge.authentication.authenticated,
  authenticationReceived: state.bridge.authentication.hasBeenReceived,
  membership: getMembershipByCompanyId(state, companyId),
  getMember: (memberId: number) => getMemberById(state, memberId),
});

/* MY BOOKINGS */
export const consumerBookingBridgeSelectors = (
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
export const consumerPassBridgeSelectors = (state: RootState) => ({
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

/* MY SUBSCRIPTIONS */
export const consumerSubscriptionBridgeSelectors = (
  state: RootState,
  { theme }: ConsumerSpaceWidgetProps,
) => ({
  activeSubscriptionsState: adaptSelector(getMyActiveSubscriptionsState)(state),
  activeSubscriptionsList: adaptSelector(getMyActiveSubscriptionsList)(state),
  futureSubscriptionsState: adaptSelector(getMyFutureSubscriptionsState)(state),
  futureSubscriptionsList: adaptSelector(getMyFutureSubscriptionsList)(state),
  expiredSubscriptionsState: adaptSelector(getMyExpiredSubscriptionsState)(
    state,
  ),
  expiredSubscriptionsList: adaptSelector(getMyExpiredSubscriptionsList)(state),
  paymentMethodList: adaptSelector(getSavedPaymentMethodList)(state),
  subscriptionsInvoicesDetailsState: adaptSelector(
    getMySubscriptionsInvoicesDetailsState,
  )(state),
  invoiceConfiguration: state.invoice.configuration.result,
  companyTheme: theme,
  marketplaceSettings: state.marketplace.settings,
  paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
  auth: state.auth,
});

/* MY PROFILE */
export const consumerProfileBridgeSelectors = (
  state: RootState,
  { companyId, membership }: ConsumerSpaceWidgetProps,
) => ({
  company: companyId,
  companyThemeLoading: state.theme.loading,
  member: getMemberById(state, membership?.id),
  memberLoading: state.member.loading,
  paymentMethods: adaptSelector(getSavedPaymentMethodList)(state),
  paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  memberCustomForm: getConsumerProfileCustomForm(
    state,
    getMemberUsingCompanyId(state, companyId)?.id,
  ),
  memberError: state.member.error,
  referralProgram: getCompanyReferralProgram(state, companyId),
  referralProgramLoading: state.bridge.referralProgram.loading,
  referralProgramError: state.bridge.referralProgram.error,
  referralMemberStatus: getReferralMemberStatusUsingCompanyId(state, companyId),
  referralMemberStatusLoading: state.bridge.referralMemberStatus.loading,
  referralMemberStatusError: state.bridge.referralMemberStatus.error,
  membershipLoading: state.bridge.membership.loading,
  membershipError: state.bridge.membership.error,
});

/* MY INVOICES */
export const consumerInvoiceBridgeSelectors = (state: RootState) => ({
  loading: adaptSelector(getInvoicesLoading)(state),
  invoiceComplementaryLoading: adaptSelector(getInvoicesComplementaryLoading)(
    state,
  ),
  paidInvoiceList: adaptSelector(getPaidInvoices)(state),
  paidInvoicesLoading: getPaidInvoicesLoading(state),
  paidInvoicesNextPage: getPaidInvoicesNextPage(state),
  refundedInvoiceList: getRefundedInvoices(state),
  refundedInvoicesLoading: getRefundedInvoicesLoading(state),
  refundedInvoicesNextPage: getRefundedInvoicesNextPage(state),
  unpaidInvoiceList: getUnpaidInvoices(state),
  unpaidInvoicesCount: getUnpaidInvoicesCount(state),
  unpaidInvoicesLoading: getUnpaidInvoicesLoading(state),
  unpaidInvoicesNextPage: getUnpaidInvoicesNextPage(state),
  unpaidInvoicesPage: getUnpaidInvoicesPage(state),
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  marketplaceSettings: state.marketplace.settings,
  getInvoice: (uuid: string) => adaptSelector(getInvoice)(state, uuid),
  getInvoiceComplementary: (uuid: string) =>
    getInvoiceComplementaryInformation(state, uuid),
});
