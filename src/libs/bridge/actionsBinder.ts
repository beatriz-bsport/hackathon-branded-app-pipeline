import { privateServiceBulkActions } from 'bsport-saas/src/libs/private-service/actions';
import { coachBulkRetrieveActions } from '../../actions/associatedCoach';
import { retrieveConsumerPackBulkActions } from '../../actions/consumerPack';
import {
  cancelBookingAsMemberActions,
  cancelBookingOptionAsMemberActions,
  cancelPrivateBookingAsMemberActions,
  fetchConsumerGuestNumberEligibleLeftByOfferBulkActions,
  fetchConsumerInvoicesComplementaryActions,
  fetchConsumerPaidInvoicesActions,
  fetchConsumerPassesTabDisplayActions,
  fetchConsumerRefundedInvoicesActions,
  fetchConsumerUnpaidInvoicesActions,
  fetchMyActiveConsumerPaymentPacksAsMemberActions,
  fetchMyActivePrivateConsumerPassesAsMemberActions,
  fetchMyActiveUniversalPassesAsMemberActions,
  fetchMyBookingOptionAsMemberActions,
  fetchMyBookingOptionsPositionAsMemberByOfferIdsActions,
  fetchMyBookingOptionWorkshopAsMemberActions,
  fetchMyExpiredConsumerPaymentPacksAsMemberActions,
  fetchMyExpiredPrivateConsumerPassesAsMemberActions,
  fetchMyExpiredUniversalPassesAsMemberActions,
  fetchMyFutureBookingAsMemberActions,
  fetchMyFutureBookingWorkshopAsMemberActions,
  fetchMyFutureConsumerPaymentPacksAsMemberActions,
  fetchMyFuturePrivateBookingAsMemberActions,
  fetchMyFuturePrivateConsumerPassesAsMemberActions,
  fetchMyFutureUniversalPassesAsMemberActions,
  fetchMyPastBookingAsMemberActions,
  fetchMyPastBookingWorkshopAsMemberActions,
  fetchMyPastPrivateBookingAsMemberActions,
  resetConsumerStateActions,
} from '../../actions/consumerSpace';
import { establishmentBulkRetrieveActions } from '../../actions/establishment';
import { fetchLevelListActions } from '../../actions/level';
import { metaActivityBulkActions } from '../../actions/metaActivity';
import {
  fetchOfferBulkActions,
  fetchGroupOfferActions,
} from '../../actions/offer';
import { fetchPaymentPackBulkActions } from '../../actions/paymentPack';
import { privateConsumerPassBulkActions } from '../../actions/privateConsumerPass';
import {
  privatePassBulkActions,
  privateServiceCompatiblePassListActions,
  privateSlotBulkActions,
} from '../../actions/privateService';
import {
  assetForBlueprintActions,
  fetchRoomBlueprintActions,
  spotForBlueprintActions,
} from '../../actions/spotScheduling';
import { extractPaginatedResponseDataResults } from '../../utils/reduxHelpers';
import { apiCallHandler } from './callHandler';
import {
  retrieveReferralMemberStatusActions,
  retrieveReferralProgramForCompanyActions,
} from '../../actions/referral';
import { retrieveMemberAction } from '../../actions/member';
import { retrieveMembershipByCompanyAction } from '../../actions/membership';
import {
  fetchRelatedMembersNamesByConsumerPaymentPackLinksActions,
  fetchRelatedMembersNamesByPrivateConsumerPassLinksActions,
} from '../../actions/relationship';
import { configurationDetailActions } from '../../actions/company';
import {
  fetchPaymentMethodListActions,
  detachPaymentMethodActions,
} from '../../actions/payment';
import {
  listInvoiceActions,
  retrieveInvoiceActions,
  applyBalanceToInvoiceActions,
} from '../../actions/invoice';

export const actionsBinder = () => {
  apiCallHandler.bindActions(
    'FETCH_PAST_BOOKING_AS_MEMBER',
    fetchMyPastBookingAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_FUTURE_BOOKING_AS_MEMBER',
    fetchMyFutureBookingAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_BOOKING_OPTION_AS_MEMBER',
    fetchMyBookingOptionAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_BOOKING_OPTION_WORKSHOP_AS_MEMBER',
    fetchMyBookingOptionWorkshopAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_PAST_PRIVATE_BOOKING_AS_MEMBER',
    fetchMyPastPrivateBookingAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_FUTURE_PRIVATE_BOOKING_AS_MEMBER',
    fetchMyFuturePrivateBookingAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_PAST_BOOKING_WORKSHOP_AS_MEMBER',
    fetchMyPastBookingWorkshopAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_FUTURE_BOOKING_WORKSHOP_AS_MEMBER',
    fetchMyFutureBookingWorkshopAsMemberActions,
  );

  apiCallHandler.bindActions('FETCH_COACH_BULK', coachBulkRetrieveActions);

  apiCallHandler.bindActions('FETCH_GROUP_OFFER', fetchGroupOfferActions);

  apiCallHandler.bindActions('FETCH_LEVEL_LIST', fetchLevelListActions);

  apiCallHandler.bindActions(
    'FETCH_META_ACTIVITY_BULK',
    metaActivityBulkActions,
  );

  apiCallHandler.bindActions('FETCH_OFFER_BULK', fetchOfferBulkActions, {
    successCallbackExtractFn: extractPaginatedResponseDataResults,
  });

  apiCallHandler.bindActions(
    'FETCH_ESTABLISHMENT_BULK',
    establishmentBulkRetrieveActions,
  );

  apiCallHandler.bindActions(
    'FETCH_CONSUMER_PACK_BULK',
    retrieveConsumerPackBulkActions,
  );

  apiCallHandler.bindActions(
    'FETCH_PAYMENT_PACK_BULK',
    fetchPaymentPackBulkActions,
    {
      successCallbackExtractFn: extractPaginatedResponseDataResults,
    },
  );

  apiCallHandler.bindActions(
    'FETCH_ROOM_BLUE_PRINT',
    fetchRoomBlueprintActions,
    {
      successCallbackExtractFn: extractPaginatedResponseDataResults,
    },
  );

  apiCallHandler.bindActions(
    'FETCH_SPOT_FOR_BLUEPRINT',
    spotForBlueprintActions,
    {
      successCallbackExtractFn: extractPaginatedResponseDataResults,
    },
  );

  apiCallHandler.bindActions(
    'ASSETS_FOR_BLUE_PRINT',
    assetForBlueprintActions,
    {
      successCallbackExtractFn: extractPaginatedResponseDataResults,
    },
  );

  apiCallHandler.bindActions(
    'PRIVATE_CONSUMER_PASS_BULK',
    privateConsumerPassBulkActions,
  );

  apiCallHandler.bindActions('PRIVATE_SLOT_BULK', privateSlotBulkActions);

  apiCallHandler.bindActions('PRIVATE_SERVICE_BULK', privateServiceBulkActions);

  apiCallHandler.bindActions(
    'CANCEL_BOOKING_AS_MEMBER',
    cancelBookingAsMemberActions,
  );

  apiCallHandler.bindActions(
    'CANCEL_PRIVATE_BOOKING_AS_MEMBER',
    cancelPrivateBookingAsMemberActions,
  );

  apiCallHandler.bindActions(
    'CANCEL_BOOKING_OPTION_AS_MEMBER',
    cancelBookingOptionAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_REFERRAL_PROGRAM_BY_COMPANY',
    retrieveReferralProgramForCompanyActions,
  );

  apiCallHandler.bindActions(
    'FETCH_REFERRAL_PROGRAM_MEMBER_STATUS',
    retrieveReferralMemberStatusActions,
  );

  apiCallHandler.bindActions('FETCH_MEMBER_BY_ID', retrieveMemberAction);

  apiCallHandler.bindActions(
    'MEMBERSHIP_BY_COMPANY',
    retrieveMembershipByCompanyAction,
  );

  apiCallHandler.bindActions(
    'FETCH_PASSES_TABS',
    fetchConsumerPassesTabDisplayActions,
  );

  apiCallHandler.bindActions(
    'FETCH_ACTIVE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    fetchMyActiveConsumerPaymentPacksAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_ACTIVE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    fetchMyActivePrivateConsumerPassesAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_ACTIVE_UNIVERSAL_PASSES_AS_MEMBER',
    fetchMyActiveUniversalPassesAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_EXPIRED_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    fetchMyExpiredConsumerPaymentPacksAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_EXPIRED_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    fetchMyExpiredPrivateConsumerPassesAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_EXPIRED_UNIVERSAL_PASS_AS_MEMBER',
    fetchMyExpiredUniversalPassesAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_FUTURE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    fetchMyFutureConsumerPaymentPacksAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_FUTURE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    fetchMyFuturePrivateConsumerPassesAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_FUTURE_UNIVERSAL_PASS_AS_MEMBER',
    fetchMyFutureUniversalPassesAsMemberActions,
  );

  apiCallHandler.bindActions(
    'FETCH_RELATED_MEMBERS_NAMES_BY_CONSUMER_PAYMENT_PACK_LINK',
    fetchRelatedMembersNamesByConsumerPaymentPackLinksActions,
  );

  apiCallHandler.bindActions(
    'FETCH_RELATED_MEMBERS_NAMES_BY_PRIVATE_CONSUMER_PASS_LINK',
    fetchRelatedMembersNamesByPrivateConsumerPassLinksActions,
  );

  apiCallHandler.bindActions('FETCH_PRIVATE_PASS_BULK', privatePassBulkActions);

  apiCallHandler.bindActions(
    'FETCH_PRIVATE_SERVICE_COMPATIBLE_PASS_LIST',
    privateServiceCompatiblePassListActions,
  );

  apiCallHandler.bindActions(
    'FETCH_COMPANY_WAITLIST_CONFIGURATION',
    configurationDetailActions,
  );

  apiCallHandler.bindActions(
    'FETCH_CONSUMER_GUEST_NUMBER_ELIGIBLE_LEFT_BY_OFFER_BULK',
    fetchConsumerGuestNumberEligibleLeftByOfferBulkActions,
  );

  apiCallHandler.bindActions(
    'FETCH_BOOKING_POSITION_AS_MEMBER_BY_OFFER_IDS',
    fetchMyBookingOptionsPositionAsMemberByOfferIdsActions,
  );

  apiCallHandler.bindActions(
    'FETCH_CONSUMER_INVOICES_COMPLEMENTARY',
    fetchConsumerInvoicesComplementaryActions,
  );

  apiCallHandler.bindActions(
    'FETCH_CONSUMER_UNPAID_INVOICES',
    fetchConsumerUnpaidInvoicesActions,
  );

  apiCallHandler.bindActions(
    'FETCH_CONSUMER_PAID_INVOICES',
    fetchConsumerPaidInvoicesActions,
  );

  apiCallHandler.bindActions(
    'FETCH_CONSUMER_REFUNDED_INVOICES',
    fetchConsumerRefundedInvoicesActions,
  );

  // @ts-expect-error This action is custom made for consumer space
  apiCallHandler.bindActions('RESET_CONSUMER_STATE', resetConsumerStateActions);

  apiCallHandler.bindActions(
    'FETCH_PAYMENT_METHOD_LIST',
    fetchPaymentMethodListActions,
  );

  apiCallHandler.bindActions(
    'DETACH_PAYMENT_METHOD',
    detachPaymentMethodActions,
  );

  apiCallHandler.bindActions('FETCH_INVOICE_LIST', listInvoiceActions);

  apiCallHandler.bindActions('FETCH_SPECIFIC_INVOICE', retrieveInvoiceActions);

  apiCallHandler.bindActions(
    'APPLY_BALANCE_TO_INVOICE',
    applyBalanceToInvoiceActions,
  );
};
