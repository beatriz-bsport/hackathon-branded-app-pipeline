/**
 * THE COMPLETE LIST OF ACTIONS FOR THE CONSUMER SPACE WIDGET
 * ONE SET OF ACTIONS PER PAGE/WIDGET
 */
import {
  bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction,
  createAuthenticatedBridgeAction,
  createFreeBridgeAction,
} from '../actions';
import { bridgeRequestLogout } from '../actions';

import { resetConsumerState } from 'bsport-saas/src/libs/consumer-space/actions';
import { fetchSCT } from 'bsport-saas/src/libs/category/actions';

/* COMMON */
export const consumerSpaceCommonBridgeActions = {
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
  resetConsumerState,
  fetchMembershipByCompany: createAuthenticatedBridgeAction(
    'MEMBERSHIP_BY_COMPANY',
  ),
  fetchMember: createAuthenticatedBridgeAction('FETCH_MEMBER_BY_ID'),
  bridgeRequestLogout,
};

/* MY BOOKINGS */
export const consumerBookingBridgeActions = {
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
    'FETCH_COMPANY_WAITLIST_CONFIGURATION',
  ),
  fetchConsumerGuestNumberEligibleLeftByOfferBulk:
    createAuthenticatedBridgeAction(
      'FETCH_CONSUMER_GUEST_NUMBER_ELIGIBLE_LEFT_BY_OFFER_BULK',
    ),
  fetchMyBookingOptionsPositionAsMemberByOfferIds:
    createAuthenticatedBridgeAction(
      'FETCH_BOOKING_POSITION_AS_MEMBER_BY_OFFER_IDS',
    ),
};

/* MY PASSES */
export const consumerPassBridgeActions = {
  fetchSCTs: fetchSCT,
  fetchPaymentPackBulk: createAuthenticatedBridgeAction(
    'FETCH_PAYMENT_PACK_BULK',
  ),
  fetchEstablishmentBulk: createAuthenticatedBridgeAction(
    'FETCH_ESTABLISHMENT_BULK',
  ),
  fetchMetaActivityBulk: createAuthenticatedBridgeAction(
    'FETCH_META_ACTIVITY_BULK',
  ),
  fetchRelatedMembersNamesByConsumerPaymentPackLinks:
    createAuthenticatedBridgeAction(
      'FETCH_RELATED_MEMBERS_NAMES_BY_CONSUMER_PAYMENT_PACK_LINK',
    ),
  fetchRelatedMembersNamesByPrivateConsumerPassLinks:
    createAuthenticatedBridgeAction(
      'FETCH_RELATED_MEMBERS_NAMES_BY_PRIVATE_CONSUMER_PASS_LINK',
    ),
  fetchPrivatePassBulk: createAuthenticatedBridgeAction(
    'FETCH_PRIVATE_PASS_BULK',
  ),
  fetchPrivateServiceBulk: createAuthenticatedBridgeAction(
    'PRIVATE_SERVICE_BULK',
  ),
  fetchPrivateServiceCompatiblePassList: createAuthenticatedBridgeAction(
    'FETCH_PRIVATE_SERVICE_COMPATIBLE_PASS_LIST',
  ),
  fetchMyPassesTabs: createAuthenticatedBridgeAction('FETCH_PASSES_TABS'),
  fetchMyActiveConsumerPaymentPacksAsMember: createAuthenticatedBridgeAction(
    'FETCH_ACTIVE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
  ),
  fetchMyActivePrivateConsumerPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_ACTIVE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
  ),
  fetchMyActiveUniversalPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_ACTIVE_UNIVERSAL_PASSES_AS_MEMBER',
  ),
  fetchMyExpiredConsumerPaymentPacksAsMember: createAuthenticatedBridgeAction(
    'FETCH_EXPIRED_CONSUMER_PAYMENT_PACK_AS_MEMBER',
  ),
  fetchMyExpiredPrivateConsumerPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_EXPIRED_PRIVATE_CONSUMER_PASS_AS_MEMBER',
  ),
  fetchMyExpiredUniversalPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_EXPIRED_UNIVERSAL_PASS_AS_MEMBER',
  ),
  fetchMyFutureConsumerPaymentPacksAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
  ),
  fetchMyFuturePrivateConsumerPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
  ),
  fetchMyFutureUniversalPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_UNIVERSAL_PASS_AS_MEMBER',
  ),
};

/* MY SUBSCRIPTIONS */
export const consumerSubscriptionBridgeActions = {
  fetchPaymentMethodListAction: createAuthenticatedBridgeAction(
    'FETCH_PAYMENT_METHOD_LIST',
  ),
  fetchMyFutureSubscriptionsAsMemberAction: createAuthenticatedBridgeAction(
    'FETCH_MY_FUTURE_SUBSCRIPTIONS_AS_MEMBER',
  ),
  fetchMyExpiredSubscriptionsAsMemberAction: createAuthenticatedBridgeAction(
    'FETCH_MY_EXPIRED_SUBSCRIPTIONS_AS_MEMBER',
  ),
  fetchMyActiveSubscriptionsAsMemberAction: createAuthenticatedBridgeAction(
    'FETCH_MY_ACTIVE_SUBSCRIPTIONS_AS_MEMBER',
  ),
  fetchConsumerSubscriptionInvoicesDetails: createAuthenticatedBridgeAction(
    'FETCH_CONSUMER_SUBSCRIPTION_INVOICES_DETAILS',
  ),
  fetchMySubscriptionAsMemberAction: createAuthenticatedBridgeAction(
    'FETCH_MY_SUBSCRIPTION_AS_MEMBER',
  ),
  fetchInvoiceConfigurationAsMemberAction: createAuthenticatedBridgeAction(
    'FETCH_INVOICE_CONFIGURATION_AS_MEMBER',
  ),
  downloadPDFContractTermsForBillingPlan: createAuthenticatedBridgeAction(
    'DOWNLOAD_PDF_CONTRACT_TERMS_FOR_BILLING_PLAN',
  ),
  switchSubscriptionPaymentMethod: createAuthenticatedBridgeAction(
    'SWITCH_SUBSCRIPTION_PAYMENT_METHOD',
  ),
};

/* MY PROFILE */
export const consumerProfileBridgeActions = {
  fetchPaymentMethodList: createAuthenticatedBridgeAction(
    'FETCH_PAYMENT_METHOD_LIST',
  ),
  detachPaymentMethod: createAuthenticatedBridgeAction('DETACH_PAYMENT_METHOD'),
  fetchCompanyCustomMemberForm: createAuthenticatedBridgeAction(
    'FETCH_COMPANY_CUSTOM_MEMBER_FORM',
  ),
  submitCustomForm: createAuthenticatedBridgeAction('SUBMIT_CUSTOM_FORM'),
  fetchMyUserProfile: createAuthenticatedBridgeAction(
    'RETRIEVE_MY_USER_PROFILE',
  ),
  retrieveReferralProgramForCompany: createFreeBridgeAction(
    'FETCH_REFERRAL_PROGRAM_BY_COMPANY',
  ),
  retrieveReferralMemberStatus: createAuthenticatedBridgeAction(
    'FETCH_REFERRAL_PROGRAM_MEMBER_STATUS',
  ),
};

/* MY INVOICES */
export const consumerInvoiceBridgeActions = {
  fetchConsumerInvoicesComplementary: createAuthenticatedBridgeAction(
    'FETCH_CONSUMER_INVOICES_COMPLEMENTARY',
  ),
  fetchConsumerPaidInvoices: createAuthenticatedBridgeAction(
    'FETCH_CONSUMER_PAID_INVOICES',
  ),
  fetchConsumerRefundedInvoices: createAuthenticatedBridgeAction(
    'FETCH_CONSUMER_REFUNDED_INVOICES',
  ),
  fetchConsumerUnpaidInvoices: createAuthenticatedBridgeAction(
    'FETCH_CONSUMER_UNPAID_INVOICES',
  ),
  fetchInvoiceList: createAuthenticatedBridgeAction('FETCH_INVOICE_LIST'),
  fetchSpecificInvoice: createAuthenticatedBridgeAction(
    'FETCH_SPECIFIC_INVOICE',
  ),
  applyBalanceToInvoiceAction: createAuthenticatedBridgeAction(
    'APPLY_BALANCE_TO_INVOICE',
  ),
  detachPaymentMethodAction: createAuthenticatedBridgeAction(
    'DETACH_PAYMENT_METHOD',
  ),
  fetchPaymentMethodListAction: createAuthenticatedBridgeAction(
    'FETCH_PAYMENT_METHOD_LIST',
  ),
  fetchPaymentGroupStatusAction: createAuthenticatedBridgeAction(
    'FETCH_PAYMENT_GROUP_STATUS',
  ),
  setPaymentStatusActions:
    createAuthenticatedBridgeAction('SET_PAYMENT_STATUS'),
  setBackendProcessingAfterPayment: createAuthenticatedBridgeAction(
    'SET_BACKEND_PROCESSING_AFTER_PAYMENT',
  ),
  getReceiptUrl: createAuthenticatedBridgeAction('GET_INVOICE_RECEIPT_URL'),
};
